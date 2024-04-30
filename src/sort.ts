import path from 'path';
import { writeFile, getConfig, sortKeys, findFiles } from './utils';


export const sort = () => {
  const {translationPaths, overwriteWithSort} = getConfig();
  const translationFilePaths = findFiles(translationPaths);
  
  translationFilePaths.forEach((transPath) => {
    const translation = require(path.join(process.cwd(), transPath));
    const sortedTranslation = sortKeys(translation);
    const writePath = path.join(process.cwd(),transPath.replace('.json', overwriteWithSort ? '.json' : '.sorted.json'));
    writeFile(writePath, sortedTranslation);
  });
}
