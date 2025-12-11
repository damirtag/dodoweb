import { createBrowserRouter, RouterProvider } from "react-router-dom";
import HomePage from "@/pages/home";

const router = createBrowserRouter([
    {
        path: "/",
        element: <HomePage />,
    },
    //   {
    //     path: "/pizzeria/:unitId/:pizzeriaId",
    //     element: <PizzeriaPage />,
    //   },
]);

export const AppRouter = () => {
    return <RouterProvider router={router} />;
};
