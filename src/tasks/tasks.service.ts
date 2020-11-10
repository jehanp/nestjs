import { Injectable, NotFoundException } from '@nestjs/common';
import * as uuid from 'uuid'
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';

@Injectable()
export class TasksService {

    // getAllTasks(): Task[]{
    //     return this.tasks;
    // }

    // getTasksWithFilters(filterDto: GetTasksFilterDto):Task[]{
    //     const {status, search} = filterDto;

    //     let tasks = this.getAllTasks();

    //     if(status){
    //         tasks = tasks.filter(task=> task.status === status);
    //     }

    //     if(search){
    //         tasks = tasks.filter(tasks=> 
    //             tasks.title.includes(search) ||
    //             tasks.description.includes(search)
    //         );
    //     }

    //     return tasks;
    // }

    // getTaskById(id:string):Task{
    //     const found = this.tasks.find(
    //         task=>task.id === id
    //     );

    //     if(!found){
    //         throw new NotFoundException(`Task with ID "${id}" not found.`);
    //     }

    //     return found;
    // }

    // createTask(createTaskDto: CreateTaskDto): Task{
    //     const {title, description} = createTaskDto;

    //     const task:Task = {
    //         id: uuid.v1(),
    //         title,
    //         description,
    //         status: TaskStatus.OPEN
    //     };

    //     this.tasks.push(task);
    //     return task;
    // }

    // updateTaskStatus(id:string, status:TaskStatus):Task{
    //     const ids = id;

    //     const selected = this.getTaskById(ids);
    //     selected.status = status;
    //     return selected;
    // }

    // deleteTask(id:string):void{
    //     const found = this.getTaskById(id);
    //     this.tasks = this.tasks.filter(task=>task.id!==found.id);
    // }
}
