import type { ReactNode } from 'react';
import './Header.scss';

interface HeaderProps {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
}

export function Header({ title, subtitle, actions }: HeaderProps) {
  return (
    <header className="header">
      <div className="header__info">
        <h1 className="header__title">{title}</h1>
        {subtitle && <p className="header__subtitle">{subtitle}</p>}
      </div>
      {actions && <div className="header__actions">{actions}</div>}
    </header>
  );
}
