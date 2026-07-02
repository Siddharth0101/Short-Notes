import { Link } from 'react-router-dom';
import './LinkButton.css';

export default function LinkButton({ to, variant = 'primary', children }) {
  return (
    <Link to={to} className={`link-btn link-btn--${variant}`}>
      {children}
    </Link>
  );
}
