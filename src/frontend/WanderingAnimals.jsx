import React, { useEffect } from 'react';
import { Box } from '@forge/react'; // Import Box from UI Kit
import './WanderingAnimals.css'; // Import the CSS for the animation

const WanderingAnimals = () => {
  useEffect(() => {
    // Initialize the animation logic here if needed
  }, []);

  return (
    <Box className="wandering-animals">
      <Box className="animal">🐾</Box>
      <Box className="animal">🐾</Box>
      <Box className="animal">🐾</Box>
    </Box>
  );
};

export default WanderingAnimals;