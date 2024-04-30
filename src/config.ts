import { Config } from "../types";

const TRANSLATION_KEY_PATTERNS = [
  /\bt\s*\(\s*['"]([^'"]+)['"]\s*(,\s*\{[^}]*\}\s*)?\)/,
  /i18nKey=(["']([^"']+)["']|\{'([^'}]+)'\})/
];

export const CONFIG: Config = {
  translationPaths: [],
  filePaths: [],
  translationKeyPatterns: [...TRANSLATION_KEY_PATTERNS],
  overwriteWithSort: false,
  overwriteWithClean: false,
}