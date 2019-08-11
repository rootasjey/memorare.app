<script>
	import ApolloClient 	from 'apollo-boost';
	import { setClient } 	from 'svelte-apollo';

	import { client } 		from './data';
	import Footer					from './Footer.svelte';
	import Header 				from './Header.svelte';
	import Quotidian 			from './Quotidian.svelte';

	setClient(client);
</script>

<style>
	.background {
		background-color: #eee;
		height: 100%;
	}

	.hero {
		background-color: #eee;

		display: flex;
		height: 100%;
		width: 100%;
		flex-direction: column;
		justify-content: center;
	}
</style>

<div class="background">
	<Header />

	<div class="hero">
		<Quotidian />
	</div>

	<Footer />
</div>
