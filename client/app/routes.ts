import {
    type RouteConfig, 
    index,
    route
} from "@react-router/dev/routes";

export default [
    index("./pages/home.tsx"),
    
    // Bisa punya layout background
    route("login", "./pages/login.tsx"),
    route("register", "./pages/register.tsx"),
    route("forgot-password", "./pages/forgot-password.tsx"),

    

    // catchall
    // route("*", "./pages/home.tsx")
] satisfies RouteConfig;
