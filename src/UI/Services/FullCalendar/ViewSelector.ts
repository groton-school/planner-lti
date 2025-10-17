import { Calendar, CustomButtonInput } from '@fullcalendar/core';
import { camelCase } from 'change-case-all';
import * as Cookies from '../Cookies';
import {
  fcButtonActive,
  fcCustomButton,
  fcHeaderToolbar
} from './fc-class-names';

type Style = 'grid' | 'list';
type Duration = 'day' | 'week' | 'month';
type CookieData = { d: Duration; s: Style };

export class ViewSelector {
  private static readonly Views: Record<Style, Record<Duration, string>> = {
    grid: {
      day: 'timeGridDay',
      week: 'timeGridWeek',
      month: 'dayGridMonth'
    },
    list: {
      day: 'listDay',
      week: 'listWeek',
      month: 'listMonth'
    }
  };

  public get view() {
    return ViewSelector.Views[this.style][this.duration];
  }

  private static readonly CookieName = 'calendar-view';
  private duration: Duration = 'week';
  private style: Style = 'grid';

  public get toolbar() {
    return 'toDay,toWeek,toMonth toGrid,toList';
  }

  public readonly CustomButtons: Record<string, CustomButtonInput> = {
    toDay: {
      text: 'Day',
      icon: 'calendar-event',
      click: (_event, elt) => this.changeView(this.style, 'day', elt)
    },
    toWeek: {
      text: 'Week',
      icon: 'calendar-week',
      click: (_event, elt) => this.changeView(this.style, 'week', elt)
    },
    toMonth: {
      text: 'Month',
      icon: 'calendar3',
      click: (_event, elt) => this.changeView(this.style, 'month', elt)
    },
    toGrid: {
      text: 'Grid',
      icon: 'grid-fill',
      click: (_event, elt) => this.changeView('grid', this.duration, elt)
    },
    toList: {
      text: 'List',
      icon: 'list-task',
      click: (_event, elt) => this.changeView('list', this.duration, elt)
    }
  };

  public get cookieData(): CookieData {
    return { d: this.duration, s: this.style };
  }

  private set cookieData({ d, s }: CookieData) {
    this.duration = d;
    this.style = s;
  }

  public constructor(private calendar: Promise<Calendar>) {
    const cookieData = Cookies.get<CookieData>(ViewSelector.CookieName);
    if (cookieData) {
      this.cookieData = cookieData;
    }
    this.setInitialSelection();
  }

  private async setInitialSelection() {
    new MutationObserver((mutations, observer) => {
      for (const mutation of mutations) {
        for (const node of mutation.addedNodes) {
          if (
            node instanceof Element &&
            node.classList.contains(fcHeaderToolbar)
          ) {
            for (const button of node.querySelectorAll(
              `.${fcCustomButton(
                camelCase(`to ${this.duration}`)
              )}, .${fcCustomButton(camelCase(`to ${this.style}`))}`
            )) {
              button.classList.add(fcButtonActive);
              button.setAttribute('disabled', 'true');
            }
          }
          observer.disconnect();
        }
      }
    }).observe((await this.calendar).el, { childList: true, subtree: true });
  }

  private async changeView(
    newStyle: Style,
    newDuration: Duration,
    elt: HTMLElement
  ) {
    this.toggleActiveView(elt);
    this.style = newStyle;
    this.duration = newDuration;
    (await this.calendar).changeView(this.view);
    Cookies.set<CookieData>(ViewSelector.CookieName, this.cookieData);
  }

  private toggleActiveView(elt: HTMLElement) {
    for (const button of elt.closest('.btn-group')?.querySelectorAll('.btn') ||
      []) {
      button.classList.remove(fcButtonActive);
      button.removeAttribute('disabled');
    }
    const button = elt.closest('.btn');
    button?.classList.add(fcButtonActive);
    button?.setAttribute('disabled', 'true');
  }
}
