import express from "express";
import session from "express-session";
import bodyParser from "body-parser";
import MongoStore from "connect-mongo";
import DAOUsuarios from "./daos/UsuariosDAO.js";
import url from 'url'
import { join } from "path";
import { Strategy } from "passport-local";
import bcrypt from "bcrypt";
import passport from "passport";

const MongoUsers = new DAOUsuarios();


const hasPassword = (pass) => {
// ocultar
return bcrypt.hashSync(pass, bcrypt.genSaltSync(10), null);
};
const validatePass = (pass, hashedPass) => {
// validar
return bcrypt.compareSync(pass, hashedPass);
};


const app = express();

const mongoOptions = { useNewUrlParser: true, useUnifiedTopology: true };

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('public'))
const __dirname = url.fileURLToPath(new URL(".", import.meta.url))
const rutaLogin = join(__dirname,"public/login.html")
const rutaBienvenido = join(__dirname,"public/bienvenido.html")
const rutaRegistro = join(__dirname,"public/registro.html")
const rutaError = join(__dirname,"public/error.html")


// app.use(session({
//     secret:'12354asd223bbthhhasd',
//     resave: 'false',
//     saveUninitialized: false,
//     cookie: {
//         maxAge: 10 * 1000 * 60,
//     },
//     store:MongoStore.create({
//         mongoUrl:'mongodb+srv://sebasindahouse:Mosi0310@cluster0.epscnqt.mongodb.net/sesiones',
//         mongoOptions
//     })
// }))

// signup


passport.use("login",new LocalStrategy(
    async (username, password, done) => {
    await Users.findOne({unsername: username}), async(err,user)=>{
    if(err){
    console.log(`error al loguear ${username}`) 
    return done(err)
    }
    if(!user){
    console.log(`usuario no encontrado ${username}`)
    return done(null,false)
    }
    else{
    if(checkPassword(user.password, password)){
    console.log(`logged in ${username}`)
    }}
}}))

passport.serializeUser((username, done) => {
done(null, username._id);
});

passport.deserializeUser((username, done) => {
Users.findById(username, done);
});


const auth= (req,res,next)=>{
    req.session.isAdmin == true?next():res.status(401).send('sin permisos')
}

app.get('/',(req,res)=>{   
    if (req.query.username) req.session.usuario = req.query.username;
    if (req.session.usuario) {
    res.sendFile(rutaBienvenido)
    res.send(
        `Hola ${req.session.usuario} `
    );
    }else {
        res.sendFile(rutaLogin);
    }
    }
)
app.get('/registro',(req,res)=>{      
if (req.session.usuario) {
res.sendFile(rutaBienvenido);
} else {
if (req.query.error) {
    res.sendFile(rutaError);
} else {
    res.sendFile(rutaLogin);
}
}}
)

app.post('/',async(req,res)=>{
    try {
        const { username, password } = req.body;
        const usuario = await MongoUsers.listar(username, password);
        console.log(usuario);
        req.session.usuario = username;
        res.redirect("/");
    } catch (e) {
        res.redirect("/?error=true");
    }
})

app.post('/registro', async(req,res)=>{    
    const { username, password } = req.body;
    const result = await MongoUsers.guardar({ username, password });
    req.session.usuario = username;
    res.redirect("/");
    res.send(`'usuario registrado' ${result}`)
})

app.get('/logout',(req,res)=>{
    req.session.destroy((err) => {
        res.redirect("/");
    });
})



app.listen(8082, () => console.log("conectados"));






