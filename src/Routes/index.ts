import { Router } from 'express';
import { authRoute } from '../modules/User/auth.route';
import { AdminRegRoutes } from '../modules/Admin/admin.routes';


const router = Router();

const moduleRoutes = [
    {
        path: '/auth',
        route: authRoute,
    },
    {
        path: '/admin',
        route: AdminRegRoutes,
    },
    // {
    //     path: '/users',
    //     route: userRoute
    // },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;