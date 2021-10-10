import React, { useEffect, useRef } from 'react';
import { Container } from "react-bootstrap"
import { useSelector } from 'react-redux';

import { selectLog } from '../../store/selectors/robotSelector';

import './log-panel.scss';

const LogPanel = () => {
    const log = useSelector(selectLog);

    const AlwaysScrollToBottom = () => {
        const elementRef = useRef(null);
        useEffect(() => {
            const element = (elementRef.current as any);
            if (element?.scrollIntoView) element?.scrollIntoView();
        });
        return <div ref={elementRef} />;
    };

    const style = {
        height: (window.innerHeight - 120)
    }

    return (
        <Container fluid className="log-panel">
            <h5>Log</h5>
            <div className="output" style={style} data-test="output">
                {
                    !log?.length ? <></> :
                    log?.map((line: string, l: number) => (
                        <div key={l} data-test="output-line">{line}</div>
                    ))
                }
                <AlwaysScrollToBottom />
            </div>
      </Container>
    );
};

export default LogPanel;