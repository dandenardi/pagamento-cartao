
import React from 'react';
import { useEffect, useState } from 'react';
import apiUsers from './services/apiUsers';


import './App.css';
import Modal from './components/Modal/Modal';
import useModal from './components/useModal';

function App() {

  const [users, setUsers] = useState([]);
  const {isShowing, toggle} = useModal();
  //const [showPayModal, setShowPayModal] = useState(false);
  const [detail, setDetail] = useState({
    username: '',
    id: 0,
    name: '',

  });
  

  useEffect (() => {

    async function loadUsers(){
      //usuarios carregados da baseURL
      const response = await apiUsers.get('');
      setUsers(response.data);
    }

    loadUsers();

  }, []);
  
 
  function toggleModal(user){
    setDetail({username: user.username, id: user.id, name: user.name, })
    
    return(detail);
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
              
              <button onClick={ () => toggleModal(user) }>Pagar</button> 
              
            </article>
          )
        })}
      </div>
      <Modal
        //abre o modal
        isShowing={isShowing}
        //permite fechar
        hide={toggle}
        //recebe os dados do usuario
        
      />
        {/* {showPayModal && (
          <Modal 
            content={detail}
            close={togglePayModal}
          >

          </Modal> 
        )}*/}

    </div>
  );
}

export default App;

