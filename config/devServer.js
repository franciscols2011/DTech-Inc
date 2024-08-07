module.exports = function (webpackEnv) {
    const isEnvDevelopment = webpackEnv === 'development';
    const isEnvProduction = webpackEnv === 'production';
  
    return {
      // Otras configuraciones...
      devServer: {
        allowedHosts: ['.localhost'], // Permitir todas las conexiones de localhost
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "*",
          "Access-Control-Allow-Headers": "*",
        },
        compress: true, // Habilita la compresión gzip
        historyApiFallback: true, // Permite la navegación de una sola página (SPA)
        hot: true, // Habilita el Hot Module Replacement (HMR)
        port: 3000, // Puerto de escucha del servidor de desarrollo
        open: true, // Abre el navegador automáticamente
        static: {
          directory: path.join(__dirname, 'public'), // Carpeta estática a servir
          publicPath: '/', // URL base para los recursos estáticos
          watch: true, // Habilita la observación de cambios en la carpeta estática
        },
        client: {
          logging: 'none', // Desactiva el logging en la consola del navegador
          overlay: {
            errors: true, // Muestra los errores en un overlay en el navegador
            warnings: false, // No muestra las advertencias en un overlay
          },
          progress: true, // Muestra el progreso de la compilación en la consola
        },
        watchFiles: ['src/**/*', 'public/**/*'], // Archivos a observar para recargar
        liveReload: true, // Habilita la recarga automática del navegador
      },
      // Otras configuraciones...
    };
  };
  