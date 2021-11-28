let config; export default config = {
  "align": {
    "content": {
      "_": {
        "values": [
          "stretch",
          "center",
          "flex-start",
          "flex-end",
          "space-between",
          "space-around",
          "space-evenly",
          "initial",
          "unset"
        ]
      }
    },
    "items": {
      "_": {
        "ref": "$up.content"
      }
    },
    "self": {
      "_": {
        "ref": "$up.content"
      }
    }
  },
  "animation": {
    "delay": {
      "_": {
        "type": [
          "time"
        ]
      }
    },
    "direction": {
      "_": {
        "values": [
          "normal",
          "reverse",
          "alternate",
          "alternate-reverse"
        ],
        "multi": true
      }
    },
    "duration": {
      "_": {
        "type": [
          "time"
        ]
      }
    },
    "fill": {
      "mode": {
        "_": {
          "values": [
            "none",
            "forwards",
            "backwords",
            "both"
          ],
          "multi": true
        }
      }
    },
    "iteration": {
      "count": {
        "_": {
          "type": [
            "number",
            "custom"
          ],
          "values": [
            "inifnite"
          ],
          "multi": true
        }
      }
    },
    "name": {
      "_": {
        "type": [
          "string",
          "custom"
        ],
        "values": [
          "none"
        ],
        "multi": true
      }
    },
    "play": {
      "state": {
        "_": {
          "values": [
            "running",
            "paused"
          ],
          "multi": true
        }
      }
    },
    "timing": {
      "function": {
        "_": {
          "values": [
            "ease",
            "ease-in",
            "ease-out",
            "ease-in-out",
            "linear",
            "step-start",
            "step-end"
          ],
          "multi": true
        }
      }
    }
  },
  "appearance": {
    "_": {
      "values": [
        "auto",
        "textfield",
        "menulist-button"
      ]
    }
  },
  "aspect": {
    "ratio": {
      "_": {
        "type": [
          "ratio"
        ]
      }
    }
  },
  "backface": {
    "visibility": {
      "_": {
        "values": [
          "visible",
          "hidden"
        ]
      }
    }
  },
  "background": {
    "attachment": {
      "_": {
        "values": [
          "scroll",
          "fixed",
          "local"
        ]
      }
    },
    "blend": {
      "mode": {
        "_": {
          "values": [
            "normal",
            "multiply",
            "screen",
            "overlay",
            "darken",
            "lighten",
            "color-dodge",
            "color-saturation",
            "color",
            "saturation",
            "luminosity"
          ],
          "multi": true
        }
      }
    },
    "clip": {
      "_": {
        "values": [
          "border-box",
          "padding-box",
          "content-box",
          "text"
        ]
      }
    },
    "color": {
      "_": {
        "type": [
          "string",
          "custom"
        ],
        "values": [
          "transparent",
          "currentColor"
        ]
      }
    },
    "image": {
      "_": {
        "type": [
          "image",
          "custom"
        ],
        "values": [
          "none"
        ]
      }
    },
    "origin": {
      "_": {
        "values": [
          "border-box",
          "padding-box",
          "content-box"
        ]
      }
    },
    "position": {
      "_": {
        "type": [
          "position"
        ],
        "separated" : true,
        "multi" : true
      },
      "x": {
        "_": {
          "type": [
            "custom",
            "length"
          ],
          "values": [
            "left",
            "center",
            "right",
          ],
          "separated" : true
        }
      },
      "y": {
        "_": {
          "ref": "$up.x"
        }
      }
    },
    "repeat": {
      "_": {
        "values": [
          "repeat-x",
          "repeat-y",
          "repeat",
          "space",
          "round",
          "no-repeat"
        ],
        "type": [
          "string"
        ],
        "separated" : true
      }
    },
    "size": {
      "_": {
        "values": [
          "auto",
          "cover",
          "contain"
        ],
        "type": [
          "length",
          "procent",
          "custom"
        ]
      }
    }
  },
  "block": {
    "size": {
      "_": {
        "values": [
          "auto",
          "fit-content",
          "min-content",
          "fit-content",
          "max-content",
          "border-box",
          "max-content",
          "available"
        ],
        "type": [
          "length",
          "custom"
        ],
        "separated" : true
      }
    }
  },
  "border": {
    "block": {
      "end": {
        "color": {
          "_": {
            "type": [
              "string",
              "hex",
              "rgb",
              "hsl"
            ]
          }
        },
        "style": {
          "_": {
            "values": [
              "dashed",
              "dotted",
              "groove"
            ]
          }
        },
        "width": {
          "_": {
            "values": [
              "thick"
            ],
            "type": [
              "unit",
              "custom"
            ],
            "units": [
              "px"
            ]
          }
        }
      },
      "start": {
        "ref" : "$up.end"
      }
    },
    "bottom": {
      "color": {
        "_": {
          "values": [
            "transparent"
          ],
          "type": [
            "custom",
            "string",
            "hex",
            "rgb",
            "hsl"
          ]
        }
      },
      "left": {
        "radius": {
          "_": {
            "type": [
              "unit",
              "procent"
            ],
            "units": [
              "px"
            ]
          }
        }
      },
      "right": {
        "radius": {
          "_": {
            "ref": "$up.$up.left.radius"
          }
        }
      },
      "style": {
        "_": {
          "values": [
            "none",
            "dashed",
            "dotted",
            "solid",
            "hidden",
            "double"
          ],
          "separated" : true
        }
      },
      "width": {
        "_": {
          "type": [
            "length"
          ],
          "separated" : true
        }
      }
    },
    "collapse": {
      "_": {
        "values": [
          "collapse",
          "separate"
        ]
      }
    },
    "end": {
      "end": {
        "radius": {
          "_": {
            "type": [
              "length"
            ]
          }
        }
      },
      "start": {
        "radius": {
          "_": {
            "ref": "$up.$up.end.radius"
          }
        }
      }
    },
    "image": {
      "outset": {
        "_": {
          "type": [
            "unit"
          ],
          "units": [
            "",
            "px"
          ],
          "separated" : true
        }
      },
      "repeat": {
        "_": {
          "values": [
            "stretch",
            "repeat",
            "round",
            "space"
          ]
        }
      },
      "slice": {
        "_": {
          "type": [
            "custom",
            "unit",
            "procent"
          ],
          "values": [
            "fill"
          ],
          "units": [
            ""
          ]
        }
      },
      "source": {
        "_": {
          "type": [
            "url"
          ]
        }
      },
      "width": {
        "_": {
          "values": [
            "auto"
          ],
          "type": [
            "custom",
            "length",
            "procent"
          ]
        }
      }
    },
    "inline": {
      "end": {
        "color": {
          "_": {
            "type": [
              "color"
            ]
          }
        },
        "style": {
          "_": {
            "values": [
              "none",
              "dashed",
              "dotted",
              "solid",
              "hidden",
              "double"
            ],
            "separated" : true
          }
        },
        "width": {
          "_": {
            "values": [
              "thick"
            ],
            "type": [
              "length",
              "custom"
            ]
          }
        }
      },
      "start": {
        "ref" : "$up.end"
      }
    },
    "left": {
      "color": {
        "_": {
          "ref": "$up.bottom.color"
        }
      },
      "style": {
        "_": {
          "ref": "$up.bottom.style"
        }
      },
      "width": {
        "_": {
          "ref": "$up.bottom.width"
        }
      }
    },
    "right": {
      "ref" : "$up.left"
    },
    "spacing": {
      "_": {
        "type": [
          "length"
        ],
        "separated" : true
      }
    },
    "start": {
      "ref" : "$up.end"
    },
    "top": {
      "ref" : "$up.bottom"
    }
  },
  "bottom": {
    "_": {
      "values": [
        "auto"
      ],
      "type": [
        "length",
        "procent",
        "custom"
      ]
    }
  },
  "box": {
    "decoration": {
      "break": {
        "_": {
          "values": [
            "slice",
            "clone"
          ]
        }
      }
    },
    "shadow": {
      "_": {
        "values": [
          "inset"
        ],
        "type": [
          "color",
          "custom"
        ],
        "multi": true,
        "separated" : true
      }
    },
    "sizing": {
      "_": {
        "values": [
          "content-box",
          "border-box"
        ]
      }
    }
  },
  "break": {
    "after": {
      "_": {
        "values": [
          "auto",
          "always",
          "left",
          "right",
          "recto",
          "verso",
          "page",
          "column",
          "region",
          "avoid",
          "avoid-page",
          "avoid-column",
          "avoid-region"
        ]
      }
    },
    "before": {
      "_": {
        "ref": "$up.after"
      }
    },
    "inside": {
      "_": {
        "values": [
          "auto",
          "avoid",
          "avoid-page",
          "avoid-column",
          "avoid-region"
        ]
      }
    }
  },
  "caption": {
    "side": {
      "_": {
        "values": [
          "top",
          "bottom",
          "left",
          "right",
          "top-outside",
          "bottom-outside"
        ]
      }
    }
  },
  "caret": {
    "color": {
      "_": {
        "values": [
          "auto"
        ],
        "type": [
          "color",
          "custom"
        ]
      }
    }
  },
  "clear": {
    "_": {
      "values": [
        "none",
        "left",
        "right",
        "both",
        "inline-start",
        "inline-end"
      ]
    }
  },
  "clip": {
    "_": {
      "values": [
        "auto"
      ],
      "type": [
        "custom",
        "shape"
      ]
    },
    "path": {
      "_": {
        "values": [
          "none",
          "fill-box",
          "stroke-box",
          "view-box",
          "margin-box",
          "border-box",
          "padding-box",
          "content-box"
        ],
        "type": [
          "ulr",
          "custom",
          "geometry"
        ],
        "separated" : true
      }
    },
    "rule": {
      "_": {
        "values": [
          "nonzero",
          "evenodd"
        ]
      }
    }
  },
  "color": {
    "_": {
      "type": [
        "color"
      ]
    },
    "adjust": {
      "_": {
        "values": [
          "economy",
          "exact"
        ]
      }
    },
    "interpolation": {
      "filters": {
        "_": {
          "value": [
            "auto",
            "sRGB",
            "linearRGB"
          ]
        }
      }
    }
  },
  "column": {
    "count": {
      "_": {
        "values": [
          "auto"
        ],
        "type": [
          "number",
          "custom"
        ]
      }
    },
    "fill": {
      "_": {
        "values": [
          "auto",
          "balance",
          "balance-all"
        ]
      }
    },
    "gap": {
      "_": {
        "values": [
          "normal"
        ],
        "types": [
          "custom",
          "length",
          "procent"
        ]
      }
    },
    "rule": {
      "color": {
        "_": {
          "types": [
            "color"
          ]
        }
      },
      "style": {
        "_": {
          "values": [
            "none",
            "hidden",
            "dotted",
            "dashed",
            "solid",
            "double",
            "groove",
            "ridge",
            "inset",
            "outset"
          ]
        }
      },
      "width": {
        "_": {
          "values": [
            "thin",
            "medium",
            "thick"
          ],
          "types": [
            "custom",
            "length"
          ]
        }
      }
    },
    "span": {
      "_": {
        "values": [
          "none",
          "all"
        ]
      }
    },
    "width": {
      "_": {
        "values": [
          "auto"
        ],
        "types": [
          "custom",
          "length"
        ]
      }
    }
  },
  "contain": {
    "_": {
      "values": [
        "none",
        "strict",
        "content",
        "size",
        "layout",
        "style",
        "paint"
      ],
      "separated" : true
    }
  },
  "content": {
    "_": {
      "values": [
        "normal",
        "none",
        "open-quote",
        "close-quote",
        "no-open-quote",
        "no-close-quote"
      ],
      "type": [
        "custom",
        "string",
        "url",
        "attr",
        "variable"
      ],
      "separated" : true
    }
  },
  "counter": {
    "increment": {
      "_": {
        "values": [
          "none"
        ],
        "types": [
          "variable",
          "number"
        ],
        "separated" : true
      }
    },
    "reset": {
      "_": {
        "ref": "$up.increment"
      }
    },
    "set": {
      "_": {
        "ref": "$up.increment"
      }
    }
  },
  "cursor": {
    "_": {
      "values": [
        "alias",
        "all-scroll",
        "auto",
        "cell",
        "context-menu",
        "col-resize",
        "copy",
        "crosshair",
        "default",
        "e-resize",
        "ew-resize",
        "grab",
        "grabbing",
        "help",
        "move",
        "n-resize",
        "ne-resize",
        "nesw-resize",
        "ns-resize",
        "nw-resize",
        "nwse-resize",
        "no-drop",
        "none",
        "not-allowed",
        "pointer",
        "progress",
        "row-resize",
        "s-resize",
        "se-resize",
        "sw-resize",
        "text",
        "w-resize",
        "wait",
        "zoom-in",
        "zoom-out"
      ],
      "type": [
        "custom",
        "url"
      ]
    }
  },
  "cx": {
    "_": {
      "type": [
        "number"
      ]
    }
  },
  "cy": {
    "_": {
      "ref": "$up.$up.cx"
    }
  },
  "direction": {
    "_": {
      "values": [
        "ltr",
        "rtl"
      ]
    }
  },
  "display": {
    "_": {
      "values": [
        "block",
        "inline",
        "inline-block",
        "flex",
        "inline-flex",
        "grid",
        "inline-grid",
        "flow-root",
        "table",
        "table-row",
        "list-item",
        "inline-table"
      ],
      "separated" : true
    }
  },
  "dominant": {
    "baseline": {
      "_": {
        "values": [
          "auto",
          "middle",
          "hanging"
        ]
      }
    }
  },
  "empty": {
    "cells": {
      "_": {
        "values": [
          "show",
          "hide"
        ]
      }
    }
  },
  "fill": {
    "_": {
      "type": [
        "color"
      ]
    },
    "opacity": {
      "_": {
        "type": [
          "number"
        ]
      }
    },
    "rule": {
      "_": {
        "values": [
          "evenodd",
          "nonzero"
        ]
      }
    }
  },
  "filter": {
    "_": {
      "type": [
        "function"
      ],
      "functions": {
        "url": "string",
        "blur": "length",
        "brightness": "number",
        "contrast": "procent",
        "drop-shadow": "shadow",
        "greyscale": "procent",
        "hue-rotate": "degree",
        "invert": "procent",
        "opacity": "procent"
      }
    }
  },
  "flex": {
    "basis": {
      "_": {
        "values": [
          "auto",
          "fill",
          "max-content",
          "min-content",
          "fit-content",
          "content"
        ],
        "type": [
          "custom",
          "length"
        ]
      }
    },
    "direction": {
      "_": {
        "values": [
          "row",
          "row-reverse",
          "column",
          "cloumn-reverse"
        ]
      }
    },
    "grow": {
      "_": {
        "type": [
          "number"
        ]
      }
    },
    "shrink": {
      "_": {
        "type": [
          "number"
        ]
      }
    },
    "wrap": {
      "_": {
        "values": [
          "nowrap",
          "wrap",
          "wrap-reverse"
        ]
      }
    }
  },
  "float": {
    "_": {
      "values": [
        "left",
        "right",
        "none",
        "inline-start",
        "inline-end"
      ]
    }
  },
  "flood": {
    "color": {
      "_": {
        "type": [
          "color"
        ]
      }
    },
    "opacity": {
      "_": {
        "type": [
          "number"
        ]
      }
    }
  },
  "font": {
    "family": {
      "_": {
        "values": [
          "serif",
          "sans-serif",
          "monospace",
          "cursive",
          "fantasy",
          "system-ui",
          "ui-serif",
          "ui-sans-serif",
          "ui-monospace",
          "ui-rounded",
          "emoji",
          "math",
          "fangsong"
        ],
        "type": [
          "custom",
          "style"
        ]
      }
    },
    "feature": {
      "settings": {
        "_": {
          "values": [
            "liga",
            "dlig",
            "onum",
            "lnum",
            "tnum",
            "zero",
            "frac",
            "sups",
            "subs",
            "smpc",
            "c2sc",
            "case",
            "hlig",
            "calt",
            "swsh",
            "hist",
            "ss**",
            "kern",
            "locl",
            "rlig",
            "medi",
            "init",
            "isol",
            "fina",
            "mark",
            "mkmk"
          ],
          "type": [
            "custom",
            "number"
          ],
          "multi": true,
          "separated" : true
        }
      }
    },
    "kerning": {
      "_": {
        "values": [
          "auto",
          "normal",
          "none"
        ]
      }
    },
    "language": {
      "override": {
        "_": {
          "values": [
            "none"
          ],
          "type": [
            "custom",
            "string"
          ]
        }
      }
    },
    "optical": {
      "sizing": {
        "_": {
          "values": [
            "auto",
            "none"
          ]
        }
      }
    },
    "size": {
      "_": {
        "values": [
          "xx-small",
          "x-small",
          "small",
          "medium",
          "large",
          "x-large",
          "xx-large",
          "larger",
          "smaller"
        ],
        "type": [
          "custom",
          "length",
          "procent"
        ]
      },
      "adjust": {
        "_": {
          "values": [
            "none"
          ],
          "type": [
            "custom",
            "number"
          ]
        }
      }
    },
    "stretch": {
      "_": {
        "values": [
          "normal",
          "semi-condensed",
          "condensed",
          "extra-condensed",
          "ultra-condensed",
          "semi-expanded",
          "expanded",
          "extra-expanded",
          "ultra-expanded"
        ],
        "type": [
          "custom",
          "procent"
        ]
      }
    },
    "style": {
      "_": {
        "values": [
          "normal",
          "italic",
          "oblique"
        ],
        "type": [
          "custom",
          "degree"
        ],
        "separated" : true
      }
    },
    "synthesis": {
      "_": {
        "values": [
          "none",
          "weight",
          "style"
        ],
        "separated" : true
      }
    },
    "variant": {
      "_": {
        "values" : [
          "normal",
          "none",
          "common-ligatures",
          "no-common-ligatures",
          "discretionary-ligatures",
          "no-discretionary-ligatures",
          "historical-ligatures",
          "no-historical-ligatures",
          "contextual",
          "no-contextual",
          "historical-forms",
          "small-caps",
          "all-small-caps",
          "petite-caps",
          "all-petite-caps",
          "unicase",
          "titling-caps",
          "lining-nums",
          "oldstyle-nums",
          "proportional-nums",
          "tabular-nums",
          "diagonal-fractions",
          "stacked-fractions",
          "ordinal",
          "slashed-zero",
          "jis78",
          "jis83",
          "jis90",
          "jis04",
          "simplified",
          "traditional",
          "full-width",
          "proportional-width",
          "ruby"
        ],
        "functions" : [
          "stylistic",
          "styleset",
          "character-variant",
          "swash",
          "ornaments",
          "annotation"
        ],
        "type": [
          "custom",
          "functions"
        ],
        "separated" : true
      },
      "alternates": {
        "_": {
          "values" : [
            "normal",
            "historical-forms"
          ],
          "functions" : [
            "stylistic",
            "styleset",
            "character-variant",
            "swash",
            "ornaments",
            "annotation"
          ],
          "type": [
            "custom",
            "functions"
          ],
          "separated" : true
        }
      },
      "caps": {
        "_": {
          "values" : [
            "normal",
            "small-caps",
            "all-small-caps",
            "petite-caps",
            "all-petite-caps",
            "unicase",
            "titling-caps"
          ]
        }
      },
      "east": {
        "asian": {
          "_": {
            "values" : [
              "jis78",
              "jis83",
              "jis90",
              "jis04",
              "simplified",
              "traditional",
              "full-width",
              "proportional-width",
              "ruby"
            ],
            "separated" : true
          }
        }
      },
      "ligatures": {
        "_": {
          "values" : [
            "normal",
            "none",
            "common-ligatures",
            "no-common-ligatures",
            "discretionary-ligatures",
            "no-discretionary-ligatures",
            "historical-ligatures",
            "no-historical-ligatures",
            "contextual",
            "no-contextual"
          ]
        }
      },
      "numeric": {
        "_": {
          "values" : [
            "normal",
            "lining-nums",
            "oldstyle-nums",
            "proportional-nums",
            "tabular-nums",
            "diagonal-fractions",
            "stacked-fractions",
            "ordinal",
            "slashed-zero"
          ],
          "separated" : true
        }
      },
      "position": {
        "_": {
          "values" : [
            "normal",
            "sub",
            "super"
          ]
        }
      }
    },
    "variation": {
      "settings": {
        "_": {
          "values" : [
            "normal",
            "wght",
            "wdth",
            "slnt",
            "ital",
            "opsz"
          ],
          "type" : [
            "custom",
            "number"
          ],
          "separated" : true
        }
      }
    },
    "weight": {
      "_": {
        "values" : [
          "normal",
          "bold",
          "lighter",
          "bolder"
        ],
        "type" : [
          "custom",
          "number"
        ]
      }
    }
  },
  "grid": {
    "auto": {
      "columns": {
        "_": {
          "values" : [
            "auto",
            "min-content",
            "max-content"
          ],
          "type" : [
            "length",
            "procent",
            "unit",
            "function"
          ],
          "units" : [
            "fr"
          ],
          "functions" : [
            "minmax",
            "fit-content"
          ],
          "separated" : true
        }
      },
      "flow": {
        "_": {
          "values" : [
            "row",
            "column",
            "dense"
          ],
          "separated" : true
        }
      },
      "rows": {
        "_": {
          "ref" : "$up.columns"
        }
      }
    },
    "column": {
      "end": {
        "_": {
          "values" : [
            "auto",
            "span"
          ],
          "type" : [
            "custom",
            "number",
            "string"
          ],
          "seperated" : true
        }
      },
      "start": {
        "_": {
          "ref" : "$up.end"
        }
      }
    },
    "row": {
      "end": {
        "_": {
          "ref" : "$up.$up.end"
        }
      },
      "start": {
        "_": {
          "ref" : "$up.$up.end"
        }
      }
    },
    "template": {
      "areas": {
        "_": {
          "type" : [
            "string"
          ],
          "seperated" : true
        }
      },
      "columns": {
        "_": {
          "custom" : [
            "min-content",
            "max-content"
          ],
          "type" : [
            "custom",
            "unit",
            "length",
            "procent",
            "function",
            "linename"
          ],
          "units" : [
            "fr"
          ],
          "functions" : [
            "minmax",
            "fit-content",
            "repeat",
            "subgrid",
            "masonery"
          ],
          "seperated" : true
        }
      },
      "rows": {
        "_": {
          "ref" : "$up.columns"
        }
      }
    }
  },
  "height": {
    "_": {
      "values" : [
        "auto",
        "max-content",
        "min-content"
      ],
      "type": [
        "custom",
        "length",
        "procent",
        "function"
      ],
      "function" : [
        "fit-content"
      ]
    }
  },
  "hyphens": {
    "_": {
      "values" : [
        "none",
        "manual",
        "auto"
      ]
    }
  },
  "image": {
    "orientation": {
      "_": {
        "depricated" : true
      }
    },
    "rendering": {
      "_": {
        "values" : [
          "auto",
          "crisp-edges",
          "pixelated",
          "smooth",
          "high-quality",
          ""
        ]
      }
    }
  },
  "ime": {
    "mode": {
      "_": {
        "depricated" : true
      }
    }
  },
  "inline": {
    "size": {
      "_": {
        "ref" : "/.width"
      }
    }
  },
  "inset": {
    "block": {
      "end": {
        "_": {
          "values" : [
            "auto"
          ],
          "type" : [
            "custom",
            "length",
            "procent"
          ]
        }
      },
      "start": {
        "_": {
          "ref" : "$up.end"
        }
      }
    },
    "inline": {
      "end": {
        "_": {
          "ref" : "$up.$up.end"
        }
      },
      "start": {
        "_": {
          "ref" : "$up.$up.end"
        }
      }
    }
  },
  "isolation": {
    "_": {
      "values": [
        "auto",
        "isolate"
      ]
    }
  },
  "justify": {
    "content": {
      "_": {
        "values" : [
          "center",
          "start",
          "end",
          "flex-start",
          "flex-end",
          "left",
          "right",
          "normal",
          "space-between",
          "space-around",
          "space-evenly",
          "stratch",
          "safe",
          "unsafe",
          "baseline",
          "first",
          "last"
        ],
        "seperated" : true
      }
    },
    "items": {
      "_": {
        "ref" : "$up.content",
        "add" : {
          "values" : [
            "legacy"
          ]
        }
      }
    },
    "self": {
      "_": {
        "ref" : "$up.content"
      }
    }
  },
  "left": {
    "_": {
      "ref" : "$up.bottom"
    }
  },
  "letter": {
    "spacing": {
      "_": {
        "values" : [
          "normal"
        ],
        "type" : [
          "custom",
          "length"
        ]
      }
    }
  },
  "lighting": {
    "color": {
      "_": {
        "type" : [
          "color"
        ]
      }
    }
  },
  "line": {
    "break": {
      "_": {
        "values" : [
          "auto",
          "loose",
          "normal",
          "strict",
          "anywhere"
        ]
      }
    },
    "height": {
      "_": {
        "values" : [
          "normal"
        ],
        "type" : [
          "custom",
          "numeric",
          "length",
          "procent"
        ]
      }
    }
  },
  "list": {
    "style": {
      "image": {
        "_": {
          "type" : [
            "custom",
            "image"
          ],
          "values" : [
            "none"
          ]
        }
      },
      "position": {
        "_": {
          "values" : [
            "inside",
            "outside"
          ]
        }
      },
      "type": {
        "_": {
          "values" : [
            "disc",
            "circle",
            "square",
            "decimal",
            "georgian",
            "trad-chinese-informal",
            "kannada",
            "none"
          ],
          "type" : [
            "custom",
            "string",
            "value-string"
          ]
        }
      }
    }
  },
  "margin": {
    "block": {
      "end": {
        "_": {
          "values" : [
            "auto"
          ],
          "type" : [
            "custom",
            "length",
            "procent"
          ]
        }
      },
      "start": {
        "_": {
          "ref" : "$up.end"
        }
      }
    },
    "bottom": {
      "_": {
        "ref" : "$up.block.end"
      }
    },
    "inline": {
      "end": {
        "_": {
          "ref" : "$up.$up.block.end"
        }
      },
      "start": {
        "_": {
          "ref" : "$up.$up.block.end"
        }
      }
    },
    "left": {
      "_": {
        "ref" : "$up.block.end"
      }
    },
    "right": {
      "_": {
        "ref" : "$up.block.end"
      }
    },
    "top": {
      "_": {
        "ref" : "$up.block.end"
      }
    }
  },
  "marker": {
    "end": {
      "_": {
        "values" : [
          "none"
        ],
        "type": [
          "custom",
          "url"
        ]
      }
    },
    "mid": {
      "_": {
        "ref" : "$up.end"
      }
    },
    "start": {
      "_": {
        "ref" : "$up.end"
      }
    }
  },
  "mask": {
    "_": {
      "type" : [
        "image",
        "custom"
      ],
      "values" : [
        "add",
        "subtract",
        "intersect",
        "exclude",

        "content-box",
        "padding-box",
        "border-box",
        "margin-box",
        "fill-box",
        "stroke-box",
        "view-box",
        "no-clip",
        "border",
        "padding",
        "content",
        "text",

        "repeat-x",
        "repeat-y",
        "repeat",
        "space",
        "round",
        "no-repeat",

        "cover",
        "contain",

        "auto",
        "none",

        "alpha",
        "luminance",
        "match-source",

        "top",
        "right",
        "left",
        "bottom",
        "center",

        "length",
        "procent"
      ],
      "multi" : true,
      "seperated" : true
    },
    "clip": {
      "_": {
        "values" : [
          "content-box",
          "padding-box",
          "border-box",
          "margin-box",
          "fill-box",
          "stroke-box",
          "view-box",
          "no-clip",
          "border",
          "padding",
          "content",
          "text"
        ],
        "multi" : true,
        "seperated" : true
      }
    },
    "composite": {
      "_": {
        "values" : [
          "add",
          "subtract",
          "intersect",
          "exclude"
        ]
      }
    },
    "image": {
      "_": {
        "type" : [
          "image",
          "custom"
        ],
        "values" : [
          "none"
        ]
      }
    },
    "mode": {
      "_": {
        "values" : [
          "alpha",
          "luminance",
          "match-source"
        ],
        "multi" : true
      }
    },
    "origin": {
      "_": {
        "values" : [
          "content-box",
          "padding-box",
          "border-box",
          "margin-box",
          "fill-box",
          "stroke-box",
          "view-box",
          "border",
          "padding",
          "content"
        ],
        "multi" : true
      }
    },
    "position": {
      "_": {
        "type" : [
          "position"
        ],
        "seperated" : true,
        "multi" : true
      }
    },
    "repeat": {
      "_": {
        "values" : [
          "repeat-x",
          "repeat-y",
          "repeat",
          "space",
          "round",
          "no-repeat"
        ],
        "multi" : true,
        "seperated" : true
      }
    },
    "size": {
      "_": {
        "values" : [
          "cover",
          "contain",
          "auto"
        ],
        "type" : [
          "custom",
          "length",
          "procent"
        ],
        "multi" : true,
        "seperated" : true
      }
    },
    "type": {
      "_": {
        "values" : [
          "luminance",
          "alpha"
        ]
      }
    }
  },
  "max": {
    "block": {
      "size": {
        "_": {
          "ref" : "/.max.height"
        }
      }
    },
    "height": {
      "_": {
        "values" : [
          "max-content",
          "min-content",
          "auto"
        ],
        "type" : [
          "custom",
          "function",
          "length",
          "procent"
        ],
        "functions" : [
          "fit-content"
        ]
      }
    },
    "inline": {
      "size": {
        "_": {
          "ref" : "/.max.height"
        }
      }
    },
    "width": {
      "_": {
        "ref" : "/.max.height"
      }
    }
  },
  "min": {
    "block": {
      "size": {
        "_": {
          "ref" : "/.max.height"
        }
      }
    },
    "height": {
      "_": {
        "ref" : "/.max.height"
      }
    },
    "inline": {
      "size": {
        "_": {
          "ref" : "/.max.height"
        }
      }
    },
    "width": {
      "_": {
        "ref" : "/.max.height"
      }
    }
  },
  "mix": {
    "blend": {
      "mode": {
        "_": {
          "values" : [
            "normal",
            "multiply",
            "screen",
            "overlay",
            "darken",
            "lighten",
            "color-dodge",
            "color-burn",
            "hard-light",
            "soft-light",
            "difference",
            "exclusion",
            "hue",
            "saturation",
            "color",
            "luminosity"
          ]
        }
      }
    }
  },
  "object": {
    "fit": {
      "_": {
        "values" : [
          "fill",
          "contain",
          "cover",
          "none",
          "scale-down"
        ]
      }
    },
    "position": {
      "_": {
        "type": [
          "position"
        ]
      }
    }
  },
  "offset": {
    "anchor": {
      "_": {
        "type": [
          "position"
        ]
      }
    },
    "distance": {
      "_": {
        "type" : [
          "length",
          "procent"
        ]
      }
    },
    "path": {
      "_": {
        "values" : [
          "none",
          "margin-box",
          "stroke-box"
        ],
        "type" : [
          "custom",
          "image"
        ]
      }
    },
    "rotate": {
      "_": {
        "values" : [
          "auto",
          "reverse"
        ],
        "type" : [
          "custom",
          "degree"
        ],
        "seperated" : true
      }
    }
  },
  "opacity": {
    "_": {
      "type" : [
        "number"
      ]
    }
  },
  "order": {
    "_": {
      "type" : [
        "number"
      ]
    }
  },
  "outline": {
    "color": {
      "_": {
        "values" : [
          "invert"
        ],
        "type" : [
          "custom",
          "color"
        ]
      }
    },
    "offset": {
      "_": {
        "type" : [
          "length"
        ]
      }
    },
    "style": {
      "_": {
        "values" : [
          "auto",
          "none",
          "dotted",
          "dashed",
          "solid",
          "groove",
          "double",
          "ridge",
          "inset",
          "outset"
        ]
      }
    },
    "width": {
      "_": {
        "values" : [
          "thin",
          "medium",
          "thick"
        ],
        "type" : [
          "custom",
          "length"
        ]
      }
    }
  },
  "overflow": {
    "_": {
      "values" : [
        "visible",
        "hidden",
        "clip",
        "scroll",
        "auto"
      ],
      "seperated" : true
    },
    "anchor": {
      "_": {
        "values" : [
          "auto",
          "none"
        ]
      }
    },
    "block": {
      "_": {
        "values" : [
          "visible",
          "hidden",
          "scroll",
          "auto"
        ]
      }
    },
    "inline": {
      "_": {
        "ref" : "$up.block"
      }
    },
    "wrap": {
      "_": {
        "values" : [
          "normal",
          "break-word",
          "anywhere"
        ]
      }
    },
    "x": {
      "_": {
        "ref" : "/.overflow"
      }
    },
    "y": {
      "_": {
        "ref" : "/.overflow"
      }
    }
  },
  "overscroll": {
    "behavior": {
      "block": {
        "_": {
          "values" : [
            "auto",
            "contain",
            "none"
          ]
        }
      },
      "inline": {
        "_": {
          "ref" : "$up.block"
        }
      },
      "x": {
        "_": {
          "ref" : "$up.block"
        }
      },
      "y": {
        "_": {
          "ref" : "$up.block"
        }
      }
    }
  },
  "padding": {
    "block": {
      "end": {
        "_": {
          "type" : [
            "length",
            "procent"
          ]
        }
      },
      "start": {
        "_": {
          "ref": "$up.end"
        }
      }
    },
    "bottom": {
      "_": {
        "type" : [
          "length",
          "procent"
        ]
      }
    },
    "inline": {
      "end": {
        "_": {
          "ref": "/.padding.block.end"
        }
      },
      "start": {
        "_": {
          "ref": "/.padding.block.end"
        }
      }
    },
    "left": {
      "_": {
        "ref": "$up.bottom"
      }
    },
    "right": {
      "_": {
        "ref": "$up.bottom"
      }
    },
    "top": {
      "_": {
        "ref": "$up.bottom"
      }
    }
  },
  "page": {
    "break": {
      "after": {
        "_": {
          "values" : [
            "auto",
            "always",
            "avoid",
            "left",
            "right",
            "recto",
            "verso"
          ]
        }
      },
      "before": {
        "_": {
          "ref": "$up.after"
        }
      }
    }
  },
  "paint": {
    "order": {
      "_": {
        "values" : [
          "normal",
          "stroke",
          "fill",
          "markers"
        ]
      }
    }
  },
  "perspective": {
    "_": {
      "values" : [
        "none"
      ],
      "type" : [
        "custom",
        "length"
      ]
    },
    "origin": {
      "_": {
        "values" : [
          "left",
          "right",
          "center"
        ],
        "type" : [
          "custom",
          "length",
          "procent"
        ],
        "seperated" : true
      }
    }
  },
  "pointer": {
    "events": {
      "_": {
        "values" : [
          "auto",
          "none",
          "visiblePainted",
          "visibleFill",
          "visibleStroke",
          "visible",
          "painted",
          "fill",
          "stroke",
          "all"
        ]
      }
    }
  },
  "position": {
    "_": {
      "type" : [
        "position"
      ]
    }
  },
  "quotes": {
    "_": {
      "values" : [
        "none"
      ],
      "type" : [
        "value-string"
      ],
      "seperated" : true
    }
  },
  "r": {
    "_": {
      "type": [
        "number",
        "procent"
      ]
    }
  },
  "resize": {
    "_": {
      "values": [
        "none",
        "both",
        "horizontal",
        "vertical",
        "block",
        "inline"
      ]
    }
  },
  "right": {
    "_": {
      "ref" : "$up.bottom"
    }
  },
  "rotate": {
    "_": {
      "values": [
        "none",
        "x",
        "y",
        "z"
      ],
      "type": [
        "custom",
        "degree",
        "unit"
      ],
      "units": [
        "turn",
        "rad"
      ],
      "seperated" : true
    }
  },
  "row": {
    "gap": {
      "_": {
        "type" : [
          "length",
          "procent"
        ]
      }
    }
  },
  "ruby": {
    "align": {
      "_": {
        "values" : [
          "start",
          "center",
          "space-between",
          "space-around"
        ]
      }
    },
    "position": {
      "_": {
        "values" : [
          "over",
          "under",
          "inter-character",
          "alternate"
        ]
      }
    }
  },
  "rx": {
    "_": {
      "type" : [
        "number"
      ]
    }
  },
  "ry": {
    "_": {
      "type" : [
        "number"
      ]
    }
  },
  "scale": {
    "_": {
      "values" : [
        "none"
      ],
      "type" : [
        "custom",
        "number"
      ],
      "seperated" : true
    }
  },
  "scroll": {
    "behavior": {
      "_": {
        "values" : [
          "auto",
          "smooth"
        ]
      }
    },
    "margin": {
      "block": {
        "end": {
          "_": {
            "type" : [
              "length"
            ]
          }
        },
        "start": {
          "_": {
            "type" : [
              "length"
            ]
          }
        }
      },
      "bottom": {
        "_": {
          "type" : [
            "length"
          ]
        }
      },
      "inline": {
        "end": {
          "_": {
            "type" : [
              "length"
            ]
          }
        },
        "start": {
          "_": {
            "type" : [
              "length"
            ]
          }
        }
      },
      "left": {
        "_": {
          "type" : [
            "length"
          ]
        }
      },
      "right": {
        "_": {
          "type" : [
            "length"
          ]
        }
      },
      "top": {
        "_": {
          "type" : [
            "length"
          ]
        }
      }
    },
    "padding": {
      "block": {
        "end": {
          "_": {
            "values" : [
              "auto"
            ],
            "type" : [
              "custom",
              "length",
              "procent"
            ]
          }
        },
        "start": {
          "_": {
            "ref": "$up.end"
          }
        }
      },
      "bottom": {
        "_": {
          "ref": "$up.block.end"
        }
      },
      "inline": {
        "end": {
          "_": {
            "values" : [
              "auto"
            ],
            "type" : [
              "custom",
              "length"
            ]
          }
        },
        "start": {
          "_": {
            "ref" : "$up.end"
          }
        }
      },
      "left": {
        "_": {
          "ref": "$up.block.end"
        }
      },
      "right": {
        "_": {
          "ref": "$up.block.end"
        }
      },
      "top": {
        "_": {
          "ref": "$up.block.end"
        }
      }
    },
    "snap": {
      "align": {
        "_": {
          "values" : [
            "none",
            "start",
            "end",
            "center"
          ],
          "seperated" : true
        }
      },
      "type": {
        "_": {
          "values" : [
            "none",
            "x",
            "y",
            "block",
            "inline",
            "both",
            "mandatory",
            "proximity"
          ],
          "seperated" : true
        }
      }
    }
  },
  "scrollbar": {
    "color": {
      "_": {
        "values" : [
          "auto",
          "dark",
          "light"
        ],
        "type" : [
          "custom",
          "color"
        ],
        "seperated" : true
      }
    },
    "width": {
      "_": {
        "values" : [
          "auto",
          "thin",
          "none"
        ]
      }
    }
  },
  "shape": {
    "image": {
      "threshold": {
        "_": {
          "type" : [
            "number"
          ]
        }
      }
    },
    "margin": {
      "_": {
        "type" : [
          "length",
          "procent"
        ]
      }
    },
    "outside": {
      "_": {
        "values" : [
          "none",
          "margin-box",
          "content-box",
          "border-box",
          "padding-box"
        ],
        "type" : [
          "custom",
          "image"
        ]
      }
    },
    "rendering": {
      "_": {
        "values" : [
          "auto",
          "optimizeSpeed",
          "crispEdges",
          "geometricPrecision"
        ]
      }
    }
  },
  "stop": {
    "color": {
      "_": {
        "type" : [
          "color"
        ]
      }
    },
    "opacity": {
      "_": {
        "type" : [
          "number"
        ]
      }
    }
  },
  "stroke": {
    "_": {
      "values" : [
        "none",
        "context-fill",
        "context-stroke"
      ],
      "type" :[
        "custom",
        "color",
        "function"
      ],
      "functions" : [
        "url"
      ]
    },
    "dasharray": {
      "_": {
        "type" : [
          "number"
        ],
        "seperated" : true
      }
    },
    "dashoffset": {
      "_": {
        "type" : [
          "number"
        ]
      }
    },
    "linecap": {
      "_": {
        "values" : [
          "butt",
          "round",
          "square"
        ]
      }
    },
    "linejoin": {
      "_": {
        "values" : [
          "arcs",
          "bevel",
          "miter",
          "miter-clip",
          "round"
        ]
      }
    },
    "miterlimit": {
      "_": {
        "type" : [
          "numeric"
        ]
      }
    },
    "opacity": {
      "_": {
        "type" : [
          "numeric",
          "procent"
        ]
      }
    },
    "width": {
      "_": {
        "type" : [
          "numeric",
          "length",
          "procent"
        ]
      }
    }
  },
  "table": {
    "layout": {
      "_": {
        "values" : [
          "auto",
          "fixed"
        ]
      }
    }
  },
  "text": {
    "align": {
      "_": {
        "values" : [
          "left",
          "right",
          "center",
          "justify",
          "justify-all",
          "start",
          "end",
          "match-parent"
        ]
      },
      "last": {
        "_": {
          "values" : [
            "auto",
            "start",
            "end",
            "left",
            "right",
            "center",
            "justify"
          ]
        }
      }
    },
    "anchor": {
      "_": {
        "values" : [
          "start",
          "middle",
          "end"
        ]
      }
    },
    "combine": {
      "upright": {
        "_": {
          "values" : [
            "none",
            "all",
            "digits"
          ],
          "type" : [
            "custom",
            "numeric"
          ],
          "seperated" : true
        }
      }
    },
    "decoration": {
      "_": {
        "join" : [
          "$up.line",
          "$up.color",
          "$up.style",
          "$up.thickness"
        ]
      },
      "color": {
        "_": {
          "type" : [
            "color"
          ]
        }
      },
      "line": {
        "_": {
          "values" : [
            "none",
            "underline",
            "overline",
            "line-through",
            "blink"
          ],
          "seperated" : true
        }
      },
      "skip": {
        "ink": {
          "_": {
            "values" : [
              "auto",
              "all",
              "none"
            ]
          }
        }
      },
      "style": {
        "_": {
          "values" : [
            "solid",
            "double",
            "dotted",
            "dashed",
            "wavy"
          ]
        }
      },
      "thickness": {
        "_": {
          "values" : [
            "auto",
            "from-font"
          ],
          "type" : [
            "custom",
            "length",
            "procent"
          ]
        }
      }
    },
    "emphasis": {
      "color": {
        "_": {
          "type" : [
            "color"
          ]
        }
      },
      "position": {
        "_": {
          "values" : [
            "over",
            "under",
            "right",
            "left"
          ],
          "seperated" : true
        }
      },
      "style": {
        "_": {
          "values" : [
            "none",
            "filled",
            "open",
            "dot",
            "circle",
            "double-circle",
            "triangle",
            "sesame"
          ],
          "type" : [
            "custom",
            "value-string"
          ]
        }
      }
    },
    "indent": {
      "_": {
        "values" : [
          "each-line",
          "hanging"
        ],
        "type" : [
          "custom",
          "length",
          "procent"
        ]
      }
    },
    "justify": {
      "_": {
        "values" : [
          "none",
          "auto",
          "inter-word",
          "inter-character",
          "distribute"
        ]
      }
    },
    "orientation": {
      "_": {
        "values" : [
          "mixed",
          "upright",
          "sideways-right",
          "sideways",
          "use-glyph-orientation"
        ]
      }
    },
    "overflow": {
      "_": {
        "values" : [
          "clip",
          "ellipsis",
          "fade"
        ],
        "type" : [
          "custom",
          "value-string"
        ]
      }
    },
    "rendering": {
      "_": {
        "values" : [
          "auto",
          "optimizeSpeed",
          "optimizeLegibility",
          "geometricPrecision"
        ]
      }
    },
    "shadow": {
      "_": {
        "type" : [
          "length",
          "color"
        ],
        "seperated" : true,
        "multi" : true
      }
    },
    "transform": {
      "_": {
        "values" : [
          "none",
          "capitalize",
          "uppercase",
          "lowercase",
          "full-width",
          "full-size-kana"
        ]
      }
    },
    "underline": {
      "offset": {
        "_": {
          "values" : [
            "auto"
          ],
          "type" : [
            "custom",
            "length",
            "procent"
          ]
        }
      },
      "position": {
        "_": {
          "values" : [
            "auto",
            "under",
            "left",
            "right"
          ],
          "seperated" : true
        }
      }
    }
  },
  "top": {
    "_": {
      "ref" : "/.bottom"
    }
  },
  "touch": {
    "action": {
      "_": {
        "values" : [
          "auto",
          "none",
          "pan-x",
          "pan-left",
          "pan-right",
          "pan-y",
          "pan-up",
          "pan-down",
          "pinch-zoom",
          "manipulation"
        ]
      }
    }
  },
  "transform": {
    "_": {
      "values" : [
        "none"
      ],
      "type" : [
        "custom",
        "function"
      ],
      "functions" : [
        "matrix",
        "matrix3d",
        "perspective",
        "rotate",
        "rotate3d",
        "rotateX",
        "rotateY",
        "rotateZ",
        "translate",
        "translate3d",
        "translateX",
        "translateY",
        "translateZ",
        "scale",
        "scale3d",
        "scaleX",
        "scaleY",
        "scaleZ",
        "skew",
        "skewX",
        "skewY"
      ]
    },
    "box": {
      "_": {
        "values" : [
          "content-box",
          "border-box",
          "fill-box",
          "stroke-box",
          "view-box"
        ]
      }
    },
    "origin": {
      "_": {
        "type" : [
          "position"
        ]
      }
    },
    "style": {
      "_": {
        "values" : [
          "flat",
          "preserve-3d"
        ]
      }
    }
  },
  "transition": {
    "delay": {
      "_": {
        "type" : [
          "time"
        ],
        "multi" : true
      }
    },
    "duration": {
      "_": {
        "ref" : "$up.delay"
      }
    },
    "property": {
      "_": {
        "values" : [
          "none",
          "all"
        ],
        "type" : [
          "custom",
          "string"
        ]
      }
    },
    "timing": {
      "function": {
        "_": {
          "values" : [
            "ease",
            "ease-in",
            "ease-out",
            "ease-in-out",
            "linear",
            "step-start",
            "step-end"
          ],
          "type" : [
            "custom",
            "function"
          ],
          "functions" : [
            "cubic-bezier",
            "steps"
          ]
        }
      }
    }
  },
  "translate": {
    "_": {
      "type" : [
        "length",
        "procent"
      ],
      "seperated" : true
    }
  },
  "unicode": {
    "bidi": {
      "_": {
        "values" : [
          "normal",
          "embed",
          "isolate",
          "bidi-override",
          "isolate-override",
          "plaintext"
        ]
      }
    }
  },
  "user": {
    "select": {
      "_": {
        "values" : [
          "none",
          "auto",
          "text",
          "contain",
          "all"
        ]
      }
    }
  },
  "vector": {
    "effect": {
      "_": {
        "values" : [
          "none",
          "non-scaling-stroke",
          "non-scaling-size",
          "non-rotation",
          "fixed-position"
        ]
      }
    }
  },
  "vertical": {
    "align": {
      "_": {
        "values" : [
          "baseline",
          "sub",
          "super",
          "text-top",
          "text-bottom",
          "middle",
          "top",
          "bottom"
        ],
        "type" : [
          "custom",
          "length",
          "procent"
        ]
      }
    }
  },
  "visibility": {
    "_": {
      "values" : [
        "visible",
        "hidden",
        "collapse"
      ]
    }
  },
  "white": {
    "space": {
      "_": {
        "values" : [
          "normal",
          "nowrap",
          "pre",
          "pre-wrap",
          "pre-line",
          "break-spaces"
        ]
      }
    }
  },
  "width": {
    "_": {
      "ref" : "/.height"
    }
  },
  "will": {
    "change": {
      "_": {
        "values" : [
          "auto",
          "scroll-position",
          "contents"
        ],
        "type" : [
          "custom",
          "string"
        ],
        "multi" : true
      }
    }
  },
  "word": {
    "break": {
      "_": {
        "values" : [
          "normal",
          "break-all",
          "kepp-all"
        ]
      }
    },
    "spacing": {
      "_": {
        "values" : [
          "normal"
        ],
        "type" : [
          "custom",
          "length",
          "procent"
        ]
      }
    }
  },
  "writing": {
    "mode": {
      "_": {
        "values" : [
          "horizontal-tb",
          "vertical-rl",
          "vertical-lr"
        ]
      }
    }
  },
  "x": {
    "_": {
      "type" : [
        "number"
      ]
    }
  },
  "y": {
    "_": {
      "type" : [
        "number"
      ]
    }
  },
  "z": {
    "index": {
      "_": {
        "type" : [
          "number"
        ]
      }
    }
  }
};
