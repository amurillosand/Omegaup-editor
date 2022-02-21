import React from "react";
import { ChakraProvider, theme } from "@chakra-ui/react";
import Navbar from "./pages/Navbar";
import Header from "./pages/Header";
import MainWindow from "./pages/MainWindow";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppContext } from "./AppContext";
import { useState } from "react";

export const App = () => {
  const [generator, setGenerator] = useState({
    code: "",
    language: "cpp",
  });

  const [solution, setSolution] = useState({
    code: "",
    language: "",
    text: ""
  });

  const [writing, setWriting] = useState("");
  const [title, setTitle] = useState("");

  const [cases, setCases] = useState([{}]);

  return (
    <ChakraProvider theme={theme}>
      <AppContext.Provider
        value={{
          generator, setGenerator,
          solution, setSolution,
          writing, setWriting,
          title, setTitle,
          cases, setCases
        }}>
        <>
          <Navbar />

          <BrowserRouter>
            <Routes>
              <Route path="/creator" element={
                <>
                  <Header />
                  <MainWindow />
                </>
              } />

              {/* <Route path="/">
                <MainPage />
              </Route> */}
            </Routes>
          </BrowserRouter>
        </>
      </AppContext.Provider>
    </ChakraProvider>
  );
};