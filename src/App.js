import './App.css';
import { useState, useEffect } from 'react';
import { BsTrash, BsBookmarkCheck, BsBookmarkCheckFill } from 'react-icons/bs'

const api = "http://localhost:5000"

function App() {
  const [title, setTitle] = useState('');
  const [time, setTime] = useState('');
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(false);


  // carregas os afazeres na página
  useEffect(() => {
    const loadData = async() => {
      setLoading(true)
      const res = await fetch(api + "/todos")
        .then((res) => res.json())
        .then((data) => data)
        .catch((err) => console.log(err))
      setLoading(false)
      setTodos(res)
    }
    loadData()

  }, [])


  // Essa função recebe e exibe o envio do formulário
  const handleSubmit = async (e) => {
    // Essa função faz com que a página nao seja recarregada
    e.preventDefault();

    // estes são os atributos do formulário
    const todo = {
      id: Math.random(),
      title,
      time,
      done: false
    }

    // essa função envia os dados pra API
    await fetch(api + "/todos", {
      method: "POST",
      body: JSON.stringify(todo),
      headers: {
        "Content-Type": "application/json",
      }
    })

    setTodos((prevState) => [...prevState, todo])
    console.log(todo)
    setTitle("")
    setTime("")
  }

  //função que deleta um item
  const handleDelete = async (id) => {
    await fetch(api + "/todos/" + id, {
      method: "DELETE",
    })
    setTodos((prevState) => prevState.filter((todo) => todo.id !== id))
  }


  // essa função permite assinalar as tarefas cumpridas
  const handleEdit = async(todo) => {
    todo.done = !todo.done

    const data = await fetch(api + "/todos", {
      method: "PUT",
      body: JSON.stringify(todo),
      headers: {
        "Content-Type": "application/json",
      }
    })
    setTodos((prevState) => prevState.map((t) => (t.id === data.id ? (t = data) : t))
    )
  }

  if(loading){
    return <p>Carregando...</p>
  }

  return (
    <div className="App">
      <div className="todo-header">
        <h1>Lista de Afazeres</h1>
      </div>
      <div className="form-todo">
        <h2>Insira sua próxima tarefa:</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-control">
            <label htmlFor="title">Qual tarefa quer inserir</label>
            <input 
            type="text" 
            name="title" 
            placeholder="Nome da Tarefa" 
            onChange={(e) => setTitle(e.target.value)} 
            value={title || ""} 
            required
            />
          </div>
          <div className="form-control">
            <label htmlFor="time">Qual a duração desta tarefa</label>
            <input 
            type="text" 
            name="time" 
            placeholder="Coloque a duração (em horas)" 
            onChange={(e) => setTime(e.target.value)} 
            value={time || ""} 
            required
            />
          </div>
          <input type="submit" value="Criar Tarefa" />
        </form>
      </div>
      <div className="list-todo">
        {todos.length === 0 && <p>Não há tarefas</p>}
        {todos.map((todo) => (
          <div className="todo" key={todo.id}>
            <h3 className={todo.done ? "todo-done" : ""}>{todo.title}</h3>
            <p>Duração: {todo.time}</p>
            <span onClick={() => handleEdit(todo)}>
              {!todo.done ? <BsBookmarkCheck /> : <BsBookmarkCheckFill />}
            </span>
            <BsTrash onClick={() => handleDelete(todo.id)} />
          </div>
        ))} 
      </div>
    </div>

  );
}

export default App;
