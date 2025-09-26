import { Canvas } from '@groton/canvas-api.client.web';

export class AssignmentGroup {
  private static cache: Record<string | number, AssignmentGroup[]> = {};

  private constructor(
    private assignmentGroup: Canvas.AssignmentGroups.AssignmentGroup
  ) {}

  public static async list(
    course_id: Canvas.v1.Courses.AssignmentGroups.listPathParameters['course_id'],
    callback?: (g: AssignmentGroup) => unknown
  ) {
    if (!(course_id in this.cache)) {
      const assignmentGroups = (
        await Canvas.v1.Courses.AssignmentGroups.list({
          pathParams: { course_id }
        })
      ).map((a) => new AssignmentGroup(a));
      this.cache[course_id] = assignmentGroups;
    }
    if (callback) {
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
