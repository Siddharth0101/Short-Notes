import './Spinner.css';

export default function Spinner({ label = 'Loading...' }) {
  return (
    <div className="spinner-container">
      <div className="spinner-ring" />
      {label && <span>{label}</span>}
    </div>
  );
}
