import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { BoardType, TaskStatus } from '../../../common/enums';

export class TaskDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'Implement drag-and-drop' })
  title: string;

  @ApiPropertyOptional({ example: 'Move cards between columns with optimistic UI.' })
  description: string | null;

  @ApiProperty({ enum: TaskStatus, example: TaskStatus.InProgress })
  status: TaskStatus;

  @ApiPropertyOptional({ example: 'Board' })
  epic: string | null;

  @ApiPropertyOptional({ example: '2026-08-18T00:00:00.000Z' })
  dueDate: Date | null;

  @ApiProperty({ example: 120 })
  loggedMinutes: number;

  @ApiProperty({ example: 0 })
  sortOrder: number;

  @ApiProperty({ enum: BoardType, example: BoardType.Team })
  boardType: BoardType;

  @ApiPropertyOptional({ example: 3 })
  assigneeId: number | null;

  @ApiProperty({ example: 1 })
  teamId: number;

  @ApiProperty({ example: '2026-08-09T00:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '2026-08-09T00:00:00.000Z' })
  updatedAt: Date;
}
