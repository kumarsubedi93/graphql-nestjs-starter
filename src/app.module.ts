import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ConfigModule } from '@nestjs/config'
import { GraphQLModule } from '@nestjs/graphql'
import { SequelizeModule } from '@nestjs/sequelize'
import { join } from 'path'
import { Blog } from './blogs/entities/blog.model';
import { BlogModule } from './blogs/blog.module';
const { development } = require('../config/config')
const { dialect, ...DB_Config } = development

@Module({
  imports: [
    ConfigModule.forRoot(),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver:ApolloDriver,
      playground:true,
      installSubscriptionHandlers:true,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
    }),
    SequelizeModule.forRoot({
      dialect: 'mysql',
      ...DB_Config,
      models: [Blog]
    }),
    BlogModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
