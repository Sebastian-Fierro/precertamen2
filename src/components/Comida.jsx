import React, { useEffect, useState } from "react";
import { collection, query, orderBy, getDocs } from "firebase/firestore";
import { db } from "../firebaseConfig";

export default function Comida() {
  const [comidas, setComidas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;

    async function fetchComidas() {
      setLoading(true);
      setError(null);
      try {
        // Ordenamos por 'congelado' descendente para que los true (congelados) aparezcan primero
        const q = query(collection(db, "Comida"), orderBy("congelado", "desc"));
        const snapshot = await getDocs(q);
        const items = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        if (mounted) setComidas(items);
      } catch (err) {
        if (mounted) setError(err.message || "Error fetching datos");
      } finally {
        if (mounted) setLoading(false);
      }
    }

    fetchComidas();

    return () => {
      mounted = false;
    };
  }, []);

  if (loading) return <div>Cargando comidas...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {comidas.length === 0 ? (
        <div>No hay comidas</div>
      ) : (
        <table style={{ borderCollapse: "collapse", width: "100%" }}>
          <thead>
            <tr>
              <th style={{ border: "1px solid #ccc", padding: "8px", textAlign: "left" }}>Nombre</th>
              <th style={{ border: "1px solid #ccc", padding: "8px", textAlign: "left" }}>Congelado</th>
            </tr>
          </thead>
          <tbody>
            {comidas.map((c) => (
              <tr key={c.id}>
                <td style={{ border: "1px solid #eee", padding: "8px" }}>{c.nombre}</td>
                <td style={{ border: "1px solid #eee", padding: "8px" }}>{c.congelado ? "Sí" : "No"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
