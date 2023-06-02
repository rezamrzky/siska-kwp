<script lang="ts">
	import { dialogueOpen, dialogueValue } from '$lib/dialogueStore';
	import { setDialogue } from '$lib/Dialogue.svelte';
	import { goto, invalidateAll } from '$app/navigation';
	import type { PageData } from './$types';
	import { formatDate } from '$lib/Functions';
	import { showMessage } from '$lib/Message.svelte';

	export let data: PageData;
	$: ({ accounts } = data);
	$: shownData = accounts;

	let searchedName = '';

	let isFilter = false;
	let filterBy = '';
	let filterStatusBy = '';

	let tabs = ['tab-active', '', '', '', ''];
	let tabsColor = [
		'text-secondary font-bold',
		'text-slate-700',
		'text-slate-700',
		'text-slate-700',
		'text-slate-700'
	];

	let tabsStatus = ['tab-active', '', '', ''];

	function tabsHandle(index: number) {
		const activeId = tabs.findIndex((x) => x === 'tab-active');
		if (index !== activeId) {
			tabs[index] = 'tab-active';
			tabs[activeId] = '';

			tabsColor[index] = 'text-secondary font-bold';
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

	function tabsStatusHandle(index: number) {
		const activeId = tabsStatus.findIndex((x) => x === 'tab-active');
		if (index !== activeId) {
			tabsStatus[index] = 'tab-active';
			tabsStatus[activeId] = '';

			switch (index) {
				case 1: {
					shownData = accounts.filter((akun: { status: string; }) => akun.status === 'Aktif')
					break;
				}
				case 2: {
					shownData = accounts.filter((akun: { status: string; }) => akun.status === 'Beku')
					break;
				}
				case 3: {
					shownData = accounts.filter((akun: { status: string; }) => akun.status === 'Tidak Aktif')
					break;
				}
				default: {
					shownData = accounts;
					break;
				}
			}
		}
	}

	function textColor(status: string): string {
		switch (status) {
			case 'Tidak Aktif': {
				return 'text-cyan-300';
			}
			case 'Aktif': {
				return 'text-success';
			}
			case 'Beku': {
				return 'text-warning';
			}
		}
		return 'text-warning';
	}

	async function updateHandler(username: string, status: string) {
		// setDialogue('Ubah Status?', 'Status akan pegawai akan diubah.');
		// dialogueOpen.set(true);

		const list = document.getElementById(username) as HTMLUListElement;
		list.blur();

		let result: JSON;
		// let timeIn = setInterval(async () => {
		// 	if (!$dialogueOpen) {
		// 		clearInterval(timeIn);
		// 		switch ($dialogueValue) {
		// 			case true: {
		// 				console.log('username:' + username + ' status:' + status);
		try {
			const response = await fetch('./accounts/update-status', {
				method: 'POST',
				body: JSON.stringify({ username: username, status: status }),
				headers: {
					'content-type': 'application/json'
				}
			});

			result = await response.json();
			if (result) {
				showMessage('Berhasil mengubah status akun ' + username + '!');
				invalidateAll();
			} else {
				showMessage('Gagal mengubah status akun ' + username + '!');
			}
		} catch (error) {
			console.error(error);
		}
		// 			}
		// 			case false: {
		// 				console.log('dialog batal cancel');
		// 			}
		// 		}
		// 	}
		// }, 200);
	}
</script>

<main class="mx-auto h-screen flex flex-col bg-slate-100 p-5">
	<div class="font-['Helvetica Neue] text-2xl text-primary font-black p-5 flex">
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
					d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z"
				/>
			</svg>AKUN SISTEM KATERING KOPERASI WANITA PATRA
		</h1>
		<div class="grow" />
		<button
			class="btn font-bold btn-sm btn-primary"
			on:click={() => {
				goto('./accounts/add');
			}}
		>
			+ Tambah</button
		>
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
	<div class="tabs tabs-boxed mb-2 bg-slate-200 justify-center">
		<a class="tab {tabsStatus[0]} text-slate-500" on:click={() => tabsStatusHandle(0)}>Semua</a>
		<a class="tab {tabsStatus[1]} text-slate-500" on:click={() => tabsStatusHandle(1)}>Aktif</a>
		<a class="tab {tabsStatus[2]} text-slate-500" on:click={() => tabsStatusHandle(2)}>Beku</a>
		<a class="tab {tabsStatus[3]} text-slate-500" on:click={() => tabsStatusHandle(3)}
			>Tidak Aktif</a
		>
	</div>
	<div class="h-screen w-full overflow-x-auto">
		<table class="table table-compact w-full table-zebra">
			<!-- head -->
			<thead class="sticky top-0 text-slate-100 z-10">
				<tr>
					<th>Username</th>
					<th class="text-center text-ml">Nama </th>
					<th class="text-center text-ml">Login Terakhir</th>
					<th class="text-center text-ml">Status</th>
					<th class="text-right" />
				</tr>
			</thead>
			<tbody>
				<!-- row -->
				<!-- {#each Array(10) as _, i} -->
				{#each shownData as user}
					{#if user.staff.name.toLowerCase().includes(searchedName.toLowerCase())}
						{#if isFilter === true && filterBy === user.staff.department}
							<tr>
								<td
									><div class="font-bold">{user.username}</div>
									{#if !user.last_login}
										<span class="badge badge-warning badge-sm">password: {user.password}</span>
									{/if}
								</td>
								<td class="text-center">
									<div class="font-bold">{user.staff.name}</div>
									<div class="flex place-content-center">
										<span class="badge badge-sm badge-primary">{user.staff.position}</span>
										<span class="badge badge-sm badge-secondary">{user.staff.department}</span>
									</div>
								</td>
								<td class="text-center">{formatDate(user.last_login)}</td>
								<td class="text-center {textColor(user.status)}"> {user.status}</td>
								<td class="text-right">
									<div class="dropdown dropdown-end">
										<button
											class="btn btn-xs btn-ghost gap-2 btn-outline"
											disabled={data.user.username === user.username}>Ubah Status<svg
											xmlns="http://www.w3.org/2000/svg"
											fill="grey" viewBox="0 0 512 512" stroke="currentColor"
											class="w-3 h-3"
										>
											<path
											stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
												d="M362.7 19.3L314.3 67.7 444.3 197.7l48.4-48.4c25-25 25-65.5 0-90.5L453.3 19.3c-25-25-65.5-25-90.5 0zm-71 71L58.6 323.5c-10.4 10.4-18 23.3-22.2 37.4L1 481.2C-1.5 489.7 .8 498.8 7 505s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L421.7 220.3 291.7 90.3z"
											/></svg
										></button
										>
										<ul
											id={user.username}
											tabindex="0"
											class="dropdown-content menu p-2 shadow rounded-box w-52 bg-slate-100 text-base-300"
										>
											<li on:click={() => updateHandler(user.username, 'Aktif')}><a>Aktif</a></li>
											<li on:click={() => updateHandler(user.username, 'Beku')}><a>Beku</a></li>
										</ul>
									</div>
								</td>
							</tr>
						{:else if isFilter === false && filterBy === ''}
							<tr>
								<td
									><div class="font-bold">{user.username}</div>
									{#if !user.last_login}
										<span class="badge badge-warning badge-sm">password: {user.password}</span>
									{/if}
								</td>
								<td class="text-center">
									<div class="font-bold">{user.staff.name}</div>
									<div class="flex place-content-center">
										<span class="badge badge-sm badge-primary">{user.staff.position}</span>
										<span class="badge badge-sm badge-secondary">{user.staff.department}</span>
									</div>
								</td>
								<td class="text-center">{formatDate(user.last_login)}</td>
								<td class="text-center {textColor(user.status)}"> {user.status}</td>
								<td class="text-right">
									<div class="dropdown dropdown-end">
										<button
											class="btn btn-xs btn-ghost gap-2 btn-outline"
											disabled={data.user.username === user.username}
											>Ubah Status
											<svg
												xmlns="http://www.w3.org/2000/svg"
												fill="grey" viewBox="0 0 512 512" stroke="currentColor"
												class="w-3 h-3"
											>
												<path
												stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
													d="M362.7 19.3L314.3 67.7 444.3 197.7l48.4-48.4c25-25 25-65.5 0-90.5L453.3 19.3c-25-25-65.5-25-90.5 0zm-71 71L58.6 323.5c-10.4 10.4-18 23.3-22.2 37.4L1 481.2C-1.5 489.7 .8 498.8 7 505s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L421.7 220.3 291.7 90.3z"
												/></svg
											>
										</button>
										<ul
											id={user.username}
											tabindex="0"
											class="dropdown-content menu p-2 shadow rounded-box w-52 bg-slate-100 text-base-300"
										>
											<li on:click={() => updateHandler(user.username, 'Aktif')}><a>Aktif</a></li>
											<li on:click={() => updateHandler(user.username, 'Beku')}><a>Beku</a></li>
										</ul>
									</div>
								</td>
							</tr>
						{/if}
					{/if}
				{/each}
				<!-- {/each} -->
			</tbody>
		</table>
	</div>
</main>
