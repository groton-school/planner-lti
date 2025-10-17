import { JSONValue } from '@battis/typescript-tricks';
import * as cookie from 'cookie';

type SetOptions<T> = cookie.SerializeOptions & {
  encode?: (value: T) => string;
};
type GetOptions<T> = Omit<cookie.ParseOptions, 'decode'> & {
  decode?: (value: string) => T;
};

export function get<T = JSONValue>(
  name: string,
  {
    decode = (value: string) => JSON.parse(value) as T,
    ...options
  }: GetOptions<T> = {}
): T | undefined {
  const cookies = cookie.parse(document.cookie, options);
  if (name in cookies && cookies[name]) {
    try {
      return decode(cookies[name]);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_) {
      console.error(
        `Cookie '${name}' with value "${cookies[name]}" could not be decoded.`
      );
    }
  }
  return undefined;
}

export function set<T = unknown>(
  name: string,
  value: T,
  {
    encode = JSON.stringify,
    path = '/',
    secure = true,
    sameSite = 'none',
    partitioned = true,
    ...options
  }: SetOptions<T> = {}
) {
  document.cookie = cookie.serialize(name, encode(value), {
    path,
    secure,
    sameSite,
    partitioned,
    ...options
  });
}
