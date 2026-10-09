// Production HTTP server entry point for cPanel / CloudLinux Passenger
const { createServer } = require("http");
const { parse } = require("url");
const next = require("next");

const dev = process.env.NODE_ENV !== "production";
const hostname = process.env.HOSTNAME || "localhost";
const port = parseInt(process.env.PORT || "3000", 10);

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true);
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error("Server error handling request:", req.url, err);
      res.statusCode = 500;
      res.end("Internal Server Error");
    }
  })
    .once("error", (err) => {
      console.error("Server start error:", err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`> MirissaStays server listening on port ${port}`);
    });
}).catch((err) => {
  console.error("Next.js preparation failed:", err);
  process.exit(1);
});
