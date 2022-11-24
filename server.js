import express from "express";
import session from "express-session";
import bodyParser from "body-parser";
import MongoStore from "connect-mongo";
import { Server as HttpServer } from 'http'
import authWebRouter from './routers/web/auth.js'
import homeWebRouter from './routers/web/home.js'
const app = express();
const httpServer = new HttpServer(app)

const mongoOptions = { useNewUrlParser: true, useUnifiedTopology: true };

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('public'))


app.use(session({
    secret:'12354asd223bbthhhasd',
    resave: 'false',
    saveUninitialized: false,
    cookie: {
        maxAge: 10 * 1000 * 60,
    },
    store:MongoStore.create({
        mongoUrl:'mongodb+srv://sebasindahouse:Mosi0310@cluster0.epscnqt.mongodb.net/sesiones',
        mongoOptions
    })
}))

app.use(authWebRouter)
app.use(homeWebRouter)

const connectedServer = httpServer.listen(8080, () => {
    console.log(`Servidor http escuchando en el puerto ${connectedServer.address().port}`)
})
connectedServer.on('error', error => console.log(`Error en servidor ${error}`))















// signup

// //registro


// const hasPassword = (pass) => {
// // ocultar
// return bcrypt.hashSync(pass, bcrypt.genSaltSync(10), null);
// };
// const validatePass = (pass, hashedPass) => {
// // validar
// return bcrypt.compareSync(pass, hashedPass);
// };

// const auth= (req,res,next)=>{
//     req.session.isAdmin == true?next():res.status(401).send('sin permisos')
// }



