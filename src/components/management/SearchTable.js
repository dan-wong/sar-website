import React from 'react';
import Table from '@material-ui/core/Table';
import { withStyles } from '@material-ui/core/styles';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

const styles = theme => ({
  linkCell: {
    textDecoration: "underline",
    cursor: 'pointer',
  }
});

class SearchTable extends React.Component {
  constructor(props) {
    super(props);
  }


  cellNavigateHandler(id) {
    if (this.props.parent === "SARWelcome") {
      window.location = `${window.location}maps/`
    } else {
      window.location = `${window.location}createSearch?searchId=${id}`
    }

  }

  render() {
    const { classes } = this.props;
    return (
      <div>
          <Table >
            <TableHead>
              <TableRow>
                <TableCell numeric>ID</TableCell>
                <TableCell >Name of search</TableCell>
                <TableCell numeric >Number of groups</TableCell>
                <TableCell numeric>Number of searchers</TableCell>
                <TableCell >Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {this.props.searches.map(search => {
                return (
                  <TableRow key={search.id}>
                    <TableCell numeric >{search.id}</TableCell>
                    <TableCell component="a" onClick={() => this.cellNavigateHandler(search.id)} scope="row" className={classes.linkCell}>
                      {search.name}
                    </TableCell>
                    <TableCell numeric>{search.groupCount}</TableCell>
                    <TableCell numeric>{search.peopleCount}</TableCell>
                    <TableCell >{search.isActive ? "Active" : "Inactive"}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
      </div>
    );
  }
}

export default withStyles(styles)(SearchTable);


