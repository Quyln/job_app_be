import { DataSource, DataSourceOptions } from 'typeorm';

function getConfig(): DataSourceOptions {
  return {
    type: 'postgres',
    host: 'localhost',
    port: 5440,
    username: 'postgres',
    password: '123456789',
    database: 'db_job_be',
    entities: ['dist/**/*.entity.{ts,js}'],
    migrations: ['dist/db/migrations/*.js'],
    synchronize: true,
  };
}

export const dataSourceOptions: DataSourceOptions = getConfig();

const dataSource = new DataSource(dataSourceOptions);

export default dataSource;
