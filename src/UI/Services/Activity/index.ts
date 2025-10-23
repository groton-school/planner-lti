import { Events } from '@groton/canvas-api.client.web';
import PQueue from 'p-queue';
import './styles.scss';

const activity = document.getElementById('activity');
const queue = new PQueue({ concurrency: 1 });
const backgroundRequests: string[] = [];

function init() {
  document.addEventListener(Events.RequestStartedEvent.name, show);
  document.addEventListener(Events.RequestCompleteEvent.name, hide);
}

export function prepareBackgroundRequest() {
  const requestId = crypto.randomUUID();
  backgroundRequests.push(requestId);
  return requestId;
}

function isBackground(event: Event): boolean {
  const isBackground =
    'requestId' in event &&
    typeof event.requestId === 'string' &&
    backgroundRequests.includes(event.requestId);
  return isBackground;
}

export function show(event: Event) {
  queue.add(async () => {
    if (activity && !isBackground(event)) {
      activity.dataset.processes = (
        parseInt(activity.dataset.processes || '0') + 1
      ).toString();
    }
  });
}

export function hide(event: Event) {
  queue.add(async () => {
    if (activity && !isBackground(event)) {
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

init();
