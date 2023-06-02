import type { staff } from "@prisma/client";
import type { PageServerLoad, Actions } from "./$types";
import { fail } from "@sveltejs/kit";
// import { testDialogue } from "$lib/Dialogue.svelte";

let initialData: staff | null = null;

export const load = (async ({ params: { id } }) => {
    const staff = await prisma.staff.findFirst({
        where: {
            id: id
        }
    })
    initialData = staff;
    return { staff: JSON.parse(JSON.stringify(staff)) };
}) satisfies PageServerLoad;

export const actions: Actions = {
    editStaff: async ({ request }) => {

        // const dialog = await testDialogue();
        // if(!dialog){
        //     console.log('dialog: '+dialog)
        //     return fail(400, {message: 'Dialog Cancel'})
        // }

        console.log('editStaff action Start');
        const formData = await request.formData();
        console.log(formData);

        const name = String(formData.get("name"));
        const department = String(formData.get("department"));
        const position = String(formData.get("position"));
        console.log('fomrJoin_date' + formData.get("join_date"))
        const tempJoinDate = String(formData.get("join_date"));
        console.log("tempJoinDate" + tempJoinDate)
        const join_date = new Date(tempJoinDate);
        console.log("join_date" + join_date)
        const address = String(formData.get("address"));
        const phone_numb = String(formData.get("phone_numb"));
        const email = String(formData.get("email"));
        const birth_place = String(formData.get("birth_place"));
        const tempBirthDate = String(formData.get("birth_date"));
        const birth_date = new Date(tempBirthDate);
        const tempMarried = String(formData.get("is_married"));
        let is_married = false;
        const tempChildren = String(formData.get("have_children"))
        let have_children = 0;
        const bpjs_id = String(formData.get("bpjs_id"));
        const npwp = String(formData.get("npwp"));
        const tempSalary = String(formData.get("salary"));
        const salary = parseFloat(tempSalary);

        const uCheck = await uniqueCheck(phone_numb, bpjs_id, npwp, email);

        if (uCheck !== '') {
            console.error(uCheck)
            return fail(409, { message: uCheck })
        }

        if (tempMarried === "Menikah") {
            is_married = true;
        }

        switch (tempChildren) {
            case "0":
                have_children = 0;
                break;

            case "1":
                have_children = 1;
                break;

            case "2":
                have_children = 2;
                break;

            case "3 atau lebih":
                have_children = 3;
                break;

            default:
                break;
        }

        try {

            await prisma.staff.update({
                where: {
                    id: initialData?.id
                },
                data: {
                    name, department, position, join_date, address, phone_numb, email, birth_place, birth_date, is_married, have_children, bpjs_id, npwp, salary
                }
            })


        } catch (err) {
            console.error(err)
            return fail(500, { message: 'failed update staff' })
        }

        return {
            type: 'success',
            status: 201
        }
    }
};

async function uniqueCheck(phone: string, bpjs: string, npwp: string, email: string): Promise<string> {

    let errStr = '';

    if (phone !== initialData?.phone_numb) {

        const phoneUnique = await prisma.staff.findUnique({
            where: {
                phone_numb: phone,
            }
        })

        if (phoneUnique !== null) {
            errStr += 'Nomor Telepon'
        }
    }

    if (bpjs !== initialData?.bpjs_id) {

        const bpjsUnique = await prisma.staff.findUnique({
            where: {
                bpjs_id: bpjs
            }
        })

        if (bpjsUnique !== null) {
            if (errStr === '') {
                errStr += 'BPJS';
            } else {
                errStr = errStr + ', ' + 'BPJS';
            }
        }
    }

    if (npwp !== initialData?.npwp) {
        const npwpUnique = await prisma.staff.findUnique({
            where: {
                npwp: npwp
            }
        })
        if (npwpUnique !== null) {
            if (errStr === '') {
                errStr += 'NPWP';
            } else {
                errStr = errStr + ', ' + 'NPWP';
            }
        }
    }

    if (email !== initialData?.email) {
        const emailUnique = await prisma.staff.findUnique({
            where: {
                email: email
            }
        })

        if (emailUnique !== null) {
            if (errStr === '') {
                errStr += 'Email';
            } else {
                errStr = errStr + ', ' + 'Email';
            }
        }
    }

    if (errStr !== '') {
        errStr = 'Data berikut telah terekam dalam sistem: ' + errStr;
    }

    return errStr;
}