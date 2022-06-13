export const FRUIT_IMAGES = (() => {
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
