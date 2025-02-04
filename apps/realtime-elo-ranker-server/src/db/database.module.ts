import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { PlayersModule } from '../players/players.module';

@Module({
  imports: [
    SequelizeModule.forRoot({
      dialect: 'sqlite',
      storage: 'database.sqlite3',
      autoLoadModels: true,
      synchronize: true
    }),
    PlayersModule,
  ],
  exports: [
    SequelizeModule
  ]
})
export class DatabaseModule {}
