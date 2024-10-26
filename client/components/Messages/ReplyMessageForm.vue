<script setup lang="ts">
import { useMessageStore } from "@/stores/message";
import { ref } from "vue";

let props = defineProps(["recipient"]);
const message = ref("");
const { sendMessage } = useMessageStore();
const emit = defineEmits(["refreshMessages"]);

async function send() {
    await sendMessage(props.recipient, message.value);
    emit("refreshMessages", props.recipient);
    emptyForm();
}
const emptyForm = () => {
    message.value = "";
};
</script>

<template>
    <div style="display: flex; justify-content: flex-end; margin: 10px 0;">
        <form @submit.prevent="send" style="display: flex; align-items: center; width: 100%;">
            <input type="text" v-model="message" placeholder="Type your message..."
                style="flex-grow: 1; border: 1px solid #ccc; border-radius: 10px; padding: 10px; margin-right: 10px;"
                required />
            <button type="submit" class="pure-button pure-button-primary"
                style="background-color: #00796b; color: white; border-radius: 10px; padding: 5px 15px;">Send</button>
        </form>
    </div>
</template>