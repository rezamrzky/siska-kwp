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
    logout:async ({cookies}) => {

        console.log('logout actions')
        try {
            await prisma.user.update({
                where: {
                    id: iUser?.id,
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

          const string = await bcrypt.hash('asdfgh', 10);
          console.log('new pass: '+string)

          return {
            type: 'success'
        }
    }
};