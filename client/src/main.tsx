import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { Provider } from "react-redux"
import { store } from "@/store"

import "./index.css"
import App from "./App.tsx"
import { ThemeProvider } from "@/components/theme-provider.tsx"
import { LibraryProvider } from "@/context/LibraryContext.tsx"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <ThemeProvider>
        <LibraryProvider>
          <App />
        </LibraryProvider>
      </ThemeProvider>
    </Provider>
  </StrictMode>
)

