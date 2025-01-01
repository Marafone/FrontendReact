interface BaseEvent {
  eventType: string;
}

export type Team = "RED" | "BLUE";

export interface TeamStateEvent extends BaseEvent {
  eventType: "TeamState";
  teamState: Map<string, Team>;
}

export interface PlayerJoinedEvent extends BaseEvent {
  eventType: "PlayerJoinedEvent";
  playerName: string;
  team: Team;
}

export interface GameStartedEvent extends BaseEvent {
  eventType: "GameStartedEvent";
}

export interface PlayerLeftEvent extends BaseEvent {
  eventType: "PlayerLeftEvent";
  playerName: string;
}