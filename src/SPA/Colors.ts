import * as Canvas from '@groton/canvas-cli.api';
import tinycolor from 'tinycolor2';

export async function get() {
  const colors = (await (await fetch('/api/v1/users/self/colors')).json()) as {
    custom_colors: { [asset_string: string]: string };
  };
  const styleElt = document.createElement('style');
  const vars: string[] = [];
  const selectors: string[] = [];
  for (const asset_string of Object.keys(colors.custom_colors)) {
    const color = tinycolor(colors.custom_colors[asset_string]);
    const lighter = tinycolor(color).lighten(25).desaturate(25);
    const darker = tinycolor(color).darken(25);

    function readableText(
      background: tinycolor.Instance | string,
      text = darker
    ) {
      if (!tinycolor.isReadable(background, text)) {
        text = tinycolor('white');
      }
      return text;
    }

    vars.push(`--${asset_string}: ${color};`);
    selectors.push(
      `.${asset_string}.planner_item, #todo .${asset_string}.item {
        background: ${color};
        color: ${readableText(color)};
        border-color: ${color} solid 1px;
      }`
    );
    selectors.push(
      `.${asset_string}.planner_item.done, #todo .${asset_string}.item.done {
        background: ${lighter};
        color: ${readableText(lighter)};
      }`
    );
    selectors.push(
      `.${asset_string} .form-check-input:checked {
        background-color: ${color};
        border-color: ${color};
      }`
    );
    selectors.push(`.${asset_string}.class_meeting {
      background: white;
      color: ${color};
      border: ${color} solid 1px;  
    }`);
  }

  styleElt.innerHTML = `:root { ${vars.join('\n')} }\n${selectors.join('\n')}`;
  document.head.appendChild(styleElt);
}

export function classNameFromCourseId(id?: string | number) {
  return `course_${id || 'undefined'}`;
}

export function classNameFromCourse(course: Canvas.Courses.Course) {
  return classNameFromCourseId(course.id);
}

export function varNameFromCourseId(id?: string | number) {
  return `--${classNameFromCourseId(id)}`;
}

export function varNameFromCourse(course: Canvas.Courses.Course) {
  return `--${classNameFromCourse(course)}`;
}
