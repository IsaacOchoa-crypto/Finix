import { test, expect } from '@playwright/test';

test.describe('Flujo de Autenticación', () => {
  test('El usuario puede iniciar sesión y ser redirigido al dashboard', async ({ page }) => {
    // 1. Navegar a la página de login
    await page.goto('/login');

    // 2. Verificar que estamos en la página de login
    await expect(page).toHaveTitle(/Finix/i); // Ajustar según el título real
    // Buscar los campos de email y password. Asumimos selectores estándar.
    // Si los selectores exactos no se conocen, usamos placeholder o name
    
    // Rellenar credenciales (simuladas)
    await page.fill('input[type="email"], input[name="email"], [placeholder*="correo" i]', 'test@finix.com');
    await page.fill('input[type="password"], input[name="password"], [placeholder*="contraseña" i]', 'password123');

    // 3. Enviar el formulario
    // Interceptar la petición de red para simular la respuesta del backend
    await page.route('**/api/auth/login', async route => {
      const json = { token: 'fake-jwt-token', user: { id: 1, name: 'Test User' } };
      await route.fulfill({ json, status: 200 });
    });

    await page.click('button[type="submit"], button:has-text("Iniciar Sesión"), button:has-text("Login")');

    // 4. Verificar la redirección exitosa al dashboard
    // Esperamos a que la URL cambie a /dashboard
    await page.waitForURL('**/dashboard', { timeout: 5000 });
    
    // Verificamos que se renderice algo del dashboard
    await expect(page.url()).toContain('/dashboard');
  });
});
