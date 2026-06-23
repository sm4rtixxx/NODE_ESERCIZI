const fs = require('fs'); //fs=file system modulo nativo di node

//LETTURA SINCRONA

// console.log('1 prima di lettura file');
// const contenuto = fs.readFileSync('testo.txt', 'utf8');
// console.log('2 contenuto file: ', contenuto.trim());
// console.log('3 dopo stampa contenuto');

//LETTURA ASINCRONA
console.log('1a prima di lettura file');
fs.readFile('testo.txt', 'utf8', (err, contenuto) => {
  if (err) {
    console.log('Errore: ', err.message);
    return;
  }
  console.log('2a contenuto file: ', contenuto.trim());
});
console.log('3a dopo tutto');
