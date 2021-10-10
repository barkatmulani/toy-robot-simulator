import React from 'react';
import { Container } from 'react-bootstrap';
import { useSelector } from 'react-redux';

import { EDirection, maxX, maxY, selectPlacement } from '../../store';

import './board.scss';

const Board = () => {
    const placement = useSelector(selectPlacement);
    const MARKER = {
        [EDirection.NORTH]: '▲',
        [EDirection.EAST]: '►',
        [EDirection.SOUTH]: '▼',
        [EDirection.WEST]: '◄'
    };

    let rows = [];

    for (let r = 0; r <= maxX; r++) {
        let cols = [];
        for (let c = 0; c <= maxX; c++) {
            let marker = '';
            if (placement.direction && (placement.direction !== EDirection.NONE) &&
                (c === placement.x) && (r === (maxY - placement.y))) {
                marker = MARKER[placement.direction];
            }            
            cols.push(marker);
        }
        rows.push(cols);
    }

    return (
        <Container fluid className="board">
            <h5>Board</h5>

            <table>
                <tbody>
                    {
                        !rows?.length ? <></> :
                        rows.map((row: any, r: number) => (
                            <tr key={r}>
                            {
                                !row.length ? <></> :
                                row.map((col: string, c: number) => (
                                    <td key={c}>{col}</td>
                                ))
                            }
                            </tr>
                        ))
                    }
                </tbody>
            </table>
        </Container>
    );
};

export default Board;