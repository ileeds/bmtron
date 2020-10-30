import React, { memo } from 'react';
import styled from 'styled-components';

const Square = styled.div`
  display: flex;
  border: 1px solid black;
  background-color: ${({ color }) => color ? color : 'white' };
  height: 0.5vw;
  width: 0.5vw;
`;

const Circle = styled.div`
  display: flex;
  background-color: ${({ color }) => color };
  height: 0.5vw;
  width: 0.5vw;
  border-radius: 100%;
`;

const Cell = ({ color, circle }) => {
  return (
    <Square color={!circle && color} circle={circle}>
      {circle && <Circle color={color} />}
    </Square>
  );
}

export default memo(Cell);
