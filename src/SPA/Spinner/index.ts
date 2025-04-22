import './styles.scss';

type Options = { centered?: boolean };

export function Spinner({ centered = false }: Options = {}) {
  const spinner = 'Loading&hellip;';
  if (centered) {
    return `<div class="m-5 px-5 pt-5 pb-4 text-center">${spinner}</div>`;
  }
  return spinner;
}
