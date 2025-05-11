import * as Canvas from '@groton/canvas-cli.api';
import { Options, paginatedCallback } from './Utilities/paginatedCallback';

type ListOptions = Options<
  AssignmentGroup,
  Canvas.v1.Courses.AssignmentGroups.listSearchParameters
> & {
  course_id: string;
};

export class AssignmentGroup {
  private static cache: Record<string | number, AssignmentGroup[]> = {};

  private constructor(
    private assignmentGroup: Canvas.AssignmentGroups.AssignmentGroup
  ) {}

  public static async list({ course_id, callback }: ListOptions) {
    if (!(course_id in this.cache)) {
      const assignmentGroups = await paginatedCallback(
        `/canvas/api/v1/courses/${course_id}/assignment_groups`,
        (assignmentGroup: Canvas.AssignmentGroups.AssignmentGroup) =>
          new AssignmentGroup(assignmentGroup)
      )({ callback });
      this.cache[course_id] = assignmentGroups;
    } else if (callback) {
      for (const assigmentGroup of this.cache[course_id]) {
        callback(assigmentGroup);
      }
    }
    return this.cache[course_id];
  }

  public get id() {
    return this.assignmentGroup.id;
  }

  public get name() {
    return this.assignmentGroup.name;
  }
}
