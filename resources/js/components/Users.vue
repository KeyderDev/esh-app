<template>
  <div class="user-list">
    <div v-for="user in users" :key="user.id" class="user-item">
      <img :src="`/storage/${user.profile_picture}`" alt="Profile Picture" class="profile-picture"/>
      <div class="user-detailss">
        <h3 class="username">{{ user.username }}</h3>
        <p class="description">{{ user.description || 'No description available' }}</p>
        <p class="creation-date">Joined: {{ formatDate(user.created_at) }}</p>
      </div>
      <div class="menu-container" @click="toggleMenu(user.id)">
        <span class="menu-icon">⋮</span>
        <div v-if="activeMenu === user.id" class="menu-dropdown">
          <button @click="deleteUser(user.id)">Delete</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      users: [],
      activeMenu: null
    };
  },
  mounted() {
    this.fetchUsers();
  },
  methods: {
    async fetchUsers() {
      try {
        const token = localStorage.getItem('auth_token');
        const response = await fetch('/api/users', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json'
          }
        });
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        this.users = await response.json();
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    },
    async deleteUser(userId) {
      if (!confirm('Are you sure you want to delete this user?')) {
        return;
      }
      try {
        const token = localStorage.getItem('auth_token');
        const response = await fetch(`/api/users/${userId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json'
          }
        });
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        this.users = this.users.filter(user => user.id !== userId);
        this.activeMenu = null; // Close the menu after deleting
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    },
    formatDate(dateString) {
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      return new Date(dateString).toLocaleDateString(undefined, options);
    },
    toggleMenu(userId) {
      this.activeMenu = this.activeMenu === userId ? null : userId;
    }
  }
};
</script>

<style scoped>
.user-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-width: 100%;
  margin: 0 auto;
  padding: 1rem;
}

.user-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  background-color: #2c2c2c;
  color: #f0f0f0;
  transition: background-color 0.3s, box-shadow 0.3s;
}

.user-item:hover {
  background-color: #3c3c3c;
  box-shadow: 0 6px 10px rgba(0, 0, 0, 0.2);
}

.profile-picture {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  margin-right: 1rem;
  border: 2px solid #666;
  object-fit: cover;
}

.user-detailss {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.username {
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0;
  color: #e0e0e0;
}

.description {
  margin: 0.5rem 0 0;
  color: #b0b0b0;
}

.creation-date {
  margin: 0.5rem 0 0;
  color: #a0a0a0;
  font-size: 0.9rem;
}

.menu-container {
  position: relative;
  cursor: pointer;
}

.menu-icon {
  font-size: 1.5rem;
  color: #e0e0e0;
}

.menu-dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  background-color: #3c3c3c;
  border-radius: 4px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  z-index: 1000;
}

.menu-dropdown button {
  padding: 0.5rem 1rem;
  width: 100%;
  border: none;
  background: none;
  color: #fff;
  cursor: pointer;
  text-align: left;
}

.menu-dropdown button:hover {
  background-color: #4c4c4c;
}
</style>
