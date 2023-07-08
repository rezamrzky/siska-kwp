import type { Actions } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

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

    const menus = await prisma.dr_menu.findMany({
        orderBy: {
            date: 'desc',
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

    const firstDate = menus[0].date;
    const lastDate = menus[menus.length-1].date;

    const period = {
        firstDate: firstDate,
        lastDate: lastDate,
        firstMonth: firstDate!.getMonth(),
        firstYear: firstDate!.getFullYear(),
        lastMonth: lastDate!.getMonth(),
        lastYear: lastDate!.getFullYear()
    }

    return { user: JSON.parse(JSON.stringify(user)), period: JSON.parse(JSON.stringify(period)), menus: JSON.parse(JSON.stringify(menus)), recipes: JSON.parse(JSON.stringify(recipes)) }
};

export const actions: Actions = {
    approved:async ({request}) => {
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

        const formData = await request.formData()

        const dateString = String(formData.get('rezar'));
        console.log(dateString)
        const dateArr = dateString.split(' ')

        console.log(dateArr)
        const date = new Date(+dateArr[1], monthString.findIndex((e:string) => e === dateArr[0])+1, 0)
        console.log(date)
        const menu = await prisma.dr_menu.findFirst({
            where:{
                date: date
            }
        })

        console.log(menu)
        
        for (let d = 0; d < 31; d++) {
            for (let s = 0; s < 2; s++) {
                const checkedData = formData.get("checked-"+String(d)+"-"+String(s+1))
                console.log(checkedData)
                const shift = await prisma.dr_menu_shift.update({
                    where: {
                        menu_id_shift_cat_day: {
                            menu_id: menu!.id,
                            shift_cat: s+1,
                            day: d+1
                        }
                    },
                    data:{
                        is_approved: checkedData?true:false
                    }
                })
            }
        }

        return {type:'success'}
    }
    
};