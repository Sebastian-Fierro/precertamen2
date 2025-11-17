import React, { Fragment } from "react";
import Regalos from "./components/Regalos";
import Comida from "./components/Comida";


export function App() {
  return (
    <Fragment>
      <div style={{ padding: 20 }}>
        <h1>Lista de Regalos</h1>
        <Regalos />
        <h1>Lista de Comidas</h1>
        <Comida />
      </div>
    </Fragment>
  );
}