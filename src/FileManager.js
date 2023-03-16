import crypto from 'crypto';
import fs from 'fs/promises';

//codigo para encriptar contrasenias
const saltGenerar = crypto.randomBytes(128).toString('base64');

const salt = 'uV1/rLjSvJDJAdPHb+KT+qGC9vZMovLfXjIdoh8EHmVundiEToSuL4em2Ztv22sshh/AxxQZsUaeZzq6xEqVBKiCzKw82x8v4wUROCZAOzx1fBYRO2CGlSrKo8f1cQ9w937n4NrEvn28PsnxR5B22nmbqjcqVVbmleXdrxBgJ9k='

//console.log(salt)

function encriptar(sinEncriptar) {
    const encriptado = crypto.createHmac('sha256', salt).update(sinEncriptar).digest('hex');

    return encriptado;
}

export class FileManager {
    #cosas //esto es para q no aparezcan dsps y no se puedan modificar
    #ruta
    
    constructor(ruta){
        this.#ruta = ruta;
        this.#cosas = [];
    }

    async #leer(){
        const json = await fs.readFile(this.#ruta, 'utf-8');
        this.#cosas = JSON.parse(json);
    }

    async #escribir(){
        const nuevoJson = JSON.stringify(this.#cosas, null, 2)
        await fs.writeFile(this.#ruta, nuevoJson);
    }

    async guardarCosa(cosa) {
        await this.#leer();
        this.#cosas.push(cosa)
        await this.#escribir();
        return cosa;
    }

    async buscarCosas() {
        await this.#leer();
        return this.#cosas;
    }

    async buscarCosaSegunId(id) {
        await this.#leer();
        const buscada = this.#cosas.find(c => c.id === id)
        if(!buscada){
            throw new Error("id no encontrado")
        }
        return buscada;
    }

    async reemplazarCosa(id, nuevaCosa) {
        await this.#leer();
        const indiceBuscado = this.#cosas.findIndex(c => c.id == id)
        if(indiceBuscado == -1){
            throw new Error("id no encontrado")
        }
        this.#cosas[indiceBuscado] = nuevaCosa;
        await this.#escribir();
        return nuevaCosa;
    }

    async borrarCosaSegunId(id) {
        await this.#leer();
        const indiceBuscado = this.#cosas.findIndex(c => c.id == id)
        if(indiceBuscado == -1){
            throw new Error("id no encontrado")
        }
        const [ borrado ] = this.#cosas.splice(indiceBuscado, 1);
        await this.#escribir();
        return borrado;
    }
    
}

// const um = new UserManager('./usuarios.json');
// const user = await um.crearUsuario({
//     nombre: 'luciano',
//     apellido: 'sessarego',
//     usuario: 'xLuchi7',
//     contrasenia: 'hola2007'
// })

// console.log(user);

// const loggedUser = await um.loguear({
//     usuario: 'luciano',
//     contrasenia: 'hola2007'
// })

// console.log("exitoso: ", loggedUser);