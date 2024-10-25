<script setup lang="ts">
import { useMessageStore } from "@/stores/message";
import { ref } from "vue";

const props = defineProps(["recipient"]);
const message = ref("");
const { sendMessage } = useMessageStore();
const emit = defineEmits(["refreshMessages"]);

async function send() {
    await sendMessage(props.recipient, message.value);
    emit("refreshMessages", props.recipient);
}
</script>

<template>
    <div style="display: flex; align-items: center;">
        <input type="text" v-model="message" placeholder="Type your message..." style="flex: 1; margin-right: 10px;" />
        <button @click="send">Send</button>
    </div>
</template>
