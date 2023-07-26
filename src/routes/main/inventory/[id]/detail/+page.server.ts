import { fail } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";

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
        include: {
          dr_ingredient_product:{
            orderBy:{
              brand: 'asc'
            }
          },
          dr_stock:{
            orderBy:{
              date: 'desc',
            },
            include:{
              dr_ingredient_product: true
            }
          }
        }
    })

    return { user: JSON.parse(JSON.stringify(user)), ingredient: JSON.parse(JSON.stringify(ingredients)) }
  };
  

  export const actions: Actions = {
    delete:async ({request}) => {

      const formData = await request.formData();

      const id = String(formData.get("id"))

      console.log("id-deleted_ingredient: "+id)

        try {
            await prisma.dr_ingredient_product.update({
                where:{
                  id: +id
                },
                data:{
                  is_blocked: true
                }
            })
        } catch (error) {
            return fail(500, {message: 'gagal menambakan bahan baku'})
        }

        return {type: 'success'}
    }
};