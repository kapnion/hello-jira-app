import React, { useEffect, useState } from 'react';
import ForgeReconciler, { Text, Button, ProgressBar, useProductContext } from '@forge/react';
import { invoke } from '@forge/bridge';

const App = () => {
  const [data, setData] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const context = useProductContext();

  useEffect(() => {
    console.log('Invoking getText');
    invoke('getText', { example: 'my-invoke-variable' })
      .then(setData)
      .catch((error) => console.error('Error invoking getText:', error));
    loadElapsedTime();
  }, []);

  useEffect(() => {
    let timer;
    if (isRunning) {
      timer = setInterval(() => {
        setElapsedTime((prevElapsedTime) => prevElapsedTime + 1000);
      }, 1000);
    } else if (!isRunning && startTime !== null) {
      clearInterval(timer);
    }
    return () => clearInterval(timer);
  }, [isRunning]);

  const handleStartPause = () => {
    console.log('handleStartPause clicked');
    if (isRunning) {
      setIsRunning(false);
    } else {
      setStartTime(Date.now());
      setIsRunning(true);
    }
  };

  const handleStop = () => {
    console.log('handleStop clicked');
    setIsRunning(false);
    saveElapsedTime();
  };

  const saveElapsedTime = async () => {
    const issueId = context?.issue?.id;
    const userId = context?.accountId;
    if (issueId && userId) {
      try {
        console.log('Saving elapsed time:', elapsedTime);
        await invoke('saveElapsedTime', { issueId, userId, elapsedTime });
      } catch (error) {
        console.error('Error invoking saveElapsedTime:', error);
      }
    }
  };

  const loadElapsedTime = async () => {
    const issueId = context?.issue?.id;
    const userId = context?.accountId;
    if (issueId && userId) {
      try {
        console.log('Loading elapsed time');
        const storedElapsedTime = await invoke('loadElapsedTime', { issueId, userId });
        console.log('Loaded elapsed time:', storedElapsedTime);
        setElapsedTime(storedElapsedTime);
      } catch (error) {
        console.error('Error invoking loadElapsedTime:', error);
      }
    }
  };

  const formatTime = (time) => {
    const seconds = Math.floor((time / 1000) % 60);
    const minutes = Math.floor((time / (1000 * 60)) % 60);
    const hours = Math.floor((time / (1000 * 60 * 60)) % 24);
    return `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <>
      <Text>{data ? data : 'Loading...'}</Text>
      <Text>Elapsed Time: {formatTime(elapsedTime)}</Text>
      <ProgressBar value={(elapsedTime % 60000) / 60000} /> {/* Progress bar for each minute */}
      <Button onClick={handleStartPause}>
        {isRunning ? 'Pause' : 'Start'}
      </Button>
      <Button onClick={handleStop}>Stop</Button>
    </>
  );
};

ForgeReconciler.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
