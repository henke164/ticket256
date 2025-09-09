import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import './assets/styles.css';

import 'highlight.js/lib/common';
import hljs from 'highlight.js/lib/core';
import javascript from 'highlight.js/lib/languages/javascript';
import hljsVuePlugin from "@highlightjs/vue-plugin";

hljs.registerLanguage('javascript', javascript);

createApp(App)
  .use(hljsVuePlugin)
  .use(router)
  .mount('#app');
