import { createSupplierTable } from "./createSupplierTable.js";
import { cloneTemplate } from "./cloneTemplate.js";

export class Controller {
  #data;
  #state;

  constructor(data) {
    this.#data = data;
    this.#state = {
      hiddenFruitSet: new Set(),
    };
  }

  render() {
    const container = document.querySelector(".main-container");
    container.replaceChildren(); // get rid of previous rendered stuff

    this.#setupHeader(container);
    this.#setupModel(container);
    this.#setupSupplierTables(container);
  }

  checkFruitVisible(fruitName) {
    return !this.#state.hiddenFruitSet.has(fruitName);
  }

  #updateState(changeFn) {
    this.#state = changeFn(this.#state);
    this.render();
  }

  #setupHeader(container) {
    const { fruitNames } = this.#data;
    const header = cloneTemplate("header-template").querySelector("header");
    const headerContainer = header.querySelector(".container");

    // fruit filter
    {
      const fruitFilter = cloneTemplate("fruit-filter-template").querySelector(
        ".fruit-filter"
      );
      headerContainer.appendChild(fruitFilter);

      const fruitContainer = fruitFilter.querySelector(".container");

      for (const name of fruitNames) {
        const container = cloneTemplate("bs-checkbox-template").querySelector(
          ".form-check"
        );

        const checkbox = container.querySelector(".form-check-input");
        checkbox.value = name;
        checkbox.checked = this.checkFruitVisible(name);
        container.querySelector(".form-check-label").textContent = name;

        checkbox.addEventListener("click", (e) => {
          const value = e.target.value ?? e.target.textContent;

          this.#updateState((prev) => {
            const { hiddenFruitSet } = prev;
            if (hiddenFruitSet.has(value)) {
              hiddenFruitSet.delete(value);
            } else {
              hiddenFruitSet.add(value);
            }

            return prev;
          });
        });

        fruitContainer.appendChild(container);
      }

      container.appendChild(header);
    }

    // order estimate
    {
      const orderEstimate = cloneTemplate(
        "order-estimate-template"
      ).querySelector(".order-estimate");

      const { orderSelectedFruit: selected } = this.#state;

      let orderAmount = 0;

      // populate slider
      if (selected) {
        orderEstimate.querySelector("button").textContent = selected;

        const orderAmountControl = cloneTemplate(
          "order-amount-template"
        ).querySelector(".order-amount");

        const sliderContainer =
          orderEstimate.querySelector(".slider-container");

        const maxAmount = this.#data.getMaxFruitOrder(selected);

        const currentAmountControl =
          orderAmountControl.querySelector(".amount");
        currentAmountControl.textContent = orderAmount;

        orderAmountControl.querySelector(".max-amount").textContent = maxAmount;

        const slider = orderAmountControl.querySelector("#order-amount-slider");
        slider.setAttribute("max", maxAmount);
        slider.value = orderAmount;

        const updateCalculations = () => {
          const { details, totalCost } = this.#data.estimateCost(
            selected,
            orderAmount
          );

          const result = orderAmountControl.querySelector(".result");
          result.querySelector(".total-cost").textContent = _.round(
            totalCost,
            2
          );

          const detailsList = result.querySelector(".details");
          detailsList.replaceChildren(); // clear the list and add new details

          for (const { supplier, taken, price, stock } of details) {
            const item = document.createElement("li");
            item.textContent = `${supplier} (${stock} available): ${taken} × $${price}`;
            detailsList.appendChild(item);
          }
        };

        updateCalculations();

        slider.addEventListener("input", (e) => {
          orderAmount = +e.target.value;
          currentAmountControl.textContent = orderAmount;
          updateCalculations();
        });

        sliderContainer.appendChild(orderAmountControl);
      }

      const dropdownMenu = orderEstimate.querySelector("ul");

      // populate dropdown menu
      for (const name of fruitNames) {
        const dropdownItem = cloneTemplate(
          "bs-dropdown-item-template"
        ).querySelector("li");

        dropdownItem.querySelector("a").textContent = name;

        dropdownMenu.appendChild(dropdownItem);
      }

      // set up events for dropdown menu
      orderEstimate
        .querySelectorAll(".dropdown .dropdown-item")
        .forEach((element) => {
          element.addEventListener("click", (e) => {
            this.#updateState((prev) => ({
              ...prev,
              orderSelectedFruit: e.target.textContent,
            }));
          });
        });

      headerContainer.appendChild(orderEstimate);
    }
  }

  #setupSupplierTables(container) {
    const { groups } = this.#data;

    for (const [supplier, groupData] of groups) {
      const supplierTable = createSupplierTable({
        data: this.#data,
        supplier,
        groupData,
        checkFruitVisible: (fruitName) => this.checkFruitVisible(fruitName),
      });

      container.appendChild(supplierTable);

      new DataTable(supplierTable, {
        info: false,
        paging: false,
        searching: false,
      });
    }
  }

  #setupModel(container) {
    const modal = cloneTemplate("fruit-modal-template").getElementById(
      "fruitModal"
    );
    container.appendChild(modal);

    modal.addEventListener("show.bs.modal", (e) => {
      const modal = document.querySelector(".modal-body");
      modal.replaceChildren();

      const fruitType = e.relatedTarget.dataset.fruitType;
      const image = this.#data.getImage(fruitType);
      modal.appendChild(image);
    });
  }
}
