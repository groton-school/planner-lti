import { Canvas } from '@groton/canvas-api.client.web';
import { BasePlannerItem } from './BasePlannerItem';

export class PlannerItem extends BasePlannerItem {
  public get done() {
    return !!(
      this.submissions?.graded ||
      this.submissions?.submitted ||
      this.planner_override?.dismissed ||
      this.planner_override?.marked_complete ||
      this.plannable.read_state === 'read'
    );
  }

  private constructor(item: BasePlannerItem) {
    super();
    Object.assign(this, item);
  }

  public static fromBase(item: BasePlannerItem) {
    return new PlannerItem(item);
  }

  public async markComplete() {
    if (this.planner_override) {
      this.planner_override = await Canvas.v1.Planner.Overrides.update({
        pathParams: { id: this.planner_override.id },
        params: {
          marked_complete: true.toString(),
          dismissed: true.toString()
        }
      });
    } else {
      this.planner_override = await Canvas.v1.Planner.Overrides.create({
        params: {
          plannable_type: this.plannable_type,
          plannable_id: this.plannable_id,
          marked_complete: true,
          dismissed: true
        }
      });
    }
  }

  public async markIncomplete() {
    if (this.planner_override) {
      this.planner_override = await Canvas.v1.Planner.Overrides.update({
        pathParams: { id: this.planner_override.id },
        params: {
          marked_complete: false.toString(),
          dismissed: false.toString()
        }
      });
    } else {
      this.planner_override = await Canvas.v1.Planner.Overrides.create({
        params: {
          plannable_type: this.plannable_type,
          plannable_id: this.plannable_id,
          marked_complete: false,
          dismissed: false
        }
      });
    }
  }

  public async toggle() {
    if (this.done) {
      await this.markIncomplete();
      return false;
    } else {
      await this.markComplete();
      return true;
    }
  }
}
