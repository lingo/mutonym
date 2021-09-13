export interface Word {
  id?: number;
  score?: number;
  stems: string[];
  meaning: string;
  language: string;
  dictionaryLink: string;
  examples: string[];
  rawStems: string;
  rawMeaning: string;
  rawExamples: string;
}
