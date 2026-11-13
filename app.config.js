// Lê o app.json e permite publicar a versão web em uma subpasta (ex.: servir o App em /app):
//   EXPO_BASE_URL=/app npx expo export --platform web
module.exports = ({ config }) => ({
  ...config,
  experiments: {
    ...(config.experiments || {}),
    baseUrl: process.env.EXPO_BASE_URL || undefined,
  },
});
