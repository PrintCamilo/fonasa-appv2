const express = require("express");
const router = express.Router();
const Consulta = require("../models/Consulta");
const Paciente = require("../models/Paciente");

// Ruta para listar las consultas
router.get("/", async (req, res) => {
  try {
    const consultas = await Consulta.find();
    res.json(consultas);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});



//atender consultas
router.post("/atender", async (req, res) => {
  const { idConsulta, noHistoriaClinica  } = req.body;
  try {
    const consulta = await Consulta.findOne({
      id: idConsulta,
      estado: "En espera",
    });
    const paciente = await Paciente.findOne({ noHistoriaClinica  });
    if (!paciente) {
      return res.status(404).json({ message: "El paciente no existe." });
    }
    // Actualizar estado de la consulta
    consulta.estado = "Ocupada";
    consulta.cantidadPacientes += 1;
    await consulta.save();
    return res.json({ message: "Paciente atendido con éxito." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al atender al paciente." });
  }
});




//liberar consultas
router.post("/liberar", async (req, res) => {
  try {
    const consultasOcupadas = await Consulta.find({ estado: "Ocupada" });

    if (consultasOcupadas.length === 0) {
      return res.status(404).json({ message: "No hay consultas ocupadas para liberar." });
    }

    for (const consulta of consultasOcupadas) {
      consulta.estado = "En espera";
      consulta.cantidadPacientes = 0;
      await consulta.save();
    }

    // buscar pacientes en espera
    const pacientesEspera = await Paciente.find({ estado: "En espera" });

    // atender pacientes en espera
    for (const paciente of pacientesEspera) {
      const consultaDisponible = await encontrarConsultaDisponible();

      if (consultaDisponible) {
        paciente.estado = "Atendido";
        await paciente.save();
      
        consultaDisponible.estado = "Ocupada";
        consultaDisponible.cantidadPacientes += 1;
        await consultaDisponible.save();
      }
    }

    return res.json({
      message: "Consultas liberadas y pacientes atendidos en sala de espera.",
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message:
        "Error al liberar consultas y atender pacientes en sala de espera.",
    });
  }
});

async function encontrarConsultaDisponible() {
  const consultaDisponible = await Consulta.findOne({ estado: "En espera" });
  return consultaDisponible;
}






/* consulta con mas pacientes */
router.get("/maspacientes", async (req, res) => {
  try {
    const consultaMasPacientes = await Consulta.findOne().sort({
      cantidadPacientes: -1,
    });

    if (!consultaMasPacientes) {
      return res
        .status(404)
        .json({ message: "No se encontraron consultas atendidas." });
    }

    return res.json(consultaMasPacientes);

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error al buscar la consulta con más pacientes atendidos.",
    });
  }
});







/* por hacer: optimizar */
router.post("/optimizar", async (req, res) => {});






/* consultas disponibles */
router.get("/disponibles", async (req, res) => {
  try {
    const consultas = await Consulta.find({ estado: "desocupada" });
    res.json(consultas);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
