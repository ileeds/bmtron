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

const ONE = 'red';
const TWO = 'black';
const THREE = 'purple';
const FOUR = 'green';

const activeColors = {};

const initialPlayerState = {
  [ONE]: {
    position: {
      x: 15,
      y: 15,
    },
    direction: RIGHT,
    alive: true,
  },
  [TWO]: {
    position: {
      x: 15,
      y: 35,
    },
    direction: RIGHT,
    alive: true,
  },
  [THREE]: {
    position: {
      x: 35,
      y: 15,
    },
    direction: RIGHT,
    alive: true,
  },
  [FOUR]: {
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

const initialScores = {
  [ONE]: 0,
  [TWO]: 0,
  [THREE]: 0,
  [FOUR]: 0,
};

let scores = { ...initialScores };

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
  if (!activeConnections.includes(activeColors[ONE])) {
    delete activeColors[ONE];
  }
  if (!activeConnections.includes(activeColors[TWO])) {
    delete activeColors[TWO];
  }
  if (!activeConnections.includes(activeColors[THREE])) {
    delete activeColors[THREE];
  }
  if (!activeConnections.includes(activeColors[FOUR])) {
    delete activeColors[FOUR];
  }
};

io.on('connection', (socket) => {
  resetActiveColors();
  if (!(ONE in activeColors)) {
    activeColors[ONE] = socket.id;
    io.to(socket.id).emit('PlayerColor', ONE);
  } else if (!(TWO in activeColors)) {
    activeColors[TWO] = socket.id;
    io.to(socket.id).emit('PlayerColor', TWO);
  } else if (!(THREE in activeColors)) {
    activeColors[THREE] = socket.id;
    io.to(socket.id).emit('PlayerColor', THREE);
  } else if (!(FOUR in activeColors)) {
    activeColors[FOUR] = socket.id;
    io.to(socket.id).emit('PlayerColor', FOUR);
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
  const { position, direction, alive, ...rest } = player;
  if (!alive) {
    return {
      position,
      direction,
      alive,
      ...rest,
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
    ...rest,
  };
};

const getBoard = () => {
  const onePosition = playerState[ONE].position;
  const twoPosition = playerState[TWO].position;
  const threePosition = playerState[THREE].position;
  const fourPosition = playerState[FOUR].position;
  return _.times(COLUMN_COUNT, (x) => (_.times(ROW_COUNT, (y) => {
    if (board[x][y]) {
      const color = board[x][y];
      if (color in activeColors) {
        return board[x][y]
      } else {
        return null;
      }
    }
    
    if (ONE in activeColors && onePosition.x === x && onePosition.y === y) {
      return ONE;
    }
    if (TWO in activeColors && twoPosition.x === x && twoPosition.y === y) {
      return TWO;
    }
    if (THREE in activeColors && threePosition.x === x && threePosition.y === y) {
      return THREE;
    }
    if (FOUR in activeColors && fourPosition.x === x && fourPosition.y === y) {
      return FOUR;
    }

    return null;
  })));
};

const getAlivePlayer = () => {
  if (playerState[ONE].alive) {
    return ONE;
  } else if (playerState[TWO].alive) {
    return TWO;
  } else if (playerState[THREE].alive) {
    return THREE;
  } else if (playerState[FOUR].alive) {
    return FOUR;
  } else {
    return 'DRAW';
  }
};

const getGameStatus = () => {
  const gameIsActive = [
    playerState[ONE].alive,
    playerState[TWO].alive,
    playerState[THREE].alive,
    playerState[FOUR].alive
  ].filter(Boolean).length > 1;
  const winner = gameIsActive
    ? null
    : getAlivePlayer();
  return { gameIsActive, winner };
};

const getActiveScores = () => {
  return _.pickBy(scores, (_value, key) => {
    return key in activeColors;
  });
}

const getApiAndEmit = socket => {
  const { gameIsActive, winner } = getGameStatus();
  if (winner && winner !== 'DRAW' && gameInit) {
    scores = {
      ...scores,
      [winner]: scores[winner] + 1,
    };
  }
  if (!gameIsActive) {
    gameInit = null;
  }
  const seconds = gameInit
    ? Math.round(3 - (new Date().getTime() - gameInit.getTime()) / 1000)
    : null;
  if (seconds !== null && seconds <= 0) {
    playerState = { ...playerState,
      [ONE]: {
        ...getNewPlayerState(board, playerState[ONE]),
      },
      [TWO]: {
        ...getNewPlayerState(board, playerState[TWO]),
      },
      [THREE]: {
        ...getNewPlayerState(board, playerState[THREE]),
      },
      [FOUR]: {
        ...getNewPlayerState(board, playerState[FOUR]),
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
    scores: getActiveScores(),
  });
};

server.listen(port, () => console.log(`Listening on port ${port}`));
