<script setup lang="ts">
import ReviewComponent from "@/components/Reviews/ReviewComponent.vue";
import LeaveReviewForm from "@/components/Reviews/LeaveReviewForm.vue";
import { useUserStore } from "@/stores/user";
import { useToastStore } from "@/stores/toast";
import { fetchy } from "@/utils/fetchy";
import { storeToRefs } from "pinia";
import { onBeforeMount, ref } from "vue";

const { isLoggedIn, currentUsername } = storeToRefs(useUserStore());

const props = defineProps(["reviewOfUser"]);
const loaded = ref(false);

let reviews = ref<Array<Record<string, string>>>([]);
let averageRating = ref(0);

async function getReviews() {
    let reviewResults;
    let averageResults;
    try {
        reviewResults = await fetchy(`/api/reviews/${props.reviewOfUser}`, "GET");
        averageResults = await fetchy(`/api/reviews/average/${props.reviewOfUser}`, "GET");

    } catch (_) {
        return;
    }
    if (reviewResults !== `No reviews found for ${props.reviewOfUser}!`) {
        reviews.value = Object.keys(reviewResults.reviews).map(username => ({
            user: username,
            rating: reviewResults.ratings[username] || 0,
            review: reviewResults.reviews[username] || ''
        }));
        averageRating.value = averageResults;
    }
}

onBeforeMount(async () => {
    await getReviews();
    loaded.value = true;
});
</script>

<template>
    <main>
        <div class="row">
            <h2>Reviews for user {{ props.reviewOfUser }} (average {{ Math.round(averageRating * 100) / 100 }}):</h2>
        </div>
        <section class="reviews" v-if="loaded && reviews.length !== 0">
            <article v-for="review in reviews" :key="review._id">
                <ReviewComponent :reviewFromUser="review.user" :rating="review.rating" :review="review.review" />
            </article>
        </section>
        <p v-else-if="loaded">No reviews found for {{ props.reviewOfUser }}!</p>
        <p v-else-if="props.reviewOfUser !== currentUsername">Loading...</p>
        <LeaveReviewForm v-if="props.reviewOfUser !== currentUsername" :reviewOfUser="props.reviewOfUser"
            @refreshRatings="getReviews" />
    </main>
</template>

<style scoped>
main {
    margin: 0 auto;
    max-width: 50em;
    align-items: center;
}

.reviews {
    display: flex;
    flex-wrap: wrap;
    gap: 1em;
}

.reviews article {
    flex: 1 1 calc(25% - 1em);
    box-sizing: border-box;
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
    max-width: 50em;
}
</style>
