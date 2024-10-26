<script setup lang="ts">
import { ref } from "vue";
import { fetchy } from "../../utils/fetchy";
import { formatDate } from "../../utils/formatDate";

const props = defineProps(["photocard", "owner"]);
const emit = defineEmits(["editPhotocard", "refreshPhotocards"]);
const addedTag = ref("");
const removedTag = ref("");

async function editTags() {
    if (addedTag.value) {
        if (props.owner === "System") {
            try {
                await fetchy(`/api/${props.photocard._id}/tags/add/${addedTag.value}`, "POST");
            }
            catch (e) {
                return;
            }
        }
        else {
            try {
                await fetchy(`/api/catalog/edit/add/${props.photocard._id}/${addedTag.value}`, "POST");
            }
            catch (e) {
                return;
            }
        }
    }
    if (removedTag.value) {
        console.log(removedTag.value)
        if (props.owner === "System") {
            try {
                await fetchy(`/api/${props.photocard._id}/tags/delete/${removedTag.value}`, "POST");
            }
            catch (e) {
                return;
            }
        }
        else {
            try {
                await fetchy(`/api/catalog/edit/remove/${props.photocard._id}/${removedTag.value}`, "POST");
            }
            catch (e) {
                return;
            }
        }
    }
    emit("editPhotocard");
    emit("refreshPhotocards");
    emptyForm();
};
const emptyForm = () => {
    addedTag.value = "";
    removedTag.value = "";
};
</script>

<template>
    <form @submit.prevent="editTags">
        <p>Photocard currently has tags: {{ props.photocard.tags.filter(tag: any => !tag.startsWith("owner:")) }}</p>
        <input type="text" v-model="addedTag" placeholder="Add a tag?" />
        <input type="text" v-model="removedTag" placeholder="Remove a tag?" />
        <div class="base">
            <menu>
                <li><button class="btn-small pure-button-primary pure-button" type="submit">Save</button></li>
                <li><button class="btn-small pure-button" @click="emit('editPhotocard')">Cancel</button></li>
            </menu>
        </div>
    </form>
</template>

<style scoped>
form {
    background-color: var(--base-bg);
    display: flex;
    flex-direction: column;
    gap: 0.5em;
    max-width: 15em;
    flex-wrap: wrap;
}

textarea {
    font-family: inherit;
    font-size: inherit;
    height: 1.5em;
    border-radius: 4px;
    resize: none;
}

p {
    margin: 0em;
}


menu {
    list-style-type: none;
    display: flex;
    flex-direction: row;
    gap: 1em;
    padding: 0;
    margin: 0;
}

.base {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.timestamp {
    display: flex;
    justify-content: flex-end;
    font-size: 0.9em;
    font-style: italic;
}
</style>
