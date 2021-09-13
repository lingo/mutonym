<template>
  <main id="app">
    <search :value="search" @input="onSearchChange($event)" />
    <hr>
    <div class="words">
      <word-component v-for="w in found" :key="w.stems.join(':') + w.id" :word="w" />
    </div>
  </main>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import WordComponent from '@/components/WordComponent.vue';
import Search from '@/components/Search.vue';
import rawWords from '../gklatwords.json';

// eslint-disable-next-line @typescript-eslint/ban-types
export function debounce(fn: Function, delay: number) : () => void {
  let timeoutID = 0;

  // eslint-disable-next-line func-names, @typescript-eslint/no-explicit-any
  return function (...args: any[]) {
    clearTimeout(timeoutID);

    timeoutID = setTimeout(() => {
      fn(...args);
    }, delay);
  };
}

const words = rawWords.map((w, idx) => ({ ...w, id: idx }));

@Component({
  components: {
    WordComponent,
    Search,
  },
})
export default class App extends Vue {
  search: string;

  onSearchChange: () => void;

  constructor() {
    super();
    this.search = '';

    this.onSearchChange = debounce((value: string) => {
      this.updateSearch(value);
    }, 150);
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  get found() {
    if (!this.search) {
      return [words[0]];
    }
    console.log('found', this.search);
    const pattern = new RegExp(`.*${this.search}.*`, 'i');
    return words.map((w) => {
      let score = 0;

      const meaningScore = 50 * w.meaning.split(/\s+/).filter((meaning) => pattern.test(meaning)).length;
      const stemScore = 30 * w.stems.filter((stem) => pattern.test(stem)).length;
      const examplesScore = 5 * w.examples.filter((eg) => pattern.test(eg)).length;

      score = stemScore + meaningScore + examplesScore;

      return { ...w, score };
    }).filter((w) => w.score > 0).sort((a, b) => (b.score - a.score));
  }

  updateSearch(search: string) : void {
    console.log('update search', search);
    this.search = search;
  }
}
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  margin: 0 auto;
  margin-top: 60px;
  max-width: 80vw;
}

.words {
  display: flex;
  flex-flow: row wrap;

  > * {
    flex: 0 0 auto;
  }
}
</style>
