import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App"
import "./index.css"

// ИСПРАВЛЕНО: вместо небезопасного non-null assertion проверяем наличие корневого узла.
const rootElement = document.getElementById("root")

if (!rootElement) {
  throw new Error("Не найден корневой элемент приложения #root")
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
