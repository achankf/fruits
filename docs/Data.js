// This is a class which precomputes required data from the input JSON
export class Data {
  // this is for bookkeeping
  // fruit_name -> a list of entry for that fruit, ordered by price in ascending order
  #fruits;

  #images = (() => {
    const mapping = {
      Banana: "img/banana.webp",
      Apple: "img/apple.webp",
      "Dragon Fruit": "img/dragon-fruit.webp",
      Kiwi: "img/kiwi.webp",
      Orange: "img/orange.webp",
      Mango: "img/mango.webp",
      Peaches: "img/peaches.webp",
    };

    const width = 300;

    return new Map(
      Object.entries(mapping).map(([key, uri]) => {
        const image = new Image(width);
        image.src = uri;
        return [key, image];
      })
    );
  })();

  static async create(url) {
    const response = await fetch(url); // you need to run `npm run dev-server` to start a server for this to work.
    const json = await response.json();
    return new Data(json);
  }

  constructor(json) {
    this.#fruits = new Map(
      Object.entries(_.groupBy(json, "fruit_name")).map(([fruitName, data]) => {
        const cloned = _.cloneDeep(data);
        return [fruitName, _.sortBy(cloned, "price")];
      })
    );
    this.groups = new Map(Object.entries(_.groupBy(json, "supplier")));
  }

  getMaxFruitOrder(fruitName) {
    const list = this.#fruits.get(fruitName);
    return _.sumBy(list, "inventory_count");
  }

  checkLowestPriceSupplier(fruitName, supplier) {
    const data = this.#fruits.get(fruitName)[0]; // since `fruits` is the union of all groupings based on the fruit name, there is at least 1 item
    return supplier === data.supplier;
  }

  get fruitNames() {
    return new Set(this.#fruits.keys());
  }

  // invariant: amount <= getMaxFruitOrder(fruitName), due to the use of a slider
  estimateCost(fruitName, amount) {
    if (amount === 0) {
      return { totalCost: 0, details: [] };
    }

    const list = this.#fruits.get(fruitName);

    const details = [];
    let totalCost = 0;
    let cur = amount;
    for (const { inventory_count: stock, price, supplier } of list) {
      // note: list is ordered by price in ascending order
      if (stock >= cur) {
        totalCost += price * cur;
        details.push({
          supplier,
          price,
          stock,
          taken: cur,
        });
        break;
      }

      // case: current supplier doesn't have enough supplies for the order
      totalCost += price * stock;
      details.push({
        supplier,
        price,
        stock,
        taken: stock,
      });
      cur -= stock;
    }

    return {
      details,
      totalCost,
    };
  }

  getImage(fruitName) {
    return this.#images.get(fruitName);
  }
}
