import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';
import { UserRole } from '../../../common/enums';

export class UpdateUserDto {
  @ApiPropertyOptional({ example: 'Alice Chen' })
  @IsOptional()
  @IsString()
  @MaxLength(256)
  name?: string;

  @ApiPropertyOptional({ example: 'alice@orchestra.app' })
  @IsOptional()
  @IsEmail()
  @MaxLength(256)
  email?: string;

  @ApiPropertyOptional({ enum: UserRole })
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;

  @ApiPropertyOptional({ example: 'https://cdn.orchestra.app/avatars/1.png' })
  @IsOptional()
  @IsString()
  @MaxLength(512)
  avatarUrl?: string | null;
}
