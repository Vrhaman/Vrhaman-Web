const connectDB = require("./db");

const startServer = (app, callback) => {
  connectDB()
    .then(() => {
      const PORT = process.env.PORT || 8000;
      app.listen(PORT, () => {
        console.log(
          `Server is running successfully on http://localhost:${PORT}/`
        );
        if (callback) {
          callback();
        }
      });
    })
    .catch((error) => {
      console.error("Error starting the server:", error);
    });
};

module.exports = startServer;
