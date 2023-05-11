<script lang="ts">
	import { goto } from '$app/navigation';
	import { userId } from '../lib/dPegawai';

	export let data;
	export let form;

	let hasError = false,
		errMessage = '',
		fusername = '',
		username = '';

	const submitBtnHandle = () => {
		userId.set(fusername)
		
		if (fusername == '') {
			hasError = true;
			errMessage = 'Semua kolom harus diisi!';
			console.log('hasError: ' + hasError);
			console.log('errMessage: ' + errMessage);
		} else if (fusername.length > 1) {
			hasError = true;
			errMessage = 'Username dan password tidak sesuai';
			console.log('hasError: ' + hasError);
			console.log('errMessage: ' + errMessage);
		} else {
			username = fusername;
			console.log('username: '+username);
			goto('./main');
		}
	};
</script>

<main class="mx-auto h-screen flex flex-col lg:flex-row bg-slate-100">
	<section
		class="hero flex flex-col place-content-center basis-1/3 lg:basis-2/3 bg-primary drop-shadow-lg"
	>
		<h1 class="text-4xl font-['Helvetica Neue'] font-black text-white">Sis-Ka KWP</h1>
		<p class="text-base font-bold text-white">Sistem Katering Koperasi Wanita Patra</p>
	</section>
	<section class="login grid place-content-center basis 2/3 lg:basis-1/2 drop-shadow-2xl">
		<div class="card-body w-96 bg-slate-100 text-slate-700 rounded">
			<h2 class="card-title font-['Helvetica Neue']">Selamat Datang!</h2>
			<p class="text-sm">Silahkan mengisi form di bawah untuk masuk ke dalam sistem</p>

			{#if hasError}
				<div class="rounded bg-red-300 w-full text-center">
					<p class="text-red-900 text-sm">{errMessage}</p>
				</div>
			{/if}
			<!-- <form method="post" action="?/login"> -->
				<form on:submit|preventDefault={submitBtnHandle}>
				<label class="labe font-semibold" for="fusernamee">Username</label>
				<input
					class="input input-bordered w-full bg-slate-100"
					type="text"
					id="fusername"
					name="username"
					bind:value={fusername}
				/>

				<label class="label font-semibold" for="fpassword">Password</label>
				<input class="input input-bordered w-full bg-slate-100" type="password" name="password" />
				<div class="flex">
					<div class="grow" />
					<button class="btn btn-primary mt-3"> Masuk </button>
				</div>
			</form>
		</div>
	</section>
</main>
