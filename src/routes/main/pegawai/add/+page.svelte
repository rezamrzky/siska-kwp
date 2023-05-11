<script lang="ts">
	import { goto } from '$app/navigation';
	import { setDialogue } from '$lib/Dialogue.svelte';
	import { dialogueOpen, dialogueValue } from '$lib/dialogueStore';
	import { showMessage } from '$lib/Message.svelte';

	export let data;
	export let form;

	let errorMessage = {
		show: false,
		message: ''
	};
	let formValue = ['', '', '', '', '', '', '', '', '', '', '', '', '', ''];

	function submitHandler() {
		errorMessage.show = false;

		var emptyMessage = '';

		for (var i = 0; i < formValue.length; i++) {
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
			errorMessage.show = true;
			errorMessage.message = 'Terdapat form yang belum diisi pada nomor ' + emptyMessage;
		} else {
			setDialogue('Tambah Pegawai', 'Apakah Anda Yakin menambahkan data pegawai baru?');
			dialogueOpen.set(true);
			let timeIn = setInterval(() => {
				if (!$dialogueOpen) {
					clearInterval(timeIn);
					switch ($dialogueValue) {
						case true: {
							//goto('../pegawai');
							showMessage('Data Pegawai Berhasil Ditambahkan!');
							break;
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
		setDialogue('Batal Tambah Pegawai?', 'Data yang dimasukkan tidak akan disimpan');
		dialogueOpen.set(true);
		let timeIn = setInterval(() => {
			if (!$dialogueOpen) {
				clearInterval(timeIn);
				switch ($dialogueValue) {
					case true: {
						goto('../pegawai');
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
	<section class="place-content-center w-full h-screen drop-shadow-2xl p-5 text-slate-700">
		<div class="w-full h-full bg-slate-100 rounded p-5">
			<h2 class="font-['Helvetica Neue'] font-black text-2xl text-primary">TAMBAH PEGAWAI</h2>
			<p>Silahkan mengisi informasi pegawai melalui form dibawah:</p>
			<!-- <form class="h-[42rem] py-2" on:submit|preventDefault={submitHandler} method="POST"> -->
			<form class="h-[42rem] py-2" method="POST">
				<div class="h-[36rem] overflow-y-scroll">
					<label class="label font-bold w-fit" for="fnama"
						>1.Nama<span class="text-red-500">*</span>
					</label>
					<input
						class="input input-bordered w-full bg-slate-100"
						type="text"
						name="name"
						bind:value={formValue[0]}
					/>

					<label class="label font-bold w-fit" for="fbagian"
						>2.Bagian<span class="text-red-500">*</span></label
					>
					<select
						class="input input-bordered w-full bg-slate-100"
						name="department"
						bind:value={formValue[1]}
					>
						<option disabled selected>Asal Bagian?</option>
						<option>Manajer</option>
						<option>Dining Room</option>
						<option>Food & Drink</option>
						<option>Ekonomi PWP</option>
					</select>
					<label class="label font-bold w-fit" for="fnama"
						>3.Jabatan<span class="text-red-500">*</span></label
					>
					<input
						class="input input-bordered w-full bg-slate-100"
						type="text"
						name="position"
						bind:value={formValue[2]}
					/>
					<label class="label font-bold w-fit" for="ftglkerja"
						>4.Tanggal Bergabung<span class="text-red-500">*</span></label
					>
					<input
						class="input input-bordered w-full bg-slate-100"
						type="date"
						name="join_date"
						bind:value={formValue[3]}
					/>
					<label class="label font-bold w-fit" for="falamat"
						>5.Alamat<span class="text-red-500">*</span></label
					>
					<input
						class="input input-bordered w-full bg-slate-100"
						type="text"
						name="address"
						bind:value={formValue[4]}
					/>
					<label class="label font-bold w-fit" for="fphone"
						>6.Nomor Telepon<span class="text-red-500">*</span></label
					>
					<input
						class="input input-bordered w-full bg-slate-100"
						type="text"
						name="phone_numb"
						bind:value={formValue[5]}
					/>
					<label class="label font-bold w-fit" for="femail"
						>7.E-mail<span class="text-red-500">*</span></label
					>
					<input
						class="input input-bordered w-full bg-slate-100"
						type="email"
						name="email"
						bind:value={formValue[6]}
					/>
					<label class="label font-bold w-fit" for="fbirthplace"
						>8.Tempat Lahir<span class="text-red-500">*</span></label
					>
					<input
						class="input input-bordered w-full bg-slate-100"
						type="text"
						name="birth_place"
						bind:value={formValue[7]}
					/>
					<label class="label font-bold w-fit" for="fbirthdate"
						>9.Tanggal Lahir<span class="text-red-500">*</span></label
					>
					<input
						class="input input-bordered w-full bg-slate-100"
						type="date"
						name="birth_date"
						bind:value={formValue[8]}
					/>
					<label class="label font-bold w-fit" for="fstatus"
						>10.Status<span class="text-red-500">*</span></label
					>
					<select
						class="input input-bordered w-full bg-slate-100"
						name="is_married"
						bind:value={formValue[9]}
					>
						<option disabled selected>Status Pernikahan?</option>
						<option>Menikah</option>
						<option>Tidak Menikah</option>
					</select>
					<label class="label font-bold w-fit" for="fanak"
						>11.Anak<span class="text-red-500">*</span></label
					>
					<select
						class="input input-bordered w-full bg-slate-100"
						name="have_children"
						bind:value={formValue[10]}
					>
						<option disabled selected>Jumlah Anak?</option>
						<option>0</option>
						<option>1</option>
						<option>2</option>
						<option>3 atau lebih</option>
					</select>
					<label class="label font-bold w-fit" for="fbpjs"
						>12.Nomor BPJS<span class="text-red-500">*</span></label
					>
					<input
						class="input input-bordered w-full bg-slate-100"
						type="text"
						name="bpjs_id"
						bind:value={formValue[11]}
					/>
					<label class="label font-bold w-fit" for="fnpwp"
						>13.NPWP<span class="text-red-500">*</span></label
					>
					<input
						class="input input-bordered w-full bg-slate-100"
						type="text"
						name="npwp"
						bind:value={formValue[12]}
					/>
					<label class="label font-bold w-fit" for="fsalary"
						>14.Gaji<span class="text-red-500">*</span></label
					>
					<input
						class="input input-bordered w-full bg-slate-100"
						type="text"
						name="salary"
						bind:value={formValue[13]}
					/>
				</div>

				<div class="flex pt-2">
					{#if errorMessage.show}
						<div class="justify-start text-red-500 italic text-sm">{errorMessage.message}</div>
					{/if}
					<div class="flex-grow" />
					<div class="card-actions justify-end px-3 py-2">
						<button class="btn" on:click|preventDefault={cancelHandler}>Batal </button>
						<button class="btn btn-primary">Tambah </button>
					</div>
				</div>
			</form>
		</div>
	</section>
</main>
