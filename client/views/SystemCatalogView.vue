<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import { useRoute } from 'vue-router';
import { onBeforeMount, ref } from "vue";

import CatalogComponent from '@/components/Catalogs/CatalogComponent.vue';
import AddPhotocardForm from '@/components/Photocards/AddPhotocardForm.vue';

import { fetchy } from "../utils/fetchy";

const { currentUsername, isLoggedIn } = storeToRefs(useUserStore());
const adminUsername = "System";

</script>

<template>
    <main>
        <section>
            <h1>All Photocards</h1>
        </section>
        <div>
            <CatalogComponent :owner="adminUsername" />
        </div>
    </main>
</template>

<style scoped>
h1 {
    text-align: center;
}
</style>
