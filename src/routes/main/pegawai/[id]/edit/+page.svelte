<script lang="ts">
	import { goto } from '$app/navigation';
	import { setDialogue } from '$lib/Dialogue.svelte';
	import { dialogueOpen, dialogueValue, navigationBlocked} from '$lib/dialogueStore';
	import { showMessage } from '$lib/Message.svelte';
	import type { PageData, SubmitFunction } from './$types';
	import { formatDateYMD } from '$lib/Functions';
	import { enhance } from '$app/forms';

	export let data: PageData;
	// $: ({ staff: data });

	const today = new Date();
	navigationBlocked.set(true);

	let errorMessage = {
		show: false,
		message: ''
	};

	let marriedStatus = '';
	switch (data.staff.is_married) {
		case true: {
			marriedStatus = 'Menikah';
			break;
		}
		case false: {
			marriedStatus = 'Tidak Menikah';
			break;
		}
	}

	let children = '';
	switch (data.staff.have_children) {
		case 0: {
			children = data.staff.have_children.toString();
			break;
		}
		case 1: {
			children = data.staff.have_children.toString();
			break;
		}
		case 2: {
			children = data.staff.have_children.toString();
			break;
		}
		case 3: {
			children = '3 atau lebih';
			break;
		}
	}

	// console.log('joinDate: '+formatDateYMD(data.staff.join_date))
	let joinDate = formatDateYMD(data.staff.join_date);
	let birthDate = formatDateYMD(data.staff.birth_date);

	let formValue = [
		data.staff.name,
		data.staff.department,
		data.staff.position,
		joinDate,
		data.staff.address,
		data.staff.phone_numb,
		data.staff.email,
		data.staff.birth_place,
		birthDate,
		marriedStatus,
		children,
		data.staff.bpjs_id,
		data.staff.npwp,
		data.staff.salary
	];

	const submitHandler: SubmitFunction = ({ cancel }) => {
		setDialogue('Edit Pegawai', 'Apakah Anda Yakin mengubah data pegawai?');
		dialogueOpen.set(true);

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
				cancel();
				errorMessage.show = true;
				errorMessage.message = 'Terdapat form yang kosong pada nomor ' + emptyMessage;
			}
		// }
		return async ({ result }) => {
			if (
				result.type == 'success'
				// result.status == 201
			) {
				console.log('Actions Success');
				console.log(result.status.toString);
				goto('../' + data.staff.id + '/profile');
				showMessage('Data Pegawai Berhasil Ditambahkan!');
			}

			if (result.type == 'failure') {
				errorMessage.show = true;
				errorMessage.message = result.data?.message!;
			}
		};
	};

	function cancelHandler() {
		setDialogue('Batal Edit Data Pegawai?', 'Data yang dimasukkan tidak akan disimpan');
		dialogueOpen.set(true);
		let timeIn = setInterval(() => {
			if (!$dialogueOpen) {
				clearInterval(timeIn);
				switch ($dialogueValue) {
					case true: {
						goto('../' + data.staff.id + '/profile');
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

<main>
	<section class="place-content-center w-full h-screen drop-shadow-2xl rounded p-5 text-slate-700">
		<div class="w-full h-full bg-slate-100 rounded p-5">
			<h2 class="font-['Helvetica Neue'] font-black text-2xl text-primary">EDIT PROFIL KARYAWAN</h2>
			<p>Silahkan mengubah informasi pegawai melalui form dibawah:</p>
			<form class="h-[42rem] py-2" method="POST" use:enhance={submitHandler} action="?/editStaff">
				<div class="h-[36rem] overflow-y-scroll">
					<label class="label font-bold w-fit" for="fnama"
						>1.Nama<span class="text-red-500">*</span>
					</label>
					<input
						class="input input-bordered w-full bg-slate-100 capitalize"
						type="text"
						name="name"
						bind:value={formValue[0]}
					/>
					<div class="flex gap-2">
						<div class="w-full">
							<label class="label font-bold w-fit" for="fbagian"
								>2.Bagian<span class="text-red-500">*</span></label
							>
							<select
								class="input input-bordered w-full bg-slate-100"
								name="department"
								bind:value={formValue[1]}
							>
								<option disabled>Bagian?</option>
								<option>Manajer</option>
								<option>Dining Room</option>
								<option>Food & Drink</option>
								<option>Ekonomi PWP</option>
							</select>
						</div>
						<div class="w-full">
							<label class="label font-bold w-fit" for="fnama"
								>3.Jabatan<span class="text-red-500">*</span></label
							>
							<select
								class="input input-bordered w-full bg-slate-100"
								name="position"
								bind:value={formValue[2]}
							>
								<option disabled>Jabatan?</option>
								<option>Ketua</option>
								<option>Wakil</option>
								<option>Anggota</option>
							</select>
						</div>
					</div>
					<label class="label font-bold w-fit" for="ftglkerja"
						>4.Tanggal Bergabung<span class="text-red-500">*</span></label
					>
					<input
						class="input input-bordered w-full bg-slate-100"
						type="date"
						name="join_date"
						max={formatDateYMD(today)}
						min="2000-01-01"
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
					<div class="flex gap-2">
						<div class="w-full">
							<label class="label font-bold w-fit" for="fphone"
								>6.Nomor Telepon<span class="text-red-500">*</span></label
							>
							<input
								class="input input-bordered w-full bg-slate-100"
								type="phone"
								name="phone_numb"
								maxlength="12"
								minlength="11"
								bind:value={formValue[5]}
							/>
						</div>
						<div class="w-full">
							<label class="label font-bold w-fit" for="femail"
								>7.E-mail<span class="text-red-500">*</span></label
							>
							<input
								class="input input-bordered w-full bg-slate-100"
								type="email"
								name="email"
								bind:value={formValue[6]}
							/>
						</div>
					</div>
					<div class="flex gap-2">
						<div class="w-full">
							<label class="label font-bold w-fit" for="fbirthplace"
								>8.Tempat Lahir<span class="text-red-500">*</span></label
							>
							<input
								class="input input-bordered w-full bg-slate-100"
								type="text"
								name="birth_place"
								bind:value={formValue[7]}
							/>
						</div>
						<div class="w-full">
							<label class="label font-bold w-fit" for="fbirthdate"
								>9.Tanggal Lahir<span class="text-red-500">*</span></label
							>
							<input
								class="input input-bordered w-full bg-slate-100"
								type="date"
								name="birth_date"
								max={formatDateYMD(today)}
								min="1960-01-01"
								bind:value={formValue[8]}
							/>
						</div>
					</div>

					<div class="flex gap-2">
						<div class="w-full">
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
						</div>
						<div class="w-full">
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
						</div>
					</div>

					<div class="flex gap-2">
						<div class="w-full">
							<label class="label font-bold w-fit" for="fbpjs"
								>12.Nomor BPJS<span class="text-red-500">*</span></label
							>
							<input
								class="input input-bordered w-full bg-slate-100"
								type="text"
								name="bpjs_id"
								maxlength="11"
								minlength="11"
								bind:value={formValue[11]}
							/>
						</div>
						<div class="w-full">
							<label class="label font-bold w-fit" for="fnpwp"
								>13.NPWP<span class="text-red-500">*</span></label
							>
							<input
								class="input input-bordered w-full bg-slate-100"
								type="text"
								name="npwp"
								maxlength="16"
								minlength="16"
								bind:value={formValue[12]}
							/>
						</div>
					</div>

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
						<button class="btn btn-primary" type="submit">Edit </button>
					</div>
				</div>
			</form>
		</div>
	</section>
</main>
