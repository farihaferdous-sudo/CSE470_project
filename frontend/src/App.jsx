import { Route, Routes } from "react-router";

import HomePage from "./pages/HomePage";
import CreatePage from "./pages/CreatePage";
import FoodDetailPage from "./pages/FoodDetailPage";
import toast from "react-hot-toast";

const App = () => {
  return (
    <div >
    <button className="btn btn-outline">click me</button>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/create" element={<CreatePage />} />
        <Route path="/food/:id" element={<FoodDetailPage />} />
      </Routes>
    </div>
  );
};
export default App;