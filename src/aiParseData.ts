import OpenAI from "openai";
import { TargetField } from "./enums";
import { state } from "./state";

const countryMap = {
  España: "Spain",
  FRG: "Germany",
  "Republic of Korea": "Korea",
  "Russian Federation": "Russia",
  "South Korea": "Korea",
  "United Kingdom": "UK",
  US: "USA",
  "United States": "USA",
  "United States of America": "USA",
} as const;

export async function aiParseData(affiliations: string) {
  // console.log("========================================================");
  // console.log("Input: ", affiliations);

  const openai = new OpenAI({
    apiKey: state.apiKey,
  });

  const promptTargetField =
    state.targetField === TargetField.Country
      ? "country"
      : state.targetField === TargetField.Author
        ? "author's"
        : "medical institute/organization";

  const result = await openai.chat.completions.create({
    model: state.gptEngine,
    messages: [
      {
        role: "system",
        content: "You are a concise assistant.",
      },
      {
        role: "user",
        content: `Extract only ${promptTargetField} names from the following data and print them as a comma-separated list suitable for continued processing. From each section delimited by "@@", extract a ${promptTargetField} name only once. DO NOT KEEP ANY "@@"! (So e.g. "foo,bar,bar@@foo,foo,bar" should result in "foo,bar,foo,bar".)
        
        ${affiliations}`,
      },
    ],
    temperature: 0,
    max_tokens: 4000,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
  });

  if (!result) {
    console.log("No result!");
    process.exit(-1);
  }

  // Should essentially never happen
  if (result?.choices[0].finish_reason === "length") {
    console.log("Input provided too many results!");
    process.exit(-1);
  }

  if (!result.choices[0].message.content) {
    return [];
  }

  // console.log("Output: ", result.choices[0].message.content);

  return result.choices[0].message.content
    .replaceAll("@@", ",")
    .split(",")
    .map((element) => element.trim())
    .map((country) =>
      country in countryMap
        ? countryMap[country as keyof typeof countryMap]
        : country,
    );
}
