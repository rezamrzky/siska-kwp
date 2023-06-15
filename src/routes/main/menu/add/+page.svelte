<script lang="ts">
	import { setDialogue } from '$lib/Dialogue.svelte';
	import { dialogueOpen, dialogueValue } from '$lib/dialogueStore';
	import { showMessage } from '$lib/Message.svelte';
	import { goto } from '$app/navigation';
	import type { PageData } from './$types';
	import type { Prisma, dr_menu_shift } from '@prisma/client';
	import { enhance } from '$app/forms';

	export let data: PageData;
	$: ({recipes} = data)

	$: ({ nextMenu } = data);
	$: monthString = [
		'Januari',
		'Februari',
		'Maret',
		'April',
		'Mei',
		'Juni',
		'Juli',
		'Agustus',
		'September',
		'Oktober',
		'November',
		'Desember'
	];

	let errorMessage = {
		show: false,
		message: ''
	};

	// console.log(data.nextMenu.date)

	const tempDate = new Date(data.nextMenu.date);

	// interface shift

	let shiftArray = new Array<dr_menu_shift>(3);

	let ListArray = new Array<object>(2);

	const shiftRecipes = new Array<string>(3*5*ListArray.length)

		let recipePointer = 0;

	function submitHandler() {
		errorMessage.show = false;

		// if (listOut.length < 1) {
		// 	errorMessage.show = true;
		// 	errorMessage.message = 'Anda belum memilih bahan baku!';
		// } else {
		setDialogue('Ajukan Menu?', 'Apakah Anda Yakin mengajukan menu?');
		dialogueOpen.set(true);
		let timeIn = setInterval(() => {
			if (!$dialogueOpen) {
				clearInterval(timeIn);
				switch ($dialogueValue) {
					case true: {
						goto('../menu');
						showMessage('Menu Berhasil Diajukan!');
					}
					case false: {
						console.log('dialog batal cancel');
					}
				}
			}
		}, 200);
		// }
	}

	function saveHandler() {
		errorMessage.show = false;

		// if (listOut.length < 1) {
		// 	errorMessage.show = true;
		// 	errorMessage.message = 'Anda belum memilih bahan baku!';
		// } else {
		setDialogue('Simpan Menu?', 'Apakah Anda Yakin menyimpan menu?');
		dialogueOpen.set(true);
		let timeIn = setInterval(() => {
			if (!$dialogueOpen) {
				clearInterval(timeIn);
				switch ($dialogueValue) {
					case true: {
						goto('../menu');
						showMessage('Menu Berhasil Disimpan!');
					}
					case false: {
						console.log('dialog batal cancel');
					}
				}
			}
		}, 200);
		// }
	}

	function cancelHandler() {
		setDialogue('Batal Tambah Menu?', 'Data yang dimasukkan tidak akan disimpan');
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
</script>

<main class="mx-auto h-screen flex flex-col bg-slate-100 p-5">
	<div class="font-['Helvetica Neue] w-full text-2xl text-primary font-black ml-2">
		<h1>MENU {monthString[tempDate.getMonth()].toUpperCase()} {tempDate.getFullYear()}</h1>
	</div>
	<form method="POST" action="?/save" use:enhance>
		<div class="mt-2 flex w-full">
			<button class="btn btn-outline font-bold btn-sm btn-primary ml-2"
				>{monthString[tempDate.getMonth()]}-{tempDate.getFullYear()}</button
			>
			<div class="grow" />
			<button class="btn btn-outline font-bold btn-sm btn-error" on:click={cancelHandler}
				>BATAL</button
			>
			<button class="btn btn-outline font-bold btn-sm btn-primary ml-2" on:click={saveHandler}
				>SIMPAN</button
			>
			<button class="btn font-bold btn-sm btn-primary ml-2" on:click={submitHandler}>AJUKAN</button>
		</div>
		<div class="overflow-x-auto w-full mt-2 text-slate-50">
			<table class="table w-full table-compact table-zebra">
				<!-- head -->
				<thead class="sticky top-0 text-slate-100">
					<tr>
						<th class="text-center">Tanggal</th>
						<th>PAGI</th>
						<th>SIANG</th>
						<th>MALAM</th>
					</tr>
				</thead>
				<tbody>
					<!-- row -->
					{#each ListArray as day, d}
						<tr>
							<td class="text-center">{d + 1}</td>
							{#each shiftArray as shift, s}
								<td>
									<div class="flex flex-col gap-1">
										{#each Array(3) as _, r}
											<select
												class="select w-full select-sm select-bordered max-w-xs text-xs"
												name="recipes-{d}-{s}"
												value={shiftRecipes[recipePointer]}
											>
												<option disabled selected>RESEP {r + 1}</option>
												{#each recipes as recipe}
												<option>{recipe.name}</option>
												{/each}
												<option>Homer</option>
											</select>
										{/each}
										<!-- <select class="select w-full select-sm select-bordered max-w-xs text-xs">
										<option disabled selected>RESEP 2</option>
										<option>Homer</option>
									</select>
									<select class="select w-full select-sm select-bordered max-w-xs text-xs">
										<option disabled selected>RESEP 3</option>
										<option>Homer</option>
									</select>
									<select class="select w-full select-sm select-bordered max-w-xs text-xs">
										<option disabled selected>RESEP 4</option>
										<option>Homer</option>
									</select>
									<select class="select w-full select-sm select-bordered max-w-xs text-xs">
										<option disabled selected>RESEP 5</option>
										<option>Homer</option>
									</select> -->
									</div>
								</td>
							{/each}
							<script>
								recipePointer++;
							</script>
						</tr>
					{/each}
					<script>
						recipePointer = 0;
					</script>
				</tbody>
			</table>
		</div>
	</form>
</main>
