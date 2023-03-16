const carrito = { id: 1, cantidad: 0}

const carritos = [
    carrito
]

//me dicen sumar 1 al carrito de id 1
//primero lo busco
//cuando lo tengo, lo modifico
//actualizo la persistencia con el nuevo carrito modificado

const indiceCarritoBuscado = carritos.findIndex(c => c.id === 1)

const carritoBuscado = carritos[indiceCarritoBuscado]

carritoBuscado.cantidad = carritoBuscado.cantidad + 1

carritos[indiceCarritoBuscado = carritoBuscado]