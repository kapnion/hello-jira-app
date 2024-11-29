
module.exports = {
  // ...existing code...
  module: {
    rules: [
      // ...existing rules...
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  // ...existing code...
};