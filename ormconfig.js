const rootDir = process.env.NODE_ENV === 'development' ? 'src' : 'build'
module.exports = {
  host: process.env.DB_HOST || 'localhost',
  type: 'postgres',
  port: +process.env.DB_PORT || 5432,
  username: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_NAME || 'auth',
  synchronize: true,
  logging: false,
  entities: [rootDir + '/entity/**/*.{js,ts}'],
  migrations: [rootDir + '/migration/**/*.{js,ts}'],
  subscribers: [rootDir + '/subscriber/**/*.{js,ts}'],
  cli: {
    entitiesDir: 'src/entity',
    migrationsDir: 'src/migration',
    subscribersDir: 'src/subscriber',
  },
}
