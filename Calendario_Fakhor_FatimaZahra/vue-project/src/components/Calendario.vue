<script setup lang="ts">
import { computed, ref, onMounted } from "vue";
import Cell from "@/components/Cell.vue";
import { obtenerDatos as obtenerDatosApi, eliminaDato } from "../utils/crudAxios";

import type { Tarea } from "../utils/interface";

/**listaTareas es una lista de tareas recogida de interface */
const listaTareas = ref<Tarea[]>([]);
const tabla = "tarea";

interface Props {
  mes?: number;
  anio?: number;
  cols?: string[];
  COLS?: number;
  ROWS?: number;
}

const props = withDefaults(defineProps<Props>(), {
  cols: () => ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"],
  COLS: 7,
  ROWS: 6,
  anio: 2000,
  mes: 1,
});

/**al cargar obtenemos datos de api */

onMounted(async () => {
  const response = await obtenerDatosApi(tabla);
  if (response) {
    listaTareas.value = response;
  }
});

//Convertimos el número de orden del día en filas y columnas
const anadevalorSecuencial = (numero: number, valor: string, celdas: string[][]) => {
  const fila = Math.floor(numero / props.COLS);
  const columna = numero % props.COLS;
  celdas[fila][columna] = valor;
};

const tablaMes = computed(() => {
  const celdas = <string[][]>(
    Array.from(Array(props.COLS).keys()).map(() =>
      Array.from(Array(props.ROWS + 1).keys()).map(() => "-")
    )
  );
  const primerDia = new Date(`${props.anio}-${props.mes}-1`);
  const posicionPrimerDia = [6, 0, 1, 2, 3, 4, 5][primerDia.getDay()];
  const numDiasMes = new Date(props.anio, props.mes, 0).getDate();
  const rangoNumeros = [...Array(numDiasMes).keys()].map((i) => i + posicionPrimerDia);
  //Recorremos el rango de números para añadir la fecha
  rangoNumeros.map((el, ind) =>
    anadevalorSecuencial(el, `${ind + 1}/${props.mes}/${props.anio}`, celdas)
  );

  return celdas;
});


const borrarTarea = (id: string) => {
  eliminaDato(tabla, id);
  /**buscar la tarea en la lista de tareas para borrarla del calendario */
  const index = listaTareas.value.findIndex((tarea) => tarea.id === id);
  if (index !== -1) {
    listaTareas.value.splice(index, 1);
  }
};

/**actualizamos la lista de tareas para que se muestre */
const actualizar = (tareaModificada: Tarea) => {
  const tareaIndex = listaTareas.value.findIndex((t) => t.id === tareaModificada.id);
  if (tareaIndex !== -1) {
    listaTareas.value[tareaIndex] = tareaModificada;
  }
};

/**para marcar el día de hoy */
const obtenerDiaHoy = () => {
  const hoy = new Date();
  const dia = hoy.getDate();
  const mes = hoy.getMonth() + 1;
  const anio = hoy.getFullYear();
  return `${dia}/${mes}/${anio}`;
};

const diaHoy = obtenerDiaHoy();

</script>

<template>
  <table class="calendar-table">
    <thead>
      <tr>
        <th v-for="c in cols" :key="c">{{ c }}</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="i in props.ROWS" :key="i">
        <td v-for="(c, j) in cols" :key="c" class="calendar-cell" :class="{ 'today': tablaMes[i - 1][j]  === diaHoy }"> 
          <Cell
            v-if="tablaMes[i - 1][j] !== '-'"
            :valor="tablaMes[i - 1][j]"
            :tareas="listaTareas"
            @borrar-tarea="borrarTarea"
            @tarea-modificada="actualizar"
          />
        </td>
      </tr>
    </tbody>
  </table>
</template>

<style scoped>
table {
  margin-bottom: 15px;
  
}
.calendar-table {
  border-collapse: collapse;
  display: block;
  width: 100%;
  margin: 0 auto;
}

/**esto es el tamaño de la celda, que le ponemos un 20%, las primeras ocupan eso y las ultimas de findesemana se quedan sin espacio y se ponen peques */
.calendar-table th {
  background-color: #4caf50;
  color: #fff;
  text-align: center;
  width: 20%;
  height: 50px;
  font-size: 20px;
}

.calendar-cell {
  width: 100px;
  height: 130px;
  border: 1px solid #ccc;
}

.calendar-cell:hover {
  background-color: #f0f0f0;
}

td {
  background-color: #e0e0e0;
}

.today{
     background-color: #df6981; 
}

@media (max-width: 1360px){
  .calendar-table th {
    width: calc(100% / 7); 
    max-width: calc(100% / 7); 
    font-size: 16px; 
  }

  .calendar-cell {
    width: calc(100% / 7); 
    max-width: calc(100% / 7); 
    height: 80px; 
    font-size: 14px; 
  }

}

@media (max-width: 1287px){
  .calendar-table th{
      width: 250px;
      max-width:150px;
    }

    .calendar-cell{
      width: 250px; 
      max-width: 150px;
    }
}

@media(max-width: 1050px){
  .calendar-table th{
      max-width:25%;
    }

    .calendar-cell{
      max-width: 25%;
    } 
}

@media (max-width: 830px){
  .calendar-table th{
      max-width:115px;
    }

    .calendar-cell{
      max-width: 117px;
    } 
}
</style>