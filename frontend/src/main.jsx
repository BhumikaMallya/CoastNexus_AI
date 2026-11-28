import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

function show(msg) {
  let box = document.getElementById("err-box");
  if (!box) {
    box = document.createElement("pre");
    box.id = "err-box";
    box.style.cssText = "position:fixed;inset:0;z-index:99999;margin:0;padding:16px;overflow:auto;white-space:pre-wrap;background:#2a0f1a;color:#ffb3c1;font:13px/1.4 monospace";
    document.body.appendChild(box);
  }
  box.textContent += msg + "\n\n";
}

window.addEventListener("error", (e) => show("Error: " + e.message + "\n" + (e.error?.stack || "")));
window.addEventListener("unhandledrejection", (e) => show("Promise error: " + (e.reason?.stack || e.reason)));

createRoot(document.getElementById("root")).render(<App />);
