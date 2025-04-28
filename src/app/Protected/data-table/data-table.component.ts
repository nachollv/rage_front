import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-data-table',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.scss']
})
export class DataTableComponent implements OnInit {
  @Input() columns: string[] = []
  @Input() data: any[] = []
  @Input() displayedColumns: string[] = []
  @Input() dataSource : MatTableDataSource<any>

  @ViewChild(MatPaginator)
  paginator!: MatPaginator
  @ViewChild(MatSort)
  sort!: MatSort

  constructor(private snackBar: MatSnackBar) {
    this.dataSource = new MatTableDataSource<any>([])
  }

  ngOnInit() { 
    this.dataSource = new MatTableDataSource(this.data)
    this.dataSource.paginator = this.paginator
    this.dataSource.sort = this.sort
  }
    
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  editUser(index: number) {
   this.showSnackBar("Edit user functionality not implemented yet. "+index)
  }

  deleteUser(index: number) {
  this.showSnackBar("Delete user functionality not implemented yet. "+index)
  }
  private showSnackBar(msg: string): void {
    this.snackBar.open(msg, 'Close', {
      duration: 15000,
      verticalPosition: 'top',
      horizontalPosition: 'center',
      panelClass: ['custom-snackbar'],
    });
  }

}