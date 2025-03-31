import {createSlice} from '@reduxjs/toolkit'
import {isEmpty, isNotEmpty} from "utils/helpers";

const USER_KEY = "loggedUser";
const DEFAULT_USER = { name: "", workspaceName: "", token: "", permissions: []};

const saveUserToStorage = (userObject) => {
    console.info(`Persisting user...  `)
    localStorage.setItem(USER_KEY, JSON.stringify(userObject));
}

export const loadUserFromStorage = () => {
    try {
        const storedAuthState = localStorage.getItem(USER_KEY);
        if (isEmpty(storedAuthState)) {
            return DEFAULT_USER;
        }
        return JSON.parse(localStorage.getItem(USER_KEY))
    } catch (e) {
        console.log(e)
        return DEFAULT_USER;
    }
}

export const getStoredUserToken = () => {

    const user = loadUserFromStorage();
    if (isNotEmpty(user)) {
        return user.token;
    } else {
        console.warn("User not found on locally")
    }
    return '';
}

export const getUserPermissions = () => {
    const user = loadUserFromStorage();
    if (isNotEmpty(user)) {
        console.info("User with permissions: ", JSON.stringify(user))
        return user.permissions ?? [];
    } else {
        console.warn("User not found on locally")
    }
    return [];
}

export const getUserName = () => {
    const user = loadUserFromStorage();
    if (isNotEmpty(user)) {
        return user.name;
    } else {
        console.warn("User not found on locally")
    }
    return 'nobody';
}

export const getUser = () => {
    return loadUserFromStorage();
}

export const authSlice = createSlice({
    name: "auth",
    initialState: loadUserFromStorage(),
    reducers: {

        setToken: (state, action) => {
            state.token = action.payload;
            saveUserToStorage(state)
        },

        setName: (state, action) => {
            state.name = action.payload;
            saveUserToStorage(state)
        },

        setWorkspaceName: (state, action) => {
            state.workspaceName = action.payload;
            saveUserToStorage(state)
        },

        setPermissions: (state, action) => {
            state.permissions = action.payload;
            saveUserToStorage(state)
        },

        clearSession: (state) => {
            console.log('Logging out');
            state.name = '';
            state.token = '';
            state.permissions = '';
            localStorage.clear();
        }
    }
})

export const {setToken} = authSlice.actions;
export const {setPermissions} = authSlice.actions;
export const {setName} = authSlice.actions;
export const {setWorkspaceName} = authSlice.actions;

export const {clearSession} = authSlice.actions;

export default authSlice.reducer;
