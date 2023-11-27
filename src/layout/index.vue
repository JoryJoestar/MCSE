<script lang="ts" setup>
import { useTheme } from "@/hooks/useTheme"

const { initTheme } = useTheme()

onMounted(() => {
  initTheme()
})

</script>
<template>
  <div class="layout">
    <NavigationBar />
    <Main />
    <BottomBar />
  </div>
</template>
<style lang="" scoped>

</style>
