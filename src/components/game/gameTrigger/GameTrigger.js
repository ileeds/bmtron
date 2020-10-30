import React, { useState } from 'react';
import styled from 'styled-components';
import find from 'lodash/find';
import isEmpty from 'lodash/isEmpty';
import size from 'lodash/size';
import { emitStartGame, emitEndGame, useSocketGameState, useSocketPlayerColor } from '../../../socket';

const Container = styled.div`
  margin-left: 35%;
  margin-right: 35%;
  display: flex;
  justify-content: space-around;
  width: 100%;
`;

const ConfirmContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 4px;
`;

const ConfirmButtonContainer = styled.div`
  display: flex;
`;

const ConfirmTextContainer = styled.div`
  font-size: 16px;
`;

const Button = styled.button`
  text-align: center;
  margin: 16px 4px 16px 4px;
  font-size: 3vw;
`;

const GameTrigger = () => {
  const color = useSocketPlayerColor();
  const { countdown, scores, teams } = useSocketGameState();
  const [displayConfirm, setDisplayConfirm] = useState(false);
  const didSomeoneWin = find(scores, (val, _key) => val > 0);
  if (size(scores) < 2) {
    return null;
  }
  return (
    <Container>
      {countdown === null && color && (
        <Button onClick={emitStartGame}>
          Start
        </Button>
      )}
      {displayConfirm && (
        <ConfirmContainer>
          <ConfirmTextContainer>Are you sure?</ConfirmTextContainer>
          <ConfirmButtonContainer>
            <Button onClick={() => {
              setDisplayConfirm(false);
              emitEndGame();
            }}>
              Yes
            </Button>
            <Button onClick={() => setDisplayConfirm(false)}>
              No
            </Button>
          </ConfirmButtonContainer>
        </ConfirmContainer>
      )}
      {(!isEmpty(teams) || (didSomeoneWin && color)) && !displayConfirm && (
        <Button onClick={() => setDisplayConfirm(true)}>
          Reset
        </Button>
      )}
    </Container>
  );
}

export default GameTrigger;
