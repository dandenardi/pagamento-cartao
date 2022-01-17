import React from 'react';
import { useState, useEffect } from 'react';
import './modal.css';

import apiTransactions from '../../services/apiTransactions';

let insertedValue = "";

function getLastDigits(){
   //gera os 4 ultimos digitos do cartao para uso no select
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

        //permanece verdadeira enquanto a API eh consultada
        async function loadTransfers(){
          //transacoes carregadas da BaseUrl
          const response = await apiTransactions.get('');
          setTransfers(response.data);
        }
    
        loadTransfers();
        //um erro no console indica vazamento de memoria. Como resolver??
    }, [transfers]);
    
    let cardsFrag = getLastDigits();
    
    function handleCardId(e){
        //salva em CardId o identificador do cartao, com base nos 4 ultimos digitos
        e.preventDefault();
        setCardId(e.target.value);
    }

    
    function validateValueField(e){
        //validacoes funcionam, porem o usuario so consegue colocar centavos mediante ponto. Virgula faz a funcao retornar NAN
        e.preventDefault();
        
        var valuePattern = /[0-9]/g; 
       
        if (!valuePattern.test(e.key)){
            //so aceita numeros, ponto e virgula
            //o ideal e que o usuario nao possa incluir pontos ou virgulas e que isso seja adicionado automaticamente
            alert('Apenas números são permitidos neste campo!');
            return false;

        }else{
            insertedValue += e.key;
            e.target.value = applyMask(insertedValue); 
        };
        
        
    }

    function applyMask(num){
        //let num ="";
        
        let value = "";
        //converte para string
        if (num.length === 0) {
            value = "";
            //impede que o valor inserido seja nulo
        } else if (num.length === 1) {
            value = "0,0" + num;
            //para um caracter inserido, concatena com 0,0
        } else if (num.length <= 2) {
            value = "0," + num;
            //para 2 caracteres, concatena com 0, (forma as casas decimais)
        }else if (num.length <= 5) { 
            value = num.substring(0, num.length-2) + ',' + num.substring(num.length-2, num.length);
        }else {        
            value = num.substring(0, num.length-5) + '.'  + num.substring(num.length-5, num.length-2) + ',' + num.substring(num.length-2, num.length);
            //para valores acima de 5 casas (chega ao primeiro milhar), inclui . (padrao brasileiro)
        };
        console.log(value);
        return value;
        
    };

    function cleanFields(e){
        //limpa os campos para proxima insercao
        e.preventDefault();
    
        e.target.value = '';
        insertedValue = '';    
    }    

    function handlePayment(e){
        //funcao responsavel por atribuir o state de valor para o pagamento (payValue)
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
                    
                    <input className="pay-value" placeholder='R$ 0,00' onKeyPress={validateValueField} onFocus={cleanFields} onChange={handlePayment}></input>

                    
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