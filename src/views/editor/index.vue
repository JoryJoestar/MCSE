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

    <div id="bodyparts" class="selector">
      <div class="bodyparts">
        <span>Body</span>
        <div class="bodypart head" data-bodypart="head" data-layer="base"></div>
        <div class="bodypart torso" data-bodypart="torso" data-layer="base"></div>
        <div class="bodypart arm_left" data-bodypart="left_arm" data-layer="base">
        </div>
        <div class="bodypart arm_right" data-bodypart="right_arm" data-layer="base">
        </div>
        <div class="bodypart leg_left" data-bodypart="left_leg" data-layer="base">
        </div>
        <div class="bodypart leg_right" data-bodypart="right_leg" data-layer="base">
        </div>
      </div>
      <div class="bodyparts">
        <span>Overlay</span>
        <div class="bodypart head hidden" data-bodypart="head" data-layer="overlay">
        </div>
        <div class="bodypart torso hidden" data-bodypart="torso" data-layer="overlay">
        </div>
        <div class="bodypart arm_left hidden" data-bodypart="left_arm" data-layer="overlay">
        </div>
        <div class="bodypart arm_right hidden" data-bodypart="right_arm" data-layer="overlay">
        </div>
        <div class="bodypart leg_left hidden" data-bodypart="left_leg" data-layer="overlay">
        </div>
        <div class="bodypart leg_right hidden" data-bodypart="right_leg" data-layer="overlay">
        </div>
      </div>
    </div>

    <div class="toggle-select">
      <v-btn class="body-selector">
        <v-icon>mdi-Account-Supervisor</v-icon>
        Body &amp; Overlay
      </v-btn>

      <div class="selector-overlay" style="display: none;">
        <div class="bodyparts">
          <span>Body</span>
          <div class="bodypart head" data-bodypart="head" data-layer="base"></div>
          <div class="bodypart torso" data-bodypart="torso" data-layer="base">
          </div>
          <div class="bodypart arm_left" data-bodypart="left_arm" data-layer="base">
          </div>
          <div class="bodypart arm_right" data-bodypart="right_arm" data-layer="base">
          </div>
          <div class="bodypart leg_left" data-bodypart="left_leg" data-layer="base">
          </div>
          <div class="bodypart leg_right" data-bodypart="right_leg" data-layer="base">
          </div>
        </div>
        <div class="bodyparts">
          <span>Overlay</span>
          <div class="bodypart head hidden" data-bodypart="head" data-layer="overlay">
          </div>
          <div class="bodypart torso hidden" data-bodypart="torso" data-layer="overlay"></div>
          <div class="bodypart arm_left hidden" data-bodypart="left_arm" data-layer="overlay">
          </div>
          <div class="bodypart arm_right hidden" data-bodypart="right_arm" data-layer="overlay">
          </div>
          <div class="bodypart leg_left hidden" data-bodypart="left_leg" data-layer="overlay">
          </div>
          <div class="bodypart leg_right hidden" data-bodypart="right_leg" data-layer="overlay">
          </div>
        </div>
      </div>
    </div>




    <v-col cols="12">
      <v-row no-gutters class="editor-controls d-flex justify-space-between align-center">




      </v-row>
    </v-col>

    <v-col cols="12">
      <v-row no-gutters>
        <v-col cols="2" v-for="item in editorStore.colorItems"
          class="color-controls flex flex-justify-center flex-items-center" h-3rem>
          <ColorPicker :key="item.index" :index="item.index" :active="editorStore.colorIndex" :InitialColor="item.color"
            @colorIndexChangeEmit="editorStore.colorIndexChange" @colorChangeEmit="editorStore.colorChange">
          </ColorPicker>
        </v-col>
      </v-row>
    </v-col>

    <v-col cols="12">
      <v-row class="model-controls d-flex align-center justify-start">
        <v-col cols="4">
          <v-select class="" :items="editorStore.modelItems" label="模型" variant="outlined" v-model="editorStore.model"
            :disabled="editorStore.modelSelect" @update:modelValue="editorStore.modelChange"></v-select>
        </v-col>
        <v-col cols="4">
          <v-select class="" :items="editorStore.poseItems" label="姿势" variant="outlined"
            v-model="editorStore.pose"></v-select>
        </v-col>
        <v-col cols="2">
          <v-switch v-model="editorStore.switchGrid" inset prepend-icon="fas fa-border-all">
          </v-switch>
        </v-col>

        <div class="hidden">
          <form method="post" enctype="multipart/form-data" action="/" id="upgrade_form">
            <input type="file" id="upgrade_file" name="file">
          </form>
        </div>
      </v-row>
    </v-col>
  </v-card>
</template>

<style lang="scss" scoped>
#editorCanvas {
  height: 100%;
  width: 100%;
}
</style>
