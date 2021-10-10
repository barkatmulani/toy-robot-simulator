import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { EDirection } from '../models';
import { maxX, maxY, DIRECTIONS } from '../constants';

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

      if (isPlacementValid(action.payload, state)) {
        state.robotPlacement.x = parseInt(action.payload.x.toString());
        state.robotPlacement.y = parseInt(action.payload.y.toString());

        if (action.payload.direction) {
          state.robotPlacement.direction = action.payload.direction;
        }

        state.log?.push(`PLACE ${x}, ${y}${direction ? ', ' + direction : ''}`);
      }
    },

    move: (state) => {
      let newPos: IPosition = { x: state.robotPlacement.x, y: state.robotPlacement.y };
      
      switch (state.robotPlacement.direction) {
        case EDirection.EAST: newPos.x += 1; break;
        case EDirection.WEST: newPos.x -= 1; break;
        case EDirection.NORTH: newPos.y += 1; break;
        case EDirection.SOUTH: newPos.y -= 1; break;
      }
      
      const newPlacement = { ...newPos, direction: state.robotPlacement.direction };

      if (isPlacementValid(newPlacement, state)) {
        state.robotPlacement.x = newPos.x;
        state.robotPlacement.y = newPos.y;

        state.log?.push('MOVE');
      }
    },

    left: (state) => {
      if (isStateValid(state)) {
        let index = DIRECTIONS.findIndex((direction: EDirection) => direction === state.robotPlacement.direction);
        index--;
        if (index < 0) index = DIRECTIONS.length - 1;
        state.robotPlacement.direction = DIRECTIONS[index];
        state.log?.push('LEFT');
      }
    },

    right: (state) => {
      if (isStateValid(state)) {
        let index = DIRECTIONS.findIndex((direction: EDirection) => direction === state.robotPlacement.direction);
        index++;
        if (index >= DIRECTIONS.length) index = 0;
        state.robotPlacement.direction = DIRECTIONS[index];
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

const isPlacementValid = (placement: IRobotPlacement, state: IAppState) => {
  const { x, y, direction } = placement;
  const isDirectionValid = ((direction && (direction !== EDirection.NONE)) || isStateValid(state));
  
  return isDirectionValid &&
          (x >= 0) && (x <= maxX) &&
          (y >= 0) && (y <= maxY);
}

export const { place, move, left, right, report } = robotSlice.actions;

export default robotSlice.reducer;
