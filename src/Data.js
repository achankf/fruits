// This is a class which precomputes required data from the input JSON
export class Data {
  static async create(url) {
    const response = await fetch(url); // you need to run `npm run dev-server` to start a server for this to work.
    const json = await response.json();
    return new Data(json);
  }

  constructor(json) {
    this.json = json;

    // this is for bookkeeping
    // fruit_name -> an entry in `json` which represents the lowest price for the fruit
    this.lowestPrices = new Map(
      Object.entries(_.groupBy(json, "fruit_name")).map(([fruitName, data]) => [
        fruitName,
        _.minBy(data, "price"),
      ])
    );
    this.groups = new Map(Object.entries(_.groupBy(json, "supplier")));
  }
}
