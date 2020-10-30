import React, { memo } from 'react';
import styled from 'styled-components';
import { emitSelectTeammate } from '../../../../socket';

const PickerContainer = styled.div`
  display: flex;
  justify-content: space-around;
  margin-top: 16px;
`;

const ColorItem = styled.div`
  color: white;
  background-color: ${({ color }) => color };
  width: 10vw;
  font-size: 1vw;
`;

const TeamPicker = ({ onSelect, color }) => {
  const handleClick = () => {
    emitSelectTeammate(color);
    onSelect();
  };

  return (
    <PickerContainer>
      <ColorItem onClick={handleClick} color={color}>
        {`Click to make ${color} your teammate`}
      </ColorItem>
    </PickerContainer>
  );
}

export default memo(TeamPicker);
