export const getTransactions = async (params) => {
    console.log(`API: getTransactions`);
    return Promise.resolve({
        data: [
            {
                id: 1,
                timestamp: '2018-11-01 20:25:54',
                operation: 'LOAN',
                user: {
                    firstName: 'Justin',
                    lastName: 'Cotarla'
                },
                inventoryItem: {
                    title: 'Brave New World'
                },
            },
            {
                id: 2,
                timestamp: '2018-11-11 20:25:54',
                operation: 'LOAN',
                user: {
                    firstName: 'Constantinos',
                    lastName: 'Constantinides'
                },
                inventoryItem: {
                    title: 'Edge of Tomorrow'
                },
            },
            {
                id: 3,
                timestamp: '2018-11-21 20:25:54',
                operation: 'RETURN',
                user: {
                    firstName: 'Constantinos',
                    lastName: 'Constantinides'
                },
                inventoryItem: {
                    title: 'Edge of Tomorrow'
                },
            },
        ],
    });
};
export const getCatalogItem = async (catalogItemId) => {
    console.log(`API: getCatalogItem`);
    const catalog = {
        1: {
            title: 'Edge of Tomorrow',
        },
        2: {
            title: 'Brave New World',
        },
    };
    return Promise.resolve({
        data: catalog[catalogItemId],
    });
}

export const getCart = async () => {
    console.log(`API: getCart`);
    return Promise.resolve({
        data: [
            1,
            2,
        ]
    });
}

export const updateCart = async (items) => {
    console.log(`API: updateCart`);
    return Promise.resolve();
}

export const deleteCart = async () => {
    console.log(`API: deleteCart`);
    return Promise.resolve();
}

export const checkout = async (items) => {
    console.log(`API: checkout`);
    return Promise.resolve();
}
