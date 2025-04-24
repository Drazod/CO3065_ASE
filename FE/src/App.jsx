import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import Welcome from "./layouts/welcomePage";
import Store from "./layouts/storePage";
import LogInPage from "./layouts/loginPage";
import ProtectedRoute from "./routes/ProtectedRoutes";
import Register from "./layouts/registerPage";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LogInPage />} />
        <Route path="/" element={<Welcome />} />
        <Route
          path="/store"
          element={
            <ProtectedRoute>
              <Store />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
