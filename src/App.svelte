<script>
	import ApolloClient 	from 'apollo-boost';
	import { setClient } 	from 'svelte-apollo';
	import {
		Link,
		Route,
		Router
	} from 'svelte-routing';

	import { client } 		from './data';
	import AddQuote				from './routes/AddQuote.svelte';
	import Footer					from './components/Footer.svelte';
	import Header 				from './components/Header.svelte';
	import Apps 					from './routes/Apps.svelte';
	import Home 					from './routes/Home.svelte';
	import Pricing 				from './routes/Pricing.svelte';
	import Signin 				from './routes/Signin.svelte';
	import VerifyEmail 		from './routes/VerifyEmail.svelte';
	import Welcome				from './routes/Welcome.svelte';

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
		background-color: #eee;
	}
</style>

<Router>
	<div class="background">
		<Header />

		<div class="content">
			<Route path="/" component="{Home}" />
			<Route path="/apps" component="{Apps}" />
			<Route path="/pricing" component="{Pricing}" />
			<Route path="/signin" component="{Signin}" />
			<Route path="/verifyemail/:tokenid" let:params>
				<VerifyEmail tokenid="{params.tokenid}"/>
			</Route>
			<Route path="/welcome" component="{Welcome}" />
			<Route path="/addquote" component="{AddQuote}" />
		</div>

		<Footer />
	</div>
</Router>
