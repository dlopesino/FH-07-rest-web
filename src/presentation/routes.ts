import { Router } from 'express';
import { TodoRoutes } from './todos/routes';


export class AppRoutes {

    static get routes(): Router {

        const router = Router();

        // Sólo mandamos la referencia de la función
        router.use('/api/todos', TodoRoutes.routes);

        return router;

    }

}