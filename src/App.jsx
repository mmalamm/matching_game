import { useMachine } from "@xstate/react";
import "./App.css";
import { gameMachine } from "./game/game";
import { images } from "./game/images";
// import { inspect } from "@xstate/inspect";

// inspect({
//   iframe: false,
// });
function App() {
  const [state, send] = useMachine(gameMachine /*, { devTools: true }*/);
  const { board } = state.context;
  return (
    <div className="App">
      {board.map((row, rIdx) => {
        return (
          <div key={rIdx} className="row">
            {row.map(({ flipped, value }, cIdx) => (
              <div
                className="card"
                onClick={() =>
                  send({ type: "FLIP_CARD", payload: [rIdx, cIdx] })
                }
                key={rIdx + cIdx}
              >
                <div className={`card_inner ${flipped ? "is-flipped" : ""}`}>
                  <div className="card_face card_back">
                    <img src={images[value]} className="logo" />
                  </div>
                  <div className="card_face card_front"></div>
                </div>
              </div>
            ))}
          </div>
        );
      })}
      {state.value === "won" && (
        <section className="reset_button">
          <button onClick={() => send("PLAY_AGAIN")} className="button-22">
            play again
          </button>
        </section>
      )}
    </div>
  );
}

export default App;
