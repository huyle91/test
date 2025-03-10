import { AuthController } from '@/modules/routes/auth/auth.controller'
import { AuthService } from '@/modules/routes/auth/auth.service'
import { JwtStrategy } from '@/modules/routes/auth/strategies/jwt.strategy'
import { LocalStrategy } from '@/modules/routes/auth/strategies/local.strategy'
import { UsersModule } from '@/modules/routes/users/users.module'
import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('auth.jwtSecret'),
        signOptions: { expiresIn: configService.get<string>('auth.jwtExpiresIn') }
      }),
      inject: [ConfigService]
    })
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  exports: [AuthService]
})
export class AuthModule {}
