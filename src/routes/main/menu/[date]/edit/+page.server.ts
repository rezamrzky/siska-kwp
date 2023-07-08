import { fail, type Actions } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import type { dr_menu, dr_menu_shift, dr_menu_shift_recipes } from "@prisma/client";

const monthString = [
    'Januari',
    'Februari',
    'Maret',
    'April',
    'Mei',
    'Juni',
    'Juli',
    'Agustus',
    'September',
    'Oktober',
    'November',
    'Desember'
];

let choosenDate: Date, menus: (dr_menu & { dr_menu_shift: (dr_menu_shift & { dr_menu_shift_recipes: dr_menu_shift_recipes[]; })[]; }) | null;

export const load: PageServerLoad = async ({ cookies, params: {date} }) => {
    // console.log(cookies.getAll())
    console.log(date)
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

    const dateArr = date.split(' ');
    choosenDate = new Date(+dateArr[1], monthString.findIndex((e:string) => e === dateArr[0])+1, 0)

    menus = await prisma.dr_menu.findFirst({
        where:{
            date: choosenDate
        },
        include: {
            dr_menu_shift: {
                orderBy: {
                    day: 'asc'
                },
                include: {
                    dr_menu_shift_recipes: {
                        orderBy: {
                            index: 'asc'
                        }
                    }
                }
            }
        }
    })

    return { user: JSON.parse(JSON.stringify(user)),  menus: JSON.parse(JSON.stringify(menus)), recipes: JSON.parse(JSON.stringify(recipes)) }
};

export const actions: Actions = {
    edit: async ({ request }) => {
        const formData = await request.formData()

        for (let d = 0; d < choosenDate.getDate(); d++) {
            for (let s = 0; s < 2; s++) {
                const shift = await prisma.dr_menu_shift.upsert({
                    where: {
                        menu_id_shift_cat_day: {
                            menu_id: menus!.id,
                            shift_cat: s+1,
                            day: d+1
                        }
                    }, create: {
                        menu_id: menus!.id,
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
};