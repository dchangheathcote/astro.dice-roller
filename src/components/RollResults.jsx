import DiceFace from "./DiceFace";
import { For, Suspense } from "solid-js";

function RollsGroupButton({ className, key, keyValue }) {
  return (
    <button className={className}>
      {keyValue} <span>{key}s</span>
    </button>
  );
}
function RollsGroup() {}
function RollsDice({ title, roll, up }) {
  return (
    <div className='rolls-dice'>
      <p className='rolls-title'>{title}</p>
      <div className='rolls flex flex-wrap justify-center'>
        <For each={roll}>{(p) => <DiceFace up={up} num={p} />}</For>
      </div>
    </div>
  );
}

export default function RollResults(props) {
  const { data, up } = props;
  return (
    <Suspense fallback={<div>Rolling... Suspense</div>}>
      <Show when={!data.error} fallback={<div>{data.error.message}</div>}>
        <div className='rolls-results-container'>
          <For each={data()?.rolls}>
            {(roll) => (
              <div className='rolls-results'>
                <RollsDice
                  title={roll.previous_roll ? "Reroll Results" : "Results"}
                  roll={roll.roll}
                  up={up}
                />
                <div className='button-group roll-groups flex'>
                  {roll.roll_meta.roll_groups.hasOwnProperty(1) &&
                    !roll?.previous_roll && (
                      <button onClick={() => props.handleRerollFetch(1)}>
                        ReRoll 1s!
                      </button>
                    )}
                  {Object.keys(roll.roll_meta.roll_groups).map((key) => (
                    <RollsGroupButton
                      className={`group-value${+key >= up() ? " active" : ""}`}
                      key={key}
                      keyValue={roll.roll_meta.roll_groups[key]}
                    />
                  ))}
                  <button
                    onClick={() => {
                      console.log(props.nextAmount());
                    }}
                  >
                    Roll {roll.roll_meta.min.gt} {roll.roll_meta.min_value}Ups
                  </button>
                </div>
                <Show when={roll.previous_roll}>
                  <RollsDice
                    title={`Original Roll`}
                    roll={roll.previous_roll}
                    up={up}
                  />
                </Show>
              </div>
            )}
          </For>
        </div>
      </Show>
    </Suspense>
  );
}
