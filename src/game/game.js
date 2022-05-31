import { createMachine } from "xstate";

const StateHash = {
  not_started: "not_started",
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
};

const ConditionHash = {
  matchFound: "matchFound",
  noMatchFound: "noMatchFound",
  isGameWon: "isGameWon ",
};

const ActionHash = {
  flipCard: "flipCard",
};

const s = StateHash,
  e = EventsHash,
  c = ConditionHash,
  a = ActionHash;

const machine = createMachine(
  {
    id: "game",
    initial: s.not_started,
    context: {
      board: createInitialBoard(),
    },
    states: {
      [s.not_started]: {
        on: {
          [e.START_GAME]: {
            target: s.playing,
          },
        },
      },
      [s.playing]: {
        on: {
          [e.FLIP_CARD]: {
            target: s.one_card_flipped,
            actions: [a.flipCard],
          },
        },
      },
      [s.one_card_flipped]: {
        on: {
          [e.FLIP_CARD]: {
            target: s.two_cards_flipped,
          },
        },
      },
      [s.two_cards_flipped]: {
        always: [
          { target: s.match_found, cond: c.matchFound },
          {
            target: s.no_match_found,
            cond: c.noMatchFound,
          },
        ],
      },
      [s.no_match_found]: {
        after: {},
      },
      [s.match_found]: {
        always: [{ target: s.won, cond: c.isGameWon }],
      },
      [s.won]: {
        type: "final",
      },
    },
  },
  {
    guards: {
      [c.isGameWon]: (context, event) => {
        console.log(c.isGameWon, { context, event });
        return false;
      },
      [c.matchFound]: (context, event) => {
        console.log(c.matchFound, { context, event });
        return false;
      },
      [c.noMatchFound]: (context, event) => {
        console.log(c.noMatchFound, { context, event });
        return false;
      },
    },
    actions: {
      [a.flipCard]: (context, event) => {
        console.log(a.flipCard, { context, event });
      },
    },
  }
);

function createInitialBoard() {
  const items = [
    "javascript",
    "python",
    "ruby",
    "java",
    "golang",
    "rust",
    "c++",
    "haskell",
    "scala",
    "erlang",
  ];

  const cards = chunkArray(
    shuffleArray([...items, ...items]).map((item, idx) => {
      return { value: item, flipped: false };
    })
  );

  return cards;
}

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
    while (row.length < 5) {
      row.push(array.pop());
    }
    output.push(row);
  }
  return output;
}
