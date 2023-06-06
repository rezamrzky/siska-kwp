<script lang="ts">
	import { goto } from '$app/navigation';
	import { formatDate } from '$lib/Functions';
	import type { PageData } from './$types';

	export let data: PageData;
	let userDepartment = data.user.staff.department;
	$: ({ events } = data);
	$: filteredEvents = events;
	$: shownEvents = events;

	$: finishDateDisabled = true;

	let searchedDate = '',
		finishDate = '',
		self_only = false;

	let tabsStatus = ['tab-active', '', '', ''];
	let activeId = 0;

	const sortSymbol = ['\u{2193}', '\u{2191}', '\u{2195}'];

	let headSymbol = {'id': sortSymbol[1], 'event_date':sortSymbol[2]}
	let sortBy = { col: 'id', ascending: false };

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

		events = events.sort(sort);
	};

	function selfOnlyHandle() {
		if (self_only) {
			filteredEvents =
				searchedDate === ''
					? events.filter((akun: { staff_id: string }) => akun.staff_id === data.user.staff.id)
					: filteredEvents.filter(
							(akun: { staff_id: string }) => akun.staff_id === data.user.staff.id
					  );
		} else {
			// filteredEvents = searchedDate === '' ? filteredEvents = events : searchHandle();
			// if(searchedDate=== ''){
			filteredEvents = events;
			if (searchedDate !== '' && searchedDate !== undefined) {
				searchHandle();
			}
		}
		tabsStatusHandle(activeId);
	}

	function searchHandle() {
		if (finishDateDisabled) {
			if (searchedDate !== '' && searchedDate !== undefined) {
				filteredEvents = self_only
					? filteredEvents.filter(
							(event: { event_date: Date }) =>
								formatDate(event.event_date) === formatDate(searchedDate)
					  )
					: events.filter(
							(event: { event_date: Date }) =>
								formatDate(event.event_date) === formatDate(searchedDate)
					  );
			} else {
				filteredEvents = events;
				
			}
		} else {
			if (
				searchedDate !== '' &&
				finishDate !== '' &&
				searchedDate !== undefined &&
				finishDate !== undefined
			) {
				filteredEvents = self_only
					? filteredEvents.filter((event: { event_date: Date }) => {
							const event_date = new Date(event.event_date);
							const finishDateDate = new Date(finishDate);
							finishDateDate.setHours(23);
							finishDateDate.setMinutes(59);
							finishDateDate.setSeconds(59);
							const searchedDateDate = new Date(searchedDate);

							return event_date >= searchedDateDate && event_date <= finishDateDate;
					  })
					: events.filter((event: { event_date: Date }) => {
							const event_date = new Date(event.event_date);
							const finishDateDate = new Date(finishDate);
							finishDateDate.setHours(23);
							finishDateDate.setMinutes(59);
							finishDateDate.setSeconds(59);
							const searchedDateDate = new Date(searchedDate);

							return event_date >= searchedDateDate && event_date <= finishDateDate;
					  });
			} else {
				filteredEvents = events;
				if (self_only) {
					selfOnlyHandle();
				}
			}
		}
		tabsStatusHandle(activeId);
	}

	function tabsStatusHandle(index: number) {
		if (index !== activeId) {
			tabsStatus[index] = 'tab-active';
			tabsStatus[activeId] = '';
			activeId = index;
		}

		switch (index) {
			case 1: {
				shownEvents = filteredEvents.filter(
					(akun: { status: string }) => akun.status === 'Pemesanan'
				);
				break;
			}
			case 2: {
				shownEvents = filteredEvents.filter(
					(akun: { status: string }) => akun.status === 'Pembayaran'
				);
				break;
			}
			case 3: {
				shownEvents = filteredEvents.filter(
					(akun: { status: string }) => akun.status === 'Selesai'
				);
				break;
			}
			default: {
				shownEvents = filteredEvents;
				break;
			}
		}
	}

	function tambahHandler() {
		goto('./fd-events/add');
	}

	function detailHandler(id: number) {
		goto('./fd-events/'+String(id)+'/detail');
	}

	function statusColor(status: string): string {

		if(data.user.staff.department === 'Food & Drink'){
		switch (status) {
			case 'Pemesanan': {
				return 'text-warning';
			}
			case 'Pembayaran': {
				return 'text-secondary';
			}
			case 'Selesai': {
				return 'text-success';
			}
			default: {
				return 'text-primary';
			}
		}
	}else{
		switch (status) {
			case 'Pemesanan': {
				return 'text-secondary';
			}
			case 'Pembayaran': {
				return 'text-warning';
			}
			case 'Selesai': {
				return 'text-success';
			}
			default: {
				return 'text-primary';
			}
		}
	}
	}
</script>

<main class="mx-auto h-screen bg-slate-100 p-5">
	<!-- <div class="flex"> -->
	<div class="font-['Helvetica Neue] w-full text-2xl text-primary font-black pt-5 pb-3 grow flex">
		<h1 class="grow flex gap-2">
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
					d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12"
				/>
			</svg>EVENT FOOD & DRINK
		</h1>
		{#if userDepartment === 'Food & Drink'}
			<button class="btn font-bold btn-sm btn-primary" on:click={tambahHandler}> + Tambah</button>
		{/if}
	</div>
	<div class="flex mb-3 ml-3">
		<div class="form-control w-fit items-bottom">
			<label class="label cursor-pointer h-full items-end">
				<input
					type="checkbox"
					class="checkbox border-slate-500"
					disabled={!(data.user.staff.department === 'Food & Drink' || data.user.staff.department === 'Ekonomi PWP')}
					on:click={() => {
						self_only = !self_only;
						selfOnlyHandle();
					}}
				/>
				<span class="label-text px-3 text-slate-500">Hanya Menapilkan Yang Dibuat Oleh Akun Ini</span>
			</label>
		</div>
		<div class="grow" />
		<div class="flex gap-2">
			<div>
				<div class="label-text py-1 text-xs text-slate-500">Pilih Tanggal</div>
				<input
					bind:value={searchedDate}
					type="date"
					class="input input-bordered input-primary max-w-xs input-sm bg-slate-50 text-slate-700"
					on:input={searchHandle}
				/>
			</div>
			<div>
				<div class="form-control w-fit">
					<label class="label cursor-pointer h-fit py-0">
						<input
							type="checkbox"
							class="checkbox checkbox-xs border-slate-500"
							on:change={() => {
								finishDateDisabled = !finishDateDisabled;
								finishDate = '';
								searchHandle();
							}}
						/>
						<span class="label-text text-xs pl-2 text-slate-500 py-1">Sampai Tanggal</span>
					</label>
				</div>
				<input
					bind:value={finishDate}
					type="date"
					class="input input-bordered input-primary max-w-xs input-sm bg-slate-50 text-slate-700"
					disabled={finishDateDisabled}
					on:input={searchHandle}
				/>
			</div>
		</div>
	</div>
	<div class="tabs tabs-boxed mb-2 bg-slate-200 justify-center">
		<a class="tab {tabsStatus[0]} text-slate-500" on:click={() => tabsStatusHandle(0)}>Semua</a>
		<a class="tab {tabsStatus[1]} text-slate-500" on:click={() => tabsStatusHandle(1)}>Pemesanan</a>
		<a class="tab {tabsStatus[2]} text-slate-500" on:click={() => tabsStatusHandle(2)}>Pembayaran</a
		>
		<a class="tab {tabsStatus[3]} text-slate-500" on:click={() => tabsStatusHandle(3)}>Selesai</a>
	</div>
	<div class="overflow-x-auto w-full">
		<table class="table w-full table-compact table-zebra">
			<!-- head -->
			<thead class="text-slate-100 sticky top-0">
				<tr class="text-center">
					<th />
					<th on:click={() => sort('id')}>Nomor {headSymbol.id}</th>
					<th on:click={() => sort('event_date')}>Tanggal {headSymbol.event_date} </th>
					<th>Bagian</th>
					{#if data.user.staff.department === 'Food & Drink'}
					<th>KEPERLUAN</th>
					{:else if data.user.staff.department === 'Manajer' || data.user.staff.department === 'Ekonomi PWP'}
					<th>Admin</th>
					{/if}
					<th>Status</th>
					<th>Jumlah Porsi</th>
					<th />
				</tr>
			</thead>
			<tbody class="text-slate-200">
				<!-- row -->
				{#each shownEvents as event}
					<tr class="text-center">
						{#if event.staff_id === data.user.staff.id || (data.user.staff.department === 'Ekonomi PWP' && event.status === 'Pemesanan')}
							<td class={statusColor(event.status)}>&#9672;</td>
						{:else}
							<td />
						{/if}
						<td> {event.id} </td>
						<td> {formatDate(event.event_date)} </td>
						<td> {event.department} </td>
						{#if data.user.staff.department === 'Food & Drink'}
						<td> {event.purpose} </td>
						{:else if data.user.staff.department === 'Manajer' || data.user.staff.department === 'Ekonomi PWP'}
						<td> {event.staff.name} </td>
						{/if}
						<td class='{statusColor(event.status)} font-semibold'>{event.status}</td>
						<td>{event.total_pax}</td>
						<td>
							<button
								class="flex-none btn btn-outline font-bold btn-xs btn-white"
								on:click={() => detailHandler(event.id)}
							>
								!</button
							>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</main>
