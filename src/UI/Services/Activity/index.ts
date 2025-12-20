import { CustomButtonInput } from '@fullcalendar/core';
import PQueue from 'p-queue';
import { Events } from '../../CanvasAPIClient';
import './styles.scss';

const queue = new PQueue({ concurrency: 1 });
const backgroundRequests: string[] = [];
let processes = 0;

/** Define custom `activity` button */
export function customButtons({
  text,
  click
}: {
  text?: string;
  click: CustomButtonInput['click'];
}) {
  return {
    activity: {
      text,
      icon: 'arrow-clockwise',
      click
    }
  };
}

function init() {
  document.addEventListener(Events.RequestStartedEvent.name, show);
  document.addEventListener(Events.RequestCompleteEvent.name, hide);
}

let _elt: HTMLButtonElement | null = null;
function elt() {
  if (null === _elt) {
    _elt = document.querySelector<HTMLButtonElement>(
      'button.fc-activity-button'
    );
  }
  return _elt;
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

export function show(event?: Event) {
  queue.add(async () => {
    processes++;
    if (elt() && (!event || !isBackground(event))) {
      elt()!.dataset.processes = `${processes}`;
    }
  });
}

export function hide(event?: Event) {
  queue.add(async () => {
    processes--;
    if (elt() && (!event || !isBackground(event))) {
      elt()!.dataset.processes = `${processes}`;
    }
  });
}

export function reset() {
  if (elt()) {
    elt()!.dataset.processes = '0';
  }
}

init();
