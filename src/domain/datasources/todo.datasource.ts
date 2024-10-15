import { TodoEntity } from "../entities/todo.entity";
import { CreateTodoDto } from '../dtos/todos/create-todo.dto';
import { UpdateTodoDto } from '../dtos/todos/update-todo.dto';


export abstract class TodoDatasource {

    abstract create(CreateTodoDto: CreateTodoDto): Promise<TodoEntity>;
    
    // todo: paginación
    abstract getAll(): Promise<TodoEntity[]>;

    abstract findById(id: number): Promise<TodoEntity>;
    abstract updateById(updateTodoDto: UpdateTodoDto): Promise<TodoEntity>;
    abstract deleteById(id: number): Promise<TodoEntity>;

}