const mongoose = require("mongoose");

const pacienteSchema = new mongoose.Schema({
  noHistoriaClinica: {
    type: Number,
    required: true,
    unique: true,
  },
  nombre: {
    type: String,
    required: true,
  },
  edad: {
    type: Number,
    required: true,
  },
  rangoEdad: {
    type: String,
    enum: ["Niño", "Joven", "Anciano"],
    required: true,
  },
  pesoEstatura: {
    type: Number,
  },
  fumador: {
    type: Boolean,
  },
  añosFumador: {
    type: Number,
  },
  dieta: {
    type: Boolean,
  },
  prioridad: {
    type: Number,
  },
  riesgo: {
    type: Number,
  },
});

const Paciente = mongoose.model("Paciente", pacienteSchema);

module.exports = Paciente;
