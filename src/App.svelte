<script>
	import ApolloClient 	from 'apollo-boost';
	import { setClient } 	from 'svelte-apollo';
	import {
		Link,
		Route,
		Router
	} from 'svelte-routing';

	import { client } 		from './data';
	import Footer					from './components/Footer.svelte';
	import Header 				from './components/Header.svelte';
	import Apps 					from './routes/Apps.svelte';
	import Home 					from './routes/Home.svelte';
	import Pricing 				from './routes/Pricing.svelte';

	setClient(client);

	export let url = '';
</script>

<style>
	.background {
		background-color: #eee;
		height: 100%;
	}

	.content {
		min-height: 100%;
	}
</style>

<Router>
	<div class="background">
		<Header />

		<div class="content">
			<Route path="/" component="{Home}" />
			<Route path="/apps" component="{Apps}" />
			<Route path="/pricing" component="{Pricing}" />
		</div>

		<Footer />
	</div>
</Router>
