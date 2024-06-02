import { TargetField } from "./enums";

export const state: {
  apiKey: string;
  gptEngine: string;
  targetField: TargetField;
  threshold: number;
} = {
  // Actual defaults are set by commander (index.ts)
  apiKey: "",
  gptEngine: "",
  targetField: TargetField.Country,
  threshold: 0,
};
