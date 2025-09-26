import gcloud from '@battis/partly-gcloudy';
import input from '@inquirer/input';
import { Colors } from '@qui-cli/colors';
import { Core } from '@qui-cli/core';
import { Env } from '@qui-cli/env';
import { Log } from '@qui-cli/log';
import { Root } from '@qui-cli/root';
import { Shell } from '@qui-cli/shell';
import chalk from 'chalk';
import path from 'node:path';

(async () => {
  Root.configure({ root: path.dirname(import.meta.dirname) });
  Env.configure();
  const {
    values: { force }
  } = await Core.init({
    flag: {
      force: {
        short: 'f',
        default: false
      }
    }
  });
  const configure = force || !process.env.PROJECT;

  Log.info(
    chalk.bgYellow.bold.black(
      ` Deploying to ${process.env.TARGET || 'unknown'} instance `
    )
  );

  const { project, appEngine } = await gcloud.batch.appEngineDeployAndCleanup({
    retainVersions: 2
  });

  if (configure) {
    await gcloud.services.enable(gcloud.services.API.CloudFirestoreAPI);
    await gcloud.services.enable(gcloud.services.API.GoogleCalendarAPI);
    await gcloud.services.enable(gcloud.services.API.CloudLoggingAPI);
    const [{ name: database }] = JSON.parse(
      Shell.exec(
        `gcloud firestore databases list --project=${project.projectId} --format=json --quiet`
      )
    );
    Shell.exec(
      `gcloud firestore databases update --type=firestore-native --database="${database}" --project=${project.projectId} --format=json --quiet`
    );

    await gcloud.secrets.enableAppEngineAccess();
    const redirectUri = `https://${appEngine.defaultHostname}/login/oauth2/redirect`;
    Log.info(
      `You will need to create a Developer API Key for this LTI on your Canvas Instance. The redirect URI for this key will be ${Colors.url(
        redirectUri
      )}\n\nIf you have not done this before, follow these directions: ${Colors.url(
        'https://community.canvaslms.com/t5/Admin-Guide/How-do-I-add-a-developer-API-key-for-an-account/ta-p/259'
      )}`
    );
    await gcloud.secrets.set({
      name: 'CANVAS_CLIENT_ID',
      value: await input({
        message: `Please enter the ${Colors.value(
          'Client ID'
        )} for the Developer API Key that you created for this LTI`,
        validate: (value) => value && /^\d{18}$/.test(value)
      })
    });
    await gcloud.secrets.set({
      name: 'CANVAS_CLIENT_SECRET',
      value: await input({
        message: `Please enter the ${Colors.value(
          'Key'
        )} for the Developer API Key that you created for this LTI`,
        validate: (value) => value && /^[a-z0-9]{64}$/i.test(value)
      })
    });
    // FiXME replace with GOOGLE_CREDENTIALS with Calendar API access
    await gcloud.secrets.set({
      name: 'CALENDAR_ID',
      value: await input({
        message: `Calendar ID (usually an email address) of the Google Calendar containing class meetings`,
        validate: (value) =>
          value && typeof value === 'string' && value.length > 0
      })
    });

    Log.info(
      `Install your LTI by going adding an LTI Registration in Developer Keys for ${Colors.url(
        `https://${appEngine.defaultHostname}/lti/register`
      )}
      
If you haven't done that before, follow these directions:
${Colors.url(
  'https://community.canvaslms.com/t5/Admin-Guide/How-do-I-add-a-developer-LTI-Registration-key-for-an-account/ta-p/601370'
)}
      
You will then need to enable the app following these directions:\n${Colors.url(
        'https://community.canvaslms.com/t5/Admin-Guide/How-do-I-configure-an-external-app-for-an-account-using-a-client/ta-p/202'
      )}`
    );
  }
})();
