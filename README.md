# WIP
This is work in progress!

# clean-i18n

`clean-i18n` is a utility library designed to help maintain translation files in your projects. For now it allows you to sort translation keys and remove unused ones, ensuring that your i18n files are clean and up-to-date.

## Features

- **Sorting Translation Keys:** Automatically sorts keys in your translation files for easier management and readability.
- **Cleaning Unused Keys:** Safely removes keys that are not used in your project, reducing clutter and potential confusion.

## Installation

You can install `clean-i18n` using NPX and set it up directly in your project. Run the following command in your project root:

```bash
npx clean-i18n-setup
```

This command adds the necessary configuration file and scripts to your project, integrating `clean-i18n` seamlessly.

## Usage

After installation, you can use `clean-i18n` through the configured scripts or directly via command line. Here’s how you can perform common tasks:

### Sorting Keys

To sort the keys in your translation files, run:

```bash
npm run sort-translation
```
```bash
yarn sort-translation
```

### Cleaning Unused Keys

To remove unused translation keys, execute:

```bash
npm run clean-translation
```
```bash
yarn clean-translation
```

## Configuration

The behavior of `clean-i18n` can be customized via the `clean-i18n-config.json` file. Here are the configuration options:

```json
{
  "translationPaths": [],
  "filePaths": [],
  "translationKeyPatterns": [],
  "overwriteWithSort": false,
  "overwriteWithClean": false
}
```

- **translationPaths:** Path pattern to your translation files.
- **filePaths:** Path pattern to your application files where translation keys are used.
- **translationKeyPatterns:** Regex patterns to fined yours keys.
- **overwriteWithSort:** Flag that indicates should sort command overwrite original translation files or create new .sorted.json file.
- **overwriteWithClean:** Flag that indicates should clean command overwrite original translation files or create new .cleaned.json file.


## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE) file for details.

---