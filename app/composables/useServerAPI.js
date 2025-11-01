import { useGeneralStore } from "../../stores/general";
// خارج الفنكشن عشان يظل ثابت
const lastRequests = new Map();

export const useServerAPI = async (request, opts = {}) => {
  const { locale } = useNuxtApp().$i18n;
  const generalStore = useGeneralStore();

  if (process.server) return;

  if (process.client) {
    try {
      generalStore.requstLoading = true;
      const token = JSON.parse(localStorage.getItem("token"));
      const local = JSON.parse(localStorage.getItem("local"));
      const url = localStorage.getItem("url");

      const method = (opts.method || "GET").toUpperCase();
      const key = `${method}:${request + JSON.stringify(opts?.params || "")}`;
      const now = Date.now();
      const lastTime = lastRequests.get(key) || 0;

      // 🛡️ منع تكرار نفس الطلب خلال ثانية وحدة
      if (now - lastTime < 1000) {
        console.warn("⛔ Duplicate request blocked:", key);
        return {
          data: null,
          code: 429, // Too Many Requests
        };
      }
      lastRequests.set(key, now);

      const response = await $fetch.raw(request, {
        baseURL: url,
        headers: {
          language: locale.value || local || "ar",
          Authorization: `Bearer ${token?.value || "null"}`,
        },
        ...opts,
      });
      if (method) {
        if (method === "POST" && response.status === 200) {
        } else if (
          (method === "PUT" || method === "PATCH") &&
          response.status === 200
        ) {
        } else if (method === "DELETE" && response.status === 200) {
        }
      }

      return {
        data: response._data,
        code: response.status,
      };
    } catch (error) {
      if (error.response) {
        const status = error.response.status;
        const errorData = error.response._data;

        if (errorData?.errors?.length) {
        } else if (errorData?.message) {
        } else {
        }

        throw new Error(errorData?.message || `Request failed (${status})`);
      } else {
        throw new Error(error.message || "Network error");
      }
    } finally {
      setTimeout(() => {
        generalStore.requstLoading = false;
      }, 0);
    }
  } else {
    throw new Error("useServerAPI should only be used on the client side");
  }
};
