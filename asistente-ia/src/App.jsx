import { useState, useEffect } from "react";

function App() {
  const [tareas, setTareas] = useState([]);
  const [form, setForm] = useState({
    nombre: "",
    tiempo: "",
    dias: "",
    dificultad: "",
    importancia: "",
  });

  // 🔹 Cargar tareas guardadas
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

  // 🧠 IA: calcular puntaje
  const calcularPuntaje = (t) => {
    return (
      Number(t.importancia) * 2 +
      Number(t.dificultad) * 1.5 +
      (1 / Number(t.dias)) * 5
    );
  };

  // 🧠 IA: recomendación
  const recomendacion = (t) => {
    if (t.dias <= 2) return "Urgente";
    if (t.dificultad >= 4) return "Dividir tarea";
    if (t.tiempo > 3) return "Tomar pausas";
    return "Normal";
  };

  // 🧠 IA: nivel de prioridad (para colores)
  const nivelPrioridad = (t) => {
    const p = calcularPuntaje(t);
    if (p > 8) return "alta";
    if (p > 5) return "media";
    return "baja";
  };

  // 🔹 Ordenar tareas
  const ordenarTareas = () => {
    const ordenadas = [...tareas].sort((a, b) => {
      return calcularPuntaje(b) - calcularPuntaje(a);
    });
    setTareas(ordenadas);
  };

  // 🔹 Agregar tarea
  const agregarTarea = () => {
    if (!form.nombre) return;

    setTareas([...tareas, { ...form, completada: false }]);

    setForm({
      nombre: "",
      tiempo: "",
      dias: "",
      dificultad: "",
      importancia: "",
    });
  };

  // 🔹 Eliminar tarea
  const eliminarTarea = (index) => {
    const nuevas = tareas.filter((_, i) => i !== index);
    setTareas(nuevas);
  };

  // 🔹 Marcar completada
  const toggleCompletada = (index) => {
    const nuevas = [...tareas];
    nuevas[index].completada = !nuevas[index].completada;
    setTareas(nuevas);
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

      {/* FORMULARIO */}
      <input
        value={form.nombre}
        placeholder="Nombre"
        onChange={(e) => setForm({ ...form, nombre: e.target.value })}
      />

      <input
        value={form.tiempo}
        placeholder="Tiempo (horas)"
        type="number"
        onChange={(e) => setForm({ ...form, tiempo: e.target.value })}
      />

      <input
        value={form.dias}
        placeholder="Días restantes"
        type="number"
        onChange={(e) => setForm({ ...form, dias: e.target.value })}
      />

      <input
        value={form.dificultad}
        placeholder="Dificultad (1-5)"
        type="number"
        onChange={(e) => setForm({ ...form, dificultad: e.target.value })}
      />

      <input
        value={form.importancia}
        placeholder="Importancia (1-5)"
        type="number"
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
