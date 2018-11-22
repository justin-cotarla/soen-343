import React from 'react';
import {
    Header,
    Segment,
    Input,
    Select,
    Button,
    Table,
} from 'semantic-ui-react';
import DatePicker from 'react-datepicker';

import CalendarButton from '../components/CalendarButton';
import { getTransactions } from '../util/__mocks__/ApiUtils';

const options = [
    { key: 'Any', text: 'Any', value: 'ANY' },
    { key: 'Loan', text: 'Loan', value: 'LOAN' },
    { key: 'Return', text: 'Return', value: 'RETURN' },
];

class TransactionPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            date: new Date(),
            query: '',
            operation: 'ANY',
            transactionList: undefined,
        };
    }

    onDateChange = date => {
        this.setState({
            date,
        });
    };

    onQueryChange = (e, {value}) => {
        this.setState({
            query: value,
        })
    };

    onOperationChange = (e, {value}) => {
        this.setState({
            operation: value,
        })
    };

    onSubmitClick = async () => {
        const {
            date,
            query,
            operation,
        } = this.state;
        this.setState({
            transactionList: await getTransactions({
                date,
                query,
                operation,
            }),
        });
    }

    generateRows = (transactionList) =>
        transactionList.map(transaction => {
        const {
            id,
            timestamp,
            operation,
            user: { firstName, lastName},
            inventoryItem: { title },
        } = transaction;

        return (
            <Table.Row>
                <Table.Cell>{id}</Table.Cell>
                <Table.Cell>{timestamp}</Table.Cell>
                <Table.Cell>{operation}</Table.Cell>
                <Table.Cell>{title}</Table.Cell>
                <Table.Cell>{`${firstName} ${lastName}`}</Table.Cell>
            </Table.Row>
        )
    });

    generateTable = (transactionList) => transactionList.length
        ? (
            <Table>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell>ID</Table.HeaderCell>
                        <Table.HeaderCell>Time</Table.HeaderCell>
                        <Table.HeaderCell>Operation</Table.HeaderCell>
                        <Table.HeaderCell>Item</Table.HeaderCell>
                        <Table.HeaderCell>Client</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    { this.generateRows(transactionList) }
                </Table.Body>
            </Table>
        ) : (
            <Segment>
                <Header as="h2" textAlign="center">No results</Header>
            </Segment>
        );

    render() {
        const {
            date,
            query,
            operation,
            transactionList,
        } = this.state;
        
        return (
            <Segment basic padded="very">
                 <Header
                    as='h1'
                    color='teal'
                    content="Transactions"
                />
                <div style={{
                    display: "flex",
                    justifyContent: "space-evenly",
                    margin: "auto",
                    width: "720px",
                    ...(!transactionList && {marginTop: "8em"})
                }}>
                    <DatePicker
                        customInput={<CalendarButton />}
                        selected={date}
                        onChange={this.onDateChange}
                    />
                    <Input
                        placeholder="Name or Title"
                        style={{ width: "300px"}}
                        onChange={this.onQueryChange}
                        value={query}
                    />
                    <Select
                        options={options}
                        value={operation}
                        onChange={this.onOperationChange}
                    />
                    <Button
                        color="teal"
                        content="Search"
                        onClick={this.onSubmitClick}
                    />
                </div>

                {
                    transactionList && this.generateTable(transactionList)
                }
                
            </Segment>
        );
    }
}

export default TransactionPage;
