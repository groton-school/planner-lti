import { Events } from '@groton/canvas-api.client.web';
import * as cookie from 'cookie';
import { render } from 'ejs';
import path from 'path-browserify';
import * as Bootstrap from '../Bootstrap';
import authorize from './authorize.ejs';

export type Options = {
  scope?: string;
  headers?: Record<string, string>;
  parameters?: Record<string, string>;
  instance_url: string;
};

class Client {
  public readonly instance_url: string;

  public constructor(
    options: Options = {
      instance_url: '/google/proxy'
    }
  ) {
    this.instance_url = options.instance_url;
  }

  public async fetch<T = unknown>(
    endpoint: URL | RequestInfo,
    init?: RequestInit
  ) {
    if (!(endpoint instanceof Request)) {
      endpoint = path.join(this.instance_url, endpoint.toString());
    }

    const start = new Events.RequestStartedEvent();
    const { requestId } = start;
    document.dispatchEvent(start);
    const result = await fetch(endpoint, init);
    document.dispatchEvent(
      new Events.RequestCompleteEvent({ requestId, result })
    );

    if (result) {
      if (result.status >= 400 && result.status < 500) {
        this.authorize();
      }
      return (await result.json()) as T;
    }
    throw new Error('no fetch result');
  }

  public async authorize() {
    // TODO don't hard code session name
    const { 'planner-session': session } = cookie.parse(document.cookie);
    const { modal, elt } = await Bootstrap.Modal.create({
      title: 'Authorization',
      body: render(authorize, {
        authorize_url:
          path.join(this.instance_url, '../login/authorize') +
          `?session=${session}`
      })
    });

    elt.querySelector('#authorize')?.addEventListener('click', () => {
      modal.hide();
    });
  }

  public async deauthorize(redirect: string = '/') {
    await fetch(path.resolve(this.instance_url, '../login/deauthorize'));
    window.location.href = redirect;
  }
}

export const client = new Client();
