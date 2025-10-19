import React, { useRef, useLayoutEffect, type FC } from "react";
import {
  isConversationMessage,
  isUserMessage,
  useVoiceBot,
  type ConversationMessage,
  type LatencyMessage,
} from "../context/VoiceBotContextProvider";
import { UserIcon } from "./icons/UserIcon";
import { AssistantIcon } from "./icons/AssistantIcon";
import Latency from "./Latency";
import { useSearchParams } from "next/navigation";
import { latencyMeasurementQueryParam } from "../lib/constants";
import Image from "next/image";

const ConversationMessageDisplay: FC<{
  message: ConversationMessage;
  firstInSequence: boolean;
  agent: Agent;
}> = ({ message, firstInSequence, agent }) => (
  <div
    className={`flex flex-col ${
      isUserMessage(message)
        ? "ml-8 md:ml-16 items-end"
        : "mr-8 md:mr-16 items-start"
    } ${isUserMessage(message) && firstInSequence ? "mt-4" : "mt-2"}
    ${isUserMessage(message) && message.user === "" ? "italic" : ""}`}
  >
    <div
      className={`flex justify-center items-center gap-2 ${isUserMessage(message) ? "flex-row-reverse" : ""}`}
    >
      <span
        className={`flex-shrink-0 ${firstInSequence ? "" : "opacity-0"}`}
        aria-hidden={!firstInSequence}
      >
        {isUserMessage(message) ? (
          <UserIcon />
        ) : agent.image ? (
          <Image
            src={agent.image}
            alt={agent.name}
            width={40}
            height={40}
            className="rounded-full"
          />
        ) : (
          <AssistantIcon />
        )}
      </span>
      <p
        className={`text-gray-200 border py-3 px-6 rounded-2xl ${
          isUserMessage(message)
            ? "bg-gray-800 border-gray-700 "
            : "bg-gray-1000  border-gray-800"
        }`}
      >
        {isUserMessage(message)
          ? message.user || "<non-word utterance detected>"
          : message.assistant}
      </p>
    </div>
  </div>
);

const LatencyMessageDisplay: FC<{ message: LatencyMessage }> = ({
  message,
}) => (
  <div className="flex items-center justify-center mt-2 text-gray-200">
    <Latency message={message} />
  </div>
);

const isFirstMessageInSpeakerSequence = (
  message: ConversationMessage,
  allMessages: ConversationMessage[]
) => {
  const previousMessage = allMessages[allMessages.indexOf(message) - 1];
  if (!previousMessage) return true;
  return isUserMessage(message) !== isUserMessage(previousMessage);
};

function Conversation({ agent }: { agent: Agent }) {
  const { displayOrder } = useVoiceBot();
  const scrollRef = useRef<HTMLDivElement>(null);
  const searchParams = useSearchParams();

  useLayoutEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [displayOrder]);

  return (
    <div className="bg-gray-900 shadow-lg overflow-auto h-screen">
      <div className="h-full flex flex-col justify-between">
        <div className="flex gap-2 justify-center border-b text-white border-gray-800 shadow-xl py-4 mx-8 text-lg font-bold text-gray-450">
          <p className="md:block hidden">Conversation</p>
          <p>Transcript :</p>
        </div>

        <div
          ref={scrollRef}
          className="scrollbar flex flex-col items-center pb-4 overflow-auto"
        >
          <div className="px-4 max-w-xl">
            {displayOrder.map((message, index) =>
              isConversationMessage(message) ? (
                <ConversationMessageDisplay
                  message={message}
                  firstInSequence={isFirstMessageInSpeakerSequence(
                    message,
                    displayOrder.filter(isConversationMessage)
                  )}
                  key={index}
                  agent={agent}
                />
              ) : (
                searchParams.get(latencyMeasurementQueryParam) && (
                  <LatencyMessageDisplay message={message} key={index} />
                )
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Conversation;
