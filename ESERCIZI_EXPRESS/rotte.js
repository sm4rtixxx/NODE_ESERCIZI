require('dotenv').config();
const express = require('express');
const app = express();
app.use(express.json());

//array di libri dichiarato fuori da qualsiasi rotta e quindi esistente per tutta la durata della vita del server. Tutte le rotte possono accedervi
const libri = [
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
    res.status(404).json({errore: `Libro (id: ${req.params.id}) non trovato`});
  }
  res.json(libro);
});

app.get('/libri/:id/autore', (req, res) => {
  const libro = libri.find(libro => libro.id == +req.params.id);
  if (!libro) {
    res.status(404).json({errore: `Libro (id: ${req.params.id}) non trovato`});
  }
  res.json({autore: libro.autore});
});

//AVVIO DEL SERVER
const PORTA = process.env.PORT || 3000;
app.listen(PORTA, () => {
  console.log('Server avviato sulla porta ' + PORTA);
});
