import { readFile } from "node:fs/promises";
import ProgressBar from "progress";
import axiosOriginal from "axios";
import { parseStringPromise } from "xml2js";
import rateLimit from "axios-rate-limit";

const axios = rateLimit(axiosOriginal.create(), {
  maxRequests: 1,
  perMilliseconds: 1000,
  maxRPS: 1,
});

const baseURL = "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/";

async function fetchArticle(pmid: string) {
  let result;
  try {
    // efetch essentially only supports XML:
    // https://www.ncbi.nlm.nih.gov/books/NBK25499/table/chapter4.T._valid_values_of__retmode_and/?report=objectonly
    const url = `${baseURL}efetch.fcgi?db=pubmed&id=${pmid}&retmode=xml`;
    const response = await axios.get(url);
    result = await parseStringPromise(response.data);
  } catch (error) {
    console.error(`Error fetching details for PMID ${pmid}:`, error);
    throw error;
  }

  // Only process articles, no books or other data
  return result.PubmedArticleSet.PubmedArticle?.[0];
}

async function readPmids(filePath: string): Promise<string[]> {
  try {
    const fileContent = await readFile(filePath, "utf8");
    return fileContent.trim().split(/\r?\n/);
  } catch (error) {
    console.error("Error reading file:", error);
    throw error;
  }
}

export async function fetchArticles(filename: string) {
  const articles: any[] = [];

  const pmids = await readPmids(filename);
  const bar = new ProgressBar(
    "[:bar] :percent ETA :etas | Fetching info for :pmid",
    {
      complete: "█",
      incomplete: " ",
      width: 20,
      total: pmids.length,
    },
  );
  for (const pmid of pmids) {
    bar.tick({
      pmid,
    });
    try {
      const article = await fetchArticle(pmid);
      if (!article) {
        console.error(`PMID ${pmid} probably isn't an article.`);
        continue;
      }
      articles.push(article);
    } catch (e) {
      console.error(`Error retrieving article infos for PMID ${pmid}.`);
    }
  }

  return articles;
}
