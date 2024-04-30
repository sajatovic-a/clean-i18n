import path from 'path';
import { collectKeys, findFiles, getConfig, extractKeys, writeFile, getUsedTranslationKeys, getUsedTranslation, readFile } from "./utils";
import { Translation } from '../types';

export const clean = async () => {
  const {translationPaths, filePaths, translationKeyPatterns, overwriteWithClean} = getConfig();
  if(!translationPaths.length) return;

  const translationFilePaths = findFiles(translationPaths);
  const translations: Translation[] = []
  const transKeys = new Set<string>();

  Promise.all(
    translationFilePaths.map(
      file => readFile(file, content => {
        const translation = JSON.parse(content) as Translation
        translations.push(translation)
        collectKeys(translation, '', transKeys)
      })
    )
  ).then(() => {
    const files = findFiles(filePaths);

    Promise.all(
      files.map(file => readFile(file, content => extractKeys(content, translationKeyPatterns)))
    ).then((results) => {
      const keys = results.reduce((acc, keys) => {
        keys.forEach(key => acc.add(key));
        return acc;
      }, new Set<string>());

      const usedKeys = getUsedTranslationKeys(transKeys, keys)
      translations.forEach((translation, index) => {
        const usedTranslation = getUsedTranslation(translation, usedKeys);
        const writePathUsed = path.join(process.cwd(),translationFilePaths[index].replace('.json', overwriteWithClean ? '.json' : '.clean.json'));
        writeFile(writePathUsed, usedTranslation);
      })

    }).catch(console.error);
  }).catch(console.error);
};
