export const getTransactions = async (params) => {
    console.log(`API: getTransactions`);
    return Promise.resolve([
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
    ]);
};