import { RegisterDto } from '@/modules/routes/auth/dtos'
import { UsersService } from '@/modules/routes/users/users.service'
import { Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcrypt'

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findByEmail(email)
    if (user && (await bcrypt.compare(password, user.password))) {
      const { password: _password, ...result } = user.toObject()
      return result
    }
    return null
  }

  async login(user: any) {
    const payload = {
      email: user.email,
      username: user.username,
      sub: user._id
    }
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
        fullName: user.fullName,
        avatar: user.avatar
      }
    }
  }

  async register(registerDto: RegisterDto) {
    // Check if email already exists
    const existingUserEmail = await this.usersService.findByEmail(registerDto.email)
    if (existingUserEmail) {
      throw new UnauthorizedException('Email đã được sử dụng')
    }

    // Check if username already exists
    const existingUserUsername = await this.usersService.findByUsername(
      registerDto.username
    )
    if (existingUserUsername) {
      throw new UnauthorizedException('Username đã được sử dụng')
    }

    // Hash password
    const salt = await bcrypt.genSalt()
    const hashedPassword = await bcrypt.hash(registerDto.password, salt)

    // Create new user
    const newUser = await this.usersService.create({
      ...registerDto,
      password: hashedPassword
    })

    // Return JWT token
    const payload = {
      email: newUser.email,
      username: newUser.username,
      sub: newUser._id
    }

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: newUser._id,
        email: newUser.email,
        username: newUser.username
      }
    }
  }
}
