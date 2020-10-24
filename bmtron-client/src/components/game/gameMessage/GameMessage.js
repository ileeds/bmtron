import React from 'react';
import styled from 'styled-components';
import capitalize from 'lodash/capitalize';
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
  let message;
  if (winner) {
    message = `${capitalize(winner)} wins!`
  } else if (countdown) {
    message = countdown;
  } else {
    message = `You are ${color}`;
  }
  return (
    <Container>
      {message}
    </Container>
  );
}

export default GameMessage;
