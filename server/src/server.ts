import http from 'http';
import app from './app';
import { initSocket } from './utils/socket';

const PORT = process.env.PORT ? Number(process.env.PORT) : 4000;
const server = http.createServer(app);

// initialize socket.io
const io = initSocket(server);

server.listen(PORT, () => {
  console.log(`API listening on http://localhost:${PORT}`);
});
