import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Welcome from "./layouts/welcomePage";
import Store from "./layouts/storePage";
import Register from "./layouts/registerPage";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Welcome/>}/>
        <Route path="/store" element={<Store/>}/>
        <Route path="/register" element={<Register/>}/>
        {/* <Route path="/home" element={<Home/>}/>

        <Route path="/product" element={<Product/>}/> */}
      </Routes>
    </BrowserRouter>
  );
};

export default App;
