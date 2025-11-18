import React, { useEffect, useState, useRef } from "react";
import { collection, query, orderBy, getDocs } from "firebase/firestore";
import { db } from "../firebaseConfig";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import html2canvas from "html2canvas";

export default function Adornos() {
  const [adornos, setAdornos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const tableRef = useRef(null);

  useEffect(() => {
    let mounted = true;

    async function fetchAdornos() {
      setLoading(true);
      setError(null);
      try {
        const q = query(collection(db, "Adornos"), orderBy("cantidad", "asc"));
        const snapshot = await getDocs(q);
        const items = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
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

  // EXPORTAR PDF
  const exportPDF = () => {
    const doc = new jsPDF();

    doc.text("Listado de Adornos", 14, 10);

    autoTable(doc, {
      head: [["Nombre Adorno", "Cantidad"]],
      body: adornos.map((r) => [r.nombreAdorno, r.cantidad]),
    });

    doc.save("adornos.pdf");
  };

  // EXPORTAR EXCEL
  const exportExcel = () => {
    const wsData = [
      ["Nombre Adorno", "Cantidad"],
      ...adornos.map((r) => [r.nombreAdorno, r.cantidad]),
    ];

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(wsData);

    XLSX.utils.book_append_sheet(wb, ws, "Adornos");
    XLSX.writeFile(wb, "adornos.xlsx");
  };

  // EXPORTAR PNG
  const exportPNG = () => {
    if (!tableRef.current) return;

    html2canvas(tableRef.current).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");

      const link = document.createElement("a");
      link.href = imgData;
      link.download = "adornos.png";
      link.click();
    });
  };

  if (loading) return <div>Cargando adornos...</div>;
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

      {adornos.length === 0 ? (
        <div>No hay adornos</div>
      ) : (
        <table style={{ borderCollapse: "collapse", width: "100%" }} ref={tableRef}>
          <thead>
            <tr>
              <th
                style={{
                  border: "1px solid #ccc",
                  padding: "8px",
                  textAlign: "left",
                }}
              >
                Nombre Adorno
              </th>
              <th
                style={{
                  border: "1px solid #ccc",
                  padding: "8px",
                  textAlign: "left",
                }}
              >
                Cantidad
              </th>
            </tr>
          </thead>
          <tbody>
            {adornos.map((r) => (
              <tr key={r.id}>
                <td style={{ border: "1px solid #eee", padding: "8px" }}>
                  {r.nombreAdorno}
                </td>
                <td style={{ border: "1px solid #eee", padding: "8px" }}>
                  {r.cantidad}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
