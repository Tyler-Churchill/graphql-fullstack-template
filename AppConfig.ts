export const AppConfig = {
  // ---- DATABASE SETTINGS ----
  TYPEORM_CONNECTION_NAME: process.env.TYPEORM_CONNECTION_NAME,
  TYPEORM_TYPE: process.env.TYPEORM_TYPE,
  TYPEORM_HOST: process.env.TYPEORM_HOST,
  TYPEORM_PORT: process.env.TYPEORM_PORT,
  TYPEORM_USERNAME: process.env.TYPEORM_USERNAME,
  TYPEORM_PASSWORD: process.env.TYPEORM_PASSWORD,
  TYPEORM_DATABASE: process.env.TYPEORM_DATABASE,
  TYPEORM_SYNCHRONIZE: process.env.TYPEORM_SYNCHRONIZE,
  TYPEORM_LOGGING: process.env.TYPEORM_LOGGING
};
