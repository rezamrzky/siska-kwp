<script lang="ts">
	import { setDialogue } from '$lib/Dialogue.svelte';
	import { dialogueOpen, dialogueValue, navigationBlocked } from '$lib/dialogueStore';
	import { showMessage } from '$lib/Message.svelte';
	import { goto } from '$app/navigation';
	import type { PageData, SubmitFunction } from './$types';
	import { enhance } from '$app/forms';

	navigationBlocked.set(true);

	export let data: PageData;
	$: ({ ingredients } = data);

	let name = data.product.brand,
		unit = data.product.product_unit,
		capacity = data.product.quantity;
	let errorMessage = {
		show: false,
		message: ''
	};

	const submitHandler: SubmitFunction = ({ cancel }) => {
		errorMessage.show = false;

		if (name === '' || unit === '' || capacity === '') {
			cancel();
			errorMessage.show = true;
			errorMessage.message = 'Terdapat form yang belum diisi!';
		}

		return async ({ result }) => {
			if (result.type === 'success') {
				goto('../../detail');
				showMessage('Produk Berhasil Diubah!');
				navigationBlocked.set(false);
			}
		};

		// else {
		// 	setDialogue('Tambah Produk?', 'Apakah Anda Yakin menambahkan produk baru?');
		// 	dialogueOpen.set(true);
		// 	let timeIn = setInterval(() => {
		// 		if (!$dialogueOpen) {
		// 			clearInterval(timeIn);
		// 			switch ($dialogueValue) {
		// 				case true: {
		// 					goto('../detail');
		// 					showMessage('Produk Berhasil Ditambahkan!');
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
		setDialogue('Batal Edit Produk?', 'Data yang dimasukkan tidak akan disimpan');
		dialogueOpen.set(true);
		let timeIn = setInterval(() => {
			if (!$dialogueOpen) {
				clearInterval(timeIn);
				switch ($dialogueValue) {
					case true: {
						navigationBlocked.set(false);
						goto('../../detail');
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
			<h2 class="font-['Helvetica Neue'] font-black text-2xl text-primary">Edit Produk</h2>
			<p>Silahkan mengisi form dibawah:</p>
			<form
				class="max-h-5/6 overflow-y-scroll"
				method="POST"
				use:enhance={submitHandler}
				action="?/edit"
			>
				<label class="label font-bold" for="fingredients">Nama Produk</label>
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
				<label class="label font-bold" for="funit">Kapasitas</label>
				<div class="flex">
					<input
						class="input input-bordered bg-slate-100"
						type="text"
						id="funit"
						bind:value={capacity}
						name="quantity"
					/>
					<label class="label font-bold" for="funit">{ingredients.unit} {ingredients.name}</label>
				</div>
				<div class="card-actions justify-end p-3">
					{#if errorMessage.show}
						<div class="justify-start text-red-500 italic text-sm">{errorMessage.message}</div>
					{/if}
					<button class="btn" on:click|preventDefault={cancelHandler}>Batal </button>
					<button class="btn btn-primary">Tambah </button>
				</div>
			</form>
		</div>
	</section>
</main>
