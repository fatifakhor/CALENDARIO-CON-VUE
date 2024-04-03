<script setup lang="ts">
    import calendarioMes from './components/Calendario.vue';
    import { ref } from 'vue';
    
    const mes = ref<number>(3);
    const anio = ref<number>(2024);
    const dia = ref<boolean>(false);
    
    const meses = <string[]>[
        'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
    
    const cambiarMes = (incremento: number) => {
        mes.value += incremento;
        if (mes.value < 1) {
            mes.value = 12;
            anio.value--;
        } else if (mes.value > 12) {
            mes.value = 1;
            anio.value++;
        }
    };

    const cambiarAnio = (incremento: number) => {
        anio.value+=incremento
    }

</script>
 
<template>
    <div id="contenedor">
        <header>
            <h1>CALENDARY</h1>
        </header>
        <main>
            <div class="datos">   
                <div class="contain">
                    <div class="select">
                    <button class="flechaAnio" @click="cambiarAnio(-1)"> &lt;&lt; </button>
                        <button class="flecha" @click="cambiarMes(-1)">←</button> 
                        <select v-model="mes" class="option">
                            <option v-for="(month, index) in meses" :value="index + 1" :key="index">{{ month }}</option>
                        </select>
                    </div>
                    <div class="select">
                        <input class="option" type="number" v-model="anio" min="2000" max="2050"/>
                        <button class="flecha" @click="cambiarMes(1)">→</button>
                        <button class="flechaAnio" @click="cambiarAnio(1)"> &gt;&gt; </button>
                    </div>
                </div>
                
            </div>
            <calendarioMes :mes="mes" :anio="anio"/>
        </main>
        <footer>
            <p>2024 - Calendario de Fátima Zahra Fakhor Mafkhari🚀</p>
        </footer>
    </div>
  
</template>

<style>
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

header{
    background: #0575E6;  /* fallback for old browsers */
    background: -webkit-linear-gradient(to right, #021B79, #0575E6);  /* Chrome 10-25, Safari 5.1-6 */
    background: linear-gradient(to right, #021B79, #0575E6); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
}

#contenedor{
    background-color: #D4F3E0 ;
}

h1 {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    height: 65px;
    width: 100%;
    font-weight: bold;
    font-size: 2.5em;
    color: #f0f0f0; 
    text-align: center;
}

.datos {
    display: flex;
    flex-direction: column;
    align-items: center;
}
  
.contain {
    margin-top: 15px;
    display: flex;
    justify-content: center;
}
  
.select {
    margin-bottom: 10px;
    margin-right: 20px;
}
  
.option {
    padding: 10px;
    font-size: 16px;
    border: 1px solid #ccc;
    border-radius: 5px;
    background-color: #fff;
    width: 200px;
    color: #555; /* Color del texto */
}

.option:hover {
    border-color: #999;
}
  
.option:focus {
    outline: none;
    border-color: #007bff;
}

.flecha{
    padding: 10px;
    font-size: 16px;
    border: none;
    border-radius: 5px;
    background-color: #4CAF50;
    margin-left: 14px;
    margin-right: 14px;
    color: white;
    cursor: pointer;
    transition: background-color 0.3s;
}

.flecha:hover {
    background-color: #45a049;
}

.flechaAnio{
    padding: 10px;
    font-size: 16px;
    border: none;
    border-radius: 5px;
    background-color: #4CAF50;
    margin-left: 45px;
    margin-right: 45px;
    color: white;
    cursor: pointer;
    transition: background-color 0.3s;
}

footer {
    color: white;               
    padding: 10px 0;          
    position: fixed;        
    left: 0;
    bottom: 0;
    width: 100%;              
}

footer p{
    font-size: 25px;
    text-align: center;
    background-color: #45a049;
    height: 65px;
}

@media (max-width: 1360px) {
    footer{
        height: 60px;
    }
}

@media (max-width: 830px){
    .contain {
    flex-direction: row; 
    align-items: center; 
  }

  .select {
    margin-bottom: 5px; 
    display: flex; 
    align-items: center; 
  }

  .flecha, .flechaAnio {
    padding: 5px; 
    font-size: 14px; 
  }

  .option {
    padding: 5px; 
    font-size: 14px;
    width: calc(100% - 90px); 
  }
}
</style>
