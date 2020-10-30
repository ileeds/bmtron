import { useEffect, useState } from 'react';
import socketIOClient from 'socket.io-client';

const socket = socketIOClient(process.env.REACT_APP_DOMAIN || 'https://bmtron.herokuapp.com');

const useSocketGameState = () => {
  const [response, setResponse] = useState({});

  useEffect(() => {
    socket.on('GameState', data => {
      setResponse(data);
    });

    return () => socket.off('GameState');
  }, []);

  return response;
};

const useSocketPlayerColor = () => {
  const [response, setResponse] = useState();

  useEffect(() => {
    socket.on('PlayerColor', data => {
      setResponse(data);
    });

    return () => socket.off('PlayerColor');
  }, []);

  return response;
};

const useSocketAvailableColors = () => {
  const [response, setResponse] = useState();

  useEffect(() => {
    socket.on('AvailableColors', data => {
      setResponse(data);
    });

    return () => socket.off('AvailableColors');
  }, []);

  useEffect(() => {
    if (response === undefined) {
      emitGetAvailableColors();
    }
  }, [response]);

  return response;
};

const emitStartGame = () => {
  socket.emit('StartGame');
};

const emitEndGame = () => {
  socket.emit('EndGame');
};

const emitKeyDown = (key, color) => {
  socket.emit('KeyDown', { key, color });
};

const emitGetAvailableColors = () => {
  socket.emit('GetAvailableColors');
};

const emitSelectColor = (color) => {
  socket.emit('SelectColor', color);
};

const emitSelectTeammate = (color) => {
  socket.emit('SelectTeammate', color);
};

export {
  useSocketGameState,
  useSocketPlayerColor,
  useSocketAvailableColors,
  emitStartGame,
  emitEndGame,
  emitKeyDown,
  emitGetAvailableColors,
  emitSelectColor,
  emitSelectTeammate,
};
