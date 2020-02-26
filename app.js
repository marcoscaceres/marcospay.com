const compression = require("compression");
const express = require("express");
const helmet = require("helmet");
const port = parseInt(process.env.PORT, 10) || 8000;
const cwd = process.cwd();

const app = express();
app.use(compression());
app.use(express.static(cwd));

// Defaults https://www.npmjs.com/package/helmet#how-it-works
app.use(helmet({
  frameguard: false, // Allow for UI inclusion as iframe for testing.
}));

app.listen(port, () => console.log(`Listening on port ${port}!`));
