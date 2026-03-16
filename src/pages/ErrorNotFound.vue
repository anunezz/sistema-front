<template>
  <div class="fullscreen text-white text-center" style="background-color: #186156">
    <div style="margin-top: 5% !important;">
      <q-btn
        color="white"
        text-color="blue"
        unelevated
        to="/"
        label="Regresar"
        no-caps
        icon-right="home"
      />

      <div style="font-size: 15vh">
        <q-img
          :src="obtenerNumeroSinRepetir()"
          alt="404"
          style="width: 60%;margin-top: 50px;max-width: 600px">
          <template v-slot:loading>
            <div class="text-subtitle1 text-white">
              <q-spinner-ios />
              <div class="q-mt-md"> Cargando...</div>
            </div>
          </template>
        </q-img>
      </div>

      <div style="opacity:.4; font-size: 5vh">
        Vaya. Aquí no hay nada...
      </div>


    </div>
  </div>
</template>

<script setup>

import Image1 from 'src/assets/img/404/1.svg';
import Image2 from 'src/assets/img/404/2.svg';
import Image3 from 'src/assets/img/404/3.svg';
import Image4 from 'src/assets/img/404/4.svg';
import Image5 from 'src/assets/img/404/5.svg';
import Image6 from 'src/assets/img/404/6.svg';
import Image7 from 'src/assets/img/404/7.svg';
import Image8 from 'src/assets/img/404/8.svg';
import Image9 from 'src/assets/img/404/9.svg';
import Image10 from 'src/assets/img/404/10.svg';
import Image11 from 'src/assets/img/404/11.svg';

const obtenerNumeroSinRepetir = () => {
  // Números disponibles
  let image404 = [
    Image1,
    Image2,
    Image3,
    Image4,
    Image5,
    Image6,
    Image7,
    Image8,
    Image9,
    Image10,
    Image11,

  ];

  // Elige un índice aleatorio
  let indiceAleatorio = Math.floor(Math.random() * image404.length);

  return  image404[indiceAleatorio];

}

</script>
