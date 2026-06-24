import { createRoot } from 'react-dom/client';
import 'antd/dist/reset.css';
import './renderer/i18n';
import { App } from './renderer/App';
import './renderer/styles.css';

const container = document.getElementById('root');
if (!container) {
  throw new Error('Root container #root introuvable dans index.html');
}

createRoot(container).render(<App />);
