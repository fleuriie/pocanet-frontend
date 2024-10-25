<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import { useRoute } from 'vue-router';
import { onBeforeMount, ref } from "vue";

import CatalogComponent from '@/components/Catalogs/CatalogComponent.vue';

import { fetchy } from "../utils/fetchy";

const { currentUsername, isLoggedIn } = storeToRefs(useUserStore());

const route = useRoute();
const username = route.params.username;

onBeforeMount(async () => {
    try {
        await fetchy(`/api/users/${username}`, "GET");
    } catch {
        return;
    }
});
</script>

<template>
    <main>
        <section>
            <h1 v-if="isLoggedIn && currentUsername == username">Your Profile Page!</h1>
            <h1 v-else>{{ username }}'s Profile Page!</h1>
        </section>
        <div>
            <CatalogComponent :owner="username" />
        </div>
    </main>
</template>

<style scoped>
h1 {
    text-align: center;
}
</style>
