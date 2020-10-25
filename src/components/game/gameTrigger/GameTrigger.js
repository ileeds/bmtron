import React from 'react';
import styled from 'styled-components';
import size from 'lodash/size';
import { emitStartGame, useSocketGameState } from '../../../socket';

const Container = styled.div`
  width: 100%;
  text-align: center;
  margin-top: 16px;
  margin-bottom: 16px;
  font-size: 3vw;
`;

const GameTrigger = () => {
  const { countdown, activeColors } = useSocketGameState();
  if (size(activeColors) < 2) {
    return null;
  }
  return (
    <Container onClick={emitStartGame}>
      {countdown === null && 'Click me to start'}
    </Container>
  );
}

export default GameTrigger;
