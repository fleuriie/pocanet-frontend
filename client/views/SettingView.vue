<script setup lang="ts">
import router from "@/router";
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import UpdateUserForm from "../components/Setting/UpdateUserForm.vue";

const { currentUsername } = storeToRefs(useUserStore());
const { logoutUser, deleteUser } = useUserStore();

async function logout() {
  await logoutUser();
  void router.push({ name: "Home" });
}

async function delete_() {
  await deleteUser();
  void router.push({ name: "Home" });
}
</script>

<template>
  <main class="settings-page">
    <h1>Settings for {{ currentUsername }}</h1>
    <div class="button-container">
      <button class="pure-button pure-button-primary" @click="logout">Logout</button>
      <button class="button-error pure-button" @click="delete_">Delete User</button>
    </div>
    <UpdateUserForm />
  </main>
</template>

<style scoped>
.settings-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  /* Center align the items */
  max-width: 600px;
  /* Set a max-width for the page */
  margin: auto;
  /* Center the main container */
  text-align: center;
  /* Center text */
}

.button-container {
  display: flex;
  justify-content: center;
  /* Center the buttons */
  gap: 1em;
  /* Add space between the buttons */
  margin: 1.5em 0;
  /* Add some vertical spacing around the button container */
}

.pure-button {
  padding: 0.5em 1em;
  /* Add padding for better touch targets */
  font-size: 1em;
  /* Adjust font size */
}
</style>
