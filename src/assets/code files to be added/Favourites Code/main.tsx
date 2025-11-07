import { FavoritesProvider } from "./contexts/FavoritesContext";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <FavoritesProvider>
    <App />
  </FavoritesProvider>
);