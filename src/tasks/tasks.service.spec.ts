import { NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TaskStatus } from './task-status.enum';
import { Task } from './task.entity';
import { TaskRepository } from './task.repository';
import { TasksService } from './tasks.service';

const mockUser = {
    id: 12,
    user: 'Test User'
}
const mockTaskRepository = () =>({
    findOne: jest.fn(),
    getTasks: jest.fn(),
    createTask: jest.fn(),
    delete: jest.fn(),
});

describe('TasksService', ()=>{
    let tasksService;
    let taskRepository;

    beforeEach(async ()=>{
        const module = await Test.createTestingModule({
            providers:[
                TasksService,
                {provide: TaskRepository, useFactory: mockTaskRepository}
            ]
        }).compile();

        tasksService = await module.get<TasksService>(TasksService);
        taskRepository = await module.get<TaskRepository>(TaskRepository);
    });

    describe('getTasks', ()=>{
        it('gets all tasks from the repository', async ()=>{
            taskRepository.getTasks.mockResolvedValue('someValue');
            expect(taskRepository.getTasks).not.toHaveBeenCalled();
            const filters: GetTasksFilterDto = {
                status: TaskStatus.IN_PROGRESS,
                search: 'Some search query'
            }
            //call tasksService.getTasks
            const result = await tasksService.getTasks(mockUser, filters);
            //expect taskRepository.getTasks to have been called
            expect(taskRepository.getTasks).toHaveBeenCalled();
            expect(result).toEqual('someValue');
        })
    });

    describe('getTaskById', ()=>{
        it('call taskRepository.findOne() and successfully retrieve task', async ()=>{
            const mockTask = {
                title: 'Test task',
                description: 'Test description'
            };
            taskRepository.findOne.mockResolvedValue(mockTask)

            const result = await tasksService.getTaskById(mockUser, 1);
            expect(taskRepository.findOne).toHaveBeenCalledWith({
                where:{
                    id: 1,
                    userId: mockUser.id
                }
            });
            expect(result).toEqual(mockTask);
        });

        it('throws an error as task is not found', ()=> {
            taskRepository.findOne.mockResolvedValue(null)
            expect(tasksService.getTaskById(mockUser, 1)).rejects.toThrow(NotFoundException)
        });
    });

    describe('createTask', ()=>{
        it('call taskRepository.createTask() to successfully create task', async ()=>{
            const mockCreateTaskDto = {
                title: 'Test Title',
                description: 'Test Description'
            };  
            taskRepository.createTask.mockResolvedValue(mockCreateTaskDto);
    
            expect(taskRepository.createTask).not.toHaveBeenCalled()
            const result = await tasksService.createTask(mockUser, mockCreateTaskDto);
            expect(taskRepository.createTask).toHaveBeenCalledWith(mockUser,mockCreateTaskDto);
            expect(result).toEqual(mockCreateTaskDto);
        });
    });

    describe('deleteTask', ()=>{
        it('call taskRepository.delete() to delete task', async ()=>{
            taskRepository.delete.mockResolvedValue({affedted: 1});

            expect(taskRepository.delete).not.toHaveBeenCalled();
            await tasksService.deleteTask(mockUser, 1);
            expect(taskRepository.delete).toHaveBeenCalledWith({id: 1, userId: mockUser.id})
        });

        it('throws an error as task is not found', ()=> {
            taskRepository.delete.mockResolvedValue({affedted: 0});
            expect(tasksService.deleteTask(mockUser, 1)).rejects.toThrow(NotFoundException)
        });
    });

    describe('updateTaskStatus', ()=>{
        it('updates a task status', async ()=>{
            const save = jest.fn().mockResolvedValue(true);
            tasksService.getTaskById = jest.fn().mockResolvedValue({
                status: TaskStatus.OPEN,
                save
            });

            expect(tasksService.getTaskById).not.toHaveBeenCalled()
            const result = await tasksService.updateTaskStatus(mockUser, 1, TaskStatus.IN_PROGRESS);
            expect(tasksService.getTaskById).toHaveBeenCalledWith(mockUser, 1);
            expect(save).toHaveBeenCalled();
            expect(result.status).toEqual(TaskStatus.IN_PROGRESS);
        });
    });
})