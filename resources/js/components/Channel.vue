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

          <div v-if="message.image">
            <img :src="buildImageUrl(message.image)" alt="Message Image" class="message-image"
              @click="openImage(message.image)" />
          </div>

          <div v-if="hoveredMessage === `${groupIndex}-${messageIndex}`" class="hover-menu">
            <i @click="replyToMessage(message)" class="fa-solid fa-reply"></i>
            <i @click="deleteMessage(channelId, message.id)" class="fa-solid fa-trash" style="color:red;"></i>
          </div>
        </div>
      </div>
    </div>

    <div v-if="isImageOpen" class="image-modal" @click="closeImage">
      <img :src="enlargedImageUrl" alt="Imagen ampliada" class="enlarged-image" />
    </div>

    <div v-if="showTranslator" class="translator-box">
      <button @click="closeUserDetails" class="close-button" aria-label="Cerrar detalles del usuario">&times;</button>
      <textarea v-model="textToTranslate" placeholder="Escribe texto para traducir..."></textarea>
      <select v-model="targetLanguage">
        <option value="en">Inglés</option>
        <option value="es">Español</option>
        <option value="fr">Francés</option>
      </select>
      <button @click="translateText">Traducir</button>
      <div v-if="translatedText">
        <h4>Traducción:</h4>
        <p>{{ translatedText }}</p>
      </div>
    </div>
    <div class="input-container">
      <div v-if="replyingTo" class="reply-preview">
        Respondiendo a <strong>{{ replyingTo.user.username }}</strong>: "{{ replyingTo.content }}"
        <button @click="cancelReply">Cancelar</button>
      </div>

      <div v-if="imageFile" class="image-preview">
        <p>Imagen adjuntada: {{ imageFile.name }}</p>
        <button @click="removeAttachedImage">Eliminar</button>
      </div>

      <button @click="triggerFileUpload" class="upload-button">
        <i class="fa-solid fa-paperclip"></i>
      </button>

      <button @click="toggleTranslator" class="translate-button">
        <i class="fa-solid fa-language"></i>
      </button>

      <input type="file" ref="fileInput" @change="handleFileUpload" style="display: none;" />

      <textarea ref="messageInput" v-model="newMessage" placeholder="Escribe tu mensaje..." required
        class="message-input" @keydown="handleKeydown"></textarea>

      <button @click="toggleEmojiPicker" class="emoji-button">😀</button>
      <Picker v-if="showEmojiPicker" class="emoji-picker" @select="addEmoji" />
    </div>
  </div>
</template>

<script src="./Channel.js"></script>

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
  align-items: center;
  width: 100%;
  background-color: #2a2a2a;
  border-radius: 5px;
  height: auto;
  padding: 0.2rem;
  position: relative;
}

.message-input {
  flex: 1;
  padding: 0.2rem 0.5rem;
  border: 1px solid transparent;
  border-radius: 5px;
  background-color: #2a2a2a;
  color: #fff;
  transition: border-color 0.3s;
  width: 100%;
  height: 30px;
  min-height: 30px;
  resize: none;
  margin: 0 0.5rem;
  overflow-y: hidden;
}

.message-input:focus {
  outline: none;
}

.message-input:focus {
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
  border-radius: 8px;
  padding: 0.4rem;
  color: #fff;
  font-size: 1rem;
  display: flex;
  align-items: center;
  gap: 8px;
}

.hover-menu i {
  cursor: pointer;
  padding: 5px;
  border-radius: 4px;
  transition: background-color 0.2s ease;
}

.hover-menu i:hover {
  background-color: #555;
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
  background-color: #2c2f33;
  border-radius: 5px;
  padding: 0.5rem;
  border-left: 3px solid #7289da;
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

.reply-header {
  display: flex;
  align-items: center;
}

.reply-text {
  color: #b9bbbe;
  font-size: 0.9rem;
  line-height: 1.2;
}

.reply-text strong {
  color: #00bfff;
}

.replying-to {
  background-color: #f0f0f0;
  border-left: 4px solid #007bff;
  padding: 8px 12px;
  margin-bottom: 8px;
  border-radius: 4px;
  color: #333;
  font-style: italic;
}

.input-controls {
  display: flex;
  align-items: center;
}

.upload-button,
.emoji-button,
.translate-button {
  background: none;
  border: none;
  cursor: pointer;
  margin-left: 0.5rem;
}

.upload-button img {
  width: 20px;
  height: 20px;
}

.emoji-button {
  font-size: 1.5rem;
}

i {
  color: #6f7573;
}

.emoji-button {
  background: transparent;
  border: none;
  cursor: pointer;
  font-size: 20px;
}

.emoji-picker {
  position: absolute;
  z-index: 1000;
}

.message-image {
  max-width: 200px;
  max-height: 200px;
  width: auto;
  height: auto;
  border-radius: 8px;
}

.translator-box {
  position: absolute;
  bottom: 60px;
  left: 0;
  background-color: #1e1e1e;
  color: #fff;
  padding: 10px;
  border-radius: 10px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
  z-index: 100;
  max-width: 300px;
  max-height: 200px;
  overflow-y: auto;
}

.translator-box textarea {
  width: 100%;
  background-color: #2b2b2b;
  color: #fff;
  border: 1px solid #444;
  border-radius: 5px;
  padding: 6px;
  font-size: 14px;
}

.translator-box button {
  background-color: #4b4b4b;
  color: #fff;
  border: none;
  padding: 6px;
  margin-top: 5px;
  cursor: pointer;
  font-size: 14px;
}

.translator-box button:hover {
  background-color: #616161;
}

.close-button {
  background: none;
  border: none;
  color: #fff;
  font-size: 1.5rem;
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  cursor: pointer;
  transition: color 0.3s ease;
}

.close-button:hover {
  color: #ff6b6b;
}

.image-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.enlarged-image {
  max-width: 90%;
  max-height: 90%;
  border: 2px solid #fff;
}

.message-content:hover {
  background-color: rgba(255, 255, 255, 0.1);
  cursor: pointer;
  transition: background-color 0.2s ease;
}
</style>
