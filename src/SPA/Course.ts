import * as Canvas from '@groton/canvas-cli.api';

export class Course {
  private static cache: Record<string | number, Course> = {};

  private constructor(private course: Canvas.Courses.Course) {}

  public static async get(course_id: string | number) {
    if (!(course_id in this.cache)) {
      this.cache[course_id] = new Course(
        await (await fetch(`/api/v1/courses/${course_id}`)).json()
      );
    }
    return this.cache[course_id];
  }

  public courseCode() {
    return this.course.course_code;
  }
}
