import axios from 'axios';
import { getStoredUserToken } from "state/auth/authStore";
import {isDevEnvironment} from "utils/helpers";

const axiosClient = axios.create();


axiosClient.defaults.baseURL = isDevEnvironment() ? process.env.REACT_APP_DEV_HOST : process.env.REACT_APP_PROD_HOST;

console.log("Using api endpoint....",axiosClient.defaults.baseURL)
console.log()
console.log()


const userToken = getStoredUserToken();


axiosClient.defaults.headers = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    'Authorization': `Bearer ${userToken}`,
    'Access-Control-Allow-Origin': '*'
};

//All request will wait 15 seconds before timeout
axiosClient.defaults.timeout = 15000;

export default axiosClient;
