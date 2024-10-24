<script setup lang="ts">

const props = defineProps(["users"]);
const emit = defineEmits(["user-clicked"]);

function handleUserClick(user: string) {
    emit("user-clicked", user);
}
</script>

<template>
    <div class="message-user-list">
        <h2>Recent Messages</h2>
        <ul>
            <li v-for="user in props.users" @click="handleUserClick(user)">
                {{ user }}
            </li>
        </ul>
    </div>
</template>

<style scoped>
.message-user-list {
    padding: 20px;
}

.message-user-list h2 {
    margin-bottom: 10px;
}

.message-user-list ul {
    list-style-type: none;
    padding: 0;
}

.message-user-list li {
    padding: 10px;
    border-bottom: 1px solid #ccc;
}
</style>