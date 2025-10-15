import * as Calendar from '../../../Calendar';
import { render } from '../../../Utilities';
import * as Canvas from '../../Canvas';
import calendarSelector from './calendar_selector.ejs';
import { Checkbox, HierarchyUpdated, State } from './Checkbox';
import './styles.scss';

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
    document.addEventListener(HierarchyUpdated, handleHierarchyUpdated);
  }
}

function handleHierarchyUpdated() {
  // TODO cross-reference main Assignments and per-class Assigments toggles, etc
  stylesheet.replace(flatten(toggles.map((toggle) => toStyles(toggle))).join());
}

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
