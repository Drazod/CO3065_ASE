import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import Welcome from "./layouts/welcomePage";
import Booking from "./layouts/bookPage";
import LogInPage from "./layouts/loginPage";
import Profile from "./layouts/profilePage";
import ProtectedRoute from "./routes/ProtectedRoutes";
import Register from "./layouts/registerPage";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LogInPage />} />
        <Route path="/" element={<Welcome />} />
        <Route path="/home" element={<Welcome />} />
        <Route path="/register" element={<Register />} />
        <Route path="/booking" element={<Booking/>}/>
        <Route path="/profile" element={<Profile />} />
        {/* <Route
          path="/booking"
          element={
            <ProtectedRoute>
              <Store />
            </ProtectedRoute>
          }
        /> */}
      </Routes>
    </BrowserRouter>
  );
};

export default App;
