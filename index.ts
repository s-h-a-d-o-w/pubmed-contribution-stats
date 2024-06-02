import "dotenv/config";

import { main } from "./src/main";
import { Command } from "commander";
import { state } from "./src/state";
import { TargetField } from "./src/enums";

const program = new Command();

program
  .name("pubmed-contribution-stats")
  .description(
    "Put a list of PMIDs from the pubmed search into pmid-set.txt next to this executable.",
  )
  .usage("<Target field> <Threshold> <OpenAI API Key> <GPT Engine>")
  .argument(
    "[Target field]",
    "Ranking will be for this field: country OR organization OR author (default: country)",
    TargetField.Country,
  )
  .argument(
    "[Threshold]",
    "Minimum number of matches required for something to be included in the ranking. (default: 1)",
    1,
  )
  .argument(
    "[OpenAI API Key]",
    "OpenAI API Key (can also be supplied via OPENAI_API_KEY environment variable)",
    process.env.OPENAI_API_KEY,
  )
  .argument(
    "[GPT Engine]",
    "e.g. gpt-4-1106-preview (can also be supplied via GPT_ENGINE environment variable)",
    process.env.GPT_ENGINE,
  )
  .action((targetField, threshold, apiKey, gptEngine) => {
    if (!apiKey || !gptEngine) {
      console.error("Missing arguments. Use `--help` for more info.");
      process.exit(1);
    }

    state.apiKey = apiKey;
    state.gptEngine = gptEngine;
    state.targetField = targetField;
    state.threshold = parseInt(threshold, 10);

    main("pmid-set.txt");
  });

program.parse(process.argv);
