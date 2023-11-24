import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

import { fileURLToPath } from 'url';
import { basename, dirname, resolve } from 'node:path'

// 引入Unocss
import Unocss from 'unocss/vite';

// page
import Pages from 'vite-plugin-pages';

// 引入vuetify
import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify';

// 自动引入
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'

import fs from 'fs-extra'

// https://vitejs.dev/config/
export default defineConfig({
  base: process.env.NODE_ENV === 'production' ? `./` : './',

  css: {
    preprocessorOptions: {
      scss: {
        additionalData: '@import "@/styles/variables.scss";',
      },
    },
  },


  plugins: [
    vue({
      template: { transformAssetUrls },
      include: [/\.vue$/],
      reactivityTransform: true,
      script: {
        defineModel: true,
      },
    }),

    Unocss(),

    vuetify({
      autoImport: true,
    }),

    AutoImport({
      imports: ['vue', '@vueuse/core', 'vue-router', 'pinia', '@vueuse/head'],
      exclude: [
        '**/dist/**',
      ],
      dts: true,
      vueTemplate: true,
    }),

    Components({
      extensions: ['vue', 'md'],
      dts: true,
      include: [/\.vue$/, /\.vue\?vue/, /\.md$/],
      dirs: ['./src/components', './src/layout'],
    }),

    Pages({
      extensions: ['vue'],

      dirs: [
        'src/views',
        { dir: 'src/views/home', baseRoute: '' },
        { dir: 'src/views/mcskineditor', baseRoute: 'mcskineditor' },
        { dir: 'src/views/market', baseRoute: 'market' },
      ],

      extendRoute(route) {
        const path = resolve(__dirname, route.component.slice(1))

        route.meta = Object.assign(route.meta || {}, { frontmatter: {} })

        if (route.path === '/404') {
          return {
            ...route,
            name: '404',
            component: '/src/views/error/404.vue'
          }
        }
        else {
          return {
            path: '/website',
            component: '/src/layout/index.vue',
            children: [
              {
                ...route,
              },
            ],
          }
        }
      }

    })


  ],

  define: { 'process.env': {} },

  resolve: {
    //设置别名
    alias: {
      // '@': path.resolve(__dirname, 'src'),
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
    extensions: [
      '.js',
      '.json',
      '.jsx',
      '.mjs',
      '.ts',
      '.tsx',
      '.vue',
    ],
  },

  server: {
    port: 8080, //启动端口
    hmr: {
      host: '127.0.0.1',
      port: 8080
    },
    // 设置 https 代理
    proxy: {
      '/api': {
        target: 'your https address',
        changeOrigin: true,
        rewrite: (path: string) => path.replace(/^\/api/, '')
      }
    },
  },

  optimizeDeps: {
    exclude: ['vuetify'],
    entries: [
      './src/**/*.vue',
    ],
  },

  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    chunkSizeWarningLimit: 1500,
    rollupOptions: {
      treeshake: true,
      output: {
        // 缩小打包体积
        minifyInternalExports: true,
        manualChunks: (id) => {
          // 将 node_modules 中的代码单独打包成一个 JS 文件
          // hash code 不变，浏览器将缓存 node_modules 的文件
          if (id.includes('node_modules')) {
            if (/.*\.css$/.test(id)) {
              // 匹配是否将node_modules 中css打包
              console.log('css', id)
            }
            return 'vendor'
          }
        },

      }
    },
  }


})
