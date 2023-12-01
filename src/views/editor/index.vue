<script lang="ts" setup>

import { useTheme } from "@/hooks/useTheme"
import { getControlsHistory, getDraftHistory, setColorSwatches, setDraftHistory } from '@/utils/cache/localStorage';
import { useEditorStore } from '@/store/editor';

const { activeThemeName } = useTheme();

const canvas = ref();

const editorStore = useEditorStore();

const setColorSwatchesTLS = () => {
  setColorSwatches(editorStore.colorSwatches)
}

const setControlsHistoryTLS = () => {
  // setControlsHistory({
  //   undo_History: JSON.stringify(editorStore.skineditor.toolBox.history.undoHistoryJSON),
  //   redo_History: JSON.stringify(editorStore.skineditor.toolBox.history.redoHistoryJSON)
  // })
}

const setDraftHistoryTLS = () => {
  editorStore.saveDraft()
  setDraftHistory(editorStore.draftHistory)
}

onMounted(() => {
  setTimeout(() => {
    getControlsHistory() ? editorStore.skineditor.toolBox.history.setCacheHistory(getControlsHistory()) : null
    getDraftHistory() ? editorStore.draftHistory = getDraftHistory() : []
    editorStore.draftHistory.length > 0 ? editorStore.initSkineditor(editorStore.draftHistory[0].skin) : editorStore.initSkineditor()

  })

  // 监听页面离开时触发 保存皮肤到本地

  window.addEventListener('unload', setColorSwatchesTLS)
  window.addEventListener('unload', setControlsHistoryTLS)
  window.addEventListener('unload', setDraftHistoryTLS)
})

onUpdated(() => {
  window.addEventListener('unload', setColorSwatchesTLS)
  window.addEventListener('unload', setControlsHistoryTLS)
  window.addEventListener('unload', setDraftHistoryTLS)
  window.addEventListener('resize', editorStore.skineditor.onWindowResize);
})

onBeforeRouteLeave(() => {

  window.removeEventListener('unload', setColorSwatchesTLS)
  window.removeEventListener('unload', setControlsHistoryTLS)
  window.removeEventListener('unload', setDraftHistoryTLS)
  window.removeEventListener('resize', editorStore.skineditor.onWindowResize);
})

onUnmounted(() => {

  window.removeEventListener('unload', setColorSwatchesTLS)
  window.removeEventListener('unload', setControlsHistoryTLS)
  window.removeEventListener('unload', setDraftHistoryTLS)
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

    <v-snackbar v-model="editorStore.snackBar" timeout="3000" location="top"> 
      {{ editorStore.snackBarMsg }}
    </v-snackbar>

  </v-card>
</template>

<style lang="scss" scoped>
#editorCanvas {
  height: 100%;
  width: 100%;
}
</style>
