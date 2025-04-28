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

  public get plannable_type() {
    return this.item.plannable_type;
  }

  public get plannable_id() {
    return this.item.plannable_id;
  }

  public get plannable_date() {
    return this.item.plannable_date;
  }

  public get course_id() {
    return this.item.course_id;
  }

  public get done() {
    return (
      this.item.submissions?.graded ||
      this.item.submissions?.submitted ||
      this.item.planner_override?.dismissed ||
      this.item.planner_override?.marked_complete
    );
  }

  public isEvent() {
    return (
      this.item.plannable_type === 'assignment' && !!this.item.plannable_date
    );
  }

  public async markComplete() {
    if (this.item.planner_override) {
      this.item.planner_override = await (
        await fetch(
          `/api/v1/planner/overrides/${this.item.planner_override.id}`,
          {
            method: 'PUT',
            body: new URLSearchParams({
              marked_complete: 'true',
              dismissed: 'true'
            })
          }
        )
      ).json();
    } else {
      this.item.planner_override = await (
        await fetch('/api/v1/planner/overrides', {
          method: 'POST',
          body: new URLSearchParams({
            plannable_type: this.item.plannable_type,
            plannable_id: this.item.plannable_id.toString(),
            marked_complete: 'true',
            dismissed: 'true'
          })
        })
      ).json();
    }
  }

  public async markIncomplete() {
    if (this.item.planner_override) {
      this.item.planner_override = await (
        await fetch(
          `/api/v1/planner/overrides/${this.item.planner_override.id}`,
          {
            method: 'PUT',
            body: new URLSearchParams({
              marked_complete: 'false',
              dismissed: 'false'
            })
          }
        )
      ).json();
    }
  }

  public toEvent(): EventInput {
    const color = `var(${Colors.varNameFromCourseId(this.item.course_id)})`;
    return {
      id: `${this.item.plannable_type}_${this.item.plannable.id}`,
      title: this.item.plannable.title,
      start: new Date(this.item.plannable_date),
      classNames: [
        Colors.classNameFromCourseId(this.item.course_id),
        this.done ? 'done' : ''
      ],
      backgroundColor: color,
      textColor: color,
      borderColor: color,
      extendedProps: { planner_item: this }
    };
  }
}
