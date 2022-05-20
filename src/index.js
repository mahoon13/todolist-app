import React from "react";
import ReactDOM from "react-dom";
import css from "./style.css";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      todos: JSON.parse(localStorage.getItem("todolist")) || [],
    };
    this.handleAddTodo = this.addTodo.bind(this);
    this.handleRemoveCompleteTodos = this.handleRemoveCompleteTodos.bind(this);
  }

  componentDidMount() {
    window.addEventListener("completetodo", (e) => {
      this.setState({ todos: JSON.parse(localStorage.getItem("todolist")) });
    });
  }

  componentDidUpdate() {
    localStorage.setItem("todolist", JSON.stringify(this.state.todos));
  }

  handleRemoveCompleteTodos() {
    let todos = this.state.todos;
    let uncompleteTodos = todos.filter((todo) => !todo.complete);
    this.setState({ todos: uncompleteTodos });
  }

  addTodo(todo) {
    let todoName = prompt("write todo:", "");
    if (todoName === "" || todoName === null) return;

    let id;
    if (this.state.todos.length === 0) {
      id = 0;
    } else {
      id = this.state.todos[this.state.todos.length - 1].id + 1;
    }
    this.setState({
      todos: [
        ...this.state.todos,
        {
          id: id,
          name: todoName,
          complete: false,
        },
      ],
    });
  }

  render() {
    let todosLeft = this.state.todos.filter((todo) => !todo.complete);

    return (
      <>
        <TodoList todolist={this.state.todos} />
        <div className="add__todo" onClick={this.handleAddTodo}></div>
      </>
    );
  }
}

class TodoList extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return this.props.todolist.map((todo) => {
      return <Todo key={todo.id} id={todo.id} todo={todo} />;
    });
  }
}

class Todo extends React.Component {
  constructor(props) {
    super(props);
    this.handleCheckBox = this.handleCheckBox.bind(this);
  }

  handleCheckBox() {
    let todos = JSON.parse(localStorage.getItem("todolist"));
    let todoIndex = this.findTodoIndex(this.props.todo);
    todos[todoIndex].complete = !todos[todoIndex].complete;

    localStorage.setItem("todolist", JSON.stringify(todos));
    window.dispatchEvent(new Event("completetodo"));
  }

  findTodoIndex(todo) {
    let todos = JSON.parse(localStorage.getItem("todolist"));
    let todoId = todo.id;
    for (let i in todos) {
      if (todos[i].id === todoId) {
        return i;
      }
    }
    return null;
  }

  render() {
    let className = "todo";

    const isCompleted = this.props.todo.complete;
    if (isCompleted) {
      className += " completed";
    }

    return (
      <label className={className}>
        <input
          type="checkbox"
          defaultChecked={this.props.todo.complete}
          onClick={this.handleCheckBox}
        ></input>
        {this.props.todo.name}
      </label>
    );
  }
}

ReactDOM.render(<App />, document.getElementById("root"));
