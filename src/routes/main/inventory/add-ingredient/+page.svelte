<script lang="ts">
	import { setDialogue } from '$lib/Dialogue.svelte';
	import { dialogueOpen, dialogueValue, navigationBlocked } from '$lib/dialogueStore';
	import { showMessage } from '$lib/Message.svelte';
	import { goto } from '$app/navigation';
	import { enhance } from '$app/forms';
	import type { SubmitFunction } from './$types';

	navigationBlocked.set(true);

	var name = '',
		unit = '';
	let errorMessage = {
		show: false,
		message: ''
	};

	const submitHandler: SubmitFunction = ({ cancel }) => {
		errorMessage.show = false;

		if (name === '' || unit === '') {
			cancel();
			errorMessage.show = true;
			errorMessage.message = 'Terdapat form yang belum diisi!';
		}

		return async ({ result }) => {
			if (result.type === 'success') {
				goto('../inventory');
				showMessage('Bahan Baku Berhasil Ditambahkan!');
				navigationBlocked.set(false)
			}
		};

		// else {
		// 	setDialogue('Tambah Bahan Baku?', 'Apakah Anda Yakin menambahkan bahan baku baru?');
		// 	dialogueOpen.set(true);
		// 	let timeIn = setInterval(() => {
		// 		if (!$dialogueOpen) {
		// 			clearInterval(timeIn);
		// 			switch ($dialogueValue) {
		// 				case true: {
		// 					goto('../inventory');
		// 					showMessage('Bahan Baku Berhasil Ditambahkan!');
		// 				}
		// 				case false: {
		// 					console.log('dialog batal cancel');
		// 				}
		// 			}
		// 		}
		// 	}, 200);
		// }
	};

	function cancelHandler() {
		setDialogue('Batal Tambah Bahan Baku?', 'Data yang dimasukkan tidak akan disimpan');
		dialogueOpen.set(true);
		let timeIn = setInterval(() => {
			if (!$dialogueOpen) {
				clearInterval(timeIn);
				switch ($dialogueValue) {
					case true: {
						goto('../inventory');
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
			<h2 class="font-['Helvetica Neue'] font-black text-2xl text-primary">Tambah Bahan Baku</h2>
			<p>Silahkan mengisi form dibawah:</p>
			<form class="max-h-5/6 overflow-y-scroll" method="POST" use:enhance={submitHandler} action="?/add">
				<label class="label font-bold" for="fingredients">Nama Bahan Baku</label>
				<input
					class="input input-bordered w-full bg-slate-100 capitalize"
					type="text"
					id="fingredients"
					bind:value={name}
					name="name"
				/>
				<label class="label font-bold" for="funit">Satuan</label>
				<input
					class="input input-bordered w-full bg-slate-100 capitalize"
					type="text"
					id="funit"
					bind:value={unit}
					name="unit"
				/>
				<div class="card-actions justify-end p-3">
					{#if errorMessage.show}
						<div class="justify-start text-red-500 italic text-sm">{errorMessage.message}</div>
					{/if}
					<button class="btn" on:click|preventDefault={cancelHandler}>Batal </button>
					<button class="btn btn-primary" type="submit">Tambah </button>
				</div>
			</form>
		</div>
	</section>
</main>
