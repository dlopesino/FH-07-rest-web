import request from 'supertest';
import { testServer } from '../../test-server';
import { prisma } from '../../../src/data/postgres';

describe('todo route testing', () => {

    beforeAll(async () => {
        await testServer.start();
    });

    afterAll(() => {
        testServer.close();
    });

    beforeEach(async() => {
        await prisma.todo.deleteMany();
    });

    const todo1 = { text: 'Hola Mundo 1' };
    const todo2 = { text: 'Hola Mundo 2' };
    
    test('should return TODOs api/todos ', async () => {

        await prisma.todo.createMany({
            data: [todo1, todo2]
        });

        const { body } = await request(testServer.app)
            .get('/api/todos')
            .expect(200);

        expect(body).toBeInstanceOf(Array);
        expect(body.length).toBe(2);
        expect(body[0].text).toBe(todo1.text);
        expect(body[1].text).toBe(todo2.text);
        expect(body[0].completedAt).toBeNull();
            
    });

    test('should return a TODO api/todos/:id', async () => {
       
        const todo = await prisma.todo.create({
            data: todo1
        });

        const { body } = await request(testServer.app)
        .get(`/api/todos/${todo.id}`)
        .expect(200);

        expect(body).toEqual({
            id: todo.id,
            text: todo.text,
            completedAt: todo.completedAt
        });
        
    });

    test('should return a 404 NotFound api/todos/:id', async () => {

        const notFoundId = 999;

        const { body } = await request(testServer.app)
        .get(`/api/todos/${notFoundId}`)
        .expect(404);

        expect( body ).toEqual({ error: `Todo with id ${notFoundId} not found`});
        
    });

    test('should return a new TODO api/todos/create', async() => {
        const { body } = await request( testServer.app )
            .post('/api/todos')
            .send(todo1)
            .expect(201);

        expect(body).toEqual({
            id: expect.any(Number),
            text: todo1.text,
            completedAt: null,
        });
        

    });
    
    test('should return an error if text is not present api/todos/create', async() => {
        const { body } = await request( testServer.app )
            .post('/api/todos')
            .send({})
            .expect(400);

        expect(body).toEqual({error: 'Text property is required'});
        
    });

    test('should return an error if text is empty api/todos/create', async() => {
        const { body } = await request( testServer.app )
            .post('/api/todos')
            .send({text: ''})
            .expect(400);

        expect(body).toEqual({error: 'Text property is required'});
        
    });
    
    test('should return an updated TODO api/todos/:id', async() => {

        const todo = await prisma.todo.create({ data: todo1 });

        const todoToUpdate = {text: 'UPDATE', completedAt: '2023-10-21'}

        const { body } = await request( testServer.app )
            .put(`/api/todos/${todo.id}`)
            .send(todoToUpdate)
            .expect(200);

        expect(body).toEqual({
            id: expect.any(Number),
            ...todoToUpdate,
        });
        
    });

    test('should return 404 if TODO not found', async() => {
        const toUpdateId = 999;
        const todoToUpdate = {text: 'UPDATE', completedAt: '2023-10-21'}

        const { body } = await request( testServer.app )
            .put(`/api/todos/${toUpdateId}`)
            .send(todoToUpdate)
            .expect(404);

        expect(body).toEqual({error: 'Todo with id 999 not found'});
        
    });

    test('should return an updated TODO only the date', async() => {
        const todo = await prisma.todo.create({ data: todo1 });

        const todoToUpdate = {completedAt: '2024-12-22'}

        const { body } = await request( testServer.app )
            .put(`/api/todos/${todo.id}`)
            .send(todoToUpdate)
            .expect(200);

        expect(body).toEqual({
            id: expect.any(Number),
            text: todo.text,
            ...todoToUpdate,
        });
    });

    test('should return an updated TODO only the text', async() => {
        const todo = await prisma.todo.create({ data: todo1 });
        
        const todoToUpdate = {text: 'UPDATED'}

        const { body } = await request( testServer.app )
            .put(`/api/todos/${todo.id}`)
            .send(todoToUpdate)
            .expect(200);

        expect(body).toEqual({
            id: expect.any(Number),
            completedAt: todo.completedAt,
            ...todoToUpdate,
        });
    });
    
    test('should delete a TODO api/todos/:id', async() => {
        const todo = await prisma.todo.create({ data: todo1 });

        const { body } = await request(testServer.app)
        .delete(`/api/todos/${todo.id}`)
        .set('Accept', 'application/json')
        .expect(200);

        expect(body).toEqual({ 
            id: expect.any(Number),
            text: 'Hola Mundo 1',
            completedAt: null
        });
        
    });

    test('should return 404 if TODO do not exist api/todos/:id', async() => {

        const toDeleteId = 999;

        const { body } = await request(testServer.app)
        .delete(`/api/todos/${toDeleteId}`)
        .set('Accept', 'application/json')
        .expect(404);

        expect(body).toEqual({error: 'Todo with id 999 not found'})

        
    });
    
});
