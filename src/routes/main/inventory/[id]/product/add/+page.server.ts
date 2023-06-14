import { fail, type Actions } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

let ingredientId: string;

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
        }
      }
    })

    ingredientId = id;

    const ingredients = await prisma.dr_ingredient.findFirst({
       where:{
        id: +id,
       }
    })
  
    return { user: JSON.parse(JSON.stringify(user)), ingredients: JSON.parse(JSON.stringify(ingredients)) }
  };

  export const actions: Actions = {
    add:async ({request}) => {
        const formData = await request.formData();

        const name = String(formData.get('name'));
        const unit = String(formData.get('unit'));
        const quantity = String(formData.get('quantity'));

        try {
            await prisma.dr_ingredient_product.create({
                data:{
                    ingredient_id: +ingredientId,
                    brand: name,
                    product_unit: unit,
                    quantity: +quantity,
                    stock: 0,
                    stock_date: new Date()
                }
            })
        } catch (error) {
            console.log(error)
            return fail(500, {message: 'Gagal tambah produk!'})
        }

        return {type: 'success'}
    }
  };