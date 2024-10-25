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

const deletePhotocard = async () => {
    try {
        await fetchy(`/api/photocard/delete/:id`, "DELETE");
    } catch {
        return;
    }
    emit("refreshPhotocards");
};

async function getPhotocardOwner() {
    const photocardTags = props.photocard.tags;
    const ownerTag = photocardTags.find(tag: string => tag.startsWith("owner:"));
    if (ownerTag) {
        const username = ownerTag.split(":")[1];
        photocardOwner.value = username;
    }
    else {
        photocardOwner.value = "System";
    }
}

onBeforeMount(async () => {
    await getPhotocardOwner();
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
    gap: 1em;
    padding: 0;
    margin: 0;
}

.base {
    display: flex;
    justify-content: space-between;
    align-items: center;
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
