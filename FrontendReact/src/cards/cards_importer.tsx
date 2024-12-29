type ImageMap = { [key: string]: string };

const images = import.meta.glob("./*.png", {
  eager: true,
});

const imageMap: ImageMap = {};
for (const path in images) {
  const name = path.split("/").pop()?.split(".")[0]; // Extract file name without extension
  if (name) {
    imageMap[name] = (images[path] as { default: string }).default;
  }
}

export default imageMap;
