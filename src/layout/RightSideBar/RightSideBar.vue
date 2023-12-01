<script lang="ts" setup>

import { useTheme } from '@/hooks/useTheme';
import { useEditorStore } from '@/store/editor';

const editorStore = useEditorStore();

const { activeThemeName } = useTheme()

</script>
<template>
    <v-layout>
        <v-navigation-drawer floating permanent location="right" class="right-side-bar" :theme="activeThemeName"
            select-none>
            <div class="modelShow">
                <v-list-item font-size-3 px-2>模型显示</v-list-item>
                <v-list-item>
                    <div class="selector bodyparts" pb-4>
                        <div class="bodyparts-body">
                            <span>Body</span>
                            <div class="bodyparts-btn">
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
                        </div>
                        <div class="bodyparts-overlay">
                            <span>Overlay</span>
                            <div class="bodyparts-btn">
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
                    </div>
                </v-list-item>
                <div class="toggle-select">
                    <v-btn ripple class="body-selector">
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
            </div>

            <v-divider mx-2></v-divider>

            <div class="colorPicker">
                <v-list-item px-2 font-size-3>颜色选择</v-list-item>
                <v-list-item>
                    <div class="color-controls" my-4>
                        <ColorPicker></ColorPicker>
                    </div>
                </v-list-item>
            </div>

            <v-divider mx-2></v-divider>

            <div class="modelSelect">
                <v-list-item px-2 font-size-3>人物模型</v-list-item>
                <v-list-item p-4>
                    <v-select class="" :items="editorStore.modelItems" variant="outlined" v-model="editorStore.model"
                        :disabled="editorStore.modelSelect" @update:modelValue="editorStore.modelChange"></v-select>
                </v-list-item>
            </div>

            <v-divider mx-2></v-divider>

            <div class="poselSelect">
                <v-list-item px-2 font-size-3>人物姿势</v-list-item>
                <v-list-item p-4>
                    <v-select class="" :items="editorStore.poseItems" variant="outlined"
                        v-model="editorStore.pose"></v-select>
                </v-list-item>
            </div>

            <v-divider mx-2></v-divider>

            <div class="gridSwitch">
                <v-list-item px-2 font-size-3>模型网格</v-list-item>
                <v-list-item p-4>
                    <v-switch v-model="editorStore.switchGrid" :color="editorStore.color">
                    </v-switch>
                </v-list-item>
            </div>
        </v-navigation-drawer>
    </v-layout>
</template>
<style lang="" scoped>

</style>
