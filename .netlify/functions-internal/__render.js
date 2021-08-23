var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __markAsModule = (target) => __defProp(target, "__esModule", { value: true });
var __export = (target, all) => {
  __markAsModule(target);
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __reExport = (target, module2, desc) => {
  if (module2 && typeof module2 === "object" || typeof module2 === "function") {
    for (let key of __getOwnPropNames(module2))
      if (!__hasOwnProp.call(target, key) && key !== "default")
        __defProp(target, key, { get: () => module2[key], enumerable: !(desc = __getOwnPropDesc(module2, key)) || desc.enumerable });
  }
  return target;
};
var __toModule = (module2) => {
  return __reExport(__markAsModule(__defProp(module2 != null ? __create(__getProtoOf(module2)) : {}, "default", module2 && module2.__esModule && "default" in module2 ? { get: () => module2.default, enumerable: true } : { value: module2, enumerable: true })), module2);
};

// .svelte-kit/netlify/entry.js
__export(exports, {
  handler: () => handler
});

// node_modules/@sveltejs/kit/dist/install-fetch.js
var import_http = __toModule(require("http"));
var import_https = __toModule(require("https"));
var import_zlib = __toModule(require("zlib"));
var import_stream = __toModule(require("stream"));
var import_util = __toModule(require("util"));
var import_crypto = __toModule(require("crypto"));
var import_url = __toModule(require("url"));
function dataUriToBuffer(uri) {
  if (!/^data:/i.test(uri)) {
    throw new TypeError('`uri` does not appear to be a Data URI (must begin with "data:")');
  }
  uri = uri.replace(/\r?\n/g, "");
  const firstComma = uri.indexOf(",");
  if (firstComma === -1 || firstComma <= 4) {
    throw new TypeError("malformed data: URI");
  }
  const meta = uri.substring(5, firstComma).split(";");
  let charset = "";
  let base64 = false;
  const type = meta[0] || "text/plain";
  let typeFull = type;
  for (let i = 1; i < meta.length; i++) {
    if (meta[i] === "base64") {
      base64 = true;
    } else {
      typeFull += `;${meta[i]}`;
      if (meta[i].indexOf("charset=") === 0) {
        charset = meta[i].substring(8);
      }
    }
  }
  if (!meta[0] && !charset.length) {
    typeFull += ";charset=US-ASCII";
    charset = "US-ASCII";
  }
  const encoding = base64 ? "base64" : "ascii";
  const data = unescape(uri.substring(firstComma + 1));
  const buffer = Buffer.from(data, encoding);
  buffer.type = type;
  buffer.typeFull = typeFull;
  buffer.charset = charset;
  return buffer;
}
var src = dataUriToBuffer;
var dataUriToBuffer$1 = src;
var { Readable } = import_stream.default;
var wm = new WeakMap();
async function* read(parts) {
  for (const part of parts) {
    if ("stream" in part) {
      yield* part.stream();
    } else {
      yield part;
    }
  }
}
var Blob = class {
  constructor(blobParts = [], options2 = {}) {
    let size = 0;
    const parts = blobParts.map((element) => {
      let buffer;
      if (element instanceof Buffer) {
        buffer = element;
      } else if (ArrayBuffer.isView(element)) {
        buffer = Buffer.from(element.buffer, element.byteOffset, element.byteLength);
      } else if (element instanceof ArrayBuffer) {
        buffer = Buffer.from(element);
      } else if (element instanceof Blob) {
        buffer = element;
      } else {
        buffer = Buffer.from(typeof element === "string" ? element : String(element));
      }
      size += buffer.length || buffer.size || 0;
      return buffer;
    });
    const type = options2.type === void 0 ? "" : String(options2.type).toLowerCase();
    wm.set(this, {
      type: /[^\u0020-\u007E]/.test(type) ? "" : type,
      size,
      parts
    });
  }
  get size() {
    return wm.get(this).size;
  }
  get type() {
    return wm.get(this).type;
  }
  async text() {
    return Buffer.from(await this.arrayBuffer()).toString();
  }
  async arrayBuffer() {
    const data = new Uint8Array(this.size);
    let offset = 0;
    for await (const chunk of this.stream()) {
      data.set(chunk, offset);
      offset += chunk.length;
    }
    return data.buffer;
  }
  stream() {
    return Readable.from(read(wm.get(this).parts));
  }
  slice(start = 0, end = this.size, type = "") {
    const { size } = this;
    let relativeStart = start < 0 ? Math.max(size + start, 0) : Math.min(start, size);
    let relativeEnd = end < 0 ? Math.max(size + end, 0) : Math.min(end, size);
    const span = Math.max(relativeEnd - relativeStart, 0);
    const parts = wm.get(this).parts.values();
    const blobParts = [];
    let added = 0;
    for (const part of parts) {
      const size2 = ArrayBuffer.isView(part) ? part.byteLength : part.size;
      if (relativeStart && size2 <= relativeStart) {
        relativeStart -= size2;
        relativeEnd -= size2;
      } else {
        const chunk = part.slice(relativeStart, Math.min(size2, relativeEnd));
        blobParts.push(chunk);
        added += ArrayBuffer.isView(chunk) ? chunk.byteLength : chunk.size;
        relativeStart = 0;
        if (added >= span) {
          break;
        }
      }
    }
    const blob = new Blob([], { type: String(type).toLowerCase() });
    Object.assign(wm.get(blob), { size: span, parts: blobParts });
    return blob;
  }
  get [Symbol.toStringTag]() {
    return "Blob";
  }
  static [Symbol.hasInstance](object) {
    return object && typeof object === "object" && typeof object.stream === "function" && object.stream.length === 0 && typeof object.constructor === "function" && /^(Blob|File)$/.test(object[Symbol.toStringTag]);
  }
};
Object.defineProperties(Blob.prototype, {
  size: { enumerable: true },
  type: { enumerable: true },
  slice: { enumerable: true }
});
var fetchBlob = Blob;
var Blob$1 = fetchBlob;
var FetchBaseError = class extends Error {
  constructor(message, type) {
    super(message);
    Error.captureStackTrace(this, this.constructor);
    this.type = type;
  }
  get name() {
    return this.constructor.name;
  }
  get [Symbol.toStringTag]() {
    return this.constructor.name;
  }
};
var FetchError = class extends FetchBaseError {
  constructor(message, type, systemError) {
    super(message, type);
    if (systemError) {
      this.code = this.errno = systemError.code;
      this.erroredSysCall = systemError.syscall;
    }
  }
};
var NAME = Symbol.toStringTag;
var isURLSearchParameters = (object) => {
  return typeof object === "object" && typeof object.append === "function" && typeof object.delete === "function" && typeof object.get === "function" && typeof object.getAll === "function" && typeof object.has === "function" && typeof object.set === "function" && typeof object.sort === "function" && object[NAME] === "URLSearchParams";
};
var isBlob = (object) => {
  return typeof object === "object" && typeof object.arrayBuffer === "function" && typeof object.type === "string" && typeof object.stream === "function" && typeof object.constructor === "function" && /^(Blob|File)$/.test(object[NAME]);
};
function isFormData(object) {
  return typeof object === "object" && typeof object.append === "function" && typeof object.set === "function" && typeof object.get === "function" && typeof object.getAll === "function" && typeof object.delete === "function" && typeof object.keys === "function" && typeof object.values === "function" && typeof object.entries === "function" && typeof object.constructor === "function" && object[NAME] === "FormData";
}
var isAbortSignal = (object) => {
  return typeof object === "object" && object[NAME] === "AbortSignal";
};
var carriage = "\r\n";
var dashes = "-".repeat(2);
var carriageLength = Buffer.byteLength(carriage);
var getFooter = (boundary) => `${dashes}${boundary}${dashes}${carriage.repeat(2)}`;
function getHeader(boundary, name, field) {
  let header = "";
  header += `${dashes}${boundary}${carriage}`;
  header += `Content-Disposition: form-data; name="${name}"`;
  if (isBlob(field)) {
    header += `; filename="${field.name}"${carriage}`;
    header += `Content-Type: ${field.type || "application/octet-stream"}`;
  }
  return `${header}${carriage.repeat(2)}`;
}
var getBoundary = () => (0, import_crypto.randomBytes)(8).toString("hex");
async function* formDataIterator(form, boundary) {
  for (const [name, value] of form) {
    yield getHeader(boundary, name, value);
    if (isBlob(value)) {
      yield* value.stream();
    } else {
      yield value;
    }
    yield carriage;
  }
  yield getFooter(boundary);
}
function getFormDataLength(form, boundary) {
  let length = 0;
  for (const [name, value] of form) {
    length += Buffer.byteLength(getHeader(boundary, name, value));
    if (isBlob(value)) {
      length += value.size;
    } else {
      length += Buffer.byteLength(String(value));
    }
    length += carriageLength;
  }
  length += Buffer.byteLength(getFooter(boundary));
  return length;
}
var INTERNALS$2 = Symbol("Body internals");
var Body = class {
  constructor(body, {
    size = 0
  } = {}) {
    let boundary = null;
    if (body === null) {
      body = null;
    } else if (isURLSearchParameters(body)) {
      body = Buffer.from(body.toString());
    } else if (isBlob(body))
      ;
    else if (Buffer.isBuffer(body))
      ;
    else if (import_util.types.isAnyArrayBuffer(body)) {
      body = Buffer.from(body);
    } else if (ArrayBuffer.isView(body)) {
      body = Buffer.from(body.buffer, body.byteOffset, body.byteLength);
    } else if (body instanceof import_stream.default)
      ;
    else if (isFormData(body)) {
      boundary = `NodeFetchFormDataBoundary${getBoundary()}`;
      body = import_stream.default.Readable.from(formDataIterator(body, boundary));
    } else {
      body = Buffer.from(String(body));
    }
    this[INTERNALS$2] = {
      body,
      boundary,
      disturbed: false,
      error: null
    };
    this.size = size;
    if (body instanceof import_stream.default) {
      body.on("error", (err) => {
        const error3 = err instanceof FetchBaseError ? err : new FetchError(`Invalid response body while trying to fetch ${this.url}: ${err.message}`, "system", err);
        this[INTERNALS$2].error = error3;
      });
    }
  }
  get body() {
    return this[INTERNALS$2].body;
  }
  get bodyUsed() {
    return this[INTERNALS$2].disturbed;
  }
  async arrayBuffer() {
    const { buffer, byteOffset, byteLength } = await consumeBody(this);
    return buffer.slice(byteOffset, byteOffset + byteLength);
  }
  async blob() {
    const ct = this.headers && this.headers.get("content-type") || this[INTERNALS$2].body && this[INTERNALS$2].body.type || "";
    const buf = await this.buffer();
    return new Blob$1([buf], {
      type: ct
    });
  }
  async json() {
    const buffer = await consumeBody(this);
    return JSON.parse(buffer.toString());
  }
  async text() {
    const buffer = await consumeBody(this);
    return buffer.toString();
  }
  buffer() {
    return consumeBody(this);
  }
};
Object.defineProperties(Body.prototype, {
  body: { enumerable: true },
  bodyUsed: { enumerable: true },
  arrayBuffer: { enumerable: true },
  blob: { enumerable: true },
  json: { enumerable: true },
  text: { enumerable: true }
});
async function consumeBody(data) {
  if (data[INTERNALS$2].disturbed) {
    throw new TypeError(`body used already for: ${data.url}`);
  }
  data[INTERNALS$2].disturbed = true;
  if (data[INTERNALS$2].error) {
    throw data[INTERNALS$2].error;
  }
  let { body } = data;
  if (body === null) {
    return Buffer.alloc(0);
  }
  if (isBlob(body)) {
    body = body.stream();
  }
  if (Buffer.isBuffer(body)) {
    return body;
  }
  if (!(body instanceof import_stream.default)) {
    return Buffer.alloc(0);
  }
  const accum = [];
  let accumBytes = 0;
  try {
    for await (const chunk of body) {
      if (data.size > 0 && accumBytes + chunk.length > data.size) {
        const err = new FetchError(`content size at ${data.url} over limit: ${data.size}`, "max-size");
        body.destroy(err);
        throw err;
      }
      accumBytes += chunk.length;
      accum.push(chunk);
    }
  } catch (error3) {
    if (error3 instanceof FetchBaseError) {
      throw error3;
    } else {
      throw new FetchError(`Invalid response body while trying to fetch ${data.url}: ${error3.message}`, "system", error3);
    }
  }
  if (body.readableEnded === true || body._readableState.ended === true) {
    try {
      if (accum.every((c) => typeof c === "string")) {
        return Buffer.from(accum.join(""));
      }
      return Buffer.concat(accum, accumBytes);
    } catch (error3) {
      throw new FetchError(`Could not create Buffer from response body for ${data.url}: ${error3.message}`, "system", error3);
    }
  } else {
    throw new FetchError(`Premature close of server response while trying to fetch ${data.url}`);
  }
}
var clone = (instance, highWaterMark) => {
  let p1;
  let p2;
  let { body } = instance;
  if (instance.bodyUsed) {
    throw new Error("cannot clone body after it is used");
  }
  if (body instanceof import_stream.default && typeof body.getBoundary !== "function") {
    p1 = new import_stream.PassThrough({ highWaterMark });
    p2 = new import_stream.PassThrough({ highWaterMark });
    body.pipe(p1);
    body.pipe(p2);
    instance[INTERNALS$2].body = p1;
    body = p2;
  }
  return body;
};
var extractContentType = (body, request) => {
  if (body === null) {
    return null;
  }
  if (typeof body === "string") {
    return "text/plain;charset=UTF-8";
  }
  if (isURLSearchParameters(body)) {
    return "application/x-www-form-urlencoded;charset=UTF-8";
  }
  if (isBlob(body)) {
    return body.type || null;
  }
  if (Buffer.isBuffer(body) || import_util.types.isAnyArrayBuffer(body) || ArrayBuffer.isView(body)) {
    return null;
  }
  if (body && typeof body.getBoundary === "function") {
    return `multipart/form-data;boundary=${body.getBoundary()}`;
  }
  if (isFormData(body)) {
    return `multipart/form-data; boundary=${request[INTERNALS$2].boundary}`;
  }
  if (body instanceof import_stream.default) {
    return null;
  }
  return "text/plain;charset=UTF-8";
};
var getTotalBytes = (request) => {
  const { body } = request;
  if (body === null) {
    return 0;
  }
  if (isBlob(body)) {
    return body.size;
  }
  if (Buffer.isBuffer(body)) {
    return body.length;
  }
  if (body && typeof body.getLengthSync === "function") {
    return body.hasKnownLength && body.hasKnownLength() ? body.getLengthSync() : null;
  }
  if (isFormData(body)) {
    return getFormDataLength(request[INTERNALS$2].boundary);
  }
  return null;
};
var writeToStream = (dest, { body }) => {
  if (body === null) {
    dest.end();
  } else if (isBlob(body)) {
    body.stream().pipe(dest);
  } else if (Buffer.isBuffer(body)) {
    dest.write(body);
    dest.end();
  } else {
    body.pipe(dest);
  }
};
var validateHeaderName = typeof import_http.default.validateHeaderName === "function" ? import_http.default.validateHeaderName : (name) => {
  if (!/^[\^`\-\w!#$%&'*+.|~]+$/.test(name)) {
    const err = new TypeError(`Header name must be a valid HTTP token [${name}]`);
    Object.defineProperty(err, "code", { value: "ERR_INVALID_HTTP_TOKEN" });
    throw err;
  }
};
var validateHeaderValue = typeof import_http.default.validateHeaderValue === "function" ? import_http.default.validateHeaderValue : (name, value) => {
  if (/[^\t\u0020-\u007E\u0080-\u00FF]/.test(value)) {
    const err = new TypeError(`Invalid character in header content ["${name}"]`);
    Object.defineProperty(err, "code", { value: "ERR_INVALID_CHAR" });
    throw err;
  }
};
var Headers = class extends URLSearchParams {
  constructor(init2) {
    let result = [];
    if (init2 instanceof Headers) {
      const raw = init2.raw();
      for (const [name, values] of Object.entries(raw)) {
        result.push(...values.map((value) => [name, value]));
      }
    } else if (init2 == null)
      ;
    else if (typeof init2 === "object" && !import_util.types.isBoxedPrimitive(init2)) {
      const method = init2[Symbol.iterator];
      if (method == null) {
        result.push(...Object.entries(init2));
      } else {
        if (typeof method !== "function") {
          throw new TypeError("Header pairs must be iterable");
        }
        result = [...init2].map((pair) => {
          if (typeof pair !== "object" || import_util.types.isBoxedPrimitive(pair)) {
            throw new TypeError("Each header pair must be an iterable object");
          }
          return [...pair];
        }).map((pair) => {
          if (pair.length !== 2) {
            throw new TypeError("Each header pair must be a name/value tuple");
          }
          return [...pair];
        });
      }
    } else {
      throw new TypeError("Failed to construct 'Headers': The provided value is not of type '(sequence<sequence<ByteString>> or record<ByteString, ByteString>)");
    }
    result = result.length > 0 ? result.map(([name, value]) => {
      validateHeaderName(name);
      validateHeaderValue(name, String(value));
      return [String(name).toLowerCase(), String(value)];
    }) : void 0;
    super(result);
    return new Proxy(this, {
      get(target, p, receiver) {
        switch (p) {
          case "append":
          case "set":
            return (name, value) => {
              validateHeaderName(name);
              validateHeaderValue(name, String(value));
              return URLSearchParams.prototype[p].call(receiver, String(name).toLowerCase(), String(value));
            };
          case "delete":
          case "has":
          case "getAll":
            return (name) => {
              validateHeaderName(name);
              return URLSearchParams.prototype[p].call(receiver, String(name).toLowerCase());
            };
          case "keys":
            return () => {
              target.sort();
              return new Set(URLSearchParams.prototype.keys.call(target)).keys();
            };
          default:
            return Reflect.get(target, p, receiver);
        }
      }
    });
  }
  get [Symbol.toStringTag]() {
    return this.constructor.name;
  }
  toString() {
    return Object.prototype.toString.call(this);
  }
  get(name) {
    const values = this.getAll(name);
    if (values.length === 0) {
      return null;
    }
    let value = values.join(", ");
    if (/^content-encoding$/i.test(name)) {
      value = value.toLowerCase();
    }
    return value;
  }
  forEach(callback) {
    for (const name of this.keys()) {
      callback(this.get(name), name);
    }
  }
  *values() {
    for (const name of this.keys()) {
      yield this.get(name);
    }
  }
  *entries() {
    for (const name of this.keys()) {
      yield [name, this.get(name)];
    }
  }
  [Symbol.iterator]() {
    return this.entries();
  }
  raw() {
    return [...this.keys()].reduce((result, key) => {
      result[key] = this.getAll(key);
      return result;
    }, {});
  }
  [Symbol.for("nodejs.util.inspect.custom")]() {
    return [...this.keys()].reduce((result, key) => {
      const values = this.getAll(key);
      if (key === "host") {
        result[key] = values[0];
      } else {
        result[key] = values.length > 1 ? values : values[0];
      }
      return result;
    }, {});
  }
};
Object.defineProperties(Headers.prototype, ["get", "entries", "forEach", "values"].reduce((result, property) => {
  result[property] = { enumerable: true };
  return result;
}, {}));
function fromRawHeaders(headers = []) {
  return new Headers(headers.reduce((result, value, index2, array) => {
    if (index2 % 2 === 0) {
      result.push(array.slice(index2, index2 + 2));
    }
    return result;
  }, []).filter(([name, value]) => {
    try {
      validateHeaderName(name);
      validateHeaderValue(name, String(value));
      return true;
    } catch {
      return false;
    }
  }));
}
var redirectStatus = new Set([301, 302, 303, 307, 308]);
var isRedirect = (code) => {
  return redirectStatus.has(code);
};
var INTERNALS$1 = Symbol("Response internals");
var Response = class extends Body {
  constructor(body = null, options2 = {}) {
    super(body, options2);
    const status = options2.status || 200;
    const headers = new Headers(options2.headers);
    if (body !== null && !headers.has("Content-Type")) {
      const contentType = extractContentType(body);
      if (contentType) {
        headers.append("Content-Type", contentType);
      }
    }
    this[INTERNALS$1] = {
      url: options2.url,
      status,
      statusText: options2.statusText || "",
      headers,
      counter: options2.counter,
      highWaterMark: options2.highWaterMark
    };
  }
  get url() {
    return this[INTERNALS$1].url || "";
  }
  get status() {
    return this[INTERNALS$1].status;
  }
  get ok() {
    return this[INTERNALS$1].status >= 200 && this[INTERNALS$1].status < 300;
  }
  get redirected() {
    return this[INTERNALS$1].counter > 0;
  }
  get statusText() {
    return this[INTERNALS$1].statusText;
  }
  get headers() {
    return this[INTERNALS$1].headers;
  }
  get highWaterMark() {
    return this[INTERNALS$1].highWaterMark;
  }
  clone() {
    return new Response(clone(this, this.highWaterMark), {
      url: this.url,
      status: this.status,
      statusText: this.statusText,
      headers: this.headers,
      ok: this.ok,
      redirected: this.redirected,
      size: this.size
    });
  }
  static redirect(url, status = 302) {
    if (!isRedirect(status)) {
      throw new RangeError('Failed to execute "redirect" on "response": Invalid status code');
    }
    return new Response(null, {
      headers: {
        location: new URL(url).toString()
      },
      status
    });
  }
  get [Symbol.toStringTag]() {
    return "Response";
  }
};
Object.defineProperties(Response.prototype, {
  url: { enumerable: true },
  status: { enumerable: true },
  ok: { enumerable: true },
  redirected: { enumerable: true },
  statusText: { enumerable: true },
  headers: { enumerable: true },
  clone: { enumerable: true }
});
var getSearch = (parsedURL) => {
  if (parsedURL.search) {
    return parsedURL.search;
  }
  const lastOffset = parsedURL.href.length - 1;
  const hash2 = parsedURL.hash || (parsedURL.href[lastOffset] === "#" ? "#" : "");
  return parsedURL.href[lastOffset - hash2.length] === "?" ? "?" : "";
};
var INTERNALS = Symbol("Request internals");
var isRequest = (object) => {
  return typeof object === "object" && typeof object[INTERNALS] === "object";
};
var Request = class extends Body {
  constructor(input, init2 = {}) {
    let parsedURL;
    if (isRequest(input)) {
      parsedURL = new URL(input.url);
    } else {
      parsedURL = new URL(input);
      input = {};
    }
    let method = init2.method || input.method || "GET";
    method = method.toUpperCase();
    if ((init2.body != null || isRequest(input)) && input.body !== null && (method === "GET" || method === "HEAD")) {
      throw new TypeError("Request with GET/HEAD method cannot have body");
    }
    const inputBody = init2.body ? init2.body : isRequest(input) && input.body !== null ? clone(input) : null;
    super(inputBody, {
      size: init2.size || input.size || 0
    });
    const headers = new Headers(init2.headers || input.headers || {});
    if (inputBody !== null && !headers.has("Content-Type")) {
      const contentType = extractContentType(inputBody, this);
      if (contentType) {
        headers.append("Content-Type", contentType);
      }
    }
    let signal = isRequest(input) ? input.signal : null;
    if ("signal" in init2) {
      signal = init2.signal;
    }
    if (signal !== null && !isAbortSignal(signal)) {
      throw new TypeError("Expected signal to be an instanceof AbortSignal");
    }
    this[INTERNALS] = {
      method,
      redirect: init2.redirect || input.redirect || "follow",
      headers,
      parsedURL,
      signal
    };
    this.follow = init2.follow === void 0 ? input.follow === void 0 ? 20 : input.follow : init2.follow;
    this.compress = init2.compress === void 0 ? input.compress === void 0 ? true : input.compress : init2.compress;
    this.counter = init2.counter || input.counter || 0;
    this.agent = init2.agent || input.agent;
    this.highWaterMark = init2.highWaterMark || input.highWaterMark || 16384;
    this.insecureHTTPParser = init2.insecureHTTPParser || input.insecureHTTPParser || false;
  }
  get method() {
    return this[INTERNALS].method;
  }
  get url() {
    return (0, import_url.format)(this[INTERNALS].parsedURL);
  }
  get headers() {
    return this[INTERNALS].headers;
  }
  get redirect() {
    return this[INTERNALS].redirect;
  }
  get signal() {
    return this[INTERNALS].signal;
  }
  clone() {
    return new Request(this);
  }
  get [Symbol.toStringTag]() {
    return "Request";
  }
};
Object.defineProperties(Request.prototype, {
  method: { enumerable: true },
  url: { enumerable: true },
  headers: { enumerable: true },
  redirect: { enumerable: true },
  clone: { enumerable: true },
  signal: { enumerable: true }
});
var getNodeRequestOptions = (request) => {
  const { parsedURL } = request[INTERNALS];
  const headers = new Headers(request[INTERNALS].headers);
  if (!headers.has("Accept")) {
    headers.set("Accept", "*/*");
  }
  let contentLengthValue = null;
  if (request.body === null && /^(post|put)$/i.test(request.method)) {
    contentLengthValue = "0";
  }
  if (request.body !== null) {
    const totalBytes = getTotalBytes(request);
    if (typeof totalBytes === "number" && !Number.isNaN(totalBytes)) {
      contentLengthValue = String(totalBytes);
    }
  }
  if (contentLengthValue) {
    headers.set("Content-Length", contentLengthValue);
  }
  if (!headers.has("User-Agent")) {
    headers.set("User-Agent", "node-fetch");
  }
  if (request.compress && !headers.has("Accept-Encoding")) {
    headers.set("Accept-Encoding", "gzip,deflate,br");
  }
  let { agent } = request;
  if (typeof agent === "function") {
    agent = agent(parsedURL);
  }
  if (!headers.has("Connection") && !agent) {
    headers.set("Connection", "close");
  }
  const search = getSearch(parsedURL);
  const requestOptions = {
    path: parsedURL.pathname + search,
    pathname: parsedURL.pathname,
    hostname: parsedURL.hostname,
    protocol: parsedURL.protocol,
    port: parsedURL.port,
    hash: parsedURL.hash,
    search: parsedURL.search,
    query: parsedURL.query,
    href: parsedURL.href,
    method: request.method,
    headers: headers[Symbol.for("nodejs.util.inspect.custom")](),
    insecureHTTPParser: request.insecureHTTPParser,
    agent
  };
  return requestOptions;
};
var AbortError = class extends FetchBaseError {
  constructor(message, type = "aborted") {
    super(message, type);
  }
};
var supportedSchemas = new Set(["data:", "http:", "https:"]);
async function fetch(url, options_) {
  return new Promise((resolve2, reject) => {
    const request = new Request(url, options_);
    const options2 = getNodeRequestOptions(request);
    if (!supportedSchemas.has(options2.protocol)) {
      throw new TypeError(`node-fetch cannot load ${url}. URL scheme "${options2.protocol.replace(/:$/, "")}" is not supported.`);
    }
    if (options2.protocol === "data:") {
      const data = dataUriToBuffer$1(request.url);
      const response2 = new Response(data, { headers: { "Content-Type": data.typeFull } });
      resolve2(response2);
      return;
    }
    const send = (options2.protocol === "https:" ? import_https.default : import_http.default).request;
    const { signal } = request;
    let response = null;
    const abort = () => {
      const error3 = new AbortError("The operation was aborted.");
      reject(error3);
      if (request.body && request.body instanceof import_stream.default.Readable) {
        request.body.destroy(error3);
      }
      if (!response || !response.body) {
        return;
      }
      response.body.emit("error", error3);
    };
    if (signal && signal.aborted) {
      abort();
      return;
    }
    const abortAndFinalize = () => {
      abort();
      finalize();
    };
    const request_ = send(options2);
    if (signal) {
      signal.addEventListener("abort", abortAndFinalize);
    }
    const finalize = () => {
      request_.abort();
      if (signal) {
        signal.removeEventListener("abort", abortAndFinalize);
      }
    };
    request_.on("error", (err) => {
      reject(new FetchError(`request to ${request.url} failed, reason: ${err.message}`, "system", err));
      finalize();
    });
    request_.on("response", (response_) => {
      request_.setTimeout(0);
      const headers = fromRawHeaders(response_.rawHeaders);
      if (isRedirect(response_.statusCode)) {
        const location = headers.get("Location");
        const locationURL = location === null ? null : new URL(location, request.url);
        switch (request.redirect) {
          case "error":
            reject(new FetchError(`uri requested responds with a redirect, redirect mode is set to error: ${request.url}`, "no-redirect"));
            finalize();
            return;
          case "manual":
            if (locationURL !== null) {
              try {
                headers.set("Location", locationURL);
              } catch (error3) {
                reject(error3);
              }
            }
            break;
          case "follow": {
            if (locationURL === null) {
              break;
            }
            if (request.counter >= request.follow) {
              reject(new FetchError(`maximum redirect reached at: ${request.url}`, "max-redirect"));
              finalize();
              return;
            }
            const requestOptions = {
              headers: new Headers(request.headers),
              follow: request.follow,
              counter: request.counter + 1,
              agent: request.agent,
              compress: request.compress,
              method: request.method,
              body: request.body,
              signal: request.signal,
              size: request.size
            };
            if (response_.statusCode !== 303 && request.body && options_.body instanceof import_stream.default.Readable) {
              reject(new FetchError("Cannot follow redirect with body being a readable stream", "unsupported-redirect"));
              finalize();
              return;
            }
            if (response_.statusCode === 303 || (response_.statusCode === 301 || response_.statusCode === 302) && request.method === "POST") {
              requestOptions.method = "GET";
              requestOptions.body = void 0;
              requestOptions.headers.delete("content-length");
            }
            resolve2(fetch(new Request(locationURL, requestOptions)));
            finalize();
            return;
          }
        }
      }
      response_.once("end", () => {
        if (signal) {
          signal.removeEventListener("abort", abortAndFinalize);
        }
      });
      let body = (0, import_stream.pipeline)(response_, new import_stream.PassThrough(), (error3) => {
        reject(error3);
      });
      if (process.version < "v12.10") {
        response_.on("aborted", abortAndFinalize);
      }
      const responseOptions = {
        url: request.url,
        status: response_.statusCode,
        statusText: response_.statusMessage,
        headers,
        size: request.size,
        counter: request.counter,
        highWaterMark: request.highWaterMark
      };
      const codings = headers.get("Content-Encoding");
      if (!request.compress || request.method === "HEAD" || codings === null || response_.statusCode === 204 || response_.statusCode === 304) {
        response = new Response(body, responseOptions);
        resolve2(response);
        return;
      }
      const zlibOptions = {
        flush: import_zlib.default.Z_SYNC_FLUSH,
        finishFlush: import_zlib.default.Z_SYNC_FLUSH
      };
      if (codings === "gzip" || codings === "x-gzip") {
        body = (0, import_stream.pipeline)(body, import_zlib.default.createGunzip(zlibOptions), (error3) => {
          reject(error3);
        });
        response = new Response(body, responseOptions);
        resolve2(response);
        return;
      }
      if (codings === "deflate" || codings === "x-deflate") {
        const raw = (0, import_stream.pipeline)(response_, new import_stream.PassThrough(), (error3) => {
          reject(error3);
        });
        raw.once("data", (chunk) => {
          if ((chunk[0] & 15) === 8) {
            body = (0, import_stream.pipeline)(body, import_zlib.default.createInflate(), (error3) => {
              reject(error3);
            });
          } else {
            body = (0, import_stream.pipeline)(body, import_zlib.default.createInflateRaw(), (error3) => {
              reject(error3);
            });
          }
          response = new Response(body, responseOptions);
          resolve2(response);
        });
        return;
      }
      if (codings === "br") {
        body = (0, import_stream.pipeline)(body, import_zlib.default.createBrotliDecompress(), (error3) => {
          reject(error3);
        });
        response = new Response(body, responseOptions);
        resolve2(response);
        return;
      }
      response = new Response(body, responseOptions);
      resolve2(response);
    });
    writeToStream(request_, request);
  });
}

// node_modules/@sveltejs/kit/dist/adapter-utils.js
function isContentTypeTextual(content_type) {
  if (!content_type)
    return true;
  const [type] = content_type.split(";");
  return type === "text/plain" || type === "application/json" || type === "application/x-www-form-urlencoded" || type === "multipart/form-data";
}

// node_modules/@sveltejs/kit/dist/ssr.js
function lowercase_keys(obj) {
  const clone2 = {};
  for (const key in obj) {
    clone2[key.toLowerCase()] = obj[key];
  }
  return clone2;
}
function error(body) {
  return {
    status: 500,
    body,
    headers: {}
  };
}
function is_string(s2) {
  return typeof s2 === "string" || s2 instanceof String;
}
async function render_endpoint(request, route) {
  const mod = await route.load();
  const handler2 = mod[request.method.toLowerCase().replace("delete", "del")];
  if (!handler2) {
    return;
  }
  const match = route.pattern.exec(request.path);
  if (!match) {
    return error("could not parse parameters from request path");
  }
  const params = route.params(match);
  const response = await handler2({ ...request, params });
  const preface = `Invalid response from route ${request.path}`;
  if (!response) {
    return;
  }
  if (typeof response !== "object") {
    return error(`${preface}: expected an object, got ${typeof response}`);
  }
  let { status = 200, body, headers = {} } = response;
  headers = lowercase_keys(headers);
  const type = headers["content-type"];
  const is_type_textual = isContentTypeTextual(type);
  if (!is_type_textual && !(body instanceof Uint8Array || is_string(body))) {
    return error(`${preface}: body must be an instance of string or Uint8Array if content-type is not a supported textual content-type`);
  }
  let normalized_body;
  if ((typeof body === "object" || typeof body === "undefined") && !(body instanceof Uint8Array) && (!type || type.startsWith("application/json"))) {
    headers = { ...headers, "content-type": "application/json; charset=utf-8" };
    normalized_body = JSON.stringify(typeof body === "undefined" ? {} : body);
  } else {
    normalized_body = body;
  }
  return { status, body: normalized_body, headers };
}
var chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_$";
var unsafeChars = /[<>\b\f\n\r\t\0\u2028\u2029]/g;
var reserved = /^(?:do|if|in|for|int|let|new|try|var|byte|case|char|else|enum|goto|long|this|void|with|await|break|catch|class|const|final|float|short|super|throw|while|yield|delete|double|export|import|native|return|switch|throws|typeof|boolean|default|extends|finally|package|private|abstract|continue|debugger|function|volatile|interface|protected|transient|implements|instanceof|synchronized)$/;
var escaped$1 = {
  "<": "\\u003C",
  ">": "\\u003E",
  "/": "\\u002F",
  "\\": "\\\\",
  "\b": "\\b",
  "\f": "\\f",
  "\n": "\\n",
  "\r": "\\r",
  "	": "\\t",
  "\0": "\\0",
  "\u2028": "\\u2028",
  "\u2029": "\\u2029"
};
var objectProtoOwnPropertyNames = Object.getOwnPropertyNames(Object.prototype).sort().join("\0");
function devalue(value) {
  var counts = new Map();
  function walk(thing) {
    if (typeof thing === "function") {
      throw new Error("Cannot stringify a function");
    }
    if (counts.has(thing)) {
      counts.set(thing, counts.get(thing) + 1);
      return;
    }
    counts.set(thing, 1);
    if (!isPrimitive(thing)) {
      var type = getType(thing);
      switch (type) {
        case "Number":
        case "String":
        case "Boolean":
        case "Date":
        case "RegExp":
          return;
        case "Array":
          thing.forEach(walk);
          break;
        case "Set":
        case "Map":
          Array.from(thing).forEach(walk);
          break;
        default:
          var proto = Object.getPrototypeOf(thing);
          if (proto !== Object.prototype && proto !== null && Object.getOwnPropertyNames(proto).sort().join("\0") !== objectProtoOwnPropertyNames) {
            throw new Error("Cannot stringify arbitrary non-POJOs");
          }
          if (Object.getOwnPropertySymbols(thing).length > 0) {
            throw new Error("Cannot stringify POJOs with symbolic keys");
          }
          Object.keys(thing).forEach(function(key) {
            return walk(thing[key]);
          });
      }
    }
  }
  walk(value);
  var names = new Map();
  Array.from(counts).filter(function(entry) {
    return entry[1] > 1;
  }).sort(function(a, b) {
    return b[1] - a[1];
  }).forEach(function(entry, i) {
    names.set(entry[0], getName(i));
  });
  function stringify(thing) {
    if (names.has(thing)) {
      return names.get(thing);
    }
    if (isPrimitive(thing)) {
      return stringifyPrimitive(thing);
    }
    var type = getType(thing);
    switch (type) {
      case "Number":
      case "String":
      case "Boolean":
        return "Object(" + stringify(thing.valueOf()) + ")";
      case "RegExp":
        return "new RegExp(" + stringifyString(thing.source) + ', "' + thing.flags + '")';
      case "Date":
        return "new Date(" + thing.getTime() + ")";
      case "Array":
        var members = thing.map(function(v, i) {
          return i in thing ? stringify(v) : "";
        });
        var tail = thing.length === 0 || thing.length - 1 in thing ? "" : ",";
        return "[" + members.join(",") + tail + "]";
      case "Set":
      case "Map":
        return "new " + type + "([" + Array.from(thing).map(stringify).join(",") + "])";
      default:
        var obj = "{" + Object.keys(thing).map(function(key) {
          return safeKey(key) + ":" + stringify(thing[key]);
        }).join(",") + "}";
        var proto = Object.getPrototypeOf(thing);
        if (proto === null) {
          return Object.keys(thing).length > 0 ? "Object.assign(Object.create(null)," + obj + ")" : "Object.create(null)";
        }
        return obj;
    }
  }
  var str = stringify(value);
  if (names.size) {
    var params_1 = [];
    var statements_1 = [];
    var values_1 = [];
    names.forEach(function(name, thing) {
      params_1.push(name);
      if (isPrimitive(thing)) {
        values_1.push(stringifyPrimitive(thing));
        return;
      }
      var type = getType(thing);
      switch (type) {
        case "Number":
        case "String":
        case "Boolean":
          values_1.push("Object(" + stringify(thing.valueOf()) + ")");
          break;
        case "RegExp":
          values_1.push(thing.toString());
          break;
        case "Date":
          values_1.push("new Date(" + thing.getTime() + ")");
          break;
        case "Array":
          values_1.push("Array(" + thing.length + ")");
          thing.forEach(function(v, i) {
            statements_1.push(name + "[" + i + "]=" + stringify(v));
          });
          break;
        case "Set":
          values_1.push("new Set");
          statements_1.push(name + "." + Array.from(thing).map(function(v) {
            return "add(" + stringify(v) + ")";
          }).join("."));
          break;
        case "Map":
          values_1.push("new Map");
          statements_1.push(name + "." + Array.from(thing).map(function(_a) {
            var k = _a[0], v = _a[1];
            return "set(" + stringify(k) + ", " + stringify(v) + ")";
          }).join("."));
          break;
        default:
          values_1.push(Object.getPrototypeOf(thing) === null ? "Object.create(null)" : "{}");
          Object.keys(thing).forEach(function(key) {
            statements_1.push("" + name + safeProp(key) + "=" + stringify(thing[key]));
          });
      }
    });
    statements_1.push("return " + str);
    return "(function(" + params_1.join(",") + "){" + statements_1.join(";") + "}(" + values_1.join(",") + "))";
  } else {
    return str;
  }
}
function getName(num) {
  var name = "";
  do {
    name = chars[num % chars.length] + name;
    num = ~~(num / chars.length) - 1;
  } while (num >= 0);
  return reserved.test(name) ? name + "_" : name;
}
function isPrimitive(thing) {
  return Object(thing) !== thing;
}
function stringifyPrimitive(thing) {
  if (typeof thing === "string")
    return stringifyString(thing);
  if (thing === void 0)
    return "void 0";
  if (thing === 0 && 1 / thing < 0)
    return "-0";
  var str = String(thing);
  if (typeof thing === "number")
    return str.replace(/^(-)?0\./, "$1.");
  return str;
}
function getType(thing) {
  return Object.prototype.toString.call(thing).slice(8, -1);
}
function escapeUnsafeChar(c) {
  return escaped$1[c] || c;
}
function escapeUnsafeChars(str) {
  return str.replace(unsafeChars, escapeUnsafeChar);
}
function safeKey(key) {
  return /^[_$a-zA-Z][_$a-zA-Z0-9]*$/.test(key) ? key : escapeUnsafeChars(JSON.stringify(key));
}
function safeProp(key) {
  return /^[_$a-zA-Z][_$a-zA-Z0-9]*$/.test(key) ? "." + key : "[" + escapeUnsafeChars(JSON.stringify(key)) + "]";
}
function stringifyString(str) {
  var result = '"';
  for (var i = 0; i < str.length; i += 1) {
    var char = str.charAt(i);
    var code = char.charCodeAt(0);
    if (char === '"') {
      result += '\\"';
    } else if (char in escaped$1) {
      result += escaped$1[char];
    } else if (code >= 55296 && code <= 57343) {
      var next = str.charCodeAt(i + 1);
      if (code <= 56319 && (next >= 56320 && next <= 57343)) {
        result += char + str[++i];
      } else {
        result += "\\u" + code.toString(16).toUpperCase();
      }
    } else {
      result += char;
    }
  }
  result += '"';
  return result;
}
function noop() {
}
function safe_not_equal(a, b) {
  return a != a ? b == b : a !== b || (a && typeof a === "object" || typeof a === "function");
}
Promise.resolve();
var subscriber_queue = [];
function writable(value, start = noop) {
  let stop;
  const subscribers = [];
  function set(new_value) {
    if (safe_not_equal(value, new_value)) {
      value = new_value;
      if (stop) {
        const run_queue = !subscriber_queue.length;
        for (let i = 0; i < subscribers.length; i += 1) {
          const s2 = subscribers[i];
          s2[1]();
          subscriber_queue.push(s2, value);
        }
        if (run_queue) {
          for (let i = 0; i < subscriber_queue.length; i += 2) {
            subscriber_queue[i][0](subscriber_queue[i + 1]);
          }
          subscriber_queue.length = 0;
        }
      }
    }
  }
  function update(fn) {
    set(fn(value));
  }
  function subscribe(run2, invalidate = noop) {
    const subscriber = [run2, invalidate];
    subscribers.push(subscriber);
    if (subscribers.length === 1) {
      stop = start(set) || noop;
    }
    run2(value);
    return () => {
      const index2 = subscribers.indexOf(subscriber);
      if (index2 !== -1) {
        subscribers.splice(index2, 1);
      }
      if (subscribers.length === 0) {
        stop();
        stop = null;
      }
    };
  }
  return { set, update, subscribe };
}
function hash(value) {
  let hash2 = 5381;
  let i = value.length;
  if (typeof value === "string") {
    while (i)
      hash2 = hash2 * 33 ^ value.charCodeAt(--i);
  } else {
    while (i)
      hash2 = hash2 * 33 ^ value[--i];
  }
  return (hash2 >>> 0).toString(36);
}
var s$1 = JSON.stringify;
async function render_response({
  branch,
  options: options2,
  $session,
  page_config,
  status,
  error: error3,
  page
}) {
  const css2 = new Set(options2.entry.css);
  const js = new Set(options2.entry.js);
  const styles = new Set();
  const serialized_data = [];
  let rendered;
  let is_private = false;
  let maxage;
  if (error3) {
    error3.stack = options2.get_stack(error3);
  }
  if (page_config.ssr) {
    branch.forEach(({ node, loaded, fetched, uses_credentials }) => {
      if (node.css)
        node.css.forEach((url) => css2.add(url));
      if (node.js)
        node.js.forEach((url) => js.add(url));
      if (node.styles)
        node.styles.forEach((content) => styles.add(content));
      if (fetched && page_config.hydrate)
        serialized_data.push(...fetched);
      if (uses_credentials)
        is_private = true;
      maxage = loaded.maxage;
    });
    const session = writable($session);
    const props = {
      stores: {
        page: writable(null),
        navigating: writable(null),
        session
      },
      page,
      components: branch.map(({ node }) => node.module.default)
    };
    for (let i = 0; i < branch.length; i += 1) {
      props[`props_${i}`] = await branch[i].loaded.props;
    }
    let session_tracking_active = false;
    const unsubscribe = session.subscribe(() => {
      if (session_tracking_active)
        is_private = true;
    });
    session_tracking_active = true;
    try {
      rendered = options2.root.render(props);
    } finally {
      unsubscribe();
    }
  } else {
    rendered = { head: "", html: "", css: { code: "", map: null } };
  }
  const include_js = page_config.router || page_config.hydrate;
  if (!include_js)
    js.clear();
  const links = options2.amp ? styles.size > 0 || rendered.css.code.length > 0 ? `<style amp-custom>${Array.from(styles).concat(rendered.css.code).join("\n")}</style>` : "" : [
    ...Array.from(js).map((dep) => `<link rel="modulepreload" href="${dep}">`),
    ...Array.from(css2).map((dep) => `<link rel="stylesheet" href="${dep}">`)
  ].join("\n		");
  let init2 = "";
  if (options2.amp) {
    init2 = `
		<style amp-boilerplate>body{-webkit-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-moz-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-ms-animation:-amp-start 8s steps(1,end) 0s 1 normal both;animation:-amp-start 8s steps(1,end) 0s 1 normal both}@-webkit-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-moz-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-ms-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-o-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}</style>
		<noscript><style amp-boilerplate>body{-webkit-animation:none;-moz-animation:none;-ms-animation:none;animation:none}</style></noscript>
		<script async src="https://cdn.ampproject.org/v0.js"><\/script>`;
  } else if (include_js) {
    init2 = `<script type="module">
			import { start } from ${s$1(options2.entry.file)};
			start({
				target: ${options2.target ? `document.querySelector(${s$1(options2.target)})` : "document.body"},
				paths: ${s$1(options2.paths)},
				session: ${try_serialize($session, (error4) => {
      throw new Error(`Failed to serialize session data: ${error4.message}`);
    })},
				host: ${page && page.host ? s$1(page.host) : "location.host"},
				route: ${!!page_config.router},
				spa: ${!page_config.ssr},
				trailing_slash: ${s$1(options2.trailing_slash)},
				hydrate: ${page_config.ssr && page_config.hydrate ? `{
					status: ${status},
					error: ${serialize_error(error3)},
					nodes: [
						${(branch || []).map(({ node }) => `import(${s$1(node.entry)})`).join(",\n						")}
					],
					page: {
						host: ${page && page.host ? s$1(page.host) : "location.host"}, // TODO this is redundant
						path: ${s$1(page && page.path)},
						query: new URLSearchParams(${page ? s$1(page.query.toString()) : ""}),
						params: ${page && s$1(page.params)}
					}
				}` : "null"}
			});
		<\/script>`;
  }
  if (options2.service_worker) {
    init2 += `<script>
			if ('serviceWorker' in navigator) {
				navigator.serviceWorker.register('${options2.service_worker}');
			}
		<\/script>`;
  }
  const head = [
    rendered.head,
    styles.size && !options2.amp ? `<style data-svelte>${Array.from(styles).join("\n")}</style>` : "",
    links,
    init2
  ].join("\n\n		");
  const body = options2.amp ? rendered.html : `${rendered.html}

			${serialized_data.map(({ url, body: body2, json }) => {
    let attributes = `type="application/json" data-type="svelte-data" data-url="${url}"`;
    if (body2)
      attributes += ` data-body="${hash(body2)}"`;
    return `<script ${attributes}>${json}<\/script>`;
  }).join("\n\n			")}
		`.replace(/^\t{2}/gm, "");
  const headers = {
    "content-type": "text/html"
  };
  if (maxage) {
    headers["cache-control"] = `${is_private ? "private" : "public"}, max-age=${maxage}`;
  }
  if (!options2.floc) {
    headers["permissions-policy"] = "interest-cohort=()";
  }
  return {
    status,
    headers,
    body: options2.template({ head, body })
  };
}
function try_serialize(data, fail) {
  try {
    return devalue(data);
  } catch (err) {
    if (fail)
      fail(err);
    return null;
  }
}
function serialize_error(error3) {
  if (!error3)
    return null;
  let serialized = try_serialize(error3);
  if (!serialized) {
    const { name, message, stack } = error3;
    serialized = try_serialize({ ...error3, name, message, stack });
  }
  if (!serialized) {
    serialized = "{}";
  }
  return serialized;
}
function normalize(loaded) {
  const has_error_status = loaded.status && loaded.status >= 400 && loaded.status <= 599 && !loaded.redirect;
  if (loaded.error || has_error_status) {
    const status = loaded.status;
    if (!loaded.error && has_error_status) {
      return {
        status: status || 500,
        error: new Error()
      };
    }
    const error3 = typeof loaded.error === "string" ? new Error(loaded.error) : loaded.error;
    if (!(error3 instanceof Error)) {
      return {
        status: 500,
        error: new Error(`"error" property returned from load() must be a string or instance of Error, received type "${typeof error3}"`)
      };
    }
    if (!status || status < 400 || status > 599) {
      console.warn('"error" returned from load() without a valid status code \u2014 defaulting to 500');
      return { status: 500, error: error3 };
    }
    return { status, error: error3 };
  }
  if (loaded.redirect) {
    if (!loaded.status || Math.floor(loaded.status / 100) !== 3) {
      return {
        status: 500,
        error: new Error('"redirect" property returned from load() must be accompanied by a 3xx status code')
      };
    }
    if (typeof loaded.redirect !== "string") {
      return {
        status: 500,
        error: new Error('"redirect" property returned from load() must be a string')
      };
    }
  }
  return loaded;
}
var s = JSON.stringify;
async function load_node({
  request,
  options: options2,
  state,
  route,
  page,
  node,
  $session,
  context,
  prerender_enabled,
  is_leaf,
  is_error,
  status,
  error: error3
}) {
  const { module: module2 } = node;
  let uses_credentials = false;
  const fetched = [];
  let loaded;
  const page_proxy = new Proxy(page, {
    get: (target, prop, receiver) => {
      if (prop === "query" && prerender_enabled) {
        throw new Error("Cannot access query on a page with prerendering enabled");
      }
      return Reflect.get(target, prop, receiver);
    }
  });
  if (module2.load) {
    const load_input = {
      page: page_proxy,
      get session() {
        uses_credentials = true;
        return $session;
      },
      fetch: async (resource, opts = {}) => {
        let url;
        if (typeof resource === "string") {
          url = resource;
        } else {
          url = resource.url;
          opts = {
            method: resource.method,
            headers: resource.headers,
            body: resource.body,
            mode: resource.mode,
            credentials: resource.credentials,
            cache: resource.cache,
            redirect: resource.redirect,
            referrer: resource.referrer,
            integrity: resource.integrity,
            ...opts
          };
        }
        const resolved = resolve(request.path, url.split("?")[0]);
        let response;
        const filename = resolved.replace(options2.paths.assets, "").slice(1);
        const filename_html = `${filename}/index.html`;
        const asset = options2.manifest.assets.find((d2) => d2.file === filename || d2.file === filename_html);
        if (asset) {
          response = options2.read ? new Response(options2.read(asset.file), {
            headers: asset.type ? {
              "content-type": asset.type
            } : {}
          }) : await fetch(`http://${page.host}/${asset.file}`, opts);
        } else if (resolved.startsWith(options2.paths.base || "/") && !resolved.startsWith("//")) {
          const relative = resolved.replace(options2.paths.base, "");
          const headers = { ...opts.headers };
          if (opts.credentials !== "omit") {
            uses_credentials = true;
            headers.cookie = request.headers.cookie;
            if (!headers.authorization) {
              headers.authorization = request.headers.authorization;
            }
          }
          if (opts.body && typeof opts.body !== "string") {
            throw new Error("Request body must be a string");
          }
          const search = url.includes("?") ? url.slice(url.indexOf("?") + 1) : "";
          const rendered = await respond({
            host: request.host,
            method: opts.method || "GET",
            headers,
            path: relative,
            rawBody: opts.body,
            query: new URLSearchParams(search)
          }, options2, {
            fetched: url,
            initiator: route
          });
          if (rendered) {
            if (state.prerender) {
              state.prerender.dependencies.set(relative, rendered);
            }
            response = new Response(rendered.body, {
              status: rendered.status,
              headers: rendered.headers
            });
          }
        } else {
          if (resolved.startsWith("//")) {
            throw new Error(`Cannot request protocol-relative URL (${url}) in server-side fetch`);
          }
          if (typeof request.host !== "undefined") {
            const { hostname: fetch_hostname } = new URL(url);
            const [server_hostname] = request.host.split(":");
            if (`.${fetch_hostname}`.endsWith(`.${server_hostname}`) && opts.credentials !== "omit") {
              uses_credentials = true;
              opts.headers = {
                ...opts.headers,
                cookie: request.headers.cookie
              };
            }
          }
          const external_request = new Request(url, opts);
          response = await options2.hooks.serverFetch.call(null, external_request);
        }
        if (response) {
          const proxy = new Proxy(response, {
            get(response2, key, receiver) {
              async function text() {
                const body = await response2.text();
                const headers = {};
                for (const [key2, value] of response2.headers) {
                  if (key2 !== "etag" && key2 !== "set-cookie")
                    headers[key2] = value;
                }
                if (!opts.body || typeof opts.body === "string") {
                  fetched.push({
                    url,
                    body: opts.body,
                    json: `{"status":${response2.status},"statusText":${s(response2.statusText)},"headers":${s(headers)},"body":${escape(body)}}`
                  });
                }
                return body;
              }
              if (key === "text") {
                return text;
              }
              if (key === "json") {
                return async () => {
                  return JSON.parse(await text());
                };
              }
              return Reflect.get(response2, key, response2);
            }
          });
          return proxy;
        }
        return response || new Response("Not found", {
          status: 404
        });
      },
      context: { ...context }
    };
    if (is_error) {
      load_input.status = status;
      load_input.error = error3;
    }
    loaded = await module2.load.call(null, load_input);
  } else {
    loaded = {};
  }
  if (!loaded && is_leaf && !is_error)
    return;
  if (!loaded) {
    throw new Error(`${node.entry} - load must return a value except for page fall through`);
  }
  return {
    node,
    loaded: normalize(loaded),
    context: loaded.context || context,
    fetched,
    uses_credentials
  };
}
var escaped = {
  "<": "\\u003C",
  ">": "\\u003E",
  "/": "\\u002F",
  "\\": "\\\\",
  "\b": "\\b",
  "\f": "\\f",
  "\n": "\\n",
  "\r": "\\r",
  "	": "\\t",
  "\0": "\\0",
  "\u2028": "\\u2028",
  "\u2029": "\\u2029"
};
function escape(str) {
  let result = '"';
  for (let i = 0; i < str.length; i += 1) {
    const char = str.charAt(i);
    const code = char.charCodeAt(0);
    if (char === '"') {
      result += '\\"';
    } else if (char in escaped) {
      result += escaped[char];
    } else if (code >= 55296 && code <= 57343) {
      const next = str.charCodeAt(i + 1);
      if (code <= 56319 && next >= 56320 && next <= 57343) {
        result += char + str[++i];
      } else {
        result += `\\u${code.toString(16).toUpperCase()}`;
      }
    } else {
      result += char;
    }
  }
  result += '"';
  return result;
}
var absolute = /^([a-z]+:)?\/?\//;
function resolve(base, path) {
  const base_match = absolute.exec(base);
  const path_match = absolute.exec(path);
  if (!base_match) {
    throw new Error(`bad base path: "${base}"`);
  }
  const baseparts = path_match ? [] : base.slice(base_match[0].length).split("/");
  const pathparts = path_match ? path.slice(path_match[0].length).split("/") : path.split("/");
  baseparts.pop();
  for (let i = 0; i < pathparts.length; i += 1) {
    const part = pathparts[i];
    if (part === ".")
      continue;
    else if (part === "..")
      baseparts.pop();
    else
      baseparts.push(part);
  }
  const prefix = path_match && path_match[0] || base_match && base_match[0] || "";
  return `${prefix}${baseparts.join("/")}`;
}
function coalesce_to_error(err) {
  return err instanceof Error ? err : new Error(JSON.stringify(err));
}
async function respond_with_error({ request, options: options2, state, $session, status, error: error3 }) {
  const default_layout = await options2.load_component(options2.manifest.layout);
  const default_error = await options2.load_component(options2.manifest.error);
  const page = {
    host: request.host,
    path: request.path,
    query: request.query,
    params: {}
  };
  const loaded = await load_node({
    request,
    options: options2,
    state,
    route: null,
    page,
    node: default_layout,
    $session,
    context: {},
    prerender_enabled: is_prerender_enabled(options2, default_error, state),
    is_leaf: false,
    is_error: false
  });
  const branch = [
    loaded,
    await load_node({
      request,
      options: options2,
      state,
      route: null,
      page,
      node: default_error,
      $session,
      context: loaded ? loaded.context : {},
      prerender_enabled: is_prerender_enabled(options2, default_error, state),
      is_leaf: false,
      is_error: true,
      status,
      error: error3
    })
  ];
  try {
    return await render_response({
      options: options2,
      $session,
      page_config: {
        hydrate: options2.hydrate,
        router: options2.router,
        ssr: options2.ssr
      },
      status,
      error: error3,
      branch,
      page
    });
  } catch (err) {
    const error4 = coalesce_to_error(err);
    options2.handle_error(error4);
    return {
      status: 500,
      headers: {},
      body: error4.stack
    };
  }
}
function is_prerender_enabled(options2, node, state) {
  return options2.prerender && (!!node.module.prerender || !!state.prerender && state.prerender.all);
}
async function respond$1(opts) {
  const { request, options: options2, state, $session, route } = opts;
  let nodes;
  try {
    nodes = await Promise.all(route.a.map((id) => id ? options2.load_component(id) : void 0));
  } catch (err) {
    const error4 = coalesce_to_error(err);
    options2.handle_error(error4);
    return await respond_with_error({
      request,
      options: options2,
      state,
      $session,
      status: 500,
      error: error4
    });
  }
  const leaf = nodes[nodes.length - 1].module;
  let page_config = get_page_config(leaf, options2);
  if (!leaf.prerender && state.prerender && !state.prerender.all) {
    return {
      status: 204,
      headers: {},
      body: ""
    };
  }
  let branch = [];
  let status = 200;
  let error3;
  ssr:
    if (page_config.ssr) {
      let context = {};
      for (let i = 0; i < nodes.length; i += 1) {
        const node = nodes[i];
        let loaded;
        if (node) {
          try {
            loaded = await load_node({
              ...opts,
              node,
              context,
              prerender_enabled: is_prerender_enabled(options2, node, state),
              is_leaf: i === nodes.length - 1,
              is_error: false
            });
            if (!loaded)
              return;
            if (loaded.loaded.redirect) {
              return {
                status: loaded.loaded.status,
                headers: {
                  location: encodeURI(loaded.loaded.redirect)
                }
              };
            }
            if (loaded.loaded.error) {
              ({ status, error: error3 } = loaded.loaded);
            }
          } catch (err) {
            const e = coalesce_to_error(err);
            options2.handle_error(e);
            status = 500;
            error3 = e;
          }
          if (loaded && !error3) {
            branch.push(loaded);
          }
          if (error3) {
            while (i--) {
              if (route.b[i]) {
                const error_node = await options2.load_component(route.b[i]);
                let node_loaded;
                let j = i;
                while (!(node_loaded = branch[j])) {
                  j -= 1;
                }
                try {
                  const error_loaded = await load_node({
                    ...opts,
                    node: error_node,
                    context: node_loaded.context,
                    prerender_enabled: is_prerender_enabled(options2, error_node, state),
                    is_leaf: false,
                    is_error: true,
                    status,
                    error: error3
                  });
                  if (error_loaded.loaded.error) {
                    continue;
                  }
                  page_config = get_page_config(error_node.module, options2);
                  branch = branch.slice(0, j + 1).concat(error_loaded);
                  break ssr;
                } catch (err) {
                  const e = coalesce_to_error(err);
                  options2.handle_error(e);
                  continue;
                }
              }
            }
            return await respond_with_error({
              request,
              options: options2,
              state,
              $session,
              status,
              error: error3
            });
          }
        }
        if (loaded && loaded.loaded.context) {
          context = {
            ...context,
            ...loaded.loaded.context
          };
        }
      }
    }
  try {
    return await render_response({
      ...opts,
      page_config,
      status,
      error: error3,
      branch: branch.filter(Boolean)
    });
  } catch (err) {
    const error4 = coalesce_to_error(err);
    options2.handle_error(error4);
    return await respond_with_error({
      ...opts,
      status: 500,
      error: error4
    });
  }
}
function get_page_config(leaf, options2) {
  return {
    ssr: "ssr" in leaf ? !!leaf.ssr : options2.ssr,
    router: "router" in leaf ? !!leaf.router : options2.router,
    hydrate: "hydrate" in leaf ? !!leaf.hydrate : options2.hydrate
  };
}
async function render_page(request, route, options2, state) {
  if (state.initiator === route) {
    return {
      status: 404,
      headers: {},
      body: `Not found: ${request.path}`
    };
  }
  const match = route.pattern.exec(request.path);
  const params = route.params(match);
  const page = {
    host: request.host,
    path: request.path,
    query: request.query,
    params
  };
  const $session = await options2.hooks.getSession(request);
  const response = await respond$1({
    request,
    options: options2,
    state,
    $session,
    route,
    page
  });
  if (response) {
    return response;
  }
  if (state.fetched) {
    return {
      status: 500,
      headers: {},
      body: `Bad request in load function: failed to fetch ${state.fetched}`
    };
  }
}
function read_only_form_data() {
  const map = new Map();
  return {
    append(key, value) {
      if (map.has(key)) {
        (map.get(key) || []).push(value);
      } else {
        map.set(key, [value]);
      }
    },
    data: new ReadOnlyFormData(map)
  };
}
var ReadOnlyFormData = class {
  #map;
  constructor(map) {
    this.#map = map;
  }
  get(key) {
    const value = this.#map.get(key);
    return value && value[0];
  }
  getAll(key) {
    return this.#map.get(key);
  }
  has(key) {
    return this.#map.has(key);
  }
  *[Symbol.iterator]() {
    for (const [key, value] of this.#map) {
      for (let i = 0; i < value.length; i += 1) {
        yield [key, value[i]];
      }
    }
  }
  *entries() {
    for (const [key, value] of this.#map) {
      for (let i = 0; i < value.length; i += 1) {
        yield [key, value[i]];
      }
    }
  }
  *keys() {
    for (const [key] of this.#map)
      yield key;
  }
  *values() {
    for (const [, value] of this.#map) {
      for (let i = 0; i < value.length; i += 1) {
        yield value[i];
      }
    }
  }
};
function parse_body(raw, headers) {
  if (!raw || typeof raw !== "string")
    return raw;
  const [type, ...directives] = headers["content-type"].split(/;\s*/);
  switch (type) {
    case "text/plain":
      return raw;
    case "application/json":
      return JSON.parse(raw);
    case "application/x-www-form-urlencoded":
      return get_urlencoded(raw);
    case "multipart/form-data": {
      const boundary = directives.find((directive) => directive.startsWith("boundary="));
      if (!boundary)
        throw new Error("Missing boundary");
      return get_multipart(raw, boundary.slice("boundary=".length));
    }
    default:
      throw new Error(`Invalid Content-Type ${type}`);
  }
}
function get_urlencoded(text) {
  const { data, append } = read_only_form_data();
  text.replace(/\+/g, " ").split("&").forEach((str) => {
    const [key, value] = str.split("=");
    append(decodeURIComponent(key), decodeURIComponent(value));
  });
  return data;
}
function get_multipart(text, boundary) {
  const parts = text.split(`--${boundary}`);
  if (parts[0] !== "" || parts[parts.length - 1].trim() !== "--") {
    throw new Error("Malformed form data");
  }
  const { data, append } = read_only_form_data();
  parts.slice(1, -1).forEach((part) => {
    const match = /\s*([\s\S]+?)\r\n\r\n([\s\S]*)\s*/.exec(part);
    if (!match) {
      throw new Error("Malformed form data");
    }
    const raw_headers = match[1];
    const body = match[2].trim();
    let key;
    const headers = {};
    raw_headers.split("\r\n").forEach((str) => {
      const [raw_header, ...raw_directives] = str.split("; ");
      let [name, value] = raw_header.split(": ");
      name = name.toLowerCase();
      headers[name] = value;
      const directives = {};
      raw_directives.forEach((raw_directive) => {
        const [name2, value2] = raw_directive.split("=");
        directives[name2] = JSON.parse(value2);
      });
      if (name === "content-disposition") {
        if (value !== "form-data")
          throw new Error("Malformed form data");
        if (directives.filename) {
          throw new Error("File upload is not yet implemented");
        }
        if (directives.name) {
          key = directives.name;
        }
      }
    });
    if (!key)
      throw new Error("Malformed form data");
    append(key, body);
  });
  return data;
}
async function respond(incoming, options2, state = {}) {
  if (incoming.path !== "/" && options2.trailing_slash !== "ignore") {
    const has_trailing_slash = incoming.path.endsWith("/");
    if (has_trailing_slash && options2.trailing_slash === "never" || !has_trailing_slash && options2.trailing_slash === "always" && !(incoming.path.split("/").pop() || "").includes(".")) {
      const path = has_trailing_slash ? incoming.path.slice(0, -1) : incoming.path + "/";
      const q = incoming.query.toString();
      return {
        status: 301,
        headers: {
          location: encodeURI(path + (q ? `?${q}` : ""))
        }
      };
    }
  }
  try {
    const headers = lowercase_keys(incoming.headers);
    return await options2.hooks.handle({
      request: {
        ...incoming,
        headers,
        body: parse_body(incoming.rawBody, headers),
        params: {},
        locals: {}
      },
      resolve: async (request) => {
        if (state.prerender && state.prerender.fallback) {
          return await render_response({
            options: options2,
            $session: await options2.hooks.getSession(request),
            page_config: { ssr: false, router: true, hydrate: true },
            status: 200,
            branch: []
          });
        }
        for (const route of options2.manifest.routes) {
          if (!route.pattern.test(request.path))
            continue;
          const response = route.type === "endpoint" ? await render_endpoint(request, route) : await render_page(request, route, options2, state);
          if (response) {
            if (response.status === 200) {
              if (!/(no-store|immutable)/.test(response.headers["cache-control"])) {
                const etag = `"${hash(response.body || "")}"`;
                if (request.headers["if-none-match"] === etag) {
                  return {
                    status: 304,
                    headers: {},
                    body: ""
                  };
                }
                response.headers["etag"] = etag;
              }
            }
            return response;
          }
        }
        const $session = await options2.hooks.getSession(request);
        return await respond_with_error({
          request,
          options: options2,
          state,
          $session,
          status: 404,
          error: new Error(`Not found: ${request.path}`)
        });
      }
    });
  } catch (err) {
    const e = coalesce_to_error(err);
    options2.handle_error(e);
    return {
      status: 500,
      headers: {},
      body: options2.dev ? e.stack : e.message
    };
  }
}

// .svelte-kit/output/server/app.js
function run(fn) {
  return fn();
}
function blank_object() {
  return Object.create(null);
}
function run_all(fns) {
  fns.forEach(run);
}
function custom_event(type, detail, bubbles = false) {
  const e = document.createEvent("CustomEvent");
  e.initCustomEvent(type, bubbles, false, detail);
  return e;
}
var current_component;
function set_current_component(component) {
  current_component = component;
}
function get_current_component() {
  if (!current_component)
    throw new Error("Function called outside component initialization");
  return current_component;
}
function createEventDispatcher() {
  const component = get_current_component();
  return (type, detail) => {
    const callbacks = component.$$.callbacks[type];
    if (callbacks) {
      const event = custom_event(type, detail);
      callbacks.slice().forEach((fn) => {
        fn.call(component, event);
      });
    }
  };
}
function setContext(key, context) {
  get_current_component().$$.context.set(key, context);
}
Promise.resolve();
var escaped2 = {
  '"': "&quot;",
  "'": "&#39;",
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;"
};
function escape2(html) {
  return String(html).replace(/["'&<>]/g, (match) => escaped2[match]);
}
function each(items, fn) {
  let str = "";
  for (let i = 0; i < items.length; i += 1) {
    str += fn(items[i], i);
  }
  return str;
}
var missing_component = {
  $$render: () => ""
};
function validate_component(component, name) {
  if (!component || !component.$$render) {
    if (name === "svelte:component")
      name += " this={...}";
    throw new Error(`<${name}> is not a valid SSR component. You may need to review your build config to ensure that dependencies are compiled, rather than imported as pre-compiled modules`);
  }
  return component;
}
var on_destroy;
function create_ssr_component(fn) {
  function $$render(result, props, bindings, slots, context) {
    const parent_component = current_component;
    const $$ = {
      on_destroy,
      context: new Map(parent_component ? parent_component.$$.context : context || []),
      on_mount: [],
      before_update: [],
      after_update: [],
      callbacks: blank_object()
    };
    set_current_component({ $$ });
    const html = fn(result, props, bindings, slots);
    set_current_component(parent_component);
    return html;
  }
  return {
    render: (props = {}, { $$slots = {}, context = new Map() } = {}) => {
      on_destroy = [];
      const result = { title: "", head: "", css: new Set() };
      const html = $$render(result, props, {}, $$slots, context);
      run_all(on_destroy);
      return {
        html,
        css: {
          code: Array.from(result.css).map((css2) => css2.code).join("\n"),
          map: null
        },
        head: result.title + result.head
      };
    },
    $$render
  };
}
function add_attribute(name, value, boolean) {
  if (value == null || boolean && !value)
    return "";
  return ` ${name}${value === true ? "" : `=${typeof value === "string" ? JSON.stringify(escape2(value)) : `"${value}"`}`}`;
}
function afterUpdate() {
}
var css$4 = {
  code: "#svelte-announcer.svelte-1j55zn5{position:absolute;left:0;top:0;clip:rect(0 0 0 0);clip-path:inset(50%);overflow:hidden;white-space:nowrap;width:1px;height:1px}",
  map: `{"version":3,"file":"root.svelte","sources":["root.svelte"],"sourcesContent":["<!-- This file is generated by @sveltejs/kit \u2014 do not edit it! -->\\n<script>\\n\\timport { setContext, afterUpdate, onMount } from 'svelte';\\n\\n\\t// stores\\n\\texport let stores;\\n\\texport let page;\\n\\n\\texport let components;\\n\\texport let props_0 = null;\\n\\texport let props_1 = null;\\n\\texport let props_2 = null;\\n\\n\\tsetContext('__svelte__', stores);\\n\\n\\t$: stores.page.set(page);\\n\\tafterUpdate(stores.page.notify);\\n\\n\\tlet mounted = false;\\n\\tlet navigated = false;\\n\\tlet title = null;\\n\\n\\tonMount(() => {\\n\\t\\tconst unsubscribe = stores.page.subscribe(() => {\\n\\t\\t\\tif (mounted) {\\n\\t\\t\\t\\tnavigated = true;\\n\\t\\t\\t\\ttitle = document.title || 'untitled page';\\n\\t\\t\\t}\\n\\t\\t});\\n\\n\\t\\tmounted = true;\\n\\t\\treturn unsubscribe;\\n\\t});\\n<\/script>\\n\\n<svelte:component this={components[0]} {...(props_0 || {})}>\\n\\t{#if components[1]}\\n\\t\\t<svelte:component this={components[1]} {...(props_1 || {})}>\\n\\t\\t\\t{#if components[2]}\\n\\t\\t\\t\\t<svelte:component this={components[2]} {...(props_2 || {})}/>\\n\\t\\t\\t{/if}\\n\\t\\t</svelte:component>\\n\\t{/if}\\n</svelte:component>\\n\\n{#if mounted}\\n\\t<div id=\\"svelte-announcer\\" aria-live=\\"assertive\\" aria-atomic=\\"true\\">\\n\\t\\t{#if navigated}\\n\\t\\t\\t{title}\\n\\t\\t{/if}\\n\\t</div>\\n{/if}\\n\\n<style>\\n\\t#svelte-announcer {\\n\\t\\tposition: absolute;\\n\\t\\tleft: 0;\\n\\t\\ttop: 0;\\n\\t\\tclip: rect(0 0 0 0);\\n\\t\\tclip-path: inset(50%);\\n\\t\\toverflow: hidden;\\n\\t\\twhite-space: nowrap;\\n\\t\\twidth: 1px;\\n\\t\\theight: 1px;\\n\\t}\\n</style>"],"names":[],"mappings":"AAsDC,iBAAiB,eAAC,CAAC,AAClB,QAAQ,CAAE,QAAQ,CAClB,IAAI,CAAE,CAAC,CACP,GAAG,CAAE,CAAC,CACN,IAAI,CAAE,KAAK,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CACnB,SAAS,CAAE,MAAM,GAAG,CAAC,CACrB,QAAQ,CAAE,MAAM,CAChB,WAAW,CAAE,MAAM,CACnB,KAAK,CAAE,GAAG,CACV,MAAM,CAAE,GAAG,AACZ,CAAC"}`
};
var Root = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { stores } = $$props;
  let { page } = $$props;
  let { components } = $$props;
  let { props_0 = null } = $$props;
  let { props_1 = null } = $$props;
  let { props_2 = null } = $$props;
  setContext("__svelte__", stores);
  afterUpdate(stores.page.notify);
  if ($$props.stores === void 0 && $$bindings.stores && stores !== void 0)
    $$bindings.stores(stores);
  if ($$props.page === void 0 && $$bindings.page && page !== void 0)
    $$bindings.page(page);
  if ($$props.components === void 0 && $$bindings.components && components !== void 0)
    $$bindings.components(components);
  if ($$props.props_0 === void 0 && $$bindings.props_0 && props_0 !== void 0)
    $$bindings.props_0(props_0);
  if ($$props.props_1 === void 0 && $$bindings.props_1 && props_1 !== void 0)
    $$bindings.props_1(props_1);
  if ($$props.props_2 === void 0 && $$bindings.props_2 && props_2 !== void 0)
    $$bindings.props_2(props_2);
  $$result.css.add(css$4);
  {
    stores.page.set(page);
  }
  return `


${validate_component(components[0] || missing_component, "svelte:component").$$render($$result, Object.assign(props_0 || {}), {}, {
    default: () => `${components[1] ? `${validate_component(components[1] || missing_component, "svelte:component").$$render($$result, Object.assign(props_1 || {}), {}, {
      default: () => `${components[2] ? `${validate_component(components[2] || missing_component, "svelte:component").$$render($$result, Object.assign(props_2 || {}), {}, {})}` : ``}`
    })}` : ``}`
  })}

${``}`;
});
function set_paths(paths) {
}
function set_prerendering(value) {
}
var user_hooks = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module"
});
var template = ({ head, body }) => '<!DOCTYPE html>\n<html lang="en">\n\n<head>\n	<meta charset="utf-8" />\n	<link rel="icon" href="/favicon.svg" />\n	<meta name=apple-mobile-web-app-capable content=yes>\n	<meta name="viewport" content="width=device-width, initial-scale=1" />\n	' + head + '\n</head>\n\n<body>\n	<div id="svelte">' + body + "</div>\n</body>\n\n</html>";
var options = null;
var default_settings = { paths: { "base": "", "assets": "/." } };
function init(settings2 = default_settings) {
  set_paths(settings2.paths);
  set_prerendering(settings2.prerendering || false);
  options = {
    amp: false,
    dev: false,
    entry: {
      file: "/./_app/start-27ac18fc.js",
      css: ["/./_app/assets/start-8077b9bf.css"],
      js: ["/./_app/start-27ac18fc.js", "/./_app/chunks/vendor-f02024c2.js", "/./_app/chunks/singletons-12a22614.js"]
    },
    fetched: void 0,
    floc: false,
    get_component_path: (id) => "/./_app/" + entry_lookup[id],
    get_stack: (error22) => String(error22),
    handle_error: (error22) => {
      if (error22.frame) {
        console.error(error22.frame);
      }
      console.error(error22.stack);
      error22.stack = options.get_stack(error22);
    },
    hooks: get_hooks(user_hooks),
    hydrate: true,
    initiator: void 0,
    load_component,
    manifest,
    paths: settings2.paths,
    prerender: true,
    read: settings2.read,
    root: Root,
    service_worker: null,
    router: true,
    ssr: true,
    target: "#svelte",
    template,
    trailing_slash: "never"
  };
}
var d = decodeURIComponent;
var empty = () => ({});
var manifest = {
  assets: [{ "file": "GoogleLogo.svg", "size": 1307, "type": "image/svg+xml" }, { "file": "add-time.svg", "size": 5945, "type": "image/svg+xml" }, { "file": "add.svg", "size": 1279, "type": "image/svg+xml" }, { "file": "arrow.svg", "size": 1697, "type": "image/svg+xml" }, { "file": "down-arrow.svg", "size": 1548, "type": "image/svg+xml" }, { "file": "favicon.svg", "size": 2033, "type": "image/svg+xml" }, { "file": "home.svg", "size": 1124, "type": "image/svg+xml" }, { "file": "minus-time.svg", "size": 5173, "type": "image/svg+xml" }, { "file": "minus.svg", "size": 1174, "type": "image/svg+xml" }, { "file": "moon.svg", "size": 839, "type": "image/svg+xml" }, { "file": "next-arrow.svg", "size": 1921, "type": "image/svg+xml" }, { "file": "pause-button.svg", "size": 941, "type": "image/svg+xml" }, { "file": "play-button.svg", "size": 960, "type": "image/svg+xml" }, { "file": "settings.svg", "size": 1030, "type": "image/svg+xml" }, { "file": "sort-down.svg", "size": 2092, "type": "image/svg+xml" }, { "file": "stopwatch.svg", "size": 1153, "type": "image/svg+xml" }, { "file": "sun.svg", "size": 4393, "type": "image/svg+xml" }, { "file": "three-dots.svg", "size": 853, "type": "image/svg+xml" }, { "file": "up-arrow.svg", "size": 1538, "type": "image/svg+xml" }, { "file": "vertical-move-white.svg", "size": 1029, "type": "image/svg+xml" }, { "file": "water-bottle.svg", "size": 4614, "type": "image/svg+xml" }],
  layout: "src/routes/__layout.svelte",
  error: ".svelte-kit/build/components/error.svelte",
  routes: [
    {
      type: "page",
      pattern: /^\/$/,
      params: empty,
      a: ["src/routes/__layout.svelte", "src/routes/index.svelte"],
      b: [".svelte-kit/build/components/error.svelte"]
    },
    {
      type: "page",
      pattern: /^\/workoutSettings\/([^/]+?)\/?$/,
      params: (m) => ({ id: d(m[1]) }),
      a: ["src/routes/__layout.svelte", "src/routes/workoutSettings/[id].svelte"],
      b: [".svelte-kit/build/components/error.svelte"]
    },
    {
      type: "page",
      pattern: /^\/settings\/?$/,
      params: empty,
      a: ["src/routes/__layout.svelte", "src/routes/settings.svelte"],
      b: [".svelte-kit/build/components/error.svelte"]
    },
    {
      type: "page",
      pattern: /^\/workout\/([^/]+?)\/?$/,
      params: (m) => ({ id: d(m[1]) }),
      a: ["src/routes/__layout.svelte", "src/routes/workout/[id].svelte"],
      b: [".svelte-kit/build/components/error.svelte"]
    }
  ]
};
var get_hooks = (hooks) => ({
  getSession: hooks.getSession || (() => ({})),
  handle: hooks.handle || (({ request, resolve: resolve2 }) => resolve2(request)),
  serverFetch: hooks.serverFetch || fetch
});
var module_lookup = {
  "src/routes/__layout.svelte": () => Promise.resolve().then(function() {
    return __layout;
  }),
  ".svelte-kit/build/components/error.svelte": () => Promise.resolve().then(function() {
    return error2;
  }),
  "src/routes/index.svelte": () => Promise.resolve().then(function() {
    return index;
  }),
  "src/routes/workoutSettings/[id].svelte": () => Promise.resolve().then(function() {
    return _id_$1;
  }),
  "src/routes/settings.svelte": () => Promise.resolve().then(function() {
    return settings;
  }),
  "src/routes/workout/[id].svelte": () => Promise.resolve().then(function() {
    return _id_;
  })
};
var metadata_lookup = { "src/routes/__layout.svelte": { "entry": "/./_app/pages/__layout.svelte-ae2e2b92.js", "css": ["/./_app/assets/pages/__layout.svelte-3ceacedf.css"], "js": ["/./_app/pages/__layout.svelte-ae2e2b92.js", "/./_app/chunks/vendor-f02024c2.js"], "styles": [] }, ".svelte-kit/build/components/error.svelte": { "entry": "/./_app/error.svelte-eb914159.js", "css": [], "js": ["/./_app/error.svelte-eb914159.js", "/./_app/chunks/vendor-f02024c2.js"], "styles": [] }, "src/routes/index.svelte": { "entry": "/./_app/pages/index.svelte-90242085.js", "css": ["/./_app/assets/pages/index.svelte-c7508dcd.css"], "js": ["/./_app/pages/index.svelte-90242085.js", "/./_app/chunks/vendor-f02024c2.js", "/./_app/chunks/SettingsBar-7a7df0d2.js", "/./_app/chunks/SettingsModal-010b44ad.js", "/./_app/chunks/navigation-2ffed81e.js", "/./_app/chunks/singletons-12a22614.js"], "styles": [] }, "src/routes/workoutSettings/[id].svelte": { "entry": "/./_app/pages/workoutSettings/[id].svelte-0b021c11.js", "css": ["/./_app/assets/pages/workoutSettings/[id].svelte-8963ed56.css"], "js": ["/./_app/pages/workoutSettings/[id].svelte-0b021c11.js", "/./_app/chunks/vendor-f02024c2.js", "/./_app/chunks/colors-a6cc3121.js", "/./_app/chunks/SettingsModal-010b44ad.js", "/./_app/chunks/navigation-2ffed81e.js", "/./_app/chunks/singletons-12a22614.js"], "styles": [] }, "src/routes/settings.svelte": { "entry": "/./_app/pages/settings.svelte-b8792f40.js", "css": [], "js": ["/./_app/pages/settings.svelte-b8792f40.js", "/./_app/chunks/vendor-f02024c2.js", "/./_app/chunks/SettingsBar-7a7df0d2.js"], "styles": [] }, "src/routes/workout/[id].svelte": { "entry": "/./_app/pages/workout/[id].svelte-818e8fde.js", "css": ["/./_app/assets/pages/workout/[id].svelte-24ddd8b1.css"], "js": ["/./_app/pages/workout/[id].svelte-818e8fde.js", "/./_app/chunks/vendor-f02024c2.js", "/./_app/chunks/colors-a6cc3121.js", "/./_app/chunks/navigation-2ffed81e.js", "/./_app/chunks/singletons-12a22614.js"], "styles": [] } };
async function load_component(file) {
  return {
    module: await module_lookup[file](),
    ...metadata_lookup[file]
  };
}
function render(request, {
  prerender
} = {}) {
  const host = request.headers["host"];
  return respond({ ...request, host }, options, { prerender });
}
var css$3 = {
  code: "@tailwind base;@tailwind components;@tailwind utilities;",
  map: '{"version":3,"file":"__layout.svelte","sources":["__layout.svelte"],"sourcesContent":["<div class=\\"w-full min-h-screen bg-bgBlue text-gray-200 flex justify-center \\">\\n\\t<slot />\\n</div>\\n<svelte:head>\\n\\t<title>Calitimer</title>\\n\\t<link rel=\\"preconnect\\" href=\\"https://fonts.googleapis.com\\" />\\n\\t<link rel=\\"preconnect\\" href=\\"https://fonts.gstatic.com\\" crossorigin />\\n\\t<link\\n\\t\\thref=\\"https://fonts.googleapis.com/css2?family=Teko:wght@300;400;500;600;700&display=swap\\"\\n\\t\\trel=\\"stylesheet\\"\\n\\t/>\\n\\t<script\\n\\t\\tsrc=\\"https://cdn.jsdelivr.net/combine/npm/pouchdb@7.2.2/dist/pouchdb.min.js,npm/pouchdb@7.2.2/dist/pouchdb.find.min.js\\"><\/script>\\n</svelte:head>\\n\\n<style lang=\\"postcss\\">\\n\\t@tailwind base;\\n\\t@tailwind components;\\n\\t@tailwind utilities;\\n</style>\\n"],"names":[],"mappings":"AAgBC,UAAU,IAAI,CAAC,AACf,UAAU,UAAU,CAAC,AACrB,UAAU,SAAS,CAAC"}'
};
var _layout = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  $$result.css.add(css$3);
  return `<div class="${"w-full min-h-screen bg-bgBlue text-gray-200 flex justify-center "}">${slots.default ? slots.default({}) : ``}</div>
${$$result.head += `${$$result.title = `<title>Calitimer</title>`, ""}<link rel="${"preconnect"}" href="${"https://fonts.googleapis.com"}" data-svelte="svelte-1bv57yv"><link rel="${"preconnect"}" href="${"https://fonts.gstatic.com"}" crossorigin data-svelte="svelte-1bv57yv"><link href="${"https://fonts.googleapis.com/css2?family=Teko:wght@300;400;500;600;700&display=swap"}" rel="${"stylesheet"}" data-svelte="svelte-1bv57yv"><script src="${"https://cdn.jsdelivr.net/combine/npm/pouchdb@7.2.2/dist/pouchdb.min.js,npm/pouchdb@7.2.2/dist/pouchdb.find.min.js"}" data-svelte="svelte-1bv57yv"><\/script>`, ""}`;
});
var __layout = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": _layout
});
function load$2({ error: error22, status }) {
  return { props: { error: error22, status } };
}
var Error$1 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { status } = $$props;
  let { error: error22 } = $$props;
  if ($$props.status === void 0 && $$bindings.status && status !== void 0)
    $$bindings.status(status);
  if ($$props.error === void 0 && $$bindings.error && error22 !== void 0)
    $$bindings.error(error22);
  return `<h1>${escape2(status)}</h1>

<pre>${escape2(error22.message)}</pre>



${error22.frame ? `<pre>${escape2(error22.frame)}</pre>` : ``}
${error22.stack ? `<pre>${escape2(error22.stack)}</pre>` : ``}`;
});
var error2 = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": Error$1,
  load: load$2
});
var css$2 = {
  code: ".bg-green-transparent.svelte-q12jd4{background-color:rgba(29, 201, 132, 0.3)}",
  map: '{"version":3,"file":"Workout.svelte","sources":["Workout.svelte"],"sourcesContent":["<script lang=\\"ts\\">import { createEventDispatcher } from \'svelte\';\\nconst dispatch = createEventDispatcher();\\nexport let props;\\nlet time = translateTime(props.duration);\\n/* \\tfunction calculateTime(time: number): string {\\n    if (time < 10) {\\n        return `0${time}`;\\n    }\\n    return `${time}`;\\n} */\\nfunction translateTime(time) {\\n    let hours = Math.floor(time / 3600);\\n    let minutes = Math.floor((time - Number(hours) * 3600) / 60);\\n    if (hours === 0)\\n        return `${minutes}min`;\\n    if (minutes === 0)\\n        return `${hours}h`;\\n    return `${hours}h ${minutes}min`;\\n}\\nfunction handleLongPress() {\\n    dispatch(\'longPress\');\\n}\\n<\/script>\\n\\n<div\\n\\tclass=\\"w-full flex justify-between bg-bgBluelight rounded p-3 mb-5\\"\\n\\ton:contextmenu|preventDefault={handleLongPress}\\n>\\n\\t<p class=\\"text-md font-medium translate-y-1\\">{props.name}</p>\\n\\t<div class=\\"flex items-center justify-around\\">\\n\\t\\t<div\\n\\t\\t\\tclass=\\"bg-green-transparent flex  rounded w-auto px-2 py-2 items-center justify-around\\"\\n\\t\\t>\\n\\t\\t\\t<img class=\\"w-3.5 mr-1\\" src=\\" /stopwatch.svg\\" alt=\\"stopwatch\\" />\\n\\t\\t\\t<p class=\\"text-green-500 text-xs \\">{time}</p>\\n\\t\\t</div>\\n\\t\\t<img src=\\" /three-dots.svg\\" alt=\\"Three dots options\\" class=\\"w-4 ml-2\\" on:click />\\n\\t</div>\\n</div>\\n\\n<style>\\n\\t.bg-green-transparent {\\n\\t\\tbackground-color: rgba(29, 201, 132, 0.3);\\n\\t}\\n</style>\\n"],"names":[],"mappings":"AAyCC,qBAAqB,cAAC,CAAC,AACtB,gBAAgB,CAAE,KAAK,EAAE,CAAC,CAAC,GAAG,CAAC,CAAC,GAAG,CAAC,CAAC,GAAG,CAAC,AAC1C,CAAC"}'
};
function translateTime$2(time) {
  let hours = Math.floor(time / 3600);
  let minutes = Math.floor((time - Number(hours) * 3600) / 60);
  if (hours === 0)
    return `${minutes}min`;
  if (minutes === 0)
    return `${hours}h`;
  return `${hours}h ${minutes}min`;
}
var Workout = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  createEventDispatcher();
  let { props } = $$props;
  let time = translateTime$2(props.duration);
  if ($$props.props === void 0 && $$bindings.props && props !== void 0)
    $$bindings.props(props);
  $$result.css.add(css$2);
  return `<div class="${"w-full flex justify-between bg-bgBluelight rounded p-3 mb-5"}"><p class="${"text-md font-medium translate-y-1"}">${escape2(props.name)}</p>
	<div class="${"flex items-center justify-around"}"><div class="${"bg-green-transparent flex  rounded w-auto px-2 py-2 items-center justify-around svelte-q12jd4"}"><img class="${"w-3.5 mr-1"}" src="${" /stopwatch.svg"}" alt="${"stopwatch"}">
			<p class="${"text-green-500 text-xs "}">${escape2(time)}</p></div>
		<img src="${" /three-dots.svg"}" alt="${"Three dots options"}" class="${"w-4 ml-2"}"></div>
</div>`;
});
var SettingsBar = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { settings: settings2 = false } = $$props;
  if ($$props.settings === void 0 && $$bindings.settings && settings2 !== void 0)
    $$bindings.settings(settings2);
  return `<div class="${"w-full h-11 bg-bgBluedark flex items-center justify-around"}"><a href="${"/"}"><img src="${" /home.svg"}" alt="${"Home button"}"${add_attribute("class", settings2 === true ? "w-5 opacity-75" : "w-6", 0)}></a>
	<a href="${"/settings"}"><img src="${" /settings.svg"}" alt="${"Settings button"}"${add_attribute("class", settings2 === false ? "w-5 opacity-75" : "w-7", 0)}></a></div>`;
});
var BallMenu = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  createEventDispatcher();
  let { firstBallText } = $$props;
  let { secondBallText = "" } = $$props;
  if ($$props.firstBallText === void 0 && $$bindings.firstBallText && firstBallText !== void 0)
    $$bindings.firstBallText(firstBallText);
  if ($$props.secondBallText === void 0 && $$bindings.secondBallText && secondBallText !== void 0)
    $$bindings.secondBallText(secondBallText);
  return `<div class="${" fixed bottom-14 right-8 flex flex-col-reverse items-end"}"><div class="${"w-11 h-11 mt-3 bg-red-500 flex items-center justify-center rounded-full drop-shadow-2xl "}"><img class="${["w-5 transition duration-100 ease-in-out", ""].join(" ").trim()}" alt="${"Add menu"}" src="${" /add.svg"}"></div>
	${``}</div>`;
});
var Routes = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let workouts = [];
  return `<main class="${"w-full"}"><div class="${"flex items-center justify-center p-4 text-2xl"}"><p class="${"text-md"}">My Workouts</p>
		</div>
	<div class="${"w-full px-5"}">${each(workouts, (w) => `<a href="${"/workout/" + escape2(w._id)}">${validate_component(Workout, "Workout").$$render($$result, { props: w }, {}, {})}
			</a>`)}</div>
	<nav class="${"fixed bottom-0 w-full"}">${validate_component(SettingsBar, "SettingsBar").$$render($$result, { settings: false }, {}, {})}</nav>
	${validate_component(BallMenu, "BallMenu").$$render($$result, { firstBallText: "Create workout" }, {}, {})}</main>
${``}`;
});
var index = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": Routes
});
var colorsArray = [
  "#1DC984",
  "#3D6CB9",
  "#86A6DF",
  "#C779D0",
  "#ED5151",
  "#F67E7D",
  "#FACF5A",
  "#FF9F68"
];
var Colors;
(function(Colors2) {
  Colors2[Colors2["green"] = 0] = "green";
  Colors2[Colors2["darkBlue"] = 1] = "darkBlue";
  Colors2[Colors2["lightBlue"] = 2] = "lightBlue";
  Colors2[Colors2["purple"] = 3] = "purple";
  Colors2[Colors2["red"] = 4] = "red";
  Colors2[Colors2["pink"] = 5] = "pink";
  Colors2[Colors2["yellow"] = 6] = "yellow";
  Colors2[Colors2["orange"] = 7] = "orange";
})(Colors || (Colors = {}));
var css$1 = {
  code: ".group.svelte-1qvf1cu{background-color:var(--bgColor)}.circle.svelte-1qvf1cu{background-color:var(--bgColor)}",
  map: '{"version":3,"file":"Exercise.svelte","sources":["Exercise.svelte"],"sourcesContent":["<script lang=\\"ts\\">import { colorsArray } from \'../colors\';\\nimport { createEventDispatcher } from \'svelte\';\\nconst dispatch = createEventDispatcher();\\nexport let props = {\\n    name: \'Untitled\',\\n    color: 6,\\n    isRest: false,\\n    repsMode: false,\\n    reps: 5,\\n    time: 20\\n};\\nexport let isGroup = false;\\n$: bgColor = colorsArray[props.color];\\nfunction calculateTime(time) {\\n    if (time < 10) {\\n        return `0${time}`;\\n    }\\n    return `${time}`;\\n}\\nfunction translateTime(time) {\\n    let minutes = calculateTime(Math.floor(time / 60));\\n    let seconds = calculateTime(time % 60);\\n    return `${minutes}:${seconds}`;\\n}\\n$: time = translateTime(props.time);\\nfunction handleLongPress() {\\n    dispatch(\'longPress\');\\n}\\n<\/script>\\n\\n<div\\n\\tclass=\\"w-full h-12 px-4 flex flex-row items-center rounded \\"\\n\\tclass:group={isGroup}\\n\\tstyle=\\"--bgColor: {bgColor}\\"\\n\\ton:contextmenu|preventDefault={handleLongPress}\\n>\\n\\t<div class=\\"w-full flex items-center\\">\\n\\t\\t<div>\\n\\t\\t\\t{#if !isGroup}\\n\\t\\t\\t\\t<div class=\\"circle w-8 h-8 rounded-full mr-4\\" style=\\"--bgColor: {bgColor}\\" />\\n\\t\\t\\t{/if}\\n\\t\\t</div>\\n\\t\\t<p class=\\"text-md\\">{props.name}</p>\\n\\t</div>\\n\\t<p class=\\"text-gray-300\\">{time}</p>\\n\\t<div class=\\"w-6 ml-4 opacity-75\\">\\n\\t\\t<img src=\\" /vertical-move-white.svg\\" alt=\\"\\" />\\n\\t</div>\\n</div>\\n\\n<style>\\n\\t.group {\\n\\t\\tbackground-color: var(--bgColor);\\n\\t}\\n\\t.circle {\\n\\t\\tbackground-color: var(--bgColor);\\n\\t}\\n</style>\\n"],"names":[],"mappings":"AAmDC,MAAM,eAAC,CAAC,AACP,gBAAgB,CAAE,IAAI,SAAS,CAAC,AACjC,CAAC,AACD,OAAO,eAAC,CAAC,AACR,gBAAgB,CAAE,IAAI,SAAS,CAAC,AACjC,CAAC"}'
};
var Exercise = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let bgColor;
  let time;
  createEventDispatcher();
  let { props = {
    name: "Untitled",
    color: 6,
    isRest: false,
    repsMode: false,
    reps: 5,
    time: 20
  } } = $$props;
  let { isGroup = false } = $$props;
  function calculateTime2(time2) {
    if (time2 < 10) {
      return `0${time2}`;
    }
    return `${time2}`;
  }
  function translateTime2(time2) {
    let minutes = calculateTime2(Math.floor(time2 / 60));
    let seconds = calculateTime2(time2 % 60);
    return `${minutes}:${seconds}`;
  }
  if ($$props.props === void 0 && $$bindings.props && props !== void 0)
    $$bindings.props(props);
  if ($$props.isGroup === void 0 && $$bindings.isGroup && isGroup !== void 0)
    $$bindings.isGroup(isGroup);
  $$result.css.add(css$1);
  bgColor = colorsArray[props.color];
  time = translateTime2(props.time);
  return `<div class="${[
    "w-full h-12 px-4 flex flex-row items-center rounded  svelte-1qvf1cu",
    isGroup ? "group" : ""
  ].join(" ").trim()}" style="${"--bgColor: " + escape2(bgColor)}"><div class="${"w-full flex items-center"}"><div>${!isGroup ? `<div class="${"circle w-8 h-8 rounded-full mr-4 svelte-1qvf1cu"}" style="${"--bgColor: " + escape2(bgColor)}"></div>` : ``}</div>
		<p class="${"text-md"}">${escape2(props.name)}</p></div>
	<p class="${"text-gray-300"}">${escape2(time)}</p>
	<div class="${"w-6 ml-4 opacity-75"}"><img src="${" /vertical-move-white.svg"}" alt="${""}"></div>
</div>`;
});
var NumberCounter = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { counter = 3 } = $$props;
  if ($$props.counter === void 0 && $$bindings.counter && counter !== void 0)
    $$bindings.counter(counter);
  return `<div class="${"w-full flex flex-col items-center "}"><div class="${"flex items-center"}"><img src="${" /minus.svg"}" alt="${"Minus sign"}" class="${"w-5"}">
		<p class="${"text-3xl font-semibold mx-5"}">x<input type="${"text"}" class="${"w-10 ml-1 border-b border-gray-400 outline-none bg-transparent text-center font-semibold text-3xl"}"${add_attribute("value", counter, 0)}></p>
		<img src="${" /add.svg"}" alt="${"Add sign"}" class="${"w-5"}"></div></div>`;
});
function overrideItemIdKeyNameBeforeInitialisingDndZones(newKeyName) {
  if (typeof newKeyName !== "string") {
    throw new Error("item id key has to be a string");
  }
}
var isOnServer = typeof window === "undefined";
var INSTRUCTION_IDs = {
  DND_ZONE_ACTIVE: "dnd-zone-active",
  DND_ZONE_DRAG_DISABLED: "dnd-zone-drag-disabled"
};
var ID_TO_INSTRUCTION = {
  [INSTRUCTION_IDs.DND_ZONE_ACTIVE]: "Tab to one the items and press space-bar or enter to start dragging it",
  [INSTRUCTION_IDs.DND_ZONE_DRAG_DISABLED]: "This is a disabled drag and drop list"
};
var ALERT_DIV_ID = "dnd-action-aria-alert";
var alertsDiv;
function initAriaOnBrowser() {
  alertsDiv = document.createElement("div");
  (function initAlertsDiv() {
    alertsDiv.id = ALERT_DIV_ID;
    alertsDiv.style.position = "fixed";
    alertsDiv.style.bottom = "0";
    alertsDiv.style.left = "0";
    alertsDiv.style.zIndex = "-5";
    alertsDiv.style.opacity = "0";
    alertsDiv.style.height = "0";
    alertsDiv.style.width = "0";
    alertsDiv.setAttribute("role", "alert");
  })();
  document.body.prepend(alertsDiv);
  Object.entries(ID_TO_INSTRUCTION).forEach(([id, txt]) => document.body.prepend(instructionToHiddenDiv(id, txt)));
}
function initAria() {
  if (isOnServer)
    return null;
  if (document.readyState === "complete") {
    initAriaOnBrowser();
  } else {
    window.addEventListener("DOMContentLoaded", initAriaOnBrowser);
  }
  return { ...INSTRUCTION_IDs };
}
function instructionToHiddenDiv(id, txt) {
  const div = document.createElement("div");
  div.id = id;
  div.innerHTML = `<p>${txt}</p>`;
  div.style.display = "none";
  div.style.position = "fixed";
  div.style.zIndex = "-5";
  return div;
}
initAria();
function load$1({ page }) {
  const { id } = page.params;
  return { props: { id } };
}
function calculateTime$1(time) {
  if (time < 10) {
    return `0${time}`;
  }
  return `${time}`;
}
function translateTime$1(time) {
  let hours = calculateTime$1(Math.floor(time / 3600));
  let minutes = calculateTime$1(Math.floor((time - Number(hours) * 3600) / 60));
  let seconds = calculateTime$1(time % 60);
  return `${hours}:${minutes}:${seconds}`;
}
var U5Bidu5D$1 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let workoutTime;
  (function(thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P ? value : new P(function(resolve2) {
        resolve2(value);
      });
    }
    return new (P || (P = Promise))(function(resolve2, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done ? resolve2(result.value) : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  });
  let { id } = $$props;
  let workoutName;
  let workoutLaps;
  overrideItemIdKeyNameBeforeInitialisingDndZones("_id");
  let exercises = [];
  let workoutDurationOneLap = 0;
  let workoutDuration = 0;
  if ($$props.id === void 0 && $$bindings.id && id !== void 0)
    $$bindings.id(id);
  let $$settled;
  let $$rendered;
  do {
    $$settled = true;
    workoutDuration = workoutLaps * workoutDurationOneLap;
    workoutTime = translateTime$1(workoutDuration);
    $$rendered = `<div class="${"flex flex-col text-gray-200 w-full min-h-screen mx-auto items-center"}"><div class="${"w-full mt-3 px-3 flex flex-col "}"><div class="${"w-full grid grid-cols-2"}"><div class="${"flex items-center justify-start"}"><img src="${" /arrow.svg"}" alt="${"go back arrow"}" class="${"w-5"}"></div>
			<div class="${"flex justify-end items-center"}"><p class="${"text-sm uppercase"}">save</p></div></div>
		<div class="${"w-full flex items-center justify-center py-2"}"><input type="${"text"}" placeholder="${"Workout Title"}" class="${"border-b border-red-500 outline-none bg-transparent text-center font-semibold"}"${add_attribute("value", workoutName, 0)}></div></div>
	<div class="${"w-full flex items-center justify-center flex-col my-4"}"><p class="${"text-xs uppercase text-gray-400"}">duration</p>
		<p class="${"font-teko text-3xl"}">${escape2(workoutTime)}</p></div>
	<div class="${"w-full border-b border-red-500 flex justify-center px-4"}"><input type="${"text"}" placeholder="${"Enter description"}" class="${"outline-none bg-transparent text-center w-full"}"></div>
	<div class="${"w-full bg-bgBlue flex items-center justify-between px-4 sticky top-0"}"><p class="${"text-md my-4"}">Exercises</p>
		<div class="${"flex items-center"}"><div class="${" w-20 rounded-full p-0.5 flex items-center " + escape2(" bg-red-900")}"><div class="${" rounded-full px-1.5 " + escape2("bg-red-500")}"><p class="${"text-sm"}">Drag</p></div></div></div></div>
	<div class="${"w-full"}">${each(exercises, (e) => `<div class="${"outline-none border-none select-none"}">${validate_component(Exercise, "Exercise").$$render($$result, { props: e }, {}, {})}
			</div>`)}</div>
	${validate_component(NumberCounter, "NumberCounter").$$render($$result, { counter: workoutLaps }, {
      counter: ($$value) => {
        workoutLaps = $$value;
        $$settled = false;
      }
    }, {})}
	${``}
	${`${validate_component(BallMenu, "BallMenu").$$render($$result, {
      firstBallText: "Add exercise",
      secondBallText: "Add break"
    }, {}, {})}`}
	${``}</div>`;
  } while (!$$settled);
  return $$rendered;
});
var _id_$1 = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": U5Bidu5D$1,
  load: load$1
});
var Slider = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { name } = $$props;
  let { value = 1 } = $$props;
  let { min = "0.5" } = $$props;
  let { max = "2" } = $$props;
  let { step = "0.1" } = $$props;
  if ($$props.name === void 0 && $$bindings.name && name !== void 0)
    $$bindings.name(name);
  if ($$props.value === void 0 && $$bindings.value && value !== void 0)
    $$bindings.value(value);
  if ($$props.min === void 0 && $$bindings.min && min !== void 0)
    $$bindings.min(min);
  if ($$props.max === void 0 && $$bindings.max && max !== void 0)
    $$bindings.max(max);
  if ($$props.step === void 0 && $$bindings.step && step !== void 0)
    $$bindings.step(step);
  return `<div class="${"flex items-center justify-between w-full "}"><div><label${add_attribute("for", name, 0)}>${escape2(name)}</label>
		<input type="${"range"}"${add_attribute("min", min, 0)}${add_attribute("max", max, 0)}${add_attribute("step", step, 0)}${add_attribute("value", value, 0)}></div>
	<p class="${"text-md"}">${escape2(value)}</p></div>`;
});
var VoiceSettings = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { rate = 1 } = $$props;
  let { pitch = 1 } = $$props;
  if ($$props.rate === void 0 && $$bindings.rate && rate !== void 0)
    $$bindings.rate(rate);
  if ($$props.pitch === void 0 && $$bindings.pitch && pitch !== void 0)
    $$bindings.pitch(pitch);
  let $$settled;
  let $$rendered;
  do {
    $$settled = true;
    $$rendered = `<div class="${"w-full flex flex-col items-center"}">${validate_component(Slider, "Slider").$$render($$result, { name: "Speed", min: "0.5", value: rate }, {
      value: ($$value) => {
        rate = $$value;
        $$settled = false;
      }
    }, {})}
	${validate_component(Slider, "Slider").$$render($$result, { name: "Pitch", min: "0", value: pitch }, {
      value: ($$value) => {
        pitch = $$value;
        $$settled = false;
      }
    }, {})}</div>`;
  } while (!$$settled);
  return $$rendered;
});
var ThemeButton = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { isDark = false } = $$props;
  let props;
  isDark ? props = {
    color: "bg-black",
    image: "moon",
    width: "w-6",
    text: "Dark"
  } : props = {
    color: "bg-orange",
    image: "sun",
    width: "w-7",
    text: "Light"
  };
  let { isDisabled = false } = $$props;
  if ($$props.isDark === void 0 && $$bindings.isDark && isDark !== void 0)
    $$bindings.isDark(isDark);
  if ($$props.isDisabled === void 0 && $$bindings.isDisabled && isDisabled !== void 0)
    $$bindings.isDisabled(isDisabled);
  return `<div class="${"w-16 h-16 p-2 rounded-lg flex flex-col items-center justify-around " + escape2(props.color) + " " + escape2(isDisabled ? "filter grayscale bg-orange" : "")}"><img${add_attribute("class", props.width, 0)} src="${" /" + escape2(props.image) + ".svg"}" alt="${"moon icon"}">
	<p class="${"text-xs"}">${escape2(props.text)}</p></div>`;
});
var ThemeSettings = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { darkTheme = true } = $$props;
  if ($$props.darkTheme === void 0 && $$bindings.darkTheme && darkTheme !== void 0)
    $$bindings.darkTheme(darkTheme);
  return `<div class="${"w-3/4 flex items-center justify-around mx-auto my-3"}">${validate_component(ThemeButton, "ThemeButton").$$render($$result, { isDark: true, isDisabled: !darkTheme }, {}, {})}
	${validate_component(ThemeButton, "ThemeButton").$$render($$result, { isDark: false, isDisabled: darkTheme }, {}, {})}</div>`;
});
var Settings = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  (function(thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P ? value : new P(function(resolve2) {
        resolve2(value);
      });
    }
    return new (P || (P = Promise))(function(resolve2, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done ? resolve2(result.value) : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  });
  let darkTheme;
  let pitch;
  let rate;
  let $$settled;
  let $$rendered;
  do {
    $$settled = true;
    $$rendered = `<div class="${"w-10/12"}"><div class="${"w-full mt-3 flex items-center justify-end"}"><p class="${"text-sm uppercase px-3 py-0.5 bg-red-500 rounded-full "}">Save
		</p></div>
	<div class="${"w-full flex items-center justify-center mt-3"}"><h1 class="${"text-3xl"}">Settings</h1></div>
	<div class="${"w-full"}"><h2 class="${"text-xl"}">Theme</h2>
		${validate_component(ThemeSettings, "ThemeSettings").$$render($$result, { darkTheme }, {
      darkTheme: ($$value) => {
        darkTheme = $$value;
        $$settled = false;
      }
    }, {})}
		<p class="${"text-xs text-center"}">Theme only changes during workout</p></div>
	<div class="${"w-full mt-4"}"><h2 class="${"text-xl mb-3"}">Voice settings</h2>
		${validate_component(VoiceSettings, "VoiceSettings").$$render($$result, { pitch, rate }, {
      pitch: ($$value) => {
        pitch = $$value;
        $$settled = false;
      },
      rate: ($$value) => {
        rate = $$value;
        $$settled = false;
      }
    }, {})}</div>
	${``}</div>
<nav class="${"fixed bottom-0 w-full"}">${validate_component(SettingsBar, "SettingsBar").$$render($$result, { settings: true }, {}, {})}</nav>`;
  } while (!$$settled);
  return $$rendered;
});
var settings = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": Settings
});
var Playnav = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let playButton;
  createEventDispatcher();
  let { timeRunning = false } = $$props;
  if ($$props.timeRunning === void 0 && $$bindings.timeRunning && timeRunning !== void 0)
    $$bindings.timeRunning(timeRunning);
  playButton = !timeRunning ? " /play-button.svg" : " /pause-button.svg";
  return `<div class="${"w-full flex items center justify-around pt-5 fixed bottom-0 pb-5"}"><img src="${" /next-arrow.svg"}" alt="${"Next exercise button"}" class="${"w-6 cursor-pointer transform rotate-180"}">
	<img${add_attribute("src", playButton, 0)} alt="${"Play Button"}" class="${"w-10 cursor-pointer active:scale-90"}">
	<img src="${" /next-arrow.svg"}" alt="${"Next exercise button"}" class="${"w-6 cursor-pointer"}"></div>`;
});
var StatsText = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { props } = $$props;
  if ($$props.props === void 0 && $$bindings.props && props !== void 0)
    $$bindings.props(props);
  return `<div class="${"flex flex-col items-" + escape2(props.position)}"><p class="${"text-sm text-gray-400 uppercase"}">${escape2(props.statName)}</p>
	<p class="${"text-3xl font-teko text-gray-200 uppecase"}">${escape2(props.statContent)}</p></div>`;
});
var css = {
  code: ".svg-wrapper.svelte-gs4z9x{min-width:250px;min-height:250px;max-width:400px;max-height:400px}.svg.svelte-gs4z9x{height:var(--height);max-width:400px;max-height:400px}.circle.svelte-gs4z9x{fill:none;stroke:#191919;stroke-width:10;stroke-linecap:round}.circle-1.svelte-gs4z9x{stroke:var(--color)}.circle-2.svelte-gs4z9x{stroke-dashoffset:var(--dashoffset);stroke-dasharray:var(--circunference);stroke:var(--color)}.circle-3.svelte-gs4z9x{stroke-width:13;stroke-dashoffset:var(--dashoffset);stroke-dasharray:var(--circunference);stroke:var(--color)}.text-container.svelte-gs4z9x{width:var(--width);height:var(--width)}",
  map: `{"version":3,"file":"Timer.svelte","sources":["Timer.svelte"],"sourcesContent":["<script lang=\\"ts\\">import { colorsArray } from '../colors';\\nexport let timerText = '01:10';\\nlet svgHeight = 280;\\nexport let percentageInner = 0;\\nexport let percentageOuter = 0;\\nexport let colors = { c1: '#344568', c2: '#83D9C1', c3: '#D84F50' };\\nexport let exerciseProps = {};\\n$: innerColor = colorsArray[exerciseProps.color];\\n$: radius = svgHeight / 2 - 20;\\n$: radiusInner = radius - 20;\\n$: circunference = radius * Math.PI * 2;\\n$: circunferenceInner = radiusInner * Math.PI * 2;\\n$: dashoffset = circunference - (circunference * percentageOuter) / 100;\\n$: dashoffsetInner = circunferenceInner - (circunferenceInner * percentageInner) / 100;\\n$: textWidth = Math.sqrt(2 * Math.pow(radiusInner, 2)) - 10;\\n<\/script>\\n\\n<div class=\\"relative w-10/12 mx-auto flex items-center justify-center\\" on:click>\\n\\t<div\\n\\t\\tbind:clientWidth={svgHeight}\\n\\t\\tclass=\\"svg-wrapper w-full mx-auto flex items-center justify-center -rotate-90\\"\\n\\t>\\n\\t\\t<svg class=\\"svg w-full h-auto\\" style=\\"--height: {svgHeight}px\\">\\n\\t\\t\\t<circle\\n\\t\\t\\t\\tclass=\\"circle circle-1\\"\\n\\t\\t\\t\\tcx={svgHeight / 2}\\n\\t\\t\\t\\tcy={svgHeight / 2}\\n\\t\\t\\t\\tr={radius}\\n\\t\\t\\t\\tstyle=\\"--color: {colors.c1}\\"\\n\\t\\t\\t/>\\n\\t\\t\\t<circle\\n\\t\\t\\t\\tclass=\\"circle circle-2\\"\\n\\t\\t\\t\\tcx={svgHeight / 2}\\n\\t\\t\\t\\tcy={svgHeight / 2}\\n\\t\\t\\t\\tr={radius}\\n\\t\\t\\t\\tstyle=\\" --color: {colors.c2}; --circunference: {circunference}; --dashoffset: {dashoffset}\\"\\n\\t\\t\\t/>\\n\\t\\t\\t<circle\\n\\t\\t\\t\\tclass=\\"circle circle-3\\"\\n\\t\\t\\t\\tcx={svgHeight / 2}\\n\\t\\t\\t\\tcy={svgHeight / 2}\\n\\t\\t\\t\\tr={radiusInner}\\n\\t\\t\\t\\tstyle=\\" --color: {innerColor}; --circunference: {circunferenceInner}; --dashoffset: {dashoffsetInner}\\"\\n\\t\\t\\t/>\\n\\t\\t</svg>\\n\\t</div>\\n\\t<div\\n\\t\\tclass=\\"text-container absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col\\"\\n\\t\\tstyle=\\"--width: {textWidth}px\\"\\n\\t>\\n\\t\\t<div class=\\"w-full h-3/4 flex items-center justify-center\\">\\n\\t\\t\\t<p class=\\"text-2xl xs:text-3xl font-roboto text-center\\">{exerciseProps.name}</p>\\n\\t\\t</div>\\n\\t\\t<div class=\\"w-full h-1/4 flex justify-around items-end\\">\\n\\t\\t\\t{#if exerciseProps.repsMode}\\n\\t\\t\\t\\t<p class=\\"text-3xl xxs:text-4xl font-teko\\">x{exerciseProps.reps}</p>\\n\\t\\t\\t{/if}\\n\\t\\t\\t<p class=\\"text-3xl xxs:text-4xl font-teko\\">{timerText}</p>\\n\\t\\t</div>\\n\\t</div>\\n</div>\\n\\n<style>\\n\\t.svg-wrapper {\\n\\t\\tmin-width: 250px;\\n\\t\\tmin-height: 250px;\\n\\t\\tmax-width: 400px;\\n\\t\\tmax-height: 400px;\\n\\t}\\n\\t.svg {\\n\\t\\t/* \\t\\ttransform: rotate(180deg); */\\n\\t\\theight: var(--height);\\n\\t\\tmax-width: 400px;\\n\\t\\tmax-height: 400px;\\n\\t}\\n\\t.circle {\\n\\t\\tfill: none;\\n\\t\\tstroke: #191919;\\n\\t\\tstroke-width: 10;\\n\\t\\tstroke-linecap: round;\\n\\t}\\n\\t.circle-1 {\\n\\t\\tstroke: var(--color);\\n\\t}\\n\\t.circle-2 {\\n\\t\\tstroke-dashoffset: var(--dashoffset);\\n\\t\\tstroke-dasharray: var(--circunference);\\n\\t\\t/* \\t\\tstroke-dashoffset: var(--circunference); */\\n\\t\\tstroke: var(--color);\\n\\t}\\n\\t.circle-3 {\\n\\t\\tstroke-width: 13;\\n\\t\\tstroke-dashoffset: var(--dashoffset);\\n\\t\\tstroke-dasharray: var(--circunference);\\n\\t\\t/* \\t\\tstroke-dashoffset: var(--circunference); */\\n\\t\\tstroke: var(--color);\\n\\t}\\n\\t.text-container {\\n\\t\\twidth: var(--width);\\n\\t\\theight: var(--width);\\n\\t}\\n</style>\\n"],"names":[],"mappings":"AA+DC,YAAY,cAAC,CAAC,AACb,SAAS,CAAE,KAAK,CAChB,UAAU,CAAE,KAAK,CACjB,SAAS,CAAE,KAAK,CAChB,UAAU,CAAE,KAAK,AAClB,CAAC,AACD,IAAI,cAAC,CAAC,AAEL,MAAM,CAAE,IAAI,QAAQ,CAAC,CACrB,SAAS,CAAE,KAAK,CAChB,UAAU,CAAE,KAAK,AAClB,CAAC,AACD,OAAO,cAAC,CAAC,AACR,IAAI,CAAE,IAAI,CACV,MAAM,CAAE,OAAO,CACf,YAAY,CAAE,EAAE,CAChB,cAAc,CAAE,KAAK,AACtB,CAAC,AACD,SAAS,cAAC,CAAC,AACV,MAAM,CAAE,IAAI,OAAO,CAAC,AACrB,CAAC,AACD,SAAS,cAAC,CAAC,AACV,iBAAiB,CAAE,IAAI,YAAY,CAAC,CACpC,gBAAgB,CAAE,IAAI,eAAe,CAAC,CAEtC,MAAM,CAAE,IAAI,OAAO,CAAC,AACrB,CAAC,AACD,SAAS,cAAC,CAAC,AACV,YAAY,CAAE,EAAE,CAChB,iBAAiB,CAAE,IAAI,YAAY,CAAC,CACpC,gBAAgB,CAAE,IAAI,eAAe,CAAC,CAEtC,MAAM,CAAE,IAAI,OAAO,CAAC,AACrB,CAAC,AACD,eAAe,cAAC,CAAC,AAChB,KAAK,CAAE,IAAI,OAAO,CAAC,CACnB,MAAM,CAAE,IAAI,OAAO,CAAC,AACrB,CAAC"}`
};
var Timer = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let innerColor;
  let radius;
  let radiusInner;
  let circunference;
  let circunferenceInner;
  let dashoffset;
  let dashoffsetInner;
  let textWidth;
  let { timerText = "01:10" } = $$props;
  let svgHeight = 280;
  let { percentageInner = 0 } = $$props;
  let { percentageOuter = 0 } = $$props;
  let { colors = {
    c1: "#344568",
    c2: "#83D9C1",
    c3: "#D84F50"
  } } = $$props;
  let { exerciseProps = {} } = $$props;
  if ($$props.timerText === void 0 && $$bindings.timerText && timerText !== void 0)
    $$bindings.timerText(timerText);
  if ($$props.percentageInner === void 0 && $$bindings.percentageInner && percentageInner !== void 0)
    $$bindings.percentageInner(percentageInner);
  if ($$props.percentageOuter === void 0 && $$bindings.percentageOuter && percentageOuter !== void 0)
    $$bindings.percentageOuter(percentageOuter);
  if ($$props.colors === void 0 && $$bindings.colors && colors !== void 0)
    $$bindings.colors(colors);
  if ($$props.exerciseProps === void 0 && $$bindings.exerciseProps && exerciseProps !== void 0)
    $$bindings.exerciseProps(exerciseProps);
  $$result.css.add(css);
  innerColor = colorsArray[exerciseProps.color];
  radius = svgHeight / 2 - 20;
  radiusInner = radius - 20;
  circunference = radius * Math.PI * 2;
  circunferenceInner = radiusInner * Math.PI * 2;
  dashoffset = circunference - circunference * percentageOuter / 100;
  dashoffsetInner = circunferenceInner - circunferenceInner * percentageInner / 100;
  textWidth = Math.sqrt(2 * Math.pow(radiusInner, 2)) - 10;
  return `<div class="${"relative w-10/12 mx-auto flex items-center justify-center"}"><div class="${"svg-wrapper w-full mx-auto flex items-center justify-center -rotate-90 svelte-gs4z9x"}"><svg class="${"svg w-full h-auto svelte-gs4z9x"}" style="${"--height: " + escape2(svgHeight) + "px"}"><circle class="${"circle circle-1 svelte-gs4z9x"}"${add_attribute("cx", svgHeight / 2, 0)}${add_attribute("cy", svgHeight / 2, 0)}${add_attribute("r", radius, 0)} style="${"--color: " + escape2(colors.c1)}"></circle><circle class="${"circle circle-2 svelte-gs4z9x"}"${add_attribute("cx", svgHeight / 2, 0)}${add_attribute("cy", svgHeight / 2, 0)}${add_attribute("r", radius, 0)} style="${" --color: " + escape2(colors.c2) + "; --circunference: " + escape2(circunference) + "; --dashoffset: " + escape2(dashoffset)}"></circle><circle class="${"circle circle-3 svelte-gs4z9x"}"${add_attribute("cx", svgHeight / 2, 0)}${add_attribute("cy", svgHeight / 2, 0)}${add_attribute("r", radiusInner, 0)} style="${" --color: " + escape2(innerColor) + "; --circunference: " + escape2(circunferenceInner) + "; --dashoffset: " + escape2(dashoffsetInner)}"></circle></svg></div>
	<div class="${"text-container absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col svelte-gs4z9x"}" style="${"--width: " + escape2(textWidth) + "px"}"><div class="${"w-full h-3/4 flex items-center justify-center"}"><p class="${"text-2xl xs:text-3xl font-roboto text-center"}">${escape2(exerciseProps.name)}</p></div>
		<div class="${"w-full h-1/4 flex justify-around items-end"}">${exerciseProps.repsMode ? `<p class="${"text-3xl xxs:text-4xl font-teko"}">x${escape2(exerciseProps.reps)}</p>` : ``}
			<p class="${"text-3xl xxs:text-4xl font-teko"}">${escape2(timerText)}</p></div></div>
</div>`;
});
var TopNavbar = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  createEventDispatcher();
  let { name = "Workout" } = $$props;
  if ($$props.name === void 0 && $$bindings.name && name !== void 0)
    $$bindings.name(name);
  return `<nav class="${"w-full grid grid-cols-2"}"><div class="${"flex items-center justify-start"}"><img src="${"/arrow.svg"}" alt="${"go back arrow"}" class="${"w-5"}"></div>
	<div class="${"flex justify-end items-center"}"><p class="${"text-xl "}">${escape2(name)}</p></div></nav>`;
});
function load({ page }) {
  const { id } = page.params;
  return { props: { id } };
}
function calculateTime(time) {
  if (time < 10) {
    return `0${time}`;
  }
  return `${time}`;
}
function translateTime(time) {
  let minutes = calculateTime(Math.floor(time / 60));
  let seconds = calculateTime(time % 60);
  return `${minutes}:${seconds}`;
}
var U5Bidu5D = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let elapsedTimeText;
  let timeLeftText;
  (function(thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P ? value : new P(function(resolve2) {
        resolve2(value);
      });
    }
    return new (P || (P = Promise))(function(resolve2, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done ? resolve2(result.value) : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  });
  let { id } = $$props;
  let totalTime = 10;
  let actualLap = 1;
  let totalLaps;
  let currentExercise;
  let nextExerciseText;
  let workoutTime = 0;
  let exerciseTimeText;
  let timeRunning = false;
  let percentageOuter;
  let percentageInner;
  if ($$props.id === void 0 && $$bindings.id && id !== void 0)
    $$bindings.id(id);
  elapsedTimeText = translateTime(workoutTime);
  timeLeftText = translateTime(totalTime - workoutTime);
  return `<div class="${"flex flex-col items-center text-gray-200 w-full min-h-screen mx-auto"}"><div class="${"my-3 w-full px-3"}">${validate_component(TopNavbar, "TopNavbar").$$render($$result, {}, {}, {})}</div>
	<div class="${"w-full grid grid-cols-3 px-2 py-2 mx-auto"}">${validate_component(StatsText, "StatsText").$$render($$result, {
    props: {
      statName: "elapsed time",
      statContent: elapsedTimeText,
      position: "start"
    }
  }, {}, {})}
		${validate_component(StatsText, "StatsText").$$render($$result, {
    props: {
      statName: "laps",
      statContent: `${actualLap}/${totalLaps}`,
      position: "center"
    }
  }, {}, {})}
		${validate_component(StatsText, "StatsText").$$render($$result, {
    props: {
      statName: "time left",
      statContent: timeLeftText,
      position: "end"
    }
  }, {}, {})}</div>
	<div class="${"w-full mx-auto "}"><p class="${"text-center text-sm text-gray-400 uppercase"}">next up</p>
		<p class="${"text-center text-xl text-red-500"}">${escape2(nextExerciseText)}</p></div>
	<div class="${"w-full mx-auto mt-6"}">${validate_component(Timer, "Timer").$$render($$result, {
    timerText: exerciseTimeText,
    percentageOuter,
    percentageInner,
    exerciseProps: currentExercise
  }, {}, {})}</div>
	${validate_component(Playnav, "Playnav").$$render($$result, { timeRunning }, {}, {})}
	${``}
	${``}
	${``}</div>`;
});
var _id_ = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": U5Bidu5D,
  load
});

// .svelte-kit/netlify/entry.js
init();
async function handler(event) {
  const { path, httpMethod, headers, rawQuery, body, isBase64Encoded } = event;
  const query = new URLSearchParams(rawQuery);
  const encoding = isBase64Encoded ? "base64" : headers["content-encoding"] || "utf-8";
  const rawBody = typeof body === "string" ? Buffer.from(body, encoding) : body;
  const rendered = await render({
    method: httpMethod,
    headers,
    path,
    query,
    rawBody
  });
  if (rendered) {
    return {
      isBase64Encoded: false,
      statusCode: rendered.status,
      ...splitHeaders(rendered.headers),
      body: rendered.body
    };
  }
  return {
    statusCode: 404,
    body: "Not found"
  };
}
function splitHeaders(headers) {
  const h = {};
  const m = {};
  for (const key in headers) {
    const value = headers[key];
    const target = Array.isArray(value) ? m : h;
    target[key] = value;
  }
  return {
    headers: h,
    multiValueHeaders: m
  };
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  handler
});
