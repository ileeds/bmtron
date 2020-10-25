import React, { memo } from 'react';
import styled from 'styled-components';

const Square = styled.div`
  display: flex;
  border: 1px solid black;
  background-color: ${({ color }) => color ? color : 'white' };
  height: 0.5vw;
  width: 0.5vw;
`;

const Cell = ({ color }) => {
  return (
    <Square color={color} />
  );
}

export default memo(Cell);
