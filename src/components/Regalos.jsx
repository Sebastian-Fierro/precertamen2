import React, { useEffect, useState } from "react";
import { collection, query, orderBy, getDocs } from "firebase/firestore";
import { db } from "../firebaseConfig";

export default function Regalos() {
  const [regalos, setRegalos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;

    async function fetchRegalos() {
      setLoading(true);
      setError(null);
      try {
        const q = query(collection(db, "Regalos"), orderBy("prioridad", "desc"));
        const snapshot = await getDocs(q);
        const items = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        if (mounted) setRegalos(items);
      } catch (err) {
        if (mounted) setError(err.message || "Error fetching datos");
      } finally {
        if (mounted) setLoading(false);
      }
    }

    fetchRegalos();

    return () => {
      mounted = false;
    };
  }, []);

  if (loading) return <div>Cargando regalos...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {regalos.length === 0 ? (
        <div>No hay regalos</div>
      ) : (
        <table style={{ borderCollapse: "collapse", width: "100%" }}>
          <thead>
            <tr>
              <th style={{ border: "1px solid #ccc", padding: "8px", textAlign: "left" }}>Nombre Familiar</th>
              <th style={{ border: "1px solid #ccc", padding: "8px", textAlign: "left" }}>Regalo</th>
              <th style={{ border: "1px solid #ccc", padding: "8px", textAlign: "left" }}>Prioridad</th>
            </tr>
          </thead>
          <tbody>
            {regalos.map((r) => (
              <tr key={r.id}>
                <td style={{ border: "1px solid #eee", padding: "8px" }}>{r.nombreFamiliar}</td>
                <td style={{ border: "1px solid #eee", padding: "8px" }}>{r.nombre}</td>
                <td style={{ border: "1px solid #eee", padding: "8px" }}>{r.prioridad}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
