<script lang="ts" setup>
import { useEditorStore } from '@/store/editor';
import { useTheme } from "@/hooks/useTheme"

const editorStore = useEditorStore();

const { isDark, toggleDark, activeThemeName } = useTheme()

const downloadDialog = ref<boolean>(false)

onMounted(() => { })

</script>
<template>
    <v-toolbar density="compact" :theme="activeThemeName" class="top-bar">
        <v-btn ripple variant="text" id="menu-btn">
            <v-icon icon="fa-solid fa-bars"></v-icon>
        </v-btn>

        <v-menu activator="#menu-btn" class="menu">
            <v-list mt-2 class="menu-list" min-w-64>
                <v-list-item value="file" id="file">
                    <template v-slot:prepend>
                        文件
                    </template>

                    <template v-slot:append>
                        <v-icon size="sm">
                            <i class="fa-solid fa-chevron-right"></i>
                        </v-icon>
                    </template>
                    <v-menu activator="parent" open-on-hover location="end">
                        <v-list class="menu-list" min-w-64 ml-2>
                            <v-list-item value="upload" class="upload" @click="editorStore.skineditor.uploadSkin()">
                                <template v-slot:prepend>
                                    加载
                                </template>
                            </v-list-item>
                            <v-list-item value="reset" class="reset" @click="editorStore.skineditor.resetSkin()">
                                <template v-slot:prepend>
                                    重置
                                </template>
                            </v-list-item>
                            <v-list-item value="saveDraft" class="saveDraft" @click="editorStore.saveDraft()">
                                <template v-slot:prepend>
                                    保存
                                </template>
                            </v-list-item>
                            <v-list-item value="download" class="download" @click="downloadDialog = !downloadDialog">
                                <template v-slot:prepend>
                                    下载
                                </template>
                            </v-list-item>

                        </v-list>
                    </v-menu>
                </v-list-item>
            </v-list>
        </v-menu>

        <v-spacer></v-spacer>

        <v-btn-toggle v-model="editorStore.tool" tile group mandatory>
            <v-tooltip>
                <template v-slot:activator="{ props }">
                    <v-btn ripple value="brush" icon class="brush tool" data-toggle="tooltip" data-placement="top"
                        v-bind="props">
                        <v-icon size="small">fas fa-paintbrush</v-icon>
                    </v-btn>
                </template>
                <span>画笔</span>
            </v-tooltip>

            <v-tooltip>
                <template v-slot:activator="{ props }">
                    <v-btn ripple value="dropper" icon class="dropper tool" data-toggle="tooltip" data-placement="top"
                        v-bind="props">
                        <v-icon size="small">fas fa-eye-dropper</v-icon>
                    </v-btn>
                </template>
                <span>吸取颜色</span>
            </v-tooltip>

            <v-tooltip>
                <template v-slot:activator="{ props }">
                    <v-btn ripple value="bucket" icon class="bucket tool" data-toggle="tooltip" data-placement="top"
                        title="Fill" v-bind="props">
                        <v-icon size="small">fas fa-fill</v-icon>
                    </v-btn>
                </template>
                <span>填充</span>
            </v-tooltip>

            <v-tooltip>
                <template v-slot:activator="{ props }">
                    <v-btn ripple value="eraser" icon class="eraser tool" data-toggle="tooltip" data-placement="top"
                        title="Eraser" v-bind="props">
                        <v-icon size="small">fas fa-eraser</v-icon>
                    </v-btn>
                </template>
                <span>橡皮擦</span>
            </v-tooltip>
        </v-btn-toggle>

        <v-tooltip location="top">
            <template v-slot:activator="{ props }">
                <v-btn ripple value="zoom-in" variant="text" class="zoom-in" data-toggle="tooltip" data-placement="top"
                    title="Zoom in" v-bind="props" :disabled="editorStore.zoom_in">
                    <v-icon size="large">fas fa-magnifying-glass-plus</v-icon>
                </v-btn>
            </template>
            <span>放大</span>
        </v-tooltip>

        <v-tooltip location="top">
            <template v-slot:activator="{ props }">
                <v-btn ripple value="zoom-out" variant="text" class="zoom-out" data-toggle="tooltip" data-placement="top"
                    title="Zoom out" v-bind="props" :disabled="editorStore.zoom_out">
                    <v-icon size="large">fas fa-magnifying-glass-minus</v-icon>
                </v-btn>
            </template>
            <span>缩小</span>
        </v-tooltip>

        <v-tooltip location="top">
            <template v-slot:activator="{ props }">
                <v-btn ripple value="center" variant="text" class="center" data-toggle="tooltip" data-placement="top"
                    title="Reset view" v-bind="props" :disabled="editorStore.center">
                    <v-icon size="large"><i class="fa-solid fa-location-crosshairs"></i></v-icon>
                </v-btn>
            </template>
            <span>回到中心</span>
        </v-tooltip>

        <v-tooltip location="top" class="undo-tooltip">
            <template v-slot:activator="{ props }">
                <div v-bind="props">
                    <v-btn ripple value="undo" variant="text" class="undo" data-toggle="tooltip" data-placement="top"
                        title="Undo" :disabled="editorStore.undo">
                        <v-icon size="large">fas fa-rotate-left</v-icon>
                    </v-btn>
                </div>
            </template>
            <span>撤销</span>
        </v-tooltip>

        <v-tooltip location="top" class="redo-tooltip">
            <template v-slot:activator="{ props }">
                <div v-bind="props">
                    <v-btn ripple value="redo" variant="text" class="redo" data-toggle="tooltip" data-placement="top"
                        title="Redo" :disabled="editorStore.redo">
                        <v-icon size="large">fas fa-rotate-right</v-icon>
                    </v-btn>
                </div>
            </template>
            <span>重做</span>
        </v-tooltip>

        <v-spacer></v-spacer>

        <v-btn ripple variant="text" @click="toggleDark">
            <v-icon :icon="`${isDark ? 'fas fa-moon' : 'fas fa-sun'}`"></v-icon>
        </v-btn>

        <v-dialog v-model="downloadDialog" class="downloadDialog">
            <v-toolbar>
                <v-toolbar-title>导出</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-btn icon dark ripple @click="downloadDialog = false">
                    <v-icon>fas fa-xmark</v-icon>
                </v-btn>

            </v-toolbar>
            <v-sheet>
                <div class="skin downloadItem" w-64>
                    <v-sheet p-4 mb-8>
                        <v-img :src="editorStore.skineditor.getSkinURL()" aspect-ratio="9/16" w-32 h-32 cover></v-img>
                    </v-sheet>
                    <v-btn ripple @click="editorStore.skineditor.downloadSkin()">
                        <i class="fa-solid fa-download" mr-1></i>
                        皮肤
                    </v-btn>
                </div>
                <div class="canvasCut downloadItem" w-64>
                    <v-sheet p-4 mb-8>
                        <v-img :src="editorStore.skineditor.getCanvasPicURL()" aspect-ratio="9/16" w-32 h-32 cover></v-img>
                    </v-sheet>
                    <v-btn ripple @click="editorStore.skineditor.downloadCanvasCut">
                        <i class="fa-solid fa-download" mr-1></i>
                        截图
                    </v-btn>
                </div>
                <div class="head downloadItem" w-64>
                    <v-sheet p-4 mb-8>
                        <v-img :src="editorStore.skineditor.getHeadURL()" aspect-ratio="9/16" w-32 h-32 cover></v-img>
                    </v-sheet>
                    <v-btn ripple @click="editorStore.skineditor.downloadSkinHead()">
                        <i class="fa-solid fa-download" mr-1></i>
                        头像
                    </v-btn>
                </div>

            </v-sheet>
        </v-dialog>
    </v-toolbar>
</template>
<style lang="scss" scoped>
.downloadDialog {
    width: 60vw;
}

.v-sheet {
    display: flex;
    flex-direction: row !important;
    justify-content: space-evenly;

    .downloadItem {
        padding: 2rem 0;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }
}
</style>
