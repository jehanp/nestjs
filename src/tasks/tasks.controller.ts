import { Body, Controller, Delete, Get, Logger, Param, ParseIntPipe, Patch, Post, Query, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from 'src/auth/user.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TaskStatusValidationPipe } from './pipes/task.status-validation.pipe';
import { TaskStatus } from './task-status.enum';
import { Task } from './task.entity';
import { TasksService } from './tasks.service';

@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {
    private logger = new Logger('TasksController');
    constructor(private tasksService:TasksService) {}

    @Get()
    getTasks(
        @GetUser() user: User,
        @Query(ValidationPipe) filterDto:GetTasksFilterDto,
    ): Promise<Task[]>{ 
        this.logger.verbose(`User "${user.username}" retrieving all tasks. Filters: ${JSON.stringify({filterDto})}`)
        return this.tasksService.getTasks(user, filterDto);
    }

    @Get('/:id')
    getTaskById(
        @GetUser() user: User,
        @Param('id', ParseIntPipe) id:number,
    ):Promise<Task>{
        return this.tasksService.getTaskById(user, id);
    }

    @Post()
    @UsePipes(ValidationPipe)
    createTask(
        @GetUser() user: User,
        @Body() createTaskDto:CreateTaskDto,
    ):Promise<Task>{
        this.logger.verbose(`User "${user.username}" creating a new task. Data: ${JSON.stringify({createTaskDto})}`)
        return this.tasksService.createTask(user, createTaskDto);
    }

    @Patch('/:id/status')
    updateTaskStatus(
        @GetUser() user: User,
        @Param('id', ParseIntPipe) id:number,
        @Body('status', TaskStatusValidationPipe) status:TaskStatus
        ):Promise<Task>{            
            return this.tasksService.updateTaskStatus(user, id, status);
    }

    @Delete('/:id')
    deleteTask(
        @GetUser() user: User,
        @Param('id', ParseIntPipe) id:number,
    ){
        return this.tasksService.deleteTask(user, id);
    }
}
