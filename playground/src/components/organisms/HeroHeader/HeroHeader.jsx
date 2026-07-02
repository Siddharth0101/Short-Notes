import './HeroHeader.css';

export default function HeroHeader({ title, subtitle }) {
  return (
    <header className="hero-header">
      <h1 className="hero-header__title">{title}</h1>
      {subtitle && <p className="hero-header__subtitle">{subtitle}</p>}
    </header>
  );
}
