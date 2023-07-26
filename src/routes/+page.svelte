<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import { showMessage } from '$lib/Message.svelte';
	import type { PageData, SubmitFunction } from './$types.js';

	let hasError = false,
		errMessage = '',
		fusername = '',
		fpassword = '',
		errorMessage = {
			show: false,
			message: ''
		},
		forgetValue = '';

	let dialogForget: any, dialogSuccess: any;

	const submitHandler: SubmitFunction = ({ cancel }) => {
		if (fusername == '' || fpassword == '') {
			cancel();
			hasError = true;
			errMessage = 'Semua kolom harus diisi!';
			console.log('hasError: ' + hasError);
			console.log('errMessage: ' + errMessage);
		}

		return async ({ result }) => {
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
		};
	};

	const forgetHandler: SubmitFunction = ({ cancel }) => {
		errorMessage.show = false;

		if (forgetValue === '') {
			cancel();
			errorMessage.show = true;
			errorMessage.message = 'Terdapat form yang belum diisi!';
		}

		return async ({ result }) => {
			if (result.type === 'success') {
				dialogForget.close();
				dialogSuccess.showModal();
				const timer = setTimeout(() => {
					dialogSuccess.close();
				}, 3000);
			}
		};
		// else {
		// 	setDialogue('Tambah Event?', 'Apakah Anda Yakin menambahkan event baru?');
		// 	dialogueOpen.set(true);
		// 	let timeIn = setInterval(() => {
		// 		if (!$dialogueOpen) {
		// 			clearInterval(timeIn);
		// 			switch ($dialogueValue) {
		// 				case true: {
		// 					goto('../events');
		// 					showMessage('Event Berhasil Ditambahkan!');
		// 				}
		// 				case false: {
		// 					console.log('dialog batal cancel');
		// 				}
		// 			}
		// 		}
		// 	}, 200);
		// }
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
			<form method="POST" use:enhance={submitHandler} action="?/login">
				<label class="labe font-semibold" for="fusernamee">Username</label>
				<input
					class="input input-bordered w-full bg-slate-100"
					type="text"
					id="fusername"
					name="username"
					bind:value={fusername}
				/>

				<label class="label font-semibold" for="fpassword">Password</label>
				<input
					class="input input-bordered w-full bg-slate-100"
					type="password"
					name="password"
					bind:value={fpassword}
				/>
				<button
					class="link font-semibold text-primary hover:text-secondary"
					type="button"
					on:click={() => {
						dialogForget.showModal();
					}}>Lupa Password?</button
				>
				<div class="flex">
					<div class="grow" />
					<button class="btn btn-primary mt-3" type="submit"> Masuk </button>
				</div>
			</form>
		</div>
	</section>
</main>

<dialog bind:this={dialogForget} class="bg-slate-50 text-slate-700 rounded">
	<h2 class="font-bold text-l flex-none text-primary">LUPA PASSWORD?</h2>
	<p class="text-sm">Silahkan mengisi username untuk me-reset password</p>
	<form class="mt-3 text-slate-700" use:enhance={forgetHandler} method="POST" action="?/forget">
		<!-- <label class="label text-sm w-fit" for="fdatepayment"
			>Tanggal Pembayaran<span class="text-red-500">*</span></label
		>
		<input
			class="input input-bordered w-full bg-slate-100"
			type="date"
			id="fdatepayment"
			name="date"
			max={formatDateYMD(today)}
			bind:value={formValue[0]}
		/> -->
		<label class="label text-sm w-fit" for="fpengeluaran"
			>Username<span class="text-red-500">*</span></label
		>
		<input
			class="input input-bordered w-full bg-slate-100 mb-3"
			type="text"
			id="fpengeluaran"
			name="username"
			bind:value={forgetValue}
		/>
		<!-- <input
			name="bill"
			type="file"
			accept=".jpeg, .jpg"
			class="file-input file-input-bordered file-input-md w-full rounded bg-slate-100"
			bind:value={formValue[2]}
		/> -->

		<button class="btn btn-primary btn-sm mt-3"> Reset password </button>
		<button class="btn btn-sm" on:click|preventDefault={dialogForget.close()}> Batal </button>
		{#if errorMessage.show}
			<div class="justify-start text-red-500 italic text-sm">{errorMessage.message}</div>
		{/if}
	</form>
</dialog>

<dialog bind:this={dialogSuccess} class="bg-slate-50 text-slate-700 rounded">
	<h2 class="font-bold text-l flex-none text-primary">PASSWORD BERHASIL DIRESET</h2>
	<p class="text-sm">Silahkan menghubungi Manajer untuk meminta password sementara</p>
</dialog>
