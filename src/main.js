import "./assets/main.css";
import "vue3-toastify/dist/index.css";
// import { ToastContainer, toast } from "vue3-toastify";

import { createApp } from "vue";
import App from "./App.vue";

const app = createApp(App);
// app.component("ToastContainer", ToastContainer);
app.mount("#app");
