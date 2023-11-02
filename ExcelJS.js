const exceljs = require('exceljs');
class ExcelJS{
    workbook;
    sheet;
  constructor() {
      this.workbook = new exceljs.Workbook();
  }
  addWorkSheet(name){
      this.workbook.addWorksheet(name);
  }
  async loadWorkbook(fileName) {
      await this.workbook.xlsx.readFile(fileName);
  }

   set JSON(resJSON) {
      this.resJSON = resJSON;
  }
  setSheet(name) {
      this.sheet = this.workbook.getWorksheet(name);
  }
  initColumns() {
      this.sheet.columns = [
          {header: '날짜', key: 'date'},
          {header: '품목', key: 'item'},
          {header: '수량', key: 'qu'},
          {header: '가격', key: 'cost'}
      ]
  }
  getRows() {
      let data = [];
      this.sheet.eachRow({ includeEmpty: true }, function(row, rowNumber) {
          data.push(row.values);
      });
      return data;
  }
  addRows(data) {
      data.map((item, index) => {this.sheet.addRow(item)});
  }
  getWorkbook() {
      return this.workbook;
  }
} module.exports = ExcelJS