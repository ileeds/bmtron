import React, { useEffect } from 'react';
import map from 'lodash/map';

import Cell from './cell';
import { emitKeyDown, useSocketGameState, useSocketPlayerColor } from '../../socket';

const UP = 'u';
const DOWN = 'd';
const LEFT = 'l';
const RIGHT = 'r';

const Grid = () => {
  const color = useSocketPlayerColor();

  const handleKeydown = (e) => {
    const { key, repeat } = e;
    e.preventDefault();
    if (repeat) {
      return;
    }
    switch(key) {
      case 'ArrowUp':
      case 'w':
        emitKeyDown(UP, color);
        break;
      case 'ArrowDown':
      case 's':
        emitKeyDown(DOWN, color);
        break;
      case 'ArrowLeft':
      case 'a':
        emitKeyDown(LEFT, color);
        break;
      case 'ArrowRight':
      case 'd':
        emitKeyDown(RIGHT, color);
        break;
      default:
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeydown);

    return () => {
      window.removeEventListener('keydown', handleKeydown);
    };
  });

  const { board } = useSocketGameState();

  return (
    map(board, (row, x) => (
      <div key={x}>{map(row, (color, y) => (
        <Cell key={`${x}${y}`} color={color} />
      ))}</div>
    ))
  );
}

export default Grid;
