import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { EDirection } from '../models';
import { maxX, maxY, directions } from '../constants';

interface IPosition {
  x: number;
  y: number;
}

export interface IRobotPlacement extends IPosition {
  direction?: EDirection,
}

export interface IAppState {
  robotPlacement: IRobotPlacement,
  log?: string[]
}

const initialState: IAppState = {
  robotPlacement: {
    x: 0,
    y: 0,
    direction: EDirection.NONE
  },
  log: []
};

export const robotSlice = createSlice({
  name: 'robot',
  initialState,
  reducers: {
    place: (state, action: PayloadAction<IRobotPlacement>) => {
      const { x, y, direction } = action.payload;
      if ((direction || (state.robotPlacement.direction !== EDirection.NONE)) &&
          (x >= 0) && (x <= maxX) && (y >= 0) &&
          (y <= maxY)) {
        state.robotPlacement.x = action.payload.x;
        state.robotPlacement.y = action.payload.y;
        if (action.payload.direction) state.robotPlacement.direction = action.payload.direction;
        state.log?.push(`PLACE ${x}, ${y} ${direction ? ',' + direction : ''}`);
      }
    },

    move: (state) => {
      if (isStateValid(state)) {

        let newPos: IPosition = { x: state.robotPlacement.x, y: state.robotPlacement.y };

        switch (state.robotPlacement.direction) {
          case EDirection.EAST: newPos.x += 1; break;
          case EDirection.WEST: newPos.x -= 1; break;
          case EDirection.NORTH: newPos.y += 1; break;
          case EDirection.SOUTH: newPos.y -= 1; break;
        }

        let validMove = true;

        if (newPos.x < 0) {
          newPos.x = 0;
          validMove = false;
        }
        else if (newPos.x > maxX) {
          newPos.x = maxX;
          validMove = false;
        }

        if (newPos.y < 0) {
          newPos.y = 0;
          validMove = false;
        }
        else if (newPos.y > maxY) {
          newPos.y = maxY;
          validMove = false;
        }

        state.robotPlacement.x = newPos.x;
        state.robotPlacement.y = newPos.y;

        if (validMove) state.log?.push('MOVE');
      }
    },

    left: (state) => {
      if (isStateValid(state)) {
        let index = directions.findIndex((direction: EDirection) => direction === state.robotPlacement.direction);
        index--;
        if (index < 0) index = directions.length - 1;
        state.robotPlacement.direction = directions[index];
        state.log?.push('LEFT');
      }
    },

    right: (state) => {
      if (isStateValid(state)) {
        let index = directions.findIndex((direction: EDirection) => direction === state.robotPlacement.direction);
        index++;
        if (index >= directions.length) index = 0;
        state.robotPlacement.direction = directions[index];
        state.log?.push('RIGHT');
      }
    },

    report: (state) => {
      state.log?.push('REPORT');
      state.log?.push(`Output: ${state.robotPlacement.x}, ${state.robotPlacement.y}, ${state.robotPlacement.direction}`);
    },
  },
});

const isStateValid = (state: IAppState) => {
  return state.robotPlacement.direction !== EDirection.NONE;
};

export const { place, move, left, right, report } = robotSlice.actions;

export default robotSlice.reducer;
