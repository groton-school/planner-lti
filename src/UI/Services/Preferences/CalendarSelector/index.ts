import { render } from '../../../Utilities';
import * as Canvas from '../../Canvas';
import calendarSelector from './calendar_selector.ejs';
import './styles.scss';

const stylesheet = new CSSStyleSheet();
document.adoptedStyleSheets.push(stylesheet);

export async function init() {
  const wrapper = document.getElementById('preferences-wrapper');
  if (wrapper) {
    const selector = await render({
      template: calendarSelector,
      parent: wrapper,
      data: { courses: await Canvas.Courses.list() }
    });
    selector
      .querySelectorAll<HTMLInputElement>('input[type="checkbox"')
      .forEach((check) => {
        check.addEventListener('click', toggle.bind(check));
      });
  }
}

function toggle(this: HTMLInputElement) {
  const classNames = Array.from(
    document.querySelectorAll<HTMLDivElement>(
      `#calendar-selector li:has(#${this.id}) > div`
    )
  ).map((div) => div.className.split(' '));
  classNames.push(['fc-event']);
  const selectorText = classNames
    .reduce(
      (selectors, classNames) => {
        const newSelectors: string[] = [];
        for (const className of classNames) {
          newSelectors.push(
            ...selectors.map((selector) =>
              className.length ? `${selector}.${className}` : selector
            )
          );
        }
        return newSelectors;
      },
      ['']
    )
    .join(', ');
  if (this.checked) {
    let i: number;
    for (i = 0; i < stylesheet.cssRules.length; i++) {
      if (
        (stylesheet.cssRules.item(i) as CSSStyleRule | undefined)
          ?.selectorText === selectorText
      ) {
        break;
      }
    }
    if (i < stylesheet.cssRules.length) {
      stylesheet.deleteRule(i);
    }
  } else {
    stylesheet.insertRule(`${selectorText} { display: none; }`);
  }
  // TODO toggle sub-categories with parent category in calendar selector
  /* TODO set parent checkboxes of heterogeneous groups of checkboxes to
   * indeterminate
   *
   * Will also need to check to see if parents of checked boxes have now
   * become homogenous and therefore need to be updated to a determiante
   * value
   */
}
