import { createContext, useEffect, useState } from "react";
import { io, type Socket } from "socket.io-client";
import type { Server } from "socket.io";
import type { DataFunctionArgs } from "@remix-run/server-runtime";

/**
 * The server will emit events like `"refresh:xxx:yyy"`.
 *
 * This means that clients that are currently viewing
 * the orderbook of `xxx` to `yyy` should fetch new data.
 */
type ServerEmittedEvents = Record<
  `refresh:${string}:${string}`,
  () => void
>;

/** Create a client-side socket on mount and close it on unmount. */
export function useAutoClosingSocket() {
  const [socket, setSocket] = useState<Socket<ServerEmittedEvents, never>>();

  useEffect(() => {
    const socket = io();
    setSocket(socket);
    return () => {
      socket.close();
    };
  }, []);

  return socket;
}

export const socketContext = createContext<
  Socket<ServerEmittedEvents, never> | undefined
>(undefined);

export const SocketProvider = socketContext.Provider;

export interface DataFunctionArgsWithSocket extends DataFunctionArgs {
  context: Server<
    never,
    ServerEmittedEvents,
    never,
    never
  >;
}
