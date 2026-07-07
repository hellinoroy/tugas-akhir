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

    route('dashboard', './pages/dashboard/boilerplate/root.tsx', [
        index('./pages/dashboard/dashboard-home.tsx')
    ])

    // catchall
    // route("*", "./pages/home.tsx")
] satisfies RouteConfig;
