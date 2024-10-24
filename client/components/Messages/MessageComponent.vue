<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { formatDate } from "@/utils/formatDate";
import { storeToRefs } from "pinia";
import { computed } from "vue";


const { currentUsername } = storeToRefs(useUserStore());

const isCurrentUser = computed(() => props.message.sender === currentUsername.value);
const props = defineProps(["message"]);
const emit = defineEmits(["refreshMessages"]);

</script>

<template>
    <div :class="['message-container', isCurrentUser ? 'current-user' : 'other-user']">
        <p :class="['message-bubble', isCurrentUser ? 'blue-bubble' : 'gray-bubble']">{{ props.message.message }}</p>
        <div class="base">
            <article class="timestamp">
                <p>Sent: {{ formatDate(props.message.dateCreated) }}</p>
            </article>
        </div>
    </div>
</template>

<style scoped>
.message-container {
    display: flex;
    flex-direction: column;
    margin: 0.5em 0;
}

.current-user {
    align-items: flex-end;
}

.other-user {
    align-items: flex-start;
}

.message-bubble {
    padding: 0.5em 1em;
    border-radius: 10px;
    max-width: 60%;
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
    justify-content: flex-end;
    font-size: 0.9em;
    font-style: italic;
}

.base {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.base article:only-child {
    margin-left: auto;
}
</style>