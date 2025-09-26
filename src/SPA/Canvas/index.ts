import {
  AuthorizationEvent,
  AuthorizationRequired,
  Canvas
} from '@groton/canvas-api.client.web';
import bootstrap from 'bootstrap';
import * as cookie from 'cookie';
import * as Activity from '../Activity';
import { render } from '../Utilities/Views';
import authorizeModal from './authorize.modal.ejs';

await Canvas.init();

export * from './Assignment';
export * from './AssignmentGroup';
export * from './CalendarEvent';
export * as Colors from './Colors';
export * from './Course';
export * from './PlannerItem';

document.addEventListener(AuthorizationRequired, async (event) => {
  const { authorize_url } = event as AuthorizationEvent;
  const { 'planner-session': session } = cookie.parse(document.cookie);
  Activity.reset();
  const modal = await render({
    template: authorizeModal,
    parent: document.body,
    data: {
      authorize_url: authorize_url + `?session=${session}`
    }
  });
  const bsModal = new bootstrap.Modal(modal);
  modal.querySelector('#authorize')?.addEventListener('click', () => {
    bsModal.hide();
  });
  bsModal.show();
});
