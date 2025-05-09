import tinycolor from 'tinycolor2';

type ReadableOnOptions = {
  background: tinycolor.Instance | string;
  text?: tinycolor.Instance;
  darkTextPreference?: tinycolor.Instance;
  lightTextPreference?: tinycolor.Instance;
};

const black = tinycolor('black');
const white = tinycolor('white');

class ColorSet {
  public readonly base: tinycolor.Instance;
  public readonly baseText: tinycolor.Instance;
  public readonly lighter: tinycolor.Instance;
  public readonly lighterText: tinycolor.Instance;
  public readonly darker: tinycolor.Instance;
  public readonly darkerText: tinycolor.Instance;

  public constructor(hexColor: string) {
    this.base = tinycolor(hexColor);

    this.lighter = tinycolor(hexColor);
    this.lighter.lighten(25).desaturate(25);

    this.darker = tinycolor(hexColor);
    this.darker.darken(25);

    this.baseText = ColorSet.readableText({ background: this.base });
    this.lighterText = ColorSet.readableText({
      background: this.lighter,
      text: this.baseText,
      darkTextPreference: this.darker
    });
    this.darkerText = ColorSet.readableText({
      background: this.darker,
      text: this.baseText,
      lightTextPreference: this.lighter
    });
  }

  public static readableText({
    background,
    text = white,
    darkTextPreference = black,
    lightTextPreference = white
  }: ReadableOnOptions) {
    if (tinycolor.isReadable(background, text)) {
      return text.clone();
    }
    if (typeof background === 'string') {
      background = tinycolor(background);
    }
    if (background.isLight()) {
      if (tinycolor.isReadable(background, darkTextPreference)) {
        return darkTextPreference.clone();
      }
      return black.clone();
    } else if (tinycolor.isReadable(background, lightTextPreference)) {
      return lightTextPreference.clone();
    }
    return white.clone();
  }
}

export async function get() {
  const colors = (await (
    await fetch('/canvas/api/v1/users/self/colors')
  ).json()) as {
    custom_colors: { [asset_string: string]: string };
  };
  colors.custom_colors['course_undefined'] = '#999';
  const styleElt = document.createElement('style');
  const vars: string[] = [];
  const selectors: string[] = [];
  let asset: ColorSet;
  for (const asset_string of Object.keys(colors.custom_colors)) {
    asset = new ColorSet(colors.custom_colors[asset_string]);
    vars.push(`--${asset_string}: ${asset.base};`);
    selectors.push(
      ...[
        `.${asset_string}.planner_item, #todo .${asset_string}.item {
          background: ${asset.base};
          color: ${asset.baseText};
          border-color: ${asset.base} solid 1px;
        }`,
        `.${asset_string}.planner_item.done, #todo .${asset_string}.item.done {
          background: ${asset.lighter};
          color: ${asset.lighterText};
        }`,
        `.${asset_string} .form-check-input:checked {
          background-color: ${asset.base};
          border-color: ${asset.base};
          color: ${asset.baseText};
        }`,
        `.${asset_string}.class_meeting, .${asset_string}.class_meeting .fc-event-main {
          background: white;
          color: ${ColorSet.readableText({ background: 'white', text: asset.base })};
          border: ${asset.base} solid 1pt;  
        }`,
        `.${asset_string}.class_meeting.modal-header {
          border: ${asset.base} solid 3pt;
        }`
      ]
    );
  }

  styleElt.innerHTML = `:root { ${vars.join('\n')} }\n${selectors.join('\n')}`;
  document.head.appendChild(styleElt);
}

export function classNameFromCourseId(id?: string | number) {
  return `course_${id || 'undefined'}`;
}
