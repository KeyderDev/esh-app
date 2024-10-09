<template>
  <div class="channel-container">
    <h2>{{ channelName }}</h2>

    <div class="messages" ref="messagesContainer">
      <div v-for="(group, index) in groupedMessages" :key="index" class="message-group">
        <div class="message-header">
          <img :src="buildProfilePictureUrl(group.user.profile_picture)" alt="Profile Picture"
            class="profile-picture" />
          <div class="user-info">
            <strong>{{ group.user.username }}</strong>
            <span class="message-timestamp">{{ formatTimestamp(group.timestamp) }}</span>
          </div>
        </div>
        <div class="message-content" v-for="(message, i) in group.messages" :key="i"
          v-html="renderMarkdown(message.content)"></div>
      </div>
    </div>

    <div class="input-container">
      <input ref="messageInput" v-model="newMessage" placeholder="Escribe tu mensaje..." required class="message-input"
        @keydown.enter="sendMessage" />
    </div>
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
      groupedMessages: [],
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
      this.groupMessages();
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
        this.groupMessages();
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

      const now = new Date();
      const isToday = date.getDate() === now.getDate() &&
        date.getMonth() === now.getMonth() &&
        date.getFullYear() === now.getFullYear();

      if (isToday) {
        return `hoy a las ${date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', hour12: false })}`;
      } else {
        const options = {
          year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false
        };
        return date.toLocaleString('es-ES', options).replace(',', '');
      }
    },

    scrollToBottom() {
      this.$nextTick(() => {
        const container = this.$refs.messagesContainer;
        if (container) {
          container.scrollTop = container.scrollHeight;
        }
      });
    },

    groupMessages() {
      this.groupedMessages = [];
      let currentGroup = null;
      let messageCount = 0;

      this.messages.forEach((message, index) => {
        const messageTime = new Date(message.created_at);
        const isNewGroup = !currentGroup || currentGroup.user.id !== message.user.id ||
          messageTime - new Date(currentGroup.timestamp) > 5 * 60 * 1000 || messageCount >= 5;

        if (isNewGroup) {
          if (currentGroup) {
            this.groupedMessages.push(currentGroup);
          }
          currentGroup = {
            user: message.user,
            timestamp: message.created_at,
            messages: [message]
          };
          messageCount = 1;
        } else {
          currentGroup.messages.push(message);
          messageCount++;
        }

        if (index === this.messages.length - 1 && currentGroup) {
          this.groupedMessages.push(currentGroup);
        }
      });
    }
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
  color: #fff;
}

.messages {
  max-height: 700px;
  overflow-y: auto;
  margin-bottom: 1rem;
}

.message-group {
  margin: 0;
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

.user-info {
  display: flex;
  align-items: center;
}

.message-content {
  margin-top: 0;
  margin-left: 2.5rem;
}

.message-timestamp {
  font-size: 0.8rem;
  margin-left: 0.5rem;
  color: #ccc;
}

form {
  display: flex;
}

.input-container {
  display: flex;
  width: 100%;
}

.message-input {
  flex: 1;
  padding: 0.5rem;
  border: 1px solid #444;
  border-radius: 5px;
  background-color: #2a2a2a;
  color: #fff;
  transition: border-color 0.3s;
  width: 100%;
}

.message-input:focus {
  border-color: #007bff;
  outline: none;
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
