import React, { useEffect, useState } from "react";
import { collection, query, orderBy, getDocs } from "firebase/firestore";
import { db } from "../firebaseConfig";

export default function Adornos() {
  const [adornos, setAdornos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;

    async function fetchAdornos() {
      setLoading(true);
      setError(null);
      try {
        const q = query(collection(db, "Adornos"), orderBy("cantidad", "asc"));
        const snapshot = await getDocs(q);
        const items = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        if (mounted) setAdornos(items);
      } catch (err) {
        if (mounted) setError(err.message || "Error fetching datos");
      } finally {
        if (mounted) setLoading(false);
      }
    }

    fetchAdornos();

    return () => {
      mounted = false;
    };
  }, []);

  if (loading) return <div>Cargando adornos...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {adornos.length === 0 ? (
        <div>No hay adornos</div>
      ) : (
        <table style={{ borderCollapse: "collapse", width: "100%" }}>
          <thead>
            <tr>
              <th style={{ border: "1px solid #ccc", padding: "8px", textAlign: "left" }}>Nombre Adorno</th>
              <th style={{ border: "1px solid #ccc", padding: "8px", textAlign: "left" }}>Cantidad</th>
            </tr>
          </thead>
          <tbody>
            {adornos.map((r) => (
              <tr key={r.id}>
                <td style={{ border: "1px solid #eee", padding: "8px" }}>{r.nombreAdorno}</td>
                <td style={{ border: "1px solid #eee", padding: "8px" }}>{r.cantidad}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
