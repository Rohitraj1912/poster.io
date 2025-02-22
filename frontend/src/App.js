import React from "react";
import "./App.css";
import Header from "./component/header/header";
import Workspace from "./component/workspace/workspace";


function App() {
  return (
    <div className="App">
      <Header />
      <div className="content">
        <Workspace/>
      </div>
    </div>
  );
}

export default App;
