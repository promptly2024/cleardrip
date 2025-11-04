export function parsePagination(query: any) {
    const page = Math.max(parseInt(query.page || '1', 10), 1);
    const limit = Math.max(parseInt(query.limit || '10', 10), 10);

    return {
        skip: (page - 1) * limit,
        take: limit,
    };
}
