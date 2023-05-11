<script lang="ts">
	import { goto } from '$app/navigation';
	import { dPegawai, updateDPegawai, addDPegawai, dropDPegawai } from '$lib/dPegawai';
	// export let iPegawai: any;
	// export let idPegawai: number;
	// export function updateIPegawai(nama: string, bagian: string, id: number) {
	// 	updateNPegawai(nama, bagian, id);
	// }
	// export function addIPegawai(nama: string, bagian: string) {
	// 	addNPegawai(nama, bagian);
	// }

	function handleEdit() {
		// iPegawai = nPegawai[i];
		// idPegawai = i;
		goto('./pegawai/profile');
	}

	function handleAdd() {
		goto('./pegawai/add');
	}

	// export function dropIPegawai (i: number){
	//     dropNPegawai(i)
	// }
</script>

<main class="mx-auto h-screen flex flex-col bg-slate-100 p-5">
	<div class="font-['Helvetica Neue] text-2xl text-primary font-black p-5">
		<h1>PEGAWAI KOPERASI WANITA PATRA</h1>
	</div>
	<div class="overflow-x-auto w-full">
		<table class="table table-compact w-full table-zebra">
			<!-- head -->
			<thead class="sticky top-0 text-slate-100">
				<tr>
					<th>Nama </th>
					<th class="text-center">Bagian</th>
					<th class="text-center">Tanggal Bergabung</th>
					<th class="text-center">Telefon</th>
					<th class="text-right">
						<button class="btn btn-outline font-bold btn-xs" on:click={handleAdd}> + Tambah</button>
					</th>
				</tr>
			</thead>
			<tbody>
				<!-- row -->
				{#each Array(10) as _}
					{#each dPegawai as { nama, bagian }, i}
						<tr>
							<td class="font-bold">
								{nama}
							</td>
							<td class="text-center">
								<div class="font-bold">{bagian}</div>
								<span class="badge badge-ghost badge-sm">Jabatan</span>
							</td>
							<td class="text-center">
								99/99/9999
							</td>
							<td class="text-center">
								08123456789
							</td>
							<td class="text-right">
								<button class="btn btn-ghost btn-xs" on:click={handleEdit}> details </button>
							</td>
						</tr>
					{/each}
				{/each}
			</tbody>
		</table>
	</div>
</main>
