import React, { useEffect, useState, useRef } from "react";
import { collection, query, orderBy, getDocs } from "firebase/firestore";
import { db } from "../firebaseConfig";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import html2canvas from "html2canvas";

export default function Comida() {
  const [comidas, setComidas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const tableRef = useRef(null);

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

  // EXPORTAR PDF
  const exportPDF = () => {
    const doc = new jsPDF();

    doc.text("Listado de Comidas", 14, 10);

    autoTable(doc, {
      head: [["Nombre", "Congelado"]],
      body: comidas.map((c) => [
        c.nombre,
        c.congelado ? "Sí" : "No",
      ]),
    });

    doc.save("comidas.pdf");
  };

  // EXPORTAR EXCEL
  const exportExcel = () => {
    const wsData = [
      ["Nombre", "Congelado"],
      ...comidas.map((c) => [c.nombre, c.congelado ? "Sí" : "No"]),
    ];

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(wsData);

    XLSX.utils.book_append_sheet(wb, ws, "Comidas");
    XLSX.writeFile(wb, "comidas.xlsx");
  };

  // EXPORTAR PNG
  const exportPNG = () => {
    if (!tableRef.current) return;

    html2canvas(tableRef.current).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");

      const link = document.createElement("a");
      link.href = imgData;
      link.download = "comidas.png";
      link.click();
    });
  };

  if (loading) return <div>Cargando comidas...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <div style={{ marginBottom: "15px" }}>
        <button onClick={exportPDF} style={{ marginRight: "10px" }}>Exportar PDF</button>
        <button onClick={exportExcel} style={{ marginRight: "10px" }}>Exportar Excel</button>
        <button onClick={exportPNG}>Exportar PNG</button>
      </div>
      {comidas.length === 0 ? (
        <div>No hay comidas</div>
      ) : (
        
        <table style={{ borderCollapse: "collapse", width: "100%" }} ref={tableRef}>
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
