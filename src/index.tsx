import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import reportWebVitals from "./reportWebVitals";
import App from "./App";
import "./index.css";
import { getToken } from "./api/token/getToken";
import { setToken } from "./api/api";



const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement,
);

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
);

reportWebVitals();

const result = await getToken()
console.log('this', getToken(), result, setToken)