import { EventInput } from '@fullcalendar/core';
import * as Utilities from '../../Utilities';
import { render } from '../../Utilities/Views';
import * as Canvas from '@groton/canvas-cli.api';
import * as Client from '../Client';
import * as Colors from '../Colors';
import { Course } from '../Course';
import './styles.scss';
import todo from './todo.ejs';

export class PlannerItem {
  private static cache: PlannerItem[] = [];

  private constructor(private item: Canvas.Planner.PlannerItem) {
    PlannerItem.cache.push(this);
  }

  public static list = Utilities.paginatedCallback<
    Canvas.Planner.PlannerItem,
    PlannerItem,
    Canvas.v1.Users.Planner.Items.listSearchParameters
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
      this.item.planner_override = await Client.Put<
        Canvas.Planner.PlannerOverride,
        Canvas.v1.Planner.Overrides.updatePathParameters,
        never,
        Canvas.v1.Planner.Overrides.updateFormParameters
      >({
        endpoint: '/canvas/api/v1/planner/overrides/:id',
        params: {
          path: { id: this.item.planner_override.id.toString() },
          form: {
            marked_complete: true.toString(),
            dismissed: true.toString()
          }
        }
      });
    } else {
      this.item.planner_override = await Client.Post<
        Canvas.Planner.PlannerOverride,
        never,
        never,
        Canvas.v1.Planner.Overrides.createFormParameters
      >({
        endpoint: '/canvas/api/v1/planner/overrides',
        params: {
          form: {
            plannable_type: this.item.plannable_type,
            plannable_id: this.item.plannable_id,
            marked_complete: true,
            dismissed: true
          }
        }
      });
    }
  }

  public async markIncomplete() {
    if (this.item.planner_override) {
      this.item.planner_override = await Client.Put<
        Canvas.Planner.PlannerOverride,
        Canvas.v1.Planner.Overrides.updatePathParameters,
        never,
        Canvas.v1.Planner.Overrides.updateFormParameters
      >({
        endpoint: '/canvas/api/v1/planner/overrides/:id',
        params: {
          path: { id: this.item.planner_override.id.toString() },
          form: {
            marked_complete: false.toString(),
            dismissed: false.toString()
          }
        }
      });
    }
  }

  public async toEvent(): Promise<EventInput> {
    const start = new Date(this.item.plannable_date);
    return {
      id: `${this.item.plannable_type}_${this.item.plannable.id}`,
      title: this.item.plannable.title,
      start,
      allDay: start.getHours() === 23 && start.getMinutes() === 59,
      classNames: [
        Colors.classNameFromCourseId(this.item.course_id),
        'canvas',
        'planner_item',
        this.item.plannable_type,
        this.done ? 'done' : ''
      ]
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

  public static fromAssignmentId(plannable_id: string | number) {
    return this.cache.find(
      (item) =>
        item.plannable_type === 'assignment' &&
        `${item.plannable_id}` === `${plannable_id}`
    );
  }
}
