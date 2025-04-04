import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

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

  constructor() {
    this.dataSource = new MatTableDataSource<any>([])
  }

  ngOnInit() {
  /*   this.dataSource = new MatTableDataSource<any>(this.data) */
   /*  this.displayedColumns = this.columns */
   /*  this.dataSource.paginator = this.paginator
    this.dataSource.sort = this.sort     */
  }

/*   ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  } */

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}