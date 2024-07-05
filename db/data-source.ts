import { DataSource, DataSourceOptions } from 'typeorm';

function getConfig(): DataSourceOptions {
  return {
    type: 'postgres',
    host: '127.0.0.1',
    port: 5432,
    username: 'postgres',
    password: '837829318',
    database: 'postgres',
    entities: ['dist/**/*.entity.{ts,js}'],
    migrations: ['dist/db/migrations/*.js'],
    synchronize: false,
  };
}

export const dataSourceOptions: DataSourceOptions = getConfig();

const dataSource = new DataSource(dataSourceOptions);

export default dataSource;
