<script setup lang="ts">
import { ref } from "vue";

const tags = ref("");
const emit = defineEmits(["getPhotocardsByTag"]);
</script>

<template>
    <form @submit.prevent="emit('getPhotocardsByTag', tags)" class="pure-form">
        <fieldset>
            <input type="text" v-model="tags" placeholder="Search by tags..." />
            <button type="submit" class="pure-button pure-button-primary">Search</button>
        </fieldset>
    </form>
</template>

<style scoped>
form {
    display: flex;
    gap: 0.5em;
    padding: 1em;
    align-items: center;
}
</style>
