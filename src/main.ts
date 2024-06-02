import { sum } from "lodash";
import { mkdir, writeFile } from "node:fs/promises";
import { aiParseData } from "./aiParseData";
import { chunkData } from "./chunkData";
import { filterData } from "./filterData";
import { fetchArticles } from "./fetchArticles";
import { state } from "./state";

const countOccurrences = (
  input: {
    [year: string]: string[];
  },
  threshold: number,
) => {
  const result: {
    [targetField: string]: {
      [year: string]: number;
    };
  } = {};

  Object.keys(input).forEach((year) => {
    const currentList = input[year];
    currentList.forEach((listElement) => {
      if (!result[listElement]) {
        result[listElement] = {};
      }

      result[listElement][year] =
        year in result[listElement] ? result[listElement][year] + 1 : 1;
    });
  });

  // Remove those matches that have less than threshold number of publications
  Object.keys(result).forEach((targetField) => {
    if (sum(Object.values(result[targetField])) < threshold) {
      delete result[targetField];
    }
  });

  return result;
};

function printRanked(occurrences: {
  [targetField: string]: {
    [year: string]: number;
  };
}) {
  let overallTotal = 0;
  Object.keys(occurrences)
    .sort(
      (a, b) =>
        sum(Object.values(occurrences[b])) - sum(Object.values(occurrences[a])),
    )
    .forEach(
      (name) => {
        const targetTotal = sum(Object.values(occurrences[name]));
        overallTotal += targetTotal;

        const yearData: string[] = [];
        Object.keys(occurrences[name])
          .sort((a, b) => parseInt(b, 10) - parseInt(a, 10))
          .forEach((year) => {
            yearData.push(year + ": " + occurrences[name][year]);
          });
        console.log(`${name}: ${targetTotal} (${yearData.join(", ")})`);
      },
      {} as Record<any, any>,
    );
  console.log("==================================================");
  console.log(
    `Total # of distinct ${state.targetField} mentions: ${overallTotal}`,
  );
}

export const main = async (filename: string) => {
  await mkdir("tmp", { recursive: true });

  // DEBUG - Read from cache
  // const articles: any[] = JSON.parse(
  //   await readFile("tmp/articles.json", "utf-8"),
  // );
  const articles: any[] = await fetchArticles(filename);
  await writeFile(
    "tmp/articles.json",
    JSON.stringify(articles, null, 2),
    "utf-8",
  );

  // // DEBUG - Read from cache
  // const affiliations = JSON.parse(
  //   await readFile("tmp/affiliations.json", "utf-8"),
  // ) as {
  //   [year: string]: string;
  // };
  const affiliations = filterData(articles);
  await writeFile(
    "tmp/affiliations.json",
    JSON.stringify(affiliations, null, 2),
    "utf-8",
  );

  const chunkedAffiliations = chunkData(affiliations);

  const numberOfRequests = Object.keys(chunkedAffiliations).reduce(
    (count, key) => {
      return count + chunkedAffiliations[key].length;
    },
    0,
  );
  if (numberOfRequests > 100) {
    console.log("More than 100 requests to OpenAI would be necessary!");
    return;
  }
  console.log(`\nMaking ${numberOfRequests} requests to OpenAI...\n`);

  // DEBUG - Read from cache
  // const targets: {
  //   [year: string]: string[];
  // } = JSON.parse(await readFile("tmp/targets.json", "utf-8"));
  const targets: {
    [year: string]: string[];
  } = {};
  // OpenAI calls aren't made in parallel since that would require
  // rate limit error handling for tokens per minute.
  for (const key of Object.keys(chunkedAffiliations)) {
    for (const splitAffiliation of chunkedAffiliations[key]) {
      const result = await aiParseData(splitAffiliation);
      targets[key] = targets[key] ? targets[key].concat(result) : result;
    }
  }
  await writeFile(
    "tmp/targets.json",
    JSON.stringify(targets, null, 2),
    "utf-8",
  );

  const occurrences = countOccurrences(targets, state.threshold);

  printRanked(occurrences);
};
