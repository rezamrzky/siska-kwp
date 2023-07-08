<script lang="ts">
	import { setDialogue } from '$lib/Dialogue.svelte';
	import { dialogueOpen, dialogueValue, navigationBlocked } from '$lib/dialogueStore';
	import { showMessage } from '$lib/Message.svelte';
	import { goto } from '$app/navigation';
	import type { PageData, SubmitFunction } from './$types';
	import { number3DigitFormat } from '$lib/Functions';
	import { enhance } from '$app/forms';

	navigationBlocked.set(true);

	const monthString = [
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

	export let data: PageData;
	$: ({ recipes } = data);

	const date = new Date(data.menus.date);
	console.log(date);
	let dateString = String(monthString[date.getMonth()]) + ' ' + String(date.getFullYear());

	let listMonth: boolean[][] = new Array<boolean[]>(date.getDate());

	const menuRecipe: string[][][] = new Array<string[][]>(date.getDate());
	const menuShifts = data.menus.dr_menu_shift;

	for (let d = 0; d < date.getDate(); d++) {
		menuRecipe[d] = new Array<string[]>(2);
		listMonth[d] = new Array<boolean>(4);
		for (let s = 0; s < 2; s++) {
			const menuShift = menuShifts.find(
				(shift: any) => shift.day === d + 1 && shift.shift_cat === s + 1
			);
			menuRecipe[d][s] = new Array<string>(5);
			listMonth[d][s + 1] = menuShift.is_approved;
			if (menuShift.dr_menu_shift_recipes.length > 0) {
				for (let r = 0; r < 5; r++) {
					const recipeId = menuShift.dr_menu_shift_recipes.find(
						(recipe: any) => recipe.index === r
					);
					if (recipeId) {
						const recipe = data.recipes.find((recipe: any) => recipe.id === recipeId.recipe_id);
						menuRecipe[d][s][r] = recipe.name + '-' + String(number3DigitFormat(recipe.id));
						console.log(menuRecipe[d][s][r]);
					}
				}
			}
		}
	}

	let choosenMonth: Date,
		arrayDaysMenu = [,],
		showList = false,
		dateArr: Array<string>;

	let errorMessage = {
		show: false,
		message: ''
	};

	function getDays() {
		let dateString = choosenMonth.toString();
		dateArr = dateString.split('-');
		let d = new Date(parseInt(dateArr[0]), parseInt(dateArr[1]), 0);
		arrayDaysMenu.length = d.getDate();
		showList = true;
	}

	const submitHandler: SubmitFunction = () => {
		errorMessage.show = false;

		return async ({ result }) => {
			goto('../');
			navigationBlocked.set(false);
			showMessage('Menu Berhasil Diubah!');
		};

		// if (listOut.length < 1) {
		// 	errorMessage.show = true;
		// 	errorMessage.message = 'Anda belum memilih bahan baku!';
		// } else {
		// setDialogue('Edit Menu?', 'Apakah Anda Yakin mengubah menu?');
		// dialogueOpen.set(true);
		// let timeIn = setInterval(() => {
		// 	if (!$dialogueOpen) {
		// 		clearInterval(timeIn);
		// 		switch ($dialogueValue) {
		// 			case true: {
		// 				goto('../menu');
		// 				showMessage('Menu Berhasil Diubah!');
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
		setDialogue('Batal Edit Menu?', 'Data yang dimasukkan tidak akan disimpan');
		dialogueOpen.set(true);
		let timeIn = setInterval(() => {
			if (!$dialogueOpen) {
				clearInterval(timeIn);
				switch ($dialogueValue) {
					case true: {
						goto('../');
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
		<h1>EDIT MENU DINING ROOM</h1>
	</div>
	<form method="POST" action="?/edit" use:enhance={submitHandler}>
		<div class="mt-2 flex w-full">
			<input
				type="texth"
				readonly
				class="input input-bordered input-sm input-primary ml-2 bg-slate-100 text-primary text-center font-bold"
				bind:value={dateString}
				on:change={() => getDays()}
			/>
			<div class="grow" />
			<button
				class="btn btn-outline font-bold btn-sm btn-error"
				on:click={cancelHandler}
				type="button">BATAL</button
			>
			<button class="btn font-bold btn-sm btn-primary ml-2" type="submit">UBAH</button>
			<!-- 
		<button class="btn font-bold btn-sm btn-primary ml-2">
			<a href="./recipe/add">AJUKAN</a></button
		> -->
		</div>
		<div class="overflow-y-scroll max-h-[44rem] w-full mt-2">
			<table class="table w-full table-compact table-zebra">
				<!-- head -->
				<thead class="sticky top-0 text-slate-100 z-50">
					<tr>
						<th>Tanggal</th>
						<!-- <th />
						<th>PAGI</th> -->
						<th />
						<th>SIANG</th>
						<th />
						<th>MALAM</th>
					</tr>
				</thead>
				<tbody>
					<!-- row -->
					{#each menuRecipe as day, d}
						<tr>
							<td class="text-center font-bold">{d + 1}</td>
							{#each menuRecipe[d] as shift, s}
								<td>
									<input
										type="checkbox"
										class="checkbox bg-slate-100"
										disabled={true}
										bind:checked={listMonth[d][s + 1]}
										name="checked-{String(d)}-{String(s + 1)}"
									/>
								</td>
								<td>
									<div class="flex flex-col gap-1">
										{#each menuRecipe[d][s] as _, r}
											<select
												class="select w-full select-sm select-bordered max-w-xs text-xs text-slate-300"
												name="recipes-{String(d)}-{String(s)}"
												value={menuRecipe[d][s][r] ? menuRecipe[d][s][r] : 'RESEP ' + String(r + 1)}
												disabled={listMonth[d][s + 1]}
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
