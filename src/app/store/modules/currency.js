import Axios from 'axios'
import {api} from '../../api'
export default {
    state: {
        currencies: null
    },
    getters: {
        CURRENCIES: state=>{
            return state.currencies
        }
    },
    mutations:{
        SET_CURRENCIES : (state,payload) => {
            state.currencies = payload
        },
    },
    actions: {
        GET_CURRENCIES : async (context,payload) => {
            let { data } = await Axios.get(api+'/getexchangerates');
            context.commit('SET_CURRENCIES',data)
        },
    },
};