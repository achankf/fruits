import { Data } from "./Data.js";
import { Controller } from "./Controller.js";

async function main() {
  const data = await Data.create("./data.json");
  const controller = new Controller(data);

  controller.render();
}

document.addEventListener("DOMContentLoaded", main);
