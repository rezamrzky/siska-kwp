import { fail, type Actions } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ cookies, params: {id} }) => {
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

    const ingredients = await prisma.dr_recipe_ingredients.findMany({
        where:{
            recipe_id: +id,
        },
        include:{
            dr_ingredient: true
        }
    })

    const recipe = await prisma.dr_recipe.findFirst({
        where:{
            id: +id
        }
    })

    return { user: JSON.parse(JSON.stringify(user)), ingredients: JSON.parse(JSON.stringify(ingredients)), recipe: JSON.parse(JSON.stringify(recipe)) }
};

export const actions: Actions = {
    delete:async ({params: {id}}) => {
        // try {
        //     await prisma.dr_recipe.update({
        //         where:{
        //             id: +id!
        //         },
        //         data:{
        //             updated_by: null
        //         }
        //     })
        // } catch (error) {
        //     return fail(500, { message: 'Gagal membuat reseps!' })
        // }

        try {
            await prisma.dr_recipe.delete({
                where:{
                    id: +id!
                }
            })
        } catch (error) {
            console.log(error)
            return fail(500, { message: 'Gagal membuat reseps!' })
        }
    }
};