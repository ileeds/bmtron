import React from 'react';
import styled from 'styled-components';

import GameMessage from './gameMessage';
import Grid from '../grid';
import GameTrigger from './gameTrigger';

const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  margin-top: 5%;
`;

const Game = () => {
  return (
    <Container>
      <GameMessage />
      <Grid />
      <GameTrigger />
    </Container>
  );
}

export default Game;
