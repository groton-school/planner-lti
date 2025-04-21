import gcloud from '@battis/partly-gcloudy';
import { Colors } from '@battis/qui-cli.colors';
import { Core } from '@battis/qui-cli.core';
import { Log } from '@battis/qui-cli.log';
import { Root } from '@battis/qui-cli.root';
import { Shell } from '@battis/qui-cli.shell';
import { Validators } from '@battis/qui-cli.validators';
import input from '@inquirer/input';
import path from 'node:path';
import open from 'open';

(async () => {
  Root.configure({ root: path.dirname(import.meta.dirname) });
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

  const { project, appEngine } = await gcloud.batch.appEngineDeployAndCleanup({
    retainVersions: 2
  });

  if (configure) {
    await gcloud.services.enable(gcloud.services.API.CloudFirestoreAPI);
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
        )} for the Developer API Key that your created for this LTI`,
        validate: (value) => value && /^[a-z0-9]{64}$/i.test(value)
      })
    });
    const authUrl = `https://${appEngine.defaultHostname}/login/oauth2`;
    Log.debug(
      `Open this URL in your web browser to authorize this LTI as a Canvas User with sufficient privileges to masquerade as students: ${authUrl}`
    );
    open(authUrl);
  }

  Log.info(
    `Install your LTI by going adding an LTI Registration in Developer Keys for ${Colors.url(
      `https://${appEngine.defaultHostname}/lti/register`
    )}\n\nIf you haven't done that before, follow these directions:\n${Colors.url(
      'https://community.canvaslms.com/t5/Admin-Guide/How-do-I-add-a-developer-LTI-Registration-key-for-an-account/ta-p/601370'
    )}\n\nYou will then need to enable the app following these directions:\n${Colors.url(
      'https://community.canvaslms.com/t5/Admin-Guide/How-do-I-configure-an-external-app-for-an-account-using-a-client/ta-p/202'
    )}`
  );
})();
