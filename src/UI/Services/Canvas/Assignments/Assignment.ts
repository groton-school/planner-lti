import { Canvas } from '../../../CanvasAPIClient';
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

  public async setImportantDates(important_dates: boolean) {
    this.important_dates = (
      await Canvas.v1.Courses.Assignments.update({
        pathParams: this,
        // TODO fix assignment update params list
        // @ts-expect-error 2353
        params: { 'assignment[important_dates]': important_dates }
      })
    ).important_dates;
  }
}
