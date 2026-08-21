import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import TicketList from "./pages/TicketList";
import TicketDetails from "./pages/TicketDetails";
import CreateTicket from "./pages/CreateTicket";
import EditTicket from "./pages/EditTicket";
import ManageAgents from "./pages/ManageAgents";
import ManageCustomers from "./pages/ManageCustomers";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/tickets" element={<TicketList />} />
        <Route path="/tickets/:id" element={<TicketDetails />} />
        <Route path="/tickets/new" element={<CreateTicket />} />
        <Route path="/tickets/:id/edit" element={<EditTicket />} />
        <Route path="/agents" element={<ManageAgents />} />
        <Route path="/customers" element={<ManageCustomers />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
