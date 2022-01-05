
import React from 'react';
import { useEffect, useState } from 'react';
import api from './services/api';


import './App.css';


function App() {

  const [users, setUsers] = useState([]);

  useEffect (() => {

    async function loadUsers(){
      //usuarios carregados da baseURL
      const response = await api.get('');
      setUsers(response.data);
    }

    loadUsers();

  }, []);

  return (
    <div className="App">
      <h1>Lista de Usuários</h1>
      <div className="content">
        {users.map((user) => {
          return(
            <article className="users" key={user.id}>
              <div className="picture">
                <img src={user.img} alt="imagem de usuário"></img>
              </div>
              <div className='user-info'>
                <div className='name'>
                  Nome: {user.name}
                </div>
                <div className='user-id'>
                  Id: {user.id}
                  Username: {user.username}
                </div>
              </div>
              
              <button>Pagar</button>
                
            </article>
          )
        })}
      </div>
    </div>
  );
}

export default App;
