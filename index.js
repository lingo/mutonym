const fs = require('fs');
const cheerio = require('cheerio');

function loadWordsFile(json) {
  return JSON.parse(fs.readFileSync(json, { encoding: 'utf-8' }));
}

function loadWords() {
  const files = [
    loadWordsFile('./words_ag.json'),
    loadWordsFile('./words_ho.json'),
    loadWordsFile('./words_pz.json'),
  ];
  return files.reduce((akk, wf) => akk.concat(wf));
}

function mapWord(w) {
  return {
    stems: cheerio.load(w[0]).text()
      .trim()
      .split(/\s*,\s*/)
      .map((s) => s.replace(/[^a-z]*-[^a-z]*$/gi, '')),
    meaning: cheerio.load(w[1] || '').text(),
    rawStems: w[0],
    rawMeaning: w[1],
    language: w[2],
    dictionaryLink: w[3],
    rawExamples: w[4],
    examples: cheerio.load(w[4] || '').text().trim().split(/\s*,\s*/),
  };
}

const words = loadWords().map(mapWord);
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

// console.log('loadWords()', words);

// console.log('index', reverseIndex.keys());
// console.log(reverseIndex.get(process.argv[2]));

process.stdout.write(JSON.stringify(words, 0, 4));
