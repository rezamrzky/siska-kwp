import type { dr_ingredient, dr_recipe, dr_recipe_ingredients } from "@prisma/client";
import type { Actions, PageServerLoad } from "./$types";
import { fail } from "@sveltejs/kit";

let user, ingredients: dr_ingredient[];;

export const load: PageServerLoad = async ({ cookies }) => {
    // console.log(cookies.getAll())
    user = await prisma.user.findFirst({
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

    ingredients = await prisma.dr_ingredient.findMany({
        orderBy: {
            name: 'asc'
        }
    })

    return { user: JSON.parse(JSON.stringify(user)), ingredients: JSON.parse(JSON.stringify(ingredients)) }
};

export const actions: Actions = {
    add:async ({request}) => {
        const formData = await request.formData()

        const name = String(formData.get('name'))
        const portion = String(formData.get('portion'))
        const ingredientQty = formData.getAll('quantity')

        const qtyList: Array<dr_recipe_ingredients> = [];
        let recipe: { id: any; name?: string; portion?: number; created_at?: Date; updated_by?: string | null; updated_date?: Date | null; };

        try{
            recipe = await prisma.dr_recipe.create({
                data: {
                    name: name,
                    portion: +portion,
                    created_at: new Date()
                }
            })
        } catch(error){
            return fail(500, {message: 'Gagal membuat reseps!'})
        }

        ingredientQty.forEach((e:any, i:any) => {
            if(ingredientQty[i] !== ''){
                qtyList.push({
                   recipe_id: recipe.id,
                   ingredient_id: ingredients[i].id,
                   quantity: +ingredientQty[i]
                })
            }
        })

        try {
            await prisma.dr_recipe_ingredients.createMany({data: qtyList})
        } catch (error) {
            return fail(500, {message: 'Gagal membuat reseps!'})
        }

        return { type: 'success'}
    }
};