import {
  AuthorizationEvent,
  AuthorizationRequired,
  Canvas
} from '@groton/canvas-api.client.web';
import * as cookie from 'cookie';
import { render } from 'ejs';
import * as Activity from '../Activity';
import * as Bootstrap from '../Bootstrap';
import * as Courses from './Courses';
import * as Users from './Users';
import authorize from './authorize.ejs';

export * as AssignmentGroups from './AssignmentGroups';
export * as Assignments from './Assignments';
export * as Courses from './Courses';
export * as Planner from './Planner';
export * as Sections from './Sections';
export * as Users from './Users';

export const v1 = Canvas.v1;

export async function init() {
  document.addEventListener(AuthorizationRequired, handleAuthorization);
  Canvas.init();
  await Promise.all([Courses.init(), Users.init()]);
}

async function handleAuthorization(event: Event) {
  const { authorize_url } = event as AuthorizationEvent;
  const { 'planner-session': session } = cookie.parse(document.cookie);
  Activity.reset();
  const { modal, elt } = await Bootstrap.Modal.create({
    title: 'Authorization',
    body: render(authorize, {
      authorize_url: authorize_url + `?session=${session}`
    })
  });
  elt.querySelector('#authorize')?.addEventListener('click', () => {
    modal.hide();
  });
}
