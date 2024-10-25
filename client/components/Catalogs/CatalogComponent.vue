<script setup lang="ts">
import PhotocardComponent from "@/components/Photocards/PhotocardComponent.vue";
import EditPhotocardForm from "@/components/Photocards/EditPhotocardForm.vue";
import SearchPhotocardForm from "@/components/Photocards/SearchPhotocardForm.vue";
import AddPhotocardForm from "@/components/Photocards/AddPhotocardForm.vue";
import { useUserStore } from "@/stores/user";
import { useToastStore } from "@/stores/toast";
import { fetchy } from "@/utils/fetchy";
import { storeToRefs } from "pinia";
import { onBeforeMount, ref } from "vue";

const { isLoggedIn, currentUsername } = storeToRefs(useUserStore());

const props = defineProps(["owner"]);
const loaded = ref(false);
const adminUsername = "System";
const isAdmin = ref(currentUsername.value === adminUsername);

let photocards = ref<Array<Record<string, string>>>([]);
let editing = ref("");
let searchTags = ref("");

async function getPhotocards(tags?: string) {
    let photocardResults;
    if (tags) {
        try {
            photocardResults = await fetchy(`/api/catalog/${props.owner}/${tags}`, "GET");
        } catch (_) {
            return;
        }
    }
    else {
        try {
            photocardResults = await fetchy(`/api/catalog/${props.owner}`, "GET");
        } catch (_) {
            return;
        }
    }
    searchTags.value = tags ? tags : "";
    photocards.value = photocardResults;
}

async function duplicatePhotocard(id: string) {
    try {
        await fetchy(`/api/catalog/edit/add/${id}`, "POST");
    } catch (e) {
        return;
    }
    useToastStore().showToast({ message: "Successfully added photocard to your collection!", style: "success" });
}

function updateEditing(id: string) {
    editing.value = id;
}

onBeforeMount(async () => {
    await getPhotocards();
    loaded.value = true;
});
</script>

<template>
    <div v-if="isAdmin">
        <AddPhotocardForm @refreshPhotocards="getPhotocards" />
    </div>
    <div class="row">
        <h2 v-if="!searchTags.value">Photocard Collection:</h2>
        <h2 v-else>Photocards matching the tags {{ searchTags.split(",") }}:</h2>
        <SearchPhotocardForm @getPhotocardsByTag="getPhotocards" />
    </div>
    <section class="photocards" v-if="loaded && photocards.length !== 0">
        <article v-for="photocard in photocards" :key="photocard._id">
            <PhotocardComponent v-if="editing !== photocard._id" :photocard="photocard"
                @refreshPhotocard="getPhotocards" @editPost="updateEditing" @duplicatePhotocard="duplicatePhotocard" />
            <EditPhotocardForm v-else :photocard="photocard" @refreshPhotocards="getPhotocards"
                @editPhotocard="updateEditing" />
        </article>
    </section>
    <p v-else-if="loaded">No photocards found</p>
    <p v-else>Loading...</p>
</template>

<style scoped>
section {
    display: flex;
    flex-wrap: wrap;
    gap: 1em;
}

section,
p,
.row {
    margin: 0 auto;
    max-width: 60em;
}

article {
    background-color: var(--base-bg);
    border-radius: 1em;
    display: flex;
    flex-direction: column;
    gap: 0.5em;
    padding: 1em;
}

.photocards {
    padding: 1em;
}

.row {
    display: flex;
    justify-content: space-between;
    margin: 0 auto;
    max-width: 60em;
}
</style>
