import * as Canvas from '@groton/canvas-cli.api';
import * as Colors from './Colors';
import { paginatedCallback } from './paginatedCallback';

export class Course {
  private static cache: Record<string | number, Course> = {};

  private constructor(private course: Canvas.Courses.Course) {
    Course.cache[course.id] = this;
  }

  public static list = paginatedCallback<Canvas.Courses.Course, Course>(
    '/api/v1/users/self/courses',
    (course) => new Course(course)
  );

  public static async get(course_id: string | number) {
    if (!(course_id in this.cache)) {
      return new Course(
        await (await fetch(`/api/v1/courses/${course_id}`)).json()
      );
    }
    return this.cache[course_id];
  }

  public get id() {
    return this.course.id;
  }

  public get course_code() {
    return this.course.course_code;
  }

  public get name() {
    return this.course.name;
  }

  public get className() {
    return Colors.classNameFromCourseId(this.course.id);
  }

  public static fromName(name: string) {
    for (const id in this.cache) {
      if (this.cache[id].course.name == name) {
        return this.cache[id];
      }
    }
    return undefined;
  }
}
