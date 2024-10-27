<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import { useRoute } from 'vue-router';
import { onBeforeMount, ref } from "vue";

import CatalogComponent from '@/components/Catalogs/CatalogComponent.vue';
import BlockUnblockComponent from '@/components/Messages/BlockUnblockComponent.vue';
import AllReviewsComponent from '@/components/Reviews/AllReviewsComponent.vue';

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
    <main class="profile-container">
        <section class="profile-header">
            <h1 v-if="isLoggedIn && currentUsername === username">Your Profile Page!</h1>
            <h1 v-else>{{ username }}'s Profile Page!</h1>
            <BlockUnblockComponent v-if="isLoggedIn && currentUsername !== username" :user="username" />
        </section>
        <div class="profile-content">
            <AllReviewsComponent :reviewOfUser="username" />
            <CatalogComponent :owner="username" :isAllPhotocards="false" />
        </div>
    </main>
</template>

<style scoped>
.profile-container {
    max-width: 800px;
    margin: auto;
    padding: 2em;
    text-align: center;
    background-color: #f9f9f9;
    border-radius: 8px;
    =box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.profile-header {
    margin-bottom: 2em;
}

.profile-header h1 {
    font-size: 2em;
    color: var(--primary);
}

.profile-content {
    display: flex;
    flex-direction: column;
    gap: 2em;
}

/* Responsive adjustments */
@media (max-width: 600px) {
    .profile-container {
        padding: 1em;
    }

    .profile-header h1 {
        font-size: 1.5em;
    }
}
</style>
