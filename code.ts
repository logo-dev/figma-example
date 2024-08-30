figma.showUI(__html__);

figma.ui.onmessage = async (msg: { type: string; query: string }) => {
  if (msg.type === "brand-search") {
    try {
      const res = await fetch(`http://api.logo.dev/search?q=${msg.query}`, {
        headers: {
          // find your secret key on the dashboard
          // https://www.logo.dev/dashboard
          Bearer: "Your Secret Key Here",
        },
      });
      const data = await res.json();
      console.log("have these results", data);

      const nodes = [];
      let lastX = 0;
      for (const row of data) {
        const img = await figma.createImageAsync(row.logo_url);
        const node = figma.createRectangle();
        const { width, height } = await img.getSizeAsync();
        node.resize(width, height);
        node.x = lastX;
        lastX += Math.floor(width * 1.1);
        node.fills = [
          {
            type: "IMAGE",
            imageHash: img.hash,
            scaleMode: "FILL",
          },
        ];

        nodes.push(node);
      }
      figma.currentPage.selection = nodes;
    } catch (err) {
      console.log("error running plugin", err);
    }

    console.log("done");
  }

  figma.closePlugin();
};
