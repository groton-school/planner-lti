import { Spinner } from './Spinner';
import './styles.scss';

(async () => {
  const content = document.getElementById('content');
  if (content) {
    content.innerHTML = Spinner({ centered: true });
  }
})();
