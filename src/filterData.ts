// Parse only the data we need out of the full metadata.
export function filterData(articles: any[]) {
  console.log(`\nPreparing data...`);
  const affiliations: {
    [year: string]: string;
  } = {};
  for (const article of articles) {
    let year = "0";
    try {
      // See "PubDate": https://www.nlm.nih.gov/bsd/licensee/elements_descriptions.html
      year =
        article.MedlineCitation[0].Article[0].Journal[0].JournalIssue[0]
          .PubDate[0].Year[0];
    } catch (e) {
      console.log(
        `Couldn't get the publishing year for PMID ${article.MedlineCitation[0].PMID[0]._}.`,
      );
      continue;
    }

    // Returns author names and affiliation info in a CSV format
    // For data structure - check the output or `PubmedArticle` in the DTD: https://www.ncbi.nlm.nih.gov/books/NBK25499/#_chapter4_Eutilities_DTDs_
    let nextAffiliations;
    try {
      nextAffiliations =
        article.MedlineCitation[0].Article[0].AuthorList[0].Author.flatMap(
          (author: any) =>
            [author.LastName + " " + author.ForeName].concat(
              (author.AffiliationInfo || []).map(
                (affiliationInfo: any) => affiliationInfo.Affiliation[0],
              ),
            ),
        ).join(",") as string;
    } catch (e) {
      console.log(
        `Couldn't get affiliations for PMID ${article.MedlineCitation[0].PMID[0]._}. (Particularly older articles don't have that data.)`,
      );
      continue;
    }

    if (affiliations[year]) {
      affiliations[year] += "@@" + nextAffiliations;
    } else {
      affiliations[year] = nextAffiliations;
    }
  }

  return affiliations;
}
