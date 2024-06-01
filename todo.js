var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import axios from 'axios';
class TodoService {
    constructor() {
        this.apiUrl = 'http://localhost:3000/items';
    }
    static getInstance() {
        if (!TodoService.instance) {
            TodoService.instance = new TodoService();
        }
        return TodoService.instance;
    }
    fetchTodos() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield fetch(this.apiUrl);
                if (!response.ok) {
                    throw new Error('Failed to fetch todos');
                }
                return yield response.json();
            }
            catch (error) {
                console.error('Error fetching todos:', error);
                throw error;
            }
        });
    }
    addTodo(task) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const newTodo = { task, completed: false };
                const response = yield fetch(this.apiUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(newTodo)
                });
                if (!response.ok) {
                    throw new Error('Failed to add todo');
                }
                const addedTodo = yield response.json();
                return Object.assign(Object.assign({}, newTodo), { id: addedTodo.id });
            }
            catch (error) {
                console.error('Error adding todo:', error);
                throw error;
            }
        });
    }
    updateTodo(todo) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield axios.put(`${this.apiUrl}/${todo.id}`, todo);
                return response.data;
            }
            catch (error) {
                console.error('Error updating todo:', error);
                throw error;
            }
        });
    }
    deleteTodo(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield axios.delete(`${this.apiUrl}/${id}`);
            }
            catch (error) {
                console.error('Error deleting todo:', error);
                throw error;
            }
        });
    }
}
document.addEventListener('DOMContentLoaded', () => __awaiter(void 0, void 0, void 0, function* () {
    const todoService = TodoService.getInstance();
    const todoList = document.getElementById('todo-list');
    const newTaskForm = document.getElementById('new-task-form');
    newTaskForm === null || newTaskForm === void 0 ? void 0 : newTaskForm.addEventListener('submit', (event) => __awaiter(void 0, void 0, void 0, function* () {
        event.preventDefault();
        const newTaskTitleInput = document.getElementById('new-todo');
        const title = newTaskTitleInput.value.trim();
        if (title) {
            yield todoService.addTodo(title);
            newTaskTitleInput.value = '';
            yield renderTodos(); // Call renderTodos here
        }
    }));
    const renderTodos = () => __awaiter(void 0, void 0, void 0, function* () {
        const todos = yield todoService.fetchTodos();
        todoList.innerHTML = '';
        todos.forEach(todo => {
            const li = document.createElement('li');
            li.textContent = todo.task;
            const updateButton = document.createElement('button');
            updateButton.textContent = 'Update';
            updateButton.addEventListener('click', () => __awaiter(void 0, void 0, void 0, function* () {
                // Call updateTodo here
                yield todoService.updateTodo(Object.assign(Object.assign({}, todo), { completed: !todo.completed }));
                yield renderTodos();
            }));
            li.appendChild(updateButton);
            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.addEventListener('click', () => __awaiter(void 0, void 0, void 0, function* () {
                // Call deleteTodo here
                yield todoService.deleteTodo(todo.id);
                yield renderTodos();
            }));
            li.appendChild(deleteButton);
            todoList.appendChild(li);
        });
    });
    yield renderTodos();
}));
