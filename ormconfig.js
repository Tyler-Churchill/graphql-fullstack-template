module.exports = {
  name: process.env.TYPEORM_CONNECTION_NAME,
  type: process.env.TYPEORM_TYPE,
  host: process.env.TYPEORM_HOST,
  port: process.env.TYPEORM_PORT,
  username: process.env.TYPEORM_USERNAME,
  password: process.env.TYPEORM_PASSWORD,
  database: process.env.TYPEORM_DATABASE,
  synchronize: process.env.TYPEORM_SYNCHRONIZE,
  logging: process.env.TYPEORM_LOGGING,
  entities: [__dirname + '/packages/common/src/**/**/*.ts'],
  migrations: ['./migrations/**/*{.js,.ts}'],
  cli: {
    migrationsDir: './migrations'
  }
};
