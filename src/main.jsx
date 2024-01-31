// // import React from 'react'
// // import ReactDOM from 'react-dom/client'
// // import App from './App.jsx'
// // import './index.css'

// // ReactDOM.createRoot(document.getElementById('root')).render(
// //   <React.StrictMode>
// //     <App />
// //   </React.StrictMode>,
// // )

import React from "react";
import ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
  Routes,
  Route,
} from "react-router-dom";
import Register from "./screens/register/Register";
import Dashboard from "./screens/dashboard/Dashboard";
import PollCompletion from "./screens/pollCompletion/PollCompletion";
import QuizCompletion from "./screens/quizCompletion/QuizCompletion";
import Questions from "./screens/questions/Questions";
import ItemNotFound from "./screens/itemNotFound/ItemNotFound";
import QuizAnalysis from "./screens/quizAnalysis/QuizAnalysis";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Register />,
  },
  {
    path: "/dashboard",
    element: <Dashboard />,
  },
  {
    path: "/pollcompleted",
    element: <PollCompletion />,
  },
  {
    path: "/quizcompleted",
    element: <QuizCompletion />,
  },
  {
    path: "/quiz/:quizId",
    element: <Questions />,
  },
  {
    path: "/item-not-found",
    element: <ItemNotFound />,
  },
  {
    path: "/quizanalysis/:quizId",
    element: <QuizAnalysis />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router}>
      <Routes>
        {router}
        {/* Catch-all route for undefined routes */}
        <Route element={<ItemNotFound />} />
      </Routes>
    </RouterProvider>
  </React.StrictMode>
);

// import React from "react";
// import ReactDOM from "react-dom/client";
// import { BrowserRouter, Routes, Route } from "react-router-dom";
// import Register from "./screens/register/Register";
// import Dashboard from "./screens/dashboard/Dashboard";
// import PollCompletion from "./screens/pollCompletion/PollCompletion";
// import QuizCompletion from "./screens/quizCompletion/QuizCompletion";
// import Questions from "./screens/questions/Questions";
// import ItemNotFound from "./screens/itemNotFound/ItemNotFound";
// import QuizAnalysis from "./screens/quizAnalysis/QuizAnalysis";

// // Create a router instance using BrowserRouter
// const router = BrowserRouter;

// ReactDOM.createRoot(document.getElementById("root")).render(
//   <React.StrictMode>
//     {/* Wrap your app with BrowserRouter */}
//     <router>
//       <Routes>
//         <Route path="/" element={<Register />} />
//         <Route path="/dashboard" element={<Dashboard />} />
//         <Route path="/pollcompleted" element={<PollCompletion />} />
//         <Route path="/quizcompleted" element={<QuizCompletion />} />
//         <Route path="/quiz/:quizId" element={<Questions />} />
//         <Route path="/item-not-found" element={<ItemNotFound />} />
//         <Route path="/quizanalysis/:quizId" element={<QuizAnalysis />} />
//         {/* Catch-all route for undefined routes */}
//         <Route path="*" element={<ItemNotFound />} />
//       </Routes>
//     </router>
//   </React.StrictMode>
// );

// import React from "react";
// import ReactDOM from "react-dom/client";
// import {
//   createBrowserRouter,
//   RouterProvider,
//   Routes,
//   Route,
// } from "react-router-dom";
// import { createBrowserHistory } from "history";
// import Register from "./screens/register/Register";
// import Dashboard from "./screens/dashboard/Dashboard";
// import PollCompletion from "./screens/pollCompletion/PollCompletion";
// import QuizCompletion from "./screens/quizCompletion/QuizCompletion";
// import Questions from "./screens/questions/Questions";
// import ItemNotFound from "./screens/itemNotFound/ItemNotFound";
// import QuizAnalysis from "./screens/quizAnalysis/QuizAnalysis";

// const history = createBrowserHistory();

// const router = createBrowserRouter(
//   [
//     { path: "/", element: <Register /> },
//     { path: "/dashboard", element: <Dashboard /> },
//     { path: "/pollcompleted", element: <PollCompletion /> },
//     { path: "/quizcompleted", element: <QuizCompletion /> },
//     { path: "/quiz/:quizId", element: <Questions /> },
//     { path: "/item-not-found", element: <ItemNotFound /> },
//     { path: "/quizanalysis/:quizId", element: <QuizAnalysis /> },
//     { path: "*", element: <ItemNotFound /> }, // Catch-all route
//   ],
//   {
//     // If using a base path, uncomment and set it here:
//     // basename: "/your-base-path"
//   }
// );

// ReactDOM.createRoot(document.getElementById("root")).render(
//   <React.StrictMode>
//     <RouterProvider router={router} />
//     <Routes>{/* Your routes will be automatically rendered here */}</Routes>
//   </React.StrictMode>
// );
