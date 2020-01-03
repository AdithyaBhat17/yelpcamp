import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import { ToastProvider } from 'react-toast-notifications';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(
    <ToastProvider>
      <App />
    </ToastProvider>,
    div
  );
  ReactDOM.unmountComponentAtNode(div);
});
