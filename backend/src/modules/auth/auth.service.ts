import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { DrizzleService } from '../../db/drizzle.service';
import { users } from '../../db/schema';
import { AuthSessionDto, LoginDto } from './dto/login.dto';
import { UserDto } from '../users/dto/user.dto';

@Injectable()
export class AuthService {
  constructor(private readonly drizzle: DrizzleService) {}

  async login(dto: LoginDto): Promise<AuthSessionDto> {
    const [user] = await this.drizzle.db
      .select()
      .from(users)
      .where(eq(users.email, dto.email))
      .limit(1);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return {
      accessToken: `dev-token-${user.id}`,
      user: user as UserDto,
    };
  }

  async getProfile(userId: number) {
    const [user] = await this.drizzle.db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (!user) {
      throw new NotFoundException(`User #${userId} not found`);
    }

    return user;
  }
}
