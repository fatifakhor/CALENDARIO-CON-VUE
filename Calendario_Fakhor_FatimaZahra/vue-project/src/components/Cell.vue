<script setup lang="ts">
import { ref, computed} from "vue";
import { modificaDato } from "../utils/crudAxios";

import Modal from "./Modal.vue";
import type { Tarea } from "../utils/interface";

interface Props {
  valor?: string; /**fecha */
  tareas?: Tarea[];
}

const props = defineProps<Props>();
const muestraModalCelda = ref<boolean>(false);
const tareaSeleccionada = ref<Tarea | null>(null);
const estaModificando = ref<boolean>(false);
const tareaModificando = ref<Tarea>();
const tabla = <string>("tarea");

const mostrarModal = (fecha: string | undefined, tarea: Tarea | null) => {
  tareaSeleccionada.value = tarea;
  muestraModalCelda.value = true;
  estaModificando.value = false;
};

/**getter computado que devuelve las tareas filtradas por su fecha en cada celda */
const tareasEnCelda = computed<Tarea[]>(() => {
    return props.tareas!.filter((tarea) => tarea.fecha === props.valor);
});

/**esto es para que al añadir la tarea aparezca sin actualizar,
 * esto envia un emit y lo mete en lista tareas sin tener que tirar del computed */
const anadirTareas = (nuevaTarea: Tarea) => {
  if (props.tareas) {
    props.tareas.push(nuevaTarea);
  }
};

/**envío a calendario */

const emit = defineEmits(['borrar-tarea', 'tarea-modificada']);

/**mando el id al borrar al componente padre */
const borrarTarea = (id: string) => {
  emit("borrar-tarea", id);
};

const modificar = (id: string, tarea: Tarea) => {
  mostrarModal(props.valor, tarea);
  estaModificando.value = true; /**es un props a modal para que sepa si mostrar "modificar" o "guardar" en el boton */
  tareaModificando.value = tarea;
};

const cerrar = () => {
  muestraModalCelda.value = false;
};

/**envío tarea modificada al padre calendario para que actualice */

const actualizarTarea = (tareaModificada: Tarea) => {
  emit("tarea-modificada", tareaModificada);
};

/**drag and drop */

const dragStart = (event: DragEvent, tarea: Tarea) => {
  event.dataTransfer!.setData("itemID", tarea.id);
};

/**una vez realizado drop se actualiza */
const onDrop = (event: DragEvent, fecha: string | undefined) => {
  const itemID = event!.dataTransfer!.getData("itemID");
  const item = props.tareas!.filter((el) => el.id === itemID)[0];
  item.fecha = fecha;

  modificaDato(tabla, itemID, item);
};


</script>

<template>
  <div class="contenedor">
    <div class="drop-zone" @dragover.prevent @drop="onDrop($event, props.valor)" >
      <div class="first-elements"> 
        <p>{{ props.valor }}</p>
        <button class="buttonMas" @click="mostrarModal(props.valor, null)">+</button>
      </div>
      <Modal
        v-if="muestraModalCelda"
        :fecha="props.valor"
        @tarea-agregada="anadirTareas"
        @cerrar-modal="cerrar"
        :esta-modificando="estaModificando"
        :tarea-modificando="tareaModificando"
        @tarea-modificada="actualizarTarea"
      />
      <div class="cell-container"> 
        <div class="tareas-container"> 
            <div class="tareas"
                v-for="item in tareasEnCelda"
                :key="item.id"
                :draggable="true"
                @dragstart="dragStart($event, item)" 
                >
           
                    <p>{{ item.tarea }}</p>
           
               
                    <button :draggable="false" class="buttonmodify" @click="modificar(item.id, item)">
                        <img src="../img/editar.png" />
                    </button>
                    <button class="buttondelete" @click="borrarTarea(item.id)">
                        <img src="../img/borrar.png" />
                    </button>
           
            </div>
        </div>
      </div>
    </div>
  </div>
</template>
  
<style scoped>
.first-elements {
  display: flex; 
  font-size: 20px;
}

.first-elements p {
  margin-right: 15px;
  font-weight: bold;
} 

.tareas {
  margin-bottom: 10px;
  border: 2px dotted #df6981;
  padding: 5px;
  border-radius: 25px;
  text-align: center;
  margin-top: 20px;
  background-color: rgb(204, 143, 73); 
  color: white;
  font-size: 20px;
}

.tareas p{
    margin-bottom: 10px;
}

button img {
  width: 20px;
  height: 20px;
}

.tareas:hover {
  box-shadow: 0 6px 12px rgba(223, 105, 129, 0.5);
}

button{
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.buttonMas{
  color: #fff;
  padding: 5px;
  background-color: #0468d3;
}

.buttonmodify{
    margin-right: 20px;
}

.drop-zone {
  padding: 35px;
  border-radius: 5px;
}

@media (max-width: 1050px){
    .first-elements{
        font-size: 10px;
    }
    .tareas{
        padding: 2px;
    }
    button img {
        width: 15px;
        height: 15px;
    }
    .tareas p{
        font-size: 20px;
    }
}

@media (max-width: 830px){
    .first-elements{
        font-size: 10px;
    }

    .first-elements p{
        font-size: 15px;
    }

    .tareas{
        border: none;
        border-radius: 0px;
    }

    .tareas p {
        font-size: 15px;
    }

    button img {
        width: 15px;
        height: 15px;
    }

    .buttonMas{
      padding: 2px;
    }

    .buttonmodify{
      margin-right: 10px;
    }

  
}
</style>
