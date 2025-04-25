import { URLString } from '@battis/descriptive-types';
import * as Canvas from '@groton/canvas-cli.api';
import { paginatedCallback } from './paginatedCallback';

type CanvasTodoItem = {
  type: string;
  assignment?: Canvas.Assignments.Assignment;
  ignore: URLString;
  ignore_permanently: URLString;
  html_url: URLString;
} & (
  | {
      context_type: 'course';
      course_id: number;
      group_id: never;
    }
  | {
      context_type: 'group';
      course_ud: never;
      group_id: number;
    }
);

export class TodoItem {
  private constructor(private item: CanvasTodoItem) {}

  public static list = paginatedCallback<CanvasTodoItem, TodoItem>(
    '/api/v1/users/self/todo',
    (item: CanvasTodoItem) => new TodoItem(item)
  );

  public hasDate() {
    return !!this.item.assignment && !!this.item.assignment.due_at;
  }

  public card() {
    const card = document.createElement('div');
    card.classList.add('card');
    card.innerHTML = `
    <div class="card-body">
      <h5 class="card-title">Card title</h5>
      <h6 class="card-subtitle mb-2 text-body-secondary">Card subtitle</h6>
      <pre class="card-text">${JSON.stringify(this.item, null, 2)}</pre>
      <a href="#" class="card-link">Card link</a>
      <a href="#" class="card-link">Another link</a>
    </div>
`;
    return card;
  }
}
