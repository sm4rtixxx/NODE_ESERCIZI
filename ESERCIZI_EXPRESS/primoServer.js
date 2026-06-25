require('dotenv').config(); //necessario per poter accedere alle proprietà del file .env METTERLO COME PRIMA ISTRUZIONE
const express = require('express');

//INIZIALIZZAZIONI
const app = express(); //da questo momento in poi app è il nostro server che gestisce la request, la response, le rotte, aggiunge il middleware...

app.use(express.json()); //legge il body json delle richieste in arrivo e va messo praticamente sempre, subito dopo express()

//ROTTE

//ROTTA 1 risponde con del testo semplice
app.get('/', (req, res) => {
  res.send('Hello super express!!!'); //
});

app.get('/home', (req, res) => {
  res.redirect('/'); //riporta alla route precedente
});

//ROTTA 2 risponde con una stringa json
app.get('/info', (req, res) => {
  const result = {
    nome: 'server esercizi',
    versione: '1.0.0',
    autore: 'noi'
  };
  res.json(result);
});

//ROTTA 3 usa una parte di rotta variabile  (:valoreVariabile)
//esempi di rotte con porzioni dinamiche:
//'/negozio/:citta/:categoria/:id'
//'/prodotti/:id/recensioni/:recensioneId'
app.get('/saluta/:nome/:cognome', (req, res) => {
  const nome = req.params.nome; //recupera nome da req.params
  const cognome = req.params.cognome;
  //res.json({messaggio: 'Ciao ' + nome + " " + cognome + '! Benvenut*'});
  res.send('Ciao ' + nome + ' ' + cognome + '! Benvenut*');
});

//ROTTA 3 usa un parametro nell'url (:valoreParametro)
app.get('/mettiInOnda/:puntata', (req, res) => {
  const puntata = req.params.puntata;
  let messaggio = 'Va in onda la puntata  ';
  switch (puntata) {
    case '1':
      messaggio += 'Appena conosciuti';
      break;
    case '2':
      messaggio += 'Una gita insieme';
      break;
    case '3':
      messaggio += 'Il matrimonio';
      break;
    case '4':
      messaggio += 'Già divorziati';
      break;
    default:
      messaggio = 'Puntata inesistente';
  }
  res.send(messaggio);
});

//AVVIO DEL SERVER
const PORTA = process.env.PORT || 3000;
app.listen(PORTA, () => {
  console.log('Server avviato sulla porta ' + PORTA);
});
