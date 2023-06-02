<script lang="ts" context="module">
	let title = '',
		desc = '';

	let result: Promise<boolean>;
	let resultYes: Promise<boolean>;
	let resultNo: Promise<boolean>;

	let buttonNo;

	import { dialogueOpen, dialogueValue } from '$lib/dialogueStore';

	export function setDialogue(dTitle: string, dDesc: string) {
		title = dTitle;
		desc = dDesc;
	}

	function cancelHandler() {
		dialogueValue.set(false);
		dialogueOpen.set(false);
		resultYes = new Promise((resolve) => {
			resolve(true);
		});
		// console.log('handleClick-result: ' + result);
	}

	function confirmHandler() {
		dialogueValue.set(true);
		dialogueOpen.set(false);
		resultNo = new Promise((resolve) => {
			resolve(true);
		});
		// console.log('handleClick-result: ' + result);
	}

	// async function buttonPromise(button: HTMLButtonElement): Promise<boolean> {
	// 	return new Promise<boolean>((resolve) => {
	// 		button.addEventListener('click', () => {
	// 			resolve(true); // Resolve the promise with a value of true when the button is clicked
	// 		});
	// 	});
	// }

	// async function handleClick(button: HTMLButtonElement) {
		
	// 	button.click(())

	// 	// Wait for the result and handle it
	// }

	// async function awaitPromise<T>(button: HTMLButtonElement): Promise<T> {
	// 	return await promise;
	// }

	// export async function testDialogue(): Promise<boolean> {

	// 	const button1 = document.getElementById('buttonYes') as HTMLButtonElement;
	// 	const button2 = document.getElementById('buttonNo') as HTMLButtonElement;
	// 	// const promiseYes = await handleClick(button1);
	// 	// const promiseNo = await handleClick(button2);

	// 	// const promiseYes = await awaitPromise(resultYes);
	// 	// const promiseNo = await awaitPromise(resultNo);

	// 	dialogueOpen.set(true);
	// 	console.log('PromiseYes: '+promiseYes);
	// 	console.log('PromiseNO: '+promiseNo);
	// 	const dialogueVal = Promise.race([promiseYes, promiseNo]).then((result) => {
	// 		console.log(result);
	// 		dialogueOpen.set(false);
	// 		return result;
	// 	});

	// 	// let dialogueVal: boolean = await fetchClick();
	// 	// const timeInt = setInterval(async () => {
	// 	// 	dialogueVal = await fetchClick();
	// 	// 	console.log('dialogValServer= ' + dialogueVal);
	// 	// 	if (dialogueVal !== null) {
	// 	// 		clearInterval(timeInt);
	// 	// 		dialogueOpen.set(false);
	// 	// 	}
	// 	// }, 200);

	// 	return false;
	// }
</script>

<div class="relative z-20" aria-labelledby="modal-title" role="dialog" aria-modal="true">
	<!--
	  Background backdrop, show/hide based on modal state.
  
	  Entering: "ease-out duration-300"
		From: "opacity-0"
		To: "opacity-100"
	  Leaving: "ease-in duration-200"
		From: "opacity-100"
		To: "opacity-0"
	-->
	<div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />

	<div class="fixed inset-0 z-20 overflow-y-auto">
		<div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
			<!--
		  Modal panel, show/hide based on modal state.
  
		  Entering: "ease-out duration-300"
			From: "opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
			To: "opacity-100 translate-y-0 sm:scale-100"
		  Leaving: "ease-in duration-200"
			From: "opacity-100 translate-y-0 sm:scale-100"
			To: "opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
		-->
			<div
				class="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg"
			>
				<div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
					<div class="sm:flex sm:items-start">
						<div
							class="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10"
						>
							<!-- Heroicon name: outline/exclamation-triangle -->
							<svg
								class="h-6 w-6 text-red-600"
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								stroke-width="1.5"
								stroke="currentColor"
								aria-hidden="true"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									d="M12 10.5v3.75m-9.303 3.376C1.83 19.126 2.914 21 4.645 21h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 4.88c-.866-1.501-3.032-1.501-3.898 0L2.697 17.626zM12 17.25h.007v.008H12v-.008z"
								/>
							</svg>
						</div>
						<div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
							<h3 class="text-lg font-medium leading-6 text-gray-900" id="modal-title">{title}</h3>
							<div class="mt-2">
								<p class="text-sm text-gray-500">{desc}</p>
							</div>
						</div>
					</div>
				</div>
				<div class="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
					<button
						on:click={confirmHandler}
						id="buttonYes"
						type="button"
						class="inline-flex w-full justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm"
						>Iya</button
					>
					<button
						on:click={cancelHandler}
						bind:this={buttonNo}
						id="buttonNo"
						type="button"
						class="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
						>Tidak</button
					>
				</div>
			</div>
		</div>
	</div>
</div>
