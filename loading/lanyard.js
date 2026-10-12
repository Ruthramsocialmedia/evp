/**
 * ==========================================================================
 * EVP SANAS CONVENTION CENTRE — 3D PHYSICS LANYARD (From React Bits)
 * Vanilla JavaScript + Three.js Port | WebGL Shaders | Verlet Ribbon Simulation
 * ==========================================================================
 */

(function (window, document) {
  'use strict';

  var CARD_SIZES = {
    portrait: [1.6, 2.25],
    landscape: [2.25, 1.6]
  };
  var ANCHORS = { left: 0.27, center: 0.5, right: 0.73 };
  var THICKNESS = 0.018;
  var BEVEL = 0.007;
  var JOINTS = 4;
  var NODE_WEIGHT = 1 / 0.05;
  var MAX_STEP = 1 / 960;
  var ITERATIONS = 2;
  var SAMPLES = 72;
  var FOV = 24;
  var STRAP_WIDTH = 0.36;
  var RING_RADIUS = 0.095;
  var RING_TUBE = 0.0135;
  var EYELET_RADIUS = 0.036;
  var CLAMP_BODY = 0.15;
  var FACE_WIDTH = 1024;

  var FINISHES = {
    glossy: { roughness: 0.42, metalness: 0, clearcoat: 1, clearcoatRoughness: 0.06, foil: 0, anisotropy: 0 },
    matte: { roughness: 0.85, metalness: 0, clearcoat: 0, clearcoatRoughness: 0.6, foil: 0, anisotropy: 0 },
    holographic: { roughness: 0.3, metalness: 0, clearcoat: 1, clearcoatRoughness: 0.04, foil: 1, anisotropy: 0 },
    metallic: { roughness: 0.36, metalness: 0.75, clearcoat: 0.5, clearcoatRoughness: 0.18, foil: 0, anisotropy: 0.7 }
  };

  var BAND_COLUMNS = [0, 0.07, 0.93, 1];
  var BAND_BEND = [-0.95, -0.28, 0.28, 0.95];
  var FLIP_SPIN = 9;

  var FOIL_VERTEX_HEAD = [
    'varying vec2 vFoilUv;',
    'varying vec3 vFoilX;',
    'varying vec3 vFoilY;'
  ].join('\n');

  var FOIL_VERTEX_BODY = [
    'vFoilUv = uv;',
    'vFoilX = normalize((modelViewMatrix * vec4(1.0, 0.0, 0.0, 0.0)).xyz);',
    'vFoilY = normalize((modelViewMatrix * vec4(0.0, 1.0, 0.0, 0.0)).xyz);'
  ].join('\n');

  var FOIL_FRAGMENT_HEAD = [
    'uniform float foilStrength;',
    'uniform float foilAspect;',
    'uniform vec3 foilKey;',
    'uniform vec3 foilFill;',
    'uniform vec3 foilTop;',
    'varying vec2 vFoilUv;',
    'varying vec3 vFoilX;',
    'varying vec3 vFoilY;',
    '',
    'float foilHash(vec2 p) {',
    '  p = fract(p * vec2(234.34, 435.345));',
    '  p += dot(p, p + 34.23);',
    '  return fract(p.x * p.y);',
    '}',
    '',
    'float foilBump(float t, float center, float width) {',
    '  float x = (t - center) / width;',
    '  return max(0.0, 1.0 - x * x);',
    '}',
    '',
    'vec3 foilSpectrum(float t) {',
    '  return vec3(',
    '    foilBump(t, 0.82, 0.32) + 0.4 * foilBump(t, 0.02, 0.12),',
    '    foilBump(t, 0.5, 0.26),',
    '    foilBump(t, 0.18, 0.24)',
    '  );',
    '}',
    '',
    'vec3 foilGrating(float u, float spacing) {',
    '  vec3 color = vec3(0.0);',
    '  for (int m = 1; m <= 2; m++) {',
    '    float order = float(m);',
    '    float t = (spacing * abs(u) / order - 0.38) / 0.32;',
    '    color += foilSpectrum(t) / order;',
    '  }',
    '  return color;',
    '}',
    '',
    'vec3 foilShard(vec2 p) {',
    '  vec2 base = floor(p);',
    '  float best = 9.0;',
    '  float edge = 9.0;',
    '  vec2 id = base;',
    '  for (int j = -1; j <= 1; j++) {',
    '    for (int i = -1; i <= 1; i++) {',
    '      vec2 cell = base + vec2(float(i), float(j));',
    '      vec2 site = cell + vec2(foilHash(cell), foilHash(cell + 7.31)) * 0.9 + 0.05;',
    '      float d = length(site - p);',
    '      if (d < best) {',
    '        edge = best;',
    '        best = d;',
    '        id = cell;',
    '      } else if (d < edge) {',
    '        edge = d;',
    '      }',
    '    }',
    '  }',
    '  return vec3(foilHash(id + 3.17), foilHash(id + 11.73), edge - best);',
    '}'
  ].join('\n');

  var FOIL_FRAGMENT_BODY = [
    'if (foilStrength > 0.0) {',
    '  vec3 foilView = normalize(vViewPosition);',
    '  vec3 foilNormal = normalize(normal);',
    '  vec2 foilP = vec2(vFoilUv.x, vFoilUv.y * foilAspect);',
    '  vec3 shard = foilShard(foilP * 26.0);',
    '  vec2 ray = foilP - vec2(-1.6, 2.6 * foilAspect);',
    '  float angle = atan(ray.y, ray.x) + (shard.x - 0.5) * 0.16;',
    '  vec3 grating = normalize(vFoilX * cos(angle) + vFoilY * sin(angle));',
    '  float spacing = 1.7 * (0.95 + shard.y * 0.1);',
    '  vec3 rainbow = foilGrating(dot(foilKey + foilView, grating), spacing);',
    '  rainbow += 0.6 * foilGrating(dot(foilTop + foilView, grating), spacing);',
    '  rainbow *= 0.8 + 0.2 * smoothstep(0.0, 0.04, shard.z);',
    '  rainbow = max(rainbow - 0.35 * min(rainbow.r, min(rainbow.g, rainbow.b)), 0.0);',
    '  vec2 grid = foilP * 64.0;',
    '  vec2 cell = floor(grid);',
    '  vec2 jitter = vec2(foilHash(cell + 1.7), foilHash(cell + 9.2));',
    '  float flake = smoothstep(0.32, 0.06, length(fract(grid) - jitter * 0.6 - 0.2)) * step(0.45, foilHash(cell + 4.4));',
    '  vec3 facet = normalize(foilNormal + (vFoilX * (jitter.x - 0.5) + vFoilY * (jitter.y - 0.5)) * 0.8);',
    '  float glint = pow(max(dot(reflect(-foilKey, facet), foilView), 0.0), 28.0);',
    '  glint += 0.7 * pow(max(dot(reflect(-foilTop, facet), foilView), 0.0), 28.0);',
    '  float fine = 1.0 - smoothstep(0.35, 0.9, max(fwidth(grid.x), fwidth(grid.y)));',
    '  vec3 sparkle = flake * glint * fine * (vec3(0.7) + foilGrating(dot(foilKey + foilView, grating) + jitter.x * 0.4, spacing));',
    '  float ink = dot(diffuseColor.rgb, vec3(0.2126, 0.7152, 0.0722));',
    '  float foil = foilStrength * (0.05 + 0.95 * smoothstep(0.04, 0.7, ink));',
    '  float facing = clamp(dot(foilNormal, foilView), 0.0, 1.0);',
    '  float tint = clamp(dot(rainbow, vec3(0.4)), 0.0, 1.0);',
    '  outgoingLight = outgoingLight * (1.0 - foil * (0.18 + 0.22 * tint)) + (rainbow * 0.42 * (0.4 + 0.6 * facing) + sparkle * 0.35) * foil;',
    '}'
  ].join('\n');

  var METALS = {
    silver: { color: '#d9dce2', roughness: 0.16 },
    gold: { color: '#e4b965', roughness: 0.2 },
    graphite: { color: '#4d4f55', roughness: 0.28 }
  };

  var clamp = function (value, min, max) { return Math.min(max, Math.max(min, value)); };
  var mix = function (a, b, t) { return a + (b - a) * t; };

  var parseColor = function (value, fallback) {
    try {
      var ctx = document.createElement('canvas').getContext('2d');
      if (!ctx) return fallback;
      ctx.fillStyle = '#000000';
      ctx.fillStyle = value;
      var resolved = ctx.fillStyle;
      if (resolved.indexOf('#') === 0) {
        var n = parseInt(resolved.slice(1), 16);
        return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
      }
      var parts = resolved.match(/[\d.]+/g);
      if (!parts || parts.length < 3) return fallback;
      return [Number(parts[0]) / 255, Number(parts[1]) / 255, Number(parts[2]) / 255];
    } catch (e) {
      return fallback;
    }
  };

  var luminance = function (rgb) { return 0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2]; };
  var toCss = function (rgb, alpha) {
    if (alpha === undefined) alpha = 1;
    return 'rgba(' + Math.round(rgb[0] * 255) + ', ' + Math.round(rgb[1] * 255) + ', ' + Math.round(rgb[2] * 255) + ', ' + alpha + ')';
  };

  var seeded = function (start) {
    var state = start >>> 0;
    return function () {
      state = (state + 0x6d2b79f5) >>> 0;
      var t = state;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  };

  var traceRoundedRect = function (path, x, y, width, height, radius) {
    var r = Math.max(0, Math.min(radius, width / 2, height / 2));
    var k = r * 0.4477;
    path.moveTo(x + r, y);
    path.lineTo(x + width - r, y);
    path.bezierCurveTo(x + width - k, y, x + width, y + k, x + width, y + r);
    path.lineTo(x + width, y + height - r);
    path.bezierCurveTo(x + width, y + height - k, x + width - k, y + height, x + width - r, y + height);
    path.lineTo(x + r, y + height);
    path.bezierCurveTo(x + k, y + height, x, y + height - k, x, y + height - r);
    path.lineTo(x, y + r);
    path.bezierCurveTo(x, y + k, x + k, y, x + r, y);
  };

  var cardLayout = function (orientation, cornerRadius) {
    var dims = CARD_SIZES[orientation] || CARD_SIZES.portrait;
    var width = dims[0];
    var height = dims[1];
    var radius = mix(0.03, Math.min(width, height) * 0.2, clamp(cornerRadius, 0, 1));
    var slot = { width: 0.34, height: 0.07, y: height / 2 - 0.13 };
    var ringY = height / 2 - 0.055;
    return { width: width, height: height, radius: radius, slot: slot, ringY: ringY, hangY: ringY + RING_RADIUS };
  };

  var buildCardGeometry = function (layout) {
    var width = layout.width;
    var height = layout.height;
    var radius = layout.radius;
    var slot = layout.slot;
    var outline = new THREE.Shape();
    traceRoundedRect(
      outline,
      -width / 2 + BEVEL,
      -height / 2 + BEVEL,
      width - BEVEL * 2,
      height - BEVEL * 2,
      Math.max(radius - BEVEL, 0.005)
    );
    var hole = new THREE.Path();
    traceRoundedRect(
      hole,
      -slot.width / 2 - BEVEL,
      slot.y - slot.height / 2 - BEVEL,
      slot.width + BEVEL * 2,
      slot.height + BEVEL * 2,
      slot.height / 2 + BEVEL
    );
    outline.holes.push(hole);
    var body = new THREE.ExtrudeGeometry(outline, {
      depth: THICKNESS,
      bevelEnabled: true,
      bevelThickness: BEVEL,
      bevelSize: BEVEL,
      bevelSegments: 5,
      curveSegments: 24
    });
    body.translate(0, 0, -THICKNESS / 2);
    var face = new THREE.ShapeGeometry(outline, 24);
    var position = face.getAttribute('position');
    var uv = face.getAttribute('uv');
    for (var i = 0; i < position.count; i++) {
      uv.setXY(i, (position.getX(i) + width / 2) / width, (position.getY(i) + height / 2) / height);
    }
    uv.needsUpdate = true;
    return { body: body, face: face };
  };

  var buildClampGeometry = function (width) {
    var shape = new THREE.Shape();
    var w = width * 1.16;
    traceRoundedRect(shape, -w / 2 + 0.014, -CLAMP_BODY / 2 + 0.014, w - 0.028, CLAMP_BODY - 0.028, 0.024);
    var geometry = new THREE.ExtrudeGeometry(shape, {
      depth: 0.02,
      bevelEnabled: true,
      bevelThickness: 0.014,
      bevelSize: 0.014,
      bevelSegments: 6,
      curveSegments: 10
    });
    geometry.translate(0, 0, -0.01);
    return geometry;
  };

  var buildBandGeometry = function (count) {
    var columns = BAND_COLUMNS.length;
    var geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(count * columns * 3), 3));
    geometry.setAttribute('normal', new THREE.BufferAttribute(new Float32Array(count * columns * 3), 3));
    geometry.setAttribute('uv', new THREE.BufferAttribute(new Float32Array(count * columns * 2), 2));
    var index = [];
    for (var i = 0; i < count - 1; i++) {
      for (var c = 0; c < columns - 1; c++) {
        var a = i * columns + c;
        index.push(a, a + columns, a + 1, a + 1, a + columns, a + columns + 1);
      }
    }
    geometry.setIndex(index);
    return geometry;
  };

  var buildEnvironment = function (renderer) {
    var scene = new THREE.Scene();
    scene.background = new THREE.Color(0.035, 0.035, 0.04);
    var geometry = new THREE.PlaneGeometry(1, 1);
    var materials = [];
    var panel = function (intensity, position, scale, rotation) {
      if (rotation === undefined) rotation = 0;
      var material = new THREE.MeshBasicMaterial({
        color: new THREE.Color(intensity, intensity, intensity),
        side: THREE.DoubleSide
      });
      materials.push(material);
      var mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(position[0], position[1], position[2]);
      mesh.scale.set(scale[0], scale[1], 1);
      mesh.lookAt(0, 0, 0);
      mesh.rotateZ(rotation);
      scene.add(mesh);
    };
    panel(2.6, [0, 4.5, 8], [9, 4]);
    panel(6, [-5.5, 0.5, 7], [0.9, 14]);
    panel(4, [5, -0.5, 8], [0.6, 14]);
    panel(3.5, [0, -1, 9], [24, 0.35], Math.PI / 3);
    panel(2.5, [1, 2.5, 9], [24, 0.2], Math.PI / 3);
    panel(1.4, [0, 6, -6], [12, 4]);
    panel(0.5, [0, -7, 1], [16, 6]);
    panel(0.9, [8, 0, -2], [4, 10]);
    var pmrem = new THREE.PMREMGenerator(renderer);
    var target = pmrem.fromScene(scene, 0.035);
    pmrem.dispose();
    geometry.dispose();
    materials.forEach(function (material) { material.dispose(); });
    return target;
  };

  var makeCanvasTexture = function (canvas, anisotropy) {
    var texture = new THREE.CanvasTexture(canvas);
    if (THREE.SRGBColorSpace) texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = anisotropy;
    return texture;
  };

  var buildGrainTexture = function () {
    var size = 128;
    var canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    var ctx = canvas.getContext('2d');
    if (!ctx) return new THREE.CanvasTexture(canvas);
    var random = seeded(7);
    var field = Float32Array.from({ length: size * size }, function () { return random(); });
    var height = function (x, y) {
      var sum = 0;
      for (var j = -1; j <= 1; j++) {
        for (var i = -1; i <= 1; i++) sum += field[((y + j + size) % size) * size + ((x + i + size) % size)];
      }
      return (sum / 9) * 1.6;
    };
    var image = ctx.createImageData(size, size);
    for (var y = 0; y < size; y++) {
      for (var x = 0; x < size; x++) {
        var nx = height((x - 1 + size) % size, y) - height((x + 1) % size, y);
        var ny = height(x, (y - 1 + size) % size) - height(x, (y + 1) % size);
        var length = Math.hypot(nx, ny, 1);
        var i = (y * size + x) * 4;
        image.data[i] = ((nx / length) * 0.5 + 0.5) * 255;
        image.data[i + 1] = ((ny / length) * 0.5 + 0.5) * 255;
        image.data[i + 2] = ((1 / length) * 0.5 + 0.5) * 255;
        image.data[i + 3] = 255;
      }
    }
    ctx.putImageData(image, 0, 0);
    var texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(5, 7);
    return texture;
  };

  var buildWeaveTexture = function () {
    var size = 128;
    var threads = 8;
    var random = seeded(19);
    var fiber = Float32Array.from({ length: size * size }, function () { return random(); });
    var profile = function (f) { return Math.sqrt(Math.max(0, 1 - 4 * f * f)); };
    var height = function (x, y) {
      var px = ((x % size) + size) % size;
      var py = ((y % size) + size) % size;
      var u = (px / size) * threads;
      var v = (py / size) * threads;
      var cu = Math.floor(u);
      var cv = Math.floor(v);
      var fu = u - cu - 0.5;
      var fv = v - cv - 0.5;
      var lift = (cu + cv) % 2 === 0;
      var warp = profile(fu) * (0.55 + 0.45 * Math.cos(fv * Math.PI * (lift ? 1 : 0.6)));
      var weft = profile(fv) * (0.55 + 0.45 * Math.cos(fu * Math.PI * (lift ? 0.6 : 1)));
      return (lift ? Math.max(warp, weft * 0.7) : Math.max(weft, warp * 0.7)) + fiber[py * size + px] * 0.08;
    };
    var data = new Uint8Array(size * size * 4);
    for (var y = 0; y < size; y++) {
      for (var x = 0; x < size; x++) {
        var nx = (height(x - 1, y) - height(x + 1, y)) * 1.6;
        var ny = (height(x, y - 1) - height(x, y + 1)) * 1.6;
        var length = Math.hypot(nx, ny, 1);
        var i = (y * size + x) * 4;
        data[i] = ((nx / length) * 0.5 + 0.5) * 255;
        data[i + 1] = ((ny / length) * 0.5 + 0.5) * 255;
        data[i + 2] = ((1 / length) * 0.5 + 0.5) * 255;
        data[i + 3] = 255;
      }
    }
    var texture = new THREE.DataTexture(data, size, size);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.magFilter = THREE.LinearFilter;
    texture.minFilter = THREE.LinearMipmapLinearFilter;
    texture.generateMipmaps = true;
    texture.needsUpdate = true;
    return texture;
  };

  /**
   * Bespoke EVP Sanas Luxury VIP Credential Texture Generator (Front)
   */
  var paintEVPFrontFace = function (canvas) {
    var ctx = canvas.getContext('2d');
    if (!ctx) return;
    var w = canvas.width;
    var h = canvas.height;

    // Obsidian base
    var grad = ctx.createLinearGradient(0, 0, w, h);
    grad.addColorStop(0, '#0F1E36');
    grad.addColorStop(0.5, '#070E1B');
    grad.addColorStop(1, '#03060C');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    // Guilloche / Security Pattern Rings
    ctx.strokeStyle = 'rgba(255, 183, 3, 0.06)';
    ctx.lineWidth = 2;
    for (var r = 80; r < 500; r += 45) {
      ctx.beginPath();
      ctx.arc(w / 2, h * 0.35, r, 0, Math.PI * 2);
      ctx.stroke();
    }

    // Border Frame
    ctx.strokeStyle = 'rgba(255, 183, 3, 0.4)';
    ctx.lineWidth = 8;
    ctx.strokeRect(30, 30, w - 60, h - 60);

    // Golden Crest
    ctx.fillStyle = '#FFB703';
    ctx.beginPath();
    ctx.arc(w / 2, 230, 50, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#070E1B';
    ctx.beginPath();
    ctx.arc(w / 2, 230, 42, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#FFB703';
    ctx.font = 'bold 36px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('★', w / 2, 242);

    // Header Title
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '900 52px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.letterSpacing = '8px';
    ctx.fillText('EVP', w / 2, 350);

    // Subtitle
    ctx.fillStyle = '#FFB703';
    ctx.font = '700 24px sans-serif';
    ctx.fillText('TRADE & CONVENTION CENTRE', w / 2, 395);

    // RFID Smart Microchip
    ctx.fillStyle = '#d4af37';
    ctx.fillRect(100, 480, 130, 95);
    ctx.strokeStyle = '#78350f';
    ctx.lineWidth = 3;
    ctx.strokeRect(100, 480, 130, 95);
    ctx.strokeRect(120, 495, 90, 65);
    ctx.beginPath();
    ctx.moveTo(100, 527);
    ctx.lineTo(230, 527);
    ctx.stroke();

    // VIP Badge Pill
    ctx.fillStyle = 'rgba(255, 183, 3, 0.15)';
    ctx.beginPath();
    ctx.roundRect(w - 380, 495, 280, 65, 30);
    ctx.fill();
    ctx.strokeStyle = 'rgba(255, 183, 3, 0.6)';
    ctx.lineWidth = 3;
    ctx.stroke();

    ctx.fillStyle = '#10B981';
    ctx.beginPath();
    ctx.arc(w - 345, 527, 8, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#FFE382';
    ctx.font = 'bold 22px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('ALL-ACCESS VIP', w - 325, 535);

    // Credential Data Box
    ctx.fillStyle = 'rgba(15, 30, 54, 0.7)';
    ctx.beginPath();
    ctx.roundRect(100, 630, w - 200, 320, 24);
    ctx.fill();
    ctx.strokeStyle = '#1A2D4F';
    ctx.lineWidth = 3;
    ctx.stroke();

    ctx.fillStyle = '#94A3B8';
    ctx.font = '600 20px sans-serif';
    ctx.fillText('CLEARANCE LEVEL', 140, 690);
    ctx.fillText('VENUE CAMPUS', w / 2 + 30, 690);
    ctx.fillText('CREDENTIAL ID', 140, 810);
    ctx.fillText('SECURITY STATUS', w / 2 + 30, 810);

    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 28px sans-serif';
    ctx.fillText('LEVEL 5 • FULL', 140, 735);
    ctx.fillText('#EVP-2026-VIP', 140, 855);

    ctx.fillStyle = '#FFB703';
    ctx.fillText('24 ACRES', w / 2 + 30, 735);
    ctx.fillText('AUTHORIZED', w / 2 + 30, 855);

    // Security Seal / Microchip Verification Bar
    ctx.fillStyle = 'rgba(255, 183, 3, 0.08)';
    ctx.beginPath();
    ctx.roundRect(100, 1010, w - 200, 110, 20);
    ctx.fill();
    ctx.strokeStyle = 'rgba(255, 183, 3, 0.4)';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = '#FFB703';
    ctx.font = '700 22px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('ENCRYPTED RFID PASSPHRASE • ACTIVE', w / 2, 1055);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.font = '18px sans-serif';
    ctx.fillText('TAP BADGE TO FLIP • USE BUTTON BELOW TO ENTER', w / 2, 1090);

    // Barcode
    ctx.fillStyle = '#FFFFFF';
    var barX = 140;
    var widths = [4, 8, 4, 12, 4, 8, 16, 4, 8, 4, 12, 8, 4, 16, 8, 4, 12, 4, 8];
    for (var b = 0; b < widths.length; b++) {
      ctx.fillRect(barX, 1200, widths[b], 50);
      barX += widths[b] + 8;
    }

    ctx.fillStyle = '#94A3B8';
    ctx.font = '20px monospace';
    ctx.textAlign = 'right';
    ctx.fillText('EVP-RFID-88429-X', w - 140, 1235);
  };

  /**
   * Bespoke EVP Sanas Back Face Texture
   */
  var paintEVPBackFace = function (canvas) {
    var ctx = canvas.getContext('2d');
    if (!ctx) return;
    var w = canvas.width;
    var h = canvas.height;

    ctx.fillStyle = '#070E1B';
    ctx.fillRect(0, 0, w, h);

    ctx.strokeStyle = 'rgba(255, 183, 3, 0.3)';
    ctx.lineWidth = 6;
    ctx.strokeRect(30, 30, w - 60, h - 60);

    ctx.fillStyle = '#FFB703';
    ctx.font = '900 44px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('EVP CONVENTION CENTRE', w / 2, 280);

    ctx.fillStyle = '#CBD5E1';
    ctx.font = '500 24px sans-serif';
    ctx.fillText('Chennai — Bengaluru Highway, Chembarambakkam', w / 2, 335);

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(100, 390);
    ctx.lineTo(w - 100, 390);
    ctx.stroke();

    ctx.fillStyle = '#94A3B8';
    ctx.font = '22px sans-serif';
    ctx.fillText('Halls A, B, C & D • The Canvas 1 & 2 • Grand Plazas', w / 2, 450);
    ctx.fillText('Official 3D Virtual Tour Credential', w / 2, 500);

    // Official Seal Stamp
    ctx.strokeStyle = '#FFB703';
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.arc(w / 2, 750, 140, 0, Math.PI * 2);
    ctx.stroke();

    ctx.font = 'bold 22px sans-serif';
    ctx.fillStyle = '#FFB703';
    ctx.fillText('★ VERIFIED VENUE INSPECTION ★', w / 2, 730);
    ctx.fillText('EVP PROPERTIES INDIA', w / 2, 770);

    ctx.fillStyle = '#64748B';
    ctx.font = '20px monospace';
    ctx.fillText('AUTHENTICATION HASH: 99CFDA5C-4D9C-4730-9DE6', w / 2, 1100);
  };

  /**
   * Bespoke EVP Lanyard Strap Texture
   */
  var paintEVPStrap = function (canvas) {
    var across = 192;
    var along = 512;
    canvas.width = across;
    canvas.height = along;
    var ctx = canvas.getContext('2d');
    if (!ctx) return along / across;

    // Dark woven nylon
    ctx.fillStyle = '#070E1B';
    ctx.fillRect(0, 0, across, along);

    // Gold borders
    ctx.fillStyle = '#FFB703';
    ctx.fillRect(6, 0, 8, along);
    ctx.fillRect(across - 14, 0, 8, along);

    // Woven EVP text repeated along strap
    ctx.save();
    ctx.translate(across / 2, along / 2);
    ctx.rotate(Math.PI / 2);
    ctx.font = '800 28px "Satoshi", "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = 'rgba(255, 183, 3, 0.88)';
    ctx.textAlign = 'center';
    ctx.fillText('EVP TRADE & CONVENTION CENTRE', 0, 10);
    ctx.restore();

    return along / across;
  };

  /* Physics Simulation Structures */
  var createSimulation = function () {
    var vectors = function () {
      return Array.from({ length: JOINTS + 1 }, function () { return new THREE.Vector3(); });
    };
    return {
      nodes: vectors(),
      previous: vectors(),
      velocities: vectors(),
      lengths: new Float64Array(JOINTS),
      impulses: new Float64Array(JOINTS),
      rest: 1,
      anchor: new THREE.Vector3(),
      body: {
        position: new THREE.Vector3(),
        previous: new THREE.Vector3(),
        velocity: new THREE.Vector3(),
        quaternion: new THREE.Quaternion(),
        previousQuaternion: new THREE.Quaternion(),
        angular: new THREE.Vector3(),
        mass: 1,
        inverseInertia: new THREE.Vector3(1, 1, 1),
        hang: new THREE.Vector3()
      },
      grab: null,
      turn: 0,
      twist: 0,
      twistRaw: 0,
      calm: 0
    };
  };

  var scratch = {
    a: new THREE.Vector3(),
    b: new THREE.Vector3(),
    c: new THREE.Vector3(),
    d: new THREE.Vector3(),
    e: new THREE.Vector3(),
    f: new THREE.Vector3(),
    g: new THREE.Vector3(),
    pin: new THREE.Vector3(),
    q: new THREE.Quaternion(),
    r: new THREE.Quaternion()
  };

  var applyInverseInertia = function (body, vector, out) {
    scratch.r.copy(body.quaternion).invert();
    out.copy(vector).applyQuaternion(scratch.r);
    out.set(out.x * body.inverseInertia.x, out.y * body.inverseInertia.y, out.z * body.inverseInertia.z);
    return out.applyQuaternion(body.quaternion);
  };

  var rotateBody = function (q, w) {
    var qx = q.x, qy = q.y, qz = q.z, qw = q.w;
    q.x += 0.5 * (w.x * qw + w.y * qz - w.z * qy);
    q.y += 0.5 * (w.y * qw + w.z * qx - w.x * qz);
    q.z += 0.5 * (w.z * qw + w.x * qy - w.y * qx);
    q.w += 0.5 * (-w.x * qx - w.y * qy - w.z * qz);
    q.normalize();
  };

  var bodyWeight = function (body, r, normal) {
    var rn = scratch.c.crossVectors(r, normal);
    return 1 / body.mass + rn.dot(applyInverseInertia(body, rn, scratch.d));
  };

  var pushBody = function (body, r, impulse) {
    body.position.addScaledVector(impulse, 1 / body.mass);
    rotateBody(body.quaternion, applyInverseInertia(body, scratch.e.crossVectors(r, impulse), scratch.f));
  };

  var solveSegment = function (sim, i, h, physics) {
    var nodes = sim.nodes, body = sim.body;
    var a = nodes[i];
    var wa = i === 0 ? 0 : NODE_WEIGHT;
    var last = i === JOINTS - 1;
    var r = scratch.g;
    var b = nodes[i + 1];
    if (last) {
      r.copy(body.hang).applyQuaternion(body.quaternion);
      b = scratch.b.copy(body.position).add(r);
    }
    var delta = scratch.a.subVectors(b, a);
    var length = delta.length();
    var stretch = length - sim.rest;
    if (stretch <= 0 || length < 1e-9) return;
    var normal = delta.divideScalar(length);
    var wb = last ? bodyWeight(body, r, normal) : NODE_WEIGHT;
    var rate = (length - sim.lengths[i]) / h;
    var tension =
      physics.hold * Math.tanh((physics.stiffness * stretch) / physics.hold) +
      physics.spring * stretch +
      physics.bandDamping * Math.max(0, rate);
    var room = tension * h * h - sim.impulses[i];
    if (room <= 0) return;
    var lambda = Math.min(stretch / (wa + wb), room);
    sim.impulses[i] += lambda;
    if (wa) a.addScaledVector(normal, lambda * wa);
    if (last) pushBody(body, r, normal.multiplyScalar(-lambda));
    else b.addScaledVector(normal, -lambda * wb);
  };

  var solvePin = function (body, grab, target) {
    var r = scratch.g.copy(grab.local).applyQuaternion(body.quaternion);
    var delta = scratch.a.copy(target).sub(body.position).sub(r);
    var distance = delta.length();
    if (distance < 1e-9) return;
    var normal = delta.divideScalar(distance);
    var lambda = distance / bodyWeight(body, r, normal);
    pushBody(body, r, normal.multiplyScalar(lambda));
  };

  var placeHanging = function (sim, layout, intro) {
    var nodes = sim.nodes, previous = sim.previous, velocities = sim.velocities, body = sim.body, anchor = sim.anchor;
    nodes[0].copy(anchor);
    for (var i = 1; i <= JOINTS; i++) {
      nodes[i].copy(nodes[i - 1]);
      if (intro) nodes[i].x += sim.rest;
      else nodes[i].y -= sim.rest;
    }
    body.quaternion.identity();
    if (intro) body.quaternion.setFromAxisAngle(new THREE.Vector3(0, 0, 1), Math.PI / 2);
    body.hang.set(0, layout.hangY, 0);
    var offset = scratch.a.copy(body.hang).applyQuaternion(body.quaternion);
    body.position.copy(nodes[JOINTS]).sub(offset);
    body.previous.copy(body.position);
    body.previousQuaternion.copy(body.quaternion);
    body.velocity.set(0, 0, 0);
    body.angular.set(0, 0, 0);
    for (var j = 0; j <= JOINTS; j++) {
      previous[j].copy(nodes[j]);
      velocities[j].set(0, 0, 0);
    }
    sim.lengths.fill(sim.rest);
    sim.turn = 0;
    sim.twist = 0;
    sim.twistRaw = 0;
    sim.calm = 0;
  };

  var configureSimulation = function (sim, layout, length) {
    sim.rest = length / JOINTS;
    var width = layout.width, height = layout.height;
    var body = sim.body;
    var t = THICKNESS + BEVEL * 2;
    body.mass = 1;
    body.inverseInertia.set(
      12 / (height * height + t * t),
      12 / (width * width + t * t),
      12 / (width * width + height * height)
    );
    body.hang.set(0, layout.hangY, 0);
  };

  var stepSimulation = function (sim, dt, physics, time) {
    var steps = Math.max(1, Math.ceil(dt / MAX_STEP - 1e-6));
    var h = dt / steps;
    var nodes = sim.nodes, previous = sim.previous, velocities = sim.velocities, body = sim.body;
    var windX = physics.breeze * (Math.sin(time * 0.53) * 0.7 + Math.sin(time * 1.31 + 1.7) * 0.3) * 3;
    var windZ = physics.breeze * Math.sin(time * 0.37 + 0.6) * 2;
    var grab = sim.grab;
    var pin = scratch.pin;
    var nodeDrag = Math.exp(-physics.nodeDrag * h);
    var linearDrag = Math.exp(-physics.linearDrag * h);
    var angularDrag = Math.exp(-physics.angularDrag * h);

    for (var s = 0; s < steps; s++) {
      for (var i = 1; i < JOINTS; i++) {
        var v = velocities[i];
        v.y -= physics.gravity * h;
        v.x += windX * h;
        v.z += windZ * h;
        previous[i].copy(nodes[i]);
        nodes[i].addScaledVector(v, h);
      }

      body.previous.copy(body.position);
      body.previousQuaternion.copy(body.quaternion);
      var q = body.quaternion;
      if (grab) {
        var turn = scratch.q.copy(grab.rotation).multiply(scratch.r.copy(q).invert());
        if (turn.w < 0) turn.set(-turn.x, -turn.y, -turn.z, -turn.w);
        var torque = scratch.a.set(turn.x, turn.y, turn.z).multiplyScalar(2 * physics.grip);
        torque.addScaledVector(body.angular, -physics.gripDamping);
        body.angular.addScaledVector(applyInverseInertia(body, torque, scratch.b), h);
      }
      var up = scratch.a.set(0, 1, 0).applyQuaternion(q);
      var front = scratch.b.set(-up.x * up.z, -up.y * up.z, 1 - up.z * up.z);
      if (front.lengthSq() > 1e-3) {
        var facing = scratch.d.set(0, 0, 1).applyQuaternion(q);
        var raw = Math.atan2(scratch.e.crossVectors(front, facing).dot(up), front.dot(facing));
        var turned = raw - sim.twistRaw;
        if (turned > Math.PI) turned -= Math.PI * 2;
        else if (turned < -Math.PI) turned += Math.PI * 2;
        sim.twist += turned;
        sim.twistRaw = raw;
      }
      if (!grab) {
        var spin = body.angular.dot(up);
        body.angular.addScaledVector(up, (physics.twist * (sim.turn - sim.twist) - physics.twistDamping * spin) * h);
      }
      body.velocity.y -= physics.gravity * h;
      body.velocity.x += windX * 0.35 * h;
      body.velocity.z += windZ * 0.35 * h;
      body.position.addScaledVector(body.velocity, h);
      rotateBody(body.quaternion, scratch.f.copy(body.angular).multiplyScalar(h));

      sim.impulses.fill(0);
      if (grab) pin.lerpVectors(grab.from, grab.target, (s + 1) / steps);
      for (var iteration = 0; iteration < ITERATIONS; iteration++) {
        for (var j = 0; j < JOINTS; j++) solveSegment(sim, j, h, physics);
        if (grab) solvePin(body, grab, pin);
      }

      for (var k = 1; k < JOINTS; k++) {
        var vk = velocities[k].subVectors(nodes[k], previous[k]).divideScalar(h).multiplyScalar(nodeDrag);
        vk.multiplyScalar(1 / (1 + physics.nodeAir * vk.length() * h));
      }
      body.velocity.subVectors(body.position, body.previous).divideScalar(h);
      var dq = scratch.q.copy(body.previousQuaternion).invert().premultiply(body.quaternion);
      body.angular.set(dq.x, dq.y, dq.z).multiplyScalar((2 / h) * (dq.w < 0 ? -1 : 1));

      var normal = scratch.a.set(0, 0, 1).applyQuaternion(body.quaternion);
      var across = body.velocity.dot(normal);
      var along = scratch.b.copy(body.velocity).addScaledVector(normal, -across);
      along.multiplyScalar(1 / (1 + physics.air * along.length() * h));
      body.velocity
        .copy(along)
        .addScaledVector(normal, across / (1 + physics.broadside * Math.abs(across) * h))
        .multiplyScalar(linearDrag);
      body.angular.multiplyScalar(angularDrag / (1 + physics.spinAir * body.angular.length() * h));
      if (body.velocity.lengthSq() > 3600) body.velocity.setLength(60);
      if (body.angular.lengthSq() > 1600) body.angular.setLength(40);

      nodes[JOINTS].copy(body.hang).applyQuaternion(body.quaternion).add(body.position);
      for (var m = 0; m < JOINTS; m++) sim.lengths[m] = nodes[m].distanceTo(nodes[m + 1]);
    }

    if (grab) grab.from.copy(grab.target);

    var energy = body.velocity.lengthSq() + body.angular.lengthSq() * 0.3;
    for (var n = 1; n < JOINTS; n++) energy += velocities[n].lengthSq() * 0.05;
    sim.calm = energy < 2e-4 ? sim.calm + dt : 0;
  };

  /**
   * Main Standalone React Bits Lanyard Controller
   */
  var EVPLanyard = {
    options: {
      finish: 'holographic',
      metal: 'gold',
      orientation: 'portrait',
      cornerRadius: 0.3,
      size: 0.65,
      anchor: 'center',
      strapLength: 0.48,
      strapWidth: 0.75,
      gravity: 1,
      damping: 0.5,
      elasticity: 0.5,
      breeze: 0.6,
      interactive: true,
      intro: true,
      tourUrl: '../Tour/index.htm'
    },

    init: function (container, userOpts) {
      if (userOpts) {
        for (var key in userOpts) {
          if (userOpts.hasOwnProperty(key)) this.options[key] = userOpts[key];
        }
      }

      var self = this;
      var renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
      renderer.setClearColor(0x000000, 0);
      if (THREE.SRGBColorSpace) renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1;

      var canvas = renderer.domElement;
      canvas.className = 'lanyard-canvas';
      container.appendChild(canvas);

      var anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
      var scene = new THREE.Scene();
      var environment = buildEnvironment(renderer);
      scene.environment = environment.texture;

      var camera = new THREE.PerspectiveCamera(FOV, 1, 0.1, 200);
      var keyLight = new THREE.DirectionalLight(0xffffff, 1.2);
      keyLight.position.set(-2.5, 4, 6);
      var fillLight = new THREE.DirectionalLight(0xffffff, 0.55);
      fillLight.position.set(3, -1, 4);
      scene.add(keyLight, fillLight);

      var frontSrc = (window.EVP_TEXTURES && window.EVP_TEXTURES.cardFront) || 'card_front.png';
      var backSrc = (window.EVP_TEXTURES && window.EVP_TEXTURES.cardBack) || 'card_back.png';
      var textureLoader = new THREE.TextureLoader();
      var frontTexture = textureLoader.load(frontSrc);
      frontTexture.anisotropy = anisotropy;
      if (THREE.SRGBColorSpace) frontTexture.colorSpace = THREE.SRGBColorSpace;

      var backTexture = textureLoader.load(backSrc);
      backTexture.anisotropy = anisotropy;
      if (THREE.SRGBColorSpace) backTexture.colorSpace = THREE.SRGBColorSpace;

      var strapCanvas = document.createElement('canvas');
      var tileRatio = paintEVPStrap(strapCanvas);
      var strapTexture = makeCanvasTexture(strapCanvas, anisotropy);
      strapTexture.wrapS = THREE.ClampToEdgeWrapping;
      strapTexture.wrapT = THREE.RepeatWrapping;

      var grain = buildGrainTexture();
      var weave = buildWeaveTexture();
      weave.repeat.set(2, 2 * tileRatio);

      var foilUniforms = {
        foilStrength: { value: 0.5 },
        foilAspect: { value: 1.4 },
        foilKey: { value: new THREE.Vector3() },
        foilFill: { value: new THREE.Vector3() },
        foilTop: { value: new THREE.Vector3() }
      };

      var injectFoil = function (shader) {
        Object.assign(shader.uniforms, foilUniforms);
        shader.vertexShader = shader.vertexShader
          .replace('#include <common>', '#include <common>\n' + FOIL_VERTEX_HEAD)
          .replace('#include <project_vertex>', '#include <project_vertex>\n' + FOIL_VERTEX_BODY);
        shader.fragmentShader = shader.fragmentShader
          .replace('#include <common>', '#include <common>\n' + FOIL_FRAGMENT_HEAD)
          .replace('#include <opaque_fragment>', FOIL_FRAGMENT_BODY + '\n#include <opaque_fragment>');
      };

      var frontMaterial = new THREE.MeshPhysicalMaterial({
        map: frontTexture,
        normalMap: grain,
        normalScale: new THREE.Vector2(0.06, 0.06)
      });
      var backMaterial = new THREE.MeshPhysicalMaterial({
        map: backTexture,
        normalMap: grain,
        normalScale: new THREE.Vector2(0.06, 0.06)
      });
      frontMaterial.onBeforeCompile = injectFoil;
      backMaterial.onBeforeCompile = injectFoil;

      var edgeMaterial = new THREE.MeshPhysicalMaterial({
        color: new THREE.Color(0.06, 0.12, 0.22),
        roughness: 0.3,
        metalness: 0.1,
        clearcoat: 1,
        clearcoatRoughness: 0.08
      });

      var metalLook = METALS[self.options.metal] || METALS.gold;
      var metalMaterial = new THREE.MeshStandardMaterial({
        color: new THREE.Color(metalLook.color),
        metalness: 1,
        roughness: metalLook.roughness
      });

      var bandMaterial = new THREE.MeshPhysicalMaterial({
        map: strapTexture,
        normalMap: weave,
        normalScale: new THREE.Vector2(0.7, 0.7),
        roughness: 0.68,
        sheen: 1,
        sheenRoughness: 0.42,
        sheenColor: new THREE.Color(0.32, 0.32, 0.34),
        side: THREE.DoubleSide
      });

      var layout = cardLayout('portrait', self.options.cornerRadius);
      var geom = buildCardGeometry(layout);

      var cardGroup = new THREE.Group();
      var bodyMesh = new THREE.Mesh(geom.body, edgeMaterial);
      var frontMesh = new THREE.Mesh(geom.face, frontMaterial);
      var backMesh = new THREE.Mesh(geom.face.clone(), backMaterial);
      frontMesh.position.z = THICKNESS / 2 + BEVEL + 0.0006;
      backMesh.rotation.y = Math.PI;
      backMesh.position.z = -(THICKNESS / 2 + BEVEL + 0.0006);

      var ring = new THREE.Mesh(new THREE.TorusGeometry(RING_RADIUS, RING_TUBE, 18, 72), metalMaterial);
      ring.position.set(0, layout.ringY, 0);
      ring.rotation.y = Math.PI / 2 - 0.7;

      cardGroup.add(bodyMesh, frontMesh, backMesh, ring);
      scene.add(cardGroup);

      var bandGeometry = buildBandGeometry(SAMPLES);
      var band = new THREE.Mesh(bandGeometry, bandMaterial);
      band.frustumCulled = false;
      scene.add(band);

      var strapScale = STRAP_WIDTH * clamp(self.options.strapWidth, 0.4, 2);
      var clampGroup = new THREE.Group();
      var clampMesh = new THREE.Mesh(buildClampGeometry(strapScale), metalMaterial);
      clampMesh.position.y = EYELET_RADIUS + CLAMP_BODY / 2 - 0.004;
      var eyelet = new THREE.Mesh(new THREE.TorusGeometry(EYELET_RADIUS, 0.0105, 14, 40), metalMaterial);
      clampGroup.add(clampMesh, eyelet);
      scene.add(clampGroup);

      var sim = createSimulation();
      var controls = [];
      var mouth = new THREE.Vector3();
      var tuck = new THREE.Vector3();
      var curve = new THREE.CatmullRomCurve3(controls, false, 'centripetal');
      var view = { width: 1, height: 1 };
      var raf = 0;
      var last = performance.now();
      var time = 0;
      var press = null;

      var frameView = function () {
        var aspect = view.width / view.height;
        var viewHeight = layout.height / clamp(self.options.size, 0.15, 0.9);
        var minimumWidth = layout.width / 0.72;
        if (viewHeight * aspect < minimumWidth) viewHeight = minimumWidth / aspect;
        var viewWidth = viewHeight * aspect;
        camera.aspect = aspect;
        camera.position.set(0, 0, viewHeight / 2 / Math.tan((FOV * Math.PI) / 360));
        camera.lookAt(0, 0, 0);
        camera.updateProjectionMatrix();
        camera.updateMatrixWorld();

        foilUniforms.foilKey.value.set(-2.5, 4, 6).normalize().transformDirection(camera.matrixWorldInverse);
        foilUniforms.foilFill.value.set(3, -1, 4).normalize().transformDirection(camera.matrixWorldInverse);
        foilUniforms.foilTop.value.set(0.5, 4.5, 8).normalize().transformDirection(camera.matrixWorldInverse);

        var anchorX = ((ANCHORS[self.options.anchor] || 0.5) - 0.5) * viewWidth;
        var anchorY = viewHeight / 2 + 0.2;
        var cardTop = viewHeight / 2 - viewHeight * mix(0.12, 0.42, clamp(self.options.strapLength, 0, 1));
        var hangTop = cardTop + (layout.hangY - layout.height / 2);
        sim.anchor.set(anchorX, anchorY, 0);
        configureSimulation(sim, layout, anchorY - hangTop);
        sim.nodes[0].copy(sim.anchor);
        sim.previous[0].copy(sim.anchor);
      };

      var points = Array.from({ length: SAMPLES }, function () { return new THREE.Vector3(); });
      var sides = Array.from({ length: SAMPLES }, function () { return new THREE.Vector3(); });
      var bends = BAND_BEND.map(function (angle) { return [Math.cos(angle), Math.sin(angle)]; });
      var work = {
        tangent: new THREE.Vector3(),
        toCamera: new THREE.Vector3(),
        basis: new THREE.Matrix4(),
        up: new THREE.Vector3(),
        across: new THREE.Vector3(),
        facing: new THREE.Vector3(),
        end: new THREE.Vector3()
      };

      var updateBand = function () {
        var hang = sim.nodes[JOINTS];
        var reach = EYELET_RADIUS + CLAMP_BODY + 0.05;
        var guide = JOINTS - 1;
        while (guide > 0 && sim.nodes[guide].distanceTo(hang) < reach * 1.1) guide--;
        var axis = work.up.subVectors(sim.nodes[guide], hang);
        if (axis.lengthSq() < 1e-8) axis.set(0, 1, 0).applyQuaternion(sim.body.quaternion);
        axis.normalize();
        mouth.copy(hang).addScaledVector(axis, reach);
        tuck.copy(hang).addScaledVector(axis, EYELET_RADIUS + CLAMP_BODY * 0.35);
        controls.length = 0;
        for (var i = 0; i <= guide; i++) controls.push(sim.nodes[i]);
        controls.push(mouth, tuck);
        curve.updateArcLengths();
        for (var j = 0; j < SAMPLES; j++) curve.getPointAt(j / (SAMPLES - 1), points[j]);
        var length = curve.getLength();
        var held = 1 - mouth.distanceTo(tuck) / Math.max(length, 0.001);
        var position = bandGeometry.getAttribute('position');
        var normal = bandGeometry.getAttribute('normal');
        var uv = bandGeometry.getAttribute('uv');
        var columns = BAND_COLUMNS.length;
        var restLength = sim.rest * JOINTS;
        var repeats = restLength / (strapScale * tileRatio);
        var width = strapScale / Math.pow(Math.max(1, length / Math.max(restLength, 0.001)), 0.35);
        var tangent = work.tangent, toCamera = work.toCamera, across = work.across, facing = work.facing;

        for (var k = 0; k < SAMPLES; k++) {
          tangent.subVectors(points[Math.min(SAMPLES - 1, k + 1)], points[Math.max(0, k - 1)]);
          if (tangent.lengthSq() < 1e-12) tangent.set(0, -1, 0);
          tangent.normalize();
          toCamera.subVectors(camera.position, points[k]).normalize();
          var side = sides[k].crossVectors(toCamera, tangent);
          if (side.lengthSq() < 1e-10) side.copy(k > 0 ? sides[k - 1] : scratch.a.set(1, 0, 0));
          side.normalize();
          if (k > 0 && side.dot(sides[k - 1]) < 0) side.negate();
          var angle = -sim.twist * Math.pow(Math.min(1, k / (SAMPLES - 1) / held), 1.3);
          facing.crossVectors(tangent, side);
          across.copy(side).multiplyScalar(Math.cos(angle)).addScaledVector(facing, Math.sin(angle));
          facing.crossVectors(tangent, across);
          var p = points[k];
          var v = (1 - k / (SAMPLES - 1)) * repeats;
          for (var c = 0; c < columns; c++) {
            var idx = k * columns + c;
            var offset = (BAND_COLUMNS[c] - 0.5) * width;
            var bend = bends[c];
            position.setXYZ(idx, p.x + across.x * offset, p.y + across.y * offset, p.z + across.z * offset);
            normal.setXYZ(
              idx,
              facing.x * bend[0] + across.x * bend[1],
              facing.y * bend[0] + across.y * bend[1],
              facing.z * bend[0] + across.z * bend[1]
            );
            uv.setXY(idx, BAND_COLUMNS[c], v);
          }
        }
        work.end.copy(across);
        position.needsUpdate = true;
        normal.needsUpdate = true;
        uv.needsUpdate = true;

        across.copy(work.end).addScaledVector(axis, -work.end.dot(axis)).normalize();
        facing.crossVectors(across, axis).normalize();
        work.basis.makeBasis(across, axis, facing);
        clampGroup.quaternion.setFromRotationMatrix(work.basis);
        clampGroup.position.copy(hang);
      };

      var render = function () {
        cardGroup.position.copy(sim.body.position);
        cardGroup.quaternion.copy(sim.body.quaternion);
        updateBand();
        renderer.render(scene, camera);
      };

      var physics = function () {
        var s = self.options;
        var gravity = 40 * clamp(s.gravity, 0, 3);
        var weight = Math.max(gravity, 20);
        var springy = clamp(s.elasticity, 0, 1);
        var settle = clamp(s.damping, 0, 1);
        return {
          gravity: gravity,
          hold: weight * mix(2.2, 5.5, springy),
          stiffness: weight * 10 * JOINTS,
          spring: weight * mix(0.1, 0.4, springy) * JOINTS,
          bandDamping: weight * mix(0.3, 0.08, springy) * JOINTS,
          linearDrag: 0.25 * Math.pow(16, settle),
          angularDrag: 0.5 * Math.pow(12, settle),
          air: 0.15,
          broadside: 0.5,
          spinAir: 0.03,
          nodeDrag: 2,
          nodeAir: 0.2,
          twist: 30,
          twistDamping: 3,
          grip: 40,
          gripDamping: 6,
          breeze: clamp(s.breeze, 0, 1)
        };
      };

      var tick = function (now) {
        var dt = Math.min(1 / 30, Math.max(1 / 240, (now - last) / 1000));
        last = now;
        time += dt;
        stepSimulation(sim, dt, physics(), time);
        render();
        raf = requestAnimationFrame(tick);
      };

      var raycaster = new THREE.Raycaster();
      var pointer = new THREE.Vector2();

      var toPointer = function (event) {
        var rect = canvas.getBoundingClientRect();
        pointer.set(
          ((event.clientX - rect.left) / rect.width) * 2 - 1,
          -((event.clientY - rect.top) / rect.height) * 2 + 1
        );
        raycaster.setFromCamera(pointer, camera);
      };

      var pickCard = function () {
        cardGroup.updateMatrixWorld();
        var hits = raycaster.intersectObjects([bodyMesh, frontMesh, backMesh], false);
        return hits[0] || null;
      };

      var flip = function (point) {
        var body = sim.body;
        var up = scratch.a.set(0, 1, 0).applyQuaternion(body.quaternion);
        var direction = sim.turn > 0 ? -1 : 1;
        if (sim.turn === 0) {
          var away = scratch.c.subVectors(point, camera.position).normalize();
          direction = scratch.b.subVectors(point, body.position).cross(away).dot(up) < 0 ? -1 : 1;
        }
        sim.turn = sim.turn === 0 ? Math.PI * direction : 0;
        body.angular.addScaledVector(up, FLIP_SPIN * direction);
      };

      var onPointerDown = function (event) {
        if (!self.options.interactive || event.button > 0) return;
        toPointer(event);
        var hit = pickCard();
        if (!hit) return;
        sim.grab = {
          local: hit.point.clone().sub(sim.body.position).applyQuaternion(sim.body.quaternion.clone().invert()),
          rotation: sim.body.quaternion.clone(),
          reach: hit.distance,
          from: hit.point.clone(),
          target: hit.point.clone()
        };
        press = { x: event.clientX, y: event.clientY, time: performance.now(), point: hit.point.clone() };
        if (canvas.setPointerCapture) canvas.setPointerCapture(event.pointerId);
        canvas.style.cursor = 'grabbing';
      };

      var onPointerMove = function (event) {
        if (!self.options.interactive) return;
        toPointer(event);
        if (sim.grab) {
          if (press && Math.hypot(event.clientX - press.x, event.clientY - press.y) > 6) press = null;
          raycaster.ray.at(sim.grab.reach, sim.grab.target);
          return;
        }
        if (event.pointerType === 'touch') return;
        canvas.style.cursor = pickCard() ? 'grab' : 'default';
      };

      var lastTapTime = 0;
      var onPointerUp = function (event) {
        if (press && performance.now() - press.time < 350) {
          var now = performance.now();
          if (now - lastTapTime < 380) {
            // Double tap card triggers enter tour
            self.enterTour(true);
          } else {
            // Single tap triggers card flip
            flip(press.point);
          }
          lastTapTime = now;
        }
        sim.grab = null;
        press = null;
        if (canvas.releasePointerCapture) canvas.releasePointerCapture(event.pointerId);
        canvas.style.cursor = 'default';
      };

      canvas.addEventListener('pointerdown', onPointerDown);
      canvas.addEventListener('pointermove', onPointerMove);
      canvas.addEventListener('pointerup', onPointerUp);
      canvas.addEventListener('pointercancel', onPointerUp);

      var resize = function () {
        view.width = Math.max(1, container.clientWidth);
        view.height = Math.max(1, container.clientHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
        renderer.setSize(view.width, view.height, false);
        frameView();
        placeHanging(sim, layout, self.options.intro);
        render();
      };

      window.addEventListener('resize', resize);
      resize();
      raf = requestAnimationFrame(tick);

      this.destroy = function () {
        cancelAnimationFrame(raf);
        window.removeEventListener('resize', resize);
        renderer.dispose();
      };
    },

    /**
     * Synthesize VIP chime & enter live tour
     */
    enterTour: function (withAudio) {
      try {
        var AudioContext = window.AudioContext || window.webkitAudioContext;
        if (AudioContext) {
          var ctx = new AudioContext();
          if (ctx.state === 'suspended') ctx.resume();
          if (withAudio) {
            var now = ctx.currentTime;
            [1318.5, 1975.5, 2637.0].forEach(function (freq, i) {
              var osc = ctx.createOscillator();
              var gain = ctx.createGain();
              osc.type = 'sine';
              osc.frequency.setValueAtTime(freq, now + i * 0.04);
              gain.gain.setValueAtTime(0.0001, now);
              gain.gain.exponentialRampToValueAtTime(0.12 / (i + 1), now + i * 0.04 + 0.02);
              gain.gain.exponentialRampToValueAtTime(0.00001, now + i * 0.04 + 1.4);
              osc.connect(gain);
              gain.connect(ctx.destination);
              osc.start(now + i * 0.04);
              osc.stop(now + i * 0.04 + 1.5);
            });
          }
        }
        sessionStorage.setItem('evp_audio_consent', withAudio ? 'yes' : 'no');
      } catch (e) {}

      var overlay = document.querySelector('.lanyard-overlay');
      if (overlay) overlay.classList.add('dismissed');

      setTimeout(function () {
        var target = (window.location.protocol === 'file:') ? '../Tour/index.htm' : '/tour';
        window.location.href = target + (withAudio ? '?audio=1' : '?audio=0');
      }, 500);
    }
  };

  window.EVPLanyard = EVPLanyard;

})(window, document);
