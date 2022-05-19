import React from "react";
import ReactDOM from "react-dom";
import css from "./style.css";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      todos: JSON.parse(localStorage.getItem("todolist")) || [],
    };
    this.input = React.createRef();
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
    let todoName = this.input.current.value;
    if (todoName === "") return;

    this.input.current.value = null;

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
        <input ref={this.input} type="text"></input>
        <button onClick={this.handleAddTodo}>add TODO</button>
        <button onClick={this.handleRemoveCompleteTodos}>
          clear complete TODOs
        </button>
        <div>{todosLeft.length} TODO Left</div>
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
    todos[this.findTodoIndex(this.props.todo)].complete =
      !todos[this.findTodoIndex(this.props.todo)].complete;

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
    return (
      <div className="todo">
        <label>
          <input
            type="checkbox"
            defaultChecked={this.props.todo.complete}
            onClick={this.handleCheckBox}
          ></input>
          {this.props.todo.name}
        </label>
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById("root"));
