<script lang="ts">
	import { setDialogue } from '$lib/Dialogue.svelte';
	import { dialogueOpen, dialogueValue, navigationBlocked } from '$lib/dialogueStore';
	import { showMessage } from '$lib/Message.svelte';
	import { goto } from '$app/navigation';
	import type { PageData, SubmitFunction } from './$types';
	import type { Prisma, dr_menu_shift } from '@prisma/client';
	import { enhance } from '$app/forms';
	import { number3DigitFormat } from '$lib/Functions';

	navigationBlocked.set(true);

	export let data: PageData;
	$: ({ recipes } = data);
	// $: ({shiftMenu} = data)

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

	const tempDate = new Date(data.nextMenu.date);
	const menuRecipe: string[][][] = new Array<string[][]>(tempDate.getDate());
	const menuShifts = data.nextMenu.dr_menu_shift;

	const totalRecipe = (tempDate.getDate()) * 10;

	for (let d = 0; d < tempDate.getDate(); d++) {
		menuRecipe[d] = new Array<string[]>(2);
		for (let s = 0; s < 2; s++) {
			const menuShift = menuShifts.find(
				(shift: any) => shift.day === d + 1 && shift.shift_cat === s + 1
			);
			menuRecipe[d][s] = new Array<string>(5);
			if (menuShift.dr_menu_shift_recipes.length > 0) {
				for (let r = 0; r < 5; r++) {
					const recipeId = menuShift.dr_menu_shift_recipes.find(
						(recipe: any) => recipe.index === r
					);
					if (recipeId) {
						const recipe = data.recipes.find((recipe: any) => recipe.id === recipeId.recipe_id);
						menuRecipe[d][s][r] = recipe.name + '-' + String(number3DigitFormat(recipe.id));
						console.log(menuRecipe[d][s][r] )
					}
				}
			}
		}
	}

	function is_full(): boolean {
		let filled = 0;
		for (let d = 0; d < tempDate.getDate(); d++) {
			menuRecipe[d] = new Array<string[]>(2);
			for (let s = 0; s < 2; s++) {
				const menuShift = menuShifts.find(
					(shift: any) => shift.day === d + 1 && shift.shift_cat === s + 1
				);
				menuRecipe[d][s] = new Array<string>(5);
				if (menuShift.dr_menu_shift_recipes.length > 0) {
					for (let r = 0; r < 5; r++) {
						const recipeId = menuShift.dr_menu_shift_recipes.find(
							(recipe: any) => recipe.index === r
						);
						if (recipeId) {
							const recipe = data.recipes.find((recipe: any) => recipe.id === recipeId.recipe_id);
							menuRecipe[d][s][r] = recipe.name + '-' + String(number3DigitFormat(recipe.id));
							filled++;
						}
					}
				}
			}
		}
		return filled === totalRecipe;
	}

	const submitHandler: SubmitFunction = ({ cancel }) => {
		errorMessage.show = false;

		// if (listOut.length < 1) {
		// 	errorMessage.show = true;
		// 	errorMessage.message = 'Anda belum memilih bahan baku!';
		// } else {
			return async ({ result }) => {
			if (result.type === 'success') {
				showMessage('Menu Berhasil Diajukan!');
				goto('../menu');
						navigationBlocked.set(false);
			}
		};
		// }
	}

	const saveHandler: SubmitFunction = ({ cancel }) => {
		errorMessage.show = false;
		is_full()

		return async ({ result }) => {
			if (result.type === 'success') {
				showMessage('Menu Berhasil Disimpan!');
				window.location.reload();
			}
		};

		// if (listOut.length < 1) {
		// 	errorMessage.show = true;
		// 	errorMessage.message = 'Anda belum memilih bahan baku!';
		// } else {
		// setDialogue('Simpan Menu?', 'Apakah Anda Yakin menyimpan menu?');
		// dialogueOpen.set(true);
		// let timeIn = setInterval(() => {
		// 	if (!$dialogueOpen) {
		// 		clearInterval(timeIn);
		// 		switch ($dialogueValue) {
		// 			case true: {
		// 				goto('../menu');
		// 				showMessage('Menu Berhasil Disimpan!');
		// 			}
		// 			case false: {
		// 				console.log('dialog batal cancel');
		// 			}
		// 		}
		// 	}
		// }, 200);
		// }
	};

	function cancelHandler() {
		setDialogue('Keluar?', 'Pastikan data yang dimasukkan telah disimpan');
		dialogueOpen.set(true);
		let timeIn = setInterval(() => {
			if (!$dialogueOpen) {
				clearInterval(timeIn);
				switch ($dialogueValue) {
					case true: {
						goto('../menu');
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

<main class="mx-auto h-screen flex flex-col bg-slate-100 p-5">
	<div class="font-['Helvetica Neue] w-full text-2xl text-primary font-black ml-2">
		<h1>MENU {monthString[tempDate.getMonth()].toUpperCase()} {tempDate.getFullYear()}</h1>
	</div>
	<form method="POST" action="?/save" use:enhance={saveHandler}>
		<div class="mt-2 flex w-full">
			<button class="btn btn-outline font-bold btn-sm btn-primary ml-2"
				>{monthString[tempDate.getMonth()]}-{tempDate.getFullYear()}</button
			>
			<div class="grow" />
			<button class="btn btn-outline font-bold btn-sm btn-error" on:click={cancelHandler} type="button"
				>KELUAR</button
			>
			<button class="btn btn-outline font-bold btn-sm btn-primary ml-2" type="submit">SIMPAN</button
			>
			<form method="POST" action="?/submitted" use:enhance={submitHandler}>
			<button class="btn font-bold btn-sm btn-primary ml-2" disabled={!is_full()}>AJUKAN</button>
		</form>
		</div>
		<div class="overflow-y-scroll w-full mt-2 text-slate-50 max-h-[42rem]">
			<table class="table w-full table-compact table-zebra">
				<!-- head -->
				<thead class="sticky top-0 text-slate-100">
					<tr  class="text-center">
						<th>Tanggal</th>
						<!-- <th>PAGI</th> -->
						<th>SORE</th>
						<th>MALAM</th>
					</tr>
				</thead>
				<tbody>
					<!-- row -->
					{#each menuRecipe as day, d}
						<tr>
							<td class="text-center">{d + 1}</td>
							{#each menuRecipe[d] as shift, s}
								<td>
									<div class="flex flex-col gap-1">
										{#each menuRecipe[d][s] as _, r}
											<select
												class="select w-full select-sm select-bordered max-w-xs text-xs text-slate-300"
												name="recipes-{String(d)}-{String(s)}"
												value={menuRecipe[d][s][r] ? menuRecipe[d][s][r] : 'RESEP ' + String(r + 1)}
											>
												<option disabled selected>RESEP {r + 1}</option>
												{#each recipes as recipe}
													<option>{recipe.name}-{number3DigitFormat(recipe.id)}</option>
												{/each}
												<option>Homer</option>
											</select>
										{/each}
									</div>
								</td>
							{/each}
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</form>
</main>
