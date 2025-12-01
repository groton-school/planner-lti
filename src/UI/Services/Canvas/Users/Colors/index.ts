import { ColorString } from '@battis/descriptive-types';
import { Canvas } from '@groton/canvas-api.client.web';
import { NoColor } from '@groton/colors';
import { renderAs } from '../../../DOM';
import { CanvasReadyEvent } from '../../CanvasReady';
import { ColorSet } from './ColorSet';
import style from './style.ejs';

export type Colors = {
  custom_colors: {
    [context: string]: ColorString<'#hex'>;
  };
};

function init() {
  document.addEventListener(CanvasReadyEvent.name, async () => {
    // TODO update @groton/canvas-api overrides to reflect actual behavior for Canvas.v1.Users.Colors.list()
    // Issue URL: https://github.com/groton-school/planner-lti/issues/73
    const colors = (await Canvas.v1.Users.Colors.list({
      pathParams: { id: 'self' }
    })) as unknown as Colors;
    colors.custom_colors['course_undefined'] = NoColor;

    const assets: ColorSet[] = [];
    for (const asset_string in colors.custom_colors) {
      assets.push(
        new ColorSet({
          contextCode: asset_string,
          hexColor: colors.custom_colors[asset_string]
        })
      );
    }

    document.head.appendChild(
      await renderAs({ template: style, data: { assets } })
    );
  });
}

init();
