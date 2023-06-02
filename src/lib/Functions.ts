export function formatDate(date: any): string {

  if(date === null){
    return '';
  }
    const newDate = new Date(date);
		const formattedDate = newDate.toLocaleDateString('id-ID', {
			day: '2-digit',
			month: '2-digit',
			year: 'numeric'
		})
		return formattedDate;
}
export function formatDateYMD(date: any): string {
  const newDate = new Date(date);
  const year = newDate.getFullYear();
  const month = (newDate.getMonth() + 1).toLocaleString('id-ID', {
    minimumIntegerDigits: 2,
    useGrouping: false,
  });
  const day = (newDate.getDate()).toLocaleString('id-ID', {
    minimumIntegerDigits: 2,
    useGrouping: false,
  });

  return `${year}-${month}-${day}`;
}

export function currencyToString(number: any){
    const format = new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
      });
    
      return format.format(number);
}