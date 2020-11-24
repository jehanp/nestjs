import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/user.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TaskStatus } from './task-status.enum';
import { Task } from './task.entity';
import { TaskRepository } from './task.repository';

@Injectable()
export class TasksService {
    constructor(
        @InjectRepository(TaskRepository)
        private taskRepository: TaskRepository,
    ){}

    async getTasks(user: User, filterDto: GetTasksFilterDto): Promise<Task[]>{
        return this.taskRepository.getTasks(user, filterDto);
    }

    async getTaskById(user: User, id:number):Promise<Task>{
        const found = await this.taskRepository.findOne({where: {id, userId:user.id}});

        if(!found){
            throw new NotFoundException(`Task with ID "${id}" not found.`);
        }

        return found;
    }

    async createTask(user: User, createTaskDto: CreateTaskDto):Promise<Task>{
        return this.taskRepository.createTask(user, createTaskDto);
    }

    async updateTaskStatus(user: User, id:number, status:TaskStatus):Promise<Task>{
        const task = await this.getTaskById(user, id);
        task.status = status;
        await task.save();
        return task;
    }

    async deleteTask(user: User, id:number){
        const result = await this.taskRepository.delete({id, userId:user.id});
        if(result.affected === 0){
            throw new NotFoundException(`Task with ID "${id}" not found.`);
        }
    }
}
