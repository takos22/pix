import { expect } from '../../../../../test-helper.js';
import { convertTemplateToHtml } from '../../../../../../src/shared/mail/infrastructure/convert-template-to-html.js';
import fs from 'node:fs';
import path from 'node:path';
import url from 'url';

const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

describe('Convert template to html', function () {
  it('returns the html from the template', function () {
    // eslint-disable-next-line no-sync
    const givenTemplate = fs.readFileSync(path.join(__dirname, 'template.mjml'), { encoding: 'utf-8' });
    // eslint-disable-next-line no-sync
    const expectedHtml = fs.readFileSync(path.join(__dirname, 'expected.html'), { encoding: 'utf-8' });

    const convertedHtml = convertTemplateToHtml(givenTemplate);

    expect(convertedHtml.html).equal(expectedHtml);
  });
});
