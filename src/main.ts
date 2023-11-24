import { createApp } from 'vue'
import App from './App.vue'

// Plugins
import { registerPlugins } from '@/plugins'

// css
import "@/styles/index.scss"

import LocalizedFormat from 'dayjs/plugin/localizedFormat.js'
import dayjs from 'dayjs'
import FloatingVue from 'floating-vue'

// 创建vue实例
const app = createApp(App)

registerPlugins(app)

dayjs.extend(LocalizedFormat)

app.use(FloatingVue)

app.mount('#app')

