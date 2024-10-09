<template>
  <div class="channel-container">
    <h2>{{ channelName }}</h2>

    <div class="messages" ref="messagesContainer">
      <div v-for="message in messages" :key="message.id" class="message">
        <div class="message-header">
          <img :src="buildProfilePictureUrl(message.user.profile_picture)" alt="Profile Picture"
            class="profile-picture" />
          <strong>{{ message.user.username }}</strong>
          <span class="message-timestamp">{{ formatTimestamp(message.created_at) }}</span>
        </div>
        <p class="message-content" v-html="renderMarkdown(message.content)"></p>
      </div>
    </div>

    <form @submit.prevent="sendMessage">
      <input ref="messageInput" v-model="newMessage" placeholder="Escribe tu mensaje..." required class="message-input" />
      <button type="submit" class="send-button">Enviar</button>
    </form>
  </div>
</template>

<script>
import { io } from 'socket.io-client';
import MarkdownIt from 'markdown-it';

export default {
  data() {
    return {
      channelId: this.$route.params.id,
      channelName: '',
      messages: [],
      newMessage: '',
      socket: null,
      md: new MarkdownIt(),
    };
  },
  async created() {
    this.socket = io('http://192.168.0.10:6001');

    this.socket.on('connect', () => {
      console.log('Socket connected:', this.socket.id);
      this.socket.emit('join-channel', this.channelId);
    });

    this.socket.on('message-received', (message) => {
      console.log('Message received:', message);
      this.messages.push(message);
      this.scrollToBottom();
    });

    await this.loadMessages();
  },
  mounted() {
    this.$refs.messageInput.focus(); 
  },
  methods: {
    renderMarkdown(content) {
      return this.md.render(content);
    },

    async loadMessages() {
      try {
        const token = localStorage.getItem('auth_token');
        const response = await fetch(`/api/channels/${this.channelId}/messages`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Network response was not ok ' + response.statusText);
        }

        const data = await response.json();
        this.messages = data;
        this.scrollToBottom();
      } catch (error) {
        console.error('Error loading messages:', error);
      }
    },

    async sendMessage() {
      try {
        const token = localStorage.getItem('auth_token');
        const response = await fetch(`/api/channels/${this.channelId}/messages`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({ content: this.newMessage }),
        });

        if (!response.ok) {
          throw new Error('Network response was not ok ' + response.statusText);
        }

        const message = await response.json();
        console.log('Emitting message:', message);

        this.socket.emit('new-message', {
          content: message.content,
          channelId: this.channelId,
          user: message.user,
        });

        this.newMessage = '';
        this.$refs.messageInput.focus(); 
        this.scrollToBottom();
      } catch (error) {
        console.error('Error sending message:', error);
      }
    },

    buildProfilePictureUrl(picture) {
      const url = picture ? `http://192.168.0.10:90/storage/${picture}` : "/path/to/default/profile_picture.jpg";
      return url;
    },

    formatTimestamp(timestamp) {
      const date = new Date(timestamp);
      if (isNaN(date.getTime())) {
        return 'Invalid Date';
      }
      const options = {
        year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false
      };
      return date.toLocaleString('en-US', options).replace(',', '');
    },

    scrollToBottom() {
      this.$nextTick(() => {
        const container = this.$refs.messagesContainer;
        if (container) {
          container.scrollTop = container.scrollHeight;
        }
      });
    },

  },

  beforeDestroy() {
    if (this.socket) {
      this.socket.disconnect();
    }
  }
};
</script>

<style scoped>
.channel-container {
  padding: 1rem;
  background-color: #1e1e1e;
  color: #fff;
}

.messages {
  max-height: 700px;
  overflow-y: auto;
  margin-bottom: 1rem;
}

.message {
  margin: 0.5rem 0;
}

.message-header {
  display: flex;
  align-items: center;
}

.profile-picture {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  margin-right: 0.5rem;
}

.message-content {
  margin-top: 0.2rem;
}

.message-timestamp {
  font-size: 0.8rem;
  margin-left: 0.5rem;
}

form {
  display: flex;
}

.message-input {
  flex: 1;
  padding: 0.5rem;
  margin-right: 0.5rem;
  border: 1px solid #444;
  border-radius: 5px;
  background-color: #2a2a2a;
  color: #fff;
  transition: border-color 0.3s;
}

.message-input:focus {
  border-color: #007bff;
  outline: none;
}

.send-button {
  padding: 0.5rem 1rem;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.send-button:hover {
  background-color: #0056b3;
}

.messages::-webkit-scrollbar {
  width: 8px;
}

.messages::-webkit-scrollbar-thumb {
  background-color: #555;
  border-radius: 10px;
}

.messages::-webkit-scrollbar-thumb:hover {
  background-color: #777;
}
</style>