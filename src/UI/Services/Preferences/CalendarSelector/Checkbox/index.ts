import { render } from 'ejs';
import checkbox from './checkbox.ejs';

export const HierarchyUpdated = 'checkbox-hierarchy-updated';

export enum State {
  Checked,
  Unchecked,
  Indeterminate
}

export class Checkbox {
  private static readonly all: Record<Checkbox['id'], Checkbox> = {};

  public static bind(root: Element) {
    root.querySelectorAll<HTMLDivElement>('div[id]').forEach((div) => {
      const input = div.querySelector<HTMLInputElement>(
        `input#toggle-${div.id}`
      );
      if (input && div.id in Checkbox.all) {
        Checkbox.all[div.id].bindTo(input);
      }
    });
  }

  public readonly id: string = `x${crypto.randomUUID()}`;
  private _children: Checkbox[] = [];
  private input?: HTMLInputElement = undefined;

  public get state() {
    return this._state;
  }

  public set state(state: State) {
    this._state = state;
    if (this.input) {
      this.input.checked = this.checked;
      this.input.indeterminate = this.indeterminate;
    }
  }

  public get checked() {
    return this.state === State.Checked;
  }

  public get indeterminate() {
    return this.state === State.Indeterminate;
  }

  public get children() {
    return this._children;
  }

  public get collapsed() {
    return this._collapsed;
  }

  public set collapsed(value: boolean) {
    this._collapsed = value;
    if (this._collapsed && this.input) {
      this.input
        .closest(`#${this.id}`)
        ?.querySelector(`#collapse-${this.id}`)
        ?.classList.remove('show');
      this.input
        .closest(`#${this.id}`)
        ?.querySelector(`[href="#collapse-${this.id}"]`)
        ?.classList.add('collapsed');
    }
  }

  public constructor(
    public readonly classNames: string[],
    public readonly label: string,
    private _state: State,
    private parent?: Checkbox,
    private _collapsed = false
  ) {
    this.parent?.appendChild(this);
    Checkbox.all[this.id] = this;
  }

  public appendChild(...children: Checkbox[]) {
    this._children.push(...children);
    for (const child of children) {
      child.parent = this;
    }
  }

  public render() {
    return render(checkbox, this);
  }

  public bindTo(input: HTMLInputElement) {
    this.input = input;
    this.input.addEventListener('change', this.handleChange.bind(this));
  }

  private handleChange() {
    this._state = this.input?.checked
      ? State.Checked
      : this.input?.indeterminate
        ? State.Indeterminate
        : State.Unchecked;
    if (this.state !== State.Indeterminate) {
      this.propagateDown();
    }
    this.propagateUp();
    document.dispatchEvent(new Event(HierarchyUpdated));
  }

  private propagateDown() {
    for (const child of this.children) {
      child.state = this.state;
      child.propagateDown();
    }
  }

  private propagateUp() {
    if (this.parent) {
      for (const sibling of this.parent.children) {
        if (sibling !== this) {
          if (this.state !== sibling.state) {
            this.parent.state = State.Indeterminate;
            break;
          } else {
            this.parent.state = this.state;
          }
        }
      }
      this.parent.propagateUp();
    }
  }
}
