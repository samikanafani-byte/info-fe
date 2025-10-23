import { baseURL } from '@/utils/conf';

// Define simple wrapper type (to mimic socket.io interface slightly)
export type AppSocket = {
    connect: () => void;
    disconnect: () => void;
    send: (event: string, data?: any) => void;
    on: (event: string, callback: (data: any) => void) => void;
    off: (event: string, callback?: (data: any) => void) => void;
};

export const getURL = (): string => {
    // Ensure it uses ws:// or wss://
    return baseURL.replace(/^http/, 'ws');
};

export const getSocket = (session_id: string): AppSocket => {
    const url = `${getURL()}/ws/${session_id}`;
    let ws: WebSocket | null = null;

    // Simple event emitter map
    const listeners = new Map<string, Set<(data: any) => void>>();

    const emit = (event: string, data?: any) => {
        const callbacks = listeners.get(event);
        if (callbacks) {
            for (const cb of callbacks) cb(data);
        }
    };

    return {
        connect: () => {
            ws = new WebSocket(url);

            ws.onopen = () => emit('connect', {});
            ws.onclose = () => emit('disconnect', {});
            ws.onmessage = (event) => {
                try {
                    const parsed = JSON.parse(event.data);
                    // Expect messages like: { event: "status:update", data: "online" }
                    if (parsed.event) emit(parsed.event, parsed.data);
                    else emit('message:receive', parsed); // fallback
                } catch {
                    emit('message:receive', event.data);
                }
            };
        },

    disconnect: () => {
            ws?.close();
            ws = null;
        },

        send: (event: string, data?: any) => {
            if (ws && ws.readyState === WebSocket.OPEN) {
                ws.send(JSON.stringify({ event, data }));
            }
        },

        on: (event: string, callback: (data: any) => void) => {
            if (!listeners.has(event)) listeners.set(event, new Set());
            listeners.get(event)!.add(callback);
        },

        off: (event: string, callback?: (data: any) => void) => {
            if (!listeners.has(event)) return;
            if (callback) listeners.get(event)!.delete(callback);
            else listeners.delete(event);
        },
    };
};
