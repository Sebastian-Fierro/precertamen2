import React, { useEffect, useState, useRef } from "react";
import { collection, query, orderBy, getDocs } from "firebase/firestore";
import { db } from "../firebaseConfig";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import html2canvas from "html2canvas";

export default function Regalos() {
  const [regalos, setRegalos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const tableRef = useRef(null);

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

  // EXPORTAR PDF
  const exportPDF = () => {
    const doc = new jsPDF();

    doc.text("Listado de Regalos", 14, 10);

    autoTable(doc, {
      head: [["Nombre Familiar", "Regalo", "Prioridad"]],
      body: regalos.map((r) => [r.nombreFamiliar, r.nombre, r.prioridad]),
    });

    doc.save("regalos.pdf");
  };

  // EXPORTAR EXCEL
  const exportExcel = () => {
    const wsData = [
      ["Nombre Familiar", "Regalo", "Prioridad"],
      ...regalos.map((r) => [r.nombreFamiliar, r.nombre, r.prioridad]),
    ];

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(wsData);

    XLSX.utils.book_append_sheet(wb, ws, "Regalos");
    XLSX.writeFile(wb, "regalos.xlsx");
  };

  // EXPORTAR PNG
  const exportPNG = () => {
    if (!tableRef.current) return;

    html2canvas(tableRef.current).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");

      const link = document.createElement("a");
      link.href = imgData;
      link.download = "regalos.png";
      link.click();
    });
  };

  if (loading) return <div>Cargando regalos...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>

      <div style={{ marginBottom: "15px" }}>
        <button onClick={exportPDF} style={{ marginRight: "10px" }}>
          Exportar PDF
        </button>
        <button onClick={exportExcel} style={{ marginRight: "10px" }}>
          Exportar Excel
        </button>
        <button onClick={exportPNG}>Exportar PNG</button>
      </div>

      {regalos.length === 0 ? (
        <div>No hay regalos</div>
      ) : (
        <table style={{ borderCollapse: "collapse", width: "100%" }} ref={tableRef}>
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
