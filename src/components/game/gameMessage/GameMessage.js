import React from 'react';
import styled from 'styled-components';
import capitalize from 'lodash/capitalize';
import join from 'lodash/join';
import map from 'lodash/map';
import { useSocketGameState, useSocketPlayerColor } from '../../../socket';

const Container = styled.div`
  width: 100%;
  text-align: center;
  margin-top: 16px;
  margin-bottom: 16px;
  font-size: 3vw;
`;

const GameMessage = () => {
  const color = useSocketPlayerColor();
  const { countdown, winner } = useSocketGameState();
  let message = '';
  if (winner === 'DRAW') {
    message = 'Draw';
  } else if (winner) {
    const name = join(map(winner, w => capitalize(w)), '-');
    message = `${name} wins!`;
  } else if (countdown) {
    message = countdown;
  } else if (color) {
    message = `You are ${color}`;
  }
  return (
    <Container>
      {message}
    </Container>
  );
}

export default GameMessage;
