<template>
	<div class="home">
		<img alt="Vue logo" src="../assets/logo.png">
		<HelloWorld msg="Welcome to Your Vue.js App"/>
	</div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from "@/components/HelloWorld.vue";
// import Cookies from "js-cookie";

export default {
	name: "Home",
	components: {
		HelloWorld
	},

	created() {
		console.log(Cookies.set());
		console.log(process.env);

		Axios.get("/book", {
			params: {
				a: 1
			}
		}).then(({ data }) => {
			console.log(data);
		});
	}
};
</script>
