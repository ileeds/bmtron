import React, { memo } from 'react';
import styled from 'styled-components';
import map from 'lodash/map';
import { useSocketAvailableColors, emitSelectColor } from '../../../../socket';

const PickerContainer = styled.div`
  display: flex;
  justify-content: space-around;
  margin-top: 16px;
`;

const ColorItem = styled.div`
  color: white;
  background-color: ${({ color }) => color };
  width: 10vw;
`;

const ColorPicker = ({ onSelect, color }) => {
  const availableColors = useSocketAvailableColors();
  const handleSelect = selected => {
    emitSelectColor(selected);
    onSelect();
  };

  if (!availableColors) {
    return null;
  }
  return (
    <PickerContainer>
      <ColorItem onClick={() => handleSelect(color)} key={color} color={color}>{color}</ColorItem>
      {map(availableColors, c => {
        return <ColorItem onClick={() => handleSelect(c)} key={c} color={c}>{c}</ColorItem>;
      })}
    </PickerContainer>
  );
}

export default memo(ColorPicker);
