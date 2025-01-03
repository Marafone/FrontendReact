export interface Translations {
    EN: {
      home: {
        title: string;
        createGameBtn: string;
        newsTitle: string;
        newsContent: string;
        lobbyName: string;
        gameType: string;
        players: string;
        loading: string;
        prevPage: string;
        nextPage: string;
        pageText: string;
      };
      login: {
        title: string;
        username: string;
        password: string;
        errorMessage: string;
        cancel: string;
        submit: string;
      };
      register: {
        title: string;
        username: string;
        email: string;
        password: string;
        errorMessage: string;
        cancel: string;
        submit: string;
      };
      rules: {
        title: string;
        gameName: string;
        gameAlias: string;
        description: string;
        deckDescription: string;
        pointsDescription: string;
        teamDescription: string;
        firstHand: string;
        maraffaBonus: string;
        trickRules: string;
        handConclusion: string;
        loadingImage: string;
        imageAlt: string;
      };
    };
}

export const translations = {
    EN: {
      home: {
        title: "Welcome to the Home Page!",
        createGameBtn: "Create Game",
        newsTitle: "News",
        newsContent:
          "We are currently working hard to improve the app! A new iOS version is in development, which will bring smoother gameplay and additional features for iPhone users. Stay tuned for updates as we roll out new enhancements for all platforms.",
        lobbyName: "Lobby name",
        gameType: "Game type",
        players: "Players",
        loading: "Loading...",
        prevPage: "Prev",
        nextPage: "Next",
        pageText: "Page",
      },
      login: {
        title: "Login",
        username: "Username",
        password: "Password",
        cancel: "Cancel",
        submit: "Submit",
        error: "Login failed. Please check your credentials.",
      },
      register: {
        title: "Register",
        username: "Username",
        email: "Email address",
        password: "Password",
        submit: "Submit",
        cancel: "Cancel",
        error: "Registration failed. Please try again.",
      },
      rules: {
        title: "Rules of Marafon",
        gameName: "Marafon",
        gameAlias: "Maraffa or Beccaccino",
        description: "is a trick-taking card game for four players from the Italian province of Romagna that is similar to Tressette, but features trumps.",
        deckDescription: "The game is played with a deck of 40 Italian-suited cards, ranked 3 2 A K C J 7 6 5 4 when determining the winner of a trick. In terms of points aces are worth a full point, while deuces, treys and court cards are worth ⅓ of a point; all other cards are worth no points.",
        pointsDescription: "Each hand is composed of 10 tricks, at the end of a hand the points won are rounded down to a whole number and the winner of the last trick is awarded 1 point. The match continues until a team reaches 41 points.",
        teamDescription: "Players split into two teams, with teammates sitting at opposite sides of the table. The dealer shuffles the deck and the player to his left cuts it. Ten cards are then dealt to each player, in batches of five.",
        firstHand: "In the first hand of a match, the player holding the 4 of coins (or diamonds, if playing with French-suited decks) christens the trump suit, called briscola, and leads the first trick. In all following hands, the player sitting to the dealer’s right will christen the briscola.",
        maraffaBonus: "If a player holds a maraffa (ace, deuce, trey) of the briscola they may declare it for an award of 3 bonus points.",
        trickRules: "Players must follow suit if they can, and may therefore only play a trump only if they don’t own any card of the leading suit. The trick is awarded to the player of the strongest card in the leading suit if no trump was played, or to the player of the strongest trump otherwise. The winner of the trick must lead the next trick.",
        handConclusion: "At the end of each hand, the points are tallied, and the player who led the first trick becomes the new dealer. It is not allowed to talk during the game.",
        loadingImage: "Loading image...",
        imageAlt: "All cards used in Marafon"
      },
      gameWaitingRoom: {
        events: {
          "defaultMessage": "Have fun!",
          "playerJoined": "{{playerName}} joined the game!",
          "playerLeft": "{{playerName}} left the game!",
          "title": "Events"
        },
        buttons: {
          "exit": "Exit",
          "redTeam": "Red",
          "blueTeam": "Blue",
          "startGame": "Start game"
        },
        labels: {
          "gameType": "Game Type",
          "players": "Players"
        }
      },
    },
    PL: {
      home: {
        title: "Witamy na stronie głównej!",
        createGameBtn: "Stwórz grę",
        newsTitle: "Aktualności",
        newsContent:
          "Pracujemy intensywnie nad ulepszaniem aplikacji! Nowa wersja na iOS jest w fazie rozwoju, która zapewni płynniejszą rozgrywkę i dodatkowe funkcje dla użytkowników iPhone. Śledź aktualizacje, gdy wprowadzimy nowe usprawnienia na wszystkie platformy.",
        lobbyName: "Nazwa lobby",
        gameType: "Typ gry",
        players: "Gracze",
        loading: "Ładowanie...",
        prevPage: "Poprzednia",
        nextPage: "Następna",
        pageText: "Strona",
      },
      login: {
        title: "Zaloguj się",
        username: "Nazwa użytkownika",
        password: "Hasło",
        cancel: "Anuluj",
        submit: "Zaloguj",
        error: "Logowanie nie powiodło się. Proszę sprawdzić dane logowania.",
      },
      register: {
        title: "Zarejestruj się",
        username: "Nazwa użytkownika",
        email: "Adres e-mail",
        password: "Hasło",
        submit: "Zarejestruj",
        cancel: "Anuluj",
        error: "Rejestracja nie powiodła się. Spróbuj ponownie.",
      },
      rules: {
        title: "Zasady gry w Marafon",
        gameName: "Marafon",
        gameAlias: "znany również jako Maraffa lub Beccaccino,",
        description:
          " to gra w karty dla czterech graczy pochodząca z włoskiej prowincji Romagna, podobna do Tressette, ale z udziałem atutów.",
        deckDescription:
          "Gra odbywa się talią 40 kart włoskich, uszeregowanych 3 2 A K C J 7 6 5 4 przy ustalaniu zwycięzcy lewy.",
        pointsDescription:
          "W punktacji asy są warte pełny punkt, dwójki, trójki i karty dworskie są warte ⅓ punktu; pozostałe karty nie mają wartości punktowej.",
        teamDescription:
          "Gracze dzielą się na dwie drużyny, siedząc naprzeciw siebie.",
        firstHand:
          "W pierwszej rundzie meczu gracz z 4 monet ogłasza atut i rozpoczyna grę.",
        maraffaBonus:
          "Jeśli gracz posiada maraffę (as, dwójka, trójka) w atucie, może to zadeklarować i otrzymać 3 dodatkowe punkty.",
        trickRules:
          "Gracze muszą dokładać kartę w kolorze, jeśli mogą. Atut można zagrać tylko wtedy, gdy nie mają żadnej karty wiodącego koloru.",
        handConclusion:
          "Na koniec każdej rundy punkty są sumowane, a gracz, który rozpoczął pierwszą lewę, zostaje nowym rozdającym.",
        loadingImage: "Ładowanie obrazu...",
        imageAlt: "Wszystkie karty używane w grze Marafon",
      },
      gameWaitingRoom: {
        events: {
          defaultMessage: "Baw się dobrze!",
          playerJoined: "{{playerName}} dołączył do gry!",
          playerLeft: "{{playerName}} opuścił grę!",
          title: "Wydarzenia"
        },
        buttons: {
          exit: "Wyjdź",
          redTeam: "Czerwoni",
          blueTeam: "Niebiescy",
          startGame: "Rozpocznij grę"
        },
        labels: {
          gameType: "Typ gry",
          players: "Gracze"
        }
      },
    },
    IT:{
      home: {
        title: "Benvenuto nella Pagina Iniziale!",
        createGameBtn: "Crea Partita",
        newsTitle: "Notizie",
        newsContent:
          "Stiamo lavorando duramente per migliorare l'app! Una nuova versione per iOS è in sviluppo e porterà un gameplay più fluido e funzionalità aggiuntive per gli utenti iPhone. Rimanete sintonizzati per aggiornamenti mentre implementiamo nuovi miglioramenti per tutte le piattaforme.",
        lobbyName: "Nome Lobby",
        gameType: "Tipo di Gioco",
        players: "Giocatori",
        loading: "Caricamento...",
        prevPage: "Precedente",
        nextPage: "Successiva",
        pageText: "Pagina"
      },
      login: {
        title: "Accesso",
        username: "Nome Utente",
        password: "Password",
        cancel: "Annulla",
        submit: "Invia",
        error: "Accesso fallito. Controlla le tue credenziali."
      },
      register: {
        title: "Registrazione",
        username: "Nome Utente",
        email: "Indirizzo Email",
        password: "Password",
        submit: "Invia",
        cancel: "Annulla",
        error: "Registrazione fallita. Riprova."
      },
      rules: {
        title: "Regole del Marafon",
        gameName: "Marafon",
        gameAlias: "conosciuto anche come Maraffa o Beccaccino,",
        description:
          "è un gioco di carte con prese per quattro giocatori della provincia italiana della Romagna, simile al Tressette ma con la presenza di briscola.",
        deckDescription:
          "Il gioco si svolge con un mazzo di 40 carte con semi italiani, ordinato 3 2 A R C F 7 6 5 4 per determinare il vincitore della presa.",
        pointsDescription:
          "In termini di punteggio, gli assi valgono un punto intero, mentre i due, i tre e le figure valgono ⅓ di punto; tutte le altre carte non valgono punti.",
        teamDescription:
          "I giocatori si dividono in due squadre, con i compagni seduti ai lati opposti del tavolo.",
        firstHand:
          "Nella prima mano di una partita, il giocatore che possiede il 4 di denari decide la briscola e guida la prima presa.",
        maraffaBonus:
          "Se un giocatore possiede una maraffa (asso, due, tre) di briscola, può dichiararla per ottenere un bonus di 3 punti.",
        trickRules:
          "I giocatori devono seguire il seme, se possono. La briscola può essere giocata solo se non si possiede alcuna carta del seme principale.",
        handConclusion:
          "Alla fine di ogni mano, i punti vengono contati e il giocatore che ha guidato la prima presa diventa il nuovo mazziere.",
        loadingImage: "Caricamento immagine...",
        imageAlt: "Tutte le carte utilizzate nel Marafon"
      },
      gameWaitingRoom: {
        events: {
          defaultMessage: "Divertiti!",
          playerJoined: "{{playerName}} si è unito al gioco!",
          playerLeft: "{{playerName}} ha lasciato il gioco!",
          title: "Eventi"
        },
        buttons: {
          exit: "Esci",
          redTeam: "Rosso",
          blueTeam: "Blu",
          startGame: "Inizia gioco"
        },
        labels: {
          gameType: "Tipo di gioco",
          players: "Giocatori"
        }
      }
    },
    RGN: {
      home: {
        title: "Bentvò in tla Pàgina Inizièla!",
        createGameBtn: "Créa la Partìda",
        newsTitle: "Notìzi",
        newsContent:
          "Stèm travoiè dur per migliurè l'app! Na nova versiòun per iOS la j è in svilòup e la purtéra un gameplay pió fluènt e funzionalità novi par i utént iPhone. Stè cuntad par i aggiornamenti quand ch'us purtèm di novi migliuramént par tót i piatafórmi.",
        lobbyName: "Nòm dla Lobby",
        gameType: "Tipo ad Giòuch",
        players: "Giucadór",
        loading: "Caricamènt...",
        prevPage: "Precedènta",
        nextPage: "Suscènta",
        pageText: "Pàgina"
      },
      login: {
        title: "Access",
        username: "Nòm Utènt",
        password: "Paròla ad Pas",
        cancel: "Anulè",
        submit: "Invìa",
        error: "Access falì. Cuntrolè i toi credenzièli."
      },
      register: {
        title: "Registraziòun",
        username: "Nòm Utènt",
        email: "Indirèz Email",
        password: "Paròla ad Pas",
        submit: "Invìa",
        cancel: "Anulè",
        error: "Registraziòun falì. Pròva d nòv."
      },
      rules: {
        title: "Regl dla Maraffò",
        gameName: "Maraffò",
        gameAlias: "cunusù anca cmè Maraffa o Beccaccìno,",
        description:
          "l'é un zòch ad carte cun i punti par quatr zugadòur de la Rumâgna, simìl a 'l Tressett ma cun la brìscola.",
        deckDescription:
          "U s'zuga cun un maz ad 40 carte cun i sem ad'Itàlia, ordinè 3 2 A R C F 7 6 5 4 par stabilìr chi vìnz la mà.",
        pointsDescription:
          "In tèrmini ad punti, l'ass val un punt intìr, e i du, i trè e i figure i valen ⅓ ad un punt; i alter carte an valen gnìnt.",
        teamDescription:
          "I zugadòur i s'dividan in dṡò squèdre, cun i cumpagn ch'i s'da par fàcia a'nt e' tàvla.",
        firstHand:
          "In tla prima mà d'una partida, chi tgnì la 4 ad danér la dà la brìscola e la guida la prima mà.",
        maraffaBonus:
          "Se un zugadòur l'à in man una maraffa (ass, du, trè) de la brìscola, al pò declarèl par ciapè 3 punti bonus.",
        trickRules:
          "I zugadòur i g'han da seguìr e' sem, se i pò. La brìscola la s'ciapàn s'ul gh'ò minga un carte cun e' sem guida.",
        handConclusion:
          "A la fin ad ogni mà, i punti i s'conten, e chi ha guidà la prima mà la dvèinta e' nôv dàl carteur.",
        loadingImage: "A s'cârica la imâggin...",
        imageAlt: "Tot i carte adoperè int la Maraffò"
      },
      gameWaitingRoom: {
        events: {
          defaultMessage: "Divirtèt!",
          playerJoined: "{{playerName}} l'è vnì in tla zóca!",
          playerLeft: "{{playerName}} l'è andè fura da la zóca!",
          title: "Evenmént"
        },
        buttons: {
          exit: "Esci",
          redTeam: "Russ",
          blueTeam: "Blu",
          startGame: "Cuminsa la zóca"
        },
        labels: {
          gameType: "Tìp ad zóca",
          players: "Zugadòur"
        }
      }
    }
  };