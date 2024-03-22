const mongoose = require("mongoose");

const consultaSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
    unique: true,
  },
  cantidadPacientes: {
    type: Number,
    default: 0,
  },
  especialista: {
    type: String,
    required: true,
  },
  estado: {
    type: String,
    enum: ["Ocupada", "En espera"],
    default: "En espera",
  },
  tipo: {
    type: String,
    enum: ["Pediatría", "Urgencia", "CGI (Consulta General Integral)"],
    required: true,
  },
});

ConsultaSchema.statics.getPacientesMasAtendidos =
  async function () {
    try {
      const consultaMasPacientes = await this.aggregate([
        {
          $lookup: {
            from: "pacientes",
            localField: "idConsulta", 
            foreignField: "idConsulta",
            as: "pacientes",
          },
        },
        {
          $project: {
            _id: 0,
            idConsulta: "$_id",
            nombre: 1,
            totalPacientes: { $size: "$pacientes" },
          },
        },
        {
          $sort: { totalPacientes: -1 },
        },
        { $limit: 1 },
      ]);

      return consultaMasPacientes[0];
    } catch (error) {
      throw Error("Error al obtener pacientes más atendidos");
    }
  };

const Consulta = mongoose.model("Consulta", consultaSchema);

module.exports = Consulta;
