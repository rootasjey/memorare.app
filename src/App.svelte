<script>
	import { Route, Router } from 'svelte-routing';

	import { client } 			from './data';

	import FAB							from './components/FAB.svelte';
	import Footer						from './components/Footer.svelte';
	import Header 					from './components/Header.svelte';
	import Snackbar 				from './components/Snackbar.svelte';

	import AccountSettings	from './routes/AccountSettings.svelte';
	import AddQuote					from './routes/AddQuote.svelte';
	import Apps 						from './routes/Apps.svelte';
	import Author 					from './routes/Author.svelte';
	import Authors 					from './routes/Authors.svelte';
	import EditAuthor 			from './routes/EditAuthor.svelte';
	import EditQuoteContent from './routes/EditQuoteContent.svelte';
	import ForgetPassword		from './routes/ForgetPassword.svelte';
	import Home 						from './routes/Home.svelte';
	import Pricing 					from './routes/Pricing.svelte';
	import PublishedQuotes 	from './routes/PublishedQuotes.svelte';
	import Quotidians 			from './routes/Quotidians.svelte';
	import RandomQuote 			from './routes/RandomQuote.svelte';
	import Route404 				from './routes/Route404.svelte';
	import RouteNotPass 		from './routes/RouteNotPass.svelte';
	import Signin 					from './routes/Signin.svelte';
	import TempQuotes 			from './routes/TempQuotes.svelte';
	import UpdateEmail 			from './routes/UpdateEmail.svelte';
	import VerifyEmail 			from './routes/VerifyEmail.svelte';
	import Welcome					from './routes/Welcome.svelte';
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
		<FAB />
		<Header />
		<Snackbar />

		<div class="content">
			<Route path="/" component="{Home}" />
			<Route path="/accountsettings" component="{AccountSettings}" />
			<Route path="/add/quote" component="{AddQuote}" />
			<Route path="/admin/tempquotes" component="{TempQuotes}" />
			<Route path="/admin/publishedquotes" component="{PublishedQuotes}" />
			<Route path="/admin/quotidians" component="{Quotidians}" />
			<Route path="/apps" component="{Apps}" />
			<Route path="/author/:id" let:params>
				<Author id={params.id} />
			</Route>
			<Route path="/edit/author/:id" let:params>
				<EditAuthor id={params.id} />
			</Route>
			<Route path="/edit/quote/:id" let:params>
				<AddQuote id="{params.id}" />
			</Route>
			<Route path="/edit/quote/content/:id" let:params>
				<EditQuoteContent id="{params.id}" />
			</Route>
			<Route path="/authors" component="{Authors}" />
			<Route path="/forget/password" component="{ForgetPassword}" />
			<Route path="/forget/password/:emailToken" let:params>
				<ForgetPassword emailToken={params.emailToken} />
			</Route>
			<Route path="/pricing" component="{Pricing}" />
			<Route path="/random/quote" component="{RandomQuote}" />
			<Route path="/shallnotpass" component="{RouteNotPass}" />
			<Route path="/signin" component="{Signin}" />
			<Route path="/update/email/:emailToken" let:params>
				<UpdateEmail emailToken={params.emailToken} />
			</Route>
			<Route path="/verify/email/:emailToken" let:params>
				<VerifyEmail emailToken="{params.emailToken}"/>
			</Route>
			<Route path="/welcome" component="{Welcome}" />

			<!-- 404 -->
			<Route path="/*wildcard" let:params>
				<Route404 path="{params.wildcard}" />
			</Route>
		</div>

		<Footer />
	</div>
</Router>
