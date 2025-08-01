# Fabric Schematics

### WE ARE USING YARN v1 AS THE PACKAGE MANAGER

### WE ARE USING NVM TO MANAGE NODE VERSIONS

### WE ARE USING NX TO MANAGE THE MONOREPO

There is a packages folder with two packages that we will build and publish to npmjs.com

NOTE: We are building against fabric@5.5.2-browser to avoid issues with canvas in the browser (note the -browser suffix)

- fabric-schematics

fabric-schematics is a fabric.js coordinate-plane (grid) & layers library

the fabric-schematics/grid-demo.html file is a demo of the library, do not use native fabric.js routines where a class from this repo is available
