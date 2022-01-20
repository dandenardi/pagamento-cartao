import React from 'react';
import { useState } from 'react';
import './modal.css';

import apiTransactions from '../../services/apiTransactions';

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



function getLastDigits(){
   //gera os 4 ultimos digitos do cartao para uso no select
    
    let lstDig = [];
    let tmpCard = '';
    cards.forEach(card => {

        tmpCard = (card.card_number).substr(-4);
        lstDig.push(tmpCard.substring(-4));

    });
    return(lstDig);    
    
};


export default function ModalTransaction({ conteudo, close }){
    
    
    const [payValue, setPayValue] =  useState('');
    const [cardId, setCardId] = useState('card0');
    const [situation, setSituation] = useState();
    const [transaction, setTransaction] = useState(true);

    const [transfers, setTransfers] = useState([]);


    let cardsFrag = getLastDigits();
    
    function handleCardId(e){
        //salva em CardId o identificador do cartao, com base nos 4 ultimos digitos
        e.preventDefault();
        setCardId(e.target.value);
    }


    function handlePayment(e){
        //funcao responsavel por atribuir o state de valor para o pagamento (payValue)
        e.preventDefault();
         
        //impede que seja incluido qualquer outro valor alem de numeros
        setPayValue(e.target.value.split(/\D/).join(''))

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
            informSituation(true)
            return true;
        }
    }

    async function handleTransfer(amount, personId){
        //recebe o numero do cartao (valido), o valor a transferir e o nome do destinatario e envia os dados para a API
        
        let card = {
            card_number: '1111111111111111',
            cvv: 789,
            expiry_date: '01/18',
        };

        const response = apiTransactions.get('');
        setTransfers(response.data);
        console.log(transfers);

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
            //caso ocorram problemas na comunicacao com API, a transacao nao ocorre e o modal de erro eh exibido
            setSituation(false);
            informSituation(situation);
            console.log(error);
    
        });
        
    }

    function transactionForm(){
        
        
        //funcao basica para envio de dados de transferencia (a primeira a ser exibida no modal)
        if(transaction){
            return(
                
                <div className='ongoing-transfer'>
                    <div className='header'>
                        <h2>Pagamento para <span className='username'>{conteudo.name}</span></h2>
                    </div>    
                <div className='payment-form'>
                    
                    <input value={payValue || ''} pattern="^[0-9]*$" placeholder="R$ 0,00"  className="pay-value" onChange={handlePayment}></input>

                    
                    <select className='card-selector' onChange={handleCardId}>
                        <option className='card-selector' value="card0">Cartão com final {cardsFrag[0]}</option>
                        <option className='card-selector' value="card1">Cartão com final {cardsFrag[1]}</option>
    
                    </select>
                    <button disabled={!payValue} onClick={checkTransferData}>Pagar</button>
                    
                  
                </div>
                    
            </div>
            )
        }else{
            return(null)
        }
                
    }

    function informSituation(status){
        //funcao responsavel por exibir o modal correspondente, apos verificacao
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