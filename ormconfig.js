module.exports = [
  {
    name: 'default',
    type: 'postgres',
    host: '127.0.0.1',
    port: 5432,
    username: 'postgres',
    password: 'postgres',
    database: 'development',
    synchronize: false,
    logging: true,
    entities: [__dirname + '/packages/common/src/**/**/*.ts'],
    migrations: ['./migrations/**/*{.js,.ts}'],
    cli: {
      migrationsDir: './migrations'
    }
  },
  {
    name: 'test',
    type: 'postgres',
    host: '127.0.0.1',
    port: 5432,
    username: 'postgres',
    password: 'postgres',
    database: 'development-test',
    dropSchema: true,
    synchronize: true,
    logging: false,
    entities: [__dirname + '/packages/common/src/**/**/*.ts'],
    migrations: ['./migrations/**/*{.js,.ts}'],
    cli: {
      migrationsDir: './migrations'
    }
  },
  {
    name: 'production',
    type: 'postgres',
    host: '000.000.000.000',
    port: 5432,
    username: 'postgres',
    password: 'superscret-storesomewhereelseplz',
    database: 'live',
    synchronize: false,
    logging: true,
    entities: ['src/common/**/**/*.ts'],
    migrations: ['migrations/**/*.ts'],
    cli: {
      entitiesDir: 'src/common',
      migrationsDir: 'migrations'
    }
  }
];
