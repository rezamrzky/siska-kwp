<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import type { PageData, SubmitFunction } from './$types.js';

	let hasError = false,
		errMessage = '',
		fusername = '',
		fpassword = '';

	const submitHandler: SubmitFunction = ({cancel}) => {
		
		if (fusername == '' || fpassword == '') {
			cancel()
			hasError = true;
			errMessage = 'Semua kolom harus diisi!';
			console.log('hasError: ' + hasError);
			console.log('errMessage: ' + errMessage);
		} 
		
		return async ({result}) => {
			if (
				result.type == 'success'
				// result.status == 201
				) {
				goto('./main');
			}

			if (result.type == 'failure') {
				hasError = true;
				errMessage = result.data?.message!;
			}
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
				<form method="POST" use:enhance={submitHandler} action='?/login'>
				<label class="labe font-semibold" for="fusernamee">Username</label>
				<input
					class="input input-bordered w-full bg-slate-100"
					type="text"
					id="fusername"
					name="username"
					bind:value={fusername}
				/>

				<label class="label font-semibold" for="fpassword">Password</label>
				<input class="input input-bordered w-full bg-slate-100" type="password" name="password" bind:value={fpassword}/>
				<div class="flex">
					<div class="grow" />
					<button class="btn btn-primary mt-3"> Masuk </button>
				</div>
			</form>
		</div>
	</section>
</main>
