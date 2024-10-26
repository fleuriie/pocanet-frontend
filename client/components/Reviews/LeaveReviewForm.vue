<script setup lang="ts">
import { ref } from "vue";
import { fetchy } from "../../utils/fetchy";

let rating = ref("");
let review = ref('');
const props = defineProps(["reviewOfUser"]);
const emit = defineEmits(["refreshRatings"]);

const leaveReview = async (rating: string, review: string) => {
    try {
        await fetchy(`/api/reviews/leave/${props.reviewOfUser}`, "POST", {
            body: { rating: rating, review: review },
        });
    } catch (_) {
        return;
    }
    emit("refreshRatings");
    emptyForm();
};

const emptyForm = () => {
    rating.value = "";
    review.value = "";
};
</script>

<template>
    <form @submit.prevent="leaveReview(rating, review)">
        <fieldset>
            <h4>Leave a review:</h4>
            <div class="pure-control-group">
                <label for="aligned-rating">Numerical Rating (1-5) </label>
                <input v-model.trim="rating" type="text" id="aligned-url" placeholder="Rating" required />
            </div>
            <div class="pure-control-group">
                <label for="aligned-review">Feedback </label>
                <input v-model.trim="review" id="aligned-tags" placeholder="Review" required />
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
    margin: 2em;
    max-width: 25em;
}
</style>
