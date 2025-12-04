import { Canvas } from '../../../CanvasAPIClient';
import { PlannerItem } from './PlannerItem';

export * from './PlannerItem';

const cache: Record<string, PlannerItem[]> = {};

export async function listItemsBetween(
  start: Date,
  end: Date
): Promise<PlannerItem[]> {
  const key = JSON.stringify({ start, end });
  if (!(key in cache)) {
    cache[key] = (
      await Canvas.v1.Planner.Items.list({
        searchParams: {
          start_date: start.toISOString(),
          end_date: end.toISOString()
        }
      })
    ).map((item) => PlannerItem.fromBase(item));
  }
  return cache[key];
}
