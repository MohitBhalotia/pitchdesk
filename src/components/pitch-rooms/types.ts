export interface PitchRoomSummary {
  _id: string;
  name: string;
  practiceFocus: string | null;
  status: "active" | "archived";
  knowledgeBaseId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface RoomAgentSummary {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image: string;
  voice: string;
  firstMessage: string;
}
