<script>
	import ApolloClient 	from 'apollo-boost';
	import { setClient } 	from 'svelte-apollo';
	import {
		Link,
		Route,
		Router
	} from 'svelte-routing';

	import { client } 			from './data';
	import Footer						from './components/Footer.svelte';
	import Header 					from './components/Header.svelte';
	import AddQuote					from './routes/AddQuote.svelte';
	import Apps 						from './routes/Apps.svelte';
	import Home 						from './routes/Home.svelte';
	import Pricing 					from './routes/Pricing.svelte';
	import PublishedQuotes 	from './routes/PublishedQuotes.svelte';
	import Quotidians 			from './routes/Quotidians.svelte';
	import Signin 					from './routes/Signin.svelte';
	import TempQuotes 			from './routes/TempQuotes.svelte';
	import VerifyEmail 			from './routes/VerifyEmail.svelte';
	import Welcome					from './routes/Welcome.svelte';

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
			<Route path="/addquote/:id" let:params>
				<AddQuote id="{params.id}" />
			</Route>
			<Route path="/admin/tempquotes" component="{TempQuotes}" />
			<Route path="/admin/publishedquotes" component="{PublishedQuotes}" />
			<Route path="/admin/quotidians" component="{Quotidians}" />
		</div>

		<Footer />
	</div>
</Router>
