import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserDto } from '../users/dto/user.dto';
import { TeamDto } from './dto/team.dto';
import { TeamsService } from './teams.service';

@ApiTags('teams')
@Controller('teams')
export class TeamsController {
  constructor(private readonly teamsService: TeamsService) {}

  @Get()
  @ApiOperation({ summary: 'List all teams' })
  @ApiOkResponse({ type: TeamDto, isArray: true })
  findAll() {
    return this.teamsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get team by id' })
  @ApiOkResponse({ type: TeamDto })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.teamsService.findOne(id);
  }

  @Get(':id/members')
  @ApiOperation({ summary: 'List team members' })
  @ApiOkResponse({ type: UserDto, isArray: true })
  findMembers(@Param('id', ParseIntPipe) id: number) {
    return this.teamsService.findMembers(id);
  }
}
