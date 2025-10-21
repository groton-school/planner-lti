import { Canvas } from '@groton/canvas-api.client.web';
import { CalendarCache } from '../../CalendarCache';
import { PlannerItem } from './PlannerItem';

export * from './PlannerItem';

const cache = new CalendarCache<PlannerItem['plannable_id'], PlannerItem>();

export async function listItemsBetween(
  start: Date,
  end: Date
): Promise<PlannerItem[]> {
  const cached = cache.get(start, end);
  if (cached) {
    return cached;
  }
  return cache.pushTimeframe(
    (item) => [item.plannable_date, item.plannable_id, item],
    start,
    end,
    (
      await Canvas.v1.Planner.Items.list({
        searchParams: {
          start_date: start.toISOString(),
          end_date: end.toISOString()
        }
      })
    ).map((item) => PlannerItem.fromBase(item))
  );
}
