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
	}
</style>

<div class="home">
	<div class="hero">
		<Quotidian />
	</div>

	<Presentation />
</div>
