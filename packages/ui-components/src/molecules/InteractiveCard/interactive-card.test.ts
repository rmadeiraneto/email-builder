import { describe, it, expect, vi } from 'vitest';
import { InteractiveCard } from './InteractiveCard';

describe('InteractiveCard', () => {
  it('should create an interactive card', () => {
    const card = new InteractiveCard({ content: 'Test Content' });
    expect(card.getEl()).toBeInstanceOf(HTMLElement);
  });

  it('should show overlay on hover', () => {
    const card = new InteractiveCard({ content: 'Test', interactionType: 'hover' });
    const el = card.getEl();
    el.dispatchEvent(new Event('mouseenter'));
    expect(el.className).toContain('active');
  });

  it('should execute action callback', () => {
    const callback = vi.fn();
    const card = new InteractiveCard({
      content: 'Test',
      actions: [{ icon: '⭐', label: 'Action', callback }],
    });
    const button = card.getEl().querySelector('button');
    button?.click();
    expect(callback).toHaveBeenCalled();
  });
});
