import { fail, type Actions } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

let ingredientId: string, productId: string;

export const load: PageServerLoad = async ({ cookies, params: { id, p_id } }) => {
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

    ingredientId = id;
    productId = p_id;

    const ingredients = await prisma.dr_ingredient.findFirst({
        where: {
            id: +id,
        }
    })

    const product = await prisma.dr_ingredient_product.findFirst({
        where: {
            id: +p_id
        }
    })

    return { user: JSON.parse(JSON.stringify(user)), ingredients: JSON.parse(JSON.stringify(ingredients)), product: JSON.parse(JSON.stringify(product)) }
};

export const actions: Actions = {
    edit: async ({ request }) => {
        const formData = await request.formData();

        const name = String(formData.get('name'));
        const unit = String(formData.get('unit'));
        const quantity = String(formData.get('quantity'));

        try {
            await prisma.dr_ingredient_product.update({
                where: {
                    id: +productId,
                },
                data: {
                    ingredient_id: +ingredientId,
                    brand: name,
                    product_unit: unit,
                    quantity: +quantity
                }
            })
        } catch (error) {
            console.log(error)
            return fail(500, { message: 'Gagal tambah produk!' })
        }

        return { type: 'success' }
    }
};