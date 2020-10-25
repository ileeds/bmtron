import React from 'react';
import styled from 'styled-components';
import find from 'lodash/find';
import size from 'lodash/size';
import { emitStartGame, emitEndGame, useSocketGameState, useSocketPlayerColor } from '../../../socket';

const Container = styled.div`
  margin-left: 35%;
  margin-right: 35%;
  display: flex;
  justify-content: space-around;
  width: 100%;
`;

const Button = styled.button`
  text-align: center;
  margin-top: 16px;
  margin-bottom: 16px;
  font-size: 3vw;
`;

const GameTrigger = () => {
  const color = useSocketPlayerColor();
  const { activeColors, countdown, scores } = useSocketGameState();
  const didSomeoneWin = find(scores, (val, _key) => {
    console.log(val);
    return val > 0;
  });
  if (size(activeColors) < 2) {
    return null;
  }
  return (
    <Container>
      {countdown === null && color && (
        <Button onClick={emitStartGame}>
          Start
        </Button>
      )}
      {didSomeoneWin && (
        <Button onClick={emitEndGame}>
          Reset
        </Button>
      )}
    </Container>
  );
}

export default GameTrigger;
