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

    const report = await prisma.dr_report.findMany({
        orderBy:{
            id: 'asc'
        },
        include:{
            dr_modal: true,
            dr_restock_payment: {
                include:{
                    dr_restock: true
                }
            }
        }
    })
    console.log(report)

    const firstDate = report[0].created_date;
    const lastDate = report[report.length-1].created_date;

    const period = {
        firstDate: firstDate,
        lastDate: lastDate,
        firstMonth: firstDate!.getMonth(),
        firstYear: firstDate!.getFullYear(),
        lastMonth: lastDate!.getMonth(),
        lastYear: lastDate!.getFullYear()
    }

    return { user: JSON.parse(JSON.stringify(user)), report: JSON.parse(JSON.stringify(report)), period: JSON.parse(JSON.stringify(period)) }
};