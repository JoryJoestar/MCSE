import { SkinEditor } from '@/modules/Editor'
import { defineStore } from 'pinia'
import Bus from '@/utils/Bus';

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
  const brightness_up = ref(true);
  const brightness_down = ref(true);

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

      initColor();

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

  const color = ref<string>('');
  const colorIndex = ref<number>(0);
  // 随机产生颜色
  const RandomColor = () => {
    return Array(6).fill(1).reduce(v => {
      return v + (~~(Math.random() * 16)).toString(16);
    }, "#")
  }
  const colorItems = [
    {
      "index": 0,
      "color": ref<string>(RandomColor()),
    },
    {
      "index": 1,
      "color": ref<string>(RandomColor()),
    },
    {
      "index": 2,
      "color": ref<string>(RandomColor()),
    },
    {
      "index": 3,
      "color": ref<string>(RandomColor()),
    },
    {
      "index": 4,
      "color": ref<string>(RandomColor()),
    },
    {
      "index": 5,
      "color": ref<string>(RandomColor()),
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
    let param = {
      index: colorIndex.value,
      color: color
    }

    Bus.emit(`dropperColorChangeEmit${colorIndex.value}`, param);

    colorChange({ color: color });
  }

  // 修改选择当亲颜色的值
  const colorChange = (param: any) => {
    color.value = param.color;
    colorItems[colorIndex.value].color.value = param.color;
    skineditor.value.changeColor(color.value);
  }

  const initColor = () => {
    // 初始化颜色
    colorIndexChange({ index: 0 })
    colorChange({ color: colorItems[colorIndex.value].color.value });

  }


  return {
    skineditor,
    initSkineditor,
    tool,
    brightness_up,
    brightness_down,
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
    colorIndex,
    colorItems,
    colorIndexChange,
    colorChange,
    initColor,
  }
})
