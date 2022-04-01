export class ShelfLifeService {
    async searchFDC(search: string, pageNumber: string = "1"): Promise<any[]> {
        const requestOptions = {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        };
        const key = "Kh1o6GTHufR5hNhm9ouzMSsIKIVke29dhvfXEEx5";
        const response = await fetch('https://api.nal.usda.gov/fdc/v1/foods/search?api_key=' + key + '&pageNumber=' + pageNumber + '&query=' + search, requestOptions);
        const data = await response.json();
        return data.foods;
    }
}