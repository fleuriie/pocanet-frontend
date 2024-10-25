<script setup lang="ts">
import { formatDate } from "@/utils/formatDate";

const props = defineProps(["message", "currentUserId"]);

const isUserSender = props.message.sender === props.currentUserId;

</script>

<template>
    <div :class="['message-container', isUserSender ? 'current-user' : 'other-user']">
        <p :class="['message-bubble', isUserSender ? 'blue-bubble' : 'gray-bubble']">{{ props.message.message }}</p>
        <p class="timestamp">Sent {{ formatDate(props.message.dateCreated) }}</p>
    </div>
</template>

<style scoped>
.message-container {
    display: flex;
    flex-direction: column;
}

.current-user {
    align-items: flex-end;
}

.other-user {
    align-items: flex-start;
}

.message-bubble {
    padding: 0.5em 1em;
    margin: 0;
    border-radius: 10px;
    max-width: 80%;
    word-wrap: break-word;
}

.blue-bubble {
    background-color: #cce5ff;
    color: #004085;
}

.gray-bubble {
    background-color: #e2e3e5;
    color: #383d41;
}

.timestamp {
    display: flex;
    font-size: 0.5em;
    font-style: italic;
    margin: 0.1;
    padding: 0;
}
</style>