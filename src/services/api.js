import axios from 'axios';

//usuarios
//https://www.mocky.io/v2/5d531c4f2e0000620081ddce

//transacao
//https://run.mocky.io/v3/533cd5d7-63d3-4488-bf8d-4bb8c751c989

const api = axios.create({
    baseURL: 'https://www.mocky.io/v2/5d531c4f2e0000620081ddce'
});

export default api;