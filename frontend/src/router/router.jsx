import { createBrowserRouter } from "react-router-dom"
import SignUp from "../pages/SignUp"
import SignIn from "../pages/SignIn"
import Board from "../pages/Board"
export const router = createBrowserRouter([
    {
        path: "/signup",
        element: <SignUp />,
    },
    {
        path: "/signin",
        element: <SignIn />,
    },
    {
        path: "/",
        element: <Board />,
    },
])
