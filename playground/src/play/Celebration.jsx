import { useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { BADGES } from '../lib/playState.js';
import { useLang } from '../lib/langContext.js';
import './celebration.css';

const COLORS = ['#f59e0b', '#6366f1', '#10b981', '#ec4899', '#0ea5e9', '#f97316'];

// A short, dismissible cheer for a new badge or level. Confetti is decoration only:
// it is hidden from assistive tech and switched off for reduced-motion readers in CSS.
export default function Celebration({ item, onDone }) {
  const { t } = useLang();
  useEffect(() => {
    const timer = setTimeout(onDone, 5200);
    const close = (event) => {
      if (event.key === 'Escape') onDone();
    };
    window.addEventListener('keydown', close);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('keydown', close);
    };
  }, [onDone]);
  const pieces = useMemo(
    () =>
      Array.from({ length: 36 }, (_, index) => ({
        left: (index * 37 + 11) % 100,
        delay: (index % 9) * 0.07,
        duration: 1.9 + (index % 5) * 0.28,
        rotate: (index * 53) % 360,
        color: COLORS[index % COLORS.length],
        round: index % 3 === 0,
      })),
    [],
  );
  const badge = item.type === 'badge' ? BADGES.find((entry) => entry.id === item.id) : null;
  return (
    <div className="celebration">
      <div className="confetti" aria-hidden="true">
        {pieces.map((piece, index) => (
          <i
            key={index}
            className={piece.round ? 'round' : ''}
            style={{
              left: `${piece.left}%`,
              background: piece.color,
              animationDelay: `${piece.delay}s`,
              animationDuration: `${piece.duration}s`,
              '--spin': `${piece.rotate}deg`,
            }}
          />
        ))}
      </div>
      <div className="celebration-card" role="status">
        <span className="celebration-icon" aria-hidden="true">
          {badge ? badge.icon : '🚀'}
        </span>
        <div>
          <span className="card-overline">
            {item.type === 'badge' ? t('celebrate.badge') : t('celebrate.level')}
          </span>
          <strong>
            {item.type === 'badge'
              ? t(`badge.${item.id}.name`)
              : t('celebrate.levelBody', { level: item.level, title: t(`level.${item.level}`) })}
          </strong>
          {item.type === 'badge' && <p>{t(`badge.${item.id}.how`)}</p>}
          <Link className="text-button" to="/play" onClick={onDone}>
            {t('celebrate.view')}
          </Link>
        </div>
        <button className="icon-button" aria-label={t('celebrate.close')} onClick={onDone}>
          ×
        </button>
      </div>
    </div>
  );
}
