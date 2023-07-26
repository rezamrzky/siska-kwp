import type { PageServerLoad } from "./$types";
import { prisma } from "$lib/prisma";

export const load: PageServerLoad = (async ({cookies}) => {
    const accounts = await prisma.user.findMany({
        select:{
            username: true,
            password: true,
            last_login: true,
            status: true,
            password_hint: true,
            staff: {
                select: {
                    name: true,
                    department: true,
                    position: true,
                    birth_date: true,
                    is_blocked: true
                }
            }
        }
    })

    const user = await prisma.user.findFirst({
        where: {
          authToken: cookies.get('session')
        },
        select: {
          username: true,
        }
      })
    return { accounts: JSON.parse(JSON.stringify(accounts)), user: JSON.parse(JSON.stringify(user)) };
}) satisfies PageServerLoad;