import { defineStore } from "pinia";
import { ref } from "vue"; 

export const useGeneralStore = defineStore('general', () => {
  const globalLoading = ref(false)
  const requstLoading = ref(false)

  return{
    globalLoading,
    requstLoading,
  }
})