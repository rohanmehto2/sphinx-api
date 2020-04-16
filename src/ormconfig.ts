import { ConnectionOptions } from 'typeorm';
import { ConfigService } from './config/config.service';

const configService = new ConfigService(`${process.env.NODE_ENV}.env`);

const config: ConnectionOptions = {
  type: 'mysql',
  port: 3306,
  host: configService.get('DATABASE_HOST'),
  username: configService.get('DATABASE_USERNAME'),
  password: configService.get('DATABASE_PASSWORD'),
  database: configService.get('DATABASE'),
  entities: [__dirname + '/**/**/*.entity{.ts,.js}'],

  // We are using migrations, synchronize should be set to false.
  synchronize: true,

  // dropSchema:true,

  // Run migrations automatically,
  // you can disable this if you prefer running migration manually.
  // migrationsRun: true,
  logging: true,
  logger: 'file',

  // Allow both start:prod and start:dev to use migrations
  // __dirname is either dist or src folder, meaning either
  // the compiled js in prod or the ts in dev.
  migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
  cli: {
    // Location of migration should be inside src folder
    // to be compiled into dist/ folder.
    migrationsDir: 'src/migrations',
  },
};

export = config;
