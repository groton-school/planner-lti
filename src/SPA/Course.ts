import * as Canvas from '@groton/canvas-cli.api';
import { stringify } from '@groton/canvas-cli.utilities';
import { Options, paginatedCallback } from './Utilities/paginatedCallback';

const minimalCourse = {
  id: undefined,
  isTeacher: () => false,
  context_code: 'course_undefined'
};

export class Course {
  private static cache: Record<string | number, Course> = {};

  private static lists: Record<string, Course[]> = {};

  private constructor(private course: Canvas.Courses.Course) {
    Course.cache[course.id] = this;
  }

  public static async list({
    callback,
    params = {}
  }: Options<Course, Canvas.v1.Users.Courses.listSearchParameters> = {}) {
    const key = stringify(params);
    if (!(key in Course.lists)) {
      Course.lists[key] = await paginatedCallback<
        Canvas.Courses.Course,
        Course,
        Canvas.v1.Users.Courses.listSearchParameters
      >(
        '/canvas/api/v1/users/self/favorites/courses',
        (course) => new Course(course)
      )({ callback, params });
    } else if (callback) {
      for (const course of Course.lists[key]) {
        callback(course);
      }
    }
    return Course.lists[key];
  }

  public static async get(course_id: string | number) {
    if (!(course_id in this.cache)) {
      return new Course(
        await (await fetch(`/canvas/api/v1/courses/${course_id}`)).json()
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

  public get context_code() {
    return `course_${this.course.id}`;
  }

  public static fromName(name: string) {
    for (const id in this.cache) {
      if (this.cache[id].course.name == name) {
        return this.cache[id];
      }
    }
    return minimalCourse;
  }

  public static fromContextCode(context_code: string) {
    for (const id in this.cache) {
      if (context_code === `course_${id}`) {
        return this.cache[id];
      }
    }
    return minimalCourse;
  }
}
