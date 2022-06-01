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
    </div>
  );
}

function Card(props) {
  const { c, onClick } = props;
  return (
    <div className="card" onClick={onClick}>
      {c.flipped ? (
        <img src={`src/logos/${c.value}.svg`} className="logo" />
      ) : (
        "card"
      )}
    </div>
  );
}
export default App;
