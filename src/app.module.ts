import authConfig from '@/config/auth.config'
import databaseConfig from '@/config/database.config'
import { JwtAuthGuard } from '@/modules/routes/auth/guards/jwt-auth.guard'

import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { APP_GUARD } from '@nestjs/core'
import { MongooseModule } from '@nestjs/mongoose'
import { AuthModule } from './modules/routes/auth/auth.module'
import { CommentsModule } from './modules/routes/comments/comments.module'
import { GroupsModule } from './modules/routes/groups/groups.module'
import { PostsModule } from './modules/routes/posts/posts.module'
import { UsersModule } from './modules/routes/users/users.module'

const routesModules = [
  AuthModule,
  UsersModule,
  GroupsModule,
  PostsModule,
  CommentsModule
]
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig, authConfig]
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('database.uri')
      }),
      inject: [ConfigService]
    }),
    ...routesModules
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard
    }
  ]
})
export class AppModule {}
