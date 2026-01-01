// // import { Route, Routes } from "react-router";
// import React from "react";
// import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";

// import Navbar from "./components/Navbar";
// import HomePage from "./pages/HomePage";
// import CreatePage from "./pages/CreatePage";
// import EditPage from "./pages/EditPage";
// import FoodDetailPage from "./pages/FoodDetailPage";
// import toast from "react-hot-toast";

// const App = () => {
//   return (
//      <div >
    
//      <button className="btn btn-outline">click me</button> 
//       <Routes>
//         <Route path="/" element={<HomePage />} />
//         <Route path="/create" element={<CreatePage />} />
//         <Route path="/edit/:id" element={<EditPage />} />
//         <Route path="/food/:id" element={<FoodDetailPage />} />
//       </Routes>
//      </div> 
//     // </Router>
//   );
// };
// export default App;



import React from "react";
import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import CreatePage from "./pages/CreatePage";
import EditPage from "./pages/EditPage";
import FoodDetailPage from "./pages/FoodDetailPage";

const App = () => {
  return (
    <div>
      <Navbar />
      <div style={{ padding: "0 20px" }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/create" element={<CreatePage />} />
          <Route path="/edit/:id" element={<EditPage />} />
          <Route path="/food/:id" element={<FoodDetailPage />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;
