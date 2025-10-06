import { Calendar } from '@fullcalendar/core';
import { Canvas } from '../../Services';
import { PlannerEvent } from './PlannerEvent';
import './styles.scss';

export * from './PlannerEvent';

export class PlannerItem {
  private event?: PlannerEvent;

  public constructor(private item: Canvas.Planner.PlannerItem) {
    // TODO handle with non-assignment planner items
    // TODO handle assignments without due dates
    if (item.plannable_type === 'assignment' && item.plannable.due_at) {
      this.event = PlannerEvent.fromAssignmentPlannerItem(item);
    }
  }

  public addTo(calendar: Calendar) {
    if (this.event) {
      this.event.addTo(calendar);
    }
  }

  public async toggle() {
    return await this.item.toggle();
  }
}
