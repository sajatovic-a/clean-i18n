import { describe, it, expect } from 'vitest';
import { collectKeys, extractKeys, sortKeys } from '../utils';
import { CONFIG } from '../config';

const translationObject = {
  "app": {
    "header": {
      "title": "My Application",
      "welcome": "Welcome, User!"
    },
    "menu": [
      {
        "name": "Home",
        "link": "/home"
      },
      {
        "name": "About",
        "link": "/about"
      },
      {
        "name": "Contact",
        "link": "/contact"
      }
    ],
    "footer": {
      "privacy": "Privacy Policy",
      "copy": "Copyright {{ year }} by someone",
    }
  },
  "success": "Action was successful",
  // "404" and "500" will be treated as numbers by JS engine and as ES6 they will be sorted by engine in ascending order
  "errors": {
    "500": "Internal server error",
    "404": "Page not found",
  },
}

const sortedTranslationObject = {
  "app": {
    "footer": {
      "copy": "Copyright {{ year }} by someone",
      "privacy": "Privacy Policy",
    },
    "header": {
      "title": "My Application",
      "welcome": "Welcome, User!"
    },
    "menu": [
      {
        "link": "/home",
        "name": "Home",
      },
      {
        "link": "/about",
        "name": "About",
      },
      {
        "link": "/contact",
        "name": "Contact",
      }
    ],
  },
  "errors": {
    "404": "Page not found",
    "500": "Internal server error",
  },
  "success": "Action was successful",
}

const translationObjectKeys = [
  'app.header.title',
  'app.header.welcome',
  'app.menu',
  'app.footer.privacy',
  'app.footer.copy',
  'success',
  // for the same reason as above, "404" and "500" will be sorted as numbers and keys will be sorted in ascending order
  'errors.404',
  'errors.500',
];

const componentString = `
import { useTranslation, Trans } from 'react-i18next';

function Component() {
  const { t } = useTranslation();

  const sections = t('app.menu', { returnObjects: true });
  const print = (message) => console.log(message);

  return (
    <div>
      <header>
        <h1>{t(
          'app.header.title'
        )}</h1>
        <button onClick={() => print('message'))}>
      </header>
      <nav>
        <ul>
          {selection.map((key, index) => (
            <li key={index}>
              <a href={key.link}>{key.name}</a>
            </li>
          ))}
        </ul>
      </nav>
      <main>
        <p>
          <Trans i18nKey='success'>
            <strong>Action was successful</strong>
          </Trans>
        </p>
        <p>
          <Trans i18nKey={"errors.500"}>
            Error: <strong>{t('errors.500')}</strong>
          </Trans>
        </p>
      </main>
      <footer>
        <p>{t('app.footer.copy', {year: 2024})}</p>
        <p>
          <Trans i18nKey="app.footer.privacy">
            <a href="/privacy">{t('app.footer.privacy')}</a>
          </Trans>
        </p>
      </footer>
    </div>
  );
}
export default ExampleComponent;
`;

const componentExtractedKeys = [
  'app.menu',
  'app.header.title',
  'success',
  'errors.500',
  'app.footer.copy',
  'app.footer.privacy',
];


describe('sort', () => {
  it('should sort keys', () => {
    expect(JSON.stringify(sortKeys(translationObject))).toEqual(JSON.stringify(sortedTranslationObject));
  });

  it('should not mutate the original object', () => {
    const originalObject = JSON.parse(JSON.stringify(translationObject));
    sortKeys(translationObject);
    expect(JSON.stringify(translationObject)).toEqual(JSON.stringify(originalObject));
  });

  it('should not change already sorted object', () => {
    const alreadySortedObject = JSON.parse(JSON.stringify(sortedTranslationObject));
    expect(JSON.stringify(sortKeys(sortedTranslationObject))).toEqual(JSON.stringify(alreadySortedObject));
  });
});

describe('collect keys', () => {
  it('should collect all keys', () => {
    const keys = new Set<string>();
    collectKeys(translationObject, '', keys);
    expect(JSON.stringify(Array.from(keys))).toEqual(JSON.stringify(translationObjectKeys));
  });

  it('should not collect keys from empty object', () => {
    const keys = new Set<string>();
    collectKeys({}, '', keys);
    expect(JSON.stringify(Array.from(keys))).toEqual(JSON.stringify([]));
  });

  it('should not duplicate keys', () => {
    const keys = new Set<string>();
    collectKeys(translationObject, '', keys);
    collectKeys(translationObject, '', keys);
    expect(JSON.stringify(Array.from(keys))).toEqual(JSON.stringify(translationObjectKeys));
  });
});

describe('extract keys', () => {
  it('should extract keys from component string', () => {
    const translationKeyPatterns = CONFIG.translationKeyPatterns.map((pattern) => new RegExp(pattern, 'g'));
    const keys = extractKeys(componentString, translationKeyPatterns);
    componentExtractedKeys.forEach(key => {
      expect(Array.from(keys)).toContain(key);
    });
  });

  it('should not extract a key from the function whose name finishes with "t"', () => {
    const translationKeyPatterns = CONFIG.translationKeyPatterns.map((pattern) => new RegExp(pattern, 'g'));
    const keys = extractKeys(componentString, translationKeyPatterns);
    expect(Array.from(keys)).not.toContain('message');
  });
});