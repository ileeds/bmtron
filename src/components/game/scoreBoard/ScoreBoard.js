import React, { useCallback, useState } from 'react';
import styled, { css, keyframes } from 'styled-components';
import map from 'lodash/map';
import {
  useSocketGameState,
  useSocketPlayerColor,
} from '../../../socket';
import ColorPicker from './colorPicker';

const pulseAnimation = keyframes`
  0% {
		transform: scale(0.95);
		box-shadow: 0 0 0 0 rgba(0, 0, 0, 0.7);
	}
	70% {
		transform: scale(1);
		box-shadow: 0 0 0 10px rgba(0, 0, 0, 0);
	}
	100% {
		transform: scale(0.95);
		box-shadow: 0 0 0 0 rgba(0, 0, 0, 0);
	}`;

const Container = styled.div`
  width: 100%;
  text-align: center;
  margin-top: 16px;
  margin-bottom: 16px;
  font-size: 3vw;
`;

const Item = styled.div`
  background-color: ${({ color }) => color };
  color: white;
  width: 4vw;
  padding-left: 0.5vw;
  margin-left: 0.5vw;
  padding-right: 0.5vw;
  margin-right: 0.5vw;
  display: inline;
  animation: ${({ isMyColor }) => isMyColor ? css`${pulseAnimation} 2s infinite` : ''};
`;

const ScoreBoard = () => {
  const { scores } = useSocketGameState();
  const color = useSocketPlayerColor();
  const [displayColorDropdown, setDisplayColorDropdown] = useState(false);
  const handleClickMyColor = () => {
    setDisplayColorDropdown(!displayColorDropdown);
  };
  const handleExit = useCallback(() => {
    setDisplayColorDropdown(false);
  }, []);

  return (
    <Container>
      {map(scores, (val, key) => {
        const isMyColor = color === key;
        return (
          <>
            <Item
              color={key}
              isMyColor={isMyColor}
              onClick={isMyColor ? handleClickMyColor : null}
            >
              {val}
            </Item>
          </>
        );
      })}
      {displayColorDropdown && <ColorPicker onSelect={handleExit} color={color} />}
    </Container>
  );
}

export default ScoreBoard;
