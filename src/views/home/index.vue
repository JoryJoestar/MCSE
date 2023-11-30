<script lang="ts" setup>

const router = useRouter()

const toPages = (path: string) => {
    router.push(`${path}`)
}

</script>
<template>
  <div class="Home">
    <v-btn ripple @click="toPages('/editor')">Editor</v-btn>
  </div>
</template>
<style lang="" scoped>

</style>
