import React from 'react';
import {
    Header,
    Segment,
    Button,
    Table,
} from 'semantic-ui-react';
import { withToastManager } from 'react-toast-notifications';
import { getLoans, getCatalogItem, returnItem } from '../util/ApiUtil';
import { getDecodedToken } from '../util/AuthUtil';

class ViewLoansPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loans: null,
            loading: true,
        };
    }

    async componentDidMount() {
        const { user: { id } } = getDecodedToken();
        try {
            let { data: { loans } } = await getLoans(id);
            loans = await Promise.all(loans.map(async (inventoryItem) => {
                const { data: catalogItem } = await getCatalogItem(inventoryItem.catalogItemId)
                return {
                    ...inventoryItem,
                    catalogItem,
                }
            }));

            this.setState({ 
                loans,
                loading: false,
            });
        } catch (error) {
            
        }
    }

    handleReturnClick = async (e, { value: inventoryItemId }) => {
        const { toastManager } = this.props;
        let item = this.state.loans.filter(item => item.id === inventoryItemId)[0];
        try {
            await returnItem(inventoryItemId);
            this.setState(({ loans }) => ({
                loans: loans.filter(item => item.id !== inventoryItemId),
            }), () => {
                toastManager.add(`'${item.catalogItem.title}' was successfully returned!`, { 
                    appearance: 'success',
                    autoDismiss: true,
                });
            });
        } catch (error) {
            toastManager.add(`There was an error returning '${item.catalogItem.title}'. Please try again later.`, { 
                appearance: 'error',
                autoDismiss: true,
            });
        }
    }

    generateRows = (loans) =>
        loans.map((loan, i) => {
        const {
            id,
            catalogItem: { title, catalogItemType },
            dueDate,
        } = loan;

        const formattedDate = new Date(dueDate);
        const isOverdue = new Date().getTime() > formattedDate.getTime();
        return (
            <Table.Row key={id}>
                <Table.Cell>{formattedDate.toLocaleString()}</Table.Cell>
                <Table.Cell>
                    {isOverdue ? 'OVERDUE' : 'LOANED'}
                </Table.Cell>
                <Table.Cell>{title}</Table.Cell>
                <Table.Cell>
                    {catalogItemType.slice(0, 1).toUpperCase() + catalogItemType.slice(1)}
                </Table.Cell>
                <Table.Cell>
                    <Button
                        floated="right"
                        color="teal"
                        value={id}
                        onClick={this.handleReturnClick}>
                        Return
                    </Button>
                </Table.Cell>
            </Table.Row>
        )
    });

    generateTable = (loans) => loans.length
        ? (
            <Table>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell>Due Date</Table.HeaderCell>
                        <Table.HeaderCell>Status</Table.HeaderCell>
                        <Table.HeaderCell>Title</Table.HeaderCell>
                        <Table.HeaderCell>Type</Table.HeaderCell>
                        <Table.HeaderCell></Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    { this.generateRows(loans) }
                </Table.Body>
            </Table>
        ) : (
            <Header 
                as="h2" 
                textAlign="center"
                style={{ marginTop: '2em' }}>
                    You haven't loaned anything!
            </Header>
        );

    render() {
        const {
            loading,
            loans,
        } = this.state;
        
        if (loading) {
            return <div></div>
        }

        return (
            <Segment basic padded="very">
                 <Header
                    as='h1'
                    color='teal'
                    content="My Loans"
                />
                { this.generateTable(loans) }              
            </Segment>
        );
    }
}

export default withToastManager(ViewLoansPage);
