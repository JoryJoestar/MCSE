<script lang="ts" setup>
import Bus from '@/utils/Bus';
import { useTheme } from "@/hooks/useTheme"
import { SkinEditor } from '@/modules/MCSkinEditor';
import { getSkin, setSkin } from '@/utils/cache/localStorage';

let skineditor: SkinEditor;
const canvas = ref();

// 保存皮肤
const saveSkin = () => {
  console.log('保存皮肤');
}
// 上传皮肤
const uploadSkin = () => {
  console.log('上传皮肤');
}

const resetSkin = () => {

  skineditor.resetSkin()
  // console.log('重置皮肤')

}

// 绘画工具
const tool = ref<string>('');
const toolChange = (tool: String) => {
  skineditor.toolBox.changeTool(tool);
}
// 编辑器功能
const toolBox = ref<string>('');
const toolBoxChange = (toolBox: String) => {
  console.log(toolBox)
}
const brightness_up = ref(true);
const brightness_down = ref(true);
const zoom_in = ref(false);
const zoom_out = ref(false);
const move = ref(false);
const center = ref(false);
const undoHistoryLength = ref<number>(0);
const undo = ref(true);
const redoHistoryLength = ref<number>(0);
const redo = ref(true);

const color = ref<string>('');
const colorIndex = ref<number>(0);
// 随机产生颜色
const RandomColor = () => {
  return Array(6).fill(1).reduce(v => {
    return v + (~~(Math.random() * 16)).toString(16);
  }, "#")
}

const { activeThemeName } = useTheme()

// console.log('activeTheme', activeThemeName)

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



const initSkineditor = (imageURL?: string) => {

  skineditor = new SkinEditor();

  skineditor.init();

  skineditor.initSkin(imageURL);

  skineditor.initSkinLoaded((curModel: string, curTool: string) => {
    tool.value = curTool;
    model.value = curModel;

    modelChangeTool = skineditor.modelChangeTool;
    modelChangeTool?.initModelLoaded((val: any) => {
      console.log(val);
      modelSelect.value = val;
    })
  })


  // History 每次操作完成的回调
  skineditor.toolBox.history.pushLoaded((undoHistoryLength_val: number, redoHistoryLength_val: number) => {
    undoHistoryLength.value = undoHistoryLength_val;
    redoHistoryLength.value = redoHistoryLength_val;
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
  () => [tool.value, toolBox.value, colorIndex.value, model.value, pose.value, switchGrid.value, undoHistoryLength.value, redoHistoryLength.value],
  (
    [newTool, newToolBox, newColorIndex, newModel, newPose, newSwitchGrid, newUndoHistoryLength, newRedoHistoryLength],
    [oldTool, oldToolBox, oldColorIndex, oldModel, oldPose, oldSwitchGrid, oldUndoHistoryLength, oldRedoHistoryLength]
  ) => {
    if (newTool !== oldTool) {
      toolChange((newTool as string))
    }
    if (newToolBox !== oldToolBox) {
      toolBoxChange((newToolBox as string))
    }

    if (newColorIndex !== oldColorIndex) {
      console.log();
    }
    if (newModel !== oldModel) {

    }
    if (newPose !== oldPose) {
      poseChange((newPose as string));
    }
    if (newSwitchGrid !== oldSwitchGrid) {
      switchGridChange((newSwitchGrid as boolean));
    }
    if (newUndoHistoryLength !== oldUndoHistoryLength) {
      // console.log(newUndoHistoryLength);
      if ((newUndoHistoryLength as number) > 0) {
        undo.value = false;
      }
      else if ((newUndoHistoryLength as number) === 0) {
        undo.value = true;
      }
    }
    if (newRedoHistoryLength !== oldRedoHistoryLength) {
      if ((newRedoHistoryLength as number) > 0) {
        redo.value = false;
      }
      else if ((newRedoHistoryLength as number) === 0) {
        redo.value = true;
      }
    }

  },
)
</script>
<template>
  <div class="MCSkinEditor">
    <v-row no-gutters justify="center">
      <v-card id="skineditor" :theme="activeThemeName">
        <v-col>
          <v-row class="bar-controls" justify="center">
            <v-col>
              <v-btn class="control upgrade" width="100%">加载皮肤</v-btn>
            </v-col>
            <v-col>
              <v-btn class="control download" width="100%">
                下载皮肤</v-btn>
            </v-col>
            <v-col>
              <v-btn class="control save" width="100%" @click="saveSkin">保存皮肤</v-btn>
            </v-col>
            <v-col>
              <v-btn class="control upload" width="100%" @click="uploadSkin">上传皮肤</v-btn>
            </v-col>
            <v-col>
              <v-btn class="control upload" width="100%" @click="resetSkin">重置皮肤</v-btn>
            </v-col>
          </v-row>
        </v-col>

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
            <v-btn-toggle v-model="tool" tile group mandatory>
              <v-tooltip location="top">
                <template v-slot:activator="{ props }">
                  <v-btn value="brush" icon class="brush tool" data-toggle="tooltip" data-placement="top" v-bind="props">
                    <v-icon>fas fa-paintbrush</v-icon>
                  </v-btn>
                </template>
                <span>画笔</span>
              </v-tooltip>

              <v-tooltip location="top">
                <template v-slot:activator="{ props }">
                  <v-btn value="dropper" icon class="dropper tool" data-toggle="tooltip" data-placement="top"
                    v-bind="props">
                    <v-icon>fas fa-eye-dropper</v-icon>
                  </v-btn>
                </template>
                <span>吸取颜色</span>
              </v-tooltip>

              <v-tooltip location="top">
                <template v-slot:activator="{ props }">
                  <v-btn value="bucket" icon class="bucket tool" data-toggle="tooltip" data-placement="top" title="Fill"
                    v-bind="props">
                    <v-icon>fas fa-fill</v-icon>
                  </v-btn>
                </template>
                <span>填充</span>
              </v-tooltip>

              <v-tooltip location="top">
                <template v-slot:activator="{ props }">
                  <v-btn value="eraser" icon class="eraser tool" data-toggle="tooltip" data-placement="top" title="Eraser"
                    v-bind="props">
                    <v-icon>fas fa-eraser</v-icon>
                  </v-btn>
                </template>
                <span>橡皮擦</span>
              </v-tooltip>
            </v-btn-toggle>

            <v-tooltip location="top">
              <template v-slot:activator="{ props }">
                <div v-bind="props">
                  <v-btn value="brightness-up" icon variant="text" class="brightness-up" data-toggle="tooltip"
                    data-placement="top" title="Increase brightness" :disabled="brightness_up">
                    <v-icon>fas fa-lightbulb</v-icon>
                  </v-btn>
                </div>
              </template>
              <span>提高颜色亮度</span>
            </v-tooltip>

            <v-tooltip location="top">
              <template v-slot:activator="{ props }">
                <v-btn value="brightness-down" icon variant="text" class="brightness-down" data-toggle="tooltip"
                  data-placement="top" title="Decrease brightness" v-bind="props" :disabled="brightness_down">
                  <v-icon>fa-regular fa-lightbulb</v-icon>
                </v-btn>
              </template>
              <span>降低颜色亮度</span>
            </v-tooltip>

            <v-tooltip location="top">
              <template v-slot:activator="{ props }">
                <v-btn value="zoom-in" icon variant="text" class="zoom-in" data-toggle="tooltip" data-placement="top"
                  title="Zoom in" v-bind="props" :disabled="zoom_in">
                  <v-icon>fas fa-magnifying-glass-plus</v-icon>
                </v-btn>
              </template>
              <span>放大</span>
            </v-tooltip>

            <v-tooltip location="top">
              <template v-slot:activator="{ props }">
                <v-btn value="zoom-out" icon variant="text" class="zoom-out" data-toggle="tooltip" data-placement="top"
                  title="Zoom out" v-bind="props" :disabled="zoom_out">
                  <v-icon>fas fa-magnifying-glass-minus</v-icon>
                </v-btn>
              </template>
              <span>缩小</span>
            </v-tooltip>

            <v-tooltip location="top">
              <template v-slot:activator="{ props }">
                <v-btn value="move" icon variant="text" class="move" data-toggle="tooltip" data-placement="top"
                  title="Move skin" v-bind="props" :disabled="move">
                  <v-icon>fas fa-up-down-left-right</v-icon>
                </v-btn>
              </template>
              <span>移动人物</span>
            </v-tooltip>

            <v-tooltip location="top">
              <template v-slot:activator="{ props }">
                <v-btn value="center" icon variant="text" class="center" data-toggle="tooltip" data-placement="top"
                  title="Reset view" v-bind="props" :disabled="center">
                  <v-icon>fas fa-arrows-to-dot</v-icon>
                </v-btn>
              </template>
              <span>回到中心</span>
            </v-tooltip>

            <v-tooltip location="top" class="undo-tooltip">
              <template v-slot:activator="{ props }">
                <div v-bind="props">
                  <v-btn value="undo" icon variant="text" class="undo" data-toggle="tooltip" data-placement="top"
                    title="Undo" :disabled="undo">
                    <v-icon>fas fa-rotate-left</v-icon>
                  </v-btn>
                </div>
              </template>
              <span>撤销</span>
            </v-tooltip>

            <v-tooltip location="top" class="redo-tooltip">
              <template v-slot:activator="{ props }">
                <div v-bind="props">
                  <v-btn value="redo" icon variant="text" class="redo" data-toggle="tooltip" data-placement="top"
                    title="Redo" :disabled="redo">
                    <v-icon>fas fa-rotate-right</v-icon>
                  </v-btn>
                </div>
              </template>
              <span>重做</span>
            </v-tooltip>
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
