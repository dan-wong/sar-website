import React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

export default class SearchTable extends React.Component {
  constructor(props) {
    super(props);
  }


  cellNavigateHandler() {
      window.location = `${window.location}maps/`
  }

  render() {
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
                    <TableCell component="a" onClick={() => this.cellNavigateHandler()} scope="row">
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



