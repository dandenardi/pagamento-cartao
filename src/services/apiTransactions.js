import axios from 'axios';


const apiTransactions = axios.create({
    baseURL: 'https://run.mocky.io/v3/533cd5d7-63d3-4488-bf8d-4bb8c751c989'
});

export default apiTransactions;