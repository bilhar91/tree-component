import React from 'react';
import { shallow } from '../enzyme';
import App from '../App';

describe('Tree component test list', () => {
  it('render <App /> component', () => {
    const wrapper = shallow(<App />);
    expect(wrapper.find('Tree component')).toBeDefined();
  });

  it('render list', () => {
    const wrapper = shallow(<App />);
    expect(wrapper.find('ul')).toBeDefined();
  });
});