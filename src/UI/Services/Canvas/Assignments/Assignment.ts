import * as Courses from '../Courses';
import { BaseAssignment } from './BaseAssignment';

export class Assignment extends BaseAssignment {
  public get course() {
    return Courses.get(this.course_id);
  }

  private constructor(base: BaseAssignment) {
    super();
    Object.assign(this, base);
  }

  public static fromBase(base: BaseAssignment) {
    const assignment = new Assignment(base);
    return assignment;
  }
}
