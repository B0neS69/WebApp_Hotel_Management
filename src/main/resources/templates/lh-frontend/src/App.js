
import './App.css';
import React from "react";
import { HashRouter as Router, Route, Routes } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import Header from "./components/Header";
import Footer from "./components/Footer";
import "./styles/global.css";

function App() {
  return (
      <Router>
        <Header />
        <AppRoutes />
        <Footer />
      </Router>
  );
}

export default App;
