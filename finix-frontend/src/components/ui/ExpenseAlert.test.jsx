import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ExpenseAlert from './ExpenseAlert';

describe('ExpenseAlert Component - Unit Tests (TDD)', () => {
  // Mock del modelo de datos real para límites/presupuestos de la base de datos
  const mockOverdraftLimit = {
    id: 'limite_comida_123',
    uid: 'user_test_999',
    category: 'Comida',
    limit: 500,
    spent: 650, // Sobregiro de $150 (130% del límite)
    color: 'bg-red-500',
    glow: 'text-red-500'
  };

  const mockWarningLimit = {
    id: 'limite_transporte_456',
    uid: 'user_test_999',
    category: 'Transporte',
    limit: 1000,
    spent: 900, // Cerca del límite (90% del límite, sin sobregiro)
    color: 'bg-yellow-500',
    glow: 'text-yellow-500'
  };

  it('debe renderizar el título de alerta de sobregiro y la categoría correspondiente', () => {
    render(<ExpenseAlert limitData={mockOverdraftLimit} />);
    
    // Debe mostrar que el presupuesto fue excedido
    expect(screen.getByText(/Presupuesto Excedido/i)).toBeInTheDocument();
    expect(screen.getByText('Comida')).toBeInTheDocument();
  });

  it('debe calcular y mostrar el monto correcto del sobregiro y los totales correspondientes', () => {
    render(<ExpenseAlert limitData={mockOverdraftLimit} />);

    // El sobregiro calculado es $650 - $500 = $150
    expect(screen.getByText(/\$150/)).toBeInTheDocument();
    
    // Debe mostrar el límite configurado ($500) y lo gastado ($650)
    expect(screen.getByText(/\$500/)).toBeInTheDocument();
    expect(screen.getByText(/\$650/)).toBeInTheDocument();
  });

  it('debe mostrar una advertencia preventiva si se superó el 85% pero no el 100% del límite', () => {
    render(<ExpenseAlert limitData={mockWarningLimit} />);

    // Alerta de advertencia
    expect(screen.getByText(/Límite Cercano/i)).toBeInTheDocument();
    expect(screen.getByText('Transporte')).toBeInTheDocument();
    
    // No debe decir que está excedido
    expect(screen.queryByText(/Presupuesto Excedido/i)).not.toBeInTheDocument();
  });

  it('debe llamar a la función onDismiss cuando se hace clic en el botón de cerrar', () => {
    const handleDismiss = vi.fn();
    render(<ExpenseAlert limitData={mockOverdraftLimit} onDismiss={handleDismiss} />);

    const closeButton = screen.getByRole('button', { name: /cerrar/i || /dismiss/i || /x/i });
    fireEvent.click(closeButton);

    expect(handleDismiss).toHaveBeenCalledTimes(1);
  });
});
