import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

import CommandsPanel from '../commands-panel/commands-panel';
import LogPanel from '../log-panel/log-panel';
import StatusPanel from '../status-panel/status-panel';
import './robot.scss';

export const Robot = () => {
  return (
    <Container className="robot-simulator">
      <h3 className="text-center mb-4">Toy Robot Simulator</h3>
      <Row>
        <Col sm={5}>
          <CommandsPanel />
          <StatusPanel />
        </Col>
        <Col sm={7}>
          <LogPanel />
        </Col>
      </Row>
    </Container>
  );
};