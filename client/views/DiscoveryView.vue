<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import DiscoverComponent from '@/components/Discovery/DiscoverComponent.vue';

const { currentUsername, isLoggedIn } = storeToRefs(useUserStore());
</script>

<template>
    <main class="discovery-main">
        <h1>Photocard Discovery</h1>
        <section class="discovery-section">
            <div v-if="isLoggedIn">
                <DiscoverComponent />
            </div>
            <div v-else class="login-prompt">
                <h2>Please log in to start discovering new photocards!</h2>
            </div>
        </section>
    </main>
</template>

<style scoped>
.discovery-main {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: auto;
    padding: 1.5em;
    max-width: 800px;
    text-align: center;
}

h1 {
    font-size: 2em;
    color: var(--primary);
    margin-bottom: 1em;
}

.discovery-section {
    background-color: #f5f5f5;
    border-radius: 12px;
    padding: 2em;
    width: 100%;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.login-prompt {
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: #ffebee;
    border: 2px solid #ffcdd2;
    border-radius: 8px;
    padding: 1em;
    margin-top: 1.5em;
}

.login-prompt h2 {
    font-size: 1.5em;
    color: #d32f2f;
}
</style>
