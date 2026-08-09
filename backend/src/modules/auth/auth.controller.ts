import {
  Body,
  Controller,
  Get,
  Headers,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { UserDto } from '../users/dto/user.dto';
import { AuthService } from './auth.service';
import { AuthSessionDto, LoginDto } from './dto/login.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOperation({
    summary: 'Login placeholder',
    description:
      'Development-only endpoint. Accepts any password for existing users.',
  })
  @ApiOkResponse({ type: AuthSessionDto })
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Get('me')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get current user placeholder',
    description: 'Pass Authorization: Bearer dev-token-{userId}',
  })
  @ApiOkResponse({ type: UserDto })
  me(@Headers('authorization') authorization?: string) {
    const userId = this.extractUserId(authorization);
    return this.authService.getProfile(userId);
  }

  private extractUserId(authorization?: string): number {
    const token = authorization?.replace(/^Bearer\s+/i, '').trim();
    const match = token?.match(/^dev-token-(\d+)$/);

    if (!match) {
      throw new UnauthorizedException('Invalid authorization header');
    }

    return Number(match[1]);
  }
}
