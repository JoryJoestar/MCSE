<script lang="ts" setup>

import { useTheme } from "@/hooks/useTheme"
import { getSkin, setSkin } from '@/utils/cache/localStorage';
import { useEditorStore } from '@/store/editor';

const { activeThemeName } = useTheme();

const canvas = ref();

const editorStore = useEditorStore();

const setSkinToLocalStorage = () => {
  let imageURL = editorStore.skineditor.skin.skinCanvas().toDataURL();
  setSkin(imageURL);
}

onMounted(() => {
  setTimeout(() => {
    getSkin() !== null ? editorStore.initSkineditor(getSkin()) : editorStore.initSkineditor();
  })

  // 监听页面离开时触发 保存皮肤到本地
  window.addEventListener('unload', setSkinToLocalStorage)

})

onUpdated(() => {
  window.addEventListener('unload', setSkinToLocalStorage)
  window.addEventListener('resize', editorStore.skineditor.onWindowResize);
})

onBeforeRouteLeave(() => {
  window.removeEventListener('unload', setSkinToLocalStorage);
  window.removeEventListener('resize', editorStore.skineditor.onWindowResize);
})

onUnmounted(() => {

})

</script>
<template>
  <v-card id="editorCanvas" :theme="activeThemeName">

    <div id="canvas" ref="canvas"></div>


    <div class="hidden">
      <form method="post" enctype="multipart/form-data" action="/" id="upgrade_form">
        <input type="file" id="upgrade_file" name="file">
      </form>
    </div>

  </v-card>
</template>

<style lang="scss" scoped>
#editorCanvas {
  height: 100%;
  width: 100%;
}
</style>
