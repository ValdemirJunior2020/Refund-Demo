export default function ProgressBar({ current }) {
  const steps = ["Requested", "Approved", "Processed", "Paid"];
  const idx = steps.indexOf(current);

  return (
    <div style={{margin:"12px 0"}}>
      <div style={{
        display:"flex",
        justifyContent:"space-between",
        fontSize:"12px",
        marginBottom:"4px"
      }}>
        {steps.map(s => (
          <span key={s}>{s}</span>
        ))}
      </div>
      <div style={{
        height:"10px",
        borderRadius:"5px",
        background:"#eee",
        overflow:"hidden"
      }}>
        <div style={{
          height:"100%",
          width:`${((idx+1)/steps.length)*100}%`,
          background:"#16a34a",
          transition:"width 0.6s"
        }} />
      </div>
    </div>
  );
}
