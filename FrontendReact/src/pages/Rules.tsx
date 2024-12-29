import React, { useState } from "react";
import Navbar from "../components/Navbar.tsx";
import "../styles/rules-page.css";

const Rules: React.FC = () => {
  // Add state for loading
  const [loading, setLoading] = useState(false); // You can set to true if you want a loading simulation initially

  return (
    <>
      <Navbar />
      <div className="rules-page d-flex justify-content-center align-items-center container-fluid h-100">
        <div className="rules-content">
          <h1 className="text-center">Rules of Marafon</h1>
          <p>
            <strong>Marafon</strong>, Maraffa or Beccaccino is a trick-taking card game for four players from the Italian province of Romagna that is similar to Tressette, but features trumps.
          </p>
          <p>
            The game is played with a deck of 40 Italian-suited cards, ranked 3 2 A K C J 7 6 5 4 when determining the winner of a trick. In terms of points aces are worth a full point, while deuces, treys and court cards are worth ⅓ of a point; all other cards are worth no points. Each hand is composed of 10 tricks, at the end of a hand the points won are rounded down to a whole number and the winner of the last trick is awarded 1 point. The match continues until a team reaches 41 points.
          </p>
          <p>
            Players split into two teams, with teammates sitting at opposite sides of the table. The dealer shuffles the deck and the player to his left cuts it. Ten cards are then dealt to each player, in batches of five.
          </p>
          <p>
            In the first hand of a match, the player holding the 4 of coins (or diamonds, if playing with French-suited decks) christens the trump suit, called briscola, and leads the first trick. In all following hands, the player sitting to the dealer’s right will christen the briscola.
          </p>
          <p>
            If a player holds a maraffa (ace, deuce, trey) of the briscola they may declare it for an award of 3 bonus points.
          </p>
          <p>
            Players must follow suit if they can, and may therefore only play a trump only if they don’t own any card of the leading suit. The trick is awarded to the player of the strongest card in the leading suit if no trump was played, or to the player of the strongest trump otherwise. The winner of the trick must lead the next trick.
          </p>
          <p>
            At the end of each hand, the points are tallied, and the player who led the first trick becomes the new dealer. It is not allowed to talk during the game.
          </p>
          <div className="image-container">
            {loading ? (
              <p>Loading image...</p>
            ) : (
              <img
                src="/images/cards.png"
                alt="All cards used in Marafon"
                className="rules-image"
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Rules;