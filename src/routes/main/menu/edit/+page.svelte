<script lang="ts">
	import { setDialogue } from '$lib/Dialogue.svelte';
	import { dialogueOpen, dialogueValue } from '$lib/dialogueStore';
	import { showMessage } from '$lib/Message.svelte';
	import { goto } from '$app/navigation';

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

	function submitHandler() {
		errorMessage.show = false;

		// if (listOut.length < 1) {
		// 	errorMessage.show = true;
		// 	errorMessage.message = 'Anda belum memilih bahan baku!';
		// } else {
			setDialogue('Edit Menu?', 'Apakah Anda Yakin mengubah menu?');
			dialogueOpen.set(true);
			let timeIn = setInterval(() => {
				if (!$dialogueOpen) {
					clearInterval(timeIn);
					switch ($dialogueValue) {
						case true: {
							goto('../menu');
							showMessage('Menu Berhasil Diubah!');
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
		setDialogue('Batal Edit Menu?', 'Data yang dimasukkan tidak akan disimpan');
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
		<h1>EDIT MENU DINING ROOM</h1>
	</div>
	<div class="mt-2 flex w-full">
		<input
			type="month"
			class="input input-bordered input-sm input-primary ml-2 bg-slate-100 text-slate-700"
			bind:value={choosenMonth}
			on:change={() => getDays()}
		/>
		<div class="grow" />
		<button class="btn btn-outline font-bold btn-sm btn-error" on:click={cancelHandler}>BATAL</button
		>
		<button class="btn font-bold btn-sm btn-primary ml-2" on:click={submitHandler}>UBAH</button>
		<!-- 
		<button class="btn font-bold btn-sm btn-primary ml-2">
			<a href="./recipe/add">AJUKAN</a></button
		> -->
	</div>
	<div class="overflow-x-auto w-full mt-2">
		<table class="table w-full table-compact table-zebra">
			<!-- head -->
			<thead  class="sticky top-0 text-slate-100">
				<tr>
					<th>Tanggal</th>
					<th>PAGI</th>
					<th>SIANG</th>
					<th>MALAM</th>
				</tr>
			</thead>
			<tbody>
				<!-- row -->
				{#if showList}
					{#each arrayDaysMenu as day, i}
						<tr>
							<td>{i + 1}-{parseInt(dateArr[1])}-{parseInt(dateArr[0])}</td>
							<td>
								<div class="flex flex-col gap-1">
									<select class="select w-full select-sm select-bordered max-w-xs text-xs">
										<option disabled selected>RESEP 1</option>
										<option>Homer</option>
									</select>
									<select class="select w-full select-sm select-bordered max-w-xs text-xs">
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
									</select>
								</div>
							</td>
							<td>
								<div class="flex flex-col gap-1">
									<select class="select w-full select-sm select-bordered max-w-xs text-xs">
										<option disabled selected>RESEP 1</option>
										<option>Homer</option>
									</select>
									<select class="select w-full select-sm select-bordered max-w-xs text-xs">
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
									</select>
								</div>
							</td>
							<td>
								<div class="flex flex-col gap-1">
									<select class="select w-full select-sm select-bordered max-w-xs text-xs">
										<option disabled selected>RESEP 1</option>
										<option>Homer</option>
									</select>
									<select class="select w-full select-sm select-bordered max-w-xs text-xs">
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
									</select>
								</div>
							</td>
						</tr>
					{/each}
				{/if}
			</tbody>
		</table>
	</div>
</main>
