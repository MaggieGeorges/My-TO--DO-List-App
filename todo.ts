import axios from 'axios';

interface Todo {
    id: number;
    task: string;
    completed: boolean;
}

class TodoService {
    private static instance: TodoService;
    private apiUrl = 'http://localhost:3000/items';

    private constructor() {}

    public static getInstance(): TodoService {
        if (!TodoService.instance) {
            TodoService.instance = new TodoService();
        }
        return TodoService.instance;
    }

    public async fetchTodos(): Promise<Todo[]> {
        try {
            const response = await fetch(this.apiUrl);
            if (!response.ok) {
                throw new Error('Failed to fetch todos');
            }
            return await response.json();
        } catch (error) {
            console.error('Error fetching todos:', error);
            throw error;
        }
    }

    public async addTodo(task: string): Promise<Todo> {
        try {
            const newTodo = { task, completed: false };
            const response = await fetch(this.apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newTodo)
            });
            if (!response.ok) {
                throw new Error('Failed to add todo');
            }
            const addedTodo = await response.json();
            return { ...newTodo, id: addedTodo.id };
        } catch (error) {
            console.error('Error adding todo:', error);
            throw error;
        }
    }

    public async updateTodo(todo: Todo): Promise<Todo> {
        try {
            const response = await axios.put<Todo>(`${this.apiUrl}/${todo.id}`, todo);
            return response.data;
        } catch (error) {
            console.error('Error updating todo:', error);
            throw error;
        }
    }

    public async deleteTodo(id: number): Promise<void> {
        try {
            await axios.delete(`${this.apiUrl}/${id}`);
        } catch (error) {
            console.error('Error deleting todo:', error);
            throw error;
        }
    }
}

document.addEventListener('DOMContentLoaded', async () => {

    const todoService = TodoService.getInstance();
    const todoList = document.getElementById('todo-list')!;
    const newTaskForm = document.getElementById('new-task-form');

    newTaskForm?.addEventListener('submit', async (event) => {
        event.preventDefault();
        const newTaskTitleInput = document.getElementById('new-todo') as HTMLInputElement;
        const title = newTaskTitleInput.value.trim();
        if (title) {
            await todoService.addTodo(title);
            newTaskTitleInput.value = '';
            await renderTodos(); // Call renderTodos here
        }
    });

    const renderTodos = async () => {
        const todos = await todoService.fetchTodos();
        todoList.innerHTML = '';
        todos.forEach(todo => {
            const li = document.createElement('li');
            li.textContent = todo.task;

            const updateButton = document.createElement('button');
            updateButton.textContent = 'Update';
            updateButton.addEventListener('click', async () => {
                // Call updateTodo here
                await todoService.updateTodo({
                    ...todo,
                    completed: !todo.completed
                });
                await renderTodos();
            });
            li.appendChild(updateButton);

            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.addEventListener('click', async () => {
                // Call deleteTodo here
                await todoService.deleteTodo(todo.id);
                await renderTodos();
            });
            li.appendChild(deleteButton);

            todoList.appendChild(li);
        });
    };

    await renderTodos();

});