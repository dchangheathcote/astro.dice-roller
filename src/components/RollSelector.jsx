export default function RollSelector(props) {
  const {
    amountDefault,
    amount,
    setAmount,
    sidesDefault,
    sides,
    setSides,
    minUp,
    up,
    setUp,
  } = props;
  return (
    <div>
      <div>
        Roll <div className='inline'>{amount()}</div>D
        <div className='inline'>{sides()}</div> with a{" "}
        <div className='inline'>{up()}</div> up
      </div>
    </div>
  );
}
