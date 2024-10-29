<template>
  <div class="channel-container">
    <h2>{{ channelName }}</h2>

    <div class="messages" ref="messagesContainer">
      <div v-for="(group, groupIndex) in groupedMessages" :key="groupIndex" class="message-group">
        <div class="message-header">
          <img :src="buildProfilePictureUrl(group.user.profile_picture)" alt="Profile Picture" @click="showUserDetails(group.user)"
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
            <i class="fa-solid fa-pencil"></i>
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
<style scoped src="../../css/Channel.css"></style>
