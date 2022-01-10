import React from 'react';
import { useState } from 'react';
import './modal.css';

export default function ModalReceipt(stats){
    console.log('Modal Receipt carregado');
   /*  const [showReceiptModal, setShowReceiptModal] = useState(); */

   /*  function toggleReceiptModal(){
        //abre e fecha o modal
        setShowReceiptModal(!showReceiptModal);
    } */

    function isSuccess(){
        <div className='success'>
            
            <h2>Recibo do pagamento</h2>
            <p>
                O pagamento foi concluido com sucesso
            </p> 

        </div>
        console.log('Success carregado!');
        return(true);        
    }

    function hasError(){
        <div className='error'>
            
            <h2>Recibo do pagamento</h2>
            <p>
                O pagamento<strong> não </strong>foi concluido com sucesso
            </p> 

        </div>
        console.log('Erro carregado!');
        return(false);        
    }
    
    return(
        
        

        <div className="modal">
            <div className="container">
                <button className="close" onClick= { console.log('clicou em fechar') } >X</button>
                

                <div className='status'>
                    {stats
                        ? isSuccess
                        : hasError
                    }
                    
                </div>

            </div>

        </div>
    )

}
    

