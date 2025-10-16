import * as cookie from 'cookie';

type Duration = 'day' | 'week' | 'month';
type Style = 'grid' | 'list';

type Configuration = {
  d: Duration;
  s: Style;
};

export function load(): Configuration {
  const { view } = cookie.parse(document.cookie);
  if (view) {
    try {
      return JSON.parse(view) as Configuration;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_) {
      // do nothing
    }
  }
  return { d: 'week', s: 'grid' };
}

export function save(d: Duration, s: Style) {
  document.cookie = cookie.serialize('view', JSON.stringify({ d, s }), {
    partitioned: true,
    path: '/',
    secure: true,
    sameSite: 'none'
  });
}
