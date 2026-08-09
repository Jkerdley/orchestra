import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';
import { UserDto } from '../../users/dto/user.dto';

export class LoginDto {
  @ApiProperty({ example: 'alice@orchestra.app' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'password' })
  @IsString()
  @MinLength(4)
  password: string;
}

export class AuthSessionDto {
  @ApiProperty({ example: 'dev-token-alice' })
  accessToken: string;

  @ApiProperty({ type: UserDto })
  user: UserDto;
}
