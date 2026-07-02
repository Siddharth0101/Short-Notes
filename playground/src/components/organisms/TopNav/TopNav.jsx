import Breadcrumb from '../../molecules/Breadcrumb/Breadcrumb.jsx';
import './TopNav.css';

export default function TopNav({ paths }) {
  return (
    <nav className="top-nav">
      <Breadcrumb paths={paths} />
    </nav>
  );
}
