import { createResource, createSignal, createEffect } from "solid-js";
import NumberSelector from "./NumberSelector";
import RollResults from "./RollResults";
import RollSelector from "./RollSelector";

const fetchRoll = async (options) => {
  const { rolls, amount, sides, up, prevRoll, reroll = false } = options;
  let endpoint = "";
  //do some validation
  if (reroll) {
    endpoint = `?reroll=${reroll}&prev=${prevRoll()}&sort_min=${up()}`;
  } else {
    endpoint = `?amount=${amount()}&sides=${sides()}&rolls=${rolls()}&sort_min=${up()}`;
  }
  const url = `https://wp.darrylch.com/wp-json/dch-json/v1/dice_roller${endpoint}`;
  const result = await fetch(url);
  if (!result.ok) {
    throw new Error("Error: " + result.status);
  }
  const data = await result.json();
  return data;
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

  const handleRerollFetch = (r) => {
    setTrigger({
      reroll: r,
      prevRoll: prevRoll,
      up: up,
    });
  };

  createEffect(() => {
    if (data()) {
      if (data.state === "ready") {
        setTrigger(false);
      }
      if (data.loading) {
        setPrevRoll(false);
      }
      setPrevRoll(data()?.rolls[0]?.roll.toString());
    }
  }, data());

  return (
    <div id='dice-roller'>
      <RollSelector
        amountDefault={amountDefault}
        amount={amount}
        setAmount={setAmount}
        sidesDefault={sidesDefault}
        sides={sides}
        setSides={setSides}
        minUp={minUp}
        up={up}
        setUp={setUp}
      />
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
        <button onClick={() => handleRerollFetch(1)}>ReRoll 1s!</button>
      </div>
      <RollResults data={data} up={up} />
    </div>
  );
}
