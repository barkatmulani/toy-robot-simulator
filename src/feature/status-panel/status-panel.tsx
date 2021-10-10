import React from 'react';
import { Col, Container, Row } from "react-bootstrap"
import { useSelector } from 'react-redux';

import { selectPlacement } from '../../store/selectors/robotSelector';

import './status-panel.scss';

const StatusPanel = () => {
    const placement = useSelector(selectPlacement);

    return (
        <Container fluid className="status-panel">
            <h5>Current Placement</h5>
            <Row>
                <Col md={12}>
                    <Row>
                        <Col sm={12}><label>x</label></Col>
                        <Col sm={12}><input readOnly value={placement.x} /></Col>
                    </Row>
                </Col>
                <Col md={12}>
                    <Row>
                        <Col sm={12}><label>y</label></Col>
                        <Col sm={12}><input readOnly value={placement.y} /></Col>
                    </Row>
                </Col>
                <Col md={12}>
                    <Row>
                        <Col sm={12}><label>Direction</label></Col>
                        <Col sm={12}><input readOnly value={placement.direction} /></Col>
                    </Row>
                </Col>
            </Row>
      </Container>
    );
};

export default StatusPanel;