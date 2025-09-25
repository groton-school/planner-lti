import { Canvas } from '@groton/canvas-api.client.web';
import * as Activity from '../../Activity';
import { render } from '../../Utilities/Views';
import { ColorSet } from './ColorSet';
import stylesheet from './stylesheet.ejs';

export async function get() {
  Activity.show();
  const colors = (await Canvas.v1.Users.Colors.list({
    pathParams: { id: 'self' }
  })) as unknown as { custom_colors: { [context: string]: string } };
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
  Activity.hide();
  document.head.appendChild(
    await render({ template: stylesheet, data: { assets } })
  );
}

export function classNameFromCourseId(id?: string | number) {
  return `course_${id || 'undefined'}`;
}
