type TranslationsType = {
  [key: string]: {
    [nestedKey: string]: any;
  };
};


export const translations: TranslationsType = {
    EN: {
      home: {
        title: "Welcome to the Home Page!",
        createGameBtn: "Create Game",
        newsTitle: "News",
        newsContent:
          "We are currently working hard to improve the app! A new iOS version is in development, which will bring smoother gameplay and additional features for iPhone users. Stay tuned for updates as we roll out new enhancements for all platforms.",
        lobbyName: "Lobby name",
        gameType: "Game type",
        points: "Points",
        players: "Players",
        loading: "Loading...",
        prevPage: "Prev",
        nextPage: "Next",
        pageText: "Page",
      },
      login: {
        title: "Log In",
        username: "Username",
        password: "Password",
        cancel: "Cancel",
        submit: "Submit",
        error: "Login failed. Please check your credentials.",
        register: "Go to Register",
      },
      register: {
        title: "Register",
        username: "Username",
        email: "Email address",
        password: "Password",
        submit: "Submit",
        cancel: "Cancel",
        error: "Registration failed. Please try again.",
        login: "Go to Log In",
      },
      logout: "Log Out",
      language: "Language",
      rules: {
        navbar: "Rules",
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
      ranking: {
        navbar: "Ranking",
        player: "Player",
        players: "Players",
        ranking: "Ranking",
        search: "Search",
        wins: "Wins",
        losses: "Losses",
        winRatio: "Win Ratio",
        statistics: "Statistics",
        noPlayers: "No Players on this page"
      },
      errors: {
        gameNameLength: "Name length must be between 4 and 20 characters",
        passwordEmpty: "Password cannot be empty",
        gameNameTaken: "Game name already taken. Try with the other name.",
      },
      placeholders: {
        gameName: "SampleName123",
        password: "password123",
      },
      labels: {
        private: "Private",
      },
      gameTypes: {
        marafone: "Marafone",
        briscola: "Briscola",
        tresette: "Tresette",
      },   
      gameWaitingRoom: {
        events: {
          defaultMessage: "Have fun!",
          playerJoined: "joined the game!",
          playerLeft: "left the game!",
          title: "Events",
        },
        buttons: {
          exit: "Exit",
          redTeam: "Red",
          blueTeam: "Blue",
          addAI: "Add AI",
          startGame: "Start game",
        },
        labels: {
          gameType: "Game Type",
          players: "Players",
        },
        info: {
          newOwnerTitle: "New Game Owner Selected",
          newOwnerMessage: "{{ownerName}} is now the owner. The previous owner has left the game.",
        },
      },
     
      loading: "Loading game data...",
      call: "call",
      gameOver: "Game Over",
      teamWon: "team won!",
      exit: "Exit",
      hide: "Hide",
      show: "Show",
      lastTurnCards: "Last Turn Cards",
      points: "Points",
      and: "and",
      trumpSuit: "Trump Suit",
      none: "None",
      coins: "Coins",
      cups: "Cups",
      clubs: "Clubs",
      swords: "Swords",
      knock: "Knock",
      fly: "Fly",
      slither: "Slither",
      reslither: "Reslither",
      
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
        points: "Punkty",
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
        register: "Przejdź do rejestracji",
      },
      register: {
        title: "Zarejestruj się",
        username: "Nazwa użytkownika",
        email: "Adres e-mail",
        password: "Hasło",
        submit: "Zarejestruj",
        cancel: "Anuluj",
        error: "Rejestracja nie powiodła się. Spróbuj ponownie.",
        login: "Przejdź do logowania",
      },
      logout: "Wyloguj się",
      language: "Język",
      rules: {
        navbar: "Zasady",
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
      ranking: {  
        navbar: "Ranking",  
        player: "Gracz",
        players: "Gracze",  
        ranking: "Ranking",  
        search: "Szukaj",  
        wins: "Wygrane",  
        losses: "Przegrane",  
        winRatio: "Procent wygranych",  
        statistics: "Statystyki",  
        noPlayers: "Brak graczy na tej stronie"  
      },
      errors: {
        gameNameLength: "Długość nazwy musi wynosić od 4 do 20 znaków",
        passwordEmpty: "Hasło nie może być puste",
        gameNameTaken: "Nazwa gry jest już zajęta. Spróbuj inną nazwę."
      },
      placeholders: {
        gameName: "PrzykładowaNazwa123",
        password: "haslo123"
      },
      labels: {
        private: "Prywatna"
      },
      gameTypes: {
        marafone: "Marafone",
        briscola: "Briscola",
        tresette: "Tresette"
      },
      gameWaitingRoom: {  
        events: {  
            defaultMessage: "Baw się dobrze!",  
            playerJoined: "dołączył do gry!",  
            playerLeft: "opuścił grę!",  
            title: "Zdarzenia",  
        },  
        buttons: {  
            exit: "Wyjdź",  
            redTeam: "Czerwony",  
            blueTeam: "Niebieski",
            addAI: "Dodaj AI", 
            startGame: "Rozpocznij grę",  
        },  
        labels: {  
            gameType: "Typ gry",  
            players: "Gracze",  
        },  
        info: {  
            newOwnerTitle: "Nowy właściciel gry",  
            newOwnerMessage: "{{ownerName}} jest teraz właścicielem. Poprzedni właściciel opuścił grę.",  
        },  
      },  
      loading: "Ładowanie danych gry...",  
      call: "wezwanie",  
      gameOver: "Koniec gry",  
      teamWon: "drużyna wygrała!",  
      exit: "Wyjdź",  
      hide: "Ukryj",  
      show: "Pokaż",  
      lastTurnCards: "Karty z ostatniej tury",  
      points: "Punkty",  
      and: "i",  
      trumpSuit: "Atut",  
      none: "Brak",  
      coins: "Monety",  
      cups: "Kielichy",  
      clubs: "Buławy",  
      swords: "Miecze",  
      knock: "Pukanie",  
      fly: "Lot",  
      slither: "Pełzanie",  
      reslither: "Ponowne pełzanie",  
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
        points: "Punti",
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
        error: "Accesso fallito. Controlla le tue credenziali.",
        register: "Vai alla registrazione",
      },
      register: {
        title: "Registrazione",
        username: "Nome Utente",
        email: "Indirizzo Email",
        password: "Password",
        submit: "Invia",
        cancel: "Annulla",
        error: "Registrazione fallita. Riprova.",
        login: "Vai al login",
      },
      logout: "Esci",
      language: "Lingua",
      rules: {
        navbar: "Regole",
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
      ranking: {  
        navbar: "Classifica",  
        player: "Giocatore",
        players: "Giocatori",  
        ranking: "Classifica",  
        search: "Cerca",  
        wins: "Vittorie",  
        losses: "Sconfitte",  
        winRatio: "Percentuale di vittorie",  
        statistics: "Statistiche",  
        noPlayers: "Nessun giocatore in questa pagina"  
      },
      errors: {  
        gameNameLength: "La lunghezza del nome deve essere compresa tra 4 e 20 caratteri",  
        passwordEmpty: "La password non può essere vuota",  
        gameNameTaken: "Nome della partita già preso. Prova con un altro nome.",  
      },  
      placeholders: {  
          gameName: "NomeEsempio123",  
          password: "password123",  
      },  
      labels: {  
          private: "Privata",  
      },  
      gameTypes: {  
          marafone: "Marafone",  
          briscola: "Briscola",  
          tresette: "Tresette",  
      },  
      gameWaitingRoom: {  
        events: {  
            defaultMessage: "Divertiti!",  
            playerJoined: "si è unito al gioco!",  
            playerLeft: "ha lasciato il gioco!",  
            title: "Eventi",  
        },  
        buttons: {  
            exit: "Esci",  
            redTeam: "Rosso",  
            blueTeam: "Blu",  
            addAI: "Aggiungi AI",
            startGame: "Inizia partita",  
        },  
        labels: {  
            gameType: "Tipo di gioco",  
            players: "Giocatori",  
        },  
        info: {  
            newOwnerTitle: "Nuovo proprietario della partita",  
            newOwnerMessage: "{{ownerName}} è ora il proprietario. Il precedente proprietario ha lasciato il gioco.",  
        },  
      },  
      loading: "Caricamento dati di gioco...",  
      call: "chiamata",  
      gameOver: "Fine partita",  
      teamWon: "squadra ha vinto!",  
      exit: "Esci",  
      hide: "Nascondi",  
      show: "Mostra",  
      lastTurnCards: "Carte dell'ultimo turno",  
      points: "Punti",  
      and: "e",  
      trumpSuit: "Briscola",  
      none: "Nessuna",  
      coins: "Denari",  
      cups: "Coppe",  
      clubs: "Bastoni",  
      swords: "Spade",  
      knock: "Busso",  
      fly: "Volo",  
      slither: "Striscio",  
      reslither: "Ristriscio",  
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
        points: "Punté",
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
        error: "Access falì. Cuntrolè i toi credenzièli.",
        register: "Va a l’iscriziò",
      },
      register: {
        title: "Registraziòun",
        username: "Nòm Utènt",
        email: "Indirèz Email",
        password: "Paròla ad Pas",
        submit: "Invìa",
        cancel: "Anulè",
        error: "Registraziòun falì. Pròva d nòv.",
        login: "Va a la arclènta",
      },
      logout: "Sgnìs da fôra",
      language: "Léngua",
      rules: {
        navbar: "Réguel",
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
      ranking: {  
        navbar: "Clasifich",  
        player: "Zugadôr",
        players: "Zugaadôr",  
        ranking: "Clasifich",  
        search: "Cérca",  
        wins: "Vint",  
        losses: "Pers",  
        winRatio: "Percintéda ad vint",  
        statistics: "Statistich",  
        noPlayers: "Nissun zugadôr in sta pagina"  
      },
      errors: {  
        gameNameLength: "La lunghezza dla nóm duvés èsar tra 4 e 20 caràter.",  
        passwordEmpty: "La parola segreta la pò n'èsar vòida",  
        gameNameTaken: "Al nóm dla zógh l'é zà ciapê. Pròva un nóm diffarènt.",  
      },  
      placeholders: {  
          gameName: "EsempiNòm123",  
          password: "parolasegreta123",  
      },  
      labels: {  
          private: "Privê",  
      },  
      gameTypes: {  
          marafone: "Marafone",  
          briscola: "Briscola",  
          tresette: "Tresette",  
      },  
      gameWaitingRoom: {  
        events: {  
            defaultMessage: "Divartit!",  
            playerJoined: "l'è intrê in tla zógh!",  
            playerLeft: "l'ha lassê la zógh!",  
            title: "Event",  
        },  
        buttons: {  
            exit: "Své",  
            redTeam: "Rôs",  
            blueTeam: "Blê",  
            addAI: "Zvé un AI",
            startGame: "Cuminsa la zógh",  
        },  
        labels: {  
            gameType: "Tìp ed zógh",  
            players: "Zughadôr",  
        },  
        info: {  
            newOwnerTitle: "Nuov parun dla zógh",  
            newOwnerMessage: "{{ownerName}} l'è adès al parun. Al vécc parun l'ha lassê la zógh.",  
        },  
      },   
      loading: "Carghénd i dat dla zógh...",  
      call: "chiamê",  
      gameOver: "Fin dla zógh",  
      teamWon: "squadra l'ha vinciû!",  
      exit: "Své",  
      hide: "Zug",  
      show: "Mustrê",  
      lastTurnCards: "Cart dla ùltima mà",  
      points: "Punt",  
      and: "e",  
      trumpSuit: "Brìscula",  
      none: "Nisun",  
      coins: "Danar",  
      cups: "Cop",  
      clubs: "Bastón",  
      swords: "Spêd",  
      knock: "Bat",  
      fly: "Zvulê",  
      slither: "Strisé",  
      reslither: "Ristrisé",  
    }
  };