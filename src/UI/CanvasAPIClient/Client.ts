import { JSONObject, JSONValue } from '@battis/typescript-tricks';
import * as Canvas from '@groton/canvas-api';
import * as Base from '@groton/canvas-api.client.base';
import PQueue from 'p-queue';
import path from 'path-browserify';
import { fetchCached } from '../Services/Cache';
import {
  AuthorizationEvent,
  RequestCompleteEvent,
  RequestPageEvent,
  RequestStartedEvent
} from './Events';

type RequestInitParams = RequestInit & {
  pathParams?: JSONObject;
  searchParams?: JSONObject;
  params?: JSONObject;
  requestId?: string;
};

export type Options = {
  scope?: string;
  headers?: Record<string, string>;
  parameters?: Record<string, string>;
  instance_url: string;
};

export class Client implements Base.Base {
  private queue = new PQueue();
  public readonly instance_url: string;

  public constructor(options: Options = { instance_url: '/canvas/proxy' }) {
    this.instance_url = options.instance_url;
  }

  public async fetch(endpoint: URL | RequestInfo, init?: RequestInit) {
    if (!(endpoint instanceof Request)) {
      try {
        const url = new URL(endpoint);
        endpoint = endpoint
          .toString()
          .replace(
            new RegExp(
              `^${url.protocol}//${url.hostname}${url.port && url.port !== '' ? `:${url.port}` : ''}`
            ),
            ''
          );
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (_) {
        // ignore error (not a URL)
      }
      endpoint = path.join(this.instance_url, endpoint.toString());
    }
    const result = await this.queue.add(
      (async () => {
        return (await fetchCached(endpoint.toString(), init)) as Response;
      }).bind(this)
    );
    if (result) {
      if (result.status === 401) {
        this.authorize();
      }
      return result;
    } else {
      throw new Error(`No result from fetch`);
    }
  }

  public async fetchAs<T = JSONValue>(
    endpoint: string,
    {
      pathParams,
      searchParams,
      params,
      requestId,
      ...init
    }: RequestInitParams = {}
  ): Promise<T> {
    const start = new RequestStartedEvent({ requestId });
    requestId = start.requestId;
    document.dispatchEvent(start);
    const result = await Base.fetchAllPages<T>({
      instance_url: this.instance_url,
      endpoint,
      pathParams,
      searchParams,
      params,
      init,
      fetch: this.fetch.bind(this),
      pageCallback: (page) => {
        document.dispatchEvent(new RequestPageEvent(page, { requestId }));
      }
    });
    document.dispatchEvent(new RequestCompleteEvent<T>({ requestId, result }));
    return result;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public async upload<T = JSONValue>(params: Base.UploadParams): Promise<T> {
    throw new Error('not implemented');
  }

  public authorize() {
    document.dispatchEvent(
      new AuthorizationEvent(
        path.resolve(this.instance_url, '../login/authorize')
      )
    );
  }

  public async deauthorize(redirect: string = '/') {
    await fetch(path.resolve(this.instance_url, '../login/deauthorize'));
    window.location.href = redirect;
  }

  public async getOwner() {
    const response = await fetch(path.resolve(this.instance_url, '../owner'));
    if (response.ok) {
      return (await response.json()) as Canvas.Users.Profile;
    }
    return undefined;
  }

  public async isAuthorized() {
    return !!(await this.getOwner());
  }
}
