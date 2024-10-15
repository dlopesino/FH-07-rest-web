import { Request, Response } from 'express';
// import { prisma } from '../../data/postgres';
import { CreateTodoDto, UpdateTodoDto } from '../../domain/dtos';
import { TodoRepository } from '../../domain';

// DDD --> Domain Driven Design

export class TodosController {

    // * DI (dependency injection)
    constructor(
        private readonly todoRepository: TodoRepository,
    ) { }

    public getTodos = async (req: Request, res: Response) => {

        // const todos = await prisma.todo.findMany()
        const todos = await this.todoRepository.getAll();
        return res.json(todos);
    }

    public getTodoById = async (req: Request, res: Response) => {

        const id = +req.params.id;

        // const todo = await prisma.todo.findFirst({where: {id}})
        try {
            const todo = await this.todoRepository.findById(id);
            return res.json(todo);

        } catch (error) {
            return res.status(400).json({error});
            
        }
    }

    public createTodo = async (req: Request, res: Response) => {
        const [error, createTodoDto] = CreateTodoDto.create(req.body);
        if(error) return res.status(400).json({error});

        // const todo = await prisma.todo.create({
        //     data: createTodoDto!
        // });

        const todo = await this.todoRepository.create(createTodoDto!);

        return res.status(201).json(todo);
    }

    public updateTodo = async (req: Request, res: Response) => {

        const id = +req.params.id;

        const [error, updateTodoDto] = UpdateTodoDto.create({...req.body, id});
        if (error) return res.status(400).json(error);
        
        // const todo = await prisma.todo.findUnique({where: {id}});

        // if (!todo) return res.status(404).json({ error: `Todo with id ${id} not found` });

        // const updated = await prisma.todo.update({
        //     where: { id },
        //     data: updateTodoDto!.values
        // });

        const updated = await this.todoRepository.updateById(updateTodoDto!);
        return res.status(200).json(updated);
    }

    public deleteTodo = async (req: Request, res: Response) => {

        const id = +req?.params?.id;

        // const todo = await prisma.todo.findUnique({
        //     where: {id}
        // })
        // if (!todo) return res.status(404).json({ error: 'Todo ID not Found' });

        // (deleted) 
        // ? res.status(200).json({ message: 'Todo was deleted', deleted })
        // : res.status(404).json({ error: `Todo with id ${id} not found` });

        // const deleted = await prisma.todo.delete({
        //     where: {id}
        // });
        const deleted = await this.todoRepository.deleteById(id);
        res.status(200).json({ message: 'Todo was deleted', deleted })


    }
}