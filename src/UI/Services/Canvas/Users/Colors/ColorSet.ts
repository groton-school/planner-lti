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
  public readonly textOnBase: tinycolor.Instance;
  public readonly baseOnWhite: tinycolor.Instance;

  public constructor({
    contextCode: context_code,
    hexColor: hex_color
  }: ConstructorOptions) {
    this.contextCode = context_code;
    this.base = tinycolor(hex_color);

    this.textOnBase = ColorSet.readableText({ background: this.base });
    this.baseOnWhite = ColorSet.readableText({
      background: ColorSet.white,
      text: this.base,
      darkTextPreference: this.base,
      lightTextPreference: this.base
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
