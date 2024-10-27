<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";

const { currentUsername, isLoggedIn } = storeToRefs(useUserStore());
</script>

<template>
  <main>
    <header>
      <h1>🌟 Welcome to Pocanet! 🌟</h1>
      <p v-if="isLoggedIn">Hello, {{ currentUsername }}! Glad to see you back!</p>
      <p v-else>Sign up to join our amazing K-pop photocard community!</p>
    </header>

    <section class="about">
      <h2>About Pocanet</h2>
      <p>
        Pocanet is your one-stop shop for all your K-pop photocard collecting needs! Browse our curated database,
        connect with fellow fans, and easily wishlist and find the cards you're looking for!
      </p>
    </section>

    <section class="faq">
      <h2>Frequently Asked Questions</h2>
      <div class="faq-item">
        <h3>How do I search for a photocard?</h3>
        <p>
          You can either go to our <router-link to="/catalog">catalog</router-link>
          to view all photocards and search our collection, or you can search within another
          user's collection by visiting their profile!
        </p>
        <p>
          Search terms (also known as tags) must have <b>no spaces</b> and are <b>case-sensitive.</b>
        </p>
      </div>
      <div class="faq-item">
        <h3>How does the tagging system work?</h3>
        <p>
          Our database of cards includes the K-pop group name, artist first name, album title, and photocard version as
          tags. Searching for any of these allows our users to find the cards they're looking for very easily.
        </p>
        <p>
          Our tagging system is incredibly flexible, which also allows our users to customize their collections
          however they wish. Some common tags are 'ISO' to mark a card as one the user is in search of, 'OTW' to
          mark the card as purchased and on the way, and 'WTS'/'WTT' to mark the card as willing to sell or trade.
        </p>
      </div>
      <div class="faq-item">
        <h3>How can I find new photocards?</h3>
        <p>
          Using our <router-link to="/discover">Discovery</router-link> system, users can see a random photocard that
          other
          users have marked as for sale or for trade, and message those users about them to initiate a transaction.
          Alternatively,
          users can browse our catalog of all photocards!
        </p>
      </div>
    </section>

    <footer v-if="!isLoggedIn" class="auth-invite">
      <p>Join us and start your photocard collection today!</p>
      <div class="auth-buttons">
        <RouterLink :to="{ name: 'Login' }" class="auth-button login">Login or Register</RouterLink>
      </div>
    </footer>
  </main>
</template>

<style scoped>
main {
  max-width: 50em;
  margin: auto;
  padding: 2em;
  background: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  font-family: Arial, sans-serif;
}

header {
  text-align: center;
  margin-bottom: 1.5em;
}

h1 {
  font-size: 2em;
  color: var(--primary);
}

.about,
.faq {
  margin-bottom: 1.5em;
}

h2 {
  color: #333;
  font-size: 1.5em;
}

p {
  color: #555;
  line-height: 1.6;
}

.faq-item {
  margin-top: 1em;
}

.faq-item h3 {
  color: #333;
  font-size: 1.2em;
}

.auth-invite {
  margin-top: 2em;
  padding: 2em;
  background-color: #f0f4f8;
  border-top: 2px solid var(--primary);
  border-radius: 12px;
  text-align: center;
}

.auth-invite p {
  font-size: 1.2em;
  color: #333;
  margin-bottom: 1em;
}

.auth-buttons {
  display: flex;
  justify-content: center;
  gap: 1em;
}

.auth-button {
  padding: 0.8em 1.5em;
  border-radius: 8px;
  text-decoration: none;
  color: white;
  font-size: 1em;
  font-weight: bold;
  transition: background-color 0.3s ease;
}

.auth-button.login {
  background-color: var(--primary);
}

.auth-button:hover {
  opacity: 0.9;
}
</style>
