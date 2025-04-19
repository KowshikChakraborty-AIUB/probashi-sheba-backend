import { Router } from 'express';
import { AdminRegRoutes } from '../modules/Admin/admin.routes';
import { UserRoutes } from '../modules/User/user.route';
import { BMETRegistrationRoutes } from '../modules/BMETRegistration/BMETRegistration.route';
import { nearestPassportOfficeRoutes } from '../modules/NearestPassportOffice/nearestPassportOffice.route';
import { WebSettingsRoutes } from '../modules/WebSettings/webSettings.route';
import { ForMigrantWorkerRoutes } from '../modules/ForMigrantWorker/ForMigrantWorker.route';
import { TestimonialRoutes } from '../modules/Testimonial/testimonial.route';
import { WhoWeAreRoutes } from '../modules/WhoWeAre/whoWeAre.route';
import { ChecklistRoutes } from '../modules/Checklist/checklist.route';
import { MyDocumentRoutes } from '../modules/MyDocument/myDocument.route';
import { BannerRoutes } from '../modules/Banner/banner.route';
import { KeyImpactsRoutes } from '../modules/KeyImpacts/keyImpacts.route';
import { FaqRoutes } from '../modules/Faq/faq.route';


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
    {
        path: '/nearestPassport',
        route: nearestPassportOfficeRoutes,
    },
    {
        path: '/web-settings',
        route: WebSettingsRoutes,
    },
    {
        path: '/for-migrant-worker',
        route: ForMigrantWorkerRoutes,
    },
    {
        path: '/testimonial',
        route: TestimonialRoutes,
    },
    {
        path: '/who-we-are',
        route: WhoWeAreRoutes,
    },
    {
        path: '/checklist',
        route: ChecklistRoutes,
    },
    {
        path: '/my-document',
        route: MyDocumentRoutes,
    },
    {
        path: '/banner',
        route: BannerRoutes,
    },
    {
        path: '/key-impacts',
        route: KeyImpactsRoutes,
    },
    {
        path: '/faq',
        route: FaqRoutes,
    },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;