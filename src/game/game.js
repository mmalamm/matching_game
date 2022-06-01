import { assign, createMachine } from "xstate";
import {
  s,
  e,
  a,
  c,
  dd,
  createInitialBoard,
  isMatchFound,
  isGameOver,
} from "./utils";

export const gameMachine = createMachine(
  {
    id: "game",
    initial: s.playing,
    context: {
      board: createInitialBoard(),
    },
    states: {
      [s.playing]: {
        on: {
          [e.FLIP_CARD]: {
            target: s.one_card_flipped,
            actions: [a.flipCard],
            cond: c.isNotAlreadyFlipped,
          },
        },
      },
      [s.one_card_flipped]: {
        on: {
          [e.FLIP_CARD]: {
            target: s.two_cards_flipped,
            actions: [a.flipCard],
            cond: c.isNotAlreadyFlipped,
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
        on: {
          [e.PLAY_AGAIN]: {
            target: s.playing,
            actions: [a.playAgain],
          },
        },
      },
    },
  },
  {
    guards: {
      [c.isGameWon]: (context) => {
        return isGameOver(context.board);
      },
      [c.matchFound]: (context) => {
        const isMatch = isMatchFound(context.board);
        return isMatch;
      },
      [c.noMatchFound]: (context) => {
        const isMatch = isMatchFound(context.board);
        return !isMatch;
      },
      [c.isNotAlreadyFlipped]: (context, event) => {
        const [rIdx, cIdx] = event.payload;
        const isAlreadyFlipped = context.board[rIdx][cIdx].flipped;
        return !isAlreadyFlipped;
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
      [a.unflipCards]: assign((context) => {
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
      [a.createPair]: assign((context) => {
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
      [a.playAgain]: assign((context) => ({
        ...context,
        board: createInitialBoard(),
      })),
    },
  }
);
