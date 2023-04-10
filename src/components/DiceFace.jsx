export default function DiceFace({ num, up }) {
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
}
