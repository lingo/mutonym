<template>
  <div
    class="word"
    :class="`language-${language.toLowerCase()}`"
    :data-language="language"
    :data-score="word.score"
  >
    <ul class="stems">
      <li v-for="w in word.stems" :key="w">{{ w }}</li>
    </ul>
    <h3>Meaning</h3>
    <p v-html="word.rawMeaning" />
    <h3>Examples</h3>
    <p v-html="word.rawExamples" />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { Word } from '../word';

@Component
export default class WordComponent extends Vue {
  @Prop() private word!: Word;

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  get language() {
    return this.word?.language || 'Unknown';
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
  display: flex;
  gap: 0.5rem;
}
li {
  display: inline-block;
  font-style: italic;
  font-size: 1.4rem;
  &:after { content: ','; }
  &:last-child:after { content: none; }
}
a {
  color: #42b983;
}
.word {
  position: relative;
  border: 1px solid rgba(0,0,0,0.4);
  border-radius: 3px;
  padding: 1.5rem 2rem;
  margin: 0.5rem;
  overflow: hidden;
  box-shadow: 0 8px 20px -17px rgba(0,0,0,0.8);
  width: 25%;

  &:before {
    content: attr(data-language);
    position: absolute;
    right: 0;
    top: 0;
    transform: translateX(-50%) rotate(45deg) translateX(50%);
    text-align: left;
    z-index: 10;
    /* background: red; */
  }

  &:after {
    content: '';
    position: absolute;
    right: 0;
    top: 0;
    border: 2rem solid change-color(#42b983, $alpha: 0.6);
    border-left-color: white;
    border-bottom-color: white;
  }
}
</style>
