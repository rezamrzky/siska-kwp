<script lang="ts">
	import { setDialogue } from '$lib/Dialogue.svelte';
	import { dialogueOpen, dialogueValue, navigationBlocked } from '$lib/dialogueStore';
	import { showMessage } from '$lib/Message.svelte';
	import { goto } from '$app/navigation';
	import type { PageData } from './$types';
	import { number3DigitFormat } from '$lib/Functions';
	import { enhance, type SubmitFunction } from '$app/forms';

	export let data: PageData;
	$: ({ ingredients } = data);
	$: ({recipe} = data)

	navigationBlocked.set(true)

	let listOut: Array<number> = [];
	let valueArray = new Array<string>(data.ingredients.length);

	data.ingredients.forEach((e:any, i:any) => {
		if(e.dr_recipe_ingredients[0]){
			valueArray[i] = e.dr_recipe_ingredients[0].quantity
		}
	});

	var name = data.recipe.name,
		portion = data.recipe.portion;

	let errorMessage = {
		show: false,
		message: ''
	};

	const submitHandler: SubmitFunction = ({ cancel }) => {
		errorMessage.show = false;

		if (listOut.length < 1 || name === '' || portion === '') {
			errorMessage.show = true;
			errorMessage.message = 'Terdapat form yang belum diisi!';
			cancel();
		}

		return async ({ result }) => {
			if (result.type === 'success') {
				goto('./detail');
				showMessage('Resep Berhasil Diubah!');
				navigationBlocked.set(false)
			}
		};
		// else {
		// 	setDialogue('Tambah Resep?', 'Apakah Anda Yakin menambahkan resep?');
		// 	dialogueOpen.set(true);
		// 	let timeIn = setInterval(() => {
		// 		if (!$dialogueOpen) {
		// 			clearInterval(timeIn);
		// 			switch ($dialogueValue) {
		// 				case true: {
		// 					goto('../recipe');
		// 					showMessage('Resep Berhasil Ditambahkan!');
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
		setDialogue('Batal Edit Resep?', 'Data yang dimasukkan tidak akan disimpan');
		dialogueOpen.set(true);
		let timeIn = setInterval(() => {
			if (!$dialogueOpen) {
				clearInterval(timeIn);
				switch ($dialogueValue) {
					case true: {
						goto('./detail');
						navigationBlocked.set(false)
					}
					case false: {
						console.log('dialog batal cancel');
					}
				}
			}
		}, 200);
	}

	function onUsed(index: number) {
		// console.log('dumbArray', dumbArray[index]);
		if (valueArray[index] !== '') {
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
	<form method="POST" action="?/edit" use:enhance={submitHandler}>
		<div class="font-['Helvetica Neue] w-full ml-2 text-slate-700">
			<h1 class="font-black text-2xl text-primary">EDIT RESEP</h1>
			<p class="text-slate-700">Silahkan mengisi formulir dibawah:</p>
			<div class="bg-blue-200 p-3 rounded flex gap-2">
				<div class="grow">
					<label class="label font-bold" for="fingredients">Nama Resep</label>
					<input
						class="input input-bordered w-full bg-slate-100 file-input-md"
						type="text"
						id="frecipes"
						bind:value={name}
						name="name"
					/>
				</div>
				<div class="grow">
					<label class="label font-bold" for="funit">Jumlah Porsi</label>
					<input
						class="input input-bordered w-full bg-slate-100"
						type="text"
						id="fportions"
						bind:value={portion}
						name="portion"
					/>
				</div>
			</div>
			<p class="text-slate-700 mt-2 font-bold">Silahkan memilih bahan baku dan jumlahnya:</p>
		</div>
		<div class="w-full mt-2 overflow-y-scroll max-h-[27rem]">
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
				<tbody class="text-slate-200">
					<!-- row -->
					{#each ingredients as ingredient, i}
						<tr>
							<!-- <th>
								<label>
									<input type="checkbox" class="checkbox" />
								</label>
							</th> -->
							<td class="text-center"> {number3DigitFormat(ingredient.id)} </td>
							<td class="text-center"> {ingredient.name} </td>
							<td class="text-right">
								<input
									class="input input-bordered w-fit bg-slate-100 text-right input-xs text-slate-700 text-bold"
									type="text"
									id="famount"
									on:change={() => onUsed(i)}
									bind:value={valueArray[i]}
									name='quantity'
								/>
							</td>
							<td class="text-left">{ingredient.unit}</td>
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
			<button class="btn btn-primary" type="submit">EDIT </button>
		</div>
	</form>
</main>
