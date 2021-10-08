import Enzyme from 'enzyme';
import EnzymeAdapter from 'enzyme-adapter-react-16';

import { EDirection } from '../models';
import { directions, maxY } from '../constants';
import robotReducer, { IRobotPlacement, place, move, left, right, IAppState, report } from './robotSlice';

Enzyme.configure({ adapter: new EnzymeAdapter() });

describe('robot reducer', () => {
  const x = 0;
  const y = 0;
  const initialState: IAppState = {
    robotPlacement: {
      x,
      y,
      direction: EDirection.EAST
    },
    log: []
  };
  it('should handle initial state', () => {
    expect(robotReducer(undefined, { type: 'unknown' })).toEqual({
      robotPlacement: {
        x: 0,
        y: 0,
        direction: 'NONE'
      },
      log: []
    });
  });

  describe('should handle MOVE by moving the robot to one unit in the present direction', () => {
    const placement: IRobotPlacement = { x: 3, y: 3 };

    it('towards EAST', () => {
      const direction = EDirection.EAST;
      const initState: IAppState = { robotPlacement: { ...placement, direction }};

      const actual = robotReducer(initState, move());

      const expected = { ...initState.robotPlacement, x: initState.robotPlacement.x + 1 };
      expect(actual.robotPlacement).toEqual(expected);
    });

    it('towards WEST', () => {
      const direction = EDirection.WEST;
      const initState: IAppState = { robotPlacement: { ...placement, direction }};
      
      const actual = robotReducer(initState, move());
      
      const expected = { ...initState.robotPlacement, x: initState.robotPlacement.x - 1 };
      expect(actual.robotPlacement).toEqual(expected);
    });

    it('towards NORTH', () => {
      const direction = EDirection.NORTH;
      const initState: IAppState = { robotPlacement: { ...placement, direction }};
      
      const actual = robotReducer(initState, move());
      
      const expected = { ...initState.robotPlacement, y: initState.robotPlacement.y + 1 };
      expect(actual.robotPlacement).toEqual(expected);
    });

    it('towards SOUTH', () => {
      const direction = EDirection.SOUTH;
      const initState: IAppState = { robotPlacement: { ...placement, direction }};
      
      const actual = robotReducer(initState, move());
      
      const expected = { ...initState.robotPlacement, y: initState.robotPlacement.y - 1 };
      expect(actual.robotPlacement).toEqual(expected);
    });
  });

  describe('should handle change in the direction', () => {
    describe('towards LEFT', () => {
      it('abstract', () => {
        const actual = robotReducer(initialState, left());

        let index = directions.findIndex((direction: EDirection) => direction === initialState.robotPlacement.direction);
        index--;
        if (index < 0) index = directions.length - 1;
        const newDirection = directions[index];

        expect(actual.robotPlacement.direction).toEqual(newDirection);
      });

      it('concrete', () => {
        const actual = robotReducer(initialState, left());
        const newDirection = EDirection.NORTH;
        expect(actual.robotPlacement.direction).toEqual(newDirection);
      });
    });

    describe('towards RIGHT', () => {
      it('abstract', () => {
        const actual = robotReducer(initialState, right());

        let index = directions.findIndex((direction: EDirection) => direction === initialState.robotPlacement.direction);
        index++;
        if (index >= directions.length) index = 0;
        const newDirection = directions[index];

        expect(actual.robotPlacement.direction).toEqual(newDirection);
      });

      it('concrete', () => {
        const actual = robotReducer(initialState, right());
        const newDirection = EDirection.SOUTH;
        expect(actual.robotPlacement.direction).toEqual(newDirection);
      });
    });
  });

  describe('should end in the correct state after executing multiple commands', () => {
    it('set 1', () => {
      const commands = [
        place({ x: 0, y: 0, direction: EDirection.NORTH }),
        move()
      ];

      let newState = executeCommands(initialState, commands);

      const expected = { x: 0, y: 1, direction: EDirection.NORTH };
      expect(newState.robotPlacement).toEqual(expected);
    });

    it('set 2', () => {
      const commands = [
        place({ x: 0, y: 0, direction: EDirection.NORTH }),
        left()
      ];

      let newState = executeCommands(initialState, commands);

      const expected = { x: 0, y: 0, direction: EDirection.WEST };
      expect(newState.robotPlacement).toEqual(expected);
    });

    it('set 3', () => {
      const commands = [
        place({ x: 1, y: 2, direction: EDirection.EAST }),
        move(),
        move(),
        left(),
        move()
      ];

      let newState = executeCommands(initialState, commands);

      const expected = { x: 3, y: 3, direction: EDirection.NORTH };
      expect(newState.robotPlacement).toEqual(expected);
    });

    it('set 4', () => {
      const commands = [
        place({ x: 1, y: 2, direction: EDirection.EAST }),
        move(),
        left(),
        move(),
        place({ x: 3, y: 1 }),
        move()
      ];

      let newState = executeCommands(initialState, commands);

      const expected = { x: 3, y: 2, direction: EDirection.NORTH };
      expect(newState.robotPlacement).toEqual(expected);
    });
  });

  it('should discard any PLACE command if it places the robot outside of the table surface', () => {
    const oldState = robotReducer(initialState, place({ x: 1, y: 1, direction: EDirection.EAST }));
    
    const newState1 = robotReducer(oldState, place({ x: 0, y: maxY + 1, direction: EDirection.NORTH }));
    expect(newState1.robotPlacement).toEqual(oldState.robotPlacement);
    
    const newState2 = robotReducer(oldState, place({ x: -1, y: maxY, direction: EDirection.WEST }));
    expect(newState2.robotPlacement).toEqual(oldState.robotPlacement);
  });
  
  it('should not be effected by any command unless a first valid PLACE command is issued', () => {
    const lastPlacement = initialState.robotPlacement;

    const commands = [
      left(),
      move(),
      right(),
      place(initialState.robotPlacement)
    ];

    const finalState = executeCommands(initialState, commands);

    expect(finalState.robotPlacement).toEqual(lastPlacement);
  });

  it('should discard all commands in the sequence until a valid PLACE command has been executed', () => {
    const invalidPlacement = { x: -1, y: 6, direction: EDirection.EAST };
    const validPlacement = { x: 1, y: 1, direction: EDirection.NORTH };

    const commands = [
      place(invalidPlacement),
      left(),
      move(),
      right(),
      place(validPlacement),
      left(),
      move()
    ];

    const actualState = executeCommands(initialState, commands);

    const expected = { x: 0, y: 1, direction: EDirection.WEST };
    expect(actualState.robotPlacement).toEqual(expected);
  });

    
  it('should pick the direction of the previous PLACE command if the new PLACE command is missing the direction', () => {
    const prevPlacement = initialState.robotPlacement;
    const nextPlacement: IRobotPlacement = {
      x: 1,
      y: 1
    };

    const commands = [
      place(prevPlacement),
      place(nextPlacement)
    ];

    const finalState = executeCommands(initialState, commands);

    expect(finalState.robotPlacement.direction).toEqual(prevPlacement.direction);
  });

  it('should log correctly', () => {
    const commands = [
      place({ x: 0, y: 0, direction: EDirection.EAST }),
      left(),
      move(),
      right(),
      move(),
      left(),
      report()
    ];

    const finalState = executeCommands(initialState, commands);

    const expected = [ "PLACE 0, 0, EAST", "LEFT", "MOVE", "RIGHT", "MOVE", "LEFT", "REPORT", "Output: 1, 1, NORTH"];
    expect(finalState.log).toEqual(expected);
  });
});

const executeCommands = (initialState: IAppState, commands: any[]) => {
  let newState = initialState;

  commands.forEach((command: any) => {
    newState = robotReducer(newState, command);
  });

  return newState;
};