import * as Canvas from '@groton/canvas-cli.api';
import bootstrap from 'bootstrap';
import * as Colors from './Colors';
import { Course } from './Course';
import { paginatedCallback } from './paginatedCallback';

type Options = { course_id: string | number; assignment_id: string | number };

export class Assignment {
  private static cache: Record<string | number, Assignment> = {};

  private constructor(private assignment: Canvas.Assignments.Assignment) {
    Assignment.cache[assignment.id] = this;
  }

  public static async list(
    course_id: string | number,
    callback?: (assignment: Assignment) => unknown
  ) {
    return await paginatedCallback<Canvas.Assignments.Assignment, Assignment>(
      `/api/v1/courses/${course_id}/assignments?include[]=submission`,
      (assignment) => new Assignment(assignment)
    )(callback);
  }

  public static async get({ course_id, assignment_id }: Options) {
    if (!(assignment_id in this.cache)) {
      return new Assignment(
        await (
          await fetch(
            `/api/v1/courses/${course_id}/assignments/${assignment_id}?include[]=submission`
          )
        ).json()
      );
    }
    return this.cache[assignment_id];
  }

  public async modal() {
    const modal = document.createElement('div');
    modal.classList.add('modal');
    modal.tabIndex = -1;
    modal.innerHTML = `
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header ${Colors.classNameFromCourseId(this.assignment.course_id)}">
          <div class="modal-title">
            <small>
              ${(await Course.get(this.assignment.course_id)).course_code}
            </small>
            <h5>
              ${this.assignment.name}
            </h5>
          </div>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <div class="d-flex">
            <strong class="p-1">Due</strong>
            <span class="p-1">${new Date(
              this.assignment.due_at
            ).toLocaleDateString('en-us', {
              month: 'short',
              day: 'numeric'
            })} at ${new Date(this.assignment.due_at).toLocaleTimeString(
              'en-us',
              {
                hour: 'numeric',
                minute: '2-digit'
              }
            )}</span>${
              this.assignment.points_possible
                ? // @ts-expect-error-next-line 2339
                  `<strong class="ms-auto p-1">Points</strong> <span class="p-1">${this.assignment.submission?.entered_grade ? `${this.assignment.submission.entered_grade} / ` : ''}${
                    this.assignment.points_possible
                  }${this.assignment.submission?.workflow_state ? ` (${this.assignment.submission.workflow_state})` : ''}</span>`
                : ''
            }
          </div>
            ${this.assignment.description ? `<hr/>${this.assignment.description}` : ''}
        </div>
        <div class="modal-footer">
          <a
            target="_top"
            href="${consumer_instance_url}/courses/${this.assignment.course_id}/assignments/${this.assignment.id}"
            type="button"
            class="btn btn-brand-primary"
          >
            Details
          </a>
        </div>
      </div>
    </div>
  `;
    document.body.appendChild(modal);
    new bootstrap.Modal(modal).show();
  }
}
