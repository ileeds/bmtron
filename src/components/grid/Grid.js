import React, { useEffect } from 'react';
import map from 'lodash/map';

import Cell from './cell';
import { emitKeyDown, useSocketGameState, useSocketPlayerColor } from '../../socket';
import { isOnTeam } from '../../util';

const UP = 'u';
const DOWN = 'd';
const LEFT = 'l';
const RIGHT = 'r';

const Grid = () => {
  const myColor = useSocketPlayerColor();

  const handleKeydown = (e) => {
    const { key, metaKey, repeat } = e;
    if (!metaKey) {
      e.preventDefault();
    }
    if (repeat) {
      return;
    }
    switch(key) {
      case 'ArrowUp':
      case 'w':
        emitKeyDown(UP, myColor);
        break;
      case 'ArrowDown':
      case 's':
        emitKeyDown(DOWN, myColor);
        break;
      case 'ArrowLeft':
      case 'a':
        emitKeyDown(LEFT, myColor);
        break;
      case 'ArrowRight':
      case 'd':
        emitKeyDown(RIGHT, myColor);
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

  const { board, teams } = useSocketGameState();

  return (
    map(board, (row, x) => (
      <div key={x}>{map(row, (color, y) => (
        <Cell key={`${x}${y}`} color={color} circle={isOnTeam(teams, myColor, color)} />
      ))}</div>
    ))
  );
}

export default Grid;
