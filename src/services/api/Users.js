import api from './api';

const registerUser = async function(username, password, email, fullName) {
    const response = await api.post('/users', {
        username: username,
        password: password,
        email: email,
        fullName: fullName
    });

    return response.data;
}

const getUser = async function(userId) {
    const response = await api.get(`/users/${userId}`);

    return response.data;
}

const updateUser = async function(userId, username=null, password=null, email=null, fullName=null) {
    await api.put(`/users/${userId}`, {
        username: username,
        password: password,
        email: email,
        fullName: fullName
    });

    return;
}

const deleteUser = async function(userId) {
    await api.delete(`/users/${userId}`);

    return;
}

export default {
    registerUser: registerUser,
    getUser: getUser,
    updateUser: updateUser,
    deleteUser: deleteUser
}