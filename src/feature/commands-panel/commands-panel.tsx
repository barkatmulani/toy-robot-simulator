import React from 'react';
import { Button, Col, Container, Form, Row } from "react-bootstrap"
import { useForm } from 'react-hook-form';

import { DIRECTIONS } from '../../store/constants';
import { useAppDispatch } from '../../store/hooks';
import { EDirection } from '../../store/models';
import { move, left, right, report, place } from '../../store/slices/robotSlice';
import { useSelector } from 'react-redux';
import { selectPlacement } from '../../store';

import './commands-panel.scss';

const CommandsPanel = () => {
    const defaultValues = { x: 0, y: 0, direction: EDirection.NORTH };
    const { register, handleSubmit, getValues } = useForm({ defaultValues });
    const dispatch = useAppDispatch();
    const placement = useSelector(selectPlacement);
    const notPlaced = placement.direction === EDirection.NONE;
    console.log(placement);

    const onSubmit = () => {
        const payload = getValues();
        dispatch(place(payload));
    };

    return (
        <Container fluid className="commands-panel">
            <h5>Commands</h5>
            <Form onSubmit={handleSubmit(onSubmit)}>
                <Row className="placement-panel">
                    <h6>Placement</h6>
                    <Col md={3}>
                        <label>x</label>
                        <input type="number" {...register('x')} />
                    </Col>
                    <Col md={3}>
                        <label>y</label>
                        <input type="number" {...register('y')} />
                    </Col>
                    <Col md={3}>
                        <label>Direction</label>
                        <select {...register('direction')}>
                            {
                                DIRECTIONS.map((direction: EDirection, d: number) => (
                                    <option key={d} value={direction}>{direction}</option>
                                ))
                            }
                        </select>
                    </Col>
                    <Col className="mt-3">
                        <Button variant="danger" aria-label="Place" type="submit">
                            Place
                        </Button>
                    </Col>
                </Row>
            </Form>
            <Row className="buttons-panel">
                <Col md={3}>
                    <Button  variant="success" aria-label="Left" disabled={notPlaced} onClick={() => dispatch(left())}>
                        Left
                    </Button>
                </Col>
                <Col md={3}>
                    <Button variant="primary" aria-label="Move" disabled={notPlaced} onClick={() => dispatch(move())} data-test='move-btn'>
                        Move
                    </Button>
                </Col>
                <Col md={3}>
                    <Button variant="success" aria-label="Right" disabled={notPlaced} onClick={() => dispatch(right())}>
                        Right
                    </Button>
                </Col>
                <Col md={3}>
                    <Button variant="secondary" aria-label="Report" disabled={notPlaced} onClick={() => dispatch(report())}>
                        Report
                    </Button>
                </Col>
            </Row>
      </Container>
    );
};

export default CommandsPanel;