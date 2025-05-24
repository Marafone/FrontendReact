enum GameType {
    Maraffa = "Maraffa",
    Briscolla = "Briscolla",
    Trisette = "Trisette",
}

export default interface GameData {
    gameId: bigint;
    gameName: string;
    gameType: GameType;
    joinedPlayersAmount: number;
}