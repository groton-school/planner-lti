import { Canvas } from '@groton/canvas-api.client.web';
import * as Courses from './Courses';
import * as Users from './Users';

export * as AssignmentGroups from './AssignmentGroups';
export * as Assignments from './Assignments';
export * as Courses from './Courses';
export * as Planner from './Planner';
export * as Sections from './Sections';
export * as Users from './Users';

export const v1 = Canvas.v1;

export async function init() {
  Canvas.init();
  await Promise.all([Courses.init(), Users.init()]);
}
