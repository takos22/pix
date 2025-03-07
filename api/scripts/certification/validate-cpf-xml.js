// eslint-disable-next-line n/no-unpublished-import
import { parseXml } from 'libxmljs2';
import { readFile } from 'fs/promises';
import * as url from 'url';
import { logger } from '../../lib/infrastructure/logger.js';

const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

async function main() {
  const xmlPath = process.argv[2];

  logger.info('Starting script validate-cpf-xml');

  logger.trace(`Checking data file...`);
  const generatedCpfXml = await readFile(xmlPath, 'utf8');
  const cpfXsd = await readFile(`${__dirname}../../tests/unit/domain/services/cpf/cpf.xsd`, 'utf8');
  const parsedXmlToExport = parseXml(generatedCpfXml);
  const parsedXsd = parseXml(cpfXsd);

  parsedXmlToExport.validate(parsedXsd);

  if (parsedXmlToExport.validationErrors.length > 0) {
    const set = new Set();
    const extractMessage = ({ message }) =>
      message.replace(/Element '\{urn:cdc:cpf:pc5:schema:1.0.0\}(.*)'/, '$1').replace('\n', '');
    parsedXmlToExport.validationErrors.forEach((error) => set.add(extractMessage(error)));

    set.forEach((errorSet) => logger.error(errorSet));

    logger.warn(`${parsedXmlToExport.validationErrors.length} erreurs dans le fichier`);
  }
  logger.info('✅ ');
}

(async () => {
  try {
    await main();
    logger.s;
  } catch (error) {
    logger.error(error);
    process.exitCode = 1;
  }
})();
