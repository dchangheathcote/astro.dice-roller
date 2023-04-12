import DiceFace from "./DiceFace";
import { For, Suspense } from "solid-js";

export default function RollResults(props) {
  const { data, up } = props;
  return (
    <Suspense fallback={<div>Rolling... Suspense</div>}>
      <Show when={!data.error} fallback={<div>{data.error.message}</div>}>
        <div className='rolls-results-container'>
          <For each={data()?.rolls}>
            {(roll) => (
              <div className='rolls-results'>
                <div className='rolls-dice'>
                  <p className='rolls-title'>
                    {roll.previous_roll && "Reroll "}Results
                  </p>
                  <div className='rolls flex flex-wrap'>
                    {roll.roll.map((r) => (
                      <DiceFace up={up} num={r} />
                    ))}
                  </div>
                </div>
                <div className='roll-groups flex'>
                  {roll.roll_meta.roll_groups.hasOwnProperty(1) &&
                    !roll?.previous_roll && (
                      <button onClick={() => props.handleRerollFetch(1)}>
                        ReRoll 1s!
                      </button>
                    )}
                  {Object.keys(roll.roll_meta.roll_groups).map((key) => (
                    <>
                      <div
                        className={`${+key >= up() ? "up " : ""}group-value`}
                      >
                        {key}s : {roll.roll_meta.roll_groups[key]}
                      </div>
                    </>
                  ))}
                </div>
                <div className='roll-min'>
                  <div>
                    <button>
                      Roll {roll.roll_meta.min.gt} {roll.roll_meta.min_value}Ups
                    </button>
                  </div>
                  <div>lesser: {roll.roll_meta.min.lt}</div>
                </div>
                <Show when={roll.previous_roll}>
                  <div className='rolls-dice'>
                    <p className='rolls-title'>Original Roll</p>
                    <div className='rolls flex flex-wrap'>
                      <For each={roll.previous_roll}>
                        {(p) => <DiceFace up={up} num={p} />}
                      </For>
                    </div>
                  </div>
                </Show>
              </div>
            )}
          </For>
        </div>
      </Show>
    </Suspense>
  );
}
