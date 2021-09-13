<template>
  <main id="app">
    <header>
      <h1>Muto<span class="name">nym</span></h1>
      <h2 class="subtitle">Greek and Latin roots in English</h2>
    </header>
    <search :value="search" @input="onSearchChange($event)" />
    <hr />
    <div class="words">
      <word-component
        v-for="w in found"
        :key="w.stems.join(':') + w.id"
        :word="w"
      />
    </div>
  </main>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import WordComponent from '@/components/WordComponent.vue';
import Search from '@/components/Search.vue';
import rawWords from '../gklatwords.json';

// eslint-disable-next-line @typescript-eslint/ban-types
export function debounce(fn: Function, delay: number): () => void {
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

  updateSearch(search: string): void {
    console.log('update search', search);
    this.search = search;
  }
}
</script>

<style lang="scss">
@import url("https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@700&family=Heebo:wght@100&display=swap");

$green: #42b983;

body {
  color: #2c3e50;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

#app {
  margin: 0 auto;
  margin-top: 60px;
  max-width: 80vw;
}

header {
  display: flex;
  align-items: baseline;
  gap: 1rem;
}
h1 {
  font-family: "Cinzel Decorative", serif;
  font-size: 6rem;
  line-height: 0.8;
  margin: 1rem 0 2rem 0;
  font-variant: small-caps;

  span {
    color: $green;
    font-variant: normal;
    font-size: 5.2rem;
  }
}
h2.subtitle {
  font-family: "Heebo", sans-serif;
  font-size: 1.8rem;
  letter-spacing: -0.1rem;
  display: inline-block;
  color: #282f38;
}
.words {
  display: flex;
  flex-flow: row wrap;

  > * {
    flex: 0 0 auto;
  }
}
</style>
