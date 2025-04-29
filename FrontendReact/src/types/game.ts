enum GameType {
    Maraffa = "Maraffa",
    Briscolla = "Briscolla",
    Trisette = "Trisette",
}

interface GameData {
    gameId: bigint;
    gameName: string;
    gameType: GameType;
    joinedPlayersAmount: number;
    isPrivate: boolean;
}

export default GameData;