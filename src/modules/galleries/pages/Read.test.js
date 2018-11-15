import React from 'react';
import ReactDOM from 'react-dom';
import Read from './Read';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Read />, div);
  ReactDOM.unmountComponentAtNode(div);
});
