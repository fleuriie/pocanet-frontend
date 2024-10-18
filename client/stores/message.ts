import { defineStore } from "pinia";
import { ref } from "vue";

import { fetchy } from "@/utils/fetchy";

export const useMessageStore = defineStore(
  "message",
  () => {
    const currentMessages = ref([]);

    const resetStore = () => {
      currentMessages.value = [];
    };

    const fetchMessages = async (to: string) => {
        currentMessages.value = await fetchy(`/api/message/read/${to}`, "POST");
    };

    const sendMessage = async (to: string, m: string) => {
        await fetchy(`/api/message/send/${to}/${m}`, "POST");
    };

    return {
        currentMessages,
        fetchMessages,
        sendMessage,
        resetStore
    };
  },
  { persist: true },
);
