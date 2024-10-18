<script setup lang="ts">
import router from "@/router";
import { useUserStore } from "@/stores/user";
import { useMessageStore } from "@/stores/message";
import { storeToRefs } from "pinia";
import SendMessageForm from "@/components/Messages/SendMessageForm.vue";

const { currentUsername } = storeToRefs(useUserStore());
const { currentMessages } = storeToRefs(useMessageStore());

</script>

<template>
    <main class="column">
        <h1>Messages for {{ currentUsername }}</h1>
        <SendMessageForm />
    </main>
</template>