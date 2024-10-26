<script setup lang="ts">
import { useToastStore } from "@/stores/toast";
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import { computed, onBeforeMount } from "vue";
import { RouterLink, RouterView, useRoute } from "vue-router";

const currentRoute = useRoute();
const currentRouteName = computed(() => currentRoute.name);
const userStore = useUserStore();
const { isLoggedIn } = storeToRefs(userStore);
const { toast } = storeToRefs(useToastStore());

// Make sure to update the session before mounting the app in case the user is already logged in
onBeforeMount(async () => {
  try {
    await userStore.updateSession();
  } catch {
    // User is not logged in
  }
});
</script>

<template>
  <header>
    <nav>
      <div class="title">
        <img src="@/assets/images/logo.svg" />
        <RouterLink :to="{ name: 'Home' }">
          <h1>Pocanet</h1>
        </RouterLink>
      </div>
      <ul>
        <li>
          <RouterLink :to="{ name: 'View All Photocards' }"
            :class="{ selected: currentRouteName == 'View All Photocards' }"> View All Photocards </RouterLink>
        </li>
        <li v-if="isLoggedIn">
          <RouterLink :to="{ name: 'Settings' }" :class="{ selected: currentRouteName == 'Settings' }"> Settings
          </RouterLink>
        </li>
        <li v-else>
          <RouterLink :to="{ name: 'Login' }" :class="{ selected: currentRouteName == 'Login' }"> Login </RouterLink>
        </li>
        <li v-if="isLoggedIn">
          <RouterLink :to="{ name: 'Messages' }" :class="{ selected: currentRouteName == 'Messages' }"> Messages
          </RouterLink>
        </li>
        <li v-if="isLoggedIn">
          <RouterLink :to="{ name: 'Profile', params: { username: userStore.currentUsername } }"
            :class="{ selected: currentRouteName == 'Profile' }"> Profile
          </RouterLink>
        </li>
      </ul>
    </nav>
    <article v-if="toast !== null" class="toast" :class="toast.style">
      <p>{{ toast.message }}</p>
    </article>
  </header>
  <RouterView />
</template>

<style scoped>
@import "./assets/toast.css";

nav {
  padding: 0 .5em;
  background-color: var(--background);
  border-bottom: 3px solid var(--primary);
  display: flex;
  align-items: center;
  margin: 0;
}

h1 {
  font-size: 1.5em;
  margin: 0;
  padding: 0;
}

.title {
  display: flex;
  align-items: center;
  gap: 0.5em;
  margin: 0;
  padding: 0;
}

img {
  height: 2em;
  margin: 0;
  padding: 0;
}

a {
  font-size: large;
  color: black;
  text-decoration: none;
  padding: .5em;
  margin: 0;
  min-height: 100%;
}

ul {
  list-style-type: none;
  margin: 0 0 0 auto;
  padding: 0;
  display: flex;
  align-items: center;
  flex-direction: row;
  gap: 1em;
  min-height: 100%;
}

li {
  margin: 0;
  padding: 0;
  min-height: 100%;
}

.selected {
  background-color: var(--primary);
  min-height: 100%;

}

a:hover {
  background-color: var(--secondary);
}
</style>
