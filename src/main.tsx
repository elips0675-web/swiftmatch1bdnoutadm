import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { PwaRegistry } from "@/components/shared/pwa-registry";
import "./index.css";

createRoot(document.getElementById("root")!).render(<><PwaRegistry /><App /></>);
