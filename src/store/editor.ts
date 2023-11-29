import { SkinEditor } from '@/modules/Editor'
import { defineStore } from 'pinia'
import { debounce } from '@/utils/js';
import { getColorSwatches, getSkin } from '@/utils/cache/localStorage';

export const useEditorStore = defineStore('editor', () => {

  let skineditor = ref<SkinEditor>(new SkinEditor());

  // 绘画工具
  const tool = ref<string>('brush');

  watch(
    tool, (newValue: string) => {
      console.log(newValue)
      skineditor.value.toolBox.changeTool(newValue);
    },
  )
  const zoom_in = ref(false);
  const zoom_out = ref(false);

  const move = ref(false);
  const center = ref(false);

  const undo = ref(true);
  const undoHistoryLength = ref<number>(0);
  watch(
    undoHistoryLength, (newValue: number, oldValue: number) => {
      if (newValue !== oldValue) {
        // console.log(newUndoHistoryLength);
        if ((newValue as number) > 0) {
          undo.value = false;
        }
        else if ((newValue as number) === 0) {
          undo.value = true;
        }
      }
    }
  )

  const redo = ref(true);
  const redoHistoryLength = ref<number>(0);
  watch(
    redoHistoryLength, (newValue: number, oldValue: number) => {
      if (newValue !== oldValue) {
        // console.log(newUndoHistoryLength);
        if ((newValue as number) > 0) {
          redo.value = false;
        }
        else if ((newValue as number) === 0) {
          redo.value = true;
        }
      }
    }
  )

  const modelItems = ['Steve', 'Alex'];
  const modelChangeTool = ref<any>();
  const model = ref('Steve')
  const modelSelect = ref(false);
  const modelChange = (model: string) => {
    modelSelect.value = true;
    skineditor.value.changeModel(model);
  }

  const poseItems = ['Default', 'Walk', 'Run', 'Hug', 'Fly']
  const pose = ref('Default')
  const poseChange = (pose: string) => {
    skineditor.value.changeStance(pose);
  }
  watch(
    pose, (newValue: string) => {
      poseChange(newValue);
    },
  )

  const switchGrid = ref(true);
  const switchGridChange = (switchGrid: boolean) => {
    skineditor.value.toggleGrid(switchGrid);
  }
  watch(
    switchGrid, (newValue: boolean) => {
      switchGridChange(newValue);
    },
  )

  const initSkineditor = (imageURL?: string) => {

    let skineditorValue: SkinEditor = new SkinEditor();

    skineditorValue.init();

    skineditorValue.initSkin(imageURL);

    skineditorValue.toolBox.changeTool(tool.value);

    skineditorValue.initSkinLoaded((curModel: string) => {
      model.value = curModel;
      skineditor.value = skineditorValue

      modelChangeTool.value = skineditor.value.modelChangeTool;
      modelChangeTool?.value.initModelLoaded((val: any) => {
        console.log(val);
        modelSelect.value = val;
      })
    })

    // History 每次操作完成的回调
    skineditorValue.toolBox.history.pushLoaded((undoHistoryLength_val: number, redoHistoryLength_val: number) => {
      undoHistoryLength.value = undoHistoryLength_val;
      redoHistoryLength.value = redoHistoryLength_val;
    })

    // dropper 吸取后回调
    skineditorValue.toolBox.dropper.dropperLoaded((color: any) => {
      dropperColorChange(color);
    })
  }

  const colorSwatches = ref<string[][]>(getColorSwatches() ? getColorSwatches() : [
    ['#FF0000', '#AA0000', '#550000'],
    ['#FFFF00', '#AAAA00', '#555500'],
    ['#00FF00', '#00AA00', '#005500'],
    ['#00FFFF', '#00AAAA', '#005555'],
    ['#0000FF', '#0000AA', '#000055'],
  ]);
  const color = ref<string>(colorSwatches.value[0][0]);
  watch(
    color, (newValue: string) => {
      shiftColorSwatches(newValue);
    },
  )
  const shiftColorSwatches = debounce((color: string) => {
    const colorSwatchesX = colorSwatches.value.length;
    const colorSwatchesY = colorSwatches.value[0].length;
    for (let i = colorSwatchesY - 1; i >= 0; i--) {
      for (let j = colorSwatchesX - 1; j >= 0; j--) {
        if (j === 0 && i == 0) {
          colorSwatches.value[0][0] = color;
        }
        else if (j === 0) {
          colorSwatches.value[j][i] = colorSwatches.value[colorSwatchesX - 1][i - 1];
        } else {
          colorSwatches.value[j][i] = colorSwatches.value[j - 1][i];
        }
      }
    }
  }, 500);

  // dropper 吸取后返回到调色板
  const dropperColorChange = (val: any) => {
    color.value = val
  }

  return {
    skineditor,
    initSkineditor,
    tool,
    zoom_in,
    zoom_out,
    move,
    center,
    undo,
    undoHistoryLength,
    redo,
    redoHistoryLength,
    poseItems,
    pose,
    modelItems,
    model,
    modelSelect,
    modelChange,
    switchGrid,
    color,
    colorSwatches,
    shiftColorSwatches
  }
})
