import Close from "../assets/svg/close";
import Minus from "../assets/svg/minus";
import Plus from "../assets/svg/plus";

export default function NumberSelector(props) {
  const { title, min, max, defaultNumber, setNumber, number } = props;
  const increaseNum = () => {
    if (max && number() === max()) {
      return false;
    }
    setNumber(number() + 1);
  };
  const decreaseNum = () => {
    if (number() === min) return;
    setNumber(number() - 1);
  };
  const handleMouseWheel = (e) => {
    e.preventDefault();
    const delta = -Math.sign(e.deltaY);
    delta >= 0 ? increaseNum() : decreaseNum();
  };

  let downTimer;
  const onMouseDown = (func) => {
    func();
    downTimer = setInterval(() => {
      func();
    }, 250);
  };
  const onMouseUp = () => {
    clearInterval(downTimer);
  };
  return (
    <div className='basis-1/4'>
      <div className='number-selector-wrap'>
        <div>{title}</div>
        <div
          className='number-block rounded-md'
          onWheel={(e) => handleMouseWheel(e)}
        >
          <button
            className='nb-btn flex nb-move rounded-t-md'
            data-number-button='up'
            onMouseDown={() => onMouseDown(increaseNum)}
            onMouseUp={() => onMouseUp()}
          >
            <Plus />
          </button>
          <div className='relative nb-display' type='number' min='1'>
            <div class='inner'>
              {number()} {max && `/ ${max()}`}
            </div>
            {number() !== defaultNumber && (
              <button
                className='nb-btn absolute'
                data-number-button='reset'
                onClick={() => setNumber(defaultNumber)}
                title='reset'
              >
                <Close />
              </button>
            )}
          </div>
          <button
            className='nb-btn flex nb-move rounded-b-md'
            data-number-button='down'
            onMouseDown={() => onMouseDown(decreaseNum)}
            onMouseUp={() => onMouseUp()}
          >
            <Minus />
          </button>
        </div>
      </div>
    </div>
  );
}
