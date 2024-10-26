<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import { fetchy } from "../../utils/fetchy";
import { onBeforeMount, ref } from "vue";

const props = defineProps(["reviewFromUser", "rating", "review"]);

</script>

<template>
    <div class="review-box">
        <div class="rating">
            <span v-for="star in 5" :key="star" class="star" :class="{ filled: star <= props.rating }">&#9733;</span>
        </div>
        <strong>{{ props.reviewFromUser }}</strong>
        <div class="review-text">
            <article>
                <p>{{ props.review }}</p>
            </article>
        </div>
    </div>
</template>

<style scoped>
p {
    margin: 0em;
}

.review-box {
    width: 100%;
    word-wrap: break-word;
}

.review-text {
    display: flex;
    justify-content: space-between;
    align-items: left;
}

.rating {
    display: flex;
    align-items: left;
    margin: 0;
}

.star {
    font-size: 1.5em;
    color: #d3d3d3;
}

.star.filled {
    color: #ffd700;
}
</style>
