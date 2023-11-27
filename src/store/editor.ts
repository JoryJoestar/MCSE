import { SkinEditor } from '@/modules/Editor'
import { defineStore } from 'pinia'

export const useEditorStore = defineStore('editor', () => {
  let skineditor = ref<SkinEditor>(new SkinEditor());

  // 绘画工具
  const tool = ref<string>('brush');

  const brightness_up = ref(true);
  const brightness_down = ref(true);

  const zoom_in = ref(false);
  const zoom_out = ref(false);

  const move = ref(false);
  const center = ref(false);

  const undo = ref(true);
  const undoHistoryLength = ref<number>(0);
  const redo = ref(true);
  const redoHistoryLength = ref<number>(0);

  watch(
    tool, (newValue: string) => {
      console.log(newValue)
      skineditor.value.toolBox.changeTool(newValue);
    },
  )


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

  const setSkinEditor = (skineditor: SkinEditor): void => {
    skineditor = skineditor;
  }


  return {
    skineditor,
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
    setSkinEditor
  }
})
