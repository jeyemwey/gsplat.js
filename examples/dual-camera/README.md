# Dual Camera Example

This example has two individual canvasses. You can control cameras through the left half of the screen.

To make development faster, the scene file is served from a local directory rather than from Hugging Face. For that, run:

```shell
mkdir -p public
curl -o public/bonsai-7k-raw.splat https://huggingface.co/datasets/dylanebert/3dgs/resolve/main/bonsai/bonsai-7k-raw.splat 
```

To develop or build a static version, run:

```shell
npm i
npm i --save gsplat.js@0.2.3

# For development with Hot Reloading
npm run dev

# To build a static version for a server
npm run build
```