<template>
  <div>
    <q-card-section>
      <div class="row">
        <div class="col-12 col-lg-12 col-md-12 col-sm-12 col-xs-12">
          <div class="row no-wrap q-my-xs custom-card">
            <div class="text-white flex items-center justify-center custom-icon custom-card" style="width: 100px">
              <q-icon :name="`img:${iconImage}`" style="width:56px;height: auto;" />
            </div>
            <div class="q-pa-sm col flex column justify-center">
				<div class="row">
					<div class="col-12 col-lg-12 col-md-12 col-sm-12 col-xs-12">
					<div style="font-size: 20px;text-transform: uppercase;">{{ title }}</div>
				</div>
				<div class="col-12 col-lg-12 col-md-12 col-sm-12 col-xs-12"></div>
              		<div style="font-size: 18px">
                		{{ subtitle }}
              		</div>
				</div>
            </div>
          </div>
        </div>
        <div class="col-12 col-lg-12 col-md-12 col-sm-12 col-xs-12">
          <div class="column items-end">
            <div class="row q-gutter-xs">
                <slot name="buttons"></slot>
                <q-btn size="12px" outline icon="fas fa-angle-left" class="custom-back-btn" :style="'background-color: #00b388,width:' + ($q.screen.width <= 468 ? '100%' : '')"
                  @click="$router.push({ name: urlRedirect })">
                  Regresar
                </q-btn>
            </div>
          </div>
        </div>
      </div>
    </q-card-section>
    <q-separator />
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: ''
    },
    subtitle: {
      type: String,
      default: ''
    },
    iconImage:{
      type: String,
      default: ''
    },
    urlRedirect:{
      type: String,
      default:'AdministrationMenu'
    }
  }
}
</script>

<style scoped>
/* .adjust-icon {
  margin-right: 5px;
  padding-bottom: 2px;
}
div{
  font-family: Montserrat;
  font-style: normal;
} */

.cell {
  box-sizing: border-box;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: normal;
  word-break: break-all;
  line-height: 23px;
  padding-right: 10px;
}

.custom-card {
  background: linear-gradient(to bottom, #611232, #9b2247);
  color: white;
  border-radius: 4px;
  box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.3);
  height: 82px;
}

.custom-back-btn {
  border-radius: 5px;
  background-color: #611232;
  color: #611232;
  font-size: 16px;
  font-family: 'Noto San';
}

.custom-filter-btn {
  width: 250px;
  border-radius: 5px;
  background-color: #877350;
  color: white;
  font-size: 16px;
  font-family: 'Noto San';
}
</style>
