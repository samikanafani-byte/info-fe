import { io, Socket } from 'socket.io-client';
import { ServerToClientEvents, ClientToServerEvents } from './types';
import { baseURL } from '@/utils/conf';

// The types are reversed here: <ServerToClient, ClientToServer>
export type AppSocket = Socket<ServerToClientEvents, ClientToServerEvents>;

// Use environment variables for the connection URL
const URL = baseURL;

export const socket: AppSocket = io(URL, {
    autoConnect: false,
});