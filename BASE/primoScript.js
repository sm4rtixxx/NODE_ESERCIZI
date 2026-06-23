console.log('Ciao da node.js');

//PROCESS
console.log('Versione node.js:', process.version);
// console.log('Variabili d\'ambiente di sistema:', process.env);
console.log('OS:', process.platform);

// ARGOMENTI
console.log('argv[0]', process.argv[0]);
console.log('argv[1]', process.argv[1]);
// console.log('argv[2]', process.argv[2]);
// console.log('argv[3]', process.argv[3]);
console.log('Diamo il benvenuto a ', process.argv[2], ' e ', process.argv[3]);

//__dirname __filename
console.log('dirname: ', __dirname);
console.log('filename: ', __filename);
