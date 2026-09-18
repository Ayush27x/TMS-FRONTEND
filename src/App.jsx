// Import from library
import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";


import Login from "./page/login";
import Dashboard from "./page/Dashboard";
import Tickets from "./page/Tickets";
import TicketDetails from "./page/TicketDetails";


function App() {

  return (

    <BrowserRouter>
  
      <Routes>

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/dashboard"
          element={<Dashboard />}
        />

        <Route
          path="/tickets"
          element={<Tickets />}
        />

        <Route
          path="/tickets/:id"
          element={<TicketDetails />}
        />

      </Routes>

    </BrowserRouter>
  );

}

export default App;