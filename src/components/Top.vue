<template>
  <div class="top">
    <menu-button/>
  </div>
</template>

<script>
import MenuButton from '@/components/MenuButton'

export default {
  name: 'Top', 
  components: {
    MenuButton
  },
}
</script>

<style scoped lang="scss">
  div.top {
    width: 100%;
    height: 7rem;
    background-image: url("../assets/graphics/graphics-header.svg");
  }
</style>
