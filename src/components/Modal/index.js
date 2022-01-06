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

    let insertedValue = "";
    function validateValueField(e){
        //validacoes funcionam, porem o usuario so consegue colocar centavos mediante ponto. Virgula faz a funcao retornar NAN
        e.preventDefault();
        
        var valuePattern = /[0-9]/g; 
    
        if (valuePattern.test(e.key)){
            //so aceita numeros, ponto e virgula
            //o ideal e que o usuario nao possa incluir pontos ou virgulas e que isso seja adicionado automaticamente
            console.log(e.key);
            insertedValue += e.key;
            e.target.value = applyMask(insertedValue); 

        }else{
            alert('Apenas números são permitidos neste campo!');
            return false;
        };
        
        
    }

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

    function handlePayment(e){

        e.preventDefault();
        if(e.target.value != 0){
            setPayValue(e.target.value);
        }else{
            alert('O campo valor deve ser numérico e não pode ser vazio');
        }
        return payValue;
    }
    
    function handleCardNumber(e){
        e.preventDefault();
        setCardNumber(e.target.value);
        return cardNumber;
    }

    function handlePayment(e){
        
        e.preventDefault();
        console.log('handlePayment funcionando!')
        if (cardNumber == 'card0'){
            console.log('ModalSuccess()');
        }else{
            console.log('ModalFailure()');
        }
    }

    return(
        
        
        <div className="modal">
            <div className="container">
                <button className="close" onClick= { () => close } >X</button>
                <div>
                    
                    <h2>Pagamento para {content.content.name}</h2>
                    <label>Quanto será enviado?</label>
                    <input className="pay-value" onKeyUp={handleBackspace} onFocus={cleanFields} onKeyPress={validateValueField} onChange={handlePayment}></input>
                    <select value={cardNumber} onChange={handleCardNumber}>
                        <option value="card0">{cards[0]}</option>
                        <option value="card1">{cards[1]}</option>

                    </select>
                    <button onClick={handlePayment}>Pagar</button>
                
                    

                </div>

            </div>

        </div>
    )
}

