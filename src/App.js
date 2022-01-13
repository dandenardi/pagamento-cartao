
import React from 'react';
import { useEffect, useState } from 'react';
import apiUsers from './services/apiUsers';

import ModalTransaction from './components/ModalTransaction';

import './App.css';


function App() {

  const [users, setUsers] = useState([]);
  const [showPostModal, setShowPostModal] = useState(false);
  //conteudo do usuario clicado

  const [detail, setDetail] = useState();
  


  useEffect (() => {

    async function loadUsers(){
      //usuarios carregados da baseURL
      const response = await apiUsers.get('');
      setUsers(response.data);
    }

    loadUsers();

  }, []);
  
 
  function togglePostModal(user){
    setShowPostModal(!showPostModal) //se falso muda para verdadeiro e vice-versa
    setDetail(user);
  }

  return (
    <div className="App">
      <h1>Lista de Usuários</h1>
      <div className="content">
        {users.map((user) => {
          //renderiza todos os usuarios contidos na API
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
              
              <button onClick={ () => togglePostModal(user) }>Pagar</button> 
              
            </article>
          )
        })}
      </div>
       {showPostModal && (<ModalTransaction
          conteudo={detail}
          close={togglePostModal}
        />)}
    </div>
  );
}

export default App;

