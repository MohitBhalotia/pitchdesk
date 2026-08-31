"use client";
import { createContext, useContext, useState, useRef, useEffect } from "react";
import { getAuthToken, sendKeepAliveMessage } from "../utils/deepgramUtils";
import { toast } from "sonner";

const DeepgramContext = createContext();

const DeepgramContextProvider = ({ children }) => {
  const [socket, setSocket] = useState();
  const [socketState, setSocketState] = useState(-1);
  const [reconnectAttempts, setReconnectAttempts] = useState(0);
  const [rateLimited, setRateLimited] = useState(false);
  const keepAlive = useRef();
  const maxReconnectAttempts = 5;
  const [userId, setUserId] = useState(null);
  const transcriptRef = useRef([]);
  const sessionIdRef = useRef(null);
  const isConnecting = useRef(false);
  const [duration, setDuration] = useState(0);
  const [, setCompetitionId] = useState(null);
  const durationRef = useRef(0);
  const closePromiseResolveRef = useRef(null);

  // Helper function to parse and format transcript messages
  const addTranscriptMessage = (rawMessage) => {
    try {
      const parsedMessage = JSON.parse(rawMessage);
      if (parsedMessage.type === "Welcome") {
        sessionIdRef.current = parsedMessage.request_id;
      }
      if (
        parsedMessage.type &&
        parsedMessage.type === "History" &&
        parsedMessage.role &&
        parsedMessage.content
      ) {
        const formattedMessage = {
          type: parsedMessage.type,
          role: parsedMessage.role === "assistant" ? "bot" : parsedMessage.role, // Convert "assistant" to "bot" for schema
          content: parsedMessage.content,
          timestamp: new Date().toISOString(),
        };

        transcriptRef.current = [...transcriptRef.current, formattedMessage];
        console.log("Added transcript message:", formattedMessage);
      }
    } catch (error) {
      console.error("Failed to parse transcript message:", rawMessage, error);
    }
  };

  useEffect(() => {
    if (socketState === 1) {
      const interval = setInterval(() => {
        setDuration((prev) => {
          const newDuration = prev + 1;
          durationRef.current = newDuration;
          return newDuration;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [socketState]);

  const connectToDeepgram = async () => {
    console.log("userId", userId);
    if (reconnectAttempts >= maxReconnectAttempts) {
      console.log("Max reconnect attempts reached.");
      // we don't actually know this is a rate limit, but want to show this anyways
      setRateLimited(true);
      return;
    }

    // Prevent multiple simultaneous connections
    if (isConnecting.current) {
      console.log("Connection already in progress, skipping...");
      return;
    }

    isConnecting.current = true;
    setSocketState(0); // connecting
    const result = await getAuthToken(userId);
    console.log("result", result);
    if (result.success === false) {
      toast.error(result.message || "Error getting token");
      console.error("Error getting token", result.message);
      return;
    }
    const token = result.access_token;
    console.log("token", token);
    const newSocket = new WebSocket(
      "wss://agent.deepgram.com/v1/agent/converse",
      ["bearer", token]
    );

    const onOpen = async () => {
      setSocketState(1); // connected
      setReconnectAttempts(0); // reset reconnect attempts after a successful connection
      isConnecting.current = false; // Reset connection flag
      console.log("WebSocket connected.");
      keepAlive.current = setInterval(sendKeepAliveMessage(newSocket), 10000);
    };

    const onError = (err) => {
      setSocketState(2); // error
      isConnecting.current = false; // Reset connection flag on error
      console.error("Websocket error", err);
    };

    const onClose = async () => {
      clearInterval(keepAlive.current);
      let resultData = { success: false };

      // Use the ref values which have the current data
      

      setSocketState(3); // closed
      setReconnectAttempts((attempts) => attempts + 1);

      // Resolve the promise if there's a resolver waiting
      if (closePromiseResolveRef.current) {
        closePromiseResolveRef.current(resultData);
        closePromiseResolveRef.current = null;
      }
    };

    const onMessage = () => {
      // console.info("message", e);
    };

    newSocket.binaryType = "arraybuffer";
    newSocket.addEventListener("open", onOpen);
    newSocket.addEventListener("error", onError);
    newSocket.addEventListener("close", onClose);
    newSocket.addEventListener("message", onMessage);

    setSocket(newSocket);
  };

  const closeSocket = () => {
    return new Promise((resolve) => {
      if (!socket || socketState !== 1) {
        resolve({ success: false, error: "Socket not connected" });
        return;
      }

      // Store the resolve function to be called when onClose fires
      closePromiseResolveRef.current = resolve;

      // Close the socket (this will trigger onClose event)
      socket.close();
    });
  };

  return (
    <DeepgramContext.Provider
      value={{
        socket,
        socketState,
        rateLimited,
        connectToDeepgram,
        closeSocket,
        addTranscriptMessage,
        sessionIdRef,
        transcriptRef,
        setCompetitionId,
        duration,
        durationRef,
        setUserId,
      }}
    >
      {children}
    </DeepgramContext.Provider>
  );
};

function useDeepgram() {
  return useContext(DeepgramContext);
}

export { DeepgramContextProvider, useDeepgram };
