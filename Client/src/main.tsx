import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";
import React from "react";
<<<<<<< HEAD
import { Provider } from "react-redux";
import { store } from "./store/store.ts";
=======
>>>>>>> 1e061faa48b29d975b4f2c516a5b3184d56ae42e

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
<<<<<<< HEAD
      <Provider store={store}>
        <App />
      </Provider>
    </BrowserRouter>
  </React.StrictMode>
);
=======
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
>>>>>>> 1e061faa48b29d975b4f2c516a5b3184d56ae42e
