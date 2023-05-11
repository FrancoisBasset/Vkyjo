<template>
	<div class="container-fluid">
		<div class="row">
			<div class="col">
				<SkyjoCard @click="$emit('onCardClick', 0 * cols + i)" v-for="i of Array(cols).keys()" :value="cards[0 * cols + i].value" :visible="cards[0 * cols + i].visible" :key="'line-0-' + i" />
			</div>
		</div>
		<div class="row">
			<div class="col">
				<SkyjoCard @click="$emit('onCardClick', 1 * cols + i)" v-for="i of Array(cols).keys()" :value="cards[1 * cols + i].value" :visible="cards[1 * cols + i].visible" :key="'line-1-' + i" />
			</div>
		</div>
		<div class="row">
			<div class="col">
				<SkyjoCard @click="$emit('onCardClick', 2 * cols + i)" v-for="i of Array(cols).keys()" :value="cards[2 * cols + i].value" :visible="cards[2 * cols + i].visible" :key="'line-2-' + i" />
			</div>
		</div>
	</div>
</template>

<script setup>
import { ref, watchEffect } from 'vue';
import SkyjoCard from './VkyjoCard.vue';
const props = defineProps(['cards']);
defineEmits(['onCardClick']);

const cols = ref(getCols());

watchEffect(() => {
	cols.value = getCols();
});

function getCols() {
	return props.cards.length / 3;
}
</script>
