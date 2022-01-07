import { useState } from 'react';
import '../Modal/modal.css';

function getLastDigits(){
    let cards = [
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

    for (let card in cardsNumbers){
        cardPart = cardsNumbers[card].substring((cardsNumbers[card].length - 4), (cardsNumbers[card].length));
        cardsLastDigits.push(cardPart);
        
    }

    
    return(cardsLastDigits);
};



export default function Modal(content, close){
    
    
    const [payValue, setPayValue] =  useState(0);
    const [cardNumber, setCardNumber] = useState('');


    let cards = getLastDigits(); 

    
    let insertedValue = "";
    function handleValueInput(e){

        let payAmount;
        e.preventDefault();
        console.log(typeof (e.key));
        var valuePattern = /[0-9]/g; 
        
        if (valuePattern.test(e.key)){
            //so aceita numeros, ponto e virgula
            insertedValue += e.key;
            e.target.value = applyMask(insertedValue); 
            payAmount = e.target.value;

        }else{
            alert('Apenas números são permitidos neste campo!');
            return false;
        };
        console.log(payAmount);
        return payAmount;
        
    }
    
    function handleCardNumber(e){
       
        e.preventDefault();
        setCardNumber(e.target.value);
        
        return cardNumber;
    }

    function handlePayment(e){
        
        e.preventDefault();
        setPayValue(e.target.value);

    }

    // Mascará para número
    function applyMask(num){
        //let num ="";
        
        let value = "";
        //converte para string
        if (num.length == 0) {
            value = "";
            //impede que o valor inserido seja nulo
        } else if (num.length == 1) {
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
    
    function handleBackspace(e){
        //limpa os campos para proxima insercao
        
        e.preventDefault();
        if (e.key == 'Backspace'){
            e.target.value = '';
            insertedValue = '';
        
        }
    }

    function checkTransferData(){
        //verifica os dados do cartao, pagamento e destinatario, exibindo o modal correspondente
        let userName = content.content.name;
        console.log('Checking transfer information!');
        
        if(cardNumber!=='card[0]' || !userName || !(payValue)){
            //Modal de erro no pagamento
            return false;
        }else{
            //Modal de pagamento concluido com sucesso
            handleTransfer(cardNumber, payValue, userName);
            return true;
        }
    }
    function handleTransfer(card, amount, person){
        //recebe o numero do cartao (valido), o valor a transferir e o nome do destinatario e envia os dados para a API
    
        
    }

    return(
        
        
        <div className="modal">
            <div className="container">
                <button className="close" onClick= { () => close } >X</button>
                <div>
                    
                    <h2>Pagamento para {content.content.name}</h2>
                    <label>Quanto será enviado?</label>
                    <input className="pay-value" onKeyUp={handleBackspace} onFocus={cleanFields} onKeyPress={handleValueInput} onChange={handlePayment}></input>
                    <select value={cardNumber} onChange={handleCardNumber}>
                        <option value="card0">{cards[0]}</option>
                        <option value="card1">{cards[1]}</option>

                    </select>
                    <button onClick={checkTransferData}>Pagar</button>
                
                    

                </div>

            </div>

        </div>
    )
}

