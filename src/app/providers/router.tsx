import { createBrowserRouter, RouterProvider } from "react-router-dom";
import HomePage from "@/pages/home";
import PizzeriaPage from "@/pages/pizzeria";

const router = createBrowserRouter([
    {
        path: "/",
        element: <HomePage />,
    },
    {
        path: "/pizzeria/:countryCode/:unitId/:pizzeriaId",
        element: <PizzeriaPage />,
    },
]);

export const AppRouter = () => {
    return <RouterProvider router={router} />;
};
