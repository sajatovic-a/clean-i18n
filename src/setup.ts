import fs from 'fs';
import path from 'path';

export function createConfigFile() {
    const configPath = path.join(process.cwd(), '.i18ncleanerrc.json');
    if (!fs.existsSync(configPath)) {
        const configTemplate = {
            translationPaths: ["./locales/**/*.json"],
            filePaths: ["./src/**/*.{js,ts,jsx,tsx}"],
        };
        fs.writeFileSync(configPath, JSON.stringify(configTemplate, null, 2));
        console.log('.i18ncleanerrc.json created successfully.');
    } else {
        console.log('.i18ncleanerrc.json already exists.');
    }
}

export function updatePackageJson() {
    const packagePath = path.join(process.cwd(), 'package.json');
    const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
    const scripts = packageJson.scripts || {};
    scripts['sort-translation'] = "i18n-cleaner-sort";
    scripts['clean-translation'] = "i18n-cleaner-clean";

    packageJson.scripts = scripts;
    fs.writeFileSync(packagePath, JSON.stringify(packageJson, null, 2));
    console.log('Scripts added to package.json successfully.');
}


