<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import { fetchy } from "../../utils/fetchy";
import { onMounted, ref } from "vue";

const props = defineProps(["photocard", "isDiscovery"]);
const emit = defineEmits(["editPhotocard", "refreshPhotocards", "duplicatePhotocard"]);
const { isLoggedIn, currentUsername } = storeToRefs(useUserStore());
let photocardOwner = ref('');
let loaded = ref(false);
let availableStatus = ref(false);

const deletePhotocard = async () => {
    try {
        await fetchy(`/api/photocard/delete/${props.photocard._id}`, "DELETE");
    } catch {
        return;
    }
    emit("refreshPhotocards");
};

const markAsAvailable = async () => {
    try {
        await fetchy(`/api/catalog/edit/avail/${props.photocard._id}`, "POST");
    } catch {
        return;
    }
    availableStatus.value = true;
    emit("refreshPhotocards");
};

const markAsUnavailable = async () => {
    try {
        await fetchy(`/api/catalog/edit/unavail/${props.photocard._id}`, "POST");
    } catch {
        return;
    }
    availableStatus.value = false;
    emit("refreshPhotocards");
};

async function getPhotocardInfo() {
    const photocardTags = props.photocard.tags;
    const ownerTag = photocardTags.find((tag: string) => tag.startsWith("owner:"));
    if (ownerTag) {
        const username = ownerTag.split(":")[1];
        photocardOwner.value = username;
    } else {
        photocardOwner.value = "System";
    }
    availableStatus.value = photocardTags.includes("Available");
}

onMounted(async () => {
    await getPhotocardInfo();
    loaded.value = true;
});
</script>

<template>
    <div class="photocard-container">
        <img :src="props.photocard.photocardUrl" alt="Photocard Image" />
        <div class="tags-tooltip">
            <p>Photocard tagged with:</p>
            <ul>
                <li v-for="tag in props.photocard.tags" :key="tag">{{ tag }}</li>
            </ul>
        </div>
    </div>
    <div v-if="!props.isDiscovery" class="base">
        <menu v-if="photocardOwner === currentUsername">
            <li>
                <button class="btn-small pure-button" @click="emit('editPhotocard', props.photocard._id)">Edit</button>
            </li>
            <li>
                <button class="button-error btn-small pure-button" @click="deletePhotocard">Delete</button>
            </li>
            <li v-if="availableStatus">
                <button class="btn-small pure-button" @click="markAsUnavailable">Mark As Unavailable</button>
            </li>
            <li v-else>
                <button class="btn-small pure-button" @click="markAsAvailable">Mark As Available</button>
            </li>
        </menu>
        <menu v-else-if="isLoggedIn">
            <li>
                <button class="btn-small pure-button" @click="emit('duplicatePhotocard', props.photocard._id)">Add To
                    Collection</button>
            </li>
        </menu>
    </div>
</template>

<style scoped>
.photocard-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    position: relative;
    margin: auto;
}

img {
    width: 10em;
    overflow: hidden;
}

.base {
    display: flex;
    justify-content: center;
    align-items: center;
    max-width: 7em;
    margin: auto;
}

.tags-tooltip {
    position: absolute;
    top: 0;
    left: 0;
    background-color: rgba(0, 0, 0, 0.7);
    color: white;
    padding: 0.5em;
    border-radius: 0.5em;
    display: none;
}

.photocard-container:hover .tags-tooltip {
    display: block;
    max-width: 150px;
    white-space: normal;
    word-wrap: break-word;
}


.base {
    display: flex;
    justify-content: space-between;
    align-items: center;
    max-width: 7em;
}

menu {
    list-style-type: none;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    gap: 1em;
    padding: 0;
    margin: 0;
    align-items: center;
}

.btn-small {
    background-color: var(--primary);
    color: white;
    border: none;
    border-radius: 4px;
    padding: 0.5em 1em;
    cursor: pointer;
    transition: background-color 0.2s;
}

.btn-small:hover {
    background-color: var(--secondary);
}

.button-error {
    background-color: #e57373;
}

.button-error:hover {
    background-color: #f44336;
}

p {
    margin: 0;
}
</style>
