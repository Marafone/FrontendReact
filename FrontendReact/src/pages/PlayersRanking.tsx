import React, { useContext, useEffect, useState } from "react";
import images from "../cards/cards_importer";
import "../styles/players-ranking.css";
import axios from "axios";
import ErrorModal from "../components/ErrorModal";
import { LanguageContext } from "../context/LanguageContext";
import { useTheme } from "../context/ThemeContext";

axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL;

interface PlayerRankingInfo {
  position: number;
  username: string;
  wins: number;
  losses: number;
}

interface PlayerStatsInfo {
  playerRankingInfo: PlayerRankingInfo;
  winRatio: string;
}

interface RankingPage {
  users: PlayerRankingInfo[];
  pageNumber: number;
}

const roundToTwo = (num: number) => Math.round(num * 100) / 100;

const calculateWinRatio = (wins: number, losses: number): string => {
  if (wins + losses == 0) return "0%";
  const winRatio = (wins / (wins + losses)) * 100;
  const roundedWinRatio = roundToTwo(winRatio);
  return roundedWinRatio + "%";
};

const PlayersRanking = () => {
  const rangeTitles = new Map([
    [[1, 1], "THE SUPREME"],
    [[2, 5], "LEGENDARY"],
    [[6, 10], "ELITE"],
    [[11, 50], "MASTER"],
    [[51, 100], "CHAMPION"],
    [[101, 500], "VETERAN"],
    [[501, 1000], "COMPETITOR"],
    [[1001, 5000], "CHALLENGER"],
    [[5001], "ROOKIE"],
  ]);

  const [playersInfo, setPlayersInfo] = useState<PlayerRankingInfo[]>([]);
  const [currentPlayerInfo, setCurrentPlayerInfo] =
    useState<PlayerRankingInfo>();
  const [playerStats, setPlayerStats] = useState<PlayerStatsInfo>();

  const [page, setPage] = useState(0);
  const [nextPageExist, setNextPageExist] = useState(true);
  const pageSize = 5;

  const [searchedPlayerNickname, setSearchedPlayerNickname] =
    useState<string>();

  const [errorMessage, setErrorMessage] = useState<string>("");

  const findPlayerTitle = (rankingPosition: number) => {
    for (let [range, title] of rangeTitles)
      if (
        range.length == 1 ||
        (rankingPosition >= range[0] && rankingPosition <= range[1])
      )
        return title;
  };

  const setStats = (player: PlayerRankingInfo) => {
    let playerStats: PlayerStatsInfo = {
      playerRankingInfo: player,
      winRatio: calculateWinRatio(player.wins, player.losses),
    };
    setPlayerStats(playerStats);
  };

  const searchForPlayer = (nickname: string) => {
    axios
      .get(`/users/${nickname}/ranking?pageSize=${pageSize}`)
      .then((response) => {
        const rankingPage: RankingPage = response.data;
        console.log(response.data);
        console.log(rankingPage);
        setPlayersInfo(rankingPage.users);
        setPage(rankingPage.pageNumber);
      })
      .catch((error) => {
        if (error.status == 404)
          setErrorMessage(
            "The user you are searching for does not exist in the ranking. Please check the username and try again."
          );
      });
  };

  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error("LanguageContext must be used within a LanguageProvider.");
  }

  const { t } = context;

  const { theme } = useTheme();

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  useEffect(() => {
    axios
      .get(`/users/ranking?page=${page}&size=${pageSize}`)
      .then((response) => {
        let playersRankingInfo: PlayerRankingInfo[] = response.data;
        setPlayersInfo(playersRankingInfo);
        setNextPageExist(playersRankingInfo.length > 0);
      });
  }, [page]);

  useEffect(() => {
    axios
      .get("/user/ranking")
      .then((response) => {
        let currentPlayerRankingInfo: PlayerRankingInfo = response.data;
        currentPlayerRankingInfo.username = "You";
        let playerStatsInfo: PlayerStatsInfo = {
          playerRankingInfo: currentPlayerRankingInfo,
          winRatio: calculateWinRatio(
            currentPlayerRankingInfo.wins,
            currentPlayerRankingInfo.losses
          ),
        };
        setCurrentPlayerInfo(currentPlayerRankingInfo);
        setPlayerStats(playerStatsInfo);
      })
      .catch((err) => {
        console.log("Error occurred:", err);
      });
  }, []);

  const handleSearchedPlayerNicknameChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSearchedPlayerNickname(event.target.value);
  };

  return (
    <>
      {errorMessage && (
        <ErrorModal
          title="User not found"
          message={errorMessage}
          onClose={() => setErrorMessage("")}
        />
      )}
      <div className="custom-wrapper-div d-flex flex-column flex-md-row justify-content-between align-items-center custom-ranking-outer-div gap-4 w-100 rounded-3">
        {/* Statistics section */}
        <div className="custom-statistics-section">
          <div className="custom-statistics-card d-flex flex-column justify-content-center gap-4 rounded-4 shadow py-5 text-center text-white m-auto">
            <p className="custom-statistics-title fw-bold m-0">
              {t("ranking.statistics")}
            </p>
            <div className="d-lg-flex d-none justify-content-center">
              <img
                src={images["Coins_FOUR"]}
                alt=""
                className="custom-statistics-card-image border border-secondary border border-3 border-black"
              />
            </div>
            <div className="custom-statistics-description">
              <div className="d-flex justify-content-between px-5 gap-3">
                <p className="fw-bold">{t("ranking.player")}</p>
                <p>{playerStats?.playerRankingInfo.username ?? "-"}</p>
              </div>
              <div className="d-flex justify-content-between px-5 gap-3">
                <p className="fw-bold">{t("ranking.wins")}</p>
                <p>{playerStats?.playerRankingInfo.wins ?? "-"}</p>
              </div>
              <div className="d-flex justify-content-between px-5 gap-3">
                <p className="fw-bold">{t("ranking.losses")}</p>
                <p>{playerStats?.playerRankingInfo.losses ?? "-"}</p>
              </div>
              <div className="d-flex justify-content-between px-5 gap-3">
                <p className="fw-bold">{t("ranking.winRatio")}</p>
                <p>{playerStats?.winRatio ?? "-"}</p>
              </div>
            </div>
          </div>
        </div>
        {/* Players ranking section */}
        <div className="custom-players-ranking-section d-flex flex-column align-items-center gap-4">
          {/* Title section */}
          <div className="d-flex align-items-center gap-5">
            <p className="text-center m-0">
              <span className="fs-1 fw-bold d-block">
                {t("ranking.players")}
              </span>
              <span className="fs-4 fw-normal d-block custom-ranking-word">
                {t("ranking.ranking")}
              </span>
            </p>
            <div className="custom-title-images d-xxl-flex d-none gap-3">
              <img
                src={images["Coins_THREE"]}
                alt=""
                className="custom-players-ranking-image border border-secondary border-opacity-25"
              />
              <img
                src={images["Clubs_THREE"]}
                alt=""
                className="custom-players-ranking-image border border-secondary border-opacity-25"
              />
              <img
                src={images["Swords_THREE"]}
                alt=""
                className="custom-players-ranking-image border border-secondary border-opacity-25"
              />
              <img
                src={images["Cups_THREE"]}
                alt=""
                className="custom-players-ranking-image border border-secondary border-opacity-25"
              />
            </div>
          </div>
          {/* Search section */}
          <div className="d-flex align-items-center gap-2">
            <label htmlFor="username" className="custom-search-label fw-bold">
              {t("ranking.search")}
            </label>
            <div className="d-flex justify-content-center">
              <input
                type="text"
                id="username"
                name="username"
                placeholder="Nickname"
                onChange={handleSearchedPlayerNicknameChange}
                className="custom-search-input border-0 w-75"
              />
              <i
                className="custom-search-icon bi bi-search ms-0"
                onClick={() =>
                  searchedPlayerNickname &&
                  searchForPlayer(searchedPlayerNickname)
                }
              ></i>
            </div>
          </div>
          {/* Players section */}
          <div className="custom-players-section">
            {/* other players ranking */}
            {playersInfo.length == 0 ? (
              <div className="bg-danger px-3 py-2 rounded-3 mb-3">
                <p className="text-white text-center fw-bold m-0">
                  {t("ranking.noPlayers")}
                </p>
              </div>
            ) : (
              playersInfo.map((playerInfo) => (
                <div
                  className="custom-player-ranking-container d-flex justify-content-between gap-4 align-items-center px-3 py-2 rounded-3 mb-3"
                  key={playerInfo.username}
                  onClick={() => setStats(playerInfo)}
                >
                  <div className="d-flex align-items-center gap-2">
                    <div className="custom-player-ranking-container-position bg-warning text-center fw-semibold">
                      {playerInfo.position}
                    </div>
                    <p className="custom-player-ranking-container-username m-0">
                      {playerInfo.username}
                    </p>
                  </div>
                  <p className="custom-player-ranking-container-title fw-bold m-0">
                    {findPlayerTitle(playerInfo.position)}
                  </p>
                </div>
              ))
            )}
            {/* pages section */}
            <div className="d-flex justify-content-center align-items-center mb-3">
              <button
                className="custom-page-btn btn btn-secondary rounded-0"
                onClick={() => setPage((page) => page - 1)}
                disabled={page === 0}
              >
                {t("home.prevPage")}
              </button>
              <p className="custom-page-number bg-secondary m-0 px-2 py-1 text-white border ">
                {page + 1}
              </p>
              <button
                className="custom-page-btn btn btn-secondary rounded-0"
                onClick={() => setPage((page) => page + 1)}
                disabled={!nextPageExist}
              >
                {t("home.nextPage")}
              </button>
            </div>
            {/* current player ranking */}
            <div
              className="custom-user-player-ranking-container d-flex justify-content-between align-items-center px-3 py-2 rounded-3"
              onClick={() => currentPlayerInfo && setStats(currentPlayerInfo)}
            >
              <div className="d-flex align-items-center gap-2">
                <div className="custom-player-ranking-container-position bg-warning text-center rounded-1">
                  {currentPlayerInfo?.position ?? "?"}
                </div>
                <p className="custom-player-ranking-container-username fw-bold m-0">
                  You
                </p>
              </div>
              <p className="custom-player-ranking-container-title fw-bold m-0">
                {currentPlayerInfo?.position
                  ? findPlayerTitle(currentPlayerInfo?.position)
                  : "unknown"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PlayersRanking;
