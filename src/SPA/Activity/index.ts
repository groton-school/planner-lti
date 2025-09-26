import PQueue from 'p-queue';
import './styles.scss';

const activity = document.getElementById('activity');
const queue = new PQueue({ concurrency: 1 });

export function show() {
  queue.add(async () => {
    if (activity) {
      activity.dataset.processes = (
        parseInt(activity.dataset.processes || '0') + 1
      ).toString();
    }
  });
}

export function hide() {
  queue.add(async () => {
    if (activity) {
      activity.dataset.processes = (
        parseInt(activity.dataset.processes || '1') - 1
      ).toString();
    }
  });
}

export function reset() {
  if (activity) {
    activity.dataset.processes = '0';
  }
}
