import { render } from '../../Utilities/Views';
import { ColorSet } from './ColorSet';
import stylesheet from './stylesheet.ejs';

export async function get() {
  const colors = (await (
    await fetch('/canvas/api/v1/users/self/colors')
  ).json()) as {
    custom_colors: { [asset_string: string]: string };
  };
  colors.custom_colors['course_undefined'] = '#999';
  const assets: ColorSet[] = [];
  for (const asset_string of Object.keys(colors.custom_colors)) {
    assets.push(
      new ColorSet({
        contextCode: asset_string,
        hexColor: colors.custom_colors[asset_string]
      })
    );
  }
  document.head.appendChild(
    await render({ template: stylesheet, data: { assets } })
  );
}

export function classNameFromCourseId(id?: string | number) {
  return `course_${id || 'undefined'}`;
}
