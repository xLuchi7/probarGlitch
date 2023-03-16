import express from 'express'
import { engine } from 'express-handlebars'
import { Server as SocketIOServer } from 'socket.io'
import { FileManager } from './FileManager.js'

const mensajesManager = new FileManager('./localStorage/mensajes.json')

const app = express()

app.engine('handlebars', engine())
app.set('views', './views')
app.set('view engine', 'handlebars')

app.use(express.static('./public'))

const httpServer = app.listen(8080)
//devuleve un server http el app.listen

const io = new SocketIOServer(httpServer)

io.on('connection', async clientSocket => { //metodo para recivir cosas
    console.log("nuevo cliente conectado ", clientSocket.id)
    //clientSocket.emit('mensajito', { hola: "mundo" }) //metodo para mandar cosas
    //clientSocket.emit('alerta', "hola llegue")

    //manejador de nuevos mensajes
    clientSocket.on("nuevoMensaje", async mensaje => {
        console.log("id: ", clientSocket.id)
        console.log(mensaje)
        await mensajesManager.guardarCosa({
            fecha: new Date().toLocaleString(),
            ...mensaje
        })
        io.sockets.emit("actualizarMensajes", await mensajesManager.buscarCosas())
    })

    clientSocket.on('nuevoUsuario', async nombreUsuario => {
        clientSocket.broadcast.emit('nuevoUsuario', nombreUsuario)
    })

    io.sockets.emit('actualizarMensajes', await mensajesManager.buscarCosas())
}) //es un manejador de eventos, en "connection" va el evento q queres usar(click por ejemplo)

app.get('/', async (req,res) => {
    const mensajes = await mensajesManager.buscarCosas()
    res.render('mensajes', { 
        pageTitle: 'Chat',
        hayMensaje: mensajes.length > 0,
        mensajes
    })
})


