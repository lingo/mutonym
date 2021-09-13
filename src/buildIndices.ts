import { Word } from './word';

export default function buildIndices(words: Word[])
  : {
    index: Map<string, Word[]>,
    reverseIndex: Map<string, Word[]>
  } {
  const index = words.reduce((akk, w) => {
    w.stems.forEach((stem) => akk.set(stem, w));
    return akk;
  }, new Map());
  const reverseIndex = words.reduce((akk, w) => {
    w.meaning.split(/\s+/).forEach((word) => {
      if (!akk.has(word)) {
        akk.set(word, []);
      }
      akk.get(word).push(w);
      return akk;
    });
    w.examples.forEach((word) => {
      if (!akk.has(word)) {
        akk.set(word, []);
      }
      akk.get(word).push(w);
      return akk;
    });
    return akk;
  }, new Map());

  return { index, reverseIndex };
}
