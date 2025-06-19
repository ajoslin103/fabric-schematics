# Fabric Layers

## this project is a monorepo 

### WE ARE USING YARN v1 AS THE PACKAGE MANAGER

### WE ARE USING NVM TO MANAGE NODE VERSIONS

### WE ARE USING NX TO MANAGE THE MONOREPO

There is a packages folder with two packages that we will build and publish to npmjs.com

NOTE: We are building aginst fabric-pure-browser to avoid issues with canvas in the browser

- fabric-layers-core

fabric-layers-core is a fabric.js coordinate-plane (grid) & layers library

the fabric-layers-core/grid-demo.html file is a demo of the library, do not use native fabric.js routines where a class from this repo is available

- fabric-layers-react   

fabric-layers-react is a React wrapper around the fabric-layers fabric-layers package

the fabric-layers-react/plane-demo.html file is a simple demo of how to use the fabric-layers library -- do not use native fabric.js methods in this file, only use fabric-layer-react components

