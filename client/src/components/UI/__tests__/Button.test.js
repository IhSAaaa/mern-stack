import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Button from '../Button';

// Test helper for cache testing
const createMockCache = () => {
  const cache = new Map();
  return {
    get: jest.fn((key) => cache.get(key)),
    set: jest.fn((key, value) => cache.set(key, value)),
    clear: jest.fn(() => cache.clear()),
    has: jest.fn((key) => cache.has(key)),
    delete: jest.fn((key) => cache.delete(key))
  };
};

// Test helper for API responses with cache headers
const createMockResponse = (data, headers = {}) => {
  return {
    ok: true,
    status: 200,
    json: jest.fn().mockResolvedValue(data),
    headers: {
      get: jest.fn((name) => headers[name] || null)
    }
  };
};

describe('Button Component', () => {
  const defaultProps = {
    children: 'Test Button',
    onClick: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Cache testing examples
  describe('Cache Testing Examples', () => {
    it('should handle cache headers properly in tests', () => {
      const mockCache = createMockCache();
      const mockResponse = createMockResponse(
        { data: 'test' },
        { 'Cache-Control': 'max-age=300', 'ETag': 'abc123' }
      );
      
      expect(mockCache.get).toBeDefined();
      expect(mockResponse.headers.get('Cache-Control')).toBe('max-age=300');
    });

    it('should skip cache headers when testing', () => {
      const mockResponse = createMockResponse(
        { data: 'test' },
        { 'Cache-Control': 'no-cache' }
      );
      
      expect(mockResponse.headers.get('Cache-Control')).toBe('no-cache');
    });
  });

  describe('Rendering', () => {
    it('renders button with correct text', () => {
      render(<Button {...defaultProps} />);
      expect(screen.getByRole('button', { name: 'Test Button' })).toBeInTheDocument();
    });

    it('renders with different variants', () => {
      const { rerender } = render(<Button {...defaultProps} variant="primary" />);
      expect(screen.getByRole('button')).toHaveClass('from-blue-600');

      rerender(<Button {...defaultProps} variant="secondary" />);
      expect(screen.getByRole('button')).toHaveClass('bg-gray-600');

      rerender(<Button {...defaultProps} variant="outline" />);
      expect(screen.getByRole('button')).toHaveClass('border-blue-600');

      rerender(<Button {...defaultProps} variant="ghost" />);
      expect(screen.getByRole('button')).toHaveClass('text-blue-600');

      rerender(<Button {...defaultProps} variant="danger" />);
      expect(screen.getByRole('button')).toHaveClass('from-red-600');

      rerender(<Button {...defaultProps} variant="success" />);
      expect(screen.getByRole('button')).toHaveClass('from-green-600');
    });

    it('renders with different sizes', () => {
      const { rerender } = render(<Button {...defaultProps} size="sm" />);
      expect(screen.getByRole('button')).toHaveClass('px-3');

      rerender(<Button {...defaultProps} size="md" />);
      expect(screen.getByRole('button')).toHaveClass('px-4');

      rerender(<Button {...defaultProps} size="lg" />);
      expect(screen.getByRole('button')).toHaveClass('px-6');

      rerender(<Button {...defaultProps} size="xl" />);
      expect(screen.getByRole('button')).toHaveClass('px-8');
    });

    it('renders with full width', () => {
      render(<Button {...defaultProps} fullWidth />);
      expect(screen.getByRole('button')).toHaveClass('w-full');
    });

    it('renders with custom className', () => {
      render(<Button {...defaultProps} className="custom-class" />);
      expect(screen.getByRole('button')).toHaveClass('custom-class');
    });
  });

  describe('Loading State', () => {
    it('shows loading spinner when loading is true', () => {
      render(<Button {...defaultProps} loading />);
      expect(screen.getByRole('button')).toBeDisabled();
      expect(screen.getByRole('button')).toHaveAttribute('aria-busy', 'true');
    });

    it('hides button text when loading', () => {
      render(<Button {...defaultProps} loading />);
      const buttonText = screen.getByText('Test Button');
      expect(buttonText).toHaveClass('sr-only');
    });

    it('shows loading screen reader text', () => {
      render(<Button {...defaultProps} loading />);
      expect(screen.getByText('Loading...')).toBeInTheDocument();
    });
  });

  describe('Disabled State', () => {
    it('disables button when disabled prop is true', () => {
      render(<Button {...defaultProps} disabled />);
      expect(screen.getByRole('button')).toBeDisabled();
    });

    it('disables button when loading is true', () => {
      render(<Button {...defaultProps} loading />);
      expect(screen.getByRole('button')).toBeDisabled();
    });

    it('has correct disabled styles', () => {
      render(<Button {...defaultProps} disabled />);
      expect(screen.getByRole('button')).toHaveClass('opacity-50', 'cursor-not-allowed');
    });
  });

  describe('Click Handling', () => {
    it('calls onClick when clicked', () => {
      render(<Button {...defaultProps} />);
      fireEvent.click(screen.getByRole('button'));
      expect(defaultProps.onClick).toHaveBeenCalledTimes(1);
    });

    it('does not call onClick when disabled', () => {
      render(<Button {...defaultProps} disabled />);
      fireEvent.click(screen.getByRole('button'));
      expect(defaultProps.onClick).not.toHaveBeenCalled();
    });

    it('does not call onClick when loading', () => {
      render(<Button {...defaultProps} loading />);
      fireEvent.click(screen.getByRole('button'));
      expect(defaultProps.onClick).not.toHaveBeenCalled();
    });
  });

  describe('Keyboard Navigation', () => {
    it('calls onClick on Enter key press', () => {
      render(<Button {...defaultProps} />);
      fireEvent.keyDown(screen.getByRole('button'), { key: 'Enter' });
      expect(defaultProps.onClick).toHaveBeenCalledTimes(1);
    });

    it('calls onClick on Space key press', () => {
      render(<Button {...defaultProps} />);
      fireEvent.keyDown(screen.getByRole('button'), { key: ' ' });
      expect(defaultProps.onClick).toHaveBeenCalledTimes(1);
    });

    it('prevents default on Enter key press', () => {
      render(<Button {...defaultProps} />);
      const event = { key: 'Enter', preventDefault: jest.fn() };
      fireEvent.keyDown(screen.getByRole('button'), event);
      expect(event.preventDefault).toHaveBeenCalled();
    });

    it('prevents default on Space key press', () => {
      render(<Button {...defaultProps} />);
      const event = { key: ' ', preventDefault: jest.fn() };
      fireEvent.keyDown(screen.getByRole('button'), event);
      expect(event.preventDefault).toHaveBeenCalled();
    });

    it('does not call onClick on other key presses', () => {
      render(<Button {...defaultProps} />);
      fireEvent.keyDown(screen.getByRole('button'), { key: 'Tab' });
      expect(defaultProps.onClick).not.toHaveBeenCalled();
    });

    it('calls custom onKeyDown handler', () => {
      const onKeyDown = jest.fn();
      render(<Button {...defaultProps} onKeyDown={onKeyDown} />);
      fireEvent.keyDown(screen.getByRole('button'), { key: 'Tab' });
      expect(onKeyDown).toHaveBeenCalledTimes(1);
    });
  });

  describe('Accessibility', () => {
    it('has correct role attribute', () => {
      render(<Button {...defaultProps} />);
      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('supports custom aria-label', () => {
      render(<Button {...defaultProps} aria-label="Custom Label" />);
      expect(screen.getByRole('button', { name: 'Custom Label' })).toBeInTheDocument();
    });

    it('supports aria-describedby', () => {
      render(<Button {...defaultProps} aria-describedby="description" />);
      expect(screen.getByRole('button')).toHaveAttribute('aria-describedby', 'description');
    });

    it('supports aria-expanded', () => {
      render(<Button {...defaultProps} aria-expanded="true" />);
      expect(screen.getByRole('button')).toHaveAttribute('aria-expanded', 'true');
    });

    it('supports aria-pressed', () => {
      render(<Button {...defaultProps} aria-pressed="true" />);
      expect(screen.getByRole('button')).toHaveAttribute('aria-pressed', 'true');
    });

    it('supports aria-haspopup', () => {
      render(<Button {...defaultProps} aria-haspopup="true" />);
      expect(screen.getByRole('button')).toHaveAttribute('aria-haspopup', 'true');
    });

    it('supports custom role', () => {
      render(<Button {...defaultProps} role="menuitem" />);
      expect(screen.getByRole('menuitem')).toBeInTheDocument();
    });

    it('has correct tabIndex when disabled', () => {
      render(<Button {...defaultProps} disabled />);
      expect(screen.getByRole('button')).toHaveAttribute('tabIndex', '-1');
    });

    it('has correct tabIndex when enabled', () => {
      render(<Button {...defaultProps} />);
      expect(screen.getByRole('button')).toHaveAttribute('tabIndex', '0');
    });

    it('supports custom tabIndex', () => {
      render(<Button {...defaultProps} tabIndex={1} />);
      expect(screen.getByRole('button')).toHaveAttribute('tabIndex', '1');
    });
  });

  describe('Button Types', () => {
    it('renders as button type by default', () => {
      render(<Button {...defaultProps} />);
      expect(screen.getByRole('button')).toHaveAttribute('type', 'button');
    });

    it('renders as submit type', () => {
      render(<Button {...defaultProps} type="submit" />);
      expect(screen.getByRole('button')).toHaveAttribute('type', 'submit');
    });

    it('renders as reset type', () => {
      render(<Button {...defaultProps} type="reset" />);
      expect(screen.getByRole('button')).toHaveAttribute('type', 'reset');
    });
  });

  describe('Focus Management', () => {
    it('has focus styles', () => {
      render(<Button {...defaultProps} />);
      expect(screen.getByRole('button')).toHaveClass('focus:outline-none', 'focus:ring-2');
    });

    it('has focus-visible styles', () => {
      render(<Button {...defaultProps} />);
      expect(screen.getByRole('button')).toHaveClass('focus-visible:ring-2');
    });
  });
}); 