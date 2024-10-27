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

onBeforeMount(async () => {
  try {
    await userStore.updateSession();
  } catch {
    // User is not logged in
  }
});
</script>

<template>
  <header class="navbar-header">
    <nav class="navbar">
      <div class="navbar-title">
        <img src="@/assets/images/photo.png" alt="Pocanet logo" />
        <RouterLink :to="{ name: 'Home' }">
          <h1>Pocanet</h1>
        </RouterLink>
      </div>
      <ul class="navbar-links">
        <li>
          <RouterLink :to="{ name: 'View All Photocards' }"
            :class="{ selected: currentRouteName == 'View All Photocards' }">
            View All Photocards
          </RouterLink>
        </li>
        <li v-if="isLoggedIn">
          <RouterLink :to="{ name: 'Discovery' }" :class="{ selected: currentRouteName == 'Discovery' }">
            Discover A New Photocard
          </RouterLink>
        </li>
        <li v-if="isLoggedIn">
          <RouterLink :to="{ name: 'Messages' }" :class="{ selected: currentRouteName == 'Messages' }"> Messages
          </RouterLink>
        </li>
        <li v-if="isLoggedIn">
          <RouterLink :to="{ name: 'Profile', params: { username: userStore.currentUsername } }"
            :class="{ selected: currentRouteName == 'Profile' }">
            Profile
          </RouterLink>
        </li>
        <li v-if="isLoggedIn">
          <RouterLink :to="{ name: 'Settings' }" :class="{ selected: currentRouteName == 'Settings' }"> Settings
          </RouterLink>
        </li>
        <li v-else>
          <RouterLink :to="{ name: 'Login' }" :class="{ selected: currentRouteName == 'Login' }"> Login </RouterLink>
        </li>
      </ul>
    </nav>
  </header>
  <RouterView />
</template>

<style scoped>
@import "./assets/toast.css";

.navbar-header {
  background: #f9f9f9;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.navbar {
  padding: 1em;
  display: flex;
  align-items: center;
  border-bottom: 3px solid var(--primary);
  flex-wrap: wrap;
}

.navbar-title {
  display: flex;
  align-items: center;
  gap: 0.5em;
}

.navbar-title img {
  height: 2em;
}

.navbar-title h1 {
  font-size: 1.8em;
  color: var(--primary);
  font-weight: bold;
  margin: 0;
}

.navbar-title a {
  text-decoration: none;
}

.navbar-links {
  list-style-type: none;
  margin: 0 0 0 auto;
  padding: 0;
  display: flex;
  align-items: center;
  gap: 1.2em;
}

.navbar-links li {
  padding: 0;
}

.navbar-links a {
  font-size: large;
  color: #333;
  text-decoration: none;
  padding: 0.5em 1em;
  border-radius: 8px;
  transition: background-color 0.3s ease, color 0.3s ease;
}

.navbar-links .selected {
  background-color: var(--primary);
  color: white;
}

.navbar-links a:hover {
  background-color: var(--secondary);
  color: white;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

/* Responsive styling */
@media (max-width: 768px) {
  .navbar {
    flex-direction: column;
    align-items: flex-start;
  }

  .navbar-links {
    flex-direction: column;
    width: 100%;
  }

  .navbar-links li {
    width: 100%;
    text-align: center;
  }

  .navbar-links a {
    width: 100%;
  }
}

@media (max-width: 480px) {
  .navbar-title h1 {
    font-size: 1.4em;
  }

  .navbar-links a {
    font-size: medium;
    padding: 0.5em;
  }
}
</style>
