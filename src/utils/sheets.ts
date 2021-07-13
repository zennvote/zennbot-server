import { readFileSync, writeFileSync } from 'fs';
import { createInterface } from 'readline';
import { google, sheets_v4 as sheetsV4 } from 'googleapis';
import { GaxiosPromise } from 'googleapis/build/src/apis/abusiveexperiencereport';
import { OAuth2Client } from 'googleapis-common/node_modules/google-auth-library';

export type SheetsInfo = { name: string, prefix?: string, tickets: number, ticketPieces: number };
export type UpdateSheetsInfoDto = { tickets?: number, ticketPieces?: number, prefix?: string };

let service: sheetsV4.Sheets;
export const initializeSheetsService = async (): Promise<void> => {
  const credentialsPath = process.env.SHEETS_CREDENTIALS_PATH;
  if (!credentialsPath) {
    throw new Error('No env: SHEETS_CREDENTIALS_PATH');
  }
  const credentials = JSON.parse(readFileSync(credentialsPath, 'utf8'));
  authorize(credentials).then((auth) => {
    service = google.sheets({ auth, version: 'v4' });
  });
};

export const getSheetsInfos = async (): Promise<SheetsInfo[] | null> => {
  const sheets = await getSheets();
  if (!sheets) {
    return null;
  }

  const result = sheets.map(getSheetsInfoFromRow);

  return result;
};

export const getSheetsInfo = async (name: string): Promise<null | SheetsInfo> => {
  const sheets = await getSheets();
  if (!sheets) {
    return null;
  }

  const row = sheets.find((value) => value[0] === name);
  if (!row) {
    return null;
  }

  return getSheetsInfoFromRow(row);
};

export const updateSheetsInfo = async (name: string, dto: UpdateSheetsInfoDto):
  Promise<GaxiosPromise<sheetsV4.Schema$BatchUpdateValuesResponse> | null> => {
  const spreadsheetId = process.env.REWARDS_SHEETS_ID;
  const sheetIndex = await getViewerIndex(name);
  if (sheetIndex === undefined) {
    return null;
  }
  const index = sheetIndex + 6;
  const rangeMap: { [key: string]: string } = { tickets: 'C', ticketPieces: 'D', prefix: 'E' };

  const data = Object.entries(dto).map(([key, value]) => ({
    range: `시트1!${rangeMap[key]}${index}`,
    values: [[`${value}`]],
  }));

  const result = await service.spreadsheets.values.batchUpdate({
    spreadsheetId,
    requestBody: { data, valueInputOption: 'RAW' },
  });
  return result;
};

const getSheets = async () => {
  const spreadsheetId = process.env.REWARDS_SHEETS_ID;
  const range = process.env.REWARDS_SHEETS_FULL_RANGE;
  if (!spreadsheetId) {
    throw new Error('No env: REWARDS_SHEETS_ID');
  }
  if (!range) {
    throw new Error('No env: REWARDS_SHEETS_FULL_RANGE');
  }

  const response = await service.spreadsheets.values.get({
    spreadsheetId,
    range,
  });

  return response.data.values;
};

const getViewerIndex = async (name: string): Promise<number | undefined> => {
  const sheets = await getSheets();
  if (!sheets) {
    return undefined;
  }

  const result = sheets.findIndex((value) => value[0] === name);

  if (result === -1) {
    return undefined;
  }
  return result;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const authorize = async (credentials: any) => {
  const tokenPath = process.env.SHEETS_TOKEN_PATH;
  if (!tokenPath) {
    throw new Error('No env: SHEETS_TOKEN_PATH');
  }

  const { client_id: id, client_secret: secret, redirect_uris: uris } = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(id, secret, uris[0]);

  try {
    const token = JSON.parse(readFileSync(tokenPath, 'utf8'));
    oAuth2Client.setCredentials(token);
    return oAuth2Client;
  } catch (e) {
    const newToken = await getNewToken(oAuth2Client);
    return newToken;
  }
};

const getNewToken = async (oAuth2Client: OAuth2Client): Promise<OAuth2Client> => {
  const tokenPath = process.env.SHEETS_TOKEN_PATH;
  const scope = process.env.SHEETS_SCOPES;

  if (!tokenPath) {
    throw new Error('No env: SHEETS_TOKEN_PATH');
  }
  if (!scope) {
    throw new Error('No env: SHEETS_SCOPES');
  }

  const authUrl = oAuth2Client.generateAuthUrl({ access_type: 'offline', scope });

  console.log(`Auth URL: ${authUrl}`);

  const newToken = await new Promise<OAuth2Client>((resolve, reject) => {
    const rl = createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    rl.question('Enter Code: ', (code) => {
      rl.close();
      console.log(code);
      oAuth2Client.getToken(code, (err, token) => {
        if (err || !token) {
          return reject(err);
        }

        oAuth2Client.setCredentials(token);
        writeFileSync(tokenPath, JSON.stringify(token));

        return resolve(oAuth2Client);
      });
    });
  });

  return newToken;
};

const getSheetsInfoFromRow = (row: string[]): SheetsInfo => {
  const [name, tickets, ticketPieces, prefix] = row;

  return {
    name, prefix, tickets: parseInt(tickets, 10), ticketPieces: parseInt(ticketPieces, 10),
  };
};
