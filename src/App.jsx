import AppRoutes from "./routes/AppRoutes";
import GlobalLoader from "./globalLoader";

export default function App() {

  return (
    <>
      <GlobalLoader />

      <AppRoutes />
    </>
  );
}
