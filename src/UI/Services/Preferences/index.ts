import * as CalendarSelector from './CalendarSelector';

// TODO expose saved prefs to reduce data load queries (where possible)

export async function init() {
  // TODO save (and restore) prefs
  await CalendarSelector.init();
}
