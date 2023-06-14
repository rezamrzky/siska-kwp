<script lang="ts">
	import { setDialogue } from '$lib/Dialogue.svelte';
	import { dialogueOpen, dialogueValue } from '$lib/dialogueStore';
	import { showMessage } from '$lib/Message.svelte';
	import { goto } from '$app/navigation';

	let listOut: Array<number> = [];
	let dumbArray = ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''];

	var name = '',
		unit = '';

	let errorMessage = {
		show: false,
		message: ''
	};

	function submitHandler() {
		errorMessage.show = false;

		if (listOut.length < 1 || name==='' || unit==='') {
			errorMessage.show = true;
			errorMessage.message = 'Terdapat form yang belum diisi!';
		} else {
			setDialogue('Tambah Resep?', 'Apakah Anda Yakin menambahkan resep?');
			dialogueOpen.set(true);
			let timeIn = setInterval(() => {
				if (!$dialogueOpen) {
					clearInterval(timeIn);
					switch ($dialogueValue) {
						case true: {
							goto('../recipe');
							showMessage('Resep Berhasil Ditambahkan!');
						}
						case false: {
							console.log('dialog batal cancel');
						}
					}
				}
			}, 200);
		}
	}

	function cancelHandler() {
		setDialogue('Batal Tambah Resep?', 'Data yang dimasukkan tidak akan disimpan');
		dialogueOpen.set(true);
		let timeIn = setInterval(() => {
			if (!$dialogueOpen) {
				clearInterval(timeIn);
				switch ($dialogueValue) {
					case true: {
						goto('../recipe');
					}
					case false: {
						console.log('dialog batal cancel');
					}
				}
			}
		}, 200);
	}

	function onUsed(index: number) {
		console.log('dumbArray', dumbArray[index]);
		if (dumbArray[index] !== '') {
			if (!listOut.includes(index)) {
				listOut.push(index);
			}
		} else {
			if (listOut.includes(index)) {
				let id = listOut.indexOf(index);
				listOut.splice(id, 1);
			}
		}
		console.log('listOut', listOut);
	}
</script>

<main class="mx-auto h-screen flex flex-col bg-slate-100 p-5">
	<div class="font-['Helvetica Neue] w-full  ml-2 text-slate-700">
		<h1 class="font-black text-2xl text-primary">TAMBAH RESEP</h1>
		<p class="text-slate-700">Silahkan mengisi formulir dibawah:</p>
		<label class="label font-bold" for="fingredients">Nama Resep</label>
		<input
			class="input input-bordered w-full bg-slate-100"
			type="text"
			id="frecipes"
			bind:value={name}
		/>
		<label class="label font-bold" for="funit">Jumlah Porsi</label>
		<input
			class="input input-bordered w-full bg-slate-100"
			type="text"
			id="fportions"
			bind:value={unit}
		/>
		<p class="text-slate-700 mt-2 font-bold">Silahkan memilih bahan baku dan jumlahnya:</p>
	</div>
	<div class="w-full mt-2">
		<div class="overflow-x-scroll max-h-[27rem]">
			<table class="table w-full table-compact table-zebra">
				<!-- head -->
				<thead class="sticky top-0 text-slate-100">
					<tr class="text-center">
						<!-- <th /> -->
						<th>Nomor</th>
						<th>Bahan Baku</th>
						<th class="text-right">Kuantitas</th>
						<th />
					</tr>
				</thead>
				<tbody>
					<!-- row -->
					{#each dumbArray as dumb, i}
						<tr>
							<!-- <th>
								<label>
									<input type="checkbox" class="checkbox" />
								</label>
							</th> -->
							<td class="text-center"> 999 </td>
							<td class="text-center"> Nama Bahan Baku </td>
							<td class="text-right">
								<input
									class="input input-bordered w-fit bg-slate-100 text-right input-xs text-slate-700 text-bold"
									type="text"
									id="famount"
									on:change={() => onUsed(i)}
									bind:value={dumb}
								/>
							</td>
							<td class="text-left">satuan</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
		<div class="card-actions justify-end p-3">
			{#if errorMessage.show}
				<div class="justify-start text-red-500 italic text-sm">{errorMessage.message}</div>
			{/if}
			<button class="btn" on:click={cancelHandler}>Batal </button>
			<button class="btn btn-primary" on:click={submitHandler}>TAMBAH </button>
		</div>
	</div>
</main>
