<script lang="ts">
	import { userId } from '$lib/dPegawai';
	import { dialogueOpen, dialogueValue, navigationBlocked } from '$lib/dialogueStore';
	import { setDialogue } from '$lib/Dialogue.svelte';
	import { goto, invalidateAll } from '$app/navigation';
	import type { PageData, SubmitFunction } from './$types';
	import { number3DigitFormat } from '$lib/Functions';
	import { enhance } from '$app/forms';
	import { showMessage } from '$lib/Message.svelte';

	export let data: PageData;

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

	let userDepartment = data.user.staff.department,
		persetujuan = true,
		persetujuanState = 'Setujui';

	$: allchecked = false;

	$: disabled = persetujuan;

	let filteredMenu = data.menus[0];
	let datePointer = new Date(data.period.firstYear, data.period.firstMonth);
	let filteredDate = new Date(filteredMenu.date);
	let pointerString = String(monthString[datePointer.getMonth()])+' '+String(datePointer.getFullYear())
	// console.log(filteredMenu)
	let listMonth: boolean[][] = new Array<boolean[]>(filteredDate.getDate());

	let menuRecipe: string[][][] = new Array<string[][]>(filteredDate.getDate());
	let menuShifts = filteredMenu.dr_menu_shift;

	dateFiltered();
	// test();


	function test(){
	for (let d = 0; d < filteredDate.getDate(); d++) {
		menuRecipe[d] = new Array<string[]>(2);
		listMonth[d] = new Array<boolean>(4);
		for (let s = 0; s < 2; s++) {
			const menuShift = menuShifts.find(
				(shift: any) => shift.day === d + 1 && shift.shift_cat === s + 1
			);
			menuRecipe[d][s] = new Array<string>(5);
				listMonth[d][s+1] = menuShift.is_approved;
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
}

	const lastDate = new Date(data.period.lastYear, data.period.lastMonth);
	const firstDate = new Date(data.period.firstYear, data.period.firstMonth);

	function dateFiltered() {
		let prevReport;
		// filteredBillsActive = billsActive;
		const menus = data.menus
		filteredMenu = menus.find((report: any) => {
			const date = new Date(report.date);
			// console.log('bill month: '+date.getMonth())
			// console.log(date.getMonth() === datePointer.getMonth())

			return (
				date.getMonth() === datePointer.getMonth() &&
				date.getFullYear() === datePointer.getFullYear()
			);
		});

		console.log(filteredMenu)

		filteredDate = new Date(filteredMenu.date);
		pointerString = String(monthString[datePointer.getMonth()])+' '+String(datePointer.getFullYear())

		menuRecipe = new Array<string[][]>(filteredDate.getDate());
		menuShifts = filteredMenu.dr_menu_shift;
		test()

	// 	for (let d = 0; d < filteredDate.getDate(); d++) {
	// 	menuRecipe[d] = new Array<string[]>(2);
	// 	listMonth[d] = new Array<boolean>(4);
	// 	for (let s = 0; s < 2; s++) {
	// 		const menuShift = menuShifts.find(
	// 			(shift: any) => shift.day === d + 1 && shift.shift_cat === s + 1
	// 		);
	// 		menuRecipe[d][s] = new Array<string>(5);
	// 			listMonth[d][s+1] = menuShift.is_approved;
	// 		if (menuShift.dr_menu_shift_recipes.length > 0) {
	// 			for (let r = 0; r < 5; r++) {
	// 				const recipeId = menuShift.dr_menu_shift_recipes.find(
	// 					(recipe: any) => recipe.index === r
	// 				);
	// 				if (recipeId) {
	// 					const recipe = data.recipes.find((recipe: any) => recipe.id === recipeId.recipe_id);
	// 					menuRecipe[d][s][r] = recipe.name + '-' + String(number3DigitFormat(recipe.id));
	// 					console.log(menuRecipe[d][s][r]);
	// 				}
	// 			}
	// 		}
	// 	}
	// }
		
	}

	function prevDatePointer() {
		let tempDate;
		if (datePointer.getMonth() - 1 > 0) {
			tempDate = new Date(datePointer.getFullYear(), datePointer.getMonth() - 1);
		} else {
			tempDate = new Date(datePointer.getFullYear() - 1, 11);
		}

		// console.log('tempDate: '+tempDate)

		// if(tempDate.getTime() < datePointer.getTime() && tempDate.getTime() >= lastDate.getTime()){
		datePointer = tempDate;
		dateFiltered();
		// }
	}

	function nextDatePointer() {
		let tempDate;
		if (datePointer.getMonth() + 1 < 12) {
			tempDate = new Date(datePointer.getFullYear(), datePointer.getMonth() + 1);
		} else {
			tempDate = new Date(datePointer.getFullYear() + 1, 0);
		}

		// console.log('tempDate: '+tempDate)

		// if(tempDate.getTime() < datePointer.getTime() && tempDate.getTime() >= lastDate.getTime()){
		datePointer = tempDate;
		dateFiltered();
		// }
	}

	function persetujuanHandler() {
		if (persetujuanState == 'Setujui') {
			persetujuan = false;
			persetujuanState = 'Batal';
			navigationBlocked.set(true);
		} else if (persetujuanState == 'Batal') {
			setDialogue('Batal Persetujuan Menu?', 'Data yang telah dimasukkan tidak akan disimpan.');
			dialogueOpen.set(true);

			const timeIn = setInterval(() => {
				if (!$dialogueOpen) {
					clearInterval(timeIn);
					switch ($dialogueValue) {
						case true: {
							persetujuanState = 'Setujui';
							persetujuan = true;
							window.location.reload();
							navigationBlocked.set(false);
						}
						case false: {
							console.log('dialog batal cancel');
						}
					}
				}
			}, 250);
		}
	}

	const submitHandler: SubmitFunction = ({ cancel }) => {
		return async ({ result }) => {
			if (result.type === 'success') {
				showMessage('Berhasil Menyetujui Menu');
				persetujuanState = 'Setujui';
				persetujuan = true;
				window.location.reload();
				navigationBlocked.set(false);
			}
		};
	};

	function setRow(index: number) {
		listMonth[index][1] = listMonth[index][0];
		listMonth[index][2] = listMonth[index][0];
		listMonth[index][3] = listMonth[index][0];
	}

	function setAll() {
		for (var i = listMonth.length; i >= 0; i--) {
			listMonth[i - 1][0] = allchecked;
			setRow(i - 1);
		}
	}
</script>

<main class="mx-auto h-screen flex flex-col bg-slate-100 p-5">
	<div class="font-['Helvetica Neue] w-full text-2xl text-primary font-black ml-2">
		<h1 class="flex gap-2">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				stroke-width="1.5"
				stroke="currentColor"
				class="w-8 h-8 rounded-full bg-primary text-slate-50"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z"
				/>
			</svg>MENU DINING ROOM</h1>
	</div>
	<form method="POST" use:enhance={submitHandler} action="?/approved">
		<div class="mt-2 flex w-full">
			<button
				class="btn btn-outline font-bold btn-sm btn-primary"
				type="button"
				disabled={datePointer.getTime() === lastDate.getTime()}
				on:click={prevDatePointer}
			>
				&#8249;</button
			>
			<input class="btn font-bold ml-2 btn-sm btn-primary disabled:bg-slate-50 disabled:text-primary uppercase text-center border-primary"
				bind:value={pointerString}
				type="text"
				name='rezar'
				readonly
			/>
			<button
				class="btn btn-outline font-bold btn-sm btn-primary ml-2"
				type="button"
				disabled={datePointer.getTime() === firstDate.getTime()}
				on:click={nextDatePointer}
			>
				&#8250;</button
			>

			<div class="grow" />
			{#if userDepartment === 'Dining Room'}
				<button
					class="btn btn-outline font-bold btn-sm btn-primary"
					type="button"
					on:click={() => {
						goto('./menu/'+pointerString+'/edit');
					}}
				>
					EDIT</button
				>
				<button
					class="btn btn-outline font-bold btn-sm btn-primary ml-2"
					type="button"
					on:click={() => {
						goto('./menu/add');
					}}
				>
					+ MENU</button
				>
			{/if}
			{#if userDepartment === 'Manajer'}
				<!-- <button class="btn btn-outline font-bold btn-sm btn-error mr-2">
			<a href="./recipe/add">TOLAK</a></button
		> -->
				<button
					class="btn btn-outline font-bold btn-sm btn-primary mx-2"
					on:click={() => persetujuanHandler()}
					type="button"
				>
					{persetujuanState}</button
				>

				{#if !persetujuan}
					<button class="btn font-bold btn-sm btn-primary" type="submit"> Setujui</button>
				{/if}
			{/if}
		</div>
		<div class="overflow-y-scroll max-h-[42rem] w-full mt-2">
			<table class="table w-full table-compact table-zebra">
				<!-- head -->
				<thead class="sticky top-0 text-slate-100">
					<tr>
						{#if userDepartment === 'Manajer'}
							<th
								><input
									type="checkbox"
									class="checkbox bg-slate-100"
									{disabled}
									bind:checked={allchecked}
									on:change={() => setAll()}
								/></th
							>
						{/if}
						<th class="text-center">Tanggal</th>
						<!-- <th />
						<th>PAGI</th> -->
						<th />
						<th>SORE</th>
						<th />
						<th>MALAM</th>
					</tr>
				</thead>
				<tbody class="text-slate-200">
					<!-- row -->
					{#each menuRecipe as day, d}
						<tr>
							{#if userDepartment === 'Manajer'}
								<td>
									<input
										type="checkbox"
										class="checkbox bg-slate-100"
										{disabled}
										bind:checked={listMonth[d][0]}
										on:change={() => setRow(d)}
									/>
								</td>
							{/if}
							<td class="text-center font-bold">{d + 1}</td>
							{#each menuRecipe[d] as shift, s}
								<td>
									<input
										type="checkbox"
										class="checkbox bg-slate-100"
										{disabled}
										bind:checked={listMonth[d][s + 1]}
										name="checked-{String(d)}-{String(s + 1)}"
									/>
								</td>
								<td>
									{#each menuRecipe[d][s] as _, r}
										<p>{menuRecipe[d][s][r]}</p>
									{/each}
								</td>
							{/each}
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</form>
</main>
