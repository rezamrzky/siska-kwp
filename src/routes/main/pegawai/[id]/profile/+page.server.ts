import { fail } from "@sveltejs/kit";
import type { PageServerLoad, Actions } from "./$types";
import { prisma } from "$lib/prisma";

export const load = (async({ params: {id}}) => {
    const staff = await prisma.staff.findFirst({
        where: {
            id: id,
        }
    })

    return { staff: JSON.parse(JSON.stringify(staff)) };
}) satisfies PageServerLoad;

export const actions: Actions = {
    delete: async ({ params: {id}}) => {
        try {
            await prisma.staff.update({
                where: {
                    id: id
                },
                data:{
                    is_blocked: true,
                    user:{
                        update:{
                            status: 'Beku'
                        }
                    }
                }
            })
        } catch(err) {
            console.log(err)
            return fail(500, {message: 'failed delete staff'})
        }

        return{
            type: 'success',
            status: 201
        }
    }
} satisfies Actions;