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
    let text = tinycolor('black');
    if (!tinycolor.isReadable(color, text)) {
      text = tinycolor('white');
    }
    vars.push(`--${asset_string}: ${color};`);
    vars.push(`--${asset_string}_text: ${text};`);
    vars.push(`--${asset_string}_light: ${color.lighten(25).desaturate(25)};`);
    vars.push(
      `--${asset_string}_light_text: ${text.lighten(25).desaturate(25)};`
    );
    selectors.push(
      `.${asset_string} {
        background: var(--${asset_string});
        color: var(--${asset_string}_text);
      }`
    );
    selectors.push(
      `.${asset_string}.done {
        background: var(--${asset_string}_light);
        color: var(--${asset_string}_light_text);
      }`
    );
    selectors.push(
      `.${asset_string}.done .form-check-input:checked {
        background: var(--${asset_string});
        border: var(--${asset_string});
      }`
    );
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
