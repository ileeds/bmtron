import React, { useCallback, useState } from 'react';
import styled, { css, keyframes } from 'styled-components';
import find from 'lodash/find';
import isEmpty from 'lodash/isEmpty';
import map from 'lodash/map';
import size from 'lodash/size';
import {
  useSocketGameState,
  useSocketPlayerColor,
} from '../../../socket';
import ColorPicker from './colorPicker';
import TeamPicker from './teamPicker';
import { isOnTeam } from '../../../util';

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
  }
`;

const Container = styled.div`
  width: 100%;
  text-align: center;
  margin-top: 16px;
  margin-bottom: 16px;
  font-size: 3vw;
`;

const Item = styled.div`
  ${({ circle }) => circle && 'border-radius: 100%' };
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
  const { countdown, scores, teams } = useSocketGameState();
  const color = useSocketPlayerColor();
  const [displayColorDropdown, setDisplayColorDropdown] = useState(false);
  const [teamPickerColor, setTeamPickerColor] = useState(false);
  const handleClickMyColor = () => {
    if (countdown === null) {
      setDisplayColorDropdown(!displayColorDropdown);
    }
  };
  const handleClickOtherColor = (key) => {
    const didSomeoneWin = find(scores, (val, _key) => val > 0);
    if (!didSomeoneWin && size(scores) >= 4 && isEmpty(teams)) {
      setTeamPickerColor(teamPickerColor ? null : key);
    }
  };
  const handleExit = useCallback(() => {
    setDisplayColorDropdown(false);
    setTeamPickerColor(null);
  }, []);

  return (
    <Container>
      {map(scores, (val, key) => {
        const isMyColor = color === key;
        return (
          <>
            <Item
              circle={isOnTeam(teams, color, key)}
              color={key}
              isMyColor={isMyColor}
              onClick={isMyColor ? handleClickMyColor : () => handleClickOtherColor(key)}
            >
              {val}
            </Item>
          </>
        );
      })}
      {teamPickerColor && <TeamPicker onSelect={handleExit} color={teamPickerColor} />}
      {displayColorDropdown && <ColorPicker onSelect={handleExit} color={color} />}
    </Container>
  );
}

export default ScoreBoard;
