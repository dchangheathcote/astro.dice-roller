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
    console.log("down");
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
            <svg
              xmlns='http://www.w3.org/2000/svg'
              width='16'
              height='16'
              fill='currentColor'
              class='bi bi-plus'
              viewBox='0 0 16 16'
            >
              <path d='M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z' />
            </svg>
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
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  width='16'
                  height='16'
                  fill='currentColor'
                  class='bi bi-x'
                  viewBox='0 0 16 16'
                >
                  <path d='M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z' />
                </svg>
              </button>
            )}
          </div>
          <button
            className='nb-btn flex nb-move rounded-b-md'
            data-number-button='down'
            // onClick={() => decreaseNum()}
            onMouseDown={() => onMouseDown(decreaseNum)}
            onMouseUp={() => onMouseUp()}
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              width='16'
              height='16'
              fill='currentColor'
              class='bi bi-dash'
              viewBox='0 0 16 16'
            >
              <path d='M4 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 4 8z' />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
