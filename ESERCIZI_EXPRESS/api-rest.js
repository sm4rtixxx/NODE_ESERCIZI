require('dotenv').config();
const express = require('express');
const app = express();

//MIDDLEWARE 1 - LOGGING
app.use((req, res, next) => {
  const adesso = new Date().toLocaleString('it-IT');
  console.log(`[${adesso}] ${req.method} ${req.url}`);
  next();
});

//MIDDLEWARE 2 - VERIFICARE API KEY
function verificaChiaveApi(req, res, next) {
  const chiave = req.headers['x-api-key'];
  if (!chiave) {
    res.status(401).json({errore: 'Chiave API mancante'});
  }
  if (chiave !== process.env.API_KEY) {
    res.status(401).json({errore: 'Chiave API non valida'});
  }
  next();
}

//MIDDLEWARE 3 - validazione campi body
function validaBody(req, res, next) {
  const {titolo, autore, anno} = req.body;

  //verifico che titolo autore e anno siano tutti valorizzati
  if (!titolo?.trim() || !autore?.trim() || !anno) {
    res.status(400).json({errore: 'Titolo, autore e anno sono obbligatori'});
  }

  if (isNaN(parseInt(anno))) {
    res.status(400).json({errore: 'Anno deve essere un numero'});
  }

  next();
}

app.use(express.json());

//array di libri dichiarato fuori da qualsiasi rotta e quindi esistente per tutta la durata della vita del server. Tutte le rotte possono accedervi
let libri = [
  {id: 1, titolo: 'Il cacciatore di aquiloni', autore: 'Khaled Hosseini', anno: 2003},
  {id: 2, titolo: 'La strada', autore: 'Cormac McCarthy', anno: 2006},
  {id: 3, titolo: 'Le correzioni', autore: 'Jonathan Franzen', anno: 2001},
  {id: 4, titolo: 'Espiazione', autore: 'Ian McEwan', anno: 2001},
  {id: 5, titolo: 'La solitudine dei numeri primi', autore: 'Paolo Giordano', anno: 2008},
  {id: 6, titolo: 'Americanah', autore: 'Chimamanda Ngozi Adichie', anno: 2013},
  {id: 7, titolo: 'Il cardellino', autore: 'Donna Tartt', anno: 2013},
  {id: 8, titolo: 'Normal People', autore: 'Sally Rooney', anno: 2018},
  {id: 9, titolo: 'Shuggie Bain', autore: 'Douglas Stuart', anno: 2020},
  {id: 10, titolo: 'Dove canta il gambero', autore: 'Delia Owens', anno: 2018},
  {id: 11, titolo: 'Dove canta la stella marina', autore: 'Delia Owens', anno: 2019}
];

let prossimoId = libri.length + 1;

//ROTTE
app.get('/', (req, res) => {
  res.send('Benvenuti in gestione libri');
});
//GET libri -> restituisce tutti i libri
app.get('/libri', (req, res) => {
  let risultati = [...libri];

  if (req.query.anno) {
    risultati = risultati.filter(libro => libro.anno === +req.query.anno);
  }

  if (req.query.autore) {
    risultati = risultati.filter(libro => libro.autore.trim().toLowerCase().includes(req.query.autore.toLowerCase()));
  }

  if (req.query.titolo) {
    risultati = risultati.filter(libro => libro.titolo.trim().toLowerCase().includes(req.query.titolo.toLowerCase()));
  }

  console.log('risultati = ' + risultati.length);
  res.json(risultati);
});

app.get('/libri/:id', (req, res) => {
  const libro = libri.find(libro => libro.id == +req.params.id);
  if (!libro) {
    return res.status(404).json({errore: `Libro (id: ${req.params.id}) non trovato`});
  }
  res.json(libro);
});

app.get('/libri/:id/autore', (req, res) => {
  const libro = libri.find(libro => libro.id == +req.params.id);
  if (!libro) {
    return res.status(404).json({errore: `Libro (id: ${req.params.id}) non trovato`});
  }
  res.json({autore: libro.autore});
});

//POST /libri - aggiunge un nuovo libro
app.post('/libri', verificaChiaveApi, validaBody, (req, res) => {
  const {titolo, autore, anno} = req.body;

  const nuovoLibro = {
    id: prossimoId++,
    titolo: titolo.trim(),
    autore: autore.trim(),
    anno: +anno
  };
  libri.push(nuovoLibro);
  console.log(libri);
  res.status(201).json(nuovoLibro); //codice 201= created
});

//PUT /libri/:id modifica un libro esistente in tutte le sue proprieta
app.put('/libri/:id', verificaChiaveApi, validaBody, (req, res) => {
  const id = +req.params.id;
  const indice = libri.findIndex(libro => libro.id == id);
  if (indice == -1) {
    res.status(404).json({errore: `Libro (id: ${id}) non trovato. Impossibile aggiornare`});
  }
  const {titolo, autore, anno} = req.body;

  libri[indice] = {
    id: id,
    titolo: titolo.trim(),
    autore: autore.trim(),
    anno: +anno
  };
  console.log(libri);
  res.status(200).json(libri[indice]);
});

//PATCH /libri/:id modifica un libro esistente in base alle proprietà passate
app.patch('/libri/:id', verificaChiaveApi, function (req, res) {
  // Riceve l'id del libro da modificare nell'URL.
  const id = +req.params.id;
  const indice = libri.findIndex(function (libro) {
    return libro.id === id;
  });

  if (indice === -1) {
    return res.status(404).json({errore: `Libro (id: ${id}) non trovato. Impossibile aggiornare`});
  }

  libri[indice] = {
    id: id,
    titolo: req.body.titolo || libri[indice].titolo,
    autore: req.body.autore || libri[indice].autore,
    anno: req.body.anno ? +req.body.anno : libri[indice].anno
  };

  console.log(libri);
  res.status(200).json(libri[indice]);
});

//DELETE (/libri/:id) -cancella il libro dato l'id
app.delete('/libri/:id', verificaChiaveApi, (req, res) => {
  const id = req.params.id;
  const indice = libri.findIndex(libro => libro.id == id);
  if (indice == -1) {
    res.status(404).json({errore: `Libro (id: ${id}) non trovato. Impossibile eliminare`});
  }
  const libroEliminato = libri[indice];
  libri.splice(indice, 1);
  console.log(libri);
  res.status(200).json({messaggio: 'libro eliminato con successo', libro: libroEliminato});
});

//AVVIO DEL SERVER
const PORTA = process.env.PORT || 3000;
app.listen(PORTA, () => {
  console.log('Server avviato sulla porta ' + PORTA);
});
