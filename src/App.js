
import React from 'react';
import { useEffect, useState } from 'react';
import apiUsers from './services/apiUsers';
import Modal from './components/ModalTransaction';


import './App.css';


function App() {

  const [users, setUsers] = useState([]);

  const [showPayModal, setShowPayModal] = useState(false);
  const [detail, setDetail] = useState();

  useEffect (() => {

    async function loadUsers(){
      //usuarios carregados da baseURL
      const response = await apiUsers.get('');
      setUsers(response.data);
    }

    loadUsers();

  }, []);

  function togglePayModal(user){
    //abre e fecha o modal
    
    setShowPayModal(!showPayModal);
    setDetail(user);
  }

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
              
              <button onClick={ () => togglePayModal(user) }>Pagar</button>
                
            </article>
          )
        })}
      </div>

        {showPayModal && (
          <Modal 
            content={detail}
            close={togglePayModal}
          >

          </Modal>
        )}

    </div>
  );
}

export default App;
