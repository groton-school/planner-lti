import * as cookie from 'cookie';
import * as Calendar from '../../../Calendar';
import { render } from '../../../Utilities';
import * as Canvas from '../../Canvas';
import calendarSelector from './calendar_selector.ejs';
import { Checkbox, HierarchyUpdated, State } from './Checkbox';
import './styles.scss';

type Configuration<S = State> = {
  n: string[];
  s: S;
  c?: Configuration[];
  l?: boolean;
};

const toggles: Checkbox[] = [];
const stylesheet = new CSSStyleSheet();

document.adoptedStyleSheets.push(stylesheet);

export async function init() {
  const wrapper = document.getElementById('preferences-wrapper');
  if (wrapper) {
    const subCalendars = () => [
      new Checkbox(
        [Calendar.Assignment.className, Calendar.PlannerEvent.className],
        'Assignments & planner Items',
        State.Checked
      ),
      new Checkbox(
        [Calendar.ClassMeeting.className, Calendar.CalendarEvent.className],
        'Class meetings & events',
        State.Checked
      )
    ];
    for (const course of Canvas.Courses.list()) {
      const courseToggle = new Checkbox(
        [course.context_code],
        course.name,
        State.Checked
      );
      if (course.sections.length > 1) {
        for (const section of course.sections) {
          const classNames = [section.context_code];
          if (section.color_block) {
            classNames.push(section.color_block);
          }
          const sectionToggle = new Checkbox(
            classNames,
            section.name,
            State.Checked,
            courseToggle,
            true
          );
          sectionToggle.appendChild(...subCalendars());
        }
      } else {
        courseToggle.appendChild(...subCalendars());
      }
      toggles.push(courseToggle);
    }
    toggles.push(
      new Checkbox(
        [Calendar.Assignment.className],
        'Assignments',
        State.Checked
      ),
      new Checkbox(
        [Calendar.ClassMeeting.className],
        'Class Meetings',
        State.Checked
      ),
      new Checkbox(
        [Calendar.CalendarEvent.className],
        'Other Events',
        State.Checked
      )
    );
    Checkbox.bind(
      await render({
        template: calendarSelector,
        parent: wrapper,
        data: { toggles }
      })
    );
    load();
    document.addEventListener(HierarchyUpdated, handleHierarchyUpdated);
  }
}

function handleHierarchyUpdated() {
  // TODO cross-reference main Assignments and per-class Assigments toggles, etc
  const css = flatten(toggles.map((toggle) => toStyles(toggle))).join('');
  stylesheet.replace(css);
  save();
}

// TODO refactor load-apply-save to be OO
function load() {
  const { calendars = undefined } = cookie.parse(document.cookie);
  if (calendars) {
    try {
      const configs = JSON.parse(calendars || '') as Configuration<number>[];
      for (const toggle of toggles) {
        apply(toggle, configs);
      }
      handleHierarchyUpdated();
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_) {
      // ignore error
    }
  }
}

function apply(checkbox: Checkbox, configs: Configuration<number>[]) {
  const [config = undefined] = configs.filter(
    (config) => config.n.sort().join() == checkbox.classNames.sort().join()
  );
  if (config) {
    switch (config.s) {
      case 0:
        checkbox.state = State.Checked;
        break;
      case 1:
        checkbox.state = State.Unchecked;
        break;
      case 2:
        checkbox.state = State.Indeterminate;
    }
    checkbox.collapsed = !!config.l;
    if (config.c) {
      for (const child of checkbox.children) {
        apply(child, config.c);
      }
    }
  }
}

function save() {
  document.cookie = cookie.serialize(
    'calendars',
    JSON.stringify(toggles.map((toggle) => toConfig(toggle))),
    { partitioned: true, path: '/', secure: true, sameSite: 'none' }
  );
}

// TODO refactor toConfig to be OO
function toConfig(checkbox: Checkbox): Configuration {
  let config: Configuration = {
    n: checkbox.classNames,
    s: checkbox.state
  };
  if (checkbox.children.length > 0) {
    config = {
      ...config,
      c: checkbox.children.map((child) => toConfig(child)),
      l: checkbox.collapsed
    };
  }
  return config;
}

// TODO refactor toStyles to be OO
function toStyles(
  checkbox: Checkbox,
  selector: string = '.fc-event'
): string[] {
  if (checkbox.state === State.Unchecked) {
    return checkbox.classNames.map(
      (className) => `${selector}.${className} { display: none; }`
    );
  }
  return flatten(
    checkbox.classNames.map((className) =>
      flatten(
        checkbox.children.map((child) =>
          toStyles(child, `${selector}.${className}`)
        )
      )
    )
  );
}

function flatten(inflated: string[][]): string[] {
  return inflated.reduce((acc, arr) => {
    acc.push(...arr);
    return acc;
  }, [] as string[]);
}
