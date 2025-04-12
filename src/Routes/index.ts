import { Router } from 'express';
import { AdminRegRoutes } from '../modules/Admin/admin.routes';
import { UserRoutes } from '../modules/User/user.route';
import { BMETRegistrationRoutes } from '../modules/BMETRegistration/BMETRegistration.route';


const router = Router();

const moduleRoutes = [
    {
        path: '/auth',
        route: UserRoutes,
    },
    {
        path: '/admin',
        route: AdminRegRoutes,
    },
    {
        path: '/bmet',
        route: BMETRegistrationRoutes,
    },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;