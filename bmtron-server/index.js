const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const _ = require('lodash');

const port = process.env.PORT || 4001;
const app = express();

const server = http.createServer(app);
const io = socketIo(server);

const ROW_COUNT = 50;
const COLUMN_COUNT = 50;

const UP = 'u';
const DOWN = 'd';
const LEFT = 'l';
const RIGHT = 'r';

const RED = 'red';
const YELLOW = 'yellow';
const PURPLE = 'purple';
const GREEN = 'green';

const activeColors = {};

const initialPlayerState = {
  [RED]: {
    position: {
      x: 15,
      y: 15,
    },
    direction: RIGHT,
    alive: true,
  },
  [YELLOW]: {
    position: {
      x: 15,
      y: 35,
    },
    direction: RIGHT,
    alive: true,
  },
  [PURPLE]: {
    position: {
      x: 35,
      y: 15,
    },
    direction: RIGHT,
    alive: true,
  },
  [GREEN]: {
    position: {
      x: 35,
      y: 35,
    },
    direction: RIGHT,
    alive: true,
  },
};

const startPositions = _.map(initialPlayerState, (val, key) => {
  return { [`${val.position.x}:${val.position.y}`]: key };
});

let playerState = { ...initialPlayerState };

const initialBoard = _.times(COLUMN_COUNT, (x) => (_.times(ROW_COUNT, (y) => {
  if (startPositions[`${x}:${y}`]) {
    return startPositions[`${x}:${y}`];
  }
  return null;
})));

let board = [...initialBoard];

let gameInit;

const resetActiveColors = () => {
  const activeConnections = Object.keys(io.sockets.sockets);
  if (!activeConnections.includes(activeColors[RED])) {
    delete activeColors[RED];
  }
  if (!activeConnections.includes(activeColors[YELLOW])) {
    delete activeColors[YELLOW];
  }
  if (!activeConnections.includes(activeColors[PURPLE])) {
    delete activeColors[PURPLE];
  }
  if (!activeConnections.includes(activeColors[GREEN])) {
    delete activeColors[GREEN];
  }
};

io.on('connection', (socket) => {
  resetActiveColors();
  if (!(RED in activeColors)) {
    activeColors[RED] = socket.id;
    io.to(socket.id).emit('PlayerColor', RED);
  } else if (!(YELLOW in activeColors)) {
    activeColors[YELLOW] = socket.id;
    io.to(socket.id).emit('PlayerColor', YELLOW);
  } else if (!(PURPLE in activeColors)) {
    activeColors[PURPLE] = socket.id;
    io.to(socket.id).emit('PlayerColor', PURPLE);
  } else if (!(GREEN in activeColors)) {
    activeColors[GREEN] = socket.id;
    io.to(socket.id).emit('PlayerColor', GREEN);
  } else {
    return;
  }
  setInterval(() => getApiAndEmit(socket), 100);
  socket.on('disconnect', () => {
    resetActiveColors();
  });
  socket.on('StartGame', handleStartGame);
  socket.on('KeyDown', handleKeyDown);
});

const handleStartGame = () => {
  if (!_.size(activeColors) >= 2) {
    return;
  }
  playerState = { ...initialPlayerState };
  board = [...initialBoard];

  gameInit = new Date();
}

const handleKeyDown = ({ key, color }) => {
  switch(key) {
    case UP:
      playerState = { ...playerState,
        [color]: {
          ...playerState[color],
          direction: UP,
        }
      };
      break;
    case DOWN:
      playerState = { ...playerState,
        [color]: {
          ...playerState[color],
          direction: DOWN,
        }
      };
      break;
    case LEFT:
      playerState = { ...playerState,
        [color]: {
          ...playerState[color],
          direction: LEFT,
        }
      };
      break;
    case RIGHT:
      playerState = { ...playerState,
        [color]: {
          ...playerState[color],
          direction: RIGHT,
        }
      };
      break;
    default:
  }
};

const getNewPlayerState = (board, player) => {
  const { position, direction, alive } = player;
  if (!alive) {
    return {
      position,
      direction,
      alive,
    };
  }

  const newPosition = ((d) => {
    switch(d) {
      case UP:
        return {
          x: position.x,
          y: position.y - 1,
        };
      case DOWN:
        return {
          x: position.x,
          y: position.y + 1,
        };
      case LEFT:
        return {
          x: position.x - 1,
          y: position.y,
        };
      case RIGHT:
        return {
          x: position.x + 1,
          y: position.y,
        };
      default:
        return {
          x: position.x,
          y: position.y,
        };
    }
  })(direction);

  const newAlive = newPosition.x < COLUMN_COUNT && newPosition.y < ROW_COUNT
    && newPosition.x >= 0 && newPosition.y >= 0
    && !board[newPosition.x][newPosition.y];

  return {
    position: newAlive ? newPosition : position,
    direction,
    alive: newAlive,
  };
};

const getBoard = () => {
  const redPosition = playerState[RED].position;
  const yellowPosition = playerState[YELLOW].position;
  const purplePosition = playerState[PURPLE].position;
  const greenPosition = playerState[GREEN].position;
  return _.times(COLUMN_COUNT, (x) => (_.times(ROW_COUNT, (y) => {
    if (board[x][y]) {
      const color = board[x][y];
      if (color in activeColors) {
        return board[x][y]
      } else {
        return null;
      }
    }
    
    if (RED in activeColors && redPosition.x === x && redPosition.y === y) {
      return RED;
    }
    if (YELLOW in activeColors && yellowPosition.x === x && yellowPosition.y === y) {
      return YELLOW;
    }
    if (PURPLE in activeColors && purplePosition.x === x && purplePosition.y === y) {
      return PURPLE;
    }
    if (GREEN in activeColors && greenPosition.x === x && greenPosition.y === y) {
      return GREEN;
    }

    return null;
  })));
};

const getAlivePlayer = () => {
  if (playerState[RED].alive) {
    return RED;
  } else if (playerState[YELLOW].alive) {
    return YELLOW;
  } else if (playerState[PURPLE].alive) {
    return PURPLE;
  } else if (playerState[GREEN].alive) {
    return GREEN;
  }
};

const getGameStatus = () => {
  const gameIsActive = [
    playerState[RED].alive,
    playerState[YELLOW].alive,
    playerState[PURPLE].alive,
    playerState[GREEN].alive
  ].filter(Boolean).length > 1;
  const winner = gameIsActive
    ? null
    : getAlivePlayer();
  return { gameIsActive, winner };
};

const getApiAndEmit = socket => {
  const { gameIsActive, winner } = getGameStatus();
  if (!gameIsActive) {
    gameInit = null;
  }
  const seconds = gameInit
    ? Math.round(3 - (new Date().getTime() - gameInit.getTime()) / 1000)
    : null;
  if (seconds !== null && seconds <= 0) {
    playerState = { ...playerState,
      [RED]: {
        ...getNewPlayerState(board, playerState[RED]),
      },
      [YELLOW]: {
        ...getNewPlayerState(board, playerState[YELLOW]),
      },
      [PURPLE]: {
        ...getNewPlayerState(board, playerState[PURPLE]),
      },
      [GREEN]: {
        ...getNewPlayerState(board, playerState[GREEN]),
      },
    };
  }
  board = getBoard();
  socket.emit('GameState', {
    board,
    countdown: seconds >= 0 ? seconds : 0,
    activeColors,
    gameIsActive,
    winner,
  });
};

server.listen(port, () => console.log(`Listening on port ${port}`));
