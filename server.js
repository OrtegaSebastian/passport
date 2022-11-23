import express from "express";
import session from "express-session";
import bodyParser from "body-parser";
import MongoStore from "connect-mongo";
import { Server as HttpServer } from 'http'
// import DAOUsuarios from "./daos/UsuariosDAO.js";
// import url from 'url'
// import { join } from "path";
// import { Strategy } from "passport-local";
// import bcrypt from "bcrypt";
// import passport from "passport";
import authWebRouter from './routers/web/auth.js'
import homeWebRouter from './routers/web/home.js'
const app = express();
const httpServer = new HttpServer(app)
// const MongoUsers = new DAOUsuarios();



const mongoOptions = { useNewUrlParser: true, useUnifiedTopology: true };

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('public'))
// const __dirname = url.fileURLToPath(new URL(".", import.meta.url))
// const rutaLogin = join(__dirname,"public/login.html")
// const rutaBienvenido = join(__dirname,"public/bienvenido.html")
// const rutaRegistro = join(__dirname,"public/registro.html")
// const rutaError = join(__dirname,"public/error.html")

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
// passport.use(
//     "registro",
// new localStrategy(
//     {
//     passReqToCallback: true,
//     },
//     (req, username, password, done) => {
//     const { email } = req.body;
//     const user = usuarios.find((u) => u.username == username);

//     if (user) return done("Usuario registrado");

//     usuarios.push({ username, password, email });
//     const userObj = { username, password, email };
//     return done(null, userObj);
//     }
// )
// );


// passport.use(
//     "login",
// new localStrategy(
//     { passReqToCallback: true },
//     (req, username, password, done) => {
//     const user = usuarios.find(
//         (user) => user.username == username && user.password == password
//     );
//     if (!user) return done("usuario no existe");
//     return done(null, user);
//     }
// )
// );
// passport.serializeUser((user, done) => {
// done(null, user.username);
// });

// passport.deserializeUser((username, done) => {
// const user = usuarios.find((user) => user.username == username);

// done(null, user);
// });

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

// app.get('/',(req,res)=>{   
//     if (req.query.username) req.session.usuario = req.query.username;
//     if (req.session.usuario) {
//     res.sendFile(rutaBienvenido)
//     res.send(
//         `Hola ${req.session.usuario} `
//     );
//     }else {
//         res.sendFile(rutaLogin);
//     }
//     }
// )
// app.get('/registro',(req,res)=>{      
// if (req.session.usuario) {
// res.sendFile(rutaBienvenido);
// } else {
// if (req.query.error) {
//     res.sendFile(rutaError);
// } else {
//     res.sendFile(rutaLogin);
// }
// }}
// )

// app.post('/',async(req,res)=>{
//     try {
//         const { username, password } = req.body;
//         const usuario = await MongoUsers.listar(username, password);
//         console.log(usuario);
//         req.session.usuario = username;
//         res.redirect("/");
//     } catch (e) {
//         res.redirect("/?error=true");
//     }
// })

// app.post('/registro', async(req,res)=>{    
//     const { username, password } = req.body;
//     const result = await MongoUsers.guardar({ username, password });
//     req.session.usuario = username;
//     res.redirect("/");
//     res.send(`'usuario registrado' ${result}`)
// })

// app.get('/logout',(req,res)=>{
//     req.session.destroy((err) => {
//         res.redirect("/");
//     });
// })



// app.listen(8082, () => console.log("conectados"));






