<script lang="ts" setup>
import Bus from '@/utils/Bus';
import { useTheme } from "@/hooks/useTheme"
import { SkinEditor } from '@/modules/Editor';
import { getSkin, setSkin } from '@/utils/cache/localStorage';

import { useEditorStore } from '@/store/editor';

const canvas = ref();

const editorStore = useEditorStore();
const editorState = storeToRefs(editorStore);

let skineditor: SkinEditor;

const color = ref<string>('');
const colorIndex = ref<number>(0);
// 随机产生颜色
const RandomColor = () => {
  return Array(6).fill(1).reduce(v => {
    return v + (~~(Math.random() * 16)).toString(16);
  }, "#")
}

const { activeThemeName } = useTheme()

const colorItems = [
  {
    "index": 0,
    "color": ref(RandomColor()),
  },
  {
    "index": 1,
    "color": ref(RandomColor()),
  },
  {
    "index": 2,
    "color": ref(RandomColor()),
  },
  {
    "index": 3,
    "color": ref(RandomColor()),
  },
  {
    "index": 4,
    "color": ref(RandomColor()),
  },
  {
    "index": 5,
    "color": ref(RandomColor()),
  },
]

// 修改当选颜色Active
const colorIndexChange = (param: any) => {
  Bus.emit(`colorIndexChangeEmit${colorIndex.value}`, false);

  Bus.emit(`colorIndexChangeEmit${param.index}`, true);

  colorIndex.value = param.index;
}

// dropper 吸取后返回到调色板
const dropperColorChange = (color: any) => {
  console.log(color);
  let param = {
    index: colorIndex.value,
    color: color
  }

  Bus.emit(`dropperColorChangeEmit${colorIndex.value}`, param);

  colorChange({ color: color });
}
// 修改选择当亲颜色的值
const colorChange = (param: any) => {
  // console.log(param.color);
  color.value = param.color;
  colorItems[colorIndex.value].color.value = param.color;
  skineditor.changeColor(color.value);
}

let modelChangeTool: any;
const model = ref('Steve')
const modelItems = ['Steve', 'Alex'];
const modelChange = (model: string) => {
  modelSelect.value = true;
  skineditor.changeModel(model);
}
const modelSelect = ref(false);

const pose = ref('Default')
const poseItems = ['Default', 'Walk', 'Run', 'Hug', 'Fly']

const poseChange = (pose: string) => {
  // console.log(pose)
  skineditor.changeStance(pose);
}

const switchGrid = ref(true);

const switchGridChange = (switchGrid: boolean) => {
  // console.log(switchGrid)

  skineditor.toggleGrid(switchGrid);
}



const initSkineditor = async (imageURL?: string) => {

  skineditor = new SkinEditor();

  await skineditor.init();

  await skineditor.initSkin(imageURL);

  skineditor.initSkinLoaded((curModel: string, curTool: string) => {
    model.value = curModel;
    editorState.tool.value = curTool;

    editorStore.setSkinEditor(skineditor);

    modelChangeTool = skineditor.modelChangeTool;
    modelChangeTool?.initModelLoaded((val: any) => {
      console.log(val);
      modelSelect.value = val;
    })
  })

  // History 每次操作完成的回调
  skineditor.toolBox.history.pushLoaded((undoHistoryLength_val: number, redoHistoryLength_val: number) => {
    editorState.undoHistoryLength.value = undoHistoryLength_val;
    editorState.redoHistoryLength.value = redoHistoryLength_val;
  })

  // dropper 吸取后回调
  skineditor.toolBox.dropper.dropperLoaded((color: any) => {
    dropperColorChange(color);
  })



}

const setSkinToLocalStorage = () => {
  let imageURL = skineditor.skin.skinCanvas().toDataURL();
  setSkin(imageURL);
}

onMounted(() => {
  let imageURL = getSkin();

  if (imageURL !== null) {
    initSkineditor(imageURL);
  } else {
    initSkineditor();
  }


  // 初始化颜色
  colorIndexChange({ index: 0 })
  colorChange({ color: colorItems[colorIndex.value].color.value });

  // 监听页面离开时触发 保存皮肤到本地
  window.addEventListener('unload', setSkinToLocalStorage)

})

onUpdated(() => {
  window.addEventListener('unload', setSkinToLocalStorage)
  window.addEventListener('resize', skineditor.onWindowResize);
})

onBeforeRouteLeave(() => {
  window.removeEventListener('unload', setSkinToLocalStorage);
  window.removeEventListener('resize', skineditor.onWindowResize);
})

onUnmounted(() => {

})




watch(
  () => [pose.value, switchGrid.value],
  (
    [newPose, newSwitchGrid],
    [oldPose, oldSwitchGrid]
  ) => {

    if (newPose !== oldPose) {
      poseChange((newPose as string));
    }
    if (newSwitchGrid !== oldSwitchGrid) {
      switchGridChange((newSwitchGrid as boolean));
    }
  },
)
</script>
<template>
  <div class="Editor">
    <v-row no-gutters justify="center">
      <v-card id="skineditor" :theme="activeThemeName">
        <v-col cols="12">
          <v-row no-gutters class="skin-controls">
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
          </v-row>
        </v-col>



        <v-col cols="12">
          <v-row no-gutters class="editor-controls d-flex justify-space-between align-center">




          </v-row>
        </v-col>

        <v-col cols="12">
          <v-row no-gutters>
            <v-col cols="2" v-for="item in colorItems" class="color-controls flex flex-justify-center flex-items-center"
              h-3rem>
              <ColorPicker :key="item.index" :index="item.index" :active="colorIndex" :InitialColor="item.color.value"
                @colorIndexChangeEmit="colorIndexChange" @colorChangeEmit="colorChange">
              </ColorPicker>
            </v-col>
          </v-row>
        </v-col>

        <v-col cols="12">
          <v-row class="model-controls d-flex align-center justify-start">
            <v-col cols="4">
              <v-select class="" :items="modelItems" label="模型" variant="outlined" v-model="model" :disabled="modelSelect"
                @update:modelValue="modelChange"></v-select>
            </v-col>
            <v-col cols="4">
              <v-select class="" :items="poseItems" label="姿势" variant="outlined" v-model="pose"></v-select>
            </v-col>
            <v-col cols="2">
              <v-switch v-model="switchGrid" inset prepend-icon="fas fa-border-all">
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
    </v-row>
  </div>
</template>

<style lang="scss" scoped>
</style>
