import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import "./styles.css";

const showRuntimeError = (message, source, line, column, error) => {
  const root = document.getElementById("root");
  if (!root) return;
  root.innerHTML = `
    <div style="min-height:100vh;background:#0a0a0a;color:white;padding:32px;font-family:Cairo,Arial,sans-serif;direction:ltr">
      <h1 style="color:#ff0000;font-size:32px">Runtime error</h1>
      <pre style="white-space:pre-wrap;background:#111;padding:20px;border:1px solid #333">${message}
${source || ""}:${line || ""}:${column || ""}
${error?.stack || ""}</pre>
    </div>
  `;
};

window.addEventListener("error", (event) => {
  showRuntimeError(event.message, event.filename, event.lineno, event.colno, event.error);
});

window.addEventListener("unhandledrejection", (event) => {
  showRuntimeError(event.reason?.message || String(event.reason), "", "", "", event.reason);
});

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error) {
    showRuntimeError(error.message, "", "", "", error);
  }

  render() {
    if (this.state.error) {
      return null;
    }
    return this.props.children;
  }
}

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ErrorBoundary>
  </React.StrictMode>
);
