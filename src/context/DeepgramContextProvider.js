"use client";
import axios from "axios";
import { createContext, useContext, useState, useRef } from "react";
import { getAuthToken, sendKeepAliveMessage } from "../utils/deepgramUtils";

const DeepgramContext = createContext();

const DeepgramContextProvider = ({ children }) => {
  const [socket, setSocket] = useState();
  const [socketState, setSocketState] = useState(-1);
  const [reconnectAttempts, setReconnectAttempts] = useState(0);
  const [rateLimited, setRateLimited] = useState(false);
  const keepAlive = useRef();
  const maxReconnectAttempts = 5;
  const [transcript, setTranscriptState] = useState([]);
  const transcriptRef = useRef([]);
  const [sessionId, setSessionId] = useState(null);
  const sessionIdRef = useRef(null);
  const isConnecting = useRef(false);

  // Custom setTranscript that updates both state and ref
  const setTranscript = (newTranscript) => {
    if (typeof newTranscript === "function") {
      // Handle functional updates
      setTranscriptState((prev) => {
        const updated = newTranscript(prev);
        transcriptRef.current = updated;
        return updated;
      });
    } else {
      // Handle direct value updates
      setTranscriptState(newTranscript);
      transcriptRef.current = newTranscript;
    }
  };

  // Helper function to parse and format transcript messages
  const addTranscriptMessage = (rawMessage) => {
    try {
      const parsedMessage = JSON.parse(rawMessage);
      // Only add messages that have the required properties
      if (parsedMessage.type && parsedMessage.role && parsedMessage.content) {
        const formattedMessage = {
          type: parsedMessage.type,
          role: parsedMessage.role === "assistant" ? "bot" : parsedMessage.role, // Convert "assistant" to "bot" for schema
          content: parsedMessage.content,
          timeStamp: new Date(), // Add current timestamp
        };

        setTranscript((prev) => [...prev, formattedMessage]);
        console.log("Added transcript message:", formattedMessage);
      }
    } catch (error) {
      console.error("Failed to parse transcript message:", rawMessage, error);
    }
  };
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

      // Only start pitch if we don't already have a sessionId
      if (!sessionId && !sessionIdRef.current) {
        try {
          const res = await axios.post("/api/pitch/start-pitch", {
            userId: "6886923965ec64a7db9f69a9",
          });
          if (res.status === 200) {
            const newSessionId = res.data.pitch._id;
            setSessionId(newSessionId);
            sessionIdRef.current = newSessionId;
            console.log("New sessionId created:", newSessionId);
          }
        } catch (error) {
          console.error("Error starting pitch", error);
        }
      }
      keepAlive.current = setInterval(sendKeepAliveMessage(newSocket), 10000);
    };

    const onError = (err) => {
      setSocketState(2); // error
      isConnecting.current = false; // Reset connection flag on error
      console.error("Websocket error", err);
    };

    const onClose = async () => {
      clearInterval(keepAlive.current);
      console.log("sending to backend");
      console.log("sessionId from state:", sessionId);
      console.log("sessionId from ref:", sessionIdRef.current);
      console.log("transcript from state:", transcript);
      console.log("transcript from ref:", transcriptRef.current);

      // Use the ref values which have the current data
      if (sessionIdRef.current) {
        await axios.post("/api/pitch/end-pitch", {
          sessionId: sessionIdRef.current,
          userId: "6886923965ec64a7db9f69a9",
          conversationHistory: transcriptRef.current,
        });
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
        transcript,
        setTranscript,
        addTranscriptMessage,
        sessionIdRef: sessionIdRef,
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
