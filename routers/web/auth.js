import { Router } from 'express'
import DAOUsuarios from "../../daos/UsuariosDAO.js";
import url from 'url'
import { join } from "path";
import { Strategy } from "passport-local";
import bcrypt from "bcrypt";
import passport from "passport";
import path from 'path'

const MongoUsers = new DAOUsuarios();
const __dirname = url.fileURLToPath(new URL(".", import.meta.url))
const rutaLogin = join(__dirname,"../../public/login.html")
const rutaBienvenido = join(__dirname,"../../public/bienvenido.html")
const rutaRegistro = join(__dirname,"../../public/registro.html")
const rutaError = join(__dirname,"../../public/error.html")

const authWebRouter = new Router()


//passport
passport.use(
    "registro",
new Strategy(
    {
    passReqToCallback: true,
    },
    (req, username, password, done) => {
    const { email } = req.body;
    const user = usuarios.find((u) => u.username == username);

    if (user) return done("Usuario registrado");

    usuarios.push({ username, password, email });
    const userObj = { username, password, email };
    return done(null, userObj);
    }
)
);


passport.use(
    "login",
new Strategy(
    { passReqToCallback: true },
    (req, username, password, done) => {
    const user = usuarios.find(
        (user) => user.username == username && user.password == password
    );
    if (!user) return done("usuario no existe");
    return done(null, user);
    }
)
);
passport.serializeUser((user, done) => {
done(null, user.username);
});

passport.deserializeUser((username, done) => {
const user = usuarios.find((user) => user.username == username);

done(null, user);
});

const hasPassword = (pass) => {
// ocultar
return bcrypt.hashSync(pass, bcrypt.genSaltSync(10), null);
};
const validatePass = (pass, hashedPass) => {
// validar
return bcrypt.compareSync(pass, hashedPass);
};



//routers
authWebRouter.get('/', (req, res) => {   
    if (req.query.username) req.session.usuario = req.query.username;
    if (req.session.usuario) {
    res.sendFile(rutaBienvenido)
    res.send(
        `Hola ${req.session.usuario} `
    );
    }else {
        res.sendFile(rutaLogin);
}})


authWebRouter.get('/registro',(req,res)=>{      
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

authWebRouter.post('/registro', async(req,res)=>{    
    const { username, password } = req.body;
    const result = await MongoUsers.guardar({ username, password });
    req.session.usuario = username;
    res.redirect("/");
    res.send(`'usuario registrado' ${result}`)
})

authWebRouter.post('/',async(req,res)=>{
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


authWebRouter.get('/login',hasPassword, (req, res) => {
    const username = req.session?.username
    if (username) {
        res.redirect('/')
    } else {
        res.sendFile(path.join(process.cwd(), '/public/login.html'))
    }
})



authWebRouter.get('/logout', (req, res) => {
    const username = req.session?.username
    if (username) {
        req.session.destroy(err => {
            if (!err) {
                res.render(path.join(process.cwd(), '/public/logout.html'), { username })
            } else {
                res.redirect('/')
            }
        })
    } else {
        res.redirect('/')
    }
})


authWebRouter.post('/login', validatePass, (req, res) => {
    req.session.username = req.body.username
    res.redirect('/home')
})



export default authWebRouter