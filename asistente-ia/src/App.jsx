import { useState, useEffect } from "react";

function App() {
  const [tareas, setTareas] = useState([]);
  const [mensaje, setMensaje] = useState("");
  const [mostrarModal, setMostrarModal] = useState(false);

  const [form, setForm] = useState({
    nombre: "",
    tiempo: "",
    dias: "",
    dificultad: "",
    importancia: "",
  });

  // =========================
  // CARGAR TAREAS
  // =========================
  useEffect(() => {
    const data = localStorage.getItem("tareas");

    if (data) {
      setTareas(JSON.parse(data));
    }
  }, []);

  // =========================
  // GUARDAR TAREAS
  // =========================
  useEffect(() => {
    localStorage.setItem("tareas", JSON.stringify(tareas));
  }, [tareas]);

  // =========================
  // IA - CALCULAR PUNTAJE
  // =========================
  const calcularPuntaje = (t) => {
    return (
      Number(t.importancia) * 2 +
      Number(t.dificultad) * 1.5 +
      (1 / Number(t.dias)) * 5
    );
  };

  // =========================
  // IA - RECOMENDACIONES
  // =========================
  const recomendacion = (t) => {
    if (t.dias <= 2) return "Urgente";
    if (t.dificultad >= 4) return "Dividir tarea";
    if (t.tiempo > 3) return "Tomar pausas";

    return "Normal";
  };

  // =========================
  // IA - NIVEL PRIORIDAD
  // =========================
  const nivelPrioridad = (t) => {
    const p = calcularPuntaje(t);

    if (p > 8) return "alta";
    if (p > 5) return "media";

    return "baja";
  };

  // =========================
  // MODAL
  // =========================
  const mostrarAlerta = (texto) => {
    setMensaje(texto);
    setMostrarModal(true);
  };

  const cerrarModal = () => {
    setMostrarModal(false);
  };

  // =========================
  // AGREGAR TAREA
  // =========================
  const agregarTarea = () => {
    const tiempo = Number(form.tiempo);
    const dias = Number(form.dias);
    const dificultad = Number(form.dificultad);
    const importancia = Number(form.importancia);

    // VALIDACIONES
    if (!form.nombre) {
      mostrarAlerta("El nombre es obligatorio");
      return;
    }

    if (tiempo < 1 || tiempo > 24) {
      mostrarAlerta("El tiempo debe estar entre 1 y 24 horas");
      return;
    }

    if (dias < 1 || dias > 30) {
      mostrarAlerta("Los días deben estar entre 1 y 30");
      return;
    }

    if (dificultad < 1 || dificultad > 5) {
      mostrarAlerta("La dificultad debe estar entre 1 y 5");
      return;
    }

    if (importancia < 1 || importancia > 5) {
      mostrarAlerta("La importancia debe estar entre 1 y 5");
      return;
    }

    // AGREGAR
    setTareas([
      ...tareas,
      {
        ...form,
        completada: false,
      },
    ]);

    // LIMPIAR FORM
    setForm({
      nombre: "",
      tiempo: "",
      dias: "",
      dificultad: "",
      importancia: "",
    });

    mostrarAlerta("Tarea agregada correctamente");
  };

  // =========================
  // ORDENAR TAREAS
  // =========================
  const ordenarTareas = () => {
    const ordenadas = [...tareas].sort((a, b) => {
      // completadas al final
      if (a.completada && !b.completada) return 1;

      if (!a.completada && b.completada) return -1;

      // ordenar por prioridad
      return calcularPuntaje(b) - calcularPuntaje(a);
    });

    setTareas(ordenadas);
  };

  // =========================
  // ELIMINAR
  // =========================
  const eliminarTarea = (index) => {
    const nuevas = tareas.filter((_, i) => i !== index);

    setTareas(nuevas);
  };

  // =========================
  // COMPLETAR
  // =========================
  const toggleCompletada = (index) => {
    const nuevas = [...tareas];

    nuevas[index].completada = !nuevas[index].completada;

    setTareas(nuevas);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#0f172a",
        padding: "30px",
        fontFamily: "Arial",
        color: "white",
      }}
    >
      <div
        style={{
          maxWidth: "700px",
          margin: "auto",
          display: "flex",
          flexDirection: "column",
          gap: "15px",
        }}
      >
        {/* TITULO */}
        <h1
          style={{
            textAlign: "center",
            fontSize: "45px",
            marginBottom: "20px",
          }}
        >
          Asistente Inteligente
        </h1>

        {/* MODAL */}
        {mostrarModal && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              backgroundColor: "rgba(0,0,0,0.6)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 1000,
            }}
          >
            <div
              style={{
                backgroundColor: "white",
                color: "black",
                padding: "25px",
                borderRadius: "12px",
                width: "320px",
                textAlign: "center",
              }}
            >
              <h2>⚠️ Alerta</h2>

              <p>{mensaje}</p>

              <button
                onClick={cerrarModal}
                style={{
                  marginTop: "10px",
                  padding: "10px 20px",
                  border: "none",
                  borderRadius: "8px",
                  backgroundColor: "#2563eb",
                  color: "white",
                  cursor: "pointer",
                }}
              >
                Cerrar
              </button>
            </div>
          </div>
        )}

        {/* INPUTS */}
        <input
          value={form.nombre}
          placeholder="Nombre"
          onChange={(e) => setForm({ ...form, nombre: e.target.value })}
          style={inputStyle}
        />

        <input
          value={form.tiempo}
          type="number"
          min="1"
          max="24"
          placeholder="Tiempo (1-24 horas)"
          onChange={(e) => setForm({ ...form, tiempo: e.target.value })}
          style={inputStyle}
        />

        <input
          value={form.dias}
          type="number"
          min="1"
          max="30"
          placeholder="Días para entregar"
          onChange={(e) => setForm({ ...form, dias: e.target.value })}
          style={inputStyle}
        />

        <input
          value={form.dificultad}
          type="number"
          min="1"
          max="5"
          placeholder="Dificultad (1-5)"
          onChange={(e) => setForm({ ...form, dificultad: e.target.value })}
          style={inputStyle}
        />

        <input
          value={form.importancia}
          type="number"
          min="1"
          max="5"
          placeholder="Importancia (1-5)"
          onChange={(e) => setForm({ ...form, importancia: e.target.value })}
          style={inputStyle}
        />

        {/* BOTONES */}
        <button
          onClick={agregarTarea}
          style={{
            ...buttonStyle,
            backgroundColor: "#16a34a",
          }}
        >
          Agregar tarea
        </button>

        <button
          onClick={ordenarTareas}
          style={{
            ...buttonStyle,
            backgroundColor: "#2563eb",
          }}
        >
          Calcular prioridad
        </button>

        {/* LISTA */}
        <div style={{ marginTop: "20px" }}>
          {tareas.map((t, i) => (
            <div
              key={i}
              style={{
                backgroundColor: "#1e293b",
                padding: "15px",
                borderRadius: "12px",
                marginBottom: "12px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                opacity: t.completada ? 0.5 : 1,
                textDecoration: t.completada ? "line-through" : "none",
                borderLeft:
                  nivelPrioridad(t) === "alta"
                    ? "6px solid red"
                    : nivelPrioridad(t) === "media"
                      ? "6px solid orange"
                      : "6px solid green",
              }}
            >
              {/* IZQUIERDA */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "15px",
                }}
              >
                <input
                  type="checkbox"
                  checked={t.completada}
                  onChange={() => toggleCompletada(i)}
                />

                <div>
                  <h3 style={{ margin: 0 }}>{t.nombre}</h3>

                  <p style={{ margin: "5px 0" }}>
                    Puntaje: {calcularPuntaje(t).toFixed(2)}
                  </p>

                  <p style={{ margin: 0 }}>{recomendacion(t)}</p>
                </div>
              </div>

              {/* DERECHA */}
              <button
                onClick={() => eliminarTarea(i)}
                style={{
                  backgroundColor: "#ef4444",
                  border: "none",
                  color: "white",
                  padding: "8px 12px",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontSize: "16px",
                }}
              >
                ❌
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// =========================
// ESTILOS
// =========================
const inputStyle = {
  padding: "12px",
  borderRadius: "8px",
  border: "1px solid gray",
  fontSize: "16px",
};

const buttonStyle = {
  padding: "12px",
  border: "none",
  borderRadius: "8px",
  color: "white",
  fontSize: "16px",
  cursor: "pointer",
};

export default App;
