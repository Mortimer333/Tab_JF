import fonts from './fonts.js';
let dictionary; export default dictionary = {
  accent : {
    color : {
      "_" : {
        type : {
          color : true
        }
      }
    }
  },
  "align": {
    "content": {
      "_": {
        "values": {
          "stretch": true,
          "center": true,
          "flex-start": true,
          "flex-end": true,
          "space-between": true,
          "space-around": true,
          "space-evenly": true,
          "initial": true,
          "unset": true
        }
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
  all : {
    _ : {

    }
  },
  "animation": {
    "_" : {
      combine : [
        "name",
        "duration",
        "timing.function",
        "delay",
        "iteration.count",
        "direction",
        "fill.mode",
        "play.state"
      ],
      multi : true,
      seperated : true,
      max : 5
    },
    "delay": {
      "_": {
        "type": {
          "time": true
        }
      }
    },
    "direction": {
      "_": {
        "values": {
          "normal": true,
          "reverse": true,
          "alternate": true,
          "alternate-reverse": true
        },
        "seperated": true
      }
    },
    "duration": {
      "_": {
        "type": {
          "time": true
        }
      }
    },
    "fill": {
      "mode": {
        "_": {
          "values": {
            "none": true,
            "forwards": true,
            "backwords": true,
            "both": true
          },
          "seperated": true
        }
      }
    },
    "iteration": {
      "count": {
        "_": {
          "type": {
            "number": true,
            "custom": true
          },
          "values": {
            "infinite": true
          },
          "seperated": true
        }
      }
    },
    "name": {
      "_": {
        "type": {
          "name": true,
          "custom": true
        },
        "values": {
          "none": true
        },
        "seperated": true
      }
    },
    "play": {
      "state": {
        "_": {
          "values": {
            "running": true,
            "paused": true
          },
          "multi": true
        }
      }
    },
    "timing": {
      "function": {
        "_": {
          "values": {
            "ease": true,
            "ease-in": true,
            "ease-out": true,
            "ease-in-out": true,
            "linear": true,
            "step-start": true,
            "step-end": true
          },
          "multi": true
        }
      }
    }
  },
  "appearance": {
    "_": {
      "values": {
        "auto": true,
        "textfield": true,
        "menulist-button": true
      }
    }
  },
  "aspect": {
    "ratio": {
      "_": {
        "type": {
          "number": true
        },
        seperated : true,
        seperator : {
          '/' : true
        }
      }
    }
  },
  backdrop : {
    filter : {
      _ : {
        type : {
          functions : true,
          custom : true
        },
        values : {
          none : true
        },
        functions : {
          url : true,
          blur : true,
          brightness : true,
          contrast : true,
          "drop-shadow" : true,
          grayscale : true,
          "hue-rotate" : true,
          invert : true,
          opacity : true,
          sepia : true,
          saturate : true
        },
        multi : true,
        max : 11
      }
    }
  },
  "backface": {
    "visibility": {
      "_": {
        "values": {
          "visible": true,
          "hidden": true
        }
      }
    }
  },
  "background": {
    "_" : {
      combine : [
        "attachment",
        "clip",
        "color",
        "image",
        "origin",
        "position",
        "repeat",
        "size"
      ],
      multi : true,
      max : 7
    },
    "attachment": {
      "_": {
        "values": {
          "scroll": true,
          "fixed": true,
          "local": true
        }
      }
    },
    "blend": {
      "mode": {
        "_": {
          "values": {
            "normal": true,
            "multiply": true,
            "screen": true,
            "overlay": true,
            "darken": true,
            "lighten": true,
            "color-dodge": true,
            "color-saturation": true,
            "color": true,
            "saturation": true,
            "luminosity": true
          },
          "seperated": true
        }
      }
    },
    "clip": {
      "_": {
        "values": {
          "border-box": true,
          "padding-box": true,
          "content-box": true,
          "text": true
        }
      }
    },
    "color": {
      "_": {
        "type": {
          "color": true,
          "custom": true
        },
        "values": {
          "transparent": true,
          "currentColor": true
        }
      }
    },
    "image": {
      "_": {
        "type": {
          "image": true,
          "custom": true
        },
        "values": {
          "none": true
        }
      }
    },
    "origin": {
      "_": {
        "values": {
          "border-box": true,
          "padding-box": true,
          "content-box": true
        }
      }
    },
    "position": {
      "_": {
        "type": {
          "length": true,
          "procent": true,
          custom : true
        },
        values : {
          left : true,
          right : true,
          bottom : true,
          center : true,
          top : true
        },
        "separated": true,
        "multi": true,
        max : 4
      },
      "x": {
        "_": {
          "type": {
            "custom": true,
            "length": true
          },
          "values": {
            "left": true,
            "center": true,
            "right": true
          },
          "separated": true
        }
      },
      "y": {
        "_": {
          "type": {
            "custom": true,
            "length": true
          },
          "values": {
            "top": true,
            "center": true,
            "bottom": true
          },
          "separated": true
        }
      }
    },
    "repeat": {
      "_": {
        "values": {
          "repeat-x": true,
          "repeat-y": true,
          "repeat": true,
          "space": true,
          "round": true,
          "no-repeat": true
        },
        "multi": true
      }
    },
    "size": {
      "_": {
        "values": {
          "auto": true,
          "cover": true,
          "contain": true
        },
        "type": {
          "length": true,
          "procent": true,
          "custom": true
        },
        multi : true,
        max : 2,
        seperated : true
      }
    }
  },
  "block": {
    "size": {
      "_": {
        "values": {
          "auto": true,
          "fit-content": true,
          "min-content": true,
          "max-content": true,
          "border-box": true,
          "available": true
        },
        "type": {
          "length": true,
          "custom": true
        },
        "separated": true
      }
    }
  },
  "border": {
    "_": {
      combine : [
        "bottom.style",
        "bottom.width",
        "bottom.color"
      ],
      multi : true,
      max : 3
    },
    color : {
      _ : {
        type : {
          "color": true
        }
      }
    },
    "block": {
      color : {
        _ : {
          ref : "$up.end.color"
        }
      },
      "end": {
        _ : {
          combine : [
            "color",
            "style",
            "width"
          ],
          multi : true,
          max : 3
        },
        "color": {
          "_": {
            "type": {
              "color": true
            }
          }
        },
        "style": {
          "_": {
            "values": {
              "dashed": true,
              "dotted": true,
              "groove": true
            }
          }
        },
        "width": {
          "_": {
            "values": {
              "thick": true
            },
            "type": {
              "length": true,
              "custom": true
            }
          }
        }
      },
      "start": {
        _ : {
          combine : [
            "color",
            "style",
            "width"
          ],
          multi : true,
          max : 3
        },
        "color": {
          "_": {
            "ref": "$up.$up.end.color"
          }
        },
        "style": {
          "_": {
            "ref": "$up.$up.end.style"
          }
        },
        "width": {
          "_": {
            "ref": "$up.$up.end.width"
          }
        }
      },
      width : {
        _ : {
          values : {
            thick: true
          },
          type : {
            length: true,
            custom: true
          }
        }
      }
    },
    "bottom": {
      _ : {
        combine : [
          "style",
          "color",
          "width"
        ],
        multi : true,
        max : 3
      },
      "color": {
        "_": {
          "values": {
            "transparent": true
          },
          "type": {
            "custom": true,
            color : true
          }
        }
      },
      "left": {
        "radius": {
          "_": {
            "type": {
              "length": true,
              "procent": true
            }
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
          "values": {
            "none": true,
            "dashed": true,
            "dotted": true,
            "solid": true,
            "hidden": true,
            "double": true
          },
          "multi": true,
          max : 4
        }
      },
      "width": {
        "_": {
          "type": {
            "length": true
          },
          "multi": true,
          max : 4
        }
      }
    },
    "collapse": {
      "_": {
        "values": {
          "collapse": true,
          "separate": true
        }
      }
    },
    "end": {
      "end": {
        "radius": {
          "_": {
            "type": {
              "length": true
            }
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
      _ : {
        type : {
          image : true
        }
      },
      "outset": {
        "_": {
          "type": {
            length : true
          },
          "multi": true
        }
      },
      "repeat": {
        "_": {
          "values": {
            "stretch": true,
            "repeat": true,
            "round": true,
            "space": true
          }
        }
      },
      "slice": {
        "_": {
          "type": {
            "custom": true,
            "length": true,
            "procent": true
          },
          "values": {
            "fill": true
          }
        }
      },
      "source": {
        "_": {
          "type": {
            image: true
          }
        }
      },
      "width": {
        "_": {
          "values": {
            "auto": true
          },
          "type": {
            "custom": true,
            "length": true,
            "procent": true
          }
        }
      }
    },
    "inline": {
      _ : {
        combine : [
          "color",
          "style",
          "width"
        ],
        multi : true,
        max : 3
      },
      color : {
        _ : {
          type : {
            color : true
          }
        }
      },
      "end": {
        _ : {
          combine : [
            "color",
            "style",
            "width"
          ],
          multi : true,
          max : 3
        },
        "color": {
          "_": {
            "type": {
              "color": true
            }
          }
        },
        "style": {
          "_": {
            "values": {
              "none": true,
              "dashed": true,
              "dotted": true,
              "solid": true,
              "hidden": true,
              "double": true
            },
            "multi": true
          }
        },
        "width": {
          "_": {
            "values": {
              "thick": true
            },
            "type": {
              "length": true,
              "custom": true
            }
          }
        }
      },
      "start": {
        _ : {
          combine : [
            "color",
            "style",
            "width"
          ],
          multi : true,
          max : 3
        },
        "color": {
          "_": {
            "ref": "$up.$up.end.color"
          }
        },
        "style": {
          "_": {
            "ref": "$up.$up.end.style"
          }
        },
        "width": {
          "_": {
            "ref": "$up.$up.end.width"
          }
        }
      },
      "style": {
        "_": {
          "ref": "$up.end.style"
        }
      },
      "width": {
        "_": {
          "ref": "$up.end.width"
        }
      }
    },
    "left": {
      _ : {
        combine : [
          "color",
          "style",
          "width"
        ],
        multi : true,
        max : 3
      },
      "color": {
        "_": {
          "ref": "$up.$up.bottom.color"
        }
      },
      "style": {
        "_": {
          "ref": "$up.$up.bottom.style"
        }
      },
      "width": {
        "_": {
          "ref": "$up.$up.bottom.width"
        }
      }
    },
    "right": {
      _ : {
        ref : "$up.left",
        multi : true,
        max : 3
      },
      "color": {
        "_": {
          "ref": "$up.$up.bottom.color"
        }
      },
      "style": {
        "_": {
          "ref": "$up.$up.bottom.style"
        }
      },
      "width": {
        "_": {
          "ref": "$up.$up.bottom.width"
        }
      }
    },
    "spacing": {
      "_": {
        "type": {
          "length": true
        },
        "separated": true
      }
    },
    "start": {
      "end": {
        "radius": {
          "_": {
            "ref": "$up.$up.$up.end.end.radius"
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
    "top": {
      _ : {
        ref : "$up.$up.left"
      },
      "color": {
        "_": {
          "ref": "$up.$up.bottom.color"
        }
      },
      "left": {
        "radius": {
          "_": {
            "ref": "$up.$up.$up.bottom.left.radius"
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
          "ref": "$up.$up.bottom.style"
        }
      },
      "width": {
        "_": {
          "ref": "$up.$up.bottom.width"
        }
      }
    },
    style : {
      "_": {
        "ref": "$up.bottom.style"
      }
    },
    width : {
      "_": {
        "ref": "$up.bottom.width"
      }
    },
    radius : {
      _ : {
        type : {
          procent : true,
          length : true
        },
        multi : true,
        max : 4
      }
    }
  },
  "bottom": {
    "_": {
      "values": {
        "auto": true
      },
      "type": {
        "length": true,
        "procent": true,
        "custom": true
      }
    }
  },
  "box": {
    "decoration": {
      "break": {
        "_": {
          "values": {
            "slice": true,
            "clone": true
          }
        }
      }
    },
    "shadow": {
      "_": {
        "values": {
          "inset": true
        },
        "type": {
          "color": true,
          "custom": true
        },
        "multi": true,
        "separated": true
      }
    },
    "sizing": {
      "_": {
        "values": {
          "content-box": true,
          "border-box": true
        }
      }
    }
  },
  "break": {
    "after": {
      "_": {
        "values": {
          "auto": true,
          "always": true,
          "left": true,
          "right": true,
          "recto": true,
          "verso": true,
          "page": true,
          "column": true,
          "region": true,
          "avoid": true,
          "avoid-page": true,
          "avoid-column": true,
          "avoid-region": true
        }
      }
    },
    "before": {
      "_": {
        "ref": "$up.after"
      }
    },
    "inside": {
      "_": {
        "values": {
          "auto": true,
          "avoid": true,
          "avoid-page": true,
          "avoid-column": true,
          "avoid-region": true
        }
      }
    }
  },
  "caption": {
    "side": {
      "_": {
        "values": {
          "top": true,
          "bottom": true,
          "left": true,
          "right": true,
          "top-outside": true,
          "bottom-outside": true
        }
      }
    }
  },
  "caret": {
    "color": {
      "_": {
        "values": {
          "auto": true
        },
        "type": {
          "color": true,
          "custom": true
        }
      }
    }
  },
  "clear": {
    "_": {
      "values": {
        "none": true,
        "left": true,
        "right": true,
        "both": true,
        "inline-start": true,
        "inline-end": true
      }
    }
  },
  "clip": {
    "_": {
      "values": {
        "auto": true
      },
      "type": {
        "custom": true,
        "functions": true
      },
      functions : {
        rect : true
      }
    },
    "path": {
      "_": {
        "values": {
          "none": true,
          "fill-box": true,
          "stroke-box": true,
          "view-box": true,
          "margin-box": true,
          "border-box": true,
          "padding-box": true,
          "content-box": true
        },
        "type": {
          image: true,
          "custom": true,
          "functions": true
        },
        functions : {
          inset : true,
          circle : true,
          ellipse : true,
          polygon : true,
          path : true,
          url : true
        },
        "separated": true
      }
    },
    "rule": {
      "_": {
        "values": {
          "nonzero": true,
          "evenodd": true
        }
      }
    }
  },
  "color": {
    "_": {
      "type": {
        "color": true
      }
    },
    scheme : {
      "_" : {
        type : {
          custom : true
        },
        values : {
          normal : true,
          light : true,
          dark : true
        },
        multi : true,
        max : 2
      }
    },
    "adjust": {
      "_": {
        "values": {
          "economy": true,
          "exact": true
        }
      }
    },
    "interpolation": {
      "_" : {
        values : {
          auto : true,
          sRGB : true,
          linearRGB : true
        }
      },
      "filters": {
        "_": {
          "values": {
            "auto": true,
            "sRGB": true,
            "linearRGB": true
          }
        }
      }
    }
  },
  "column": {
    "count": {
      "_": {
        "values": {
          "auto": true
        },
        "type": {
          "number": true,
          "custom": true
        }
      }
    },
    "fill": {
      "_": {
        "values": {
          "auto": true,
          "balance": true,
          "balance-all": true
        }
      }
    },
    "gap": {
      "_": {
        "values": {
          "normal": true
        },
        "types": {
          "custom": true,
          "length": true,
          "procent": true
        }
      }
    },
    "rule": {
      _ : {
        combine : [
          "color",
          "style",
          "width"
        ],
        multi : true,
        max : 3
      },
      "color": {
        "_": {
          "types": {
            "color": true
          }
        }
      },
      "style": {
        "_": {
          "values": {
            "none": true,
            "hidden": true,
            "dotted": true,
            "dashed": true,
            "solid": true,
            "double": true,
            "groove": true,
            "ridge": true,
            "inset": true,
            "outset": true
          }
        }
      },
      "width": {
        "_": {
          "values": {
            "thin": true,
            "medium": true,
            "thick": true
          },
          "types": {
            "custom": true,
            "length": true
          }
        }
      }
    },
    "span": {
      "_": {
        "values": {
          "none": true,
          "all": true
        }
      }
    },
    "width": {
      "_": {
        "values": {
          "auto": true
        },
        "type": {
          "custom": true,
          "length": true
        }
      }
    }
  },
  columns : {
    _ : {
      combine : [
        "$up.column.count",
        "$up.column.width",
      ],
      multi : true,
      max : 2
    }
  },
  "contain": {
    "_": {
      "values": {
        "none": true,
        "strict": true,
        "content": true,
        "size": true,
        "layout": true,
        "style": true,
        "paint": true
      },
      "separated": true
    }
  },

  "content": {
    "_": {
      "values": {
        "normal": true,
        "none": true,
        "open-quote": true,
        "close-quote": true,
        "no-open-quote": true,
        "no-close-quote": true
      },
      "type": {
        "custom": true,
        "name": true,
        "image": true,
        "functions": true,
        "variable": true
      },
      functions : {
        attr : true,
        counter : true
      },
      "separated": true
    },
    visibility : {
      _ : {
        type : {
          custom : true
        },
        values : {
          visible : true,
          hidden : true,
          auto : true
        }
      }
    }
  },
  "counter": {
    "increment": {
      "_": {
        "values": {
          "none": true
        },
        "types": {
          "variable": true,
          "number": true
        },
        "separated": true
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
      "values": {
        "alias": true,
        "all-scroll": true,
        "auto": true,
        "cell": true,
        "context-menu": true,
        "col-resize": true,
        "copy": true,
        "crosshair": true,
        "default": true,
        "e-resize": true,
        "ew-resize": true,
        "grab": true,
        "grabbing": true,
        "help": true,
        "move": true,
        "n-resize": true,
        "ne-resize": true,
        "nesw-resize": true,
        "ns-resize": true,
        "nw-resize": true,
        "nwse-resize": true,
        "no-drop": true,
        "none": true,
        "not-allowed": true,
        "pointer": true,
        "progress": true,
        "row-resize": true,
        "s-resize": true,
        "se-resize": true,
        "sw-resize": true,
        "text": true,
        "w-resize": true,
        "wait": true,
        "zoom-in": true,
        "zoom-out": true
      },
      "type": {
        "custom": true,
        "image": true
      }
    }
  },
  "cx": {
    "_": {
      "type": {
        "number": true
      }
    }
  },
  "cy": {
    "_": {
      "ref": "$up.$up.cx"
    }
  },
  d : {
    _ : {
      values : {
        A : true,
        a : true,
        M : true,
        m : true,
        L : true,
        l : true,
        H : true,
        h : true,
        V : true,
        v : true,
        C : true,
        c : true,
        S : true,
        s : true,
        Z : true,
        z : true,
        Q : true,
        q : true,
        T : true,
        t : true
      },
      type : {
        custom : true,
        number : true
      },
      multi : true,
      max : 3,
      seperated : true
    }
  },
  "direction": {
    "_": {
      "values": {
        "ltr": true,
        "rtl": true
      }
    }
  },
  "display": {
    "_": {
      "values": {
        "block": true,
        "inline": true,
        "inline-block": true,
        "flex": true,
        "inline-flex": true,
        "grid": true,
        "inline-grid": true,
        "flow-root": true,
        "table": true,
        "table-row": true,
        "list-item": true,
        "inline-table": true
      },
      "separated": true
    }
  },
  "dominant": {
    "baseline": {
      "_": {
        "values": {
          "auto": true,
          "middle": true,
          "hanging": true
        }
      }
    }
  },
  "empty": {
    "cells": {
      "_": {
        "values": {
          "show": true,
          "hide": true
        }
      }
    }
  },
  "fill": {
    "_": {
      "type": {
        "color": true
      }
    },
    "opacity": {
      "_": {
        "type": {
          "number": true
        }
      }
    },
    "rule": {
      "_": {
        "values": {
          "evenodd": true,
          "nonzero": true
        }
      }
    }
  },
  "filter": {
    "_": {
      "type": {
        "functions": true
      },
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
    _ : {
      combine : [
        "grow",
        "shrink",
        "basis"
      ],
      multi : true,
      max : 3
    },
    flow : {
      _ : {
        combine : [
          "direction",
          "wrap"
        ],
        multi : true,
        max : 2
      }
    },
    "basis": {
      "_": {
        "values": {
          "auto": true,
          "fill": true,
          "max-content": true,
          "min-content": true,
          "fit-content": true,
          "content": true
        },
        "type": {
          "custom": true,
          "length": true
        }
      }
    },
    "direction": {
      "_": {
        "values": {
          "row": true,
          "row-reverse": true,
          "column": true,
          "cloumn-reverse": true
        }
      }
    },
    "grow": {
      "_": {
        "type": {
          "number": true
        }
      }
    },
    "shrink": {
      "_": {
        "type": {
          "number": true
        }
      }
    },
    "wrap": {
      "_": {
        "values": {
          "nowrap": true,
          "wrap": true,
          "wrap-reverse": true
        }
      }
    }
  },
  "float": {
    "_": {
      "values": {
        "left": true,
        "right": true,
        "none": true,
        "inline-start": true,
        "inline-end": true
      }
    }
  },
  "flood": {
    "color": {
      "_": {
        "type": {
          "color": true
        }
      }
    },
    "opacity": {
      "_": {
        "type": {
          "number": true
        }
      }
    }
  },
  "font": {
    _ : {
      combine : [
        "family",
        "size",
        "stretch",
        "style",
        "variant",
        "weight",
        "$up.line.height"
      ],
      multi : true,
      max : 6
    },
    "family": {
      "_": {
        "values": fonts,
        "type": {
          "custom": true
        },
        seperated : true
      }
    },
    "feature": {
      "settings": {
        "_": {
          "values": {
            "liga": true,
            "dlig": true,
            "onum": true,
            "lnum": true,
            "tnum": true,
            "zero": true,
            "frac": true,
            "sups": true,
            "subs": true,
            "smpc": true,
            "c2sc": true,
            "case": true,
            "hlig": true,
            "calt": true,
            "swsh": true,
            "hist": true,
            "ss**": true,
            "kern": true,
            "locl": true,
            "rlig": true,
            "medi": true,
            "init": true,
            "isol": true,
            "fina": true,
            "mark": true,
            "mkmk": true
          },
          "type": {
            "custom": true,
            "number": true
          },
          "multi": true,
          "separated": true
        }
      }
    },
    "kerning": {
      "_": {
        "values": {
          "auto": true,
          "normal": true,
          "none": true
        }
      }
    },
    "language": {
      "override": {
        "_": {
          "values": {
            "none": true
          },
          "type": {
            "custom": true
          }
        }
      }
    },
    "optical": {
      "sizing": {
        "_": {
          "values": {
            "auto": true,
            "none": true
          }
        }
      }
    },
    "size": {
      "_": {
        "values": {
          "xx-small": true,
          "x-small": true,
          "small": true,
          "medium": true,
          "large": true,
          "x-large": true,
          "xx-large": true,
          "larger": true,
          "smaller": true
        },
        "type": {
          "custom": true,
          "length": true,
          "procent": true
        }
      },
      "adjust": {
        "_": {
          "values": {
            "none": true
          },
          "type": {
            "custom": true,
            "number": true
          }
        }
      }
    },
    "stretch": {
      "_": {
        "values": {
          "normal": true,
          "semi-condensed": true,
          "condensed": true,
          "extra-condensed": true,
          "ultra-condensed": true,
          "semi-expanded": true,
          "expanded": true,
          "extra-expanded": true,
          "ultra-expanded": true
        },
        "type": {
          "custom": true,
          "procent": true
        }
      }
    },
    "style": {
      "_": {
        "values": {
          "normal": true,
          "italic": true,
          "oblique": true
        },
        "type": {
          "custom": true,
          "degree": true
        },
        "separated": true
      }
    },
    "synthesis": {
      "_": {
        "values": {
          "none": true,
          "weight": true,
          "style": true
        },
        "separated": true
      }
    },
    "variant": {
      "_": {
        "values": {
          "normal": true,
          "none": true,
          "common-ligatures": true,
          "no-common-ligatures": true,
          "discretionary-ligatures": true,
          "no-discretionary-ligatures": true,
          "historical-ligatures": true,
          "no-historical-ligatures": true,
          "contextual": true,
          "no-contextual": true,
          "historical-forms": true,
          "small-caps": true,
          "all-small-caps": true,
          "petite-caps": true,
          "all-petite-caps": true,
          "unicase": true,
          "titling-caps": true,
          "lining-nums": true,
          "oldstyle-nums": true,
          "proportional-nums": true,
          "tabular-nums": true,
          "diagonal-fractions": true,
          "stacked-fractions": true,
          "ordinal": true,
          "slashed-zero": true,
          "jis78": true,
          "jis83": true,
          "jis90": true,
          "jis04": true,
          "simplified": true,
          "traditional": true,
          "full-width": true,
          "proportional-width": true,
          "ruby": true
        },
        "functions": {
          "stylistic": true,
          "styleset": true,
          "character-variant": true,
          "swash": true,
          "ornaments": true,
          "annotation": true
        },
        "type": {
          "custom": true,
          "functions": true
        },
        "separated": true
      },
      "alternates": {
        "_": {
          "values": {
            "normal": true,
            "historical-forms": true
          },
          "functions": {
            "stylistic": true,
            "styleset": true,
            "character-variant": true,
            "swash": true,
            "ornaments": true,
            "annotation": true
          },
          "type": {
            "custom": true,
            "functions": true
          },
          "separated": true
        }
      },
      "caps": {
        "_": {
          "values": {
            "normal": true,
            "small-caps": true,
            "all-small-caps": true,
            "petite-caps": true,
            "all-petite-caps": true,
            "unicase": true,
            "titling-caps": true
          }
        }
      },
      "east": {
        "asian": {
          "_": {
            "values": {
              "jis78": true,
              "jis83": true,
              "jis90": true,
              "jis04": true,
              "simplified": true,
              "traditional": true,
              "full-width": true,
              "proportional-width": true,
              "ruby": true
            },
            "separated": true
          }
        }
      },
      "ligatures": {
        "_": {
          "values": {
            "normal": true,
            "none": true,
            "common-ligatures": true,
            "no-common-ligatures": true,
            "discretionary-ligatures": true,
            "no-discretionary-ligatures": true,
            "historical-ligatures": true,
            "no-historical-ligatures": true,
            "contextual": true,
            "no-contextual": true
          }
        }
      },
      "numeric": {
        "_": {
          "values": {
            "normal": true,
            "lining-nums": true,
            "oldstyle-nums": true,
            "proportional-nums": true,
            "tabular-nums": true,
            "diagonal-fractions": true,
            "stacked-fractions": true,
            "ordinal": true,
            "slashed-zero": true
          },
          "separated": true
        }
      },
      "position": {
        "_": {
          "values": {
            "normal": true,
            "sub": true,
            "super": true
          }
        }
      }
    },
    "variation": {
      "settings": {
        "_": {
          "values": {
            "normal": true,
            "wght": true,
            "wdth": true,
            "slnt": true,
            "ital": true,
            "opsz": true
          },
          "type": {
            "custom": true,
            "number": true
          },
          "separated": true
        }
      }
    },
    "weight": {
      "_": {
        "values": {
          "normal": true,
          "bold": true,
          "lighter": true,
          "bolder": true
        },
        "type": {
          "custom": true,
          "number": true
        }
      }
    }
  },
  forced : {
    color : {
      adjust : {
        _ : {
          type : {
            custom : true
          },
          values : {
            auto : true,
            none : true
          }
        }
      }
    }
  },
  gap : {
    _ : {
      type : {
        length : true,
        procent : true
      },
      multi : true,
      max : 2
    }
  },
  "grid": {
    _ : {
      combine : [
        "auto.columns",
        "auto.flow",
        "auto.rows",
        "template.areas",
        "template.columns",
        "template.rows"
      ],
      multi : true
    },
    gap : {
      _ : {
        ref : "$up.$up.gap"
      }
    },
    area : {
      _ : {
        combine : [
          "$up.row.start",
          "$up.column.start",
          "$up.row.end",
          "$up.column.end"
        ],
        seperated : true,
        seperator : {
          '/' : true
        }
      }
    },
    "auto": {
      "columns": {
        "_": {
          "values": {
            "auto": true,
            "min-content": true,
            "max-content": true
          },
          "type": {
            "length": true,
            "procent": true,
            "fraction": true,
            "functions": true
          },
          "functions": {
            "minmax": true,
            "fit-content": true
          },
          "separated": true
        }
      },
      "flow": {
        "_": {
          "values": {
            "row": true,
            "column": true,
            "dense": true
          },
          "separated": true
        }
      },
      "rows": {
        "_": {
          "ref": "$up.columns"
        }
      }
    },
    "column": {
      _ : {
        combin : [
          "end",
          "start"
        ],
        seperated : true,
        seperator : {
          '/' : true
        }
      },
      gap : {
        _ : {
          ref : "$up.$up.$up.column.gap"
        }
      },
      "end": {
        "_": {
          "values": {
            "auto": true,
            "span": true
          },
          "type": {
            "custom": true,
            "number": true,
            "name": true
          },
          "multi": true,
          max : 3
        }
      },
      "start": {
        "_": {
          "ref": "$up.end"
        }
      }
    },
    "row": {
      _ : {
        combine : [
          "end",
          "start"
        ],
        seperated : true,
        seperator : {
          '/' : true
        }
      },
      gap : {
        _ : {
          ref : "$up.$up.$up.row.gap"
        }
      },
      "end": {
        "_": {
          "ref": "$up.$up.column.end"
        }
      },
      "start": {
        "_": {
          "ref": "$up.$up.column.end"
        }
      }
    },
    "template": {
      _ : {
        combine : [
          "areas",
          "columns",
          "rows"
        ],
        multi : true
      },
      "areas": {
        "_": {
          multi : true
        }
      },
      "columns": {
        "_": {
          "custom": {
            "min-content": true,
            "max-content": true
          },
          "type": {
            "custom": true,
            "fraction": true,
            "length": true,
            "procent": true,
            "functions": true,
            "name": true
          },
          "functions": {
            "minmax": true,
            "fit-content": true,
            "repeat": true,
            "subgrid": true,
            "masonery": true
          },
          "multi": true
        }
      },
      "rows": {
        "_": {
          "ref": "$up.columns"
        }
      }
    }
  },
  hanging : {
    punctuation : {
      _ : {
        type : {
          custom : true
        },
        values : {
          none : true,
          first : true,
          last : true,
          "force-end" : true,
          "allow-end" : true
        },
        multi : true,
        max : 3
      },
    }
  },
  "height": {
    "_": {
      "values": {
        "auto": true,
        "max-content": true,
        "min-content": true
      },
      "type": {
        "custom": true,
        "length": true,
        "procent": true,
        "functions": true
      },
      "functions": {
        "fit-content": true
      }
    }
  },
  hyphenate : {
    character : {
      _ : {
        type : {
          custom : true,
          string : true
        },
        values : {
          auto : true
        }
      }
    }
  },
  "hyphens": {
    "_": {
      "values": {
        "none": true,
        "manual": true,
        "auto": true
      }
    }
  },
  "image": {
    "orientation": {
      "_": {
        "depricated": true
      }
    },
    "rendering": {
      "_": {
        "values": {
          "auto": true,
          "crisp-edges": true,
          "pixelated": true,
          "smooth": true,
          "high-quality": true,
          "": true
        }
      }
    },
    resolution : {
      _ : {
        type : {
          custom : true,
          resolution : true
        },
        values : {
          "from-image" : true,
          snap : true
        }
      }
    }
  },
  "ime": {
    "mode": {
      "_": {
        "depricated": true
      }
    }
  },
  initial : {
    letter : {
      _ : {
        type : {
          custom : true,
          number : true
        },
        values : {
          normal : true
        },
        multi : true,
        max : 2
      },
      align : {
        _ : {
          values : {
            auto : true,
            alphabetic : true,
            hanging : true,
            ideographic : true
          }
        }
      }
    }
  },
  "inline": {
    "size": {
      "_": {
        "ref": "$up.$up.width"
      }
    }
  },
  "inset": {
    _ : {
      type : {
        length : true
      },
      multi : true,
      max : 4,
      values : {
        auto : true
      }
    },
    "block": {
      _ : {
        combine : [
          "end",
          "start"
        ],
        multi : true,
        max : 2
      },
      "end": {
        "_": {
          "values": {
            "auto": true
          },
          "type": {
            "custom": true,
            "length": true,
            "procent": true
          }
        }
      },
      "start": {
        "_": {
          "ref": "$up.end"
        }
      }
    },
    "inline": {
      _ : {
        combine : [
          "end",
          "start"
        ],
        multi : true,
        max : 2
      },
      "end": {
        "_": {
          "ref": "$up.$up.block.end"
        }
      },
      "start": {
        "_": {
          "ref": "$up.$up.block.end"
        }
      }
    }
  },
  "isolation": {
    "_": {
      "values": {
        "auto": true,
        "isolate": true
      }
    }
  },
  "justify": {
    "content": {
      "_": {
        "values": {
          "center": true,
          "start": true,
          "end": true,
          "flex-start": true,
          "flex-end": true,
          "left": true,
          "right": true,
          "normal": true,
          "space-between": true,
          "space-around": true,
          "space-evenly": true,
          "stratch": true,
          "safe": true,
          "unsafe": true,
          "baseline": true,
          "first": true,
          "last": true
        },
        "seperated": true
      }
    },
    "items": {
      "_": {
        "ref": "$up.content",
        "add": {
          "values": {
            "legacy": true
          }
        }
      }
    },
    "self": {
      "_": {
        "ref": "$up.content"
      }
    }
  },
  "left": {
    "_": {
      "ref": "$up.bottom"
    }
  },
  "letter": {
    "spacing": {
      "_": {
        "values": {
          "normal": true
        },
        "type": {
          "custom": true,
          "length": true
        }
      }
    }
  },
  "lighting": {
    "color": {
      "_": {
        "type": {
          "color": true
        }
      }
    }
  },
  "line": {
    "break": {
      "_": {
        "values": {
          "auto": true,
          "loose": true,
          "normal": true,
          "strict": true,
          "anywhere": true
        }
      }
    },
    "height": {
      "_": {
        "values": {
          "normal": true
        },
        "type": {
          "custom": true,
          "number": true,
          "length": true,
          "procent": true
        }
      },
      step : {
        _ : {
          type : {
            length : true
          }
        }
      }
    }
  },
  "list": {
    "style": {
      _ : {
        combine : [
          "image",
          "position",
          "type"
        ],
        multi : true,
        max : 3
      },
      "image": {
        "_": {
          "type": {
            "custom": true,
            "image": true
          },
          "values": {
            "none": true
          }
        }
      },
      "position": {
        "_": {
          "values": {
            "inside": true,
            "outside": true
          }
        }
      },
      "type": {
        "_": {
          "values": {
            "disc": true,
            "circle": true,
            "square": true,
            "decimal": true,
            "georgian": true,
            "trad-chinese-informal": true,
            "kannada": true,
            "none": true
          },
          "type": {
            "custom": true,
            "name": true
          }
        }
      }
    }
  },
  "margin": {
    "_": {
      "type": {
        "custom": true,
        "length": true,
        "procent": true
      },
      "values": {
        "auto": true
      },
      "multi": true,
      "max": 4
    },
    "block": {
      _ : {
        combine : [
          "end",
          "start"
        ],
        multi : true,
        max : 2
      },
      "end": {
        "_": {
          "values": {
            "auto": true
          },
          "type": {
            "custom": true,
            "length": true,
            "procent": true
          }
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
      _ : {
        combine : [
          "end",
          "start"
        ],
        multi : true,
        max : 2
      },
      "end": {
        "_": {
          "ref": "$up.$up.block.end"
        }
      },
      "start": {
        "_": {
          "ref": "$up.$up.block.end"
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
    },
    trim : {
      _ : {
        values : {
          none : true,
          "in-flow" : true,
          all : true
        }
      }
    }
  },
  "marker": {
    "end": {
      "_": {
        "values": {
          "none": true
        },
        "type": {
          "custom": true,
          "image": true
        }
      }
    },
    "mid": {
      "_": {
        "ref": "$up.end"
      }
    },
    "start": {
      "_": {
        "ref": "$up.end"
      }
    }
  },
  "mask": {
    "_": {
      "type": {
        "image": true,
        "custom": true
      },
      "values": {
        "add": true,
        "subtract": true,
        "intersect": true,
        "exclude": true,
        "content-box": true,
        "padding-box": true,
        "border-box": true,
        "margin-box": true,
        "fill-box": true,
        "stroke-box": true,
        "view-box": true,
        "no-clip": true,
        "border": true,
        "padding": true,
        "content": true,
        "text": true,
        "repeat-x": true,
        "repeat-y": true,
        "repeat": true,
        "space": true,
        "round": true,
        "no-repeat": true,
        "cover": true,
        "contain": true,
        "auto": true,
        "none": true,
        "alpha": true,
        "luminance": true,
        "match-source": true,
        "top": true,
        "right": true,
        "left": true,
        "bottom": true,
        "center": true,
        "length": true,
        "procent": true
      },
      "multi": true,
      "seperated": true
    },
    border : {
      _ : {
        combine : [
          "mode",
          "outset",
          "repeat",
          "slice",
          "source",
          "width"
        ],
        multi : true,
        max : 3,
        seperated : true,
        seperator : {
          '/' : true
        }
      },
      mode : {
        _ : {
          values : {
            luminance : true,
            alpha : true
          }
        }
      },
      outset : {
        _ : {
          values : {
            length : true,
            number : true
          },
          multi : true,
          max : 4
        }
      },
      repeat : {
        _ : {
          values : {
            stretch : true,
            repeat : true,
            round : true,
            space : true
          },
          multi : true,
          max : 2
        }
      },
      slice : {
        _ : {
          values : {
            fill : true
          },
          type : {
            custom : true,
            number : true,
            procent : true
          }
        }
      },
      source : {
        _ : {
          type : {
            custom : true,
            image : true
          },
          values : {
            none : true
          }
        }
      },
      width : {
        _ : {
          type : {
            length : true,
            procent : true,
            custom : true
          },
          values : {
            auto : true
          },
          multi : true,
          max : 4
        }
      }
    },
    "clip": {
      "_": {
        "values": {
          "content-box": true,
          "padding-box": true,
          "border-box": true,
          "margin-box": true,
          "fill-box": true,
          "stroke-box": true,
          "view-box": true,
          "no-clip": true,
          "border": true,
          "padding": true,
          "content": true,
          "text": true
        },
        "multi": true,
        "seperated": true
      }
    },
    "composite": {
      "_": {
        "values": {
          "add": true,
          "subtract": true,
          "intersect": true,
          "exclude": true
        }
      }
    },
    "image": {
      "_": {
        "type": {
          "image": true,
          "custom": true
        },
        "values": {
          "none": true
        }
      }
    },
    "mode": {
      "_": {
        "values": {
          "alpha": true,
          "luminance": true,
          "match-source": true
        },
        "multi": true
      }
    },
    "origin": {
      "_": {
        "values": {
          "content-box": true,
          "padding-box": true,
          "border-box": true,
          "margin-box": true,
          "fill-box": true,
          "stroke-box": true,
          "view-box": true,
          "border": true,
          "padding": true,
          "content": true
        },
        "multi": true
      }
    },
    "position": {
      "_": {
        combine : [
          'x',
          'y'
        ],
        "seperated": true,
        "multi": true,
        max : 2
      },
      x : {
        _ : {
          type : {
            length : true,
            procent : true,
            custom : true
          },
          values : {
            left : true,
            center : true,
            right: true
          }
        }
      },
      y : {
        _ : {
          type : {
            length : true,
            procent : true,
            custom : true
          },
          values : {
            top : true,
            center : true,
            bottom: true
          }
        }
      }
    },
    "repeat": {
      "_": {
        "values": {
          "repeat-x": true,
          "repeat-y": true,
          "repeat": true,
          "space": true,
          "round": true,
          "no-repeat": true
        },
        "multi": true,
        "seperated": true
      }
    },
    "size": {
      "_": {
        "values": {
          "cover": true,
          "contain": true,
          "auto": true
        },
        "type": {
          "custom": true,
          "length": true,
          "procent": true
        },
        "multi": true,
        "seperated": true
      }
    },
    "type": {
      "_": {
        "values": {
          "luminance": true,
          "alpha": true
        }
      }
    }
  },
  "max": {
    "block": {
      "size": {
        "_": {
          "ref": "$up.$up.$up.max.height"
        }
      }
    },
    "height": {
      "_": {
        "values": {
          "max-content": true,
          "min-content": true,
          "auto": true
        },
        "type": {
          "custom": true,
          "functions": true,
          "length": true,
          "procent": true
        },
        "functions": {
          "fit-content": true
        }
      }
    },
    "inline": {
      "size": {
        "_": {
          "ref": "$up.$up.$up.max.height"
        }
      }
    },
    "width": {
      "_": {
        "ref": "$up.$up.max.height"
      }
    }
  },
  "min": {
    "block": {
      "size": {
        "_": {
          "ref": "$up.$up.$up.max.height"
        }
      }
    },
    "height": {
      "_": {
        "ref": "$up.$up.max.height"
      }
    },
    "inline": {
      "size": {
        "_": {
          "ref": "$up.$up.$up.max.height"
        }
      }
    },
    "width": {
      "_": {
        "ref": "$up.$up.max.height"
      }
    }
  },
  "mix": {
    "blend": {
      "mode": {
        "_": {
          "values": {
            "normal": true,
            "multiply": true,
            "screen": true,
            "overlay": true,
            "darken": true,
            "lighten": true,
            "color-dodge": true,
            "color-burn": true,
            "hard-light": true,
            "soft-light": true,
            "difference": true,
            "exclusion": true,
            "hue": true,
            "saturation": true,
            "color": true,
            "luminosity": true
          }
        }
      }
    }
  },
  moz : {
    appearance : {
      _ : {
        ref : "$up.$up.appearance"
      }
    }
  },
  "object": {
    "fit": {
      "_": {
        "values": {
          "fill": true,
          "contain": true,
          "cover": true,
          "none": true,
          "scale-down": true
        }
      }
    },
    "position": {
      "_": {
        "type": {
          procent : true,
          length : true,
          custom : true
        },
        values : {
          right : true,
          top : true,
          left : true,
          bottom : true,
          center : true
        },
        multi : true,
        max : 2
      }
    }
  },
  "offset": {
    _ : {
      combine : [
        "anchor",
        "distance",
        "path",
        "position",
        "rotate"
      ],
      multi : true,
      max : 2,
      seperated : true,
      seperator : {
        '/' : true
      }
    },
    position : {
      _ : {
        type : {
          custom : true,
          procent : true,
          length : true
        },
        values : {
          auto : true,
          top : true,
          bottom : true,
          left : true,
          right : true,
          center : true,
        },
        multi : true,
        max : 4
      }
    },
    "anchor": {
      "_": {
        "type": {
          procent : true,
          length : true,
          custom : true
        },
        values : {
          right : true,
          top : true,
          left : true,
          bottom : true,
          center : true
        }
      }
    },
    "distance": {
      "_": {
        "type": {
          "length": true,
          "procent": true
        }
      }
    },
    "path": {
      "_": {
        "values": {
          "none": true,
          "margin-box": true,
          "stroke-box": true
        },
        "type": {
          "custom": true,
          "image": true
        }
      }
    },
    "rotate": {
      "_": {
        "values": {
          "auto": true,
          "reverse": true
        },
        "type": {
          "custom": true,
          "degree": true
        },
        "seperated": true
      }
    }
  },
  "opacity": {
    "_": {
      "type": {
        "number": true
      }
    }
  },
  orphans : {
    _ : {
      type : {
        integer : true
      }
    }
  },
  "order": {
    "_": {
      "type": {
        "number": true
      }
    }
  },
  "outline": {
    _ : {
      combine : [
        "color",
        "style",
        "width"
      ],
      multi : true,
      max : true
    },
    "color": {
      "_": {
        "values": {
          "invert": true
        },
        "type": {
          "custom": true,
          "color": true
        }
      }
    },
    "offset": {
      "_": {
        "type": {
          "length": true
        }
      }
    },
    "style": {
      "_": {
        "values": {
          "auto": true,
          "none": true,
          "dotted": true,
          "dashed": true,
          "solid": true,
          "groove": true,
          "double": true,
          "ridge": true,
          "inset": true,
          "outset": true
        }
      }
    },
    "width": {
      "_": {
        "values": {
          "thin": true,
          "medium": true,
          "thick": true
        },
        "type": {
          "custom": true,
          "length": true
        }
      }
    }
  },
  "overflow": {
    "_": {
      "values": {
        "visible": true,
        "hidden": true,
        "clip": true,
        "scroll": true,
        "auto": true
      },
      "seperated": true
    },
    clip : {
      margin : {
        _ : {
          type : {
            length : true
          }
        }
      }
    },
    "anchor": {
      "_": {
        "values": {
          "auto": true,
          "none": true
        }
      }
    },
    "block": {
      "_": {
        "values": {
          "visible": true,
          "hidden": true,
          "scroll": true,
          "auto": true
        }
      }
    },
    "inline": {
      "_": {
        "ref": "$up.block"
      }
    },
    "wrap": {
      "_": {
        "values": {
          "normal": true,
          "break-word": true,
          "anywhere": true
        }
      }
    },
    "x": {
      "_": {
        "ref": "$up.$up.overflow"
      }
    },
    "y": {
      "_": {
        "ref": "$up.$up.overflow"
      }
    }
  },
  "overscroll": {
    "behavior": {
      _ : {
        combine : [
          "x",
          "y"
        ],
        multi : true,
        max : 2
      },
      "block": {
        "_": {
          "values": {
            "auto": true,
            "contain": true,
            "none": true
          }
        }
      },
      "inline": {
        "_": {
          "ref": "$up.block"
        }
      },
      "x": {
        "_": {
          "ref": "$up.block"
        }
      },
      "y": {
        "_": {
          "ref": "$up.block"
        }
      }
    }
  },
  "padding": {
    "_": {
      "ref" : "$up.margin"
    },
    "block": {
      "end": {
        "_": {
          "type": {
            "length": true,
            "procent": true
          }
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
        "type": {
          "length": true,
          "procent": true
        }
      }
    },
    "inline": {
      "end": {
        "_": {
          "ref": "$up.$up.$up.padding.block.end"
        }
      },
      "start": {
        "_": {
          "ref": "$up.$up.$up.padding.block.end"
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
      inside : {
        _ : {
          values : {
            auto : true,
            avoid : true
          }
        }
      },
      "after": {
        "_": {
          "values": {
            "auto": true,
            "always": true,
            "avoid": true,
            "left": true,
            "right": true,
            "recto": true,
            "verso": true
          }
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
        "values": {
          "normal": true,
          "stroke": true,
          "fill": true,
          "markers": true
        }
      }
    }
  },
  "perspective": {
    "_": {
      "values": {
        "none": true
      },
      "type": {
        "custom": true,
        "length": true
      }
    },
    "origin": {
      "_": {
        "values": {
          "left": true,
          "right": true,
          "center": true
        },
        "type": {
          "custom": true,
          "length": true,
          "procent": true
        },
        "seperated": true
      }
    }
  },
  place : {
    content : {
      _ : {
        combine : [
          "$up.$up.align.content",
          "$up.$up.justify.content",
        ],
        multi : true,
        max : 2
      }
    },
    items : {
      _ : {
        combine : [
          "$up.$up.align.items",
          "$up.$up.justify.items",
        ],
        multi : true,
        max : 2
      }
    },
    self : {
      _ : {
        combine : [
          "$up.$up.align.self",
          "$up.$up.justify.self",
        ],
        multi : true,
        max : 2
      }
    }
  },
  "pointer": {
    "events": {
      "_": {
        "values": {
          "auto": true,
          "none": true,
          "visiblePainted": true,
          "visibleFill": true,
          "visibleStroke": true,
          "visible": true,
          "painted": true,
          "fill": true,
          "stroke": true,
          "all": true
        }
      }
    }
  },
  "position": {
    "_": {
      values : {
        static : true,
        fixed : true,
        absolute : true,
        relative : true,
        sticky : true
      }
    }
  },
  print : {
    color : {
      adjust : {
        _ : {
          values : {
            economy : true,
            exact : true
          }
        }
      }
    }
  },
  "quotes": {
    "_": {
      "values": {
        "none": true,
        auto : true
      },
      "multi": true
    }
  },
  "r": {
    "_": {
      "type": {
        "number": true,
        "procent": true
      }
    }
  },
  "resize": {
    "_": {
      "values": {
        "none": true,
        "both": true,
        "horizontal": true,
        "vertical": true,
        "block": true,
        "inline": true
      }
    }
  },
  "right": {
    "_": {
      "ref": "$up.bottom"
    }
  },
  "rotate": {
    "_": {
      "values": {
        "none": true,
        "x": true,
        "y": true,
        "z": true
      },
      "type": {
        "custom": true,
        "degree": true,
        "turn": true,
        "rad": true
      },
      "multi": true
    }
  },
  "row": {
    "gap": {
      "_": {
        "type": {
          "length": true,
          "procent": true
        }
      }
    }
  },
  "ruby": {
    "align": {
      "_": {
        "values": {
          "start": true,
          "center": true,
          "space-between": true,
          "space-around": true
        }
      }
    },
    "position": {
      "_": {
        "values": {
          "over": true,
          "under": true,
          "inter-character": true,
          "alternate": true
        }
      }
    }
  },
  "rx": {
    "_": {
      "type": {
        "number": true
      }
    }
  },
  "ry": {
    "_": {
      "type": {
        "number": true
      }
    }
  },
  "scale": {
    "_": {
      "values": {
        "none": true
      },
      "type": {
        "custom": true,
        "number": true
      },
      "seperated": true
    }
  },
  "scroll": {
    "behavior": {
      "_": {
        "values": {
          "auto": true,
          "smooth": true
        }
      }
    },
    "margin": {
      "block": {
        "end": {
          "_": {
            "type": {
              "length": true
            }
          }
        },
        "start": {
          "_": {
            "type": {
              "length": true
            }
          }
        }
      },
      "bottom": {
        "_": {
          "type": {
            "length": true
          }
        }
      },
      "inline": {
        _ : {
          combine : [
            "start",
            "end"
          ],
          multi : true,
          max : 2
        },
        "end": {
          "_": {
            "type": {
              "length": true
            }
          }
        },
        "start": {
          "_": {
            "type": {
              "length": true
            }
          }
        }
      },
      "left": {
        "_": {
          "type": {
            "length": true
          }
        }
      },
      "right": {
        "_": {
          "type": {
            "length": true
          }
        }
      },
      "top": {
        "_": {
          "type": {
            "length": true
          }
        }
      }
    },
    "padding": {
      _ : {
        type : {
          length : true,
          number : true
        },
        multi : true,
        max : 4
      },
      "block": {
        "end": {
          "_": {
            "values": {
              "auto": true
            },
            "type": {
              "custom": true,
              "length": true,
              "procent": true
            }
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
        _ : {
          combine : [
            "end",
            "start"
          ],
          multi : true,
          max : 2
        },
        "end": {
          "_": {
            "values": {
              "auto": true
            },
            "type": {
              "custom": true,
              "length": true
            }
          }
        },
        "start": {
          "_": {
            "ref": "$up.end"
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
      coordinate : {
        _ : {
          type : {
            length : true,
            custom : true,
            procent : true
          },
          values : {
            left : true,
            right : true,
            center : true,
            bottom : true,
            top : true
          },
          multi : true,
          max : 2,
          seperated : true
        }
      },
      destination : {
        _ : {
          ref : "$up.coordinate"
        }
      },
      points : {
        x : {
          _ : {
            type : {
              custom : true,
              functions : true
            },
            functions : {
              repeat : true
            },
            values : {
              none : true
            }
          },
        },
        y : {
          _ : {
            ref : '$up.x'
          }
        }
      },
      "align": {
        "_": {
          "values": {
            "none": true,
            "start": true,
            "end": true,
            "center": true
          },
          "seperated": true
        }
      },
      "type": {
        "_": {
          "values": {
            "none": true,
            "x": true,
            "y": true,
            "block": true,
            "inline": true,
            "both": true,
            "mandatory": true,
            "proximity": true
          },
          "seperated": true
        }
      }
    }
  },
  "scrollbar": {
    "color": {
      "_": {
        "values": {
          "auto": true,
          "dark": true,
          "light": true
        },
        "type": {
          "custom": true,
          "color": true
        },
        "seperated": true
      }
    },
    gutter : {
      _ : {
        values : {
          auto : true,
          stable : true,
          "both-edges" : true
        },
        max : 2,
        multi : true
      }
    },
    "width": {
      "_": {
        "values": {
          "auto": true,
          "thin": true,
          "none": true
        }
      }
    }
  },
  "shape": {
    "image": {
      "threshold": {
        "_": {
          "type": {
            "number": true
          }
        }
      }
    },
    "margin": {
      "_": {
        "type": {
          "length": true,
          "procent": true
        }
      }
    },
    "outside": {
      "_": {
        "values": {
          "none": true,
          "margin-box": true,
          "content-box": true,
          "border-box": true,
          "padding-box": true
        },
        "type": {
          "custom": true,
          "image": true
        }
      }
    },
    "rendering": {
      "_": {
        "values": {
          "auto": true,
          "optimizeSpeed": true,
          "crispEdges": true,
          "geometricPrecision": true
        }
      }
    }
  },
  "stop": {
    "color": {
      "_": {
        "type": {
          "color": true
        }
      }
    },
    "opacity": {
      "_": {
        "type": {
          "number": true
        }
      }
    }
  },
  "stroke": {
    "_": {
      "values": {
        "none": true,
        "context-fill": true,
        "context-stroke": true
      },
      "type": {
        "custom": true,
        "color": true,
        "functions": true
      },
      "functions": {
        "url": true
      }
    },
    "dasharray": {
      "_": {
        "type": {
          "number": true
        },
        "seperated": true
      }
    },
    "dashoffset": {
      "_": {
        "type": {
          "number": true
        }
      }
    },
    "linecap": {
      "_": {
        "values": {
          "butt": true,
          "round": true,
          "square": true
        }
      }
    },
    "linejoin": {
      "_": {
        "values": {
          "arcs": true,
          "bevel": true,
          "miter": true,
          "miter-clip": true,
          "round": true
        }
      }
    },
    "miterlimit": {
      "_": {
        "type": {
          "number": true
        }
      }
    },
    "opacity": {
      "_": {
        "type": {
          "number": true,
          "procent": true
        }
      }
    },
    "width": {
      "_": {
        "type": {
          "number": true,
          "length": true,
          "procent": true
        }
      }
    }
  },
  tab : {
    size : {
      _ : {
        type : {
          length : true,
          number : true
        }
      }
    }
  },
  "table": {
    "layout": {
      "_": {
        "values": {
          "auto": true,
          "fixed": true
        }
      }
    }
  },
  "text": {
    size : {
      adjust : {
        _ : {
          type : {
            procent : true,
            custom : true
          },
          values : {
            none : true,
            auto : true
          }
        }
      }
    },
    "align": {
      "_": {
        "values": {
          "left": true,
          "right": true,
          "center": true,
          "justify": true,
          "justify-all": true,
          "start": true,
          "end": true,
          "match-parent": true
        }
      },
      "last": {
        "_": {
          "values": {
            "auto": true,
            "start": true,
            "end": true,
            "left": true,
            "right": true,
            "center": true,
            "justify": true
          }
        }
      }
    },
    "anchor": {
      "_": {
        "values": {
          "start": true,
          "middle": true,
          "end": true
        }
      }
    },
    "combine": {
      "upright": {
        "_": {
          "values": {
            "none": true,
            "all": true,
            "digits": true
          },
          "type": {
            "custom": true,
            "number": true
          },
          "seperated": true
        }
      }
    },
    "decoration": {
      "_": {
        "join": {
          "$up.line": true,
          "$up.color": true,
          "$up.style": true,
          "$up.thickness": true
        }
      },
      "color": {
        "_": {
          "type": {
            "color": true
          }
        }
      },
      "line": {
        "_": {
          "values": {
            "none": true,
            "underline": true,
            "overline": true,
            "line-through": true,
            "blink": true
          },
          "seperated": true
        }
      },
      "skip": {
        _ : {
          type : {
            custom : true
          },
          values : {
            none : true,
            objects : true,
            spaces : true,
            'leading-spaces' : true,
            'trailing-spaces' : true,
            edges : true,
            'box-decoration' : true
          },
          multi : true,
          max : 2
        },
        "ink": {
          "_": {
            "values": {
              "auto": true,
              "all": true,
              "none": true
            }
          }
        }
      },
      "style": {
        "_": {
          "values": {
            "solid": true,
            "double": true,
            "dotted": true,
            "dashed": true,
            "wavy": true
          }
        }
      },
      "thickness": {
        "_": {
          "values": {
            "auto": true,
            "from-font": true
          },
          "type": {
            "custom": true,
            "length": true,
            "procent": true
          }
        }
      }
    },
    "emphasis": {
      _ : {
        combine : [
          "style",
          "color"
        ],
        multi : true,
        max : 2
      },
      "color": {
        "_": {
          "type": {
            "color": true
          }
        }
      },
      "position": {
        "_": {
          "values": {
            "over": true,
            "under": true,
            "right": true,
            "left": true
          },
          "seperated": true
        }
      },
      "style": {
        "_": {
          "values": {
            "none": true,
            "filled": true,
            "open": true,
            "dot": true,
            "circle": true,
            "double-circle": true,
            "triangle": true,
            "sesame": true
          },
          "type": {
            "custom": true
          }
        }
      }
    },
    "indent": {
      "_": {
        "values": {
          "each-line": true,
          "hanging": true
        },
        "type": {
          "custom": true,
          "length": true,
          "procent": true
        }
      }
    },
    "justify": {
      "_": {
        "values": {
          "none": true,
          "auto": true,
          "inter-word": true,
          "inter-character": true,
          "distribute": true
        }
      }
    },
    "orientation": {
      "_": {
        "values": {
          "mixed": true,
          "upright": true,
          "sideways-right": true,
          "sideways": true,
          "use-glyph-orientation": true
        }
      }
    },
    "overflow": {
      "_": {
        "values": {
          "clip": true,
          "ellipsis": true,
          "fade": true
        },
        "type": {
          "custom": true
        }
      }
    },
    "rendering": {
      "_": {
        "values": {
          "auto": true,
          "optimizeSpeed": true,
          "optimizeLegibility": true,
          "geometricPrecision": true
        }
      }
    },
    "shadow": {
      "_": {
        "type": {
          "length": true,
          "color": true
        },
        "seperated": true,
        "multi": true
      }
    },
    "transform": {
      "_": {
        "values": {
          "none": true,
          "capitalize": true,
          "uppercase": true,
          "lowercase": true,
          "full-width": true,
          "full-size-kana": true
        }
      }
    },
    "underline": {
      "offset": {
        "_": {
          "values": {
            "auto": true
          },
          "type": {
            "custom": true,
            "length": true,
            "procent": true
          }
        }
      },
      "position": {
        "_": {
          "values": {
            "auto": true,
            "under": true,
            "left": true,
            "right": true
          },
          "seperated": true
        }
      }
    }
  },
  "top": {
    "_": {
      "ref": "$up.$up.bottom"
    }
  },
  "touch": {
    "action": {
      "_": {
        "values": {
          "auto": true,
          "none": true,
          "pan-x": true,
          "pan-left": true,
          "pan-right": true,
          "pan-y": true,
          "pan-up": true,
          "pan-down": true,
          "pinch-zoom": true,
          "manipulation": true
        }
      }
    }
  },
  "transform": {
    "_": {
      "values": {
        "none": true
      },
      "type": {
        "custom": true,
        "functions": true
      },
      "functions": {
        "matrix": true,
        "matrix3d": true,
        "perspective": true,
        "rotate": true,
        "rotate3d": true,
        "rotateX": true,
        "rotateY": true,
        "rotateZ": true,
        "translate": true,
        "translate3d": true,
        "translateX": true,
        "translateY": true,
        "translateZ": true,
        "scale": true,
        "scale3d": true,
        "scaleX": true,
        "scaleY": true,
        "scaleZ": true,
        "skew": true,
        "skewX": true,
        "skewY": true
      }
    },
    "box": {
      "_": {
        "values": {
          "content-box": true,
          "border-box": true,
          "fill-box": true,
          "stroke-box": true,
          "view-box": true
        }
      }
    },
    "origin": {
      "_": {
        "type": {
          length : true,
          procent : true,
          custom : true
        },
        values : {
          center : true,
          left : true,
          right : true,
          top : true,
          bottom : true
        },
        multi : true,
        max : 3
      }
    },
    "style": {
      "_": {
        "values": {
          "flat": true,
          "preserve-3d": true
        }
      }
    }
  },
  "transition": {
    _ : {
      combine : [
        "delay",
        "duration",
        "property",
        "timing.function"
      ],
      multi : true,
      max : 4,
      seperated : true
    },
    "delay": {
      "_": {
        "type": {
          "time": true
        },
        "multi": true
      }
    },
    "duration": {
      "_": {
        "ref": "$up.delay"
      }
    },
    "property": {
      "_": {
        "values": {
          "none": true,
          "all": true
        },
        "type": {
          "custom": true,
          "name": true
        }
      }
    },
    "timing": {
      "function": {
        "_": {
          "values": {
            "ease": true,
            "ease-in": true,
            "ease-out": true,
            "ease-in-out": true,
            "linear": true,
            "step-start": true,
            "step-end": true
          },
          "type": {
            "custom": true,
            "functions": true
          },
          "functions": {
            "cubic-bezier": true,
            "steps": true
          }
        }
      }
    }
  },
  "translate": {
    "_": {
      "type": {
        "length": true,
        "procent": true
      },
      "seperated": true
    }
  },
  "unicode": {
    "bidi": {
      "_": {
        "values": {
          "normal": true,
          "embed": true,
          "isolate": true,
          "bidi-override": true,
          "isolate-override": true,
          "plaintext": true
        }
      }
    }
  },
  "user": {
    "select": {
      "_": {
        "values": {
          "none": true,
          "auto": true,
          "text": true,
          "contain": true,
          "all": true
        }
      }
    }
  },
  "vector": {
    "effect": {
      "_": {
        "values": {
          "none": true,
          "non-scaling-stroke": true,
          "non-scaling-size": true,
          "non-rotation": true,
          "fixed-position": true
        }
      }
    }
  },
  "vertical": {
    "align": {
      "_": {
        "values": {
          "baseline": true,
          "sub": true,
          "super": true,
          "text-top": true,
          "text-bottom": true,
          "middle": true,
          "top": true,
          "bottom": true
        },
        "type": {
          "custom": true,
          "length": true,
          "procent": true
        }
      }
    }
  },
  "visibility": {
    "_": {
      "values": {
        "visible": true,
        "hidden": true,
        "collapse": true
      }
    }
  },
  "white": {
    "space": {
      "_": {
        "values": {
          "normal": true,
          "nowrap": true,
          "pre": true,
          "pre-wrap": true,
          "pre-line": true,
          "break-spaces": true
        }
      }
    }
  },
  widows : {
    _ : {
      type : {
        integer : true
      }
    }
  },
  webkit : {
    appearance : {
      _ : {
        ref : "$up.$up.appearance"
      }
    }
  },
  "width": {
    "_": {
      "ref": "$up.height"
    }
  },
  "will": {
    "change": {
      "_": {
        "values": {
          "auto": true,
          "scroll-position": true,
          "contents": true
        },
        "type": {
          "custom": true,
          "name": true
        },
        "seperated": true
      }
    }
  },
  "word": {
    "break": {
      "_": {
        "values": {
          "normal": true,
          "break-all": true,
          "kepp-all": true
        }
      }
    },
    "spacing": {
      "_": {
        "values": {
          "normal": true
        },
        "type": {
          "custom": true,
          "length": true,
          "procent": true
        }
      }
    }
  },
  "writing": {
    "mode": {
      "_": {
        "values": {
          "horizontal-tb": true,
          "vertical-rl": true,
          "vertical-lr": true
        }
      }
    }
  },
  "x": {
    "_": {
      "type": {
        "number": true
      }
    }
  },
  "y": {
    "_": {
      "type": {
        "number": true
      }
    }
  },
  "z": {
    "index": {
      "_": {
        "type": {
          "number": true
        }
      }
    }
  }
}
