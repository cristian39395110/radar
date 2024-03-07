import "./App.css";
import { BrowserRouter, RouterProvider } from "react-router-dom";
import { MainRouter } from "./routes";
import { useAuthStore } from "./state";
import { QueryClient, QueryClientProvider } from "react-query";
import { useModalStore } from "./state/modal.store";
import StatusModal from "./components/StatusModal";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
const queryClient = new QueryClient();

function App() {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <QueryClientProvider client={queryClient}>
        <StatusModal />
        <BrowserRouter>
          <MainRouter />
        </BrowserRouter>
      </QueryClientProvider>
    </LocalizationProvider>
  );
}

export default App;
