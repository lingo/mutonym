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
    <footer>
      Information from <a href="https://en.wikipedia.org/wiki/List_of_Greek_and_Latin_roots_in_English">https://en.wikipedia.org/wiki/List_of_Greek_and_Latin_roots_in_English</a>
      License: <a href="https://creativecommons.org/licenses/by-sa/3.0/legalcode">CC BY-SA</a>
    </footer>
  </main>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import WordComponent from '@/components/WordComponent.vue';
import Search from '@/components/Search.vue';
import rawWords from '../gklatwords.json';
import { Word } from './word';

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

  get found(): Word[] {
    const { search } = this;
    if (!search) {
      return [words[Math.floor(Math.random() * words.length)] as Word];
    }
    console.log('found', search);
    const pattern = new RegExp(`.*${search}.*`, 'i');
    return words
      .map((w) => {
        let score = 0;

        const exactMeaningScore = 50
          * w.meaning.split(/\s+/).filter((meaning) => meaning === search).length;
        const exactStemScore = 30 * w.stems.filter((stem) => stem === search).length;
        const exactExamplesScore = 5 * w.examples.filter((eg) => eg === search).length;

        const meaningScore = 15
          * w.meaning.split(/\s+/).filter((meaning) => pattern.test(meaning))
            .length;
        const stemScore = 10 * w.stems.filter((stem) => pattern.test(stem)).length;
        const examplesScore = 1 * w.examples.filter((eg) => pattern.test(eg)).length;

        score = exactStemScore
          + exactMeaningScore
          + exactExamplesScore
          + stemScore
          + meaningScore
          + examplesScore;

        return { ...w, score };
      })
      .filter((w) => w.score > 0)
      .sort((a, b) => b.score - a.score) as Word[];
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

a:link {
  color: $green;
}
a:visited {
  color: change-color($green, $lightness: 20);
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

footer {
  color: #888;
  padding: 1rem 0;
  font-size: 0.85rem;

}
</style>
