<script setup lang="ts">
import { useMessageStore } from "@/stores/message";
import { ref } from "vue";

const recipient = ref("");
const message = ref("");
const { sendMessage, fetchMessages } = useMessageStore();

async function send() {
    await sendMessage(recipient.value, message.value);
    await fetchMessages(recipient.value);
}
</script>

<template>
    <form class="pure-form pure-form aligned" @submit.prevent="send">
        <fieldset>
            <div class="pure-control-group">
                <input v-model.trim="recipient" type="text" id="aligned-name" placeholder="User to Message" required />
            </div>
            <div class="pure-control-group">
                <input v-model.trim="message" type="text" id="aligned-name" placeholder="Message to send..." required />
            </div>
            <div class="pure-controls">
                <button type="submit" class="pure-button pure-button-primary">Send</button>
            </div>
        </fieldset>
    </form>
</template>

<style scoped>
h3 {
    display: flex;
    justify-content: center;
}
</style>
