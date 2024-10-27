<script setup lang="ts">
import PhotocardComponent from "@/components/Photocards/PhotocardComponent.vue";
import ReplyMessageForm from "@/components/Messages/ReplyMessageForm.vue";
import { useUserStore } from "@/stores/user";
import { useToastStore } from "@/stores/toast";
import { fetchy } from "@/utils/fetchy";
import { storeToRefs } from "pinia";
import { onMounted, ref } from "vue";

const { isLoggedIn, currentUsername } = storeToRefs(useUserStore());
const toastStore = useToastStore();

const loaded = ref(false);

let recommended = ref("");
let owner = ref("");
let poorRating = ref(false);
let averageRating = ref(0);
let recommendedExists = ref(false);
let noRatings = ref(false);

async function getRecommendation() {
    let recommendationResults;
    try {
        recommendationResults = await fetchy(`/api/discover`, "GET");
    } catch (e) {
        recommendedExists.value = false;
        return;
    }
    poorRating.value = recommendationResults.msg == 'Poor rating!';
    owner.value = recommendationResults.owner;
    recommended.value = recommendationResults.photocard;
    recommendedExists.value = true;
}

async function getAverageRating() {
    let averageResults;
    try {
        averageResults = await fetchy(`/api/reviews/average/${owner.value}`, "GET");
    } catch (_) {
        return;
    }
    averageRating.value = averageResults;
    noRatings.value = averageResults == 0;
}

async function confirmMessageSent() {
    useToastStore().showToast({ message: "Message sent! Go to your Messages to continue the conversation or discover a new photocard!", style: "success" });
}

onMounted(async () => {
    await getRecommendation();
    await getAverageRating();
    loaded.value = true;
});
</script>

<template>
    <main>
        <section class="discovery-container" v-if="isLoggedIn && recommendedExists && loaded">
            <section class="photocard-information">
                <h3>Your next recommended photocard is:</h3>
                <PhotocardComponent :photocard="recommended" :isDiscovery="true" />
            </section>
            <section class="discovery-options">
                <b><a :href="`/profile/${owner}`">Photocard Owner: {{ owner }}</a></b>
                <span>Average Rating: {{ averageRating }} stars</span>
                <span v-if="poorRating">Warning: this user has a poor rating!</span>
                <span v-else-if="noRatings">Warning: this user has no ratings from other users!</span>
                <b>Message the owner of this photocard:</b>
                <ReplyMessageForm :recipient="owner" :refreshMessages="confirmMessageSent" />
                <button @click="async () => { await getRecommendation(); await getAverageRating(); }">
                    Next Photocard
                </button>
            </section>
        </section>
        <section v-else-if="isLoggedIn && loaded">
            <h2>No new photocards to recommend at this time!</h2>
        </section>
        <section v-else-if="loaded">
            <h2>Please log in before you can discover a photocard!</h2>
        </section>
        <section v-else>
            Loading...
        </section>
    </main>
</template>

<style scoped>
main {
    margin: auto;
    display: flex;
    max-width: 50em;
}

section {
    display: flex;
    gap: 1em;
}

.discovery-container {
    flex-direction: row;
}

.discovery-options {
    flex-direction: column;
    font-weight: normal;
}

.photocard-information {
    background-color: #f9f9f9;
    border: 1px solid #ddd;
    padding: 1em;
    border-radius: 5px;
    flex-direction: column;
    margin: 0;
}
</style>