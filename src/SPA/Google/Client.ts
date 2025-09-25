import bootstrap from 'bootstrap';
import * as cookie from 'cookie';
import path from 'path-browserify';
import { render } from '../Utilities/Views';
import authorizeModal from './authorize.modal.ejs';

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
    const result = await fetch(endpoint, init);

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
    const modal = await render({
      template: authorizeModal,
      parent: document.body,
      data: {
        authorize_url:
          path.join(this.instance_url, '../login/authorize') +
          `?session=${session}` // TODO should be consistent with session name (cf. https://github.com/groton-school/slim-lti-partitioned-session/issues/3)
      }
    });
    const bsModal = new bootstrap.Modal(modal);
    modal.querySelector('#authorize')?.addEventListener('click', () => {
      bsModal.hide();
    });
    bsModal.show();
  }

  public async deauthorize(redirect: string = '/') {
    await fetch(path.resolve(this.instance_url, '../login/deauthorize'));
    window.location.href = redirect;
  }
}

export const client = new Client();
