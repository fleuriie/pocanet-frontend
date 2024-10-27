<script setup lang="ts">
import { fetchy } from "@/utils/fetchy";
import { onBeforeMount, ref } from "vue";

const props = defineProps(["user"]);
let isBlocked = ref(false);
let userOid = ref('');

async function loadBlockData() {
    let isBlockedResult;
    let userOidResult;
    try {
        userOidResult = await fetchy(`/api/users/${props.user}`, 'GET');
        isBlockedResult = await fetchy(`/api/message/blocked/${userOidResult._id}`, 'GET');
    } catch (_) {
        return;
    }
    isBlocked.value = isBlockedResult;
    userOid.value = userOidResult._id;
}

async function block() {
    try {
        await fetchy(`/api/message/block/${userOid.value}`, 'POST');
    } catch (_) {
        return;
    }
}

async function unblock() {
    try {
        await fetchy(`/api/message/unblock/${userOid.value}`, 'POST');
    } catch (_) {
        return;
    }
}

onBeforeMount(async () => {
    await loadBlockData();
})
</script>

<template>
    <div>
        <button
            :style="{ backgroundColor: isBlocked ? 'red' : 'white', color: isBlocked ? 'white' : 'black', borderRadius: '5px' }"
            @click="async () => { isBlocked ? await unblock() : await block(); await loadBlockData(); }">
            {{ isBlocked ? 'Unblock User' : 'Block User' }}
        </button>
    </div>
</template>
