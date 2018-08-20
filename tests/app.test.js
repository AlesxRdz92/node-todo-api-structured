const expect = require('expect');
const request = require('supertest');
const { ObjectID } = require('mongodb');

const { app } = require('./../server');
const { Todo } = require('./../models/todo');
const { Users } = require('./../models/user');
const { todos, populateTodos, populateUsers, users } = require('./seed');

beforeEach(populateUsers);
beforeEach(populateTodos);

describe('POST /todos', () => {
    it('should create a new todo', done => {
        var text = 'Test todo text';
        request(app).post('/todos')
            .send({ text })
            .expect(200)
            .expect(res => {
                expect(res.body.text).toBe(text);
            })
            .end((err, res) => {
                if (err)
                    return done(err);
                Todo.find({ text }).then(todos => {
                    expect(todos.length).toBe(1);
                    expect(todos[0].text).toBe(text);
                    done();
                }).catch(e => done(e));
            });
    });

    it('should not create todo with invalid body data', done => {
        request(app).post('/todos')
            .send({})
            .expect(400)
            .end((err, res) => {
                if (err)
                    return done(err);
                Todo.find().then(todos => {
                    expect(todos.length).toBe(2);
                    done();
                }).catch(e => done(e));
            });
    });
});

describe('GET /todos', () => {
    it('should get all todos', done => {
        request(app).get('/todos')
            .expect(200)
            .expect(res => {
                expect(res.body.todos.length).toBe(2);
            }).end(done);
    });
});

describe('GET /todos/id', () => {
    it('should get one element', done => {
        request(app).get(`/todos/${todos[0]._id.toHexString()}`)
            .expect(200)
            .expect(res => {
                expect(res.body.text).toBe(todos[0].text);
            }).end(done);
    });

    it('should return a 400 code', done => {
        let id = '123abc';
        request(app).get(`/todos/${id}`)
            .expect(400)
            .end(done);
    });

    it('should return a 404 code and ID not found', done => {
        let id = new ObjectID().toHexString();
        request(app).get(`/todos/${id}`)
            .expect(404)
            .expect(res => {
                expect(res.text).toBe('ID not found');
            }).end(done);
    });
});

describe('DELETE /todos/id', () => {
    it('should delete one element', done => {
        let id = todos[1]._id.toHexString();
        request(app).delete(`/todos/${id}`)
            .expect(200)
            .expect(res => {
                expect(res.body.todo._id).toBe(id);
            })
            .end((err, res) => {
                if (err)
                    return done(err);
                Todo.findById(id).then(todo => {
                    expect(todo).toBeNull();
                    done();
                }).catch(e => done(e));
            });
    });

    it('should return a 400 code', done => {
        let id = '123abc';
        request(app).delete(`/todos/${id}`)
            .expect(400)
            .end(done);

    });

    it('should return a 404 code', done => {
        let id = new ObjectID().toHexString();
        request(app).delete(`/todos/${id}`)
            .expect(404)
            .end(done);
    });
});

describe('PATCH /todos/id', () => {
    it('should update the todo', done => {
        let id = todos[0]._id.toHexString();
        let text = 'Changed text';
        request(app).patch(`/todos/${id}`)
            .send({ text, completed: true, completedAt: 434253445 })
            .expect(200)
            .expect(res => {
                expect(res.body.todo.text).toEqual(text);
                expect(res.body.todo.completed).toBe(true);
                expect(typeof res.body.todo.completedAt).toBe('number');
            })
            .end(done);
    });

    it('should clear completedAt when todo is not completed', done => {
        let id = todos[1]._id.toHexString();
        let text = 'Changed text';
        request(app).patch(`/todos/${id}`)
            .send({ text, completed: false })
            .expect(200)
            .expect(res => {
                expect(res.body.todo.text).toEqual(text);
                expect(res.body.todo.completed).toBeFalsy();
                expect(res.body.todo.completedAt).toBeNull();
            })
            .end(done);
    });

    it('should return a 400 error code', done => {
        let id = '123abc';
        request(app).patch(`/todos/${id}`)
            .send({ text: 'test' })
            .expect(400)
            .end(done);
    });

    it('should return a 404 error code', done => {
        let id = new ObjectID().toHexString();
        request(app).patch(`/todos/${id}`)
            .send({ text: 'test' })
            .expect(404)
            .end(done);
    });
});


