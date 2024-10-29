<template>
    <div>
        <h1>Permisos del Usuario</h1>
        <p>Usuario ID: {{ userId }}</p>

        <div v-if="allPermissions.length">
            <h2>Permisos Disponibles:</h2>
            <ul>
                <li v-for="permission in allPermissions" :key="permission.id">
                    <span>{{ permission.name }}</span>
                    <label>
                        <input type="checkbox" v-model="permission.assigned" @change="togglePermission(permission)" />
                        <span class="slider"></span>
                    </label>
                </li>
            </ul>
        </div>
        <div v-else>
            <p>No se encontraron permisos disponibles.</p>
        </div>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    data() {
        return {
            userId: this.$route.params.id,
            allPermissions: [],
        };
    },
    mounted() {
        this.fetchAllPermissions();
    },
    methods: {
        fetchAllPermissions() {
    axios.get(`/api/users/${this.userId}/all-permissions`)
        .then(response => {
            console.log(response.data); 
            this.allPermissions = response.data.map(permission => ({
                id: permission.id,
                name: permission.name,
                assigned: permission.assigned  
            }));
        })
        .catch(error => {
            console.error('Error fetching permissions:', error);
        });
},


        togglePermission(permission) {
            const action = permission.assigned ? 'remove' : 'add';

            if (action === 'add') {
                axios.post(`/api/users/${this.userId}/permissions`, { permission_id: permission.id })
                    .then(response => {
                        console.log(`Permission added successfully:`, response.data);
                        permission.assigned = true;  
                    })
                    .catch(error => {
                        console.error(`Error adding permission:`, error);
                    });
            } else {
                axios.delete(`/api/users/${this.userId}/permissions`, { data: { permission_id: permission.id } })
                    .then(response => {
                        console.log(`Permission removed successfully:`, response.data);
                        permission.assigned = false; 
                    })
                    .catch(error => {
                        console.error(`Error removing permission:`, error);
                    });
            }
        },




    },
};
</script>

<style scoped>
h1 {
    color: #fff;
}

ul {
    list-style-type: none;
    padding: 0;
}

li {
    background-color: #2e2e2e;
    color: #fff;
    margin: 5px 0;
    padding: 10px;
    border-radius: 5px;
}

label {
    display: inline-flex;
    align-items: center;
    cursor: pointer;
}

input[type="checkbox"] {
    display: none;
}

.slider {
    width: 34px;
    height: 20px;
    background-color: #ccc;
    border-radius: 34px;
    position: relative;
    transition: background-color 0.2s;
}

.slider:before {
    content: "";
    position: absolute;
    width: 16px;
    height: 16px;
    left: 2px;
    bottom: 2px;
    background-color: white;
    border-radius: 50%;
    transition: transform 0.2s;
}

input:checked+.slider {
    background-color: #66bb6a;
}

input:checked+.slider:before {
    transform: translateX(14px);
}
</style>