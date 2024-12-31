interface BaseEvent {
  eventType: string;
}

export type Card = {
  id: bigint;
  rank: string;
  suit: string;
};

type Team = "RED" | "BLUE";

export interface TurnState extends BaseEvent {
  eventType: "TurnState";
  turn: Map<string, Card>; // username -> card
}

export interface MyCardsState extends BaseEvent {
  eventType: "MyCardsState";
  myCards: Card[];
}

export interface PointState extends BaseEvent {
  eventType: "PointState";
  playerPointState: Map<string, number>; // username -> points
}

export interface PlayersOrderState extends BaseEvent {
  eventType: "PlayersOrderState";
  playersOrder: string[];
}

export interface TrumpSuitState extends BaseEvent {
  eventType: "TrumpSuitState";
  trumpSuit: string;
}

export interface NewRound extends BaseEvent {
  eventType: "NewRound";
}

export interface WinnerState extends BaseEvent {
  eventType: "WinnerState";
  winnerTeam: Team;
}

export interface ErrorEvent extends BaseEvent {
  eventType: "ErrorEvent";
  errorMessage: string;
}
