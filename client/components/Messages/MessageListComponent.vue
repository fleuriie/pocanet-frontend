<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { fetchy } from "@/utils/fetchy";
import { storeToRefs } from "pinia";
import { onBeforeMount, ref } from "vue";
import MessageComponent from "./MessageComponent.vue";
import MessageUserListComponent from "./MessageUserListComponent.vue";
import SendMessageForm from "./SendMessageForm.vue";

const { isLoggedIn } = storeToRefs(useUserStore());

const loaded = ref(false);
let messages = ref<Array<Record<string, string>>>([]);
let users = ref(Array<string>);

async function getMessages(username: string) {
    let messageResults;
    try {
        messageResults = await fetchy(`/api/message/read/${username}`, "POST");
    }
    catch (_) {
        return;
    }
    messages.value = messageResults;
}

async function getRecentUsers() {
    let userResults;
    try {
        userResults = await fetchy("/api/message/recent", "GET");
    }
    catch (_) {
        return;
    }
    users.value = userResults;
}

onBeforeMount(async () => {
  await getRecentUsers();
  await getMessages(users.value[0]);
  loaded.value = true;
});
</script>

<template>
  <section v-if="isLoggedIn">
    <h2>Send a message: </h2>
    <SendMessageForm />
    <div>
        <MessageUserListComponent :users="users" @user-clicked="getMessages" />
    </div>
    <section class="messages" v-if="loaded && messages">
        <article v-for="message in messages" :key="message._id">
            <MessageComponent :message="message" @refreshMessages="getMessages"/>
        </article>
    </section>
  </section>
  <p v-else-if="loaded">No messages found</p>
  <p v-else>Loading...</p>
</template>

<style scoped>
section {
  display: flex;
  flex-direction: column;
  gap: 1em;
}

section,
p,
.row {
  margin: 0 auto;
  max-width: 60em;
}

article {
  background-color: var(--base-bg);
  border-radius: 1em;
  display: flex;
  flex-direction: column;
  gap: 0.5em;
  padding: 1em;
}

.messages {
  padding: 1em;
}

.row {
  display: flex;
  justify-content: space-between;
  margin: 0 auto;
  max-width: 60em;
}
</style>
