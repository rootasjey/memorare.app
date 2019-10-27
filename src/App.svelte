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
	import Snackbar 				from './components/Snackbar.svelte';

	import AccountSettings	from './routes/AccountSettings.svelte';
	import AddQuote					from './routes/AddQuote.svelte';
	import Apps 						from './routes/Apps.svelte';
	import ForgetPassword		from './routes/ForgetPassword.svelte';
	import Home 						from './routes/Home.svelte';
	import Pricing 					from './routes/Pricing.svelte';
	import PublishedQuotes 	from './routes/PublishedQuotes.svelte';
	import Quotidians 			from './routes/Quotidians.svelte';
	import RandomQuote 			from './routes/RandomQuote.svelte';
	import Route404 				from './routes/Route404.svelte';
	import Signin 					from './routes/Signin.svelte';
	import TempQuotes 			from './routes/TempQuotes.svelte';
	import UpdateEmail 			from './routes/UpdateEmail.svelte';
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
		<Snackbar />

		<div class="content">
			<Route path="/" component="{Home}" />
			<Route path="/apps" component="{Apps}" />
			<Route path="/pricing" component="{Pricing}" />
			<Route path="/signin" component="{Signin}" />
			<Route path="/verify/email/:emailToken" let:params>
				<VerifyEmail emailToken="{params.emailToken}"/>
			</Route>
			<Route path="/welcome" component="{Welcome}" />
			<Route path="/addquote/:id" let:params>
				<AddQuote id="{params.id}" />
			</Route>
			<Route path="/addquote" component="{AddQuote}" />
			<Route path="/admin/tempquotes" component="{TempQuotes}" />
			<Route path="/admin/publishedquotes" component="{PublishedQuotes}" />
			<Route path="/admin/quotidians" component="{Quotidians}" />
			<Route path="/random/quote" component="{RandomQuote}" />
			<Route path="/accountsettings" component="{AccountSettings}" />
			<Route path="/update/email/:emailToken" let:params>
				<UpdateEmail emailToken={params.emailToken} />
			</Route>
			<Route path="/forget/password" component="{ForgetPassword}" />
			<Route path="/forget/password/:emailToken" let:params>
				<ForgetPassword emailToken={params.emailToken} />
			</Route>

			<!-- 404 -->
			<Route path="/*wildcard" let:params>
				<Route404 path="{params.wildcard}" />
			</Route>
		</div>

		<Footer />
	</div>
</Router>
