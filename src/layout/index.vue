<script lang="ts" setup>
import { useTheme } from "@/hooks/useTheme"

const { initTheme } = useTheme()

onMounted(() => {
  initTheme()
})

</script>
<template>
  <div class="Layout">
    <NavigationBar />
    <Main />
    <BottomBar />
  </div>
</template>
<style lang="" scoped>

</style>
