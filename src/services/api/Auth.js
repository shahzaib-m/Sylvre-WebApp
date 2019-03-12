import api from './api';

const login = async function(username, password) {
    const response = await api.post('/auth/login', {
        username: username,
        password: password
    }, {
        params: { strategy: 'cookie' }
    });

    return response.data;
}

const refresh = async function() {
    const response = await api.post('/auth/refresh', {}, {
        params: { strategy: 'cookie' }
    });

    return response.data;
}

const logout = async function() {
    await api.delete('/auth/logout');
}


export default {
    login: login,
    refresh: refresh,
    logout: logout
}