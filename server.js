// server.js
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static("public")); // serve frontend

// Simulated stock data
let stocks = {
  AAPL: 180.12,
  GOOGL: 2750.50,
  AMZN: 3450.75,
  MSFT: 310.20,
};

// Function to simulate price changes
function updatePrices() {
  for (let symbol in stocks) {
    let change = (Math.random() - 0.5) * 2; // random -1 to +1
    stocks[symbol] = +(stocks[symbol] + change).toFixed(2);
  }
  io.emit("stockUpdate", stocks);
}

// Send updates every 2 seconds
setInterval(updatePrices, 2000);

// Socket connection
io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);
  socket.emit("stockUpdate", stocks);
  socket.on("disconnect", () => console.log("Client disconnected:", socket.id));
});

const PORT = 3000;
server.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
