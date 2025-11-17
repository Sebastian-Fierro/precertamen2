import React, { Fragment } from "react";
import Regalos from "./components/Regalos";


export function App() {
  return (
    <Fragment>
      <div style={{ padding: 20 }}>
        <h1>Lista de Regalos</h1>
        <Regalos />
      </div>
    </Fragment>
  );
}