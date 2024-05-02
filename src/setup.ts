import fs from 'fs';
import path from 'path';

export function createConfigFile() {
    const configPath = path.join(process.cwd(), '.cleani18nrc.json');
    if (!fs.existsSync(configPath)) {
        const configTemplate = {
            translationPaths: ["./locales/**/*.json"],
            filePaths: ["./src/**/*.{js,ts,jsx,tsx}"],
        };
        fs.writeFileSync(configPath, JSON.stringify(configTemplate, null, 2));
        console.log('.cleani18nrc.json created successfully.');
    } else {
        console.log('.cleani18nrc.json already exists.');
    }
}

export function updatePackageJson() {
    const packagePath = path.join(process.cwd(), 'package.json');
    const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
    const scripts = packageJson.scripts || {};
    scripts['sort-translation'] = "clean-i18n-sort";
    scripts['clean-translation'] = "clean-i18n-clean";

    packageJson.scripts = scripts;
    fs.writeFileSync(packagePath, JSON.stringify(packageJson, null, 2));
    console.log('Scripts added to package.json successfully.');
}


