import nl from './translations/nl.json';

// English is the default message in each of our source files, so no need for a separate en.json file
const en = {};

// If we add more than just Dutch, just import the files and export it below: export default { en, es, de }
// also do not forget to add them to ./translationRunner.js !
export default { en, nl };
