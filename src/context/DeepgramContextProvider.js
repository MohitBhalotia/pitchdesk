"use client";
import axios from "axios";
import { createContext, useContext, useState, useRef, useEffect } from "react";
import { getAuthToken, sendKeepAliveMessage } from "../utils/deepgramUtils";
import { useSession } from "next-auth/react";

const DeepgramContext = createContext();

const DeepgramContextProvider = ({ children }) => {
  const [socket, setSocket] = useState();
  const [socketState, setSocketState] = useState(-1);
  const [reconnectAttempts, setReconnectAttempts] = useState(0);
  const [rateLimited, setRateLimited] = useState(false);
  const keepAlive = useRef();
  const maxReconnectAttempts = 5;
  const transcriptRef = useRef([]);
  const sessionIdRef = useRef(null);
  const isConnecting = useRef(false);
  const { data: session } = useSession();
  const [duration, setDuration] = useState(0);

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
          timeStamp: new Date(), // Add current timestamp
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
        setDuration((prev) => prev + 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [socketState, duration]);

  useEffect(() => {
    const startPitch = async () => {
      try {
        if (sessionIdRef.current && session?.user?._id) {
          const res = await axios.post("/api/start-pitch", {
            userId: session?.user?._id,
            sessionId: sessionIdRef.current,
          });
          console.log("res", res);
        }
      } catch (error) {
        clearInterval(keepAlive.current);
        setSocketState(3);
        setReconnectAttempts((attempts) => attempts + 1);
        console.error("Error starting pitch", error);
      }
    };
    startPitch();
  }, [sessionIdRef.current, session?.user?._id]);

  const connectToDeepgram = async () => {
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

    const newSocket = new WebSocket(
      "wss://agent.deepgram.com/v1/agent/converse",
      ["bearer", await getAuthToken()]
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
      console.log("Posting...");

      // Use the ref values which have the current data
      if (sessionIdRef.current) {
        await axios.post("/api/end-pitch", {
          sessionId: sessionIdRef.current,
          userId: session?.user?._id,
          conversationHistory: transcriptRef.current,
        });
        sessionIdRef.current = null;
        transcriptRef.current = [];
      } else {
        console.warn("No sessionId available to end pitch");
      }
      setSocketState(3); // closed
      // console.info("WebSocket closed. Attempting to reconnect...");

      // setTimeout(connectToDeepgram, 3000); // reconnect after 3 seconds
      setReconnectAttempts((attempts) => attempts + 1);
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

  return (
    <DeepgramContext.Provider
      value={{
        socket,
        socketState,
        rateLimited,
        connectToDeepgram,
        addTranscriptMessage,
        sessionIdRef,
        duration,
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
