import type { dr_recipe_ingredients } from "@prisma/client";
import type { Actions, PageServerLoad } from "./$types";
import { fail } from "@sveltejs/kit";

let ingredients: any[], user: { username: string; status: string; staff: { name: string; department: string; position: string; phone_numb: string; id: string; }; } | null;

export const load: PageServerLoad = async ({ cookies, params: { id } }) => {
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
        },
        include: {
            dr_recipe_ingredients: {
                where: {
                    recipe_id: +id
                }
            }
        }
    })

    ingredients.forEach((element: any) => {
        console.log(element.dr_recipe_ingredients)
    });

    const recipe = await prisma.dr_recipe.findFirst({
        where: {
            id: +id
        }
    })

    return { user: JSON.parse(JSON.stringify(user)), ingredients: JSON.parse(JSON.stringify(ingredients)), recipe: JSON.parse(JSON.stringify(recipe)) }
};

export const actions: Actions = {
    edit: async ({ request, params: { id } }) => {
        const formData = await request.formData()

        const name = String(formData.get('name'))
        const portion = String(formData.get('portion'))
        const ingredientQty = formData.getAll('quantity')

        const qtyList: Array<dr_recipe_ingredients> = [];
        let recipe: { id: any; name?: string; portion?: number; created_at?: Date; updated_by?: string | null; updated_date?: Date | null; };

        try{
            recipe = await prisma.dr_recipe.update({
                where:{
                    id: +id!
                },
                data: {
                    name: name,
                    portion: +portion,
                    updated_date: new Date(),
                    updated_by: user!.staff.id
                }
            })
        } catch(error){
            return fail(500, {message: 'Gagal membuat reseps!'})
        }

        ingredientQty.forEach(async (e: any, i: any) => {
            if (ingredientQty[i] !== '' && ingredientQty[i] !== '0') {
                try {
                    await prisma.dr_recipe_ingredients.upsert({
                        where: {
                            recipe_id_ingredient_id: {
                                recipe_id: +id!,
                                ingredient_id: ingredients[i].id,
                            }
                        }, update: {
                            quantity: +ingredientQty[i]
                        }, create: {
                            recipe_id: recipe.id,
                            ingredient_id: ingredients[i].id,
                            quantity: +ingredientQty[i]
                        }
                    })
                } catch (error) {
                    return fail(500, { message: 'Gagal membuat reseps!' })
                }
            } 
            else if(ingredients[i].dr_recipe_ingredients[0] || ingredientQty[i] !== '0'){
                try {
                    await prisma.dr_recipe_ingredients.delete({
                        where: {
                            recipe_id_ingredient_id: {
                                recipe_id: +id!,
                                ingredient_id: ingredients[i].id,
                            }
                        },
                    })
                } catch (error) {
                    return fail(500, { message: 'Gagal membuat reseps!' })
                }
            }
        })

        return { type: 'success' }
    }
};