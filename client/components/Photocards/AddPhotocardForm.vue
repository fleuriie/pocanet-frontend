<script setup lang="ts">
import { ref } from "vue";
import { fetchy } from "../../utils/fetchy";

const tags = ref("");
const photocardUrl = ref("");
const emit = defineEmits(["refreshPhotocards"]);

const createPhotocard = async (photocardUrl: string, tags: string) => {
    try {
        await fetchy(`/api/photocard/add/${tags}`, "POST", {
            body: { photocardUrl },
        });
    } catch (_) {
        return;
    }
    emit("refreshPhotocards");
    emptyForm();
};

const emptyForm = () => {
    tags.value = "";
    photocardUrl.value = "";
};
</script>

<template>
    <form @submit.prevent="createPhotocard(photocardUrl, tags)">
        <fieldset>
            <div class="pure-control-group">
                <label for="aligned-url">Photocard URL</label>
                <input v-model.trim="photocardUrl" type="text" id="aligned-url" placeholder="URL" required />
            </div>
            <div class="pure-control-group">
                <label for="aligned-tags">Tags (separated by commas)</label>
                <input v-model.trim="tags" id="aligned-tags" placeholder="Tags" required />
            </div>
            <div class="pure-controls">
                <button type="submit" class="pure-button pure-button-primary">Submit</button>
            </div>
        </fieldset>
    </form>
</template>

<style scoped>
form {
    background-color: var(--base-bg);
    border-radius: 1em;
    display: flex;
    flex-direction: column;
    gap: 0.5em;
    padding: 1em;
}

textarea {
    font-family: inherit;
    font-size: inherit;
    height: 6em;
    padding: 0.5em;
    border-radius: 4px;
    resize: none;
}
</style>
