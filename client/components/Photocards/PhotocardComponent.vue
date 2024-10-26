<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import { fetchy } from "../../utils/fetchy";
import { onBeforeMount, ref } from "vue";

const props = defineProps(["photocard"]);
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
    }
    else {
        photocardOwner.value = "System";
    }
    availableStatus.value = photocardTags.includes("Available");
}
onBeforeMount(async () => {
    await getPhotocardInfo();
    loaded.value = true;
});
</script>

<template>
    <img :src="props.photocard.photocardUrl" alt="Photocard Image" />
    <div class="base">
        <menu v-if="photocardOwner == currentUsername">
            <li><button class="btn-small pure-button" @click="emit('editPhotocard', props.photocard._id)">Edit</button>
            </li>
            <li><button class="button-error btn-small pure-button" @click="deletePhotocard">Delete</button></li>
            <li v-if="availableStatus"><button class="btn-small pure-button" @click="markAsUnavailable">Mark As
                    Unavailable</button></li>
            <li v-else><button class="btn-small pure-button" @click="markAsAvailable">Mark As Available</button>
            </li>
        </menu>
        <menu v-else-if="isLoggedIn">
            <li><button class="btn-small pure-button" @click="emit('duplicatePhotocard', props.photocard._id)">Add to
                    Your Collection</button>
            </li>
        </menu>
    </div>
</template>

<style scoped>
p {
    margin: 0em;
}

menu {
    list-style-type: none;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    gap: 1em;
    padding: 0;
    margin: 0;
}

.base {
    display: flex;
    justify-content: space-between;
    align-items: center;
    max-width: 7em;
}

.base article:only-child {
    margin-left: auto;
}

img {
    max-width: 150px;
    max-height: 200px;
    overflow: hidden;
}
</style>
