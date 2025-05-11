import { EventInput } from '@fullcalendar/core';
import { stringify } from '@groton/canvas-cli.utilities';
import todo from '../../../views/ejs/PlannerItem/todo.ejs';
import * as Canvas from '../Canvas';
import * as Colors from '../Colors';
import { Course } from '../Course';
import * as Utilities from '../Utilities';
import { render } from '../Views';
import './styles.scss';

export class PlannerItem {
  private constructor(private item: Canvas.Planner.PlannerItem) {}

  public static list = Utilities.paginatedCallback<
    Canvas.Planner.PlannerItem,
    PlannerItem
  >(
    '/canvas/api/v1/planner/items',
    (item: Canvas.Planner.PlannerItem) => new PlannerItem(item)
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
      this.item.planner_override?.marked_complete ||
      this.item.plannable.read_state === 'read'
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
          `/canvas/api/v1/planner/overrides/${this.item.planner_override.id}`,
          {
            method: 'PUT',
            body: stringify({
              marked_complete: 'true',
              dismissed: 'true'
            })
          }
        )
      ).json();
    } else {
      this.item.planner_override = await (
        await fetch('/canvas/api/v1/planner/overrides', {
          method: 'POST',
          body: stringify({
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
          `/canvas/api/v1/planner/overrides/${this.item.planner_override.id}`,
          {
            method: 'PUT',
            body: stringify({
              marked_complete: 'false',
              dismissed: 'false'
            })
          }
        )
      ).json();
    }
  }

  public async toEvent(): Promise<EventInput> {
    const start = new Date(this.item.plannable_date);
    const course = await Course.get(this.item.plannable_id);
    return {
      id: `${this.item.plannable_type}_${this.item.plannable.id}`,
      title: this.item.plannable.title,
      start,
      allDay: start.getHours() === 23 && start.getMinutes() === 59,
      classNames: [
        Colors.classNameFromCourseId(this.item.course_id),
        'planner_item',
        this.done ? 'done' : ''
      ],
      extendedProps: { planner_item: this, course }
    };
  }

  public async toTodo() {
    return await render({
      template: todo,
      data: {
        consumer_instance_url,
        done: this.done,
        item: this.item,
        course: this.item.course_id
          ? await Course.get(this.item.course_id)
          : undefined
      }
    });
  }
}
