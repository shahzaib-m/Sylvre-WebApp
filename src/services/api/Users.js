import api from './api';

const registerUser = async function(username, password, email, fullName) {
    const response = await api.auth.post('/users', {
        username: username,
        password: password,
        email: email,
        fullName: fullName
    });

    return response.data;
}

const getUserById = async function(userId) {
    const response = await api.auth.get(`/users/${userId}`);

    return response.data;
}

const updateUser = async function(userId, username=null, password=null, email=null, fullName=null) {
    await api.auth.put(`/users/${userId}`, {
        username: username,
        password: password,
        email: email,
        fullName: fullName
    });

    return;
}

const deleteUser = async function(userId) {
    await api.auth.delete(`/users/${userId}`);

    return;
}

const getUserByIdentity = async function() {
    const response = await api.auth.get('/users/identity');

    return response.data;
}

export default {
    registerUser: registerUser,
    getUserById: getUserById,
    updateUser: updateUser,
    deleteUser: deleteUser,
    getUserByIdentity: getUserByIdentity
}