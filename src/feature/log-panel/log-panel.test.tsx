import React from 'react';
import { Provider } from 'react-redux';
import Enzyme, { mount } from 'enzyme';
import EnzymeAdapter from 'enzyme-adapter-react-16';
import { configureStore, createStore } from '@reduxjs/toolkit';

import robotReducer, { EDirection, IAppState, combinedReducers } from '../../store';
import LogPanel from './log-panel';

export const storeFactory = (initialState: any) => {
  return createStore(robotReducer, initialState);
}

Enzyme.configure({ adapter: new EnzymeAdapter() });

describe('log panel', () => {
  const x = 0;
  const y = 0;

  const lines = ['LEFT', 'MOVE', 'RIGHT'];
  const initialState: IAppState = {
    robotPlacement: {
      x,
      y,
      direction: EDirection.EAST
    },
    log: lines
  };
  
  it('should correctly display log messages in the scrollable log area', () => {
    const reducer = { ...combinedReducers, preloadedState: { robot: initialState } };
    const store = configureStore(reducer);
    
    const wrapper = mount(<Provider store={store}><LogPanel /></Provider>);
    
    const outputDiv = wrapper.find("[data-test='output-line']");

    expect(outputDiv.length).toBe(lines.length);
    expect(outputDiv.at(0).text()).toBe(lines[0]);

    const index = lines.length - 1;
    expect(outputDiv.at(index).text()).toBe(lines[index]);
  });
});