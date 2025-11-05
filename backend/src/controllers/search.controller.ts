import { searchAll } from "@/services/search.service";

export async function searchHandler(request: any, reply: any) {
    try {
        const { query } = request.body;
        const results = await searchAll(query);

        return {
            query: query,
            results
        };
    } catch (err) {
        console.error(err);
        throw new Error('Internal Server Error');
    }
}