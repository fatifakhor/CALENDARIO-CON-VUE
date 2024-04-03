<script setup lang="ts">
import {ref, onMounted } from 'vue'
import {guardarDatos as guardarDatosApi, modificaDato} from '../utils/crudAxios'
import { generateUUID } from '../utils/generaId';
import type {Tarea} from '../utils/interface'

const horaInicial = ref<string>('')
const horaFinal = ref<string>('')
const tarea = ref<string>('')
const lista = ref<Array<Tarea>>([]);
const tabla = "tarea"


interface Props{
    fecha?: string;
    estaModificando:boolean;
    tareaModificando?:Tarea | null;
}

const props = defineProps<Props>()
const emit = defineEmits(['cerrar-modal', 'tarea-modificada', 'tarea-agregada'])


const cerrar = () => {
    emit('cerrar-modal')
}

/**se diferencia entre si estamos en el estado modificando o no, si es así se modifica y si no se guardan los datos, hacemos emit a padre */

const guardarDatos = () => {
  if (props.estaModificando && props.tareaModificando) {
      const tareaModificada: Tarea = {
        id: props.tareaModificando.id,
        tarea: tarea.value,
        fecha: props.fecha,
        horaInicial: horaInicial.value,
        horaFinal: horaFinal.value
      }

      modificaDato(tabla, props.tareaModificando.id , tareaModificada)
      cerrar()
      emit('tarea-modificada', tareaModificada)
  }

  else if(tarea.value!="" && horaInicial.value!="" && horaFinal.value!=""){
    const nuevaTarea: Tarea = {
        id: generateUUID(),
        tarea: tarea.value, 
        fecha: props.fecha,
        horaInicial: horaInicial.value,
        horaFinal: horaFinal.value
    };

    lista.value.push(nuevaTarea); 

    guardarDatosApi(tabla, nuevaTarea);
    cerrar()
    emit('tarea-agregada', nuevaTarea)
    
    limpiar()

  }else{
    alert("rellene correctamente los datos")
  }
 
}

const limpiar = () => {
    tarea.value=""
    horaFinal.value=""
    horaInicial.value=""
}

/**para que al darle a modificar salgan los datos en el modal de lo que hay en celda. */

onMounted(() => {
 
  if (props.estaModificando && props.tareaModificando) {
    tarea.value = props.tareaModificando?.tarea || ''
    horaInicial.value = props.tareaModificando?.horaInicial || ''
    horaFinal.value = props.tareaModificando?.horaFinal || ''
  }
})

</script>

<template>
    <div class="modal-overlay">
        <div class="modal">
            <div class="modal-header">
                <h2>{{ props.fecha }}</h2>
                <span class="modal-close" @click="cerrar">×</span>
            </div>
            <div class="modal-body">
                <br>
                <input type="time" v-model="horaInicial" placeholder="Hora Inicial">
                <input type="time" v-model="horaFinal" placeholder="Hora Final">
                <input type="text" v-model="tarea" placeholder="Ingrese la tarea">
            </div>
            <div class="modal-footer">
                <button class="modal-button" @click="guardarDatos">{{props.estaModificando ? 'Modificar': 'Guardar'}}</button>
            </div>
        </div>
    </div>
</template>


<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}
  
.modal {
  background-color: #fff;
  width: 400px;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
}
  
.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}
  
.modal-close {
  cursor: pointer;
  color: red;
  font-weight: bold;
}
  
.modal-body input {
  width: 100%;
  padding: 8px;
  margin-bottom: 10px;
  box-sizing: border-box;
}
  
.modal-footer {
  text-align: right;
}

.modal-body p{
  font-weight: bold;
}

h2{
  font-weight: bold;
}

.modal-button {
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  background-color: #007bff;
  color: #fff;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.modal-button:hover {
  background-color: #0056b3;
}

.modal-button:focus {
  outline: none;
}
</style> 