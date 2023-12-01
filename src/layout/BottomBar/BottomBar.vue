<script lang="ts" setup>
import { useTheme } from '@/hooks/useTheme';


const { activeThemeName } = useTheme()


</script>
<template>
  <div class="bottom-bar" absolute bottom-0 w-full flex items-center justify-start>
    <v-card :theme="activeThemeName">
      <v-chip variant="text">
        <span>
          <span font-size-2>2023 </span> - ∞
        </span>
      </v-chip>
      <v-btn variant="plain" size="small" href="https://beian.miit.gov.cn/" target="_blank">@Senong</v-btn>
      <v-btn variant="plain" size="small" href="https://beian.miit.gov.cn/" target="_blank">粤ICP备2023134767号-1</v-btn>
    </v-card>
  </div>
</template>
<style lang="scss" scoped>
.bottom-bar {
  .v-card {
    background-color: transparent;
    border: 0;
    box-shadow: none;
  }

  .v-chip {
    padding: 0;
    margin: 0 .5rem;
  }

  .v-btn {
    background-color: transparent !important;
    padding: 0;
    margin: 0 0.5rem;
  }
}
</style>
