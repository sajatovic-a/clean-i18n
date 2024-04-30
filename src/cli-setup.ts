import { createConfigFile, updatePackageJson } from './setup';

const main = async () => { 
  createConfigFile();
  updatePackageJson();
};

main().catch(console.error);