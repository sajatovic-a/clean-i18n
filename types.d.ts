export type Translation = { [key: string]: string | Translation | Array<Translation>};

export type Config = {
  translationPaths: string[];
  filePaths: string[];
  translationKeyPatterns: RegExp[];
  overwriteWithSort: boolean;
  overwriteWithClean: boolean;
}