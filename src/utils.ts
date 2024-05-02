import fs from 'fs';
import path from 'path';
import fg from 'fast-glob';

import { Config, Translation } from '../types';
import { CONFIG } from './config';

export function getConfig(): Config {
  const config: Config = Object.create({...CONFIG});
  
  try {
    const configPath = path.join(process.cwd(), '.cleani18nrc.json');
    const fileContent = fs.readFileSync(configPath, 'utf8');
    const userConfig = JSON.parse(fileContent);
    Object.assign(config, userConfig);
  } catch (err) {
    console.error('Error reading the config file:', err);
  }

  if(!config.translationPaths.length){
    console.error('No paths found in the config file');
  }

  config.translationKeyPatterns = config.translationKeyPatterns.map((pattern) => new RegExp(pattern, 'g'));

  return config;
}

export function readFile<T>(file: string, cb: (content: string) => T): Promise<T> { 
  return new Promise<T>((resolve, reject) => {
    fs.readFile(file, {encoding: 'utf8'}, (err, content) => {
      if(err){
        reject({file, err});
      }
      
      resolve(cb(content));
    });
  })}

export function writeFile(writePath: string, content: Translation): void {
  fs.writeFile(writePath, JSON.stringify(content, null, 2), () => {});
}

export function sortKeys(obj: Translation): Translation {
  const sortedObj: Translation = {};

  Object.keys(obj).sort().forEach(key => {
    const value = obj[key];
    if (typeof value === 'object' && !Array.isArray(value)) {
      sortedObj[key] = sortKeys(value as Translation);
    } else if (Array.isArray(value)) {
      sortedObj[key] = value.map(item => sortKeys(item));
    } else {
      sortedObj[key] = value;
    }
  });

  return sortedObj;
}

export function findFiles(filePatterns: string[]): string[] {
  const files = filePatterns.map(pattern => {
    return fg.sync(pattern, { cwd: process.cwd() });
  }).flat();

  return files;
}

export function collectKeys(obj: Translation, prefix: string, keys: Set<string>) {
  if(obj === null || typeof obj !== 'object') return;

  if(Array.isArray(obj)){
      obj.forEach((item, index) => {
          collectKeys(item, `${prefix}[${index}].`, keys);
      });
      return;
  }

  Object.keys(obj).forEach(key => {
      if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
          collectKeys(obj[key] as Translation, `${prefix}${key}.`, keys);
      } else {
          keys.add(`${prefix}${key}`);
      }
  });
}

export function extractKeys(content: string, patterns: RegExp[]) {
  let keysFound = new Set<string>();

  patterns.forEach(pattern => {
    let match;

    while (match = pattern.exec(content)) {
      let matchIndex = 0;

      while(match[matchIndex]) {
        keysFound.add(match[matchIndex].trim());
        matchIndex++;
      }
    }
  });

  return keysFound;
}

export function getUnusedKeys(translationKeys: Set<string>, usedKeys: Set<string>) {
    const transKeysCopy = new Set(translationKeys);
    usedKeys.forEach(key => transKeysCopy.delete(key));

    return transKeysCopy;
}

export function getUsedTranslationKeys(translationKeys: Set<string>, usedKeys: Set<string>) {
  const transKeysCopy = new Set(translationKeys);
  const unusedKeys = getUnusedKeys(translationKeys, usedKeys);
  unusedKeys.forEach(key => transKeysCopy.delete(key));

  return transKeysCopy;
}


export function getUsedTranslation(translation: Translation, usedTranslationKeys: Set<string>, prefix: string = ''): Translation {
  const filteredObj: Translation = {};
  Object.keys(translation).forEach(key => {
      const fullKey = prefix ? `${prefix}.${key}` : key;
      const value = translation[key];

      if (usedTranslationKeys.has(fullKey)) {
          filteredObj[key] = value;
      } else if (typeof value === 'object' && !Array.isArray(value)) {
          const nestedResult = getUsedTranslation(value as Translation, usedTranslationKeys, fullKey);
          if (Object.keys(nestedResult).length > 0) {
              filteredObj[key] = nestedResult;
          }
      } else if (Array.isArray(value)) {
          const arrayResult = value.map(item => getUsedTranslation(item, usedTranslationKeys, fullKey))
                                  .filter(item => Object.keys(item).length > 0);
          if (arrayResult.length > 0) {
              filteredObj[key] = arrayResult;
          }
      }
  });

  return filteredObj;
}