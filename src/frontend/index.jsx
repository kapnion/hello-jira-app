import React, { useEffect, useState } from 'react';
import ForgeReconciler, { Text, Button, ProgressBar, useProductContext, Box } from '@forge/react'; // Import Box
import { invoke } from '@forge/bridge';

const App = () => {
  const [data, setData] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [points, setPoints] = useState(0);
  const [motivatingText, setMotivatingText] = useState('');
  const context = useProductContext();

  const motivatingMessages = [
    'Keep going! 😊',
    'You are doing great! 👍',
    'Awesome job! 🌟',
    'Keep up the good work! 💪',
    'Fantastic effort! 🎉'
  ];

  useEffect(() => {
    console.log('Invoking getText');
    invoke('getText', { example: 'my-invoke-variable' })
      .then(setData)
      .catch((error) => console.error('Error invoking getText:', error));
    loadElapsedTime();
    loadPoints();
  }, []);

  useEffect(() => {
    let timer;
    let messageInterval;
    if (isRunning) {
      timer = setInterval(() => {
        setElapsedTime((prevElapsedTime) => prevElapsedTime + 1000);
        setPoints((prevPoints) => prevPoints + 1); // Earn 1 point per second
      }, 1000);

      messageInterval = setInterval(() => {
        const randomMessage = motivatingMessages[Math.floor(Math.random() * motivatingMessages.length)];
        setMotivatingText(randomMessage);
      }, 10000); // Change message every 10 seconds
    } else if (!isRunning && startTime !== null) {
      clearInterval(timer);
      clearInterval(messageInterval);
    }
    return () => {
      clearInterval(timer);
      clearInterval(messageInterval);
    };
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
    savePoints();
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

  const savePoints = async () => {
    const userId = context?.accountId;
    if (userId) {
      try {
        console.log('Saving points:', points);
        await invoke('savePoints', { userId, points });
      } catch (error) {
        console.error('Error invoking savePoints:', error);
      }
    }
  };

  const loadPoints = async () => {
    const userId = context?.accountId;
    if (userId) {
      try {
        console.log('Loading points');
        const storedPoints = await invoke('loadPoints', { userId });
        console.log('Loaded points:', storedPoints);
        setPoints(storedPoints);
      } catch (error) {
        console.error('Error invoking loadPoints:', error);
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
      <Text>Points: {points}</Text> {/* Display points */}
      <Box display="flex" alignItems="center">
        <Box width="100%" height="20px" backgroundColor="#e0e0e0" borderRadius="10px" overflow="hidden">
          <Box width={`${points}%`} height="100%" backgroundColor="#76c7c0"></Box>
        </Box>
        <Text marginLeft="10px">{points} pts</Text>
      </Box>
      <Text>{motivatingText}</Text> {/* Display motivating text */}
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
