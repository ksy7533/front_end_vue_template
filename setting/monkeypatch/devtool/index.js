import Vue from "vue";

if (process.env.NODE_ENV === "production") {
  //process.env.NODE_ENV vue cli 실행모드 배포일떄
  Vue.config.devtools = false;
  Vue.config.productionTip = false;
} else {
  Vue.config.devtools = true;
  Vue.config.productionTip = true;
}
