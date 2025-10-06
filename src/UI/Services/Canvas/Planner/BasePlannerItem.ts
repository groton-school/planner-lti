// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import { DateTimeString } from '@battis/descriptive-types';
import { ArrayElement } from '@battis/typescript-tricks';
import { Canvas } from '@groton/canvas-api.client.web';

// TODO @groton/canvas-api should export PlannerItem
type TPlannerItem = ArrayElement<
  Awaited<ReturnType<typeof Canvas.v1.Planner.Items.list>>
>;

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface IPlannerItem extends TPlannerItem {}

export class BasePlannerItem implements IPlannerItem {
  context_type: string;
  course_id?: number | undefined;
  plannable_id: number;
  planner_override?: Canvas.Planner.PlannerOverride | undefined;
  plannable_type: string;
  new_activity: boolean;
  submissions?:
    | {
        submitted: boolean;
        excused: boolean;
        graded: boolean;
        posted_at: DateTimeString<'ISO'>;
        late: boolean;
        missing: boolean;
        needs_grading: boolean;
        has_feedback: boolean;
        redo_request: boolean;
      }
    | undefined;
  plannable_date: string;
  plannable: {
    id: number;
    title: string;
    created_at: DateTimeString<'ISO'>;
    updated_at: DateTimeString<'ISO'>;
    points_possible?: number;
    due_at: DateTimeString<'ISO'>;
    read_state?: 'unread' | 'read';
  };
  html_url: string;
  context_name: string;
  context_image: string;
}
