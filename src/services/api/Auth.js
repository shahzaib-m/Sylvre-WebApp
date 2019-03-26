import api from './api';

const login = async function(usernameOrEmail, password) {
    const response = await api.post('/auth/login', {
        usernameOrEmail: usernameOrEmail,
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