import {
  createResource,
  createSignal,
  createEffect,
  For,
  Suspense,
} from "solid-js";
import NumberSelector from "./NumberSelector";

const fetchRoll = async (options) => {
  const { rolls, amount, sides, up } = options;

  const endpoint = `?amount=${amount()}&sides=${sides()}&rolls=${rolls()}&sort_min=${up()}`;
  const url = `https://wp.darrylch.com/wp-json/dch-json/v1/dice_roller${endpoint}`;
  //console.log(url);
  const result = await fetch(url);
  if (!result.ok) {
    throw new Error("Error: " + result.status);
  }
  const data = await result.json();
  return data;
};

const DiceFace = ({ num, up }) => {
  const rollClass = num >= up() ? " gt" : "";
  return (
    <div className={`roll-value${rollClass}`} data-roll-value={num}>
      <div class='column'>
        <span class='pip'></span>
        <span class='pip'></span>
        <span class='pip'></span>
      </div>
      <div class='column'>
        <span class='pip'></span>
      </div>
      <div class='column'>
        <span class='pip'></span>
        <span class='pip'></span>
        <span class='pip'></span>
      </div>
    </div>
  );
};

export default function DiceRoller() {
  const rolesDefault = 1,
    amountDefault = 1,
    sidesDefault = 6,
    minUp = 4;
  const [rolls, setRolls] = createSignal(rolesDefault);
  const [amount, setAmount] = createSignal(amountDefault);
  const [sides, setSides] = createSignal(sidesDefault);
  const [up, setUp] = createSignal(minUp);

  const [trigger, setTrigger] = createSignal(false);
  const [data] = createResource(trigger, fetchRoll);

  const [prevRoll, setPrevRoll] = createSignal(false);

  const handleFetch = () => {
    setTrigger({
      rolls: rolls,
      amount: amount,
      sides: sides,
      up: up,
    });
    setPrevRoll(false);
  };

  createEffect(() => {
    if (data()) {
      if (data.state === "ready") {
        setTrigger(false);
      }
      if (data.loading) {
        setPrevRoll(false);
      }
      setPrevRoll(data().rolls[0].roll.toString());
      console.log(prevRoll());
    }
  }, data());
  return (
    <div id='dice-roller'>
      <div className='flex'>
        <NumberSelector
          title='# of Rolls'
          defaultNumber={rolesDefault}
          number={rolls}
          setNumber={setRolls}
          min={1}
        />
        <NumberSelector
          title='# of Dice'
          defaultNumber={amountDefault}
          number={amount}
          setNumber={setAmount}
          min={1}
        />
        <NumberSelector
          title='Dice Sides'
          defaultNumber={sidesDefault}
          number={sides}
          setNumber={setSides}
          min={sidesDefault}
        />
        <NumberSelector
          title='Number Up'
          defaultNumber={minUp}
          number={up}
          setNumber={setUp}
          min={1}
          max={sides}
        />
      </div>
      <div className='flex py-4'>
        <button onClick={handleFetch}>Roll It!</button>
      </div>

      <Suspense fallback={<div>Loading... Suspense</div>}>
        <Show when={!data.error} fallback={<div>{data.error.message}</div>}>
          <div className='rolls-results-container'>
            <For each={data()?.rolls}>
              {(roll, i) => (
                <div className='rolls-results'>
                  <div className='rolls flex flex-wrap'>
                    {roll.roll.map((r) => (
                      <DiceFace up={up} num={r} />
                    ))}
                  </div>
                  <div className='roll-groups flex'>
                    {Object.keys(roll.roll_meta.roll_groups).map(
                      (key, index) => (
                        <div className='group-value'>
                          {key}s : {roll.roll_meta.roll_groups[key]}
                        </div>
                      )
                    )}
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
    </div>
  );
}
