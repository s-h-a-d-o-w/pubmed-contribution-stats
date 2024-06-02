This was a quick one-off project for me (I don't work in medical research) but I couldn't find anything like it and at least to me, it seems valuable for research, so I thought it would be worth sharing.

It ranks the number of contributions among a set of papers (list of PMIDs that can be gotten from the pubmed search results) by either country, organization or author. For each paper, each of these (e.g. a certain country) is only counted once.

See an example with different engines that illustrates shortcomings at the bottom.

## Requirements

- ChatGPT API key
- File with a list of PMIDs

## How to use (basic/Windows)

- Grab the latest release and run it with `--help` for details.

## How to use (from source)

Requires Node.js.

- Create a `.env` file with the following keys:
```
OPEN_AI_API_KEY=...
GPT_ENGINE=...
```
- `pnpm install`  # You can of course use npm, yarn or whatever.
- `pnpm start`

## Design Decisions

- Name collisions: Obviously, investigating stats by author name is susceptible to name collisions. Unfortunately, researchers using ORCID IDs to identify themselves is only just establishing itself. I don't see a way that this app could handle this problem.
- Requiring manually generated input: pubmed API results are unfortunately very different compared to the website and I couldn't get complex queries to work properly.
- Using ChatGPT: Affiliation information appears to be a free form string of inconsistent structure/data, making parsing by AI the most reasonable solution.
- Not using a pubmed API key: I didn't need to fetch large amounts of papers for my use case.
- Only papers are processed, no other things such as books.
- On rare occasions, ChatGPT will provide state names instead of country names. Or maybe no country name was provided in the publishing info. Since this seems to happen in <1% of the cases, I decided not to investigate.

## Example

Target is `organization`, threshold `3` - I don't remember the search query for the PMIDs. Shortcoming are that sometimes, a specified department might be picked up instead of the overall organization name. GPT 3.5 and 4o tend to recognize countries as organisations. **The comparison also indicates that different engines exclude *some* data**.

Using `gpt-4-turbo-2024-04-09`:
```
University of Catania: 8 (2022: 1, 2018: 1, 2017: 1, 2016: 1, 2014: 2, 2012: 1, 2011: 1)
Ghent University: 7 (2022: 1, 2021: 1, 2020: 1, 2019: 1, 2018: 1, 2016: 1, 2015: 1)
University of Insubria: 6 (2023: 1, 2022: 1, 2021: 1, 2020: 1, 2016: 1, 2011: 1)
Santa Chiara Regional Hospital: 6 (2021: 1, 2020: 1, 2019: 1, 2017: 1, 2016: 1, 2014: 1)
Azienda Ospedaliera Istituti Clinici di Perfezionamento: 5 (2017: 1, 2015: 1, 2013: 1, 2011: 1, 2010: 1)
Università degli Studi dell'Insubria: 4 (2019: 1, 2018: 1, 2015: 1, 2013: 1)
Department of Urology: 4 (2020: 2, 2013: 2)
Rostov State Medical University: 4 (2023: 1, 2022: 1, 2021: 1, 2020: 1)
Glickman Urological and Kidney Institute: 3 (2016: 1, 2011: 1, 2010: 1)
Tzaneio Hospital: 3 (2023: 1, 2014: 1, 2013: 1)
University of Florence: 3 (2020: 1, 2017: 1, 2014: 1)
ASST-Nord: 3 (2020: 1, 2019: 1, 2018: 1)
Tzaneio General Hospital: 3 (2022: 1, 2020: 1, 2019: 1)
==================================================
Total # of distinct organization mentions: 59
```

Using `gpt-4o-2024-05-13`:
```
Department of Urology: 12 (2020: 3, 2019: 9)
University of Catania: 7 (2022: 1, 2018: 1, 2017: 1, 2016: 1, 2014: 1, 2012: 1, 2011: 1)
Ghent University: 7 (2022: 1, 2021: 1, 2020: 2, 2019: 1, 2018: 1, 2015: 1)
Italy: 7 (2019: 7)
Santa Chiara Regional Hospital: 6 (2021: 1, 2020: 1, 2019: 1, 2017: 1, 2016: 1, 2014: 1)
Russia: 6 (2019: 6)
University of Insubria: 5 (2023: 1, 2022: 1, 2021: 1, 2020: 1, 2011: 1)
Greece: 5 (2019: 5)
Azienda Ospedaliera Istituti Clinici di Perfezionamento: 4 (2017: 1, 2015: 1, 2011: 1, 2010: 1)
University of Florence: 4 (2020: 1, 2017: 1, 2014: 1, 2010: 1)
ASST-Nord: 4 (2021: 1, 2020: 1, 2019: 1, 2018: 1)
Athens: 4 (2019: 4)
Turkey: 4 (2019: 4)
Rostov State Medical University: 4 (2023: 1, 2022: 1, 2021: 1, 2020: 1)
Tzaneio Hospital: 3 (2023: 1, 2019: 1, 2014: 1)
Università degli Studi dell'Insubria: 3 (2019: 1, 2018: 1, 2015: 1)
Manzoni Hospital: 3 (2020: 2, 2018: 1)
Tzaneio General Hospital: 3 (2022: 1, 2020: 1, 2019: 1)
Piraeus: 3 (2019: 3)
PR China: 3 (2019: 3)
China: 3 (2019: 3)
==================================================
Total # of distinct organization mentions: 100
```

Using `gpt-3.5-turbo-16k` (obviously, I would strongly recommend NOT using this):
```
Department of Urology: 41 (2024: 2, 2023: 1, 2021: 7, 2020: 4, 2019: 1, 2018: 3, 2017: 5, 2016: 2, 2015: 6, 2014: 4, 2013: 2, 2011: 4)
Italy: 19 (2019: 8, 2018: 6, 2014: 5)
University of Catania: 11 (2022: 1, 2018: 1, 2017: 3, 2016: 2, 2014: 2, 2012: 1, 2011: 1)
China: 8 (2019: 3, 2018: 4, 2014: 1)
Nice: 7 (2018: 7)
France: 7 (2018: 7)
Trento: 6 (2021: 1, 2019: 1, 2017: 1, 2016: 1, 2014: 1, 2011: 1)
Greece: 6 (2019: 5, 2014: 1)
Santa Chiara Regional Hospital: 6 (2021: 1, 2020: 1, 2019: 1, 2017: 1, 2016: 1, 2014: 1)
Department of Biotechnology and Life Sciences: 6 (2023: 1, 2021: 1, 2020: 1, 2019: 1, 2018: 1, 2016: 1)
Section of Medical and Surgical Sciences: 6 (2023: 1, 2021: 1, 2020: 1, 2019: 1, 2018: 1, 2016: 1)
Russia: 6 (2019: 5, 2018: 1)
Azienda Ospedaliera Istituti Clinici di Perfezionamento: 5 (2017: 1, 2015: 1, 2013: 1, 2011: 1, 2010: 1)
University of Insubria: 5 (2023: 1, 2022: 1, 2021: 1, 2016: 1, 2011: 1)
Athens: 5 (2019: 4, 2011: 1)
Ghent University: 5 (2022: 1, 2021: 1, 2019: 1, 2018: 1, 2016: 1)
Urology Unit: 5 (2023: 2, 2021: 1, 2020: 1, 2018: 1)
University of Florence: 4 (2020: 1, 2017: 1, 2014: 1, 2010: 1)
Italy.: 4 (2011: 4)
The Catholic University of Korea College of Medicine: 4 (2013: 1, 2012: 1, 2011: 2)
Faculty of Medicine: 4 (2023: 2, 2015: 1, 2012: 1)
Urology Department: 4 (2020: 1, 2019: 2, 2013: 1)
Centre Hospitalier Universitaire de Nice: 4 (2018: 4)
Turkey: 4 (2019: 4)
Cleveland Clinic: 3 (2016: 1, 2011: 1, 2010: 1)
USA.: 3 (2011: 3)
Catania: 3 (2014: 2, 2011: 1)
Biomedical Research Division: 3 (2017: 1, 2015: 1, 2013: 1)
Università degli Studi dell'Insubria: 3 (2019: 1, 2018: 1, 2013: 1)
Tzaneio Hospital: 3 (2023: 1, 2014: 1, 2013: 1)
USA: 3 (2018: 2, 2014: 1)
Urology Secondary Care Clinic: 3 (2021: 1, 2016: 1, 2015: 1)
Infectious Disease Division: 3 (2016: 1, 2015: 2)
Winthrop-University Hospital: 3 (2016: 1, 2015: 2)
School of Medicine: 3 (2018: 1, 2016: 1, 2015: 1)
Faculty of Medicine and Medical Center: 3 (2017: 3)
University of Freiburg: 3 (2017: 3)
Canada: 3 (2019: 2, 2018: 1)
Korea: 3 (2018: 3)
Faculty of Medicine and Medical Sciences: 3 (2021: 1, 2019: 1, 2018: 1)
Tzaneio General Hospital: 3 (2022: 1, 2020: 1, 2019: 1)
Piraeus: 3 (2019: 3)
PR China: 3 (2019: 3)
Tzaneion Hospital: 3 (2021: 1, 2019: 2)
Rostov State Medical University: 3 (2023: 1, 2022: 1, 2020: 1)
==================================================
Total # of distinct organization mentions: 245
```
