import type { Actions, PageServerLoad } from "./$types";
import { prisma } from "$lib/prisma";
import type { staff } from "@prisma/client";
import bcrypt from 'bcrypt';
import { fail } from "@sveltejs/kit";

let initialStaffs: Array<staff>;

export const load: PageServerLoad = (async () => {
    const users = await prisma.staff.findMany({
        where: {
            user: null
        }
    })
    initialStaffs = users;
    // console.log('initialStaffs: ' + initialStaffs)
    return { staffs: JSON.parse(JSON.stringify(users)) };
}) satisfies PageServerLoad;

export const actions: Actions = {
    default: async ({ request }) => {

        const formData = await request.formData()

        // console.log(formData)

        const str = String(formData.getAll('checked'));
        const staffArray = str.split(',');

        // console.log('staffArr: '+staffArray)

        for (let i = 0; i < staffArray.length; i++) {
            // console.log('id' + i + ': ' + staffArray[i]);
            const staffIndex = initialStaffs.findIndex(staff => staff.id === staffArray[i])
            const staff = JSON.parse(JSON.stringify(initialStaffs[staffIndex]))
            const username = await createUsername(staff)
            const password_hint = await createPassword(staff)
            const password = await bcrypt.hash(password_hint, 10)
            // console.log('staff: ' + initialStaffs[staffIndex].name);
            // console.log('username: '+username)
            // console.log('password: '+password)
            const status = 'Tidak Aktif';
            const staff_id = staffArray[i]
            try{
                await prisma.user.create({
                data:{
                    username, password, status, staff_id, password_hint
                }
                })
            } catch (err) {
                console.error(err)
                return fail(500, { message: 'failed create staff' })
            }
        }

        return {
            type: 'success',
            status: 201
        }
    }
} satisfies Actions;

async function createUsername(staff: staff): Promise<string> {
    const nameArr = staff.name.split(' ');
    const birthDate = new Date(staff.birth_date);
    let result = '';

    // const staff = initialStaffs.get('name')

    switch (staff.department) {
        case 'Manajer': {
            result = 'man-' + nameArr[0]
            break;
        }
        case 'Dining Room': {
            result = 'dr-' + nameArr[0]
            break;
        }
        case 'Food & Drink': {
            result = 'fd-' + nameArr[0]
            break;
        }
        case 'Ekonomi PWP': {
            result = 'eko-' + nameArr[0]
            break;
        }
    }

    const ucheck = await usernameCheck(result);

    if (!ucheck) {
        const month = (birthDate.getMonth() + 1).toLocaleString('id-ID', {
            minimumIntegerDigits: 2,
            useGrouping: false,
          });
          const day = (birthDate.getDate()).toLocaleString('id-ID', {
            minimumIntegerDigits: 2,
            useGrouping: false,
          });
        result = result + month + day;
    }

    return result;
}

async function usernameCheck(uname: string): Promise<boolean> {
    const user = await prisma.user.findUnique({
        where: {
           username: uname
        }
    })
    if(user !== null ){
        return false
    }

    return true;
}

async function createPassword(staff: staff): Promise<string> {
    const nameArr = staff.name.split(' ');
    const birthDate = new Date(staff.birth_date);
    const char = nameArr[0]+String(birthDate.getFullYear());

//   const hashResult = await bcrypt.hash(char, 10);
  return char;
}