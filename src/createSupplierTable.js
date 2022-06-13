import { formatISO, parse } from "./date-fns.js";

// Creates an HTMLTableElement based on templates and populating it with input arguments
export function createSupplierTable({
  data: { lowestPrices },
  supplier,
  groupData,
}) {
  const template = document.getElementById("supplier-table-template");
  const templateClone = template.content.cloneNode(true);
  const table = templateClone.querySelector("table");

  const caption = table.querySelector("caption");
  caption.textContent = supplier;

  const body = table.querySelector("tbody");

  const now = new Date();

  groupData.forEach(
    ({ fruit_name, price, last_updated, inventory_count, supplier }) => {
      const template = document.getElementById("supplier-table-row-template");
      const templateClone = template.content.cloneNode(true);
      const row = templateClone.querySelector("tr");

      row.setAttribute("data-fruit-type", fruit_name); // set up metadata for the image model

      const isLowestPrice = lowestPrices.get(fruit_name).supplier === supplier;

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
