import { fail, type Actions } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import type { dr_menu_shift, dr_menu, Prisma } from "@prisma/client";

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
        orderBy:{
            name: 'asc'
        }
    })

    const today = new Date();
    const thisMonth = today.getMonth() + 1
    const thisYear = today.getFullYear()

    // const nextDateStr = String((thisMonth+1)===12?(thisYear+1):thisYear)+'-'+String((thisMonth+1)===12?0:(thisMonth+1))+'-1'
    const nextDate = new Date(((thisMonth + 1) === 12 ? (thisYear + 1) : thisYear), ((thisMonth + 1) === 12 ? 0 : (thisMonth + 1)), 0)
    console.log('nextDate: ' + nextDate)

    let nextMenu: dr_menu | null, menuShift;

    try {
        nextMenu = await prisma.dr_menu.findUnique({
            where: {
                date: nextDate,
            },
            include: {
                dr_menu_shift: true,
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

    }

    try {
        menuShift = await prisma.dr_menu_shift.groupBy({
            by: ['day'],
            orderBy: {
                day: 'asc'
            }
        })
    } catch (error) {
        return fail(500, { message: 'Gagal membuat menu!' })
    }

    // menuShift.forEach((e:any)=>{
    //     console.log(e)
    // })


    return { user: JSON.parse(JSON.stringify(user)), nextMenu: JSON.parse(JSON.stringify(nextMenu)), recipes: JSON.parse(JSON.stringify(recipes)) }
};

export const actions: Actions = {
    save: async ({ request }) => {
        const formData = await request.formData()

        for (let d = 0; d < 2; d++) {
            for (let s = 0; s < 3; s++) {
                const value = formData.getAll('recipe-'+String(d)+'-'+String(s))
                console.log('recipe-'+String(d)+'-'+String(s))
                console.log(value)
            }
        }
    }
};