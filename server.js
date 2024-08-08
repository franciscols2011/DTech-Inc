const express = require('express');
const path = require('path');
const { createProxyMiddleware } = require('http-proxy-middleware');
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware para analizar cuerpos de solicitud JSON
app.use(express.json());

if (process.env.NODE_ENV === 'production') {
  // Servir archivos estáticos desde el directorio build
  app.use(express.static(path.join(__dirname, 'build')));

  // Servir la aplicación React para todas las demás rutas
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
  });
} else {
  // En desarrollo, proxy las solicitudes API al backend
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://localhost:5000',
      changeOrigin: true,
    })
  );
  app.use(
    '/dist', // Asegúrate de que esta ruta sirva correctamente los archivos estáticos desde Snowpack
    createProxyMiddleware({
      target: 'http://localhost:3000',
      changeOrigin: true,
    })
  );
}

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
