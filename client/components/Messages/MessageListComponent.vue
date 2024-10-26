<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { fetchy } from "@/utils/fetchy";
import { storeToRefs } from "pinia";
import { onBeforeMount, ref } from "vue";
import MessageComponent from "./MessageComponent.vue";
import MessageUserListComponent from "./MessageUserListComponent.vue";
import ReplyMessageForm from "./ReplyMessageForm.vue";
import SendMessageForm from "./SendMessageForm.vue";

const { isLoggedIn, currentUsername } = storeToRefs(useUserStore());

const loaded = ref(false);
let messages = ref<Array<Record<string, string>>>([]);
let users = ref(Array<string>);
let userToMessage = ref('');
let currentUserId = ref('');
let isMessagingUser = ref(false);

async function getCurrentUserId(username: string) {
    const currentUserInfo = await fetchy(`/api/users/${username}`, "GET");
    currentUserId.value = currentUserInfo._id;
}

async function getMessages(username: string) {
    userToMessage.value = username;
    if (!userToMessage.value) {
        return;
    }
    isMessagingUser.value = true;
    let messageResults;
    try {
        messageResults = await fetchy(`/api/message/read/${userToMessage.value}`, "POST");
    }
    catch (_) {
        return;
    }
    messages.value = messageResults.sort((a: any, b: any) => {
        return new Date(a.dateCreated).getTime() - new Date(b.dateCreated).getTime();
    }).reverse();
}

async function getRecentUsers() {
    let userResults;
    try {
        userResults = await fetchy("/api/message/recent", "GET");
    }
    catch (_) {
        return;
    }
    users.value = userResults.filter(user => user !== currentUsername.value);
}

onBeforeMount(async () => {
    await getCurrentUserId(currentUsername.value);
    await getRecentUsers();
    await getMessages(userToMessage.value);
    loaded.value = true;
});
</script>

<template>
    <h2>Send a new message: </h2>
    <SendMessageForm @refreshMessages="getMessages" @refreshUsers="getRecentUsers" />
    <section class="messages-container" v-if="isLoggedIn">
        <MessageUserListComponent :users="users" @user-clicked="getMessages" />
        <div class="current-messages" v-if="loaded && isMessagingUser">
            <h2>Message History with {{ userToMessage }}</h2>
            <section class="messages">
                <div v-for="message in messages">
                    <MessageComponent :message="message" :currentUserId="currentUserId" />
                </div>
            </section>
            <ReplyMessageForm :recipient="userToMessage" @refreshMessages="getMessages" />
        </div>
        <p class="information" v-else-if="loaded">You are not currently messaging a user!</p>
        <p class="information" v-else>Loading...</p>
    </section>
</template>

<style scoped>
section {
    display: flex;
    flex-direction: column;
    gap: 1em;
}

.row {
    margin: 0 auto;
    max-width: 60em;
}

.messages {
    border-radius: 1em;
    display: flex;
    flex-direction: column;
    margin: 1em;
    gap: 0.5em;
    padding: 1em;
    max-height: 300px;
    overflow-y: auto;
    flex-direction: column-reverse;
}

.messages-container {
    vertical-align: top;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
}

.row {
    display: flex;
    justify-content: space-between;
    margin: 0 auto;
    max-width: 60em;
}

.information {
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>
