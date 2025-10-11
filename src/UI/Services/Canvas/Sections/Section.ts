import { Canvas } from '@groton/canvas-api.client.web';
import * as Courses from '../Courses';
import { BaseSection } from './BaseSection';

export class Section extends BaseSection {
  public get color_block() {
    const [, color] =
      this.name.match(/^.*\((?:[^()]* )?(RD|OR|YL|GR|LB|DB|PR)(?: .*|\))$/) ||
      [];
    return color ? `${color}_block` : undefined;
  }

  public get context_code() {
    return `section_${this.id}`;
  }

  public get course() {
    return Courses.get(this.course_id);
  }

  private constructor(base: BaseSection) {
    super();
    Object.assign(this, base);
  }

  public static fromBase(base: Canvas.Sections.Section) {
    return new Section(base);
  }
}
