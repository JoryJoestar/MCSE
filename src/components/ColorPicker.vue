<script lang="ts" setup>

import Bus from '@/utils/Bus';
import { ref, computed, toRefs, watch, onMounted, onUnmounted } from 'vue';
import { useTheme } from "@/hooks/useTheme"

const { activeThemeName } = useTheme()

const menu = ref(false);

// 接受父传子
const props = defineProps({
    //子组件接收父组件传递过来的值
    index: { type: Number },
    active: { type: Number },
    InitialColor: { type: String },
});
//使用父组件传递过来的值
const { index, active, InitialColor } = toRefs(props);

Bus.on(`colorIndexChangeEmit${index?.value}`, (active: boolean) => {
    ACTIVE.value = active;
});

Bus.on(`dropperColorChangeEmit${index?.value}`, (param: any) => {
    color.value = param.color;
})

const emit = defineEmits(["colorIndexChangeEmit", "colorChangeEmit"]);
const colorIndexChange = () => {
    let param = {
        index: index?.value,
    }
    // 子传父
    emit("colorIndexChangeEmit", param);
}
const colorChangeEmit = () => {
    let param = {
        color: color?.value,
    }
    // 子传父
    emit("colorChangeEmit", param);
}


const color = ref('')

const ACTIVE = ref<boolean>(false);

const swatchStyle = computed(() => {
    return {
        backgroundColor: color.value,
        cursor: 'pointer',
        height: ACTIVE.value ? '3rem' : '2rem',
        width: ACTIVE.value ? '3rem' : '2rem',
        borderRadius: menu.value ? '50%' : '50%',
        border: ACTIVE.value ? '' : '',
        transition: 'all 300ms ease-in-out'
    }
})

onMounted(() => {
    color.value = (InitialColor?.value as string);
})

onUnmounted(() => {

})

watch(
    () => [ACTIVE.value, color.value, menu.value],
    ([newActive, newColor, newMenu], [oldActive, oldColor, oldMenu]) => {
        if (ACTIVE.value === true && newMenu === false) {
            colorChangeEmit();
        }
    },)

</script>

<template>
    <div id="colorPicker">
        <v-menu v-model="menu" top nudge-bottom="105" nudge-left="16" :close-on-content-click="false"
            :theme="activeThemeName">
            <template v-slot:activator="{ props }">
                <div :style="swatchStyle" v-bind="props" @click="colorIndexChange"></div>
            </template>
            <v-card>
                <v-card-text class="pa-0">
                    <v-color-picker v-model="color" flat />
                </v-card-text>
            </v-card>
        </v-menu>
    </div>
</template>



 