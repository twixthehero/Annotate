main.js - handles the setup code for CodeMirror and creates the shortcuts

annotate.js - stores all the processed Clocks

This class implements all the functions for saving/loading a
configuration. Additionally, it has functions for toggling the
state of each token for parsing and a default function for
initializing the starting tokens.

clocks.js - contains all the Clock classes

The main design choice was to make a modular token parsing system which
allowed for different tokens to be individually turned on and off. With
custom Clocks for each token, the base class can be extended in order
to allow for different functionality to happen upon the nearest 'tick'
being reached.