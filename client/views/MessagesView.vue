<script setup lang="ts">
import MessageListComponent from "@/components/Messages/MessageListComponent.vue";
import { useMessageStore } from "@/stores/message";
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";

const { currentUsername } = storeToRefs(useUserStore());
const { currentMessages } = storeToRefs(useMessageStore());

</script>

<template>
    <main class="column">
        <h1>Messages for {{ currentUsername }}</h1>
        <MessageListComponent />
    </main>
</template>