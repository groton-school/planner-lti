import * as Canvas from '@groton/canvas-cli.api';
import tinycolor from 'tinycolor2';

export async function get() {
  const colors = (await (await fetch('/api/v1/users/self/colors')).json()) as {
    custom_colors: { [asset_string: string]: string };
  };
  const styleElt = document.createElement('style');
  styleElt.innerHTML =
    ':root {\n' +
    Object.keys(colors.custom_colors)
      .map(
        (asset_string) =>
          `--${asset_string}: ${colors.custom_colors[asset_string]};`
      )
      .join('\n') +
    '\n}\n' +
    Object.keys(colors.custom_colors)
      .map(
        (asset_string) =>
          `.${asset_string} { background: var(--${asset_string}); color: ${tinycolor.isReadable(colors.custom_colors[asset_string], 'black') ? 'black' : 'white'}}`
      )
      .join('\n');
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
