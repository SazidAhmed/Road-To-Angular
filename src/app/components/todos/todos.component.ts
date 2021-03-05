import { Component, OnInit } from '@angular/core';
import { Todo } from './../../models/Todo';

@Component({
  selector: 'app-todos',
  templateUrl: './todos.component.html',
  styleUrls: ['./todos.component.css']
})
export class TodosComponent implements OnInit {

  todos: Todo[];
  inputTodo:string = "";
  actionData:[];
  public showUpdateForm:boolean = false;

  constructor() { }

  ngOnInit(): void {
    this.getTodos();
  }

  getTodos(){
    fetch('http://localhost:3000/todos')
    .then(res => res.json())
    .then((data) => {
        this.todos= data;
    })
    .catch((error) => {
        console.log(error);
    });
  }

  toggleDone (id) {
    let p = this.todos.find(todo => {
      return todo.id === id
    })
    p.completed = !p.completed

    fetch('http://localhost:3000/todos/'+id , {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ completed: p.completed  })
    }).then(() => {
      this.todos.map((todo, i) => {
        if (i == id) {
          todo.completed = !todo.completed;
        }
        return todo;
      })
    }).catch(err => console.log(err))
  }

  addTodo () {
    let data = {
      id: Math.floor(Math.random() * 10000),
      content: this.inputTodo,
      completed: false
    }
    fetch('http://localhost:3000/todos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    })
    .then(() => {
      this.todos.push(data);
      this.inputTodo = "";
    })
    .catch((err) => {
      console.log(err)
    })
    
  }

  deleteTodo (id) {
    console.log(id);
    fetch('http://localhost:3000/todos/'+id , { method: 'DELETE' })
    .then(()=>{
      this.todos = this.todos.filter(todo => {
        return todo.id !== id
      })
    })
  }

  editTodo (id) {
    console.log(id);
    fetch('http://localhost:3000/todos/'+id)
    .then(res => res.json())
    .then((data) => {
      this.actionData = data;
      console.log('action data:',this.actionData);
    })
    .catch((err) => {
      console.log(err)
    })
  }
}
