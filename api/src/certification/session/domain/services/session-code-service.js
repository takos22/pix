import _ from 'lodash';
import { config } from '../../../../../lib/config.js';

function _randomLetter() {
  const letters = config.availableCharacterForCode.letters.split('');
  return _.sample(letters);
}

function _randomNumberCharacter() {
  const numberCharacter = config.availableCharacterForCode.numbers.split('');
  return _.sample(numberCharacter);
}

function _generateSessionCode() {
  const code =
    '' +
    _randomLetter() +
    _randomLetter() +
    _randomLetter() +
    _randomLetter() +
    _randomNumberCharacter() +
    _randomNumberCharacter();
  return code;
}

const getNewSessionCode = function () {
  return _generateSessionCode();
};

export { getNewSessionCode };
