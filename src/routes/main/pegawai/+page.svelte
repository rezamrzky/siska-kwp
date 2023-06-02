<script lang="ts">
	import { goto } from '$app/navigation';
	import { formatDate } from '$lib/Functions';
	import type { PageData } from './$types';

	export let data: PageData;
	$: ({ staffs } = data);

	const sortSymbol = ['\u{2193}', '\u{2191}', '\u{2195}'];

	let headSymbol = {'name': sortSymbol[0], 'join_date':sortSymbol[2]}
	let sortBy = { col: 'name', ascending: true };

	$: sort = (column: string) => {
		if (sortBy.col == column) {
			sortBy.ascending = !sortBy.ascending;
			if(sortBy.ascending){
				headSymbol[column as keyof typeof headSymbol] = sortSymbol[0];
			} else {
				headSymbol[column as keyof typeof headSymbol] = sortSymbol[1];
			}
		} else {
			const prevCol = sortBy.col;
			sortBy.col = column;
			sortBy.ascending = true;
			headSymbol[column as keyof typeof headSymbol] = sortSymbol[0];
			headSymbol[prevCol as keyof typeof headSymbol] = sortSymbol[2]
		}

		// Modifier to sorting function for ascending or descending
		let sortModifier = sortBy.ascending ? 1 : -1;

		let sort = (a: any, b: any) =>
			a[column] < b[column] ? -1 * sortModifier : a[column] > b[column] ? 1 * sortModifier : 0;

		staffs = staffs.sort(sort);
	};

	let searchedName = '';

	let isFilter = false;
	let filterBy = '';

	let tabs = ['tab-active', '', '', '', ''];
	let tabsColor = [
		'text-primary font-bold',
		'text-slate-700',
		'text-slate-700',
		'text-slate-700',
		'text-slate-700'
	];

	// function isTableEmpty(table: HTMLTableElement): boolean {
	// 	if(table.rows.length){
	// 		return false
	// 	}else{
	// 		return true
	// 	}
	// }

	function tabsHandle(index: number) {
		const activeId = tabs.findIndex((x) => x === 'tab-active');
		if (index !== activeId) {
			tabs[index] = 'tab-active';
			tabs[activeId] = '';

			tabsColor[index] = 'text-primary font-bold';
			tabsColor[activeId] = 'text-slate-700';

			switch (index) {
				case 1: {
					isFilter = true;
					filterBy = 'Manajer';
					break;
				}
				case 2: {
					isFilter = true;
					filterBy = 'Food & Drink';
					break;
				}
				case 3: {
					isFilter = true;
					filterBy = 'Dining Room';
					break;
				}
				case 4: {
					isFilter = true;
					filterBy = 'Ekonomi PWP';
					break;
				}
				default: {
					isFilter = false;
					filterBy = '';
					break;
				}
			}
		}
	}

	function handleDetail(id: string) {
		goto('./pegawai/' + id + '/profile');
	}

	function handleAdd() {
		goto('./pegawai/add');
	}
</script>

<main class="mx-auto h-screen flex flex-col bg-slate-100 p-5">
	<div class="font-['Helvetica Neue] text-2xl text-primary font-black py-3 flex">
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
					d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z"
				/>
			</svg>PEGAWAI KOPERASI WANITA PATRA
		</h1>
		<div class="grow" />
		<button class="btn font-bold btn-sm btn-primary" on:click={handleAdd}> + Tambah</button>
	</div>
	<div class="flex mb-3 ml-3">
		<div class="tabs">
			<a class="tab tab-bordered {tabs[0]} {tabsColor[0]}" on:click={() => tabsHandle(0)}>Semua</a>
			<a class="tab tab-bordered {tabs[1]} {tabsColor[1]}" on:click={() => tabsHandle(1)}>Manajer</a
			>
			<a class="tab tab-bordered {tabs[2]} {tabsColor[2]}" on:click={() => tabsHandle(2)}
				>Food & Drink</a
			>
			<a class="tab tab-bordered {tabs[3]} {tabsColor[3]}" on:click={() => tabsHandle(3)}
				>Dining Room</a
			>
			<a class="tab tab-bordered {tabs[4]} {tabsColor[4]}" on:click={() => tabsHandle(4)}
				>Ekonomi PWP</a
			>
		</div>
		<div class="grow" />
		<input
			bind:value={searchedName}
			type="text"
			placeholder="Cari Nama Pegawai"
			class="input input-bordered input-primary w-full max-w-xs input-sm bg-slate-50 text-slate-700"
		/>
	</div>
	<div class="overflow-x-auto w-full">
		<table class="table table-compact w-full table-zebra" id="tableStaff">
			<!-- head -->
			<thead class="sticky top-0 text-slate-100">
				<tr>
					<th on:click={() => sort('name')}>Nama {headSymbol.name}</th>
					<th class="text-center">Bagian</th>
					<th class="text-center" on:click={() => sort('join_date')}
						>Tanggal Bergabung {headSymbol.join_date}</th
					>
					<th class="text-center">Telefon</th>
					<th />
				</tr>
			</thead>
			<tbody>
				<!-- row -->
				<!-- {#each Array(10) as _, i} -->
				{#each staffs as staff}
					{#if staff.name.toLowerCase().includes(searchedName.toLowerCase())}
						{#if isFilter === true && filterBy === staff.department}
							<tr>
								<td class="font-bold">
									{staff.name}
								</td>
								<td class="text-center">
									<div class="font-bold">{staff.department}</div>
									<span class="badge badge-sm badge-primary">{staff.position}</span>
								</td>
								<td class="text-center">
									{formatDate(staff.join_date)}
								</td>
								<td class="text-center">
									{staff.phone_numb}
								</td>
								<td class="text-right">
									<button class="btn btn-ghost btn-xs" on:click={() => handleDetail(staff.id)}>
										detail
									</button>
								</td>
							</tr>
						{:else if isFilter === false && filterBy === ''}
							<tr>
								<td class="font-bold">
									{staff.name}
								</td>
								<td class="text-center">
									<div class="font-bold">{staff.department}</div>
									<span class="badge badge-sm badge-primary">{staff.position}</span>
								</td>
								<td class="text-center">
									{formatDate(staff.join_date)}
								</td>
								<td class="text-center">
									{staff.phone_numb}
								</td>
								<td class="text-right">
									<button class="btn btn-ghost btn-outline btn-xs gap-2" on:click={() => handleDetail(staff.id)}>
										detail 
										<svg
											xmlns="http://www.w3.org/2000/svg"
											fill='grey'
											viewBox="0 0 512 512"
											stroke-width="1.5"
											stroke="currentColor"
											class="w-4 h-4"
											><!--! Font Awesome Pro 6.4.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path
												d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM216 336h24V272H216c-13.3 0-24-10.7-24-24s10.7-24 24-24h48c13.3 0 24 10.7 24 24v88h8c13.3 0 24 10.7 24 24s-10.7 24-24 24H216c-13.3 0-24-10.7-24-24s10.7-24 24-24zm40-208a32 32 0 1 1 0 64 32 32 0 1 1 0-64z"
											/></svg
										>
									</button>
								</td>
							</tr>
						{/if}
					{/if}

					<!-- {#if isTableEmpty(mytable)}
						<tr><td class="col-span-5">Table Kosong</td> </tr>
					{/if} -->
				{/each}
				<!-- {/each} -->
			</tbody>
		</table>
	</div>
</main>
