import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

import CommandsPanel from '../commands-panel/commands-panel';
import LogPanel from '../log-panel/log-panel';
import Board from '../board/board';
import StatusPanel from '../status-panel/status-panel';

import './robot.scss';

export const Robot = () => {
  return (
    <Container fluid className="robot-simulator">
      <h3 className="text-center mb-4">Toy Robot Simulator</h3>
      <Row>
        <Col sm={6}>
          <Row>
            <Col xs={12}>
              <CommandsPanel />
            </Col>
            <Col lg={7} xl={6}>
              <Board />
            </Col>
            <Col lg={5} xl={6}>
              <StatusPanel />
            </Col>
          </Row>
        </Col>
        <Col sm={6}>
          <LogPanel />
        </Col>
      </Row>
    </Container>
  );
};