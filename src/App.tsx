import "./App.css";
import {
  BrowserRouter,
  redirect,
  Navigate,
  createBrowserRouter,
  RouterProvider,
  Route,
  Routes,
} from "react-router";
import Login from "./components/login/login";
import Files from "./components/files/files.component";
import Header from "./components/header/header.component";
import store from "./redux/store";
import { Provider } from "react-redux";

function App() {
  return (
    <Provider store={store}>
      <div className="App h-[100vh]">
        <Header />
        <section className="h-[calc(100vh-100px)] overflow-y-auto">
          <BrowserRouter>
            <Routes>
              <Route index path="/login" element={<Login />}></Route>
              <Route path="/files" element={<Files />}></Route>
              <Route path="/" element={<Navigate to="/login" />} />
            </Routes>
          </BrowserRouter>
        </section>
      </div>
    </Provider>
  );
}

export default App;

// Code for future reference, created lazy route using 'createBrowserRouter'

// Step-1: Create routes
/* const router = createBrowserRouter([
    {
      path: "/files",
      async lazy() {
        const { default: Files } = await import(
          "./components/files/files.component"
        );
        return { Component: Files };
      },
    },
    {
      path: "/files",
      Component: Files,
    },
    {
      path: "/login",
      Component: Login,
    },
    {
      path: "/",
      loader: async () => redirect("/login"),
    },
  ]); */

// Step-2: Add RouterProvider to HTMl
/* <RouterProvider router={router} /> */
