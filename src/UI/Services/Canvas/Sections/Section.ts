import { Canvas } from '@groton/canvas-api.client.web';
import * as Courses from '../Courses';
import { BaseSection } from './BaseSection';

export class Section extends BaseSection {
  public get context_code() {
    return `course_${this.course_id}`;
  }

  public get color() {
    const [, color] =
      this.name.match(/^.*\((?:[^()]* )?(RD|OR|YL|GR|LB|DB|PR)(?: .*|\))$/) ||
      [];
    return color || 'no-color';
  }

  public async getCourse() {
    return Courses.get(this.course_id.toString());
  }

  private constructor(base: BaseSection) {
    super();
    Object.assign(this, base);
  }

  public static fromBase(base: Canvas.Sections.Section) {
    return new Section(base);
  }
}
