import {
  DateTimeString,
  PathString,
  URLString
} from '@battis/descriptive-types';
import { EventInput } from '@fullcalendar/core';
import * as Canvas from '@groton/canvas-cli.api';
import * as Colors from './Colors';
import { paginatedCallback } from './paginatedCallback';

type CanvasPlannerItem = {
  context_type: string;
  course_id?: number;
  plannable_id: number;
  planner_override?: Canvas.Planner.PlannerOverride;
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
  };
  html_url: PathString;
  context_name: string;
  context_image: URLString;
};

export class PlannerItem {
  private constructor(private item: CanvasPlannerItem) {}

  public static list = paginatedCallback<CanvasPlannerItem, PlannerItem>(
    '/api/v1/planner/items',
    (item: CanvasPlannerItem) => new PlannerItem(item)
  );

  public toEvent(): EventInput {
    const color = `var(${Colors.varNameFromCourseId(this.item.course_id)})`;
    return {
      id: `${this.item.plannable_type}_${this.item.plannable.id}`,
      title: this.item.plannable.title,
      start: new Date(this.item.plannable_date),
      classNames: [
        Colors.classNameFromCourseId(this.item.course_id),
        this.item.submissions?.graded ||
        this.item.submissions?.submitted ||
        this.item.planner_override?.dismissed ||
        this.item.planner_override?.marked_complete
          ? 'done'
          : 'not-done'
      ],
      backgroundColor: color,
      textColor: color,
      borderColor: color,
      extendedProps: this.item
    };
  }
}
