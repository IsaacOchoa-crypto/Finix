import { describe, it, expect } from 'vitest';
import { calculateBalance, isValidAmount } from './financial';

describe('Funciones Financieras (Caja Blanca)', () => {
  
  describe('calculateBalance', () => {
    it('debe calcular el balance correctamente con ingresos y gastos', () => {
      const incomes = [{ amount: 1000 }, { amount: 500 }];
      const expenses = [{ amount: 200 }, { amount: 300 }];
      const result = calculateBalance(incomes, expenses);
      expect(result).toBe(1000); // 1500 - 500 = 1000
    });

    it('debe devolver 0 si no hay ingresos ni gastos', () => {
      const result = calculateBalance([], []);
      expect(result).toBe(0);
    });

    it('debe manejar montos faltantes como 0', () => {
      const incomes = [{ amount: 1000 }, {}]; // un ingreso sin amount
      const expenses = [{ amount: 200 }];
      const result = calculateBalance(incomes, expenses);
      expect(result).toBe(800); // 1000 - 200 = 800
    });
  });

  describe('isValidAmount', () => {
    it('debe retornar true para números positivos', () => {
      expect(isValidAmount(100)).toBe(true);
      expect(isValidAmount(0)).toBe(true);
    });

    it('debe retornar false para números negativos', () => {
      expect(isValidAmount(-50)).toBe(false);
    });

    it('debe retornar false para valores no numéricos', () => {
      expect(isValidAmount('100')).toBe(false);
      expect(isValidAmount(null)).toBe(false);
      expect(isValidAmount(undefined)).toBe(false);
      expect(isValidAmount(NaN)).toBe(false);
    });
  });
});
