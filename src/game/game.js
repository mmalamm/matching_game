import { assign, createMachine, actions } from "xstate";
const { send } = actions;

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
  UNFLIP_CARDS: "UNFLIP_CARDS",
};

const ConditionHash = {
  matchFound: "matchFound",
  noMatchFound: "noMatchFound",
  isGameWon: "isGameWon ",
};

const ActionHash = {
  flipCard: "flipCard",
  unflipCards: "unflipCards",
  createPair: "createPair",
};

const s = StateHash,
  e = EventsHash,
  c = ConditionHash,
  a = ActionHash;

export const gameMachine = createMachine(
  {
    id: "game",
    initial: s.playing,
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
            actions: [a.flipCard],
          },
        },
      },
      [s.two_cards_flipped]: {
        always: [
          {
            target: s.match_found,
            actions: [a.createPair],
            cond: c.matchFound,
          },
          {
            target: s.no_match_found,
            cond: c.noMatchFound,
          },
        ],
      },
      [s.no_match_found]: {
        after: [{ delay: 500, target: s.playing, actions: [a.unflipCards] }],
      },
      [s.match_found]: {
        always: [
          { target: s.won, cond: c.isGameWon },
          {
            target: s.playing,
          },
        ],
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
        const isMatch = isMatchFound(context.board);
        return isMatch;
      },
      [c.noMatchFound]: (context, event) => {
        const isMatch = isMatchFound(context.board);
        return !isMatch;
      },
    },
    actions: {
      [a.flipCard]: assign((context, event) => {
        console.log(a.flipCard, { context, event });
        const [rIdx, cIdx] = event.payload;
        const newCard = { ...context.board[rIdx][cIdx], flipped: true };
        const newBoard = dd(context.board);
        newBoard[rIdx][cIdx] = newCard;
        return {
          ...context,
          board: newBoard,
        };
      }),
      [a.unflipCards]: assign((context, event) => {
        const newBoard = dd(context.board);
        for (let row of newBoard) {
          for (let card of row) {
            if (!card.paired) card.flipped = false;
          }
        }
        return {
          ...context,
          board: newBoard,
        };
      }),
      [a.createPair]: assign((context, event) => {
        const newBoard = dd(context.board);
        for (let row of newBoard) {
          for (let card of row) {
            if (card.flipped) card.paired = true;
          }
        }
        return {
          ...context,
          board: newBoard,
        };
      }),
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
      return { value: item, flipped: false, paired: false };
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

function dd(o) {
  return JSON.parse(JSON.stringify(o));
}

function isMatchFound(board) {
  const flat = board.flat();
  const [c1, c2] = flat.filter((c) => !c.paired).filter((c) => c.flipped);
  return c1.value === c2.value;
}
