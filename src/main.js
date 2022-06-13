import { Data } from "./Data.js";
import { createSupplierTable } from "./createSupplierTable.js";
import { FRUIT_IMAGES } from "./images.js";

async function main() {
  const data = await Data.create("./data.json");
  const { groups } = data;

  console.log([...data.lowestPrices.keys()]);

  const container = document.getElementById("container");

  for (const [supplier, groupData] of groups) {
    const supplierTable = createSupplierTable({
      data,
      supplier,
      groupData,
    });

    container.appendChild(supplierTable);

    $(supplierTable).DataTable({
      paging: false,
    });
  }

  $("#fruitModal").on("show.bs.modal", function (event) {
    const modal = document.querySelector(".modal-body");
    modal.replaceChildren();

    const fruitType = event.relatedTarget.dataset.fruitType;
    const image = FRUIT_IMAGES.get(fruitType);
    modal.appendChild(image);
  });
}

$(document).ready(main);
