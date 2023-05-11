<script lang="ts" context='module'>
	let desc = '';

	import {messageOpen} from './dialogueStore';

	export function showMessage(dDesc: string){
		desc = dDesc;

        messageOpen.set(true);
		// console.log('Dialog message open');
        setTimeout(() => {
            messageOpen.set(false);
			// console.log('Dialog message closed')
        }, 3000)
	}
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
	<!-- <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" /> -->

	<div class="fixed inset-0 z-20 overflow-y-auto">
		<!-- <div class="min-h-full items-end p-4 text-center sm:items-center sm:p-0"> -->
			<div class="flex min-h-full items-start p-4 text-center">
			<!--
		  Modal panel, show/hide based on modal state.
  
		  Entering: "ease-out duration-300"
			From: "opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
			To: "opacity-100 translate-y-0 sm:scale-100"
		  Leaving: "ease-in duration-200"
			From: "opacity-100 translate-y-0 sm:scale-100"
			To: "opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
		-->
		<div class="flex-grow" />
			<div
				class="relative transform overflow-hidden rounded-lg bg-white text-center shadow-xl transition-all sm:my-5 w-fit"
			>
				 <div class="bg-primary sm:px-3 sm:py-2 rounded">
                    <div class="flex gap-2">
                        <svg
								class="h-6 w-6 text-slate-100"
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
                            <h3 class="text-lg text-slate-100" id="modal-title">{desc}</h3>
                        </div>
				</div> 
				
			</div>
		</div>
	</div>
</div>
