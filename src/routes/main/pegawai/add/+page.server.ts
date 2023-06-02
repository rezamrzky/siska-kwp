import { fail} from "@sveltejs/kit";
import type { Actions } from "@sveltejs/kit" ;
import { prisma } from "$lib/prisma";

export const actions: Actions = {
    default: async ({ request }) => {
        console.log('formAction Start')
        const formData = await request.formData()

        console.log(Object.fromEntries(formData))

        const name = String(formData.get("name"));
        const department = String(formData.get("department"));
        const position = String(formData.get("position"));
        const tempJoinDate = String(formData.get("join_date"));
        const join_date = new Date(tempJoinDate);
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

        const id = randomString(name, phone_numb);

        const uCheck = await uniqueCheck(phone_numb, bpjs_id, npwp, email);

        if (uCheck !== '') {
            console.error(uCheck)
            return fail(409, { message: uCheck })
        }

        console.log(formData)
        console.log("id: " + id)

        try {
            await prisma.staff.create({
                data: {
                    id, name, department, position, join_date, address, phone_numb, email, birth_place, birth_date, is_married, have_children, bpjs_id, npwp, salary
                }
            })

        } catch (err) {
            console.error(err)
            return fail(500, { message: 'failed create staff' })
        }

        return {
            type: 'success',
            status: 201
        }
    }
} satisfies Actions;

function randomString(name: string, phone: string): string {
    let result = '';
    const iString = name.replace(/\s/g, '') + phone;
    const stringArr = iString.split('');
    for (let i = 0; i < 6; i++) {
        result += stringArr[Math.floor(Math.random() * 6)];
    }
    return result;
}

async function uniqueCheck(phone: string, bpjs: string, npwp: string, email: string): Promise<string> {

    let errStr = '';

    const phoneUnique = await prisma.staff.findUnique({
        where: {
            phone_numb: phone,
        }
    })

    const bpjsUnique = await prisma.staff.findUnique({
        where: {
            bpjs_id: bpjs
        }
    })

    const npwpUnique = await prisma.staff.findUnique({
        where: {
            npwp: npwp
        }
    })

    const emailUnique = await prisma.staff.findUnique({
        where: {
            email: email
        }
    })

    if (phoneUnique !== null) {
        errStr += 'Nomor Telepon'
    }

    if (emailUnique !== null) {
        if (errStr === '') {
            errStr += 'Email';
        } else {
            errStr = errStr + ', ' + 'Email';
        }
    }

    if (bpjsUnique !== null) {
        if (errStr === '') {
            errStr += 'BPJS';
        } else {
            errStr = errStr + ', ' + 'BPJS';
        }
    }

    if (npwpUnique !== null) {
        if (errStr === '') {
            errStr += 'NPWP';
        } else {
            errStr = errStr + ', ' + 'NPWP';
        }
    }

    if (errStr !== '') {
        errStr = 'Data berikut telah terekam dalam sistem: ' + errStr;
    }

    return errStr;
}
