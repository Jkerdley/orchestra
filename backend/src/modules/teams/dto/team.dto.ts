import { ApiProperty } from '@nestjs/swagger';

export class TeamDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'Platform' })
  name: string;

  @ApiProperty({ example: 'platform' })
  slug: string;

  @ApiProperty({ example: '2026-08-09T00:00:00.000Z' })
  createdAt: Date;
}
