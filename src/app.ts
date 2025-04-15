import express, { Request, Response } from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import router from './routes';
import globalErrorhandler from './middlewares/globalErrorhandler';
import notFound from './middlewares/notFoundRoute';
const app = express()

//parsers
app.use(express.json());
app.use(cookieParser());
app.use(cors());
//file retrieve
app.use(express.static('uploads'));

app.use('/api/v1', router);

app.get('/', (req: Request, res: Response) => {
  res.send('Probashi Sheba Backend')
})

app.use(globalErrorhandler)

//not found route
// app.use(notFound)

export default app;