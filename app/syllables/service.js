function tokenize(word) {
  let result = word;
  let currentLength;
  do {
    currentLength = result.length;
    result = result.replace(/([aàâæeéèêëiîïoôœuùûüyÿ])([bcçdfghjklmnpqrstvwxyz])([aàâæeéèêëiîïoôœuùûüyÿ])/i, '$1|$2$3');
  } while (currentLength < result.length);
  do {
    currentLength = result.length;
    result = result.replace(/([aàâæeéèêëiîïoôœuùûüyÿ])([bcçdfghjklmnpqrstvwxyz])([bcçdfghjklmnpqrstvwxyz])([aàâæeéèêëiîïoôœuùûüyÿ])/i, '$1$2|$3$4');
  } while (currentLength < result.length);
  do {
    currentLength = result.length;
    result = result.replace(/([aàâæeéèêëiîïoôœuùûüyÿ])([bcçdfghjklmnpqrstvwxyz])([bcçdfghjklmnpqrstvwxyz])([bcçdfghjklmnpqrstvwxyz])([aàâæeéèêëiîïoôœuùûüyÿ])/i, '$1$2$3|$4$5');
  } while (currentLength < result.length);
  return result.split('|');
}

function getPronunciation(syllable) {
  let result = syllable;
  result = result.replace(/(au)|(eau)|(ô)/, 'o');
  result = result.replace(/(an)|(am)|(en)|(em)/, 'ɑ̃');
  result = result.replace(/(in)|(im)|(yn)|(ym)/, 'ɛ̃');
  result = result.replace(/(on)|(om)/, 'ɔ̃');
  result = result.replace(/(un)|(um)|(aun)/, 'œ̃');
  result = result.replace(/(œ)|(œu)|(eu)/, 'œ');

  return result;
}

function isSamePronunciation(syllableA, syllableB) {
  return getPronunciation(syllableA).endsWith(getPronunciation(syllableB));
}

function first(word) {
  const sillables = tokenize(word);
  return sillables[0];
}

function last(word) {
  const sillables = tokenize(word);
  return sillables[sillables.length - 1];
}

module.exports = {
  tokenize,
  getPronunciation,
  isSamePronunciation,
  first,
  last,
};
