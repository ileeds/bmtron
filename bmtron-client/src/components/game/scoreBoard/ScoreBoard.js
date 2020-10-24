import React from 'react';
import styled from 'styled-components';
import capitalize from 'lodash/capitalize';
import map from 'lodash/map';
import { useSocketGameState } from '../../../socket';

const Container = styled.div`
  width: 100%;
  text-align: center;
  margin-top: 16px;
  margin-bottom: 16px;
  font-size: 3vw;
`;

const Row = styled.div`
  background-color: ${({ color }) => color };
  color: white;
  width: 4vw;
  padding-left: 0.5vw;
  margin-left: 0.5vw;
  padding-right: 0.5vw;
  margin-right: 0.5vw;
  display: inline;
`;

const GameMessage = () => {
  const { scores } = useSocketGameState();
  return (
    <Container>
      {map(scores, (val, key) => {
        return <Row color={key}>{val}</Row>;
      })}
    </Container>
  );
}

export default GameMessage;
