import type { Actions } from "@sveltejs/kit";

export const actions: Actions = {
    default:async ({request}) => {
        const formData = await request.formData()

        const fname = String(formData.get("name"));
        const fphone = String(formData.get("phone_numb"));

        const nameArr: Array<string> = fname.split(" ");
        const last4phone = fphone.slice(-4);
        const id = nameArr[0]+last4phone;

        console.log(formData)
        console.log("id: "+id)
    }
}satisfies Actions;