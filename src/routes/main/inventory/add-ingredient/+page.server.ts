import { fail, type Actions } from "@sveltejs/kit";

export const actions: Actions = {
    add:async ({request}) => {
        const formData = await request.formData();

        const name = String(formData.get('name'));
        const unit = String(formData.get('unit'));
        const now = new Date()

        try {
            await prisma.dr_ingredient.create({
                data:{
                    name, unit, stock: 0, stock_date: now,
                }
            })
        } catch (error) {
            return fail(500, {message: 'gagal menambakan bahan baku'})
        }

        return {type: 'success'}
    }
};