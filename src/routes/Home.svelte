<script>
	import Presentation from '../components/Presentation.svelte'
	import Quotidian 		from '../components/Quotidian.svelte';
</script>

<style>
	.home {
		position: relative;
		min-height: 100%;

		display: flex;
		flex-direction: column;
	}

	.hero {
		background-color: #eee;

		position: relative;
		min-height: 100vh;
		width: 100%;

		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}
</style>

<div class="home">
	<div class="hero">
		<Quotidian top="-50px" />
	</div>

	<Presentation />
</div>
