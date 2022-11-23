import { Router } from 'express'

import path from 'path'
const __dirname = url.fileURLToPath(new URL(".", import.meta.url))
const rutaLogin = join(__dirname,"public/login.html")
const rutaBienvenido = join(__dirname,"public/bienvenido.html")
const rutaRegistro = join(__dirname,"public/registro.html")
const rutaError = join(__dirname,"public/error.html")



const authWebRouter = new Router()

authWebRouter.get('/', (req, res) => {
    res.redirect('/home')
})

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

authWebRouter.get('/login', (req, res) => {
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


authWebRouter.post('/login', (req, res) => {
    req.session.username = req.body.username
    res.redirect('/home')
})



export default authWebRouter