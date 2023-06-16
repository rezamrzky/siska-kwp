import { fail, type Actions } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import type { dr_menu, Prisma } from "@prisma/client";

let nextMenu: dr_menu | null;

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
        orderBy: {
            name: 'asc'
        }
    })

    const today = new Date();
    const thisMonth = today.getMonth() + 1
    const thisYear = today.getFullYear()

    // const nextDateStr = String((thisMonth+1)===12?(thisYear+1):thisYear)+'-'+String((thisMonth+1)===12?0:(thisMonth+1))+'-1'
    const nextDate = new Date(((thisMonth + 1) === 12 ? (thisYear + 1) : thisYear), ((thisMonth + 1) === 12 ? 0 : (thisMonth + 1)), 0)
    console.log('nextDate: ' + nextDate)

    try {
        nextMenu = await prisma.dr_menu.findUnique({
            where: {
                date: nextDate,
            },
            include: {
                dr_menu_shift: {
                    orderBy:{
                        day: 'asc'
                    },
                    include:{
                        dr_menu_shift_recipes:{
                            orderBy:{
                                index: 'asc'
                            }
                        }
                    }
                }
            }
        })
    } catch (error) {
        return fail(500, { message: 'Gagal membuat menu!' })
    }

    if (!nextMenu) {
        // console.log('MASUK SINI WOY KALAU GAK ADA')
        try {
            nextMenu = await prisma.dr_menu.create({
                data: {
                    date: nextDate,
                    is_approved: false,
                    is_edited: true,
                    is_submited: false
                }
            })
        } catch (error) {
            return fail(500, { message: 'Gagal membuat menu!' })
        }

        const msList: Array<Prisma.dr_menu_shiftCreateManyInput> = [];

        let shift_pointer = 1;
        let day_pointer = 1

        for (let i = 0; i < (nextDate.getDate() * 3); i++) {
            msList.push({
                menu_id: nextMenu!.id,
                shift_cat: shift_pointer,
                is_approved: false,
                day: day_pointer
            })

            if (shift_pointer === 3) {
                shift_pointer = 1;
                day_pointer++;
            } else {
                shift_pointer++;
            }
        }

        // console.log(msList)

        try {
            await prisma.dr_menu_shift.createMany({ data: msList })
        } catch (error) {
            console.log(error)
            return fail(500, { message: 'Gagal membuat menu!' })
        }

        try {
            nextMenu = await prisma.dr_menu.findUnique({
                where: {
                    date: nextDate,
                },
                include: {
                    dr_menu_shift: {
                        orderBy:{
                            day: 'asc'
                        },
                        include:{
                            dr_menu_shift_recipes:{
                                orderBy:{
                                    index: 'asc'
                                }
                            }
                        }
                    }
                }
            })
        } catch (error) {
            return fail(500, { message: 'Gagal membuat menu!' })
        }

    }


    // let shiftMenu;
    // try {
    //     shiftMenu = await prisma.dr_menu_shift.findMany({
    //         orderBy: {
    //             day: 'asc'
    //         },
    //         include:{
    //             dr_menu_shift_recipes:{
    //                 orderBy:{
    //                     index: 'asc'
    //                 }
    //             }
    //         }
    //     })
    // } catch (error) {
    //     return fail(500, { message: 'Gagal membuat menu!' })
    // }

    // menuShift.forEach((e:any)=>{
    //     console.log(e)
    // })

    // console.log(nextMenu.dr_menu_shift)


    return { user: JSON.parse(JSON.stringify(user)), nextMenu: JSON.parse(JSON.stringify(nextMenu)), recipes: JSON.parse(JSON.stringify(recipes))}
};

export const actions: Actions = {
    save: async ({ request }) => {
        const formData = await request.formData()

        for (let d = 0; d < 2; d++) {
            for (let s = 0; s < 3; s++) {
                const shift = await prisma.dr_menu_shift.upsert({
                    where: {
                        menu_id_shift_cat_day: {
                            menu_id: nextMenu!.id,
                            shift_cat: s+1,
                            day: d+1
                        }
                    }, create: {
                        menu_id: nextMenu!.id,
                        shift_cat: s+1,
                        day: d+1,
                        is_approved: false
                    },
                    update: {}
                })
                const value = formData.getAll('recipes-' + String(d) + '-' + String(s))
                // console.log('recipes-' + String(d) + '-' + String(s))
                // console.log(value)
                value.forEach(async(e:any, i:number) => {
                    console.log(e)
                    const valArray = e.split('-')
                    try {
                        await prisma.dr_menu_shift_recipes.upsert({
                            where:{
                                shift_id_index:{
                                    shift_id: shift.id,
                                    index: i
                                }
                            },
                            create:{
                                shift_id: shift.id,
                                recipe_id: +valArray[1],
                                index: i
                            },
                            update:{
                                recipe_id: +valArray[1]
                            }
                        })
                    } catch (error) {
                        return fail(500, { message: 'Gagal menyimpan menu!' })
                    }
                })
            }
        }
    },

    submitted:async () => {
        try {
            await prisma.dr_menu.update({
                where:{
                    id: nextMenu!.id
                },
                data:{
                    is_submited: true
                }
            })
        } catch (error) {
            return fail(500, { message: 'Gagal mengajukan menu!' })
        }
        return {type: 'success'}
    }
};