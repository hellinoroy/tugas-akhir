import {
    type RouteConfig, 
    index,
    layout,
    route
} from "@react-router/dev/routes";

export default [
    index("./pages/home.tsx"),
    
    // Bisa punya layout background
    route("login", "./pages/login.tsx"),
    route("register", "./pages/register.tsx"),
    route("forgot-password", "./pages/forgot-password.tsx"),
    route("reset-password", "./pages/reset-password.tsx"),

    route('dashboard', './pages/dashboard/boilerplate/root.tsx', {id: "dashboard-root"}, [
        index('./pages/dashboard/home.tsx'),
        route('tracker', './pages/dashboard/tracker.tsx'),
        route('predict', './pages/dashboard/predict.tsx'),
        route('history', './pages/dashboard/history.tsx'),
        route('edit-profile', './pages/dashboard/edit-profile.tsx')
    ]),


    // catchall
    // route("*", "./pages/home.tsx")
] satisfies RouteConfig;
