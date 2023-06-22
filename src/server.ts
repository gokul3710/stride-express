import express from "express";
import logger from 'morgan'
import cors from 'cors'
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';


//routes
import userRoutes from './routes/user'
import adminRoutes from './routes/admin'
import productRoutes from './routes/products'


//mongodb
import {db} from './config/mongodb'
import { domains } from "./constants/domains";
import { environments } from "./constants/environments";
import { cacheImage } from "./middlewares/image";


//app and port
const app = express();
const port = environments.PORT;


//middlewars
app.use(logger('dev'));
app.use(express.json({limit: '10mb'}));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());


//bodyparser
app.use(bodyParser.json({limit: '10mb'}));
app.use(bodyParser.urlencoded({limit: '10mb', extended: true}));


//cors
app.use(cors({
  origin: [domains.DOMAIN, domains.DOMAIN_2,domains.DOMAIN_LOCALHOST, domains.ADMIN_DOMAIN, domains.ADMIN_DOMAIN_2,domains.ADMIN_DOMAIN_LOCALHOST]
}));


//cache control
app.use((req,res,next)=>{
  res.header('Cache-Control','no-cache,private,no-Store,must-revalidate,max-scale=0,post-check=0,pre-check=0');
  next();
})

app.get('/image/:filename', cacheImage)

//mongodb connect
db.connect((err: Error)=>{
    if(err) console.log("Connection Error");
    else console.log("Database Connected Successfully");
})


//route paths
app.use("", userRoutes);
app.use("", adminRoutes);
app.use("", productRoutes);


//app listen
app.listen(port, () => {
  console.log(`Server listening on port ${port}.`);
});
