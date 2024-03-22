const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());


// conexión a la base de datos de mongo
mongoose.connect('mongodb://127.0.0.1:27017/fonasa', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Error de conexión a MongoDB:'));
db.once('open', () => {
  console.log('Conexión exitosa a MongoDB');
});



// ruta de las apis //en duda si iría la de hospitales
const consultasRouter = require('./routes/consultas');
const pacientesRouter = require('./routes/pacientes');

app.use('/consultas', consultasRouter);
app.use('/pacientes', pacientesRouter);



// ruta de prueba
app.get('/', (req, res) => {
  res.send('probando servicio de backend: conectado');
});



// inicar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor backend en ejecución en http://localhost:${PORT}`);
});
