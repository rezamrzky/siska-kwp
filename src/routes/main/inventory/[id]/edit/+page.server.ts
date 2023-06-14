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
          select:{
            id: true,
            name: true,
            department: true,
            position: true,
            phone_numb: true,
          }
        },
      }
    })

    const ingredients = await prisma.dr_ingredient.findFirst({
        where:{
          id: +id,
        },
    })

    return { user: JSON.parse(JSON.stringify(user)), ingredient: JSON.parse(JSON.stringify(ingredients)) }
  };

export const actions: Actions = {
    edit:async ({request, params: {id}}) => {
        const formData = await request.formData();

        const name = String(formData.get('name'));

        try {
            await prisma.dr_ingredient.update({
                where:{
                    id: +id!
                },
                data:{
                    name: name
                }
            })
        } catch (error) {
            return fail(500, {message: 'gagal menambakan bahan baku'})
        }

        return {type: 'success'}
    }
};