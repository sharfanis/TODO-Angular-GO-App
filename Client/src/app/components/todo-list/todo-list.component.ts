import { Component, OnInit } from '@angular/core';
import { Todo } from '../../interfaces/todo';
import { trigger, transition, style, animate } from '@angular/animations';
import {TodoService} from '../../services/todo-service.service';
import {isSuccess} from '@angular/http/src/http_utils';

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.scss'],
  animations: [
    trigger('fade', [

      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(30px)' }),
        animate(200, style({ opacity: 1, transform: 'translateY(0px)'}))
      ]),

      transition(':leave', [
        animate(200, style({ opacity: 0, transform: 'translateY(30px)' }))
      ]),

    ])
  ]
})
export class TodoListComponent implements OnInit {
  todos: Todo[];
  todoTitle: string;
  idForTodo: number;
  beforeEditCache: string;
  filter: string;
  anyRemainingModel: boolean;
  dummyValObj: Todo;


  constructor(private todoService: TodoService) { }

  ngOnInit() {
    this.anyRemainingModel = true;
    this.filter = 'all';
    this.beforeEditCache = '';
    this.idForTodo = 4;
    this.todoTitle = '';
    // Fetch the values of Todo Items.
    this.fetchAllToDoItems();
  }

  fetchAllToDoItems() {
    this.todoService.getAllTodoListItems().then((values) => {
      console.log('the values ', values);
      if (values.length > 0) {
        this.todos = values;
      }
    }, (err) => {
      console.log(err);
    });
  }

  addTodo(): void {
    if (this.todoTitle.trim().length === 0) {
      return;
    }
    this.dummyValObj = {
      Id: null,
      Description: this.todoTitle,
      Completed: false,
      Date: '2020-04-24',
      Creator: 'VORTO-DB',
      editing: false
    };
    // Create new to Do ITem.
    this.createNewTodoItem(this.dummyValObj);
    this.todoTitle = '';

  }

  createNewTodoItem(obj) {
    if (obj.Description.length === 0 || obj.Description === ' ')  {
      return;
    } else {
     this.todoService.createNewTodoListItem(obj).then((response) => {
       console.log(response);
     }, () => {
       this.todos.push(this.dummyValObj);
       // Fetch the list again .
       this.fetchAllToDoItems();
     });
    }
  }

  editTodo(todo: Todo): void {
    this.beforeEditCache = todo.Description;
    todo.editing = true;
  }

  updateToDoListItem(todo) {
    this.todoService.updateTodoListItem(todo, todo.Id).then((response) => {
      console.log(response);
    }, (success) => {
      this.fetchAllToDoItems();
    });
  }

  doneEdit(todo: Todo): void {
    if (todo.Description.trim().length === 0) {
      todo.Description = this.beforeEditCache;
    }
    // Update the Item here.
    this.updateToDoListItem(todo);
    this.anyRemainingModel = this.anyRemaining();
    todo.editing = false;
  }

  updateStatus(todo: Todo) {
    console.log('the todo', todo);
    if (todo.Completed) {
      todo.Completed = 'true';
    } else {
      todo.Completed = 'false';
    }
    this.updateToDoListItem(todo);
  }

  cancelEdit(todo: Todo): void {
    todo.Description = this.beforeEditCache;
    todo.editing = false;
  }

  deleteTodo(id: number): void {
    if (id){
      this.todoService.deleteToDoListItem(id).then((response) => {
        //console.log(response);
        this.todos = this.todos.filter(todo => todo.Id !== id);
      } , (isSuccess) => {
        this.fetchAllToDoItems();
      });
    }
    }

  remaining(): number {
    return this.todos.filter(todo => !todo.Completed).length;
  }

  atLeastOneCompleted(): boolean {
    return this.todos.filter(todo => todo.Completed).length > 0;
  }

  clearCompleted(): void {
    this.todos = this.todos.filter(todo => !todo.Completed);
  }

  checkAllTodos(): void {
    this.todos.forEach(todo => todo.Completed = (<HTMLInputElement>event.target).checked);
    this.anyRemainingModel = this.anyRemaining();
  }

  anyRemaining(): boolean {
    return this.remaining() !== 0;
  }

  todosFiltered(): Todo[] {
    if (this.filter === 'all') {
      return this.todos;
    } else if (this.filter === 'active') {
      return this.todos.filter(todo => !todo.Completed);
    } else if (this.filter === 'completed') {
      return this.todos.filter(todo => todo.Completed);
    }

    return this.todos;
  }

}

