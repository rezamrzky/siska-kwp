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

    const recipes = await prisma.dr_recipe.findMany({
        orderBy:{
            name: 'asc'
        }
    })

    return { user: JSON.parse(JSON.stringify(user)), recipes: JSON.parse(JSON.stringify(recipes)) }
};