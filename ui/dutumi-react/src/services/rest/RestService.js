import axiosClient from "./axios";
import {codeStartsWith, isNotEmpty} from "../../utils/helpers";
import {getStoredUserToken} from "../../state/auth/authStore";
import {logWarning} from "../../utils/GoodLogger";


const  removeLoggedUser = () => {
    console.log("401 Logging user off")
    localStorage.clear();
    window.location.replace(`${window.location.host}`)
}

const toErrorObject = (error) => {

    let errorObject = {
        errorMessage: '',
        errorHttpCode: '',
        respCode: '',
        extraInfo: ''
    };

    if (isNotEmpty(error.response)) {

        errorObject.errorHttpCode = error.response.status;

        if (isNotEmpty(error.response.data)) {
            const backendResp = error.response.data;
            errorObject.errorMessage = backendResp.message;
            errorObject.respCode = backendResp.respCode;
            errorObject.extraInfo = backendResp.respBody ? backendResp.respBody : '';
        } else {
            errorObject.errorMessage = "Request Failed";
            errorObject.respCode = "Unknown";
            errorObject.extraInfo = "";
        }

    } else {

        console.log(JSON.stringify(error))
        errorObject.errorMessage = error.message + '. Request failed! We don\'t know much about what happened. Make Sure the server is reachable and you are connected to the internet';
        errorObject.respCode = '';
        errorObject.extraInfo = '';
    }

    return errorObject;
}

const toErrorMessage = (msg, httpCode, respCode, extraInfo) => {

    return {
        errorMessage: msg,
        errorHttpCode: httpCode,
        respCode: respCode,
        extraInfo: extraInfo
    };

}

const toError = (message,code) => {

    return {
        errorMessage: message,
        errorHttpCode: '',
        respCode: code,
        extraInfo: ''
    };
}

export function getRequest(uri) {

    console.log(`${axiosClient.defaults.baseURL}${uri}`)

    //Todo: improve this
    const userToken = getStoredUserToken();
    axiosClient.defaults.headers = {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'Authorization': `Bearer ${userToken}`
    }
    //Todo: [end] improve this

    return new Promise((resolve, reject) => {

        return axiosClient.get(`${uri}`, `${JSON.stringify(axiosClient.defaults.headers)}`)
            .then(response => {

                if (response.data == null || response.data.respCode == null) {
                    resolve(response);
                    return;
                }

                const respCode = response.data.respCode;

                /// Catch server errors
                if (codeStartsWith(respCode, '5')) {
                    logWarning(`🌐server could not process the request code: ${response.data.respCode}  "${response.data.message}"`)
                    reject(toErrorMessage('Sorry, We failed to process the request', 555, 5555, 'Please contact us for more assistance'))
                    return;
                }

                /// Handle unauthenticated
                if (respCode === 4001) {
                    logWarning(`🌐endpoint required authentication ${response.data.respCode}  ${response.data.message}`)
                    removeLoggedUser();
                    reject(toErrorMessage('Sorry, session expired', 444, 4444, 'Please contact us for more assistance'))
                    return;
                }

                resolve(response);
            }).catch(error => {

                const customErrorObject = toErrorObject(error);
                if(customErrorObject.errorHttpCode===401 || error.response?.status===401){
                    removeLoggedUser();
                }
                reject(customErrorObject);
            });
    });

}

export function postRequest(uri, payload) {

    console.log(`${axiosClient.defaults.baseURL}${uri} ${JSON.stringify(payload)}`)

    //Todo: improve this
    const userToken = getStoredUserToken();
    axiosClient.defaults.headers = {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'Authorization': `Bearer ${userToken}`
    }
    //Todo: [end] improve this

    return new Promise((resolve, reject) => {
        axiosClient.post(`${uri}`, payload)
            .then(response => {

                if (response.data == null || response.data.respCode == null) {
                    resolve(response);
                    return;
                }

                const respCode = response.data.respCode;

                /// Catch server errors
                if (codeStartsWith(respCode, '5')) {
                    logWarning(`🌐server could not process the request code: ${response.data.respCode}  "${response.data.message}"`)
                    reject(toErrorMessage('Sorry, We failed to process the request', 555, 5555, 'Please contact us for more assistance'))
                    return;
                }

                /// Handle unauthenticated
                if (respCode === 4001) {
                    logWarning(`🌐endpoint required authentication ${response.data.respCode}  ${response.data.message}`)
                    removeLoggedUser();
                    reject(toErrorMessage('Sorry, session expired', 444, 4444, 'Please contact us for more assistance'))
                    return;
                }


                resolve(response);

            }).catch(error => {

            const customErrorObject = toErrorObject(error);
            if(customErrorObject.errorHttpCode===401 || error.response.status===401){
                removeLoggedUser();
            }
            reject(customErrorObject);

        });
    });

}

export function postMultipart(uri, payload) {

    console.log(`${axiosClient.defaults.baseURL}${uri}`)

    //Todo: improve this
    const userToken = getStoredUserToken();
    axiosClient.defaults.headers = {
        'Content-Type': 'multipart/form-data',
        Accept: 'application/json',
        'Authorization': `Bearer ${userToken}`
    }
    //Todo: [end] improve this

    return new Promise((resolve, reject) => {
        axiosClient.post(`${uri}`, payload)
            .then(response => {

                if (response.data == null || response.data.respCode == null) {
                    resolve(response);
                    return;
                }

                const respCode = response.data.respCode;

                /// Catch server errors
                if (codeStartsWith(respCode, '5')) {
                    logWarning(`🌐server could not process the request code: ${response.data.respCode}  "${response.data.message}"`)
                    reject(toErrorMessage('Sorry, We failed to process the request', 555, 5555, 'Please contact us for more assistance'))
                    return;
                }

                /// Handle unauthenticated
                if (respCode === 4001) {
                    logWarning(`🌐endpoint required authentication ${response.data.respCode}  ${response.data.message}`)
                    removeLoggedUser();
                    reject(toErrorMessage('Sorry, session expired', 444, 4444, 'Please contact us for more assistance'))
                    return;
                }

                resolve(response);

            }).catch(error => {

            const customErrorObject = toErrorObject(error);
            if(customErrorObject.errorHttpCode===401 || error.response.status===401){
                removeLoggedUser();
            }
            reject(customErrorObject);

        });
    });

}

export function patchRequest(uri, payload) {
    return axiosClient.patch(`${uri}`, payload).then(response => response);
}

export function deleteRequest(uri) {
    return axiosClient.delete(`${uri}`).then(response => response);
}
