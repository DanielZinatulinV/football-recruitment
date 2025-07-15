import { RouterProvider } from "react-router-dom";
import routes from "./routes";
import { useAuthTokenInit } from "./shared/hooks/use-auth-token-init";

function App() {
  useAuthTokenInit();
  return <RouterProvider router={routes} />;
}

export default App;
