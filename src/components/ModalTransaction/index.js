import React from 'react';
import { useState, useEffect } from 'react';
import './modal.css';

import apiTransactions from '../../services/apiTransactions';


function getLastDigits(){
   
    const cards = [
        // valid card
        {
          card_number: '1111111111111111',
          cvv: 789,
          expiry_date: '01/18',
        },
        // invalid card
        {
          card_number: '4111111111111234',
          cvv: 123,
          expiry_date: '01/20',
        },
    ];

    let cardsNumbers = [];
    let cardsLastDigits = [];
    let cardPart = '';
    
    Object.keys(cards).forEach(function(item){
        cardsNumbers.push(cards[item].card_number);
 
    });
    //captura os 4 ultimos digitos dos cartoes
    for (let item in cardsNumbers){
        cardPart = cardsNumbers[item].substring((cardsNumbers[item].length - 4), (cardsNumbers[item].length));
        cardsLastDigits.push(cardPart);
        
    }

    
    return(cardsLastDigits);
};


export default function ModalTransaction({ conteudo, close }){
    
    
    const [payValue, setPayValue] =  useState(0);
    const [cardId, setCardId] = useState('card0');
    const [situation, setSituation] = useState();
    const [transaction, setTransaction] = useState(true);

    const [transfers, setTransfers] = useState([]);

    useEffect (() => {

        async function loadTransfers(){
          //transacoes carregadas da BaseUrl
          const response = await apiTransactions.get('');
          setTransfers(response.data);
        }
    
        loadTransfers();
    
    }, [transfers]);
    let cardsFrag = getLastDigits();
    

    function handleCardId(e){
        e.preventDefault();
        setCardId(e.target.value);
    }

    function handlePayment(e){
        
        e.preventDefault();
        
        setPayValue(e.target.value);
        return payValue;
    }


    function checkTransferData(){
        //verifica os dados do cartao, pagamento e destinatario, exibindo o modal correspondente
        setTransaction(!transaction);
        console.log(conteudo.name);
        
        if(cardId!=='card0'){
            //Modal de erro no pagamento
            setSituation(false);
            informSituation(situation);
            return false;
        }else{
            handleTransfer(payValue, conteudo.name);
            return true;
        }
    }
    function handleTransfer(amount, personId){
        //recebe o numero do cartao (valido), o valor a transferir e o nome do destinatario e envia os dados para a API
        console.log('Carregado handleTransfer')
        
        let card = {
            card_number: '1111111111111111',
            cvv: 789,
            expiry_date: '01/18',
        };

        apiTransactions.post('/transaction', {
            
            //informacao do cartao

            card_number: card.cardNum,
            cvv: card.cvv,
            expiry_date: card.expiry_date,

            //detinatario
            destination_user_id: personId,

            //valor
            value: amount,
        
        })
        .then(function (response) {
            //Modal de sucesso!
            console.log(response);
            setSituation(true);
            informSituation(situation);
            
        })
        .catch(function (error) {
            console.log(error);
    
        });
        
    }

    function transactionForm(){
        
        if(transaction){
            return(
                <div className='ongoing-transfer'>
                    <div className='header'>
                        <h2>Pagamento para <span className='username'>{conteudo.name}</span></h2>
                    </div>    
                <div className='payment-form'>
                    
                    <input className="pay-value" type='number' placeholder='R$ 0,00' onChange={handlePayment}></input>

                    
                    <select className='card-selector' onChange={handleCardId}>
                        <option value="card0">Cartão com final {cardsFrag[0]}</option>
                        <option value="card1">Cartão com final {cardsFrag[1]}</option>
    
                    </select>
                    <button onClick={checkTransferData}>Pagar</button>
        
                      
                     
                    
  
                  
                </div>
                    
            </div>
            )
        }else{
            return(null)
        }
        
                
    }

    function informSituation(status){
        
        
        if (status === true){
            
            return(
                <div className='transaction-ok'>
                    
                    <div className='header'>
                        <h2>Recibo de pagamento</h2>
                    </div>    
                    <p className='payment-feedback'>
                        O pagamento foi concluído com sucesso
                    </p> 
            
                    

                </div>
            )
        }
        if (status === false){
                
            return(
            
                <div className='transaction-fail'>
                    <div className='header'>
                        <h2>Recibo de pagamento</h2>
                    </div>                         
                    <div>    
                        <p className='payment-feedback'>
                            O pagamento <strong>não</strong> foi concluído com sucesso
                        </p> 

                    </div>
                </div>
            )   
        }
    }

    return(
        
        <div className="modal">
            <div className="container">
                <button className="close" onClick= { close } >X</button>
                
                {transactionForm()}
                {informSituation(situation)}
                
            </div>
        </div>     
                
    )
}

