const express=required('express')

const app=express();//da questo momento in poi app è il nostro server che gestisce la request,la response,le rotte,aggiunge il middleware...

app.use(express.json());//legge il body json delle richieste in arrivo e va messo praticamente sempre subito dopo express()

app.get('/',(req,res)=>{
    res.send('Hello express');
});

app.listen(3000,()=>{
    console.log('server avviato sulla porta 3000');
})