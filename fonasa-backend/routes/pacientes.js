const express = require("express");
const router = express.Router();
const Paciente = require("../models/Paciente");

// listar los pacientes
router.get("/", async (req, res) => {
  try {
    const pacientes = await Paciente.find();
    res.json(pacientes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// pacientes mayor riesgo
router.get("/mayorriesgo/:noHistoriaClinica ", async (req, res) => {
  try {
    const { noHistoriaClinica } = req.params;
    const pacienteIngreso = await Paciente.findOne({ noHistoriaClinica });

    if (!pacienteIngreso) {
      return res.status(404).json({ message: "El paciente no existe." });
    }

    const riesgoPacIngreso = calcularRiesgo(pacienteIngreso);
    const pacientesMayorRiesgo = await Paciente.find({ riesgo: { $gt: riesgoPacIngreso }, });
    return res.json(pacientesMayorRiesgo);

  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error al buscar pacientes de mayor riesgo." });
  }
});

// calcular riesgo del paciente por edad y prioridad
function calcularRiesgo(paciente) {
  let riesgo = 0;
  if (paciente.rangoEdad === "Niño") {
    riesgo = (paciente.edad * paciente.prioridad) / 100;
  } else if (paciente.rangoEdad === "Joven") {
    riesgo = (paciente.edad * paciente.prioridad) / 100 + 2;
  } else if (paciente.rangoEdad === "Anciano") {
    riesgo = (paciente.edad * paciente.prioridad) / 100 + 5.3;
  }
  return riesgo;
}







/*  */
router.get("/fumadoresurgentes", async (req, res) => {
  try {
    // fumadores para ser atendidos por prioridad
    const priorFumadores = await Paciente.find({
      rangoEdad: "Joven",
      fumador: true,
      prioridad: { $gt: 4 },
    });

    if (priorFumadores.length === 0) {
      return res.status(404).json({
        message:
          "No hay pacientes fumadores que necesiten ser atendidos por urgencia.",
      });
    }

    //mapear nombres
    const nombresPacientes = priorFumadores.map(
      (paciente) => paciente.nombre
    );
    return res.json(nombresPacientes);

  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error al buscar pacientes fumadores urgentes." });
  }
});






/*  */
router.get("/masanciano", async (req, res) => {
  try {
    const pacientesEnEspera = await Paciente.find({ estado: "En espera" });

    if (pacientesEnEspera.length === 0) {
      return res
        .status(404)
        .json({ message: "No hay pacientes en sala de espera." });
    }

    // buscar paciente más anciano
    let pacienteMasAnciano = pacientesEnEspera[0];
    for (let i = 1; i < pacientesEnEspera.length; i++) {
      if (pacientesEnEspera[i].rangoEdad === "Anciano" && pacientesEnEspera[i].edad > pacienteMasAnciano.edad) {
        pacienteMasAnciano = pacientesEnEspera[i];
      }
    }

    return res.json(pacienteMasAnciano);

  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error al buscar al paciente más anciano." });
  }
});

module.exports = router;
