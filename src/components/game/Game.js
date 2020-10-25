import React from 'react';
import styled from 'styled-components';

import GameMessage from './gameMessage';
import GameTrigger from './gameTrigger';
import Grid from '../grid';
import ScoreBoard from './scoreBoard';

const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  margin-top: 5%;
`;

const Game = () => {
  return (
    <Container>
      <ScoreBoard />
      <GameMessage />
      <Grid />
      <GameTrigger />
    </Container>
  );
}

export default Game;
