import { RouterProvider } from "react-router-dom";
import routes from "./routes";
import { useAuthReduxInit } from "./shared/hooks/use-auth-redux-init";

function App() {
  useAuthReduxInit();
  return <RouterProvider router={routes} />;
}

export default App;
