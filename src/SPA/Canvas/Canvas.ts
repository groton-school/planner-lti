import {
  DateTimeString,
  PathString,
  URLString
} from '@battis/descriptive-types';
import { Planner as CanvasPlanner } from '@groton/canvas-cli.api';

export * from '@groton/canvas-cli.api';

/* eslint @typescript-eslint/no-namespace: 0 */
export namespace Planner {
  export type PlannerOverride = CanvasPlanner.PlannerOverride;
  export type PlannerNote = CanvasPlanner.PlannerNote;

  export type PlannerItem = {
    context_type: string;
    course_id?: number;
    plannable_id: number;
    planner_override?: CanvasPlanner.PlannerOverride;
    plannable_type: string;
    new_activity: boolean;
    submissions?: {
      submitted: boolean;
      excused: boolean;
      graded: boolean;
      posted_at: DateTimeString<'ISO'>;
      late: boolean;
      missing: boolean;
      needs_grading: boolean;
      has_feedback: boolean;
      redo_request: boolean;
    };
    plannable_date: DateTimeString<'ISO'>;
    plannable: {
      id: number;
      title: string;
      created_at: DateTimeString<'ISO'>;
      updated_at: DateTimeString<'ISO'>;
      points_possible?: number;
      due_at: DateTimeString<'ISO'>;
      read_state?: 'unread' | 'read';
    };
    html_url: PathString;
    context_name: string;
    context_image: URLString;
  };
}
