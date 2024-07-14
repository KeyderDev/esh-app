<template>
    <form @submit.prevent="register">
        <input v-model="username" placeholder="Username" required />
        <input v-model="password" placeholder="Password" type="password" required />
        <input v-model="password_confirmation" placeholder="Confirm Password" type="password" required />
        <button type="submit">Register</button>
    </form>
</template>

<script>
import axios from 'axios';

export default {
    data() {
        return {
            username: '',
            password: '',
            password_confirmation: '',
        };
    },
    methods: {
        async register() {
            console.log('Register method called');
            try {
                const response = await axios.post('/api/register', {
                    username: this.username,
                    password: this.password,
                    password_confirmation: this.password_confirmation,
                });
                console.log('Response received:', response);
                alert(response.data.message);
            } catch (error) {
                if (error.response) {
                    // La solicitud fue hecha y el servidor respondió con un código de estado
                    // que cae fuera del rango de 2xx
                    console.error('Error response:', error.response);
                    alert(error.response.data.message || 'Registration failed.');
                } else if (error.request) {
                    // La solicitud fue hecha pero no se recibió respuesta
                    console.error('Error request:', error.request);
                    alert('No response from server.');
                } else {
                    // Algo sucedió en configurar la solicitud que provocó un error
                    console.error('Error', error.message);
                    alert('Error in registration process.');
                }
                console.error('Error config:', error.config);
            }
        },
    },
};
</script>
