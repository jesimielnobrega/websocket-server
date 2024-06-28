import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import express from "express";

const app = express();
const server = createServer(app);

// Configurar CORS
app.use(cors());

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("A user was connected")
  socket.on("vote", ({ competitorId, galaId }) => {
    console.log("Voto: " + competitorId + ", gala: " + galaId);
    io.emit("newVote", { competitorId, galaId });
  });
  socket.on("competitor", (data) => {
    io.emit("newCompetitor", data);
  });
  socket.on("toogleStatus", (galaData) => {
    console.log("Gala Mudada: " + galaData.galaId);
    io.emit("statusChanged", galaData);
  });
  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

server.listen(4000, () => {
  console.log("server running at http://localhost:4000");
});
