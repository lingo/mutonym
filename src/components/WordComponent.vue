<template>
  <div
    :class="['word', languageClass]"
    :data-language="language"
    :data-display-language="languageForDisplay"
    :data-score="word.score"
  >
    <ul class="stems">
      <li v-for="w in word.stems" :key="w">{{ w }}</li>
    </ul>
    <template v-if="word.rawMeaning">
      <h3>Meaning</h3>
      <p v-html="word.rawMeaning" />
    </template>
    <template v-if="word.dictionaryLink">
      <h3>Etymology</h3>
      <p v-html="word.dictionaryLink" />
    </template>
    <template v-if="word.rawExamples">
      <h3>Examples</h3>
      <p v-html="word.rawExamples" />
    </template>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { Word } from '../word';

@Component
export default class WordComponent extends Vue {
  @Prop() private word!: Word;

  get language() : string {
    return this.word?.language || 'Unknown';
  }

  get languageClass() : string {
    const { language } = this;
    return language.split(/\s+/)[0].replace(/[^a-z0-9]+/g, '-').toLowerCase();
  }

  get languageForDisplay() : string {
    const { language } = this;
    const displayLang = language.split(/\s+/)[0];
    return displayLang === language ? displayLang : `${displayLang}*`;
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
$green: #42b983;

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
  &:after {
    content: ",";
  }
  &:last-child:after {
    content: none;
  }
}
a {
  color: $green;
}
.word {
  position: relative;
  border: 1px solid rgba(0, 0, 0, 0.4);
  border-radius: 3px;
  padding: 1.5rem 2rem;
  margin: 0.5rem;
  overflow: hidden;
  box-shadow: 0 8px 20px -17px rgba(0, 0, 0, 0.8);
  width: 80%;

  &:before {
    content: attr(data-display-language);
    position: absolute;
    right: 0;
    top: 0;
    transform: translate(50%, 0) rotate(-315deg) translate(-19%, 150%);
    text-align: center;
    z-index: 10;
    /* background: red; */
  }

  &:after {
    content: "";
    position: absolute;
    right: 0;
    top: 0;
    border: 2rem solid change-color($green, $alpha: 0.6);
    border-left-color: white;
    border-bottom-color: white;
  }

  @media screen and (min-width: 700px) {
    width: 33%;
  }

  @media screen and (min-width: 1000px) {
    width: 25%;
  }

}
</style>
