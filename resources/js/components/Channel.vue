<template>
  <div class="channel-container">
    <h2>{{ channelName }}</h2>

    <div class="messages" ref="messagesContainer">
      <div v-for="(group, groupIndex) in groupedMessages" :key="groupIndex" class="message-group">
        <div class="message-header">
          <img :src="buildProfilePictureUrl(group.user.profile_picture)" alt="Profile Picture"
            class="profile-picture" />
          <div class="user-info">
            <strong>{{ group.user.username }}</strong>
            <span class="message-timestamp">{{ formatTimestamp(group.timestamp) }}</span>
          </div>
        </div>
        <div v-for="(message, messageIndex) in group.messages" :key="message.id || messageIndex"
          class="message-content-wrapper" @mouseover="showHoverMenu(groupIndex, messageIndex)"
          @mouseleave="hideHoverMenu">
          <div class="message-content" v-html="renderMarkdown(message.content)"></div>
          <div v-if="hoveredMessage === `${groupIndex}-${messageIndex}`" class="hover-menu">
            <button @click="replyToMessage(message)">Responder</button>
          </div>
        </div>
      </div>
    </div>

    <div class="input-container">
      <div v-if="replyingTo" class="reply-preview">
        Respondiendo a <strong>{{ replyingTo.user.username }}</strong>: "{{ replyingTo.content }}"
        <button @click="cancelReply">Cancelar</button>
      </div>
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
      hoveredMessage: null,
      replyingTo: null,
    };
  },
  async created() {
    this.socket = io(`${window.appUrl}:6001`);

    this.socket.on('connect', () => {
      console.log('Socket connected:', this.socket.id);
      this.socket.emit('join-channel', this.channelId);
    });

    this.socket.on('message-received', (message) => {
      console.log('Message received:', message);
      message.created_at = message.created_at || new Date().toISOString();
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
      const markdownContent = this.md.render(content);
      return this.convertLinksToHyperlinks(markdownContent);
    },

    convertLinksToHyperlinks(content) {
      const urlRegex = /(https?:\/\/[^\s]+)/g;
      return content.replace(urlRegex, (url) => {
        return `<a href="${url}" target="_blank" rel="noopener noreferrer">${url}</a>`;
      });
    },

    async loadMessages() {
      try {
        const token = localStorage.getItem('auth_token');
        const response = await fetch(`/api/channels/${this.channelId}/messages`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
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
        let content = this.newMessage.trim();
        let replyingToId = null;

        if (this.replyingTo && this.replyingTo.content) {
          content = `> ${this.replyingTo.content}\n\n${content}`;
          replyingToId = this.replyingTo.id;
        }

        if (content === '') {
          return;
        }

        const token = localStorage.getItem('auth_token');
        const response = await fetch(`/api/channels/${this.channelId}/messages`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ content: content, replyingTo: replyingToId }),
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
          created_at: message.created_at
        });


        this.newMessage = '';
        this.replyingTo = null;
        this.$refs.messageInput.focus();
        this.scrollToBottom();
      } catch (error) {
        console.error('Error sending message:', error);
      }
    },

    buildProfilePictureUrl(picture) {
      const url = picture
        ? `${window.appUrl}/storage/${picture}`
        : '/path/to/default/profile_picture.jpg';
      return url;
    },


    formatTimestamp(timestamp) {
      const date = new Date(timestamp);
      if (isNaN(date.getTime())) {
        return 'Invalid Date';
      }

      const now = new Date();
      const isToday =
        date.getDate() === now.getDate() &&
        date.getMonth() === now.getMonth() &&
        date.getFullYear() === now.getFullYear();

      const isYesterday =
        date.getDate() === now.getDate() - 1 &&
        date.getMonth() === now.getMonth() &&
        date.getFullYear() === now.getFullYear();

      if (isToday) {
        return `hoy a las ${date.toLocaleTimeString('es-ES', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        })}`;
      } else if (isYesterday) {
        return `ayer a las ${date.toLocaleTimeString('es-ES', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        })}`;
      } else {
        const options = {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
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
        const isNewGroup =
          !currentGroup ||
          currentGroup.user.id !== message.user.id ||
          messageTime - new Date(currentGroup.timestamp) > 5 * 60 * 1000 ||
          messageCount >= 5;

        if (isNewGroup) {
          if (currentGroup) {
            this.groupedMessages.push(currentGroup);
          }
          currentGroup = {
            user: message.user,
            timestamp: message.created_at,
            messages: [message],
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
    },

    showHoverMenu(groupIndex, messageIndex) {
      this.hoveredMessage = `${groupIndex}-${messageIndex}`;
    },

    hideHoverMenu() {
      this.hoveredMessage = null;
    },

    replyToMessage(message) {
      this.replyingTo = message;
      this.$refs.messageInput.focus();
    },

    cancelReply() {
      this.replyingTo = null;
    },
  },

  beforeUnmount() {
    if (this.socket) {
      this.socket.disconnect();
    }
  },
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

.message-content-wrapper {
  position: relative;
  margin-left: 2.5rem;
  padding: 0;
}

.message-content {
  margin: 0.25rem 0;
}

.message-timestamp {
  font-size: 0.8rem;
  margin-left: 0.5rem;
  color: #ccc;
}

.input-container {
  display: flex;
  flex-direction: column;
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

.hover-menu {
  position: absolute;
  top: 5px;
  right: 5px;
  background-color: #333;
  border: 1px solid #555;
  border-radius: 5px;
  padding: 0.3rem 0.5rem;
  color: #fff;
  font-size: 0.9rem;
  display: flex;
  gap: 5px;
}

.hover-menu button {
  background: none;
  border: none;
  color: #fff;
  cursor: pointer;
  padding: 0;
  font-size: 0.9rem;
}

.hover-menu button:hover {
  text-decoration: underline;
}

.reply-preview {
  margin-bottom: 0.5rem;
  background-color: #444;
  padding: 0.5rem;
  border-radius: 5px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.reply-preview button {
  background: none;
  border: none;
  color: #ff4d4d;
  cursor: pointer;
  font-size: 0.9rem;
}

.reply-preview button:hover {
  text-decoration: underline;
}
</style>
