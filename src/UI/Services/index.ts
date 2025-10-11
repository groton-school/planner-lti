import * as Activity from './Activity';
import * as Bootstrap from './Bootstrap';
import * as Canvas from './Canvas';
import * as FullCalendar from './FullCalendar';
import * as Preferences from './Preferences';

export * as Activity from './Activity';
export * as Bootstrap from './Bootstrap';
export * as Canvas from './Canvas';
export * as FullCalendar from './FullCalendar';
export * as Google from './Google';
export * as Preferences from './Preferences';

export async function init(options: FullCalendar.Options) {
  Activity.init();
  await Promise.all([Bootstrap.init(), Canvas.init()]);
  Preferences.init();
  FullCalendar.init(options);
}
