<script lang="ts">
	import { setDialogue } from '$lib/Dialogue.svelte';
	import { dialogueOpen, dialogueValue, navigationBlocked } from '$lib/dialogueStore';
	import { showMessage } from '$lib/Message.svelte';
	import { goto } from '$app/navigation';
	import { enhance } from '$app/forms';
	import type { SubmitFunction } from './$types';

	navigationBlocked.set(true)

	var date='', value='';
	let errorMessage = {
		show: false,
		message: ''
	};

	const submitHandler: SubmitFunction = ({cancel}) => {
		errorMessage.show = false;

		if (date === '' || value === '') {
			errorMessage.show = true;
			errorMessage.message = 'Terdapat form yang belum diisi!';
			cancel()
		}

		return async ({result}) => {
			if(result.type === 'success'){
				showMessage('Catatan Modal Berhasil Ditambahkan!');
				goto('../dr-report');
				navigationBlocked.set(false)
			}
		}
		// else {
		// 	setDialogue('Tambah Catatan Modal Dining Room?', 'Apakah Anda Yakin menambahkan catatan modal dining room?');
		// 	dialogueOpen.set(true);
		// 	let timeIn = setInterval(() => {
		// 		if (!$dialogueOpen) {
		// 			clearInterval(timeIn);
		// 			switch ($dialogueValue) {
		// 				case true: {
		// 					goto('../dr-report');
		// 					showMessage('Catatan Modal Berhasil Ditambahkan!');
		// 				}
		// 				case false: {
		// 					console.log('dialog batal cancel');
		// 				}
		// 			}
		// 		}
		// 	}, 200);
		// }
	}

function cancelHandler() {
		setDialogue('Batal Tambah Tambah Catatan Modal Dining Room?', 'Data yang dimasukkan tidak akan disimpan');
		dialogueOpen.set(true);
		let timeIn = setInterval(() => {
			if (!$dialogueOpen) {
				clearInterval(timeIn);
				switch ($dialogueValue) {
					case true: {
						goto('../dr-report');
						navigationBlocked.set(false)
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
		<div class="w-full h-full bg-slate-100 rounded p-5">
			<h2 class="font-['Helvetica Neue'] font-black text-2xl text-primary">TAMBAH MODAL DINING ROOM</h2>
			<p>Silahkan mengisi form dibawah:</p>
			<form class="overflow-y-scroll" use:enhance={submitHandler} method="POST" action="?/add">
                <label class="label font-bold" for="fdateevent">Tanggal</label>
				<input class="input input-bordered w-full bg-slate-100" type="date" id="fdateevent" bind:value={date} name="date"/>
                <label class="label font-bold" for="fplaceevent">Jumlah Modal</label>
				<input class="input input-bordered w-full bg-slate-100" type="text" id="fplaceevent" bind:value={value} name="total"/>
				<div class="card-actions justify-end p-3">
					{#if errorMessage.show}
						<div class="justify-start text-red-500 italic text-sm">{errorMessage.message}</div>
					{/if}
					<button class="btn" on:click|preventDefault={cancelHandler}>Batal
					</button>
					<button class="btn btn-primary" type="submit">
						Tambah
					</button>
				</div>
			</form>
		</div>
	</section>
</main>
