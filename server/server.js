const express = require('express');
const path = require('path')
const http = require('http');
const socketIo = require('socket.io');
const _ = require('lodash');

const port = process.env.PORT || 4001;
const app = express();

app.use(express.static(path.join(__dirname, '..', 'build')));

app.get('/*', (_req, res) => {
  res.sendFile(path.join(__dirname, '..', 'build', 'index.html'));
});

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

const sharedPlayerState = {
  direction: RIGHT,
  alive: true,
};

const initialPlayerState = {
  [ONE]: {
    position: {
      x: 15,
      y: 15,
    },
    ...sharedPlayerState,
  },
  [TWO]: {
    position: {
      x: 15,
      y: 35,
    },
    ...sharedPlayerState,
  },
  [THREE]: {
    position: {
      x: 35,
      y: 15,
    },
    ...sharedPlayerState,
  },
  [FOUR]: {
    position: {
      x: 35,
      y: 35,
    },
    ...sharedPlayerState,
  },
};
const COLORS = Object.keys(initialPlayerState);

const startPositions = _.map(initialPlayerState, (val, key) => {
  return { [`${val.position.x}:${val.position.y}`]: key };
});

let playerState = { ...initialPlayerState };

const initialScores = _.reduce(initialPlayerState, (acc, _val, key) => {
  acc[key] = 0;
  return acc;
}, {});

let scores = { ...initialScores };

const initialBoard = _.times(COLUMN_COUNT, (x) => (_.times(ROW_COUNT, (y) => {
  if (startPositions[`${x}:${y}`]) {
    return startPositions[`${x}:${y}`];
  }
  return null;
})));

let board = [...initialBoard];

let gameInit;

const getGameStateAndEmit = () => {
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
      ..._.reduce(COLORS, (acc, color) => {
        acc[color] = getNewPlayerState(board, playerState[color]);
        return acc;
      }, {}),
    };
  }
  board = getBoard();
  io.emit('GameState', {
    board,
    countdown: seconds >= 0 ? seconds : 0,
    activeColors,
    gameIsActive,
    winner,
    scores: getActiveScores(),
  });
};

setInterval(getGameStateAndEmit, 50);

const resetActiveColors = () => {
  const activeConnections = Object.keys(io.sockets.sockets);
  _.forEach(COLORS, color => {
    if (!activeConnections.includes(activeColors[color])) {
      delete activeColors[color];
    }
  });
};

io.on('connection', (socket) => {
  resetActiveColors();
  let colorObtained = false;
  _.forEach(COLORS, color => {
    if (!(color in activeColors)) {
      colorObtained = true;
      activeColors[color] = socket.id;
      io.to(socket.id).emit('PlayerColor', color);
      return false;
    }
  });
  if (!colorObtained) {
    return;
  }
  socket.on('disconnect', () => {
    resetActiveColors();
  });
  socket.on('StartGame', handleStartGame);
  socket.on('EndGame', handleEndGame);
  socket.on('KeyDown', handleKeyDown);
});

const handleStartGame = () => {
  if (!_.size(activeColors) >= 2) {
    return;
  }
  playerState = { ...initialPlayerState };
  board = [...initialBoard];
  gameInit = new Date();
};

const handleEndGame = () => {
  playerState = { ...initialPlayerState };
  board = [...initialBoard];
  scores = { ...initialScores };
};

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
    && !board[newPosition.x][newPosition.y]; // TODO

  return {
    position: newAlive ? newPosition : position,
    direction,
    alive: newAlive,
    ...rest,
  };
};

const getBoard = () => {
  const colorPositions = _.reduce(COLORS, (acc, color) => {
    acc[color] = playerState[color].position;
    return acc;
  }, {});
  return _.times(COLUMN_COUNT, (x) => (_.times(ROW_COUNT, (y) => {
    if (board[x][y]) {
      const color = board[x][y];
      if (color in activeColors) {
        return board[x][y];
      } else {
        return null;
      }
    }
    
    return _.find(COLORS, color => {
      return color in activeColors && colorPositions[color].x === x && colorPositions[color].y === y;
    });
  })));
};

const getAlivePlayer = () => {
  const alivePlayer = _.find(COLORS, color => {
    return playerState[color].alive;
  });
  if (alivePlayer) {
    return alivePlayer;
  }
  return 'DRAW';
};

const getGameStatus = () => {
  const gameIsActive = [..._.map(COLORS, color => playerState[color].alive)].filter(Boolean).length > 1;
  const winner = gameIsActive
    ? null
    : getAlivePlayer();
  return { gameIsActive, winner };
};

const getActiveScores = () => {
  return _.pickBy(scores, (_value, key) => {
    return key in activeColors;
  });
};

server.listen(port, () => console.log(`Listening on port ${port}`));

module.exports = app;
