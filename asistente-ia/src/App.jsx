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

  // Cargar tareas guardadas
  useEffect(() => {
    const data = localStorage.getItem("tareas");
    if (data !== null) {
      setTareas(JSON.parse(data));
    }
  }, []);

  useEffect(() => {
    if (tareas.length > 0) {
      localStorage.setItem("tareas", JSON.stringify(tareas));
    }
  }, [tareas]);

  // IA: calcular puntaje
  const calcularPuntaje = (t) => {
    return (
      Number(t.importancia) * 2 +
      Number(t.dificultad) * 1.5 +
      (1 / Number(t.dias)) * 5
    );
  };

  // IA: recomendación
  const recomendacion = (t) => {
    if (t.dias <= 2) return "Urgente";
    if (t.dificultad >= 4) return "Dividir tarea";
    if (t.tiempo > 3) return "Tomar pausas";
    return "Normal";
  };

  // IA: nivel de prioridad (para colores)
  const nivelPrioridad = (t) => {
    const p = calcularPuntaje(t);
    if (p > 8) return "alta";
    if (p > 5) return "media";
    return "baja";
  };

  // Ordenar tareas
  const ordenarTareas = () => {
    const ordenadas = [...tareas].sort((a, b) => {
      // Manejar tareas completadas
      if ((a.completada || false) && !(b.completada || false)) {
        return 1;
      }

      if (!(a.completada || false) && (b.completada || false)) {
        return -1;
      }

      // Orden normal por prioridad
      return calcularPuntaje(b) - calcularPuntaje(a);
    });

    setTareas(ordenadas);
  };

  // Agregar tarea
  const agregarTarea = () => {
    const tiempo = Number(form.tiempo);
    const dias = Number(form.dias);
    const dificultad = Number(form.dificultad);
    const importancia = Number(form.importancia);

    //Validaciones
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

    //Si todo está bien
    setMensaje("Tarea agregada correctamente");
    setTareas([...tareas, { ...form, completada: false }]);

    setForm({
      nombre: "",
      tiempo: "",
      dias: "",
      dificultad: "",
      importancia: "",
    });
  };
  // Eliminar tarea
  const eliminarTarea = (index) => {
    const nuevas = tareas.filter((_, i) => i !== index);
    setTareas(nuevas);
  };

  // Marcar completada
  const toggleCompletada = (index) => {
    const nuevas = [...tareas];
    nuevas[index].completada = !nuevas[index].completada;
    setTareas(nuevas);
  };

  const mostrarAlerta = (texto) => {
    setMensaje(texto);
    setMostrarModal(true);
  };

  const cerrarModal = () => {
    setMostrarModal(false);
  };

  return (
    <div
      style={{
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        gap: "10px",
      }}
    >
      <h1>Asistente Inteligente</h1>
      {mostrarModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              backgroundColor: "white",
              padding: "20px",
              borderRadius: "10px",
              minWidth: "300px",
              textAlign: "center",
            }}
          >
            <h2>¡¡¡Alerta!!!</h2>

            <p>{mensaje}</p>

            <button onClick={cerrarModal}>Cerrar</button>
          </div>
        </div>
      )}

      {/* FORMULARIO */}
      <input
        value={form.nombre}
        placeholder="Nombre"
        onChange={(e) => setForm({ ...form, nombre: e.target.value })}
      />

      <input
        value={form.tiempo}
        type="number"
        min="1"
        max="24"
        placeholder="Tiempo (horas)"
        onChange={(e) => setForm({ ...form, tiempo: e.target.value })}
      />

      <input
        value={form.dias}
        type="number"
        min="1"
        max="30"
        placeholder="Días para entregar"
        onChange={(e) => setForm({ ...form, dias: e.target.value })}
      />

      <input
        value={form.dificultad}
        type="number"
        min="1"
        max="5"
        placeholder="Dificultad (1-5)"
        onChange={(e) => setForm({ ...form, dificultad: e.target.value })}
      />

      <input
        value={form.importancia}
        type="number"
        min="1"
        max="5"
        placeholder="Importancia (1-5)"
        onChange={(e) => setForm({ ...form, importancia: e.target.value })}
      />

      <button onClick={agregarTarea}>Agregar tarea</button>

      <button onClick={ordenarTareas}>Calcular prioridad</button>

      {/* LISTA */}
      <ul>
        {tareas.map((t, i) => (
          <li
            key={i}
            style={{
              textDecoration: t.completada ? "line-through" : "none",
              opacity: t.completada ? 0.5 : 1,
              color:
                nivelPrioridad(t) === "alta"
                  ? "red"
                  : nivelPrioridad(t) === "media"
                    ? "orange"
                    : "green",
            }}
          >
            <input
              type="checkbox"
              checked={t.completada}
              onChange={() => toggleCompletada(i)}
            />
            <strong>{t.nombre}</strong> | Puntaje:{" "}
            {calcularPuntaje(t).toFixed(2)} |{recomendacion(t)}
            <button onClick={() => eliminarTarea(i)}> ❌ </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
