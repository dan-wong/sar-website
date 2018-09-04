import React from 'react';
import Table from '@material-ui/core/Table';
import { withStyles } from '@material-ui/core/styles';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

const styles = theme => ({
    center: {
        justifyContent: 'right',
    }
});

class PeopleTable extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.tableContainer}>
          <Table >
            <TableHead>
              <TableRow>
                <TableCell numeric>ID</TableCell>
                <TableCell >First name</TableCell>
                <TableCell>Last name</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {this.props.persons.map(person => {
                return (
                  <TableRow key={person.id}>
                    <TableCell numeric >{person.id}</TableCell>
                    <TableCell > {person.firstName}</TableCell>
                    <TableCell> {person.lastName}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
      </div>
    );
  }
}

export default withStyles(styles)(PeopleTable);


