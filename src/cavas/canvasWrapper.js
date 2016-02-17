var m = Math;
var mr = m.round;
var ms = m.sin;
var mc = m.cos;
var abs = m.abs;
var sqrt = m.sqrt;

function createMatrixIdentity() {
  return [
    [1, 0, 0],
    [0, 1, 0],
    [0, 0, 1]
  ];
}

function matrixMultiply(m1, m2) {
  var result = createMatrixIdentity();
  for (var x = 0; x < 3; x++) {
    for (var y = 0; y < 3; y++) {
      var sum = 0;
      for (var z = 0; z < 3; z++) {
        sum += m1[x][z] * m2[z][y];
      }
      result[x][y] = sum;
    }
  }
  return result;
}

function copyState(o1, o2) {
  o2.fillStyle = o1.fillStyle;
  o2.lineCap = o1.lineCap;
  o2.lineJoin = o1.lineJoin;
  o2.lineWidth = o1.lineWidth;
  o2.miterLimit = o1.miterLimit;
  o2.shadowBlur = o1.shadowBlur;
  o2.shadowColor = o1.shadowColor;
  o2.shadowOffsetX = o1.shadowOffsetX;
  o2.shadowOffsetY = o1.shadowOffsetY;
  o2.strokeStyle = o1.strokeStyle;
  o2.globalAlpha = o1.globalAlpha;

  o2.globalCompositeOperation = o1.globalCompositeOperation;
  o2.font = o1.font;
  o2.textAlign = o2.textAlign;
  o2.textBaseline = o2.textBaseline;
}

function CanvasWrapper(ctx) {
  this.m_ = createMatrixIdentity();
  this.mStack_ = [];
  this.aStack_ = [];
  this.canvas = ctx;
  // Canvas context properties
  this.strokeStyle = '#000';
  this.fillStyle = '#000';
  this.lineWidth = 1;
  this.lineJoin = 'miter';
  this.lineCap = 'butt';
  this.miterLimit = 1;
  this.globalAlpha = 1;
}
var cwPrototype = CanvasWrapper.prototype;
cwPrototype.applyContextProperties = function() {
  this.canvas.strokeStyle = this.strokeStyle;
  this.canvas.shadowColor = this.shadowColor;
  this.canvas.shadowBlur = this.shadowBlur;
  this.canvas.shadowOffsetX = this.shadowOffsetX;
  this.canvas.shadowOffsetY = this.shadowOffsetY;
  this.canvas.globalCompositeOperation = this.globalCompositeOperation;

  this.canvas.font = this.font;
  this.canvas.textAlign = this.textAlign;
  this.canvas.textBaseline = this.textBaseline;

  this.canvas.fillStyle = this.fillStyle;
  this.canvas.lineWidth = this.lineWidth;
  this.canvas.lineJoin = this.lineJoin;
  this.canvas.lineCap = this.lineCap;
  this.canvas.miterLimit = this.miterLimit;
  this.canvas.globalAlpha = this.globalAlpha;
};



/*Colors, Styles, and Shadows*/
cwPrototype.createPattern = function(image, repeat) {
  this.applyContextProperties();
  return this.canvas.createPattern(image, repeat);
}
cwPrototype.createLinearGradient = function(aX0, aY0, aX1, aY1) {
  this.applyContextProperties();
  return this.canvas.createLinearGradient(aX0, aY0, aX1, aY1);
};
cwPrototype.createRadialGradient = function(x0, y0, r0, x1, y1, r1) {
  this.applyContextProperties();
  return this.canvas.createRadialGradient(x0, y0, r0, x1, y1, r1);
};
cwPrototype.addColorStop = function(stop, color) {
    this.applyContextProperties();
    return this.canvas.addColorStop(stop, color);
  }
  /*Rectangles*/
cwPrototype.rect = function(aX, aY, aWidth, aHeight) {
  this.applyContextProperties();
  this.canvas.rect(aX, aY, aWidth, aHeight);
  var p = this.getCoords(aX, aY);
  this.currentX_ = p.x;
  this.currentY_ = p.y;
};
cwPrototype.strokeRect = function(aX, aY, aWidth, aHeight) {
  this.applyContextProperties();
  this.canvas.strokeRect(aX, aY, aWidth, aHeight);
  var p = this.getCoords(aX, aY);
  this.currentX_ = p.x;
  this.currentY_ = p.y;
};
cwPrototype.fillRect = function(aX, aY, aWidth, aHeight) {
  this.applyContextProperties();
  this.canvas.fillRect(aX, aY, aWidth, aHeight);
  var p = this.getCoords(aX, aY);
  this.currentX_ = p.x;
  this.currentY_ = p.y;
};
cwPrototype.clearRect = function(aX, aY, aWidth, aHeight) {
    this.applyContextProperties();
    this.canvas.clearRect(aX, aY, aWidth, aHeight);
    var p = this.getCoords(aX, aY);
    this.currentX_ = p.x;
    this.currentY_ = p.y;
  }
  /*Paths*/
cwPrototype.fill = function() {
  this.applyContextProperties();
  return this.canvas.fill();
}
cwPrototype.stroke = function(aPath) {
  this.applyContextProperties();
  if (aPath) {
    return this.canvas.stroke(aPath);
  } else {
    return this.canvas.stroke();
  }
}
cwPrototype.beginPath = function() {
  this.applyContextProperties();
  return this.canvas.beginPath();
};
cwPrototype.moveTo = function(aX, aY) {
  this.applyContextProperties();
  this.canvas.moveTo(aX, aY);
  var p = this.getCoords(aX, aY);
  this.currentX_ = p.x;
  this.currentY_ = p.y;
};
cwPrototype.closePath = function() {
  this.applyContextProperties();
  this.canvas.closePath();
};
cwPrototype.lineTo = function(aX, aY) {
  this.applyContextProperties();
  this.canvas.lineTo(aX, aY);
  var p = this.getCoords(aX, aY);
  this.currentX_ = p.x;
  this.currentY_ = p.y;
};
cwPrototype.clip = function() {
  this.applyContextProperties();
  this.canvas.clip();
};
cwPrototype.quadraticCurveTo = function(aCPx, aCPy, aX, aY) {
  this.applyContextProperties();
  this.canvas.quadraticCurveTo(aCPx, aCPy, aX, aY);
  var p = this.getCoords(aX, aY);
  this.currentX_ = p.x;
  this.currentY_ = p.y;
};
cwPrototype.bezierCurveTo = function(aCP1x, aCP1y, aCP2x, aCP2y, aX, aY) {
  this.applyContextProperties();
  this.canvas.bezierCurveTo(aCP1x, aCP1y, aCP2x, aCP2y, aX, aY);
  var p = this.getCoords(aX, aY);
  this.currentX_ = p.x;
  this.currentY_ = p.y;
};
cwPrototype.arc = function(x, y, r, sAngle, eAngle, counterclockwise) {
  this.applyContextProperties();
  if (counterclockwise)
    this.canvas.arc(x, y, r, sAngle, eAngle, counterclockwise);
  else
    this.canvas.arc(x, y, r, sAngle, eAngle);
};
cwPrototype.arcTo = function(x1, y1, x2, y2, r) {
  this.applyContextProperties();
  this.canvas.arcTo(x1, y1, x2, y2, r);
  var p = this.getCoords(X2, Y2);
  this.currentX_ = p.x;
  this.currentY_ = p.y;
}
cwPrototype.isPointInPath = function(x, y) {
  this.applyContextProperties();
  return this.canvas.isPointInPath(x, y);
}
cwPrototype.setLineDash = function(arg) {
  this.applyContextProperties();
  this.canvas.setLineDash(arg);
}

/*Transformations*/
cwPrototype.scale = function(aX, aY) {
  this.canvas.scale(aX, aY);
  var m1 = [
    [aX, 0, 0],
    [0, aY, 0],
    [0, 0, 1]
  ];
  setM(this, matrixMultiply(m1, this.m_));
};
cwPrototype.translate = function(aX, aY) {
  this.canvas.translate(aX, aY);
  var m1 = [
    [1, 0, 0],
    [0, 1, 0],
    [aX, aY, 1]
  ];
  setM(this, matrixMultiply(m1, this.m_));
};
cwPrototype.rotate = function(aRot) {

  this.canvas.rotate(aRot);
  var c = mc(aRot);
  var s = ms(aRot);
  var m1 = [
    [c, s, 0],
    [-s, c, 0],
    [0, 0, 1]
  ];
  setM(this, matrixMultiply(m1, this.m_));
};
cwPrototype.transform = function(m11, m12, m21, m22, dx, dy) {
  this.canvas.transform(m11, m12, m21, m22, dx, dy);
  var m1 = [
    [m11, m12, 0],
    [m21, m22, 0],
    [dx, dy, 1]
  ];
  setM(this, matrixMultiply(m1, this.m_));
};
cwPrototype.setTransform = function(m11, m12, m21, m22, dx, dy) {
  this.canvas.setTransform(m11, m12, m21, m22, dx, dy);
  var m = [
    [m11, m12, 0],
    [m21, m22, 0],
    [dx, dy, 1]
  ];
  setM(this, m);
};

/*Text*/
cwPrototype.fillText = function(text, x, y, maxWidth) {
  this.applyContextProperties();
  if (maxWidth)
    return this.canvas.fillText(text, x, y, maxWidth);
  else
    return this.canvas.fillText(text, x, y);
}
cwPrototype.strokeText = function(text, x, y, maxWidth) {
  this.applyContextProperties();
  if (maxWidth)
    return this.canvas.strokeText(text, x, y, maxWidth);
  else
    return this.canvas.strokeText(text, x, y);
}
cwPrototype.measureTextWidth = cwPrototype.measureText = function(txt) {
    this.applyContextProperties();
    return this.canvas.measureText(txt);
  }
  /*Image Drawing*/
cwPrototype.drawImage = function() {
    this.applyContextProperties();
    if (arguments.length == 3) {
      this.canvas.drawImage(arguments[0], arguments[1], arguments[2]);
    } else if (arguments.length == 5) {
      this.canvas.drawImage(arguments[0], arguments[1], arguments[2], arguments[
        3], arguments[4]);
    } else if (arguments.length == 9) {
      this.canvas.drawImage(arguments[0], arguments[1], arguments[2], arguments[
          3], arguments[4], arguments[5], arguments[6], arguments[7],
        arguments[8]);
    } else {
      this.canvas.drawImage(arguments[0], arguments[1], arguments[2]);
    }

  }
  /*Pixel Manipulation*/
cwPrototype.createImageData = function() {
  this.applyContextProperties();
  if (arguments.length == 1)
    return this.canvas.createImageData(arguments[0]);
  else if (arguments.length == 2)
    return this.canvas.createImageData(arguments[0], arguments[1]);
}

cwPrototype.getImageData = function(x, y, width, height) {
  this.applyContextProperties();
  return this.canvas.getImageData(x, y, width, height);
}
cwPrototype.putImageData = function(imgData, x, y, dirtyX, dirtyY, dirtyWidth,
    dirtyHeight) {
    this.applyContextProperties();
    if (dirtyX && dirtyY && dirtyWidth && dirtyHeight)
      return this.canvas.putImageData(imgData, x, y, dirtyX, dirtyY, dirtyWidth,
        dirtyHeight);
    else if (dirtyX && dirtyY && dirtyWidth)
      return this.canvas.putImageData(imgData, x, y, dirtyX, dirtyY, dirtyWidth);
    else if (dirtyX && dirtyY)
      return this.canvas.putImageData(imgData, x, y, dirtyX, dirtyY);
    else if (dirtyX)
      return this.canvas.putImageData(imgData, x, y, dirtyX, dirtyY);
    else
      return this.canvas.putImageData(imgData, x, y);
  }
  /*Auxiliar*/

cwPrototype.getCoords = function(aX, aY) {
  var m = this.m_;
  return {
    x: aX * m[0][0] + aY * m[1][0] + m[2][0],
    y: aX * m[0][1] + aY * m[1][1] + m[2][1]
  }
};
cwPrototype.save = function() {
  this.canvas.save();
  var o = {};
  copyState(this, o);
  this.aStack_.push(o);
  this.mStack_.push(this.m_);
  // is this a no-op?
  this.m_ = matrixMultiply(createMatrixIdentity(), this.m_);
  return this.canvas;
};
cwPrototype.restore = function() {
  this.canvas.restore();
  copyState(this.aStack_.pop(), this);
  this.m_ = this.mStack_.pop();
  return this.canvas;
};

function matrixIsFinite(m) {
  for (var j = 0; j < 3; j++) {
    for (var k = 0; k < 2; k++) {
      if (!isFinite(m[j][k]) || isNaN(m[j][k])) {
        return false;
      }
    }
  }
  return true;
}

function setM(ctx, m) {
  if (!matrixIsFinite(m)) {
    return;
  }
  ctx.m_ = m;
}

cwPrototype.setMatrix = function(matrix) {
  this.setTransform(matrix[0][0], matrix[0][1], matrix[1][0], matrix[1][1],
    matrix[2][0], matrix[2][1]);
}

cwPrototype.getMatrix = function() {
  return this.m_
}
