/* @refresh reload */
import { render } from "solid-js/web";

import "./index.css";
import App from "./App";

const root = document.getElementById("root");

if (import.meta.env.DEV && !(root instanceof HTMLElement)) {
  throw new Error(
    "Root element not found. Did you forget to add it to your index.html? Or maybe the id attribute got misspelled?"
  );
}

console.log("%cStreamy.gg", "font-size: 50px; color: #0ea165;");
console.log(
  "%cThis is a browser feature intended for developers. " +
    "If someone told you to copy and paste something here, don't do it. It may compromise your account.",
  "font-size: 16px;"
);

render(() => <App />, root!);
