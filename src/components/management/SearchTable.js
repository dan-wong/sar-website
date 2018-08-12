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
  },
  toolbar: theme.mixins.toolbar,
});

class SearchTable extends React.Component {
  constructor(props) {
    super(props);
  }


  cellNavigateHandler() {
    if (this.props.parent === "SARWelcome") {
      window.location = `${window.location}maps/`
    } else {
      window.location = `${window.location}search/`
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
                    <TableCell component="a" onClick={() => this.cellNavigateHandler()} scope="row" className={classes.linkCell}>
                      {search.name}
                    </TableCell>
                    <TableCell numeric>1</TableCell>
                    <TableCell numeric>1</TableCell>
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


