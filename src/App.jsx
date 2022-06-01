import { useMachine } from "@xstate/react";
import "./App.css";
import { gameMachine } from "./game/game";
import { inspect } from "@xstate/inspect";

inspect({
  iframe: false,
});
function App() {
  const [state, send] = useMachine(gameMachine, { devTools: true });
  const { board } = state.context;
  console.log(state);
  return (
    <div className="App">
      {board.map((row, rIdx) => {
        return (
          <div key={rIdx} className="row">
            {row.map((c, cIdx) => (
              <Card
                key={rIdx + cIdx}
                c={c}
                onClick={() => {
                  send({ type: "FLIP_CARD", payload: [rIdx, cIdx] });
                }}
              />
            ))}
          </div>
        );
      })}
      {state.value === "won" ? (
        <section className="reset_button">
          <button onClick={() => send("PLAY_AGAIN")}>play again</button>
        </section>
      ) : null}
    </div>
  );
}

function Card(props) {
  const { c, onClick } = props;
  return (
    <div className="card" onClick={onClick}>
      {/* {c.flipped && <img src={`src/logos/${c.value}.svg`} className="logo" />} */}
      <div className={`card_inner ${c.flipped ? "is-flipped" : ""}`}>
        <div className="card_face card_back">
          <img src={`src/logos/${c.value}.svg`} className="logo" />
        </div>
        <div className="card_face card_front"></div>
      </div>
    </div>
  );
}
export default App;
