import axios from 'axios';
import type {Tarea} from '@/utils/interface'

export const BASEURL = 'http://localhost:3000'

export const guardarDatos = async (tabla: string, dato: Tarea) => {
  try {
    await axios.post(`${BASEURL}/${tabla}`, dato)
  } catch (e) {
    console.log(e)
  }
}
export const modificaDato = async (tabla: string, id: string, dato: Tarea) => {
  try {
    await axios.put(`${BASEURL}/${tabla}/${id}`, dato)
  } catch (e) {
    console.log(e)
  }
}

export const obtenerUnDatos = async (
  tabla: string,
  campo: string,
  valor: string | number
): Promise<Tarea | undefined> => {
  try {
    const response = await axios.get(`${BASEURL}/${tabla}?${campo}=${valor}`)
    return response.data
  } catch (error) {
    console.log(error)
  }
}
export const obtenerDatos = async (tabla: string) => {
  try {
    //Esta línea hay que quitarla cuando comprobemos que se muestra el texto de cargando
    const response = await axios.get(`${BASEURL}/${tabla}`)
    return response.data
  } catch (error) {
    console.log(error)
  }
}
export const eliminaDato = async (tabla: string, id: string) => {
  try {
    await axios.delete(`${BASEURL}/${tabla}/${id}`)
  } catch (e) {
    console.log(e)
  }
}


//Creamos una promesa para retardar la carga y ver el efecto del cargando
const sleep = ( segundos: number ):Promise<boolean> => {
  return new Promise( (resolve) => {
    setTimeout(() => {
     console.log("cargando...");
      resolve(true);
    }, segundos * 1000 );
  });
}