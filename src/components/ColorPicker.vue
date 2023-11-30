<script lang="ts" setup>

import { useTheme } from "@/hooks/useTheme"
import { useEditorStore } from "@/store/editor";

const { activeThemeName } = useTheme()

const menu = ref(false);

const editorStore = useEditorStore();

const swatchStyle = computed(() => {
    return {
        backgroundColor: editorStore.color,
        cursor: 'pointer',
        height: '1.75rem',
        width: '1.75rem',
        borderRadius: '0.4rem',
        transition: 'all 300ms ease-in-out'
    }
})

// let colorEl: HTMLDivElement;
// let colorPickerEl: HTMLDivElement;

// const getColorPickerEl = () => {
//     if (!menu.value) {
//         setTimeout(() => {
//             colorPickerEl = document.querySelector('#colorPicker') as HTMLDivElement;
//             const colorPickerCanvas = colorPickerEl.querySelector('.v-color-picker-canvas');
//             if (colorPickerCanvas) {
//                 colorPickerCanvas.addEventListener('mouseup', () => {
//                     editorStore.skineditor.changeColor(editorStore.color);
//                 })
//             }
//         }, 300)
//     }
// }

onMounted(() => {
    // colorEl = document.querySelector('#color') as HTMLDivElement;
    // if (colorEl) {
    //     colorEl.addEventListener('mousedown', getColorPickerEl)
    // }
})

onUnmounted(() => {
    // colorEl.removeEventListener('mousedown', getColorPickerEl)
})
</script>

<template>
    <div class="colorPicker">
        <v-menu v-model="menu" :close-on-content-click="false" :theme="activeThemeName">
            <template v-slot:activator="{ props }">
                <div class="pickerBody">
                    <v-text-field variant="outlined" class="pickerBody-pickerHex" v-model="editorStore.color">
                        <template v-slot:prepend-inner>
                            <v-btn variant="text" mr-2>
                                <div id="color" :style="swatchStyle" v-bind="props"></div>
                            </v-btn>
                        </template>
                    </v-text-field>
                </div>
            </template>
            <v-color-picker mt-2 id="colorPicker" show-swatches :modes="['hex']" :swatches="editorStore.colorSwatches"
                v-model="editorStore.color" flat />
        </v-menu>
    </div>
</template>

<style lang="scss" scoped>
.pickerBody {
    display: flex;
    justify-content: start;
    align-items: center;
    padding: .5rem;

    .v-btn {
        background: transparent !important;
        padding: 0.4rem !important;
        height: auto !important;
    }
}
</style>
 