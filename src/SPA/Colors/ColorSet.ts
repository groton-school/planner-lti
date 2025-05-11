import tinycolor from 'tinycolor2';

type ConstructorOptions = {
  contextCode: string;
  hexColor: string;
};

type ReadableTextOptions = {
  background: tinycolor.Instance | string;
  text?: tinycolor.Instance;
  darkTextPreference?: tinycolor.Instance;
  lightTextPreference?: tinycolor.Instance;
};

export class ColorSet {
  private static readonly black = tinycolor('black');
  private static readonly white = tinycolor('white');

  public readonly contextCode: string;
  public readonly base: tinycolor.Instance;
  public readonly baseText: tinycolor.Instance;
  public readonly lighter: tinycolor.Instance;
  public readonly lighterText: tinycolor.Instance;
  public readonly darker: tinycolor.Instance;
  public readonly darkerText: tinycolor.Instance;
  public readonly whiteText: tinycolor.Instance;

  public constructor({
    contextCode: context_code,
    hexColor: hex_color
  }: ConstructorOptions) {
    this.contextCode = context_code;
    this.base = tinycolor(hex_color);
    this.lighter = this.base.clone().lighten(25).desaturate(25);
    this.darker = this.base.clone().darken(25);

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
    this.whiteText = ColorSet.readableText({
      background: ColorSet.white,
      text: this.base,
      darkTextPreference: this.darker
    });
  }

  private static readableText({
    background,
    text = ColorSet.white,
    darkTextPreference = ColorSet.black,
    lightTextPreference = ColorSet.white
  }: ReadableTextOptions) {
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
      return ColorSet.black.clone();
    } else if (tinycolor.isReadable(background, lightTextPreference)) {
      return lightTextPreference.clone();
    }
    return ColorSet.white.clone();
  }
}
