import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
// Mock react-pdf to avoid DOM/canvas issues in the Node test environment
vi.mock('react-pdf', () => ({
  Document: ({ children }) => <div>{children}</div>,
  Page: () => <div />,
  pdfjs: { GlobalWorkerOptions: {} },
}));

import RegisterPage from './RegisterPage';

const { mockNavigate, mockPost } = vi.hoisted(() => ({
  mockNavigate: vi.fn(),
  mockPost: vi.fn(),
}));

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock('../api/axios', () => ({
  default: {
    post: mockPost,
  },
}));

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

vi.mock('../components/layout/AuthSplitLayout', () => ({
  default: ({ children }) => <div>{children}</div>,
}));

describe('RegisterPage', () => {
  beforeEach(() => {
    mockNavigate.mockReset();
    mockPost.mockReset();
  });

  it('debe habilitar el botón de registro solo cuando ambos documentos sean aceptados', () => {
    render(<RegisterPage />);

    const submitButton = screen.getByRole('button', { name: /registrarme gratis/i });
    expect(submitButton).toBeDisabled();

    fireEvent.click(screen.getByRole('checkbox', { name: /acepto la protección de datos personales/i }));
    expect(submitButton).toBeDisabled();

    fireEvent.click(screen.getByRole('checkbox', { name: /acepto la política de privacidad/i }));
    expect(submitButton).toBeEnabled();
  });
});
