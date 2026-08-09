import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UserRole } from '../../../common/enums';

export class UserDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'Alice Chen' })
  name: string;

  @ApiProperty({ example: 'alice@orchestra.app' })
  email: string;

  @ApiProperty({ enum: UserRole, example: UserRole.User })
  role: UserRole;

  @ApiPropertyOptional({ example: 'https://cdn.orchestra.app/avatars/1.png' })
  avatarUrl: string | null;

  @ApiPropertyOptional({ example: 1 })
  teamId: number | null;

  @ApiProperty({ example: '2026-08-09T00:00:00.000Z' })
  createdAt: Date;
}
