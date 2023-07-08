import type { user } from "@prisma/client";
import type { Actions, PageServerLoad } from "./$types";
import { fail, redirect } from "@sveltejs/kit";

let iUser: user | null;

export const load: PageServerLoad = async ({ cookies }) => {
    if (cookies.get('session')) {
        console.log(cookies.get('session'))
        const user = await prisma.user.findFirst({
            where: {
                authToken: cookies.get('session')
            }
        })
        console.log(user)
        iUser = user;
        return { user: JSON.parse(JSON.stringify(user)) }
    } else {
        throw redirect(301, '/')
    }
};

export const actions: Actions = {
    logout: async ({ cookies }) => {

        console.log('logout actions')
        try {
            await prisma.user.update({
                where: {
                    id: iUser!.id,
                },
                data: {
                    authToken: null
                }
            })
        } catch (error) {
            console.log(String(error))
            return fail(500, { message: 'Gagal logout' })
        }

        cookies.set('session', '', {
            path: '/',
            expires: new Date(0),
        })

        throw redirect(301, '/main')

    }
};