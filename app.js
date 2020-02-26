const compression = require("compression");
const express = require("express");
const helmet = require("helmet");
const port = parseInt(process.env.PORT, 10) || 8000;
const cwd = process.cwd();

const app = express();
app.use(compression());

// Defaults https://www.npmjs.com/package/helmet#how-it-works
app.use(
  helmet({
    frameguard: false, // Allow for UI inclusion as iframe for testing.
  }),
);

app.get("/", (req, res, next) => {
  if (req.method === "HEAD") {
    res.setHeader("Link", '<payment-manifest.json>; rel="payment-method-manifest"');
  }
  next();
});

app.use(express.static(cwd));

app.listen(port, () => console.log(`Listening on port ${port}!`));
