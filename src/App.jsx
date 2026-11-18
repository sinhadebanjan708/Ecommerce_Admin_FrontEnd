import AppRoutes from "./routes/AppRoutes";
import GlobalLoader from "./globalLoader";
import GlobalAlert from "./pages/GlobalAlert";

export default function App() {

  return (
    <>
      <GlobalLoader />
      <GlobalAlert/>
      <AppRoutes />
    </>
  );
}
