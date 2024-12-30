interface BaseEvent {
  eventType: string;
}

export type Card = {
  id: bigint;
  rank: string;
  suit: string;
};

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