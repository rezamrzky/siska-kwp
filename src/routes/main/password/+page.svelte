<script lang="ts">
	import { dialogueOpen, dialogueValue, navigationBlocked } from '../../../lib/dialogueStore';
	import { setDialogue } from '../../../lib/Dialogue.svelte';
	import { goto } from '$app/navigation';
	import { showMessage } from '$lib/Message.svelte';
	import { enhance } from '$app/forms';
	import type { PageData, SubmitFunction } from './$types';

	export let data: PageData;

	navigationBlocked.set(true);

	let show_password = false,
		hasError = false,
		errMessage = '',
		fpassold = '',
		fpassnew = '',
		fpassnew2 = '',
		buttonDisabled = false;

	// console.log('user status : '+data.user.status);
	
		if (data.user.status === 'Tidak Aktif') {
			hasError = true;
			errMessage = 'Silahkan membuat password baru untuk mengaktifkan akun!';
			buttonDisabled = true
		}

	const updateHandler: SubmitFunction = ({ cancel }) => {
		
		if (fpassold == '' || fpassnew == '' || fpassnew2 == '') {
			hasError = true;
			errMessage = 'Semua Kolom harus diisi!';
			cancel();
		} else if (fpassnew.length < 6) {
			hasError = true;
			errMessage = 'Password harus terdiri dari 6 karakter atau lebih!';
			cancel();
		} else if (fpassnew != fpassnew2) {
			hasError = true;
			errMessage = 'Password baru tidak sesuai';
			cancel();
		}
		// else {
		// 	setDialogue('Ganti Password?', 'Password lama Anda akan diupdate ke password baru Anda.');
		// 	dialogueOpen.set(true);
		// 	let timeIn = setInterval(() => {
		// 	if (!$dialogueOpen) {
		// 		clearInterval(timeIn);
		// 		switch ($dialogueValue) {
		// 			case true: {
		// 				goto('../main');
		// 				showMessage('Password berhasil diubah!')
		// 			}
		// 			case false: {
		// 				console.log('dialog batal cancel');
		// 			}
		// 		}
		// 	}
		// }, 200);
		// }

		return async ({ result }) => {
			if (result.type === 'success') {
				navigationBlocked.set(false);
				goto('../main');
				showMessage('Password berhasil diubah!');
			}
			if (result.type === 'failure') {
				hasError = true;
				errMessage = result.data?.message!;
			}
		};
	};

	function cancelHandler() {
		setDialogue('Batal Ganti Password?', 'Data yang dimasukkan tidak akan disimpan');
		dialogueOpen.set(true);
		let timeIn = setInterval(() => {
			if (!$dialogueOpen) {
				clearInterval(timeIn);
				switch ($dialogueValue) {
					case true: {
						goto('../main');
						navigationBlocked.set(false);
					}
					case false: {
						console.log('dialog batal cancel');
					}
				}
			}
		}, 200);
	}
</script>

<main>
	<section class="place-content-center w-full h-screen drop-shadow-2xl rounded p-5 text-slate-700">
		<div class="w-full max-h-full bg-slate-100 rounded p-5">
			<h2 class="font-['Helvetica Neue'] font-black text-2xl text-primary">GANTI PASSWORD</h2>
			<p>Silahkan mengisi form dibawah:</p>
			{#if hasError}
				<div class="rounded bg-red-300 w-full text-center mt-2">
					<p class="text-red-900 text-sm">{errMessage}</p>
				</div>
			{/if}
			<form class="max-h-5/6 overflow-y-scroll" method="post" use:enhance={updateHandler}>
				<label class="label font-bold" for="fpassold">Password Lama</label>
				{#if show_password}
					<input
						class="input input-bordered w-full bg-slate-100"
						type="text"
						id="fpassold"
						name="oldPassword"
						bind:value={fpassold}
					/>
					<label class="label font-bold" for="fpassnew">Password Baru</label>
					<input
						class="input input-bordered w-full bg-slate-100"
						type="text"
						id="fpassnew"
						name="newPassword"
						bind:value={fpassnew}
					/>
					<label class="label font-bold" for="fpassnew2">Ulangi Password Baru</label>
					<input
						class="input input-bordered w-full bg-slate-100"
						type="text"
						id="fpassnew2"
						name="confirmPassword"
						bind:value={fpassnew2}
					/>
				{:else}
					<input
						class="input input-bordered w-full bg-slate-100"
						type="password"
						id="fpassold"
						name="oldPassword"
						bind:value={fpassold}
					/>
					<label class="label font-bold" for="fpassnew">Password Baru</label>
					<input
						class="input input-bordered w-full bg-slate-100"
						type="password"
						id="fpassnew"
						name="newPassword"
						bind:value={fpassnew}
					/>
					<label class="label font-bold" for="fpassnew2">Ulangi Password Baru</label>
					<input
						class="input input-bordered w-full bg-slate-100"
						type="password"
						id="fpassnew2"
						name="confirmPassword"
						bind:value={fpassnew2}
					/>
				{/if}
				<div class="form-control w-fit">
					<label class="label cursor-pointer">
						<input
							type="checkbox"
							class="checkbox"
							on:click={() => (show_password = !show_password)}
						/>
						<span class="label-text px-3">Lihat Password</span>
					</label>
				</div>
				<div class="card-actions justify-end p-3">
					<button class="btn" disabled={buttonDisabled} on:click|preventDefault={cancelHandler}> Batal </button>
					<button class="btn btn-primary" type="submit"> UBAH </button>
				</div>
			</form>
		</div>
	</section>
</main>
