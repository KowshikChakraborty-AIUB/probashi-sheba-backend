import express, { Request, Response } from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import router from './Routes';
import globalErrorhandler from './Middlewares/globalErrorhandler';
import notFound from './Middlewares/notFoundRoute';
const app = express()

//parsers
app.use(express.json());
app.use(cookieParser());
app.use(cors());

app.use('/api', router);

app.get('/', (req: Request, res: Response) => {
  res.send('Probashi Sheba Backend')
})

app.use(globalErrorhandler)

//not found route
app.use(notFound)

export default app;