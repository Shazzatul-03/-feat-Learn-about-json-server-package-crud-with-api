import { useState } from "react";
import "./App.css";
import { useEffect } from "react";

function App() {
  const [todoTitle, setTodoTitle] = useState("");
  const [todos, setTodos] = useState([]);
  const [filter, setFilter] = useState("all");

  const filterOption = () => {
    if (filter === "completed") {
      return "completed=true";
    } else if (filter === "pending") {
      return "completed=false";
    } else {
      return "";
    }
  };

  const getAllTodos = async () => {
    const res = await fetch(`http://localhost:4000/todos?${filterOption()}`);
    const data = await res.json();
    setTodos(data);
  };

  useEffect(() => {
    getAllTodos();
    // fetch(`http://localhost:4000/todos`)
    //   .then((res) => res.json())
    //   .then((data) => {
    //     setTodos(data);
    //   });
  }, [filter]);

  const submitHandler = async (e) => {
    e.preventDefault();

    const newTodo = {
      title: todoTitle,
      completed: false,
    };
    // Data Change in API
    await fetch(`http://localhost:4000/todos`, {
      method: "POST",
      body: JSON.stringify(newTodo),
      headers: {
        "Content-type": "application/json",
      },
    });
    setFilter("all");
    await getAllTodos(); //Refage
    setTodoTitle("");
  };

  const removeHandler = async (todoId) => {
    await fetch(`http://localhost:4000/todos/${todoId}`, {
      method: "DELETE",
    });
    getAllTodos();
  };

  const updetHandler = async (todo) => {
    await fetch(`http://localhost:4000/todos/${todo.id}`, {
      method: "PUT",
      body: JSON.stringify({ ...todo, completed: !todo.completed }),
      headers: {
        "Content-type": "application/json",
      },
    });
    await getAllTodos();
  };

  return (
    <div className="App">
      <form onSubmit={submitHandler}>
        <input
          type="text"
          value={todoTitle}
          onChange={(e) => setTodoTitle(e.target.value)}
        />
        <button type="submit">Create Todo</button>
      </form>
      <div className="filter-options">
        <select
          name=""
          id=""
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="all">All</option>
          <option value="completed">Completed</option>
          <option value="pending">Pending</option>
        </select>
      </div>
      <div className="todo-list">
        <h2>Todo List</h2>
        <ul>
          {todos.map((todo) => {
            // console.log(todo);

            <li key={todo.id}>
              <input
                type="checkbox"
                name=""
                id=""
                checked={todo.completed}
                onChange={() => updetHandler(todo)}
              />
              <span>{todo.title}</span>
              <button onClick={() => removeHandler(todo.id)}>Remove</button>
            </li>;
          })}
        </ul>
      </div>
    </div>
  );
}

export default App;