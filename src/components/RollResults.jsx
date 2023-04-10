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
                <div>
                  <Show when={roll.previous_roll} fallback={<p>Results</p>}>
                    <p>Reroll</p>
                  </Show>
                  <div className='rolls flex flex-wrap'>
                    {roll.roll.map((r) => (
                      <DiceFace up={up} num={r} />
                    ))}
                  </div>
                </div>
                <Show when={roll.previous_roll}>
                  <div>
                    <p>Previous Roll</p>
                    <div className='rolls flex flex-wrap'>
                      {roll.previous_roll.map((p) => (
                        <DiceFace up={up} num={p} />
                      ))}
                    </div>
                  </div>
                </Show>
                <div className='roll-groups flex'>
                  {Object.keys(roll.roll_meta.roll_groups).map((key, index) => (
                    <div className='group-value'>
                      {key}s : {roll.roll_meta.roll_groups[key]}
                    </div>
                  ))}
                </div>
                <div className='roll-min'>
                  <div>
                    {roll.roll_meta.min_value} up: {roll.roll_meta.min.gt}
                  </div>
                  <div>lesser: {roll.roll_meta.min.lt}</div>
                </div>
              </div>
            )}
          </For>
        </div>
      </Show>
    </Suspense>
  );
}
