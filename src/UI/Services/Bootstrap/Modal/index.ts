import bootstrap from 'bootstrap';
import { render } from '../../../Utilities';
import modalTemplate from './modal.ejs';

type ModalOptions = {
  closeable?: boolean;
  title: string;
  titleClassNames?: string[];
  body: string;
  classNames?: string[];
};

export async function create({
  closeable = true,
  titleClassNames = ['h5'],
  classNames = [],
  ...rest
}: ModalOptions) {
  const elt = await render({
    template: modalTemplate,
    parent: document.body,
    data: { ...rest, titleClassNames, classNames, closeable }
  });
  const modal = new bootstrap.Modal(elt);
  elt.addEventListener('hidden.bs.modal', () => modal.dispose());
  modal.show();
  return modal;
}

export function stackTitle(title: string, caption: string) {
  return {
    title: `<small>${caption}</small><h5>${title}</h5>`,
    titleClassNames: ['d-flex', 'flex-column']
  };
}
