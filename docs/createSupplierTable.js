import { cloneTemplate } from "./cloneTemplate.js";
import { formatISO, parse } from "./date-fns.js";

// Creates an HTMLTableElement based on templates and populating it with input arguments
export function createSupplierTable({
  data,
  supplier,
  groupData,
  checkFruitVisible,
}) {
  const table = cloneTemplate("supplier-table-template").querySelector("table");

  const supplierTitle = table.querySelector("caption");
  supplierTitle.textContent = supplier;

  const body = table.querySelector("tbody");

  const now = new Date();

  groupData
    .filter(({ fruit_name }) => checkFruitVisible(fruit_name))
    .forEach(
      ({ fruit_name, price, last_updated, inventory_count, supplier }) => {
        const row = cloneTemplate("supplier-table-row-template").querySelector(
          "tr"
        );

        row.setAttribute("data-fruit-type", fruit_name); // set up metadata for the image model

        const isLowestPrice = data.checkLowestPriceSupplier(
          fruit_name,
          supplier
        );

        if (isLowestPrice) {
          row.classList.add("lowest-price");
        }

        const parsedDate = parse(last_updated, "yyyy-MMM-dd", now);

        const cells = row.querySelectorAll("td");
        cells[0].textContent = fruit_name;
        cells[1].textContent = price;
        cells[2].textContent = formatISO(parsedDate, {
          representation: "date",
        });
        cells[3].textContent = inventory_count;

        body.appendChild(row);
      }
    );

  return table;
}
