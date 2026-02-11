import { createApp } from 'vue'
import { createPinia } from 'pinia'
// 引入 Vant 组件库
import Vant from 'vant'
import 'vant/lib/index.css'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)
// 注册 Vant
app.use(Vant)

app.mount('#app')