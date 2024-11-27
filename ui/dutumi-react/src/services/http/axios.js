import axios from 'axios';
import {getStoredUserToken} from "state/auth/authStore";
import {isDevEnvironment, isEmpty} from "utils/helpers";

const axiosClient = axios.create();


axiosClient.defaults.baseURL = isDevEnvironment() ? process.env.REACT_APP_DEV_HOST : process.env.REACT_APP_PROD_HOST;

if (isEmpty(axiosClient.defaults.baseURL)) {
    console.error("Missing .env apis configs ....")
    console.error("Missing REACT_APP_DEV_HOST")
    console.error("Missing REACT_APP_PROD_HOST")
    console.warn("Please specify REACT_APP_DEV_HOST & REACT_APP_PROD_HOST on .env file")
} else {
    console.log("Selected api endpoint from .env....", axiosClient.defaults.baseURL)
}


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
