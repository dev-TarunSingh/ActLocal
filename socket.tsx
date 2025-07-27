// socket.ts
import { io } from "socket.io-client";

const socket = io("https://actlocal-server.onrender.com", {
  autoConnect: false, // we control when it connects
  transports: ["websocket"],
  reconnection: true,
});

export default socket;
