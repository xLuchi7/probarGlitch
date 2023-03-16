const serverSocket = io('http://localhost:8080/')

Swal.fire({
    title: "Identificate",
    input: "text",
    inputValidator: (value) => {
        return !value && "Necesitas escribir un nombre de usuario para comenzar a chatear"
    },
    allowOutsideClick: false
}).then(result => {
    const inputAutor = document.querySelector('#inputAutor')
    //if(!(inputAutor instanceof HTMLInputElement))
    inputAutor.value = result.value
    serverSocket.emit('nuevoUsuario', inputAutor.value)
})

const btnEnviar = document.querySelector('#btnEnviar')

if (btnEnviar) {
    btnEnviar.addEventListener(
        'click', 
        evento => {
            const inputAutor = document.querySelector('#inputAutor')
            const inputMensaje = document.querySelector('#inputMensaje')

            if (inputAutor && inputMensaje) {
                const autor = inputAutor.value
                const mensaje = inputMensaje.value

                serverSocket.emit('nuevoMensaje', { autor, mensaje})
            }
        }
    )
}

const plantillaMensajes = `
{{#if hayMensajes }}
<ul>
    {{#each mensajes}}
    <li>({{this.fecha}}) {{this.autor}}: {{this.mensaje}}</li>
    {{/each}}
</ul>   
{{else}}
<p>no hay mensajes...</p>
{{/if}}
`
const armarHtmlMensajes = Handlebars.compile(plantillaMensajes)

serverSocket.on("actualizarMensajes", mensajes => {
   const divMensajes =  document.querySelector("#mensajes")
   if (divMensajes) {
        divMensajes.innerHTML = armarHtmlMensajes({ mensajes, hayMensajes: mensajes.length > 0})
   }
})

serverSocket.on('nuevoUsuario', nombreUsuario => {
    Swal.fire({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        title: `${nombreUsuario} se unio al chat`,
        icon: 'success'
    })
})

//ESTO ERA PARA EL EJ ANTERIOR
// serverSocket.on("mensajito", datosAdjuntos => {// el .on recibe datos
//     console.log(datosAdjuntos) //muestra el hola mundo q mandamos con el emit
// })

// serverSocket.on("alerta", datosAdjuntos => {// el .on recibe datos
//     alert(datosAdjuntos) //muestra la alerta q mandamos con el emit
// })

