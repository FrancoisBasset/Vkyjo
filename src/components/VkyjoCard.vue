<template>
	<img :src="'/' + imageName + '.png'" alt="card" :class="[props.selected === true ? 'selected' : '']" />
</template>

<style scoped>
img {
	display: inline-block;
	margin: 2px;
	margin-left: 6px;
	margin-right: 6px;
	height: 5em;
}

img:hover {
	cursor: pointer;
}

.selected {
	border: 5px solid orange
}
</style>

<script setup>
import { ref, watchEffect } from 'vue';

const props = defineProps(['value', 'visible', 'selected']);
const imageName = ref(getImageName());

watchEffect(() => {
	imageName.value = getImageName();
});

function getImageName() {
	return props.visible ? 'card' + props.value : 'back';
}
</script>
