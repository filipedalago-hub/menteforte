import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Breadcrumbs } from '../Breadcrumbs';

describe('Breadcrumbs', () => {
  it('renders all breadcrumb items', () => {
    const items = [
      { label: 'Home', path: '/' },
      { label: 'Trilha', path: '/trilha' },
      { label: 'Pilar' },
    ];

    render(
      <BrowserRouter>
        <Breadcrumbs items={items} />
      </BrowserRouter>
    );

    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Trilha')).toBeInTheDocument();
    expect(screen.getByText('Pilar')).toBeInTheDocument();
  });

  it('renders links for items with paths', () => {
    const items = [
      { label: 'Home', path: '/' },
      { label: 'Current' },
    ];

    render(
      <BrowserRouter>
        <Breadcrumbs items={items} />
      </BrowserRouter>
    );

    const homeLink = screen.getByText('Home');
    expect(homeLink.tagName).toBe('A');
  });
});
