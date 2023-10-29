import {Workbook} from "exceljs";

const exceljs = require('exceljs');
export class ExcelJS{
    names;
    prices;
    workbook;
    sheet;
  constructor(resJSON) {
      this.resJSON = resJSON;
      this.workbook = new Workbook();
  }
  addWorkSheet(name){
      this.workbook.addWorkSheet(name);
  }
   set JSON(resJSON) {
      this.resJSON = resJSON;
  }
  set sheet(name) {
      this.sheet = this.workbook.getWorksheet(name);
  }
  initColumns() {
      this.sheet.columns = [
          {header: '품목', key: 'item'},
          {header: '수량', key: 'qu'},
          {header: '가격', key: 'cost'}
      ]
  }
  addRows(data) {
      data.map((item, index) => {this.sheet.addRows(item)});
  }
  parseJSON() {
      let data = JSON.parse(this.resJSON());
  }

}