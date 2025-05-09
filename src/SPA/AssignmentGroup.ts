import * as Canvas from '@groton/canvas-cli.api';
import { paginatedCallback } from './paginatedCallback';

export class AssignmentGroup {
  private static cache: Record<string | number, AssignmentGroup[]> = {};

  private constructor(
    private assignmentGroup: Canvas.AssignmentGroups.AssignmentGroup
  ) {}

  public static async list(
    course_id: string | number,
    callback?: (assignmentGroup: AssignmentGroup) => unknown
  ) {
    if (!(course_id in this.cache)) {
      const assignmentGroups = await paginatedCallback<
        Canvas.AssignmentGroups.AssignmentGroup,
        AssignmentGroup
      >(
        `/canvas/api/v1/courses/${course_id}/assignment_groups`,
        (assignmentGroup) => new AssignmentGroup(assignmentGroup)
      )(callback);
      this.cache[course_id] = assignmentGroups;
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
