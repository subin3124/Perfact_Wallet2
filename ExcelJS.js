export class ExcelJS{
    names;
    prices;
  constructor(resJSON) {
      this.resJSON = resJSON;
  }
  set JSON(resJSON) {
      this.resJSON = resJSON;
  }
  parseJSON() {
      let data = JSON.parse(this.resJSON());
      data
  }

}