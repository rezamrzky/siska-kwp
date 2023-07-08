import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ cookies }) => {
    // console.log(cookies.getAll())
    const user = await prisma.user.findFirst({
        where: {
            authToken: cookies.get('session')
        },
        select: {
            username: true,
            status: true,
            staff: {
                select: {
                    id: true,
                    name: true,
                    department: true,
                    position: true,
                    phone_numb: true,
                }
            }
        }
    })

    const restocks = await prisma.dr_restock.findMany({
        orderBy:{
            created_at: 'desc'
        },
        include:{
            dr_restock_payment: true
        }
    })

    return { user: JSON.parse(JSON.stringify(user)), restocks: JSON.parse(JSON.stringify(restocks)) }
};