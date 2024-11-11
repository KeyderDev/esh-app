import { io } from 'socket.io-client';
import MarkdownIt from 'markdown-it';
import { Picker } from 'emoji-mart';
import DOMPurify from 'dompurify';

const apiKey = import.meta.env.VITE_GIPHY_API_KEY; 


export default {
  data() {
    return {
      channelId: this.$route.params.id,
      channelName: '',
      messages: [],
      groupedMessages: [],
      newMessage: '',
      socket: null,
      md: new MarkdownIt({
        breaks: true,
        html: true
      }),
      hoveredMessage: null,
      replyingTo: null,
      showEmojiPicker: false,
      imageFile: null,
      textToTranslate: '',
      translatedText: '',
      targetLanguage: 'en',
      isImageOpen: false,
      enlargedImageUrl: '',
      showGifPicker: false,
      selectedGif: null,
      gifs: [],
      searchQuery: '',
    };
  },
  async created() {
    this.initializeSocket();
    await this.loadMessages();
  },
  watch: {
    '$route.params.id': {
      immediate: true,
      handler(newChannelId) {
        if (this.socket) {
          this.socket.emit('leave-channel', this.channelId);
          this.socket.disconnect();
        }
        this.channelId = newChannelId;
        this.initializeSocket();
        this.loadMessages();
      },
    },
  },

  mounted() {
    this.$refs.messageInput.focus();
  },
  methods: {
    initializeSocket() {
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
    },
    openImage(image) {
      this.enlargedImageUrl = this.buildImageUrl(image);
      this.isImageOpen = true;
    },
    closeImage() {
      this.isImageOpen = false;
      this.enlargedImageUrl = '';
    },
    toggleTranslator() {
      this.showTranslator = !this.showTranslator;
    },
    async translateText() {
      if (!this.textToTranslate.trim()) {
        console.error('No hay texto para traducir');
        return;
      }

      try {
        const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(this.textToTranslate)}&langpair=es|${this.targetLanguage}`;
        const response = await fetch(url);
        const data = await response.json();

        if (data.responseStatus === 200) {
          this.translatedText = data.responseData.translatedText;
        } else {
          console.error('Error en la traducción:', data.responseDetails);
        }
      } catch (error) {
        console.error('Error al traducir el texto:', error);
      }
    },

    renderMessage(content, imageUrl = null, gifUrl = null) {
      if (gifUrl) {
        return this.renderGif(gifUrl);
      }
      if (content) {
        if (this.isGifUrl(content)) {
          return this.renderGif(content);
        } else {
          return this.renderMarkdown(content);
        }
      } else if (imageUrl) {
        return this.renderImage(imageUrl);
      } else {
        return null;
      }
    },

    renderMarkdown(content) {
      if (!content) return '';

      let markdownContent = this.md.render(content);
      markdownContent = markdownContent.replace(/<\/?p>/g, '');
      markdownContent = DOMPurify.sanitize(markdownContent);

      if (!/<a\s+href=".*">.*<\/a>/.test(markdownContent)) {
        markdownContent = this.convertLinksToHyperlinks(markdownContent);
      }

      return markdownContent;
    },

    renderImage(imageUrl) {
      return `<img src="${imageUrl}" alt="Imagen" class="message-image" />`;
    },

    renderGif(gifUrl) {
      return `<img src="${gifUrl}" alt="GIF" class="message-gif" />`;
    },

    triggerFileUpload() {
      this.$refs.fileInput.click();
      this.$refs.messageInput.focus();
    },

    async handleFileUpload(event) {
      const file = event.target.files[0];
      if (!file) return;

      const cleanedImageFile = await this.removeImageMetadata(file);

      this.imageFile = cleanedImageFile;

      console.log("Imagen adjuntada. Espera a que el usuario envíe el mensaje.");
    },

    async removeImageMetadata(file) {
      return new Promise((resolve, reject) => {
        const img = new Image();
        const reader = new FileReader();

        reader.onload = (e) => {
          img.src = e.target.result;

          img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;

            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);

            canvas.toBlob((blob) => {
              const cleanedFile = new File([blob], file.name, { type: 'image/jpeg' });
              resolve(cleanedFile);
            }, 'image/jpeg');
          };

          img.onerror = (error) => {
            reject(error);
          };
        };

        reader.onerror = (error) => {
          reject(error);
        };

        reader.readAsDataURL(file);
      });
    },

    handleKeydown(event) {
      if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        this.sendMessage();
      }
    },
    convertLinksToHyperlinks(content) {
      const urlRegex = /(?:(https?|ftp):\/\/|www\.)[^\s/$.?#].[^\s]*/g;

      return content.replace(urlRegex, (url) => {
        const href = url.startsWith('http') ? url : `http://${url}`;
        return `<a href="${href}" target="_blank" rel="noopener noreferrer">${url}</a>`;
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

        // Limpiar el contenido
        content = DOMPurify.sanitize(content);

        if (this.replyingTo && this.replyingTo.content) {
          content = `<div class="replying-to">Respondiendo a: ${this.replyingTo.content}</div>\n\n${content}`;
          replyingToId = this.replyingTo.id;
        }

        if (content === '' && !this.imageFile && !this.selectedGif) {
          return; 
        }

        const token = localStorage.getItem('auth_token');
        const formData = new FormData();

        if (content) {
          formData.append('content', content);
        }

        if (this.imageFile) {
          formData.append('image', this.imageFile, this.imageFile.name);
        }

        if (this.selectedGif) {
          console.log('GIF seleccionado:', this.selectedGif);
          formData.append('gif_url', this.selectedGif.images.original.url);
        }

        await this.sendMessageToServer(formData, token);
        this.finalizeMessage();
      } catch (error) {
        console.error('Error al enviar el mensaje:', error);
      }
    },


    finalizeMessage() {
      this.newMessage = '';
      this.replyingTo = null;
      this.imageFile = null;
      this.selectedGif = null;
      this.$refs.messageInput.focus();
      this.$nextTick(() => {
        this.scrollToBottom();
      });
    },

    async sendMessageToServer(formData, token) {
      const response = await fetch(`/api/channels/${this.channelId}/messages`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      console.log('Estado de la respuesta:', response.status);
      console.log('Tipo de contenido:', response.headers.get('Content-Type'));

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error de la respuesta:', errorText);
        throw new Error('La respuesta de la red no fue correcta: ' + response.statusText);
      }

      const message = await response.json();
      console.log('Emitiendo mensaje:', message);

      this.socket.emit('new-message', {
        content: message.content,
        channelId: this.channelId,
        user: message.user,
        created_at: message.created_at,
        image: message.image,
        gif_url: message.gif_url
      });
      console.log(message.gif_url);
    },

    buildProfilePictureUrl(picture) {
      const url = picture
        ? `${window.appUrl}/storage/${picture}`
        : '/path/to/default/profile_picture.jpg';
      return url;
    },

    buildImageUrl(image) {
      return `${window.appUrl}/storage/${image}`;
    },

    removeAttachedImage() {
      this.imageFile = null;
      console.log('Imagen adjunta eliminada');
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

    toggleEmojiPicker() {
      this.showEmojiPicker = !this.showEmojiPicker;
      console.log('Toggle Emoji Picker:', this.showEmojiPicker);
    },

    addEmoji(emoji) {
      this.newMessage += emoji.native;
      this.showEmojiPicker = false;
    },

    showUserDetails(user) {
      this.selectedUser = user;
      console.log("Selected User:", this.selectedUser);
    },

    async toggleGif() {
      this.showGifPicker = !this.showGifPicker;
      if (this.showGifPicker) {
        await this.fetchTrendingGifs();
      }
    },

    async fetchTrendingGifs() {
      this.gifs = [];
      try {
        const response = await fetch(`https://api.giphy.com/v1/gifs/trending?api_key=${apiKey}&limit=10`);
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        this.gifs = data.data;
      } catch (error) {
        console.error('Error al cargar GIFs:', error);
      }
    },

    async searchGifs() {
      this.gifs = [];
      try {
        const response = await fetch(`https://api.giphy.com/v1/gifs/search?api_key=${apiKey}&q=${this.searchQuery}&limit=10`);
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        this.gifs = data.data;
      } catch (error) {
        console.error('Error en la búsqueda de GIFs:', error);
      }
    },

    selectGif(gifUrl) {
      this.selectedGif = gifUrl;
      this.showGifPicker = false;
      this.$refs.messageInput.focus();
    },

    isGifUrl(url) {
      return url.endsWith('.gif') || url.includes('giphy');
    },

    async deleteMessage(channelId, messageId) {
      try {
        const token = localStorage.getItem('auth_token');
        const response = await fetch(`https://esh-app.ddns.net/api/channels/${channelId}/messages/${messageId}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Error al eliminar el mensaje');
        }

        this.messages = this.messages.filter(message => message.id !== messageId);
        this.groupMessages();
      } catch (error) {
        console.error('Error eliminando el mensaje:', error);
      }
    },
  },
};