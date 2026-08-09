import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDateString,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';
import { BoardType, TaskStatus } from '../../../common/enums';

export class CreateTaskDto {
  @ApiProperty({ example: 'Implement drag-and-drop' })
  @IsString()
  @MaxLength(256)
  title: string;

  @ApiPropertyOptional({ example: 'Move cards between columns with optimistic UI.' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ enum: TaskStatus, default: TaskStatus.Backlog })
  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;

  @ApiPropertyOptional({ example: 'Board' })
  @IsOptional()
  @IsString()
  @MaxLength(128)
  epic?: string;

  @ApiPropertyOptional({ example: '2026-08-18T00:00:00.000Z' })
  @IsOptional()
  @IsDateString()
  dueDate?: string;

  @ApiPropertyOptional({ example: 0 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  loggedMinutes?: number;

  @ApiPropertyOptional({ example: 0 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  sortOrder?: number;

  @ApiProperty({ enum: BoardType, default: BoardType.Team })
  @IsEnum(BoardType)
  boardType: BoardType;

  @ApiPropertyOptional({ example: 3 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  assigneeId?: number;

  @ApiProperty({ example: 1 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  teamId: number;
}
