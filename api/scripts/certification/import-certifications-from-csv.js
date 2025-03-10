import path from 'path';
import fs from 'fs';
import axios from 'axios';
import papa from 'papaparse';
import { disconnect } from '../../db/knex-database-connection.js';
import * as url from 'url';

const CSV_HEADERS = {
  ID: 'ID de certification',
  FIRST_NAME: 'Prenom du candidat',
  LAST_NAME: 'Nom du candidat',
  BIRTHDATE: 'Date de naissance du candidat',
  BIRTHPLACE: 'Lieu de naissance du candidat',
  EXTERNAL_ID: 'Identifiant Externe',
};

function assertFileValidity(err, filePath) {
  if (err && err.code === 'ENOENT') {
    const errorMessage = `File not found ${filePath}`;
    throw new Error(errorMessage);
  }

  const fileExtension = path.extname(filePath);
  if (fileExtension !== '.csv') {
    const errorMessage = `File extension not supported ${fileExtension}`;
    throw new Error(errorMessage);
  }

  return true;
}

function readMyData(data, baseURL, accessToken) {
  // We delete the BOM UTF8 at the beginning of the CSV,
  // otherwise the first element is wrongly parsed.
  const csvRawData = data.toString('utf8').replace(/^\uFEFF/, '');

  const parsedCSVData = papa.parse(csvRawData, { header: true });

  const certifications = convertCSVDataIntoCertifications(parsedCSVData);
  const options = { baseURL, accessToken, certifications };

  saveCertifications(options)
    .then((errorObjects) => {
      _logErrorObjects(errorObjects);
    })
    .then(() => {
      console.log('\nFin du script');
    });
}

function convertCSVDataIntoCertifications(csvParsingResult) {
  const dataRows = csvParsingResult.data;
  return dataRows.reduce((certifications, dataRow) => {
    const certification = {
      id: parseInt(dataRow[CSV_HEADERS.ID]),
      firstName: dataRow[CSV_HEADERS.FIRST_NAME],
      lastName: dataRow[CSV_HEADERS.LAST_NAME],
      birthdate: dataRow[CSV_HEADERS.BIRTHDATE],
      birthplace: dataRow[CSV_HEADERS.BIRTHPLACE],
      externalId: dataRow[CSV_HEADERS.EXTERNAL_ID],
    };
    certifications.push(certification);
    return certifications;
  }, []);
}

function _buildRequestObject(baseURL, accessToken, certification) {
  return {
    headers: { authorization: `Bearer ${accessToken}` },
    method: 'PATCH',
    baseURL,
    url: `/api/certification-courses/${certification.id}`,
    data: {
      data: {
        type: 'certifications',
        id: certification.id,
        attributes: {
          'first-name': certification.firstName,
          'last-name': certification.lastName,
          birthplace: certification.birthplace,
          birthdate: certification.birthdate,
          'external-id': certification.externalId,
        },
      },
    },
  };
}

/**
 * @param options
 * - baseURL: String
 * - accessToken: String
 * - certifications: Array[Object]
 */
function saveCertifications(options) {
  const errorObjects = [];

  const promises = options.certifications.map((certification) => {
    const requestConfig = _buildRequestObject(options.baseURL, options.accessToken, certification);
    return axios(requestConfig).catch((err) => {
      errorObjects.push({
        errorMessage: err.message,
        certification: certification,
      });
    });
  });
  return Promise.all(promises).then(() => {
    return errorObjects;
  });
}

function _logErrorObjects(errorObjects) {
  console.log('Téléversement des certifications sur le serveur : OK');
  console.log(`\nIl y a eu ${errorObjects.length} erreurs`);
  errorObjects.forEach((errorObject) => {
    console.log(`  > id de la certification : ${errorObject.certification.id} - erreur : ${errorObject.errorMessage}`);
  });
}

const modulePath = url.fileURLToPath(import.meta.url);
const isLaunchedFromCommandLine = process.argv[1] === modulePath;

/**
 * Usage: node import-certifications-from-csv.js http://localhost:3000 jwt.access.token my_file.csv
 */
function main() {
  console.log("Début du script d'import");
  const baseURL = process.argv[2];
  const accessToken = process.argv[3];

  const filePath = process.argv[4];

  fs.open(filePath, 'r', (err, data) => {
    console.log('\nTest de validité du fichier...');
    assertFileValidity(err, filePath);
    console.log('Test de validité du fichier : OK');

    console.log('\nTéléversement des certifications sur le serveur...');
    readMyData(data, baseURL, accessToken);
  });
}

(async () => {
  if (isLaunchedFromCommandLine) {
    try {
      await main();
    } catch (error) {
      console.error(error);
      process.exitCode = 1;
    } finally {
      await disconnect();
    }
  }
})();

export { assertFileValidity, convertCSVDataIntoCertifications, saveCertifications };
