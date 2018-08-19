'use strict';

// [START app]
const express = require('express');

const app = express();

const message = [
  'Hello, World !',
  `node.js version is ${process.version} !!`,
  `This service uploaded by Cloud Build !!!`
].join('<br />');

app.get('/', (req, res) => {
  res.status(200).send(message).end();
});

// Start the server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(JSON.stringify(process.env));
  console.log(`App listening on port ${PORT}`);
  console.log('Press Ctrl+C to quit.');
});
// [END app]
