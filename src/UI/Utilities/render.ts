import ejs from 'ejs';

type Options = {
  template: string;
  parent?: Element;
  data?: ejs.Data;
  options?: ejs.Options;
  placement?: 'append' | 'prepend' | 'replace';
};

/**
 * @returns Rendered template element (or first element of rendered template if
 *   more than one)
 */
export async function render<T = Element>({
  template,
  data,
  options,
  parent,
  placement = 'append'
}: Options) {
  const container = document.createElement('div');
  container.innerHTML = await ejs.render(template, data, options);
  const elements = Array.from(container.children);
  if (parent) {
    switch (placement) {
      case 'append':
        parent.append(...elements);
        break;
      case 'prepend':
        parent.prepend(...elements);
        break;
      case 'replace':
        parent.replaceWith(...elements);
        break;
    }
  }
  return elements[0] as T;
}
