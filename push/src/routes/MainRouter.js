import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ExampleView from "../views/ExampleView";
import Requirement from "../components/client/requirements/Requirement";
import Navbar from "../components/client/requirements/Navbar";
import JobRequirementsTable from "../components/client/requirements/JobRequirementsTable";

const MainRouter = () => {
  return (
    <Router>
      <Routes>
        
        <Route path="/" element={<Requirement />} />
        <Route path="/JobRequirementsTable" element={<JobRequirementsTable />} />
      </Routes>
    </Router>
  );
};

export default MainRouter;
