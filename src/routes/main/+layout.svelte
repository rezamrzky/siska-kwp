<script lang="ts">
	import { page } from '$app/stores';
	import { dialogueOpen, messageOpen, navigationBlocked } from '$lib/dialogueStore';

	export let data: LayoutData;
	const staff = data.user.staff;

	import Dialogue from '../../lib/Dialogue.svelte';
	import Message, { showMessage } from '$lib/Message.svelte';
	import type { LayoutData, SubmitFunction } from './$types';
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import { foodNDrinkNotif } from '$lib/Notifikasi';

	if (data.user.status !== 'Aktif') {
		goto('./main/password');
	}

	export const logOutHandler: SubmitFunction = () => {
		// setDialogue('Log Out', 'Anda yakin akan melakukan log out?');
		// dialogueOpen.set(true);

		// console.log('logouthander');

		return async ({ result }) => {
			if (result.type === 'success') {
				// goto('../');
			}
			if (result.type === 'failure') {
				showMessage(result.data?.message!);
			}
		};
	};
</script>

<main class="mx-auto h-screen flex flex-col lg:flex-row bg-slate-100">
	<div class="h-screen bg-blend-overlay">
		{#if $dialogueOpen}
			<Dialogue />
		{/if}
		{#if $messageOpen}
			<Message />
		{/if}
	</div>
	<section class="navigation basis-1/5 bg-primary h-full drop-shadow-2xl flex flex-col">
		{#if $navigationBlocked}
			<div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity z-10" />
		{/if}

		<header class="font-['Helvetica Neue] text-xl text-center text-white font-black pt-5">
			Sistem Katering KWP
		</header>
		<ul
			class="menu text-secondary-content font-['Helvetica Neue] menu-compact w-full p-2 rounded-box flex-grow"
		>
			<div class="divider" />
			<li>
				<a href="/main" class="item" class:active={$page.url.pathname == '/main'}>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="1.5"
						stroke="currentColor"
						class="w-6 h-6"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
						/>
					</svg>
					Home
					<!-- <div class="flex-grow" />
					<div class="badge badge-secondary">+99</div> -->
				</a>
			</li>
			{#if staff.department === 'Manajer' || staff.department === 'Food & Drink' || staff.department === 'Ekonomi PWP'}
				<li class="menu-title"><span>Food & Drink</span></li>
				<li>
					<a href="/main/fd-events"
						><svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							stroke-width="1.5"
							stroke="currentColor"
							class="w-6 h-6"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12"
							/>
						</svg>
						Food & Drink
						{#if $foodNDrinkNotif > 0}
						<div class="flex-grow" />
						<div class="badge badge-secondary">{$foodNDrinkNotif}</div>
						{/if}</a
					>
				</li>
				{#if staff.department === 'Manajer' || staff.department === 'Ekonomi PWP'}
					<li>
						<a href="/main/fd-bill"
							><svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								stroke-width="1.5"
								stroke="currentColor"
								class="w-6 h-6"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 01-2.25 2.25M16.5 7.5V18a2.25 2.25 0 002.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 002.25 2.25h13.5M6 7.5h3v3H6v-3z"
								/>
							</svg>
							Tagihan FD</a
						>
					</li>
				{/if}{/if}
			{#if staff.department === 'Manajer' || staff.department === 'Dining Room' || staff.department === 'Ekonomi PWP'}
				<li class="menu-title"><span>Dining Room</span></li>
				{#if staff.department !== 'Ekonomi PWP'}
				<li>
					<a href="/main/inventory"
						><svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							stroke-width="1.5"
							stroke="currentColor"
							class="w-6 h-6"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z"
							/>
						</svg>
						Stok Bahan Baku</a
					>
				</li>
				{/if}
				<li>
					<a href="/main/restock"
						><svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							stroke-width="1.5"
							stroke="currentColor"
							class="w-6 h-6"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5m8.25 3v6.75m0 0l-3-3m3 3l3-3M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z"
							/>
						</svg>
						Belanja Dining Room</a
					>
				</li>
				{#if staff.department !== 'Ekonomi PWP'}
				<li>
					<a href="/main/recipe"
						><svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							stroke-width="1.5"
							stroke="currentColor"
							class="w-6 h-6"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184"
							/>
						</svg>
						Resep</a
					>
				</li>
				<li>
					<a href="/main/menu"
						><svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							stroke-width="1.5"
							stroke="currentColor"
							class="w-6 h-6"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z"
							/>
						</svg>
						Menu</a
					>
				</li>
				{/if}
				{#if staff.department === 'Manajer' || staff.department === 'Ekonomi PWP'}
					<li>
						<a href="/main/dr-report"
							><svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								stroke-width="1.5"
								stroke="currentColor"
								class="w-6 h-6"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25M9 16.5v.75m3-3v3M15 12v5.25m-4.5-15H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
								/>
							</svg>
							Laporan DR</a
						>
					</li>
				{/if}{/if}
			{#if staff.department === 'Manajer'}
				<li class="menu-title"><span>Kepegawaian</span></li>
				<li>
					<a href="/main/pegawai">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							stroke-width="1.5"
							stroke="currentColor"
							class="w-6 h-6"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z"
							/>
						</svg>
						Pegawai</a
					>
				</li>
				<li>
					<a href="/main/accounts">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							stroke-width="1.5"
							stroke="currentColor"
							class="w-6 h-6"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z"
							/>
						</svg>
						Akun Pegawai</a
					>
				</li>
			{/if}
			<div class="divider" />
		</ul>
		<footer class="font-['Helvetica Neue] text-sm font-light text-center w-full p-5 text-white">
			<p class="font-bold text-ml">Halo {data.user.username}!</p>
			<p>{staff.name}</p>
			<p>{staff.position} {staff.department}</p>
			<p class="pb-3">{staff.phone_numb}</p>
			<div class="flex gap-2 justify-center w-full">
				<button class="btn btn-outline btn-xs"> <a href="/main/password">Ganti Password</a></button>
				<form method="POST" action="/main?/logout" use:enhance={logOutHandler}>
					<button class="btn btn-outline btn-xs btn-error" type="submit">Logout</button>
				</form>
			</div>
		</footer>
	</section>
	<section class="content-container basis-4/5 bg-blue-200">
		<slot />
	</section>
</main>
