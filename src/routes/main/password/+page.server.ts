import type { user } from "@prisma/client";
import type { Actions, PageServerLoad } from "./$types";
import { fail } from "@sveltejs/kit";
import bcrypt from 'bcrypt';

let iUser: user | null;

export const load: PageServerLoad = async ({ cookies }) => {
    const user = await prisma.user.findFirst({
        where: {
            authToken: cookies.get('session')
        }
    })
    iUser = user;
    return { user: JSON.parse(JSON.stringify(user)) }
};

export const actions: Actions = {
    default: async ({ request }) => {

        const formData = await request.formData();

        const oldPass = String(formData.get('oldPassword'));
        const newPass = String(formData.get('newPassword'));
        const conPass = String(formData.get('confirmPassword'));

        let checkPass;

        if(iUser?.password !== null){
        checkPass = await bcrypt.compare(oldPass, iUser!.password);
        console.log('checkPass: '+checkPass)
        }
        if (checkPass) {
            if (newPass === conPass) {

                const hashPass = await bcrypt.hash(conPass, 10)
                // console.log('hashPass: '+hashPass)
                const diffPass = await bcrypt.compare(oldPass, hashPass);
                console.log('diffPass: '+diffPass)
                if(diffPass){
                    return fail(400, { message: 'Password baru dan lama tidak boleh sama!' })
                }
                try {
                    await prisma.user.update({
                        where: {
                            id: iUser?.id,
                        },
                        data: {
                            password: hashPass,
                            status: 'Aktif'
                        }
                    }
                    )
            } catch (error) {
                return fail(500, { message: 'Gagal ubah password!' })
            }
            // console.log('Password siap diganti dengan: ' + conPass)
        } else {
            return fail(400, { message: 'Password baru tidak sama!' })
        }
    }else{
        return fail(400, { message: 'Password lama salah!' })
    }

        return {
        type: 'success'
    }
}
}satisfies Actions;