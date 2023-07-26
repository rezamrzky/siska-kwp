<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import { setDialogue } from '$lib/Dialogue.svelte';
	import { dialogueOpen, dialogueValue, navigationBlocked } from '$lib/dialogueStore';
	import { formatDateYMD, formatTime } from '$lib/Functions';
	import { showMessage } from '$lib/Message.svelte';
	import type { PageData, SubmitFunction } from './$types';

	navigationBlocked.set(true);

    export let data: PageData;

	let errorMessage = {
		show: false,
		message: ''
	};
	let formValue = [formatDateYMD(data.event.event_date), formatTime(data.event.event_date), data.event.event_place, data.event.department, data.event.total_pax, '', '', ''];

	const submitHandler: SubmitFunction = ({ cancel }) => {
		errorMessage.show = false;

		var emptyMessage = '';

		for (var i = 0; i < 5; i++) {
			if (formValue[i] === '') {
				if (emptyMessage === '') {
					emptyMessage = String(i + 1);
				} else {
					emptyMessage = emptyMessage + ', ' + String(i + 1);
				}
				console.log('empty message: ' + emptyMessage);
			}
		}

		if (emptyMessage != '') {
			cancel();
			errorMessage.show = true;
			errorMessage.message = 'Terdapat form yang belum diisi pada nomor ' + emptyMessage;
		}

		return async ({ result }) => {
			if (result.type == 'success') {
				navigationBlocked.set(false);
				goto('../'+data.event.id+'/detail');
				showMessage('Pesanan Berhasil Diubah!');
			}

			if (result.type == 'failure') {
				errorMessage.show = true;
				errorMessage.message = result.data?.message!;
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

	function cancelHandler() {
		setDialogue('Batal Edit Event?', 'Data yang dimasukkan tidak akan disimpan');
		dialogueOpen.set(true);
		let timeIn = setInterval(() => {
			if (!$dialogueOpen) {
				clearInterval(timeIn);
				switch ($dialogueValue) {
					case true: {
						navigationBlocked.set(false);
						goto('../'+data.event.id+'/detail');
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
		<div class="w-full h-fit bg-slate-100 rounded p-5">
			<h2 class="font-['Helvetica Neue'] font-black text-2xl text-primary">
				EDIT PESANAN EVENT FOOD & DRINK
			</h2>
			<p>Silahkan mengisi informasi event melalui form dibawah:</p>

			<form class="h-[28rem] py-5" method="POST" use:enhance={submitHandler} action="?/add">
				<div class="h-[28rem] overflow-y-scroll">
					<div class="flex gap-2 w-full">
						<div class="w-full">
							<label class="label font-bold w-fit" for="fdateevent"
								>1.Tanggal Acara<span class="text-red-500">*</span></label
							>
							<input
								class="input input-bordered w-full bg-slate-100"
								type="date"
								id="fdateevent"
								name="event_date"
								bind:value={formValue[0]}
							/>
						</div>
						<div class="w-full">
							<label class="label font-bold w-fit" for="ftimeevent"
								>2.Waktu Acara<span class="text-red-500">*</span></label
							>
							<input
								class="input input-bordered w-full bg-slate-100"
								type="time"
								id="ftimeevent"
								name="event_time"
								bind:value={formValue[1]}
							/>
						</div>
					</div>

					<label class="label font-bold w-fit" for="fplaceevent"
						>3.Tempat Acara<span class="text-red-500">*</span></label
					>
					<input
						class="input input-bordered w-full bg-slate-100 capitalize"
						type="text"
						id="fplaceevent"
						name="event_place"
						bind:value={formValue[2]}
					/>
					<label class="label font-bold w-fit" for="fbagian"
						>4.Nama Bagian<span class="text-red-500">*</span></label
					>
					<input
						class="input input-bordered w-full bg-slate-100 capitalize"
						type="text"
						id="fbagian"
						name="department"
						bind:value={formValue[3]}
					/>
					<label class="label font-bold w-fit" for="fkeperluan"
						>5.Jumlah Konsumsi<span class="text-red-500">*</span></label
					>
					<input
						class="input input-bordered w-full bg-slate-100 capitalize"
						type="text"
						id="fjumlah"
						name="total_pax"
						bind:value={formValue[4]}
					/>
					<!-- <div class="flex gap-2">
						<div class="w-full">
							<label class="label font-bold w-fit" for="fvendor"
								>6.Vendor<span class="text-red-500">*</span></label
							>
							<input
								class="input input-bordered w-full bg-slate-100 capitalize"
								type="text"
								id="fvendor"
								name="vendor"
								bind:value={formValue[5]}
							/>
						</div>
						<div class="w-full">
							<label class="label font-bold w-fit" for="fjumlah"
								>7.Jumlah Konsumsi<span class="text-red-500">*</span></label
							>
							<input
								class="input input-bordered w-full bg-slate-100"
								type="text"
								id="fjumlah"
								name="total_pax"
								bind:value={formValue[6]}
							/>
						</div>
					</div> -->

					<!-- <label class="label font-bold w-fit" for="fpengeluaran"
						>6.Total Pengeluaran<span class="text-red-500">*</span></label
					>
					<input
						class="input input-bordered w-full bg-slate-100"
						type="text"
						id="fpengeluaran"
						name="total_price"
						bind:value={formValue[7]}
					/> -->
					<div class="flex mt-2">
						{#if errorMessage.show}
							<div class="justify-start text-red-500 italic text-sm">{errorMessage.message}</div>
						{/if}
						<div class="flex-grow" />
						<div class="card-actions justify-end px-3 py-2">
							<button class="btn" on:click|preventDefault={cancelHandler}>Batal </button>
							<button class="btn btn-primary">EDIT </button>
						</div>
					</div>
				</div>
			</form>
		</div>
	</section>
</main>
