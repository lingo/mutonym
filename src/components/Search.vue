<template>
  <div class="search">
    <label for="search">Search</label>
    <input
      autocomplete="off"
      type="search"
      ref="search"
      id="search"
      :value="value"
      @input="$emit('input', $refs.search.value)"
    />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class Search extends Vue {
  @Prop() private value!: string;
}
</script>

<style lang="scss" scoped>
.search {
  display: flex;
  gap: 1rem;
  justify-content: space-between;
  align-items: end;

  > * {
    display: block;
  }

  input {
    flex: 1 0 auto;
    border-radius: 1rem;
    padding: 0.25rem 0.5rem;
  }
}
</style>
