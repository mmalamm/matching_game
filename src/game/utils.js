const StateHash = {
  playing: "playing",
  one_card_flipped: "one_card_flipped",
  two_cards_flipped: "two_cards_flipped",
  no_match_found: "no_match_found",
  match_found: "match_found",
  won: "won",
};

const EventsHash = {
  START_GAME: "START_GAME",
  FLIP_CARD: "FLIP_CARD",
  UNFLIP_CARDS: "UNFLIP_CARDS",
  PLAY_AGAIN: "PLAY_AGAIN",
};

const ConditionHash = {
  matchFound: "matchFound",
  noMatchFound: "noMatchFound",
  isGameWon: "isGameWon ",
  isNotAlreadyFlipped: "isNotAlreadyFlipped",
};

const ActionHash = {
  flipCard: "flipCard",
  unflipCards: "unflipCards",
  createPair: "createPair",
  playAgain: "playAgain",
};

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function chunkArray(array) {
  const output = [];
  while (output.length < 4) {
    const row = [];
    while (row.length < 4) {
      row.push(array.pop());
    }
    output.push(row);
  }
  return output;
}

export const s = StateHash,
  e = EventsHash,
  c = ConditionHash,
  a = ActionHash,
  dd = (o) => JSON.parse(JSON.stringify(o)),
  isMatchFound = (board) => {
    const flat = board.flat();
    const [c1, c2] = flat.filter((c) => !c.paired).filter((c) => c.flipped);
    return c1.value === c2.value;
  },
  isGameOver = (board) => board.flat().filter((c) => !c.paired).length === 0,
  createInitialBoard = () => {
    const items = [
      "javascript",
      "python",
      "ruby",
      "java",
      "cpp",
      "haskell",
      "kotlin",
      "swift",
    ];

    const board = chunkArray(
      shuffleArray([...items, ...items]).map((item, idx) => {
        return { value: item, flipped: false, paired: false };
      })
    );

    return board;
  };
