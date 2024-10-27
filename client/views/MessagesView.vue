<script setup lang="ts">
import MessageListComponent from "@/components/Messages/MessageListComponent.vue";
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";

const { currentUsername } = storeToRefs(useUserStore());
</script>

<template>
    <main class="message-container">
        <h1>Messages for {{ currentUsername }}</h1>
        <section class="message-list">
            <MessageListComponent />
        </section>
    </main>
</template>

<style scoped>
.message-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    max-width: 800px;
    margin: 0 auto;
    padding: 2em 1em;
    text-align: center;
}

h1 {
    font-size: 2em;
    color: var(--primary);
    margin-bottom: 1.5em;
}

.message-list {
    background-color: #f5f5f5;
    padding: 1.5em;
    border-radius: 10px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    width: 100%;
    max-width: 100%;
}

.message-list h1 {
    font-size: 1.5em;
    color: #333;
    margin-bottom: 1em;
}

/* Responsive layout for smaller screens */
@media (max-width: 600px) {
    h1 {
        font-size: 1.5em;
    }

    .message-list {
        padding: 1em;
    }
}
</style>
