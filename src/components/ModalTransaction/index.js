import React from 'react';
import { useState, useEffect } from 'react';
import './modal.css';

import apiTransactions from '../../services/apiTransactions';
import ModalReceipt from '../ModalReceipt';


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


export default function ModalTransaction(content, close){
    
    
    const [payValue, setPayValue] =  useState(0);
    const [cardId, setCardId] = useState('card0');
    const [situation, setSituation] = useState(undefined);
    const [showPayModal, setShowPayModal] = useState();

    const [transfers, setTransfers] = useState([]);

    useEffect (() => {

        async function loadTransfers(){
          //transacoes carregadas da BaseUrl
          const response = await apiTransactions.get('');
          setTransfers(response.data);
        }
    
        loadTransfers();
    
    }, []);
    let cardsFrag = getLastDigits();
    
    function togglePayModal(){
        //abre e fecha o modal
        setShowPayModal(!showPayModal);
    }

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
        console.log(cardId);
        let userName = content.content.name;
        
        
        if(cardId!=='card0'){
            //Modal de erro no pagamento
            setSituation(false);
            ModalReceipt(situation);
            return false;
        }else{
            handleTransfer(payValue, userName);
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
            setSituation(true);
            ModalReceipt(situation);
            
            
        })
        .catch(function (error) {
            console.log(error);
    
        });
        
        
    }


    return(
        
        
        <div className="modal">
            <div className="container">
                <button className="close" onClick= { () => close } >X</button>
                <div className='transferencia-em-andamento'>
                    
                    <h2>Pagamento para {content.content.name}</h2>
                    <label>Quanto será enviado?</label>
                    <input className="pay-value" type='number' onChange={handlePayment}></input>
                    <select onChange={handleCardId}>
                        <option value="card0">{cardsFrag[0]}</option>
                        <option value="card1">{cardsFrag[1]}</option>

                    </select>
                    <button onClick={checkTransferData}>Pagar</button>
                
                    

                </div>

            </div>

        </div>
    )
}

