(function () {
    'use strict';

    /**
     * @license
     * Copyright 2017 Google LLC
     *
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     *   http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     */
    /**
     * A container for all of the Logger instances
     */
    /**
     * The JS SDK supports 5 log levels and also allows a user the ability to
     * silence the logs altogether.
     *
     * The order is a follows:
     * DEBUG < VERBOSE < INFO < WARN < ERROR
     *
     * All of the log types above the current log level will be captured (i.e. if
     * you set the log level to `INFO`, errors will still be logged, but `DEBUG` and
     * `VERBOSE` logs will not)
     */
    var LogLevel;
    (function (LogLevel) {
        LogLevel[LogLevel["DEBUG"] = 0] = "DEBUG";
        LogLevel[LogLevel["VERBOSE"] = 1] = "VERBOSE";
        LogLevel[LogLevel["INFO"] = 2] = "INFO";
        LogLevel[LogLevel["WARN"] = 3] = "WARN";
        LogLevel[LogLevel["ERROR"] = 4] = "ERROR";
        LogLevel[LogLevel["SILENT"] = 5] = "SILENT";
    })(LogLevel || (LogLevel = {}));
    const levelStringToEnum = {
        'debug': LogLevel.DEBUG,
        'verbose': LogLevel.VERBOSE,
        'info': LogLevel.INFO,
        'warn': LogLevel.WARN,
        'error': LogLevel.ERROR,
        'silent': LogLevel.SILENT
    };
    /**
     * The default log level
     */
    const defaultLogLevel = LogLevel.INFO;
    /**
     * By default, `console.debug` is not displayed in the developer console (in
     * chrome). To avoid forcing users to have to opt-in to these logs twice
     * (i.e. once for firebase, and once in the console), we are sending `DEBUG`
     * logs to the `console.log` function.
     */
    const ConsoleMethod = {
        [LogLevel.DEBUG]: 'log',
        [LogLevel.VERBOSE]: 'log',
        [LogLevel.INFO]: 'info',
        [LogLevel.WARN]: 'warn',
        [LogLevel.ERROR]: 'error'
    };
    /**
     * The default log handler will forward DEBUG, VERBOSE, INFO, WARN, and ERROR
     * messages on to their corresponding console counterparts (if the log method
     * is supported by the current log level)
     */
    const defaultLogHandler = (instance, logType, ...args) => {
        if (logType < instance.logLevel) {
            return;
        }
        const now = new Date().toISOString();
        const method = ConsoleMethod[logType];
        if (method) {
            console[method](`[${now}]  ${instance.name}:`, ...args);
        }
        else {
            throw new Error(`Attempted to log a message with an invalid logType (value: ${logType})`);
        }
    };
    class Logger {
        /**
         * Gives you an instance of a Logger to capture messages according to
         * Firebase's logging scheme.
         *
         * @param name The name that the logs will be associated with
         */
        constructor(name) {
            this.name = name;
            /**
             * The log level of the given Logger instance.
             */
            this._logLevel = defaultLogLevel;
            /**
             * The main (internal) log handler for the Logger instance.
             * Can be set to a new function in internal package code but not by user.
             */
            this._logHandler = defaultLogHandler;
            /**
             * The optional, additional, user-defined log handler for the Logger instance.
             */
            this._userLogHandler = null;
        }
        get logLevel() {
            return this._logLevel;
        }
        set logLevel(val) {
            if (!(val in LogLevel)) {
                throw new TypeError(`Invalid value "${val}" assigned to \`logLevel\``);
            }
            this._logLevel = val;
        }
        // Workaround for setter/getter having to be the same type.
        setLogLevel(val) {
            this._logLevel = typeof val === 'string' ? levelStringToEnum[val] : val;
        }
        get logHandler() {
            return this._logHandler;
        }
        set logHandler(val) {
            if (typeof val !== 'function') {
                throw new TypeError('Value assigned to `logHandler` must be a function');
            }
            this._logHandler = val;
        }
        get userLogHandler() {
            return this._userLogHandler;
        }
        set userLogHandler(val) {
            this._userLogHandler = val;
        }
        /**
         * The functions below are all based on the `console` interface
         */
        debug(...args) {
            this._userLogHandler && this._userLogHandler(this, LogLevel.DEBUG, ...args);
            this._logHandler(this, LogLevel.DEBUG, ...args);
        }
        log(...args) {
            this._userLogHandler &&
                this._userLogHandler(this, LogLevel.VERBOSE, ...args);
            this._logHandler(this, LogLevel.VERBOSE, ...args);
        }
        info(...args) {
            this._userLogHandler && this._userLogHandler(this, LogLevel.INFO, ...args);
            this._logHandler(this, LogLevel.INFO, ...args);
        }
        warn(...args) {
            this._userLogHandler && this._userLogHandler(this, LogLevel.WARN, ...args);
            this._logHandler(this, LogLevel.WARN, ...args);
        }
        error(...args) {
            this._userLogHandler && this._userLogHandler(this, LogLevel.ERROR, ...args);
            this._logHandler(this, LogLevel.ERROR, ...args);
        }
    }

    /**
     * @license
     * Copyright 2017 Google LLC
     *
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     *   http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     */
    /**
     * @fileoverview Firebase constants.  Some of these (@defines) can be overridden at compile-time.
     */

    /**
     * @license
     * Copyright 2017 Google LLC
     *
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     *   http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     */
    const stringToByteArray$1 = function (str) {
        // TODO(user): Use native implementations if/when available
        const out = [];
        let p = 0;
        for (let i = 0; i < str.length; i++) {
            let c = str.charCodeAt(i);
            if (c < 128) {
                out[p++] = c;
            }
            else if (c < 2048) {
                out[p++] = (c >> 6) | 192;
                out[p++] = (c & 63) | 128;
            }
            else if ((c & 0xfc00) === 0xd800 &&
                i + 1 < str.length &&
                (str.charCodeAt(i + 1) & 0xfc00) === 0xdc00) {
                // Surrogate Pair
                c = 0x10000 + ((c & 0x03ff) << 10) + (str.charCodeAt(++i) & 0x03ff);
                out[p++] = (c >> 18) | 240;
                out[p++] = ((c >> 12) & 63) | 128;
                out[p++] = ((c >> 6) & 63) | 128;
                out[p++] = (c & 63) | 128;
            }
            else {
                out[p++] = (c >> 12) | 224;
                out[p++] = ((c >> 6) & 63) | 128;
                out[p++] = (c & 63) | 128;
            }
        }
        return out;
    };
    /**
     * Turns an array of numbers into the string given by the concatenation of the
     * characters to which the numbers correspond.
     * @param bytes Array of numbers representing characters.
     * @return Stringification of the array.
     */
    const byteArrayToString = function (bytes) {
        // TODO(user): Use native implementations if/when available
        const out = [];
        let pos = 0, c = 0;
        while (pos < bytes.length) {
            const c1 = bytes[pos++];
            if (c1 < 128) {
                out[c++] = String.fromCharCode(c1);
            }
            else if (c1 > 191 && c1 < 224) {
                const c2 = bytes[pos++];
                out[c++] = String.fromCharCode(((c1 & 31) << 6) | (c2 & 63));
            }
            else if (c1 > 239 && c1 < 365) {
                // Surrogate Pair
                const c2 = bytes[pos++];
                const c3 = bytes[pos++];
                const c4 = bytes[pos++];
                const u = (((c1 & 7) << 18) | ((c2 & 63) << 12) | ((c3 & 63) << 6) | (c4 & 63)) -
                    0x10000;
                out[c++] = String.fromCharCode(0xd800 + (u >> 10));
                out[c++] = String.fromCharCode(0xdc00 + (u & 1023));
            }
            else {
                const c2 = bytes[pos++];
                const c3 = bytes[pos++];
                out[c++] = String.fromCharCode(((c1 & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
            }
        }
        return out.join('');
    };
    // We define it as an object literal instead of a class because a class compiled down to es5 can't
    // be treeshaked. https://github.com/rollup/rollup/issues/1691
    // Static lookup maps, lazily populated by init_()
    const base64 = {
        /**
         * Maps bytes to characters.
         */
        byteToCharMap_: null,
        /**
         * Maps characters to bytes.
         */
        charToByteMap_: null,
        /**
         * Maps bytes to websafe characters.
         * @private
         */
        byteToCharMapWebSafe_: null,
        /**
         * Maps websafe characters to bytes.
         * @private
         */
        charToByteMapWebSafe_: null,
        /**
         * Our default alphabet, shared between
         * ENCODED_VALS and ENCODED_VALS_WEBSAFE
         */
        ENCODED_VALS_BASE: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ' + 'abcdefghijklmnopqrstuvwxyz' + '0123456789',
        /**
         * Our default alphabet. Value 64 (=) is special; it means "nothing."
         */
        get ENCODED_VALS() {
            return this.ENCODED_VALS_BASE + '+/=';
        },
        /**
         * Our websafe alphabet.
         */
        get ENCODED_VALS_WEBSAFE() {
            return this.ENCODED_VALS_BASE + '-_.';
        },
        /**
         * Whether this browser supports the atob and btoa functions. This extension
         * started at Mozilla but is now implemented by many browsers. We use the
         * ASSUME_* variables to avoid pulling in the full useragent detection library
         * but still allowing the standard per-browser compilations.
         *
         */
        HAS_NATIVE_SUPPORT: typeof atob === 'function',
        /**
         * Base64-encode an array of bytes.
         *
         * @param input An array of bytes (numbers with
         *     value in [0, 255]) to encode.
         * @param webSafe Boolean indicating we should use the
         *     alternative alphabet.
         * @return The base64 encoded string.
         */
        encodeByteArray(input, webSafe) {
            if (!Array.isArray(input)) {
                throw Error('encodeByteArray takes an array as a parameter');
            }
            this.init_();
            const byteToCharMap = webSafe
                ? this.byteToCharMapWebSafe_
                : this.byteToCharMap_;
            const output = [];
            for (let i = 0; i < input.length; i += 3) {
                const byte1 = input[i];
                const haveByte2 = i + 1 < input.length;
                const byte2 = haveByte2 ? input[i + 1] : 0;
                const haveByte3 = i + 2 < input.length;
                const byte3 = haveByte3 ? input[i + 2] : 0;
                const outByte1 = byte1 >> 2;
                const outByte2 = ((byte1 & 0x03) << 4) | (byte2 >> 4);
                let outByte3 = ((byte2 & 0x0f) << 2) | (byte3 >> 6);
                let outByte4 = byte3 & 0x3f;
                if (!haveByte3) {
                    outByte4 = 64;
                    if (!haveByte2) {
                        outByte3 = 64;
                    }
                }
                output.push(byteToCharMap[outByte1], byteToCharMap[outByte2], byteToCharMap[outByte3], byteToCharMap[outByte4]);
            }
            return output.join('');
        },
        /**
         * Base64-encode a string.
         *
         * @param input A string to encode.
         * @param webSafe If true, we should use the
         *     alternative alphabet.
         * @return The base64 encoded string.
         */
        encodeString(input, webSafe) {
            // Shortcut for Mozilla browsers that implement
            // a native base64 encoder in the form of "btoa/atob"
            if (this.HAS_NATIVE_SUPPORT && !webSafe) {
                return btoa(input);
            }
            return this.encodeByteArray(stringToByteArray$1(input), webSafe);
        },
        /**
         * Base64-decode a string.
         *
         * @param input to decode.
         * @param webSafe True if we should use the
         *     alternative alphabet.
         * @return string representing the decoded value.
         */
        decodeString(input, webSafe) {
            // Shortcut for Mozilla browsers that implement
            // a native base64 encoder in the form of "btoa/atob"
            if (this.HAS_NATIVE_SUPPORT && !webSafe) {
                return atob(input);
            }
            return byteArrayToString(this.decodeStringToByteArray(input, webSafe));
        },
        /**
         * Base64-decode a string.
         *
         * In base-64 decoding, groups of four characters are converted into three
         * bytes.  If the encoder did not apply padding, the input length may not
         * be a multiple of 4.
         *
         * In this case, the last group will have fewer than 4 characters, and
         * padding will be inferred.  If the group has one or two characters, it decodes
         * to one byte.  If the group has three characters, it decodes to two bytes.
         *
         * @param input Input to decode.
         * @param webSafe True if we should use the web-safe alphabet.
         * @return bytes representing the decoded value.
         */
        decodeStringToByteArray(input, webSafe) {
            this.init_();
            const charToByteMap = webSafe
                ? this.charToByteMapWebSafe_
                : this.charToByteMap_;
            const output = [];
            for (let i = 0; i < input.length;) {
                const byte1 = charToByteMap[input.charAt(i++)];
                const haveByte2 = i < input.length;
                const byte2 = haveByte2 ? charToByteMap[input.charAt(i)] : 0;
                ++i;
                const haveByte3 = i < input.length;
                const byte3 = haveByte3 ? charToByteMap[input.charAt(i)] : 64;
                ++i;
                const haveByte4 = i < input.length;
                const byte4 = haveByte4 ? charToByteMap[input.charAt(i)] : 64;
                ++i;
                if (byte1 == null || byte2 == null || byte3 == null || byte4 == null) {
                    throw new DecodeBase64StringError();
                }
                const outByte1 = (byte1 << 2) | (byte2 >> 4);
                output.push(outByte1);
                if (byte3 !== 64) {
                    const outByte2 = ((byte2 << 4) & 0xf0) | (byte3 >> 2);
                    output.push(outByte2);
                    if (byte4 !== 64) {
                        const outByte3 = ((byte3 << 6) & 0xc0) | byte4;
                        output.push(outByte3);
                    }
                }
            }
            return output;
        },
        /**
         * Lazy static initialization function. Called before
         * accessing any of the static map variables.
         * @private
         */
        init_() {
            if (!this.byteToCharMap_) {
                this.byteToCharMap_ = {};
                this.charToByteMap_ = {};
                this.byteToCharMapWebSafe_ = {};
                this.charToByteMapWebSafe_ = {};
                // We want quick mappings back and forth, so we precompute two maps.
                for (let i = 0; i < this.ENCODED_VALS.length; i++) {
                    this.byteToCharMap_[i] = this.ENCODED_VALS.charAt(i);
                    this.charToByteMap_[this.byteToCharMap_[i]] = i;
                    this.byteToCharMapWebSafe_[i] = this.ENCODED_VALS_WEBSAFE.charAt(i);
                    this.charToByteMapWebSafe_[this.byteToCharMapWebSafe_[i]] = i;
                    // Be forgiving when decoding and correctly decode both encodings.
                    if (i >= this.ENCODED_VALS_BASE.length) {
                        this.charToByteMap_[this.ENCODED_VALS_WEBSAFE.charAt(i)] = i;
                        this.charToByteMapWebSafe_[this.ENCODED_VALS.charAt(i)] = i;
                    }
                }
            }
        }
    };
    /**
     * An error encountered while decoding base64 string.
     */
    class DecodeBase64StringError extends Error {
        constructor() {
            super(...arguments);
            this.name = 'DecodeBase64StringError';
        }
    }
    /**
     * URL-safe base64 encoding
     */
    const base64Encode = function (str) {
        const utf8Bytes = stringToByteArray$1(str);
        return base64.encodeByteArray(utf8Bytes, true);
    };
    /**
     * URL-safe base64 encoding (without "." padding in the end).
     * e.g. Used in JSON Web Token (JWT) parts.
     */
    const base64urlEncodeWithoutPadding = function (str) {
        // Use base64url encoding and remove padding in the end (dot characters).
        return base64Encode(str).replace(/\./g, '');
    };
    /**
     * URL-safe base64 decoding
     *
     * NOTE: DO NOT use the global atob() function - it does NOT support the
     * base64Url variant encoding.
     *
     * @param str To be decoded
     * @return Decoded result, if possible
     */
    const base64Decode = function (str) {
        try {
            return base64.decodeString(str, true);
        }
        catch (e) {
            console.error('base64Decode failed: ', e);
        }
        return null;
    };

    /**
     * @license
     * Copyright 2022 Google LLC
     *
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     *   http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     */
    /**
     * Polyfill for `globalThis` object.
     * @returns the `globalThis` object for the given environment.
     * @public
     */
    function getGlobal() {
        if (typeof self !== 'undefined') {
            return self;
        }
        if (typeof window !== 'undefined') {
            return window;
        }
        if (typeof global !== 'undefined') {
            return global;
        }
        throw new Error('Unable to locate global object.');
    }

    /**
     * @license
     * Copyright 2022 Google LLC
     *
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     *   http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     */
    const getDefaultsFromGlobal = () => getGlobal().__FIREBASE_DEFAULTS__;
    /**
     * Attempt to read defaults from a JSON string provided to
     * process(.)env(.)__FIREBASE_DEFAULTS__ or a JSON file whose path is in
     * process(.)env(.)__FIREBASE_DEFAULTS_PATH__
     * The dots are in parens because certain compilers (Vite?) cannot
     * handle seeing that variable in comments.
     * See https://github.com/firebase/firebase-js-sdk/issues/6838
     */
    const getDefaultsFromEnvVariable = () => {
        if (typeof process === 'undefined' || typeof process.env === 'undefined') {
            return;
        }
        const defaultsJsonString = process.env.__FIREBASE_DEFAULTS__;
        if (defaultsJsonString) {
            return JSON.parse(defaultsJsonString);
        }
    };
    const getDefaultsFromCookie = () => {
        if (typeof document === 'undefined') {
            return;
        }
        let match;
        try {
            match = document.cookie.match(/__FIREBASE_DEFAULTS__=([^;]+)/);
        }
        catch (e) {
            // Some environments such as Angular Universal SSR have a
            // `document` object but error on accessing `document.cookie`.
            return;
        }
        const decoded = match && base64Decode(match[1]);
        return decoded && JSON.parse(decoded);
    };
    /**
     * Get the __FIREBASE_DEFAULTS__ object. It checks in order:
     * (1) if such an object exists as a property of `globalThis`
     * (2) if such an object was provided on a shell environment variable
     * (3) if such an object exists in a cookie
     * @public
     */
    const getDefaults = () => {
        try {
            return (getDefaultsFromGlobal() ||
                getDefaultsFromEnvVariable() ||
                getDefaultsFromCookie());
        }
        catch (e) {
            /**
             * Catch-all for being unable to get __FIREBASE_DEFAULTS__ due
             * to any environment case we have not accounted for. Log to
             * info instead of swallowing so we can find these unknown cases
             * and add paths for them if needed.
             */
            console.info(`Unable to get __FIREBASE_DEFAULTS__ due to: ${e}`);
            return;
        }
    };
    /**
     * Returns Firebase app config stored in the __FIREBASE_DEFAULTS__ object.
     * @public
     */
    const getDefaultAppConfig = () => { var _a; return (_a = getDefaults()) === null || _a === void 0 ? void 0 : _a.config; };

    /**
     * @license
     * Copyright 2017 Google LLC
     *
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     *   http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     */
    class Deferred {
        constructor() {
            this.reject = () => { };
            this.resolve = () => { };
            this.promise = new Promise((resolve, reject) => {
                this.resolve = resolve;
                this.reject = reject;
            });
        }
        /**
         * Our API internals are not promiseified and cannot because our callback APIs have subtle expectations around
         * invoking promises inline, which Promises are forbidden to do. This method accepts an optional node-style callback
         * and returns a node-style callback which will resolve or reject the Deferred's promise.
         */
        wrapCallback(callback) {
            return (error, value) => {
                if (error) {
                    this.reject(error);
                }
                else {
                    this.resolve(value);
                }
                if (typeof callback === 'function') {
                    // Attaching noop handler just in case developer wasn't expecting
                    // promises
                    this.promise.catch(() => { });
                    // Some of our callbacks don't expect a value and our own tests
                    // assert that the parameter length is 1
                    if (callback.length === 1) {
                        callback(error);
                    }
                    else {
                        callback(error, value);
                    }
                }
            };
        }
    }
    /**
     * This method checks if indexedDB is supported by current browser/service worker context
     * @return true if indexedDB is supported by current browser/service worker context
     */
    function isIndexedDBAvailable() {
        try {
            return typeof indexedDB === 'object';
        }
        catch (e) {
            return false;
        }
    }
    /**
     * This method validates browser/sw context for indexedDB by opening a dummy indexedDB database and reject
     * if errors occur during the database open operation.
     *
     * @throws exception if current browser/sw context can't run idb.open (ex: Safari iframe, Firefox
     * private browsing)
     */
    function validateIndexedDBOpenable() {
        return new Promise((resolve, reject) => {
            try {
                let preExist = true;
                const DB_CHECK_NAME = 'validate-browser-context-for-indexeddb-analytics-module';
                const request = self.indexedDB.open(DB_CHECK_NAME);
                request.onsuccess = () => {
                    request.result.close();
                    // delete database only when it doesn't pre-exist
                    if (!preExist) {
                        self.indexedDB.deleteDatabase(DB_CHECK_NAME);
                    }
                    resolve(true);
                };
                request.onupgradeneeded = () => {
                    preExist = false;
                };
                request.onerror = () => {
                    var _a;
                    reject(((_a = request.error) === null || _a === void 0 ? void 0 : _a.message) || '');
                };
            }
            catch (error) {
                reject(error);
            }
        });
    }

    /**
     * @license
     * Copyright 2017 Google LLC
     *
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     *   http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     */
    /**
     * @fileoverview Standardized Firebase Error.
     *
     * Usage:
     *
     *   // Typescript string literals for type-safe codes
     *   type Err =
     *     'unknown' |
     *     'object-not-found'
     *     ;
     *
     *   // Closure enum for type-safe error codes
     *   // at-enum {string}
     *   var Err = {
     *     UNKNOWN: 'unknown',
     *     OBJECT_NOT_FOUND: 'object-not-found',
     *   }
     *
     *   let errors: Map<Err, string> = {
     *     'generic-error': "Unknown error",
     *     'file-not-found': "Could not find file: {$file}",
     *   };
     *
     *   // Type-safe function - must pass a valid error code as param.
     *   let error = new ErrorFactory<Err>('service', 'Service', errors);
     *
     *   ...
     *   throw error.create(Err.GENERIC);
     *   ...
     *   throw error.create(Err.FILE_NOT_FOUND, {'file': fileName});
     *   ...
     *   // Service: Could not file file: foo.txt (service/file-not-found).
     *
     *   catch (e) {
     *     assert(e.message === "Could not find file: foo.txt.");
     *     if ((e as FirebaseError)?.code === 'service/file-not-found') {
     *       console.log("Could not read file: " + e['file']);
     *     }
     *   }
     */
    const ERROR_NAME = 'FirebaseError';
    // Based on code from:
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error#Custom_Error_Types
    class FirebaseError extends Error {
        constructor(
        /** The error code for this error. */
        code, message, 
        /** Custom data for this error. */
        customData) {
            super(message);
            this.code = code;
            this.customData = customData;
            /** The custom name for all FirebaseErrors. */
            this.name = ERROR_NAME;
            // Fix For ES5
            // https://github.com/Microsoft/TypeScript-wiki/blob/master/Breaking-Changes.md#extending-built-ins-like-error-array-and-map-may-no-longer-work
            Object.setPrototypeOf(this, FirebaseError.prototype);
            // Maintains proper stack trace for where our error was thrown.
            // Only available on V8.
            if (Error.captureStackTrace) {
                Error.captureStackTrace(this, ErrorFactory.prototype.create);
            }
        }
    }
    class ErrorFactory {
        constructor(service, serviceName, errors) {
            this.service = service;
            this.serviceName = serviceName;
            this.errors = errors;
        }
        create(code, ...data) {
            const customData = data[0] || {};
            const fullCode = `${this.service}/${code}`;
            const template = this.errors[code];
            const message = template ? replaceTemplate(template, customData) : 'Error';
            // Service Name: Error message (service/code).
            const fullMessage = `${this.serviceName}: ${message} (${fullCode}).`;
            const error = new FirebaseError(fullCode, fullMessage, customData);
            return error;
        }
    }
    function replaceTemplate(template, data) {
        return template.replace(PATTERN, (_, key) => {
            const value = data[key];
            return value != null ? String(value) : `<${key}?>`;
        });
    }
    const PATTERN = /\{\$([^}]+)}/g;
    /**
     * Deep equal two objects. Support Arrays and Objects.
     */
    function deepEqual(a, b) {
        if (a === b) {
            return true;
        }
        const aKeys = Object.keys(a);
        const bKeys = Object.keys(b);
        for (const k of aKeys) {
            if (!bKeys.includes(k)) {
                return false;
            }
            const aProp = a[k];
            const bProp = b[k];
            if (isObject(aProp) && isObject(bProp)) {
                if (!deepEqual(aProp, bProp)) {
                    return false;
                }
            }
            else if (aProp !== bProp) {
                return false;
            }
        }
        for (const k of bKeys) {
            if (!aKeys.includes(k)) {
                return false;
            }
        }
        return true;
    }
    function isObject(thing) {
        return thing !== null && typeof thing === 'object';
    }

    /**
     * @license
     * Copyright 2022 Google LLC
     *
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     *   http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     */
    /**
     * Copied from https://stackoverflow.com/a/2117523
     * Generates a new uuid.
     * @public
     */
    const uuidv4 = function () {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
            const r = (Math.random() * 16) | 0, v = c === 'x' ? r : (r & 0x3) | 0x8;
            return v.toString(16);
        });
    };

    /**
     * @license
     * Copyright 2019 Google LLC
     *
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     *   http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     */
    /**
     * The amount of milliseconds to exponentially increase.
     */
    const DEFAULT_INTERVAL_MILLIS = 1000;
    /**
     * The factor to backoff by.
     * Should be a number greater than 1.
     */
    const DEFAULT_BACKOFF_FACTOR = 2;
    /**
     * The maximum milliseconds to increase to.
     *
     * <p>Visible for testing
     */
    const MAX_VALUE_MILLIS = 4 * 60 * 60 * 1000; // Four hours, like iOS and Android.
    /**
     * The percentage of backoff time to randomize by.
     * See
     * http://go/safe-client-behavior#step-1-determine-the-appropriate-retry-interval-to-handle-spike-traffic
     * for context.
     *
     * <p>Visible for testing
     */
    const RANDOM_FACTOR = 0.5;
    /**
     * Based on the backoff method from
     * https://github.com/google/closure-library/blob/master/closure/goog/math/exponentialbackoff.js.
     * Extracted here so we don't need to pass metadata and a stateful ExponentialBackoff object around.
     */
    function calculateBackoffMillis(backoffCount, intervalMillis = DEFAULT_INTERVAL_MILLIS, backoffFactor = DEFAULT_BACKOFF_FACTOR) {
        // Calculates an exponentially increasing value.
        // Deviation: calculates value from count and a constant interval, so we only need to save value
        // and count to restore state.
        const currBaseValue = intervalMillis * Math.pow(backoffFactor, backoffCount);
        // A random "fuzz" to avoid waves of retries.
        // Deviation: randomFactor is required.
        const randomWait = Math.round(
        // A fraction of the backoff value to add/subtract.
        // Deviation: changes multiplication order to improve readability.
        RANDOM_FACTOR *
            currBaseValue *
            // A random float (rounded to int by Math.round above) in the range [-1, 1]. Determines
            // if we add or subtract.
            (Math.random() - 0.5) *
            2);
        // Limits backoff to max to avoid effectively permanent backoff.
        return Math.min(MAX_VALUE_MILLIS, currBaseValue + randomWait);
    }

    /**
     * @license
     * Copyright 2021 Google LLC
     *
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     *   http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     */
    function getModularInstance(service) {
        if (service && service._delegate) {
            return service._delegate;
        }
        else {
            return service;
        }
    }

    /**
     * Component for service name T, e.g. `auth`, `auth-internal`
     */
    class Component {
        /**
         *
         * @param name The public service name, e.g. app, auth, firestore, database
         * @param instanceFactory Service factory responsible for creating the public interface
         * @param type whether the service provided by the component is public or private
         */
        constructor(name, instanceFactory, type) {
            this.name = name;
            this.instanceFactory = instanceFactory;
            this.type = type;
            this.multipleInstances = false;
            /**
             * Properties to be added to the service namespace
             */
            this.serviceProps = {};
            this.instantiationMode = "LAZY" /* InstantiationMode.LAZY */;
            this.onInstanceCreated = null;
        }
        setInstantiationMode(mode) {
            this.instantiationMode = mode;
            return this;
        }
        setMultipleInstances(multipleInstances) {
            this.multipleInstances = multipleInstances;
            return this;
        }
        setServiceProps(props) {
            this.serviceProps = props;
            return this;
        }
        setInstanceCreatedCallback(callback) {
            this.onInstanceCreated = callback;
            return this;
        }
    }

    /**
     * @license
     * Copyright 2019 Google LLC
     *
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     *   http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     */
    const DEFAULT_ENTRY_NAME$1 = '[DEFAULT]';

    /**
     * @license
     * Copyright 2019 Google LLC
     *
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     *   http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     */
    /**
     * Provider for instance for service name T, e.g. 'auth', 'auth-internal'
     * NameServiceMapping[T] is an alias for the type of the instance
     */
    class Provider {
        constructor(name, container) {
            this.name = name;
            this.container = container;
            this.component = null;
            this.instances = new Map();
            this.instancesDeferred = new Map();
            this.instancesOptions = new Map();
            this.onInitCallbacks = new Map();
        }
        /**
         * @param identifier A provider can provide mulitple instances of a service
         * if this.component.multipleInstances is true.
         */
        get(identifier) {
            // if multipleInstances is not supported, use the default name
            const normalizedIdentifier = this.normalizeInstanceIdentifier(identifier);
            if (!this.instancesDeferred.has(normalizedIdentifier)) {
                const deferred = new Deferred();
                this.instancesDeferred.set(normalizedIdentifier, deferred);
                if (this.isInitialized(normalizedIdentifier) ||
                    this.shouldAutoInitialize()) {
                    // initialize the service if it can be auto-initialized
                    try {
                        const instance = this.getOrInitializeService({
                            instanceIdentifier: normalizedIdentifier
                        });
                        if (instance) {
                            deferred.resolve(instance);
                        }
                    }
                    catch (e) {
                        // when the instance factory throws an exception during get(), it should not cause
                        // a fatal error. We just return the unresolved promise in this case.
                    }
                }
            }
            return this.instancesDeferred.get(normalizedIdentifier).promise;
        }
        getImmediate(options) {
            var _a;
            // if multipleInstances is not supported, use the default name
            const normalizedIdentifier = this.normalizeInstanceIdentifier(options === null || options === void 0 ? void 0 : options.identifier);
            const optional = (_a = options === null || options === void 0 ? void 0 : options.optional) !== null && _a !== void 0 ? _a : false;
            if (this.isInitialized(normalizedIdentifier) ||
                this.shouldAutoInitialize()) {
                try {
                    return this.getOrInitializeService({
                        instanceIdentifier: normalizedIdentifier
                    });
                }
                catch (e) {
                    if (optional) {
                        return null;
                    }
                    else {
                        throw e;
                    }
                }
            }
            else {
                // In case a component is not initialized and should/can not be auto-initialized at the moment, return null if the optional flag is set, or throw
                if (optional) {
                    return null;
                }
                else {
                    throw Error(`Service ${this.name} is not available`);
                }
            }
        }
        getComponent() {
            return this.component;
        }
        setComponent(component) {
            if (component.name !== this.name) {
                throw Error(`Mismatching Component ${component.name} for Provider ${this.name}.`);
            }
            if (this.component) {
                throw Error(`Component for ${this.name} has already been provided`);
            }
            this.component = component;
            // return early without attempting to initialize the component if the component requires explicit initialization (calling `Provider.initialize()`)
            if (!this.shouldAutoInitialize()) {
                return;
            }
            // if the service is eager, initialize the default instance
            if (isComponentEager(component)) {
                try {
                    this.getOrInitializeService({ instanceIdentifier: DEFAULT_ENTRY_NAME$1 });
                }
                catch (e) {
                    // when the instance factory for an eager Component throws an exception during the eager
                    // initialization, it should not cause a fatal error.
                    // TODO: Investigate if we need to make it configurable, because some component may want to cause
                    // a fatal error in this case?
                }
            }
            // Create service instances for the pending promises and resolve them
            // NOTE: if this.multipleInstances is false, only the default instance will be created
            // and all promises with resolve with it regardless of the identifier.
            for (const [instanceIdentifier, instanceDeferred] of this.instancesDeferred.entries()) {
                const normalizedIdentifier = this.normalizeInstanceIdentifier(instanceIdentifier);
                try {
                    // `getOrInitializeService()` should always return a valid instance since a component is guaranteed. use ! to make typescript happy.
                    const instance = this.getOrInitializeService({
                        instanceIdentifier: normalizedIdentifier
                    });
                    instanceDeferred.resolve(instance);
                }
                catch (e) {
                    // when the instance factory throws an exception, it should not cause
                    // a fatal error. We just leave the promise unresolved.
                }
            }
        }
        clearInstance(identifier = DEFAULT_ENTRY_NAME$1) {
            this.instancesDeferred.delete(identifier);
            this.instancesOptions.delete(identifier);
            this.instances.delete(identifier);
        }
        // app.delete() will call this method on every provider to delete the services
        // TODO: should we mark the provider as deleted?
        async delete() {
            const services = Array.from(this.instances.values());
            await Promise.all([
                ...services
                    .filter(service => 'INTERNAL' in service) // legacy services
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    .map(service => service.INTERNAL.delete()),
                ...services
                    .filter(service => '_delete' in service) // modularized services
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    .map(service => service._delete())
            ]);
        }
        isComponentSet() {
            return this.component != null;
        }
        isInitialized(identifier = DEFAULT_ENTRY_NAME$1) {
            return this.instances.has(identifier);
        }
        getOptions(identifier = DEFAULT_ENTRY_NAME$1) {
            return this.instancesOptions.get(identifier) || {};
        }
        initialize(opts = {}) {
            const { options = {} } = opts;
            const normalizedIdentifier = this.normalizeInstanceIdentifier(opts.instanceIdentifier);
            if (this.isInitialized(normalizedIdentifier)) {
                throw Error(`${this.name}(${normalizedIdentifier}) has already been initialized`);
            }
            if (!this.isComponentSet()) {
                throw Error(`Component ${this.name} has not been registered yet`);
            }
            const instance = this.getOrInitializeService({
                instanceIdentifier: normalizedIdentifier,
                options
            });
            // resolve any pending promise waiting for the service instance
            for (const [instanceIdentifier, instanceDeferred] of this.instancesDeferred.entries()) {
                const normalizedDeferredIdentifier = this.normalizeInstanceIdentifier(instanceIdentifier);
                if (normalizedIdentifier === normalizedDeferredIdentifier) {
                    instanceDeferred.resolve(instance);
                }
            }
            return instance;
        }
        /**
         *
         * @param callback - a function that will be invoked  after the provider has been initialized by calling provider.initialize().
         * The function is invoked SYNCHRONOUSLY, so it should not execute any longrunning tasks in order to not block the program.
         *
         * @param identifier An optional instance identifier
         * @returns a function to unregister the callback
         */
        onInit(callback, identifier) {
            var _a;
            const normalizedIdentifier = this.normalizeInstanceIdentifier(identifier);
            const existingCallbacks = (_a = this.onInitCallbacks.get(normalizedIdentifier)) !== null && _a !== void 0 ? _a : new Set();
            existingCallbacks.add(callback);
            this.onInitCallbacks.set(normalizedIdentifier, existingCallbacks);
            const existingInstance = this.instances.get(normalizedIdentifier);
            if (existingInstance) {
                callback(existingInstance, normalizedIdentifier);
            }
            return () => {
                existingCallbacks.delete(callback);
            };
        }
        /**
         * Invoke onInit callbacks synchronously
         * @param instance the service instance`
         */
        invokeOnInitCallbacks(instance, identifier) {
            const callbacks = this.onInitCallbacks.get(identifier);
            if (!callbacks) {
                return;
            }
            for (const callback of callbacks) {
                try {
                    callback(instance, identifier);
                }
                catch (_a) {
                    // ignore errors in the onInit callback
                }
            }
        }
        getOrInitializeService({ instanceIdentifier, options = {} }) {
            let instance = this.instances.get(instanceIdentifier);
            if (!instance && this.component) {
                instance = this.component.instanceFactory(this.container, {
                    instanceIdentifier: normalizeIdentifierForFactory(instanceIdentifier),
                    options
                });
                this.instances.set(instanceIdentifier, instance);
                this.instancesOptions.set(instanceIdentifier, options);
                /**
                 * Invoke onInit listeners.
                 * Note this.component.onInstanceCreated is different, which is used by the component creator,
                 * while onInit listeners are registered by consumers of the provider.
                 */
                this.invokeOnInitCallbacks(instance, instanceIdentifier);
                /**
                 * Order is important
                 * onInstanceCreated() should be called after this.instances.set(instanceIdentifier, instance); which
                 * makes `isInitialized()` return true.
                 */
                if (this.component.onInstanceCreated) {
                    try {
                        this.component.onInstanceCreated(this.container, instanceIdentifier, instance);
                    }
                    catch (_a) {
                        // ignore errors in the onInstanceCreatedCallback
                    }
                }
            }
            return instance || null;
        }
        normalizeInstanceIdentifier(identifier = DEFAULT_ENTRY_NAME$1) {
            if (this.component) {
                return this.component.multipleInstances ? identifier : DEFAULT_ENTRY_NAME$1;
            }
            else {
                return identifier; // assume multiple instances are supported before the component is provided.
            }
        }
        shouldAutoInitialize() {
            return (!!this.component &&
                this.component.instantiationMode !== "EXPLICIT" /* InstantiationMode.EXPLICIT */);
        }
    }
    // undefined should be passed to the service factory for the default instance
    function normalizeIdentifierForFactory(identifier) {
        return identifier === DEFAULT_ENTRY_NAME$1 ? undefined : identifier;
    }
    function isComponentEager(component) {
        return component.instantiationMode === "EAGER" /* InstantiationMode.EAGER */;
    }

    /**
     * @license
     * Copyright 2019 Google LLC
     *
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     *   http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     */
    /**
     * ComponentContainer that provides Providers for service name T, e.g. `auth`, `auth-internal`
     */
    class ComponentContainer {
        constructor(name) {
            this.name = name;
            this.providers = new Map();
        }
        /**
         *
         * @param component Component being added
         * @param overwrite When a component with the same name has already been registered,
         * if overwrite is true: overwrite the existing component with the new component and create a new
         * provider with the new component. It can be useful in tests where you want to use different mocks
         * for different tests.
         * if overwrite is false: throw an exception
         */
        addComponent(component) {
            const provider = this.getProvider(component.name);
            if (provider.isComponentSet()) {
                throw new Error(`Component ${component.name} has already been registered with ${this.name}`);
            }
            provider.setComponent(component);
        }
        addOrOverwriteComponent(component) {
            const provider = this.getProvider(component.name);
            if (provider.isComponentSet()) {
                // delete the existing provider from the container, so we can register the new component
                this.providers.delete(component.name);
            }
            this.addComponent(component);
        }
        /**
         * getProvider provides a type safe interface where it can only be called with a field name
         * present in NameServiceMapping interface.
         *
         * Firebase SDKs providing services should extend NameServiceMapping interface to register
         * themselves.
         */
        getProvider(name) {
            if (this.providers.has(name)) {
                return this.providers.get(name);
            }
            // create a Provider for a service that hasn't registered with Firebase
            const provider = new Provider(name, this);
            this.providers.set(name, provider);
            return provider;
        }
        getProviders() {
            return Array.from(this.providers.values());
        }
    }

    const instanceOfAny = (object, constructors) => constructors.some((c) => object instanceof c);

    let idbProxyableTypes;
    let cursorAdvanceMethods;
    // This is a function to prevent it throwing up in node environments.
    function getIdbProxyableTypes() {
        return (idbProxyableTypes ||
            (idbProxyableTypes = [
                IDBDatabase,
                IDBObjectStore,
                IDBIndex,
                IDBCursor,
                IDBTransaction,
            ]));
    }
    // This is a function to prevent it throwing up in node environments.
    function getCursorAdvanceMethods() {
        return (cursorAdvanceMethods ||
            (cursorAdvanceMethods = [
                IDBCursor.prototype.advance,
                IDBCursor.prototype.continue,
                IDBCursor.prototype.continuePrimaryKey,
            ]));
    }
    const cursorRequestMap = new WeakMap();
    const transactionDoneMap = new WeakMap();
    const transactionStoreNamesMap = new WeakMap();
    const transformCache = new WeakMap();
    const reverseTransformCache = new WeakMap();
    function promisifyRequest(request) {
        const promise = new Promise((resolve, reject) => {
            const unlisten = () => {
                request.removeEventListener('success', success);
                request.removeEventListener('error', error);
            };
            const success = () => {
                resolve(wrap(request.result));
                unlisten();
            };
            const error = () => {
                reject(request.error);
                unlisten();
            };
            request.addEventListener('success', success);
            request.addEventListener('error', error);
        });
        promise
            .then((value) => {
            // Since cursoring reuses the IDBRequest (*sigh*), we cache it for later retrieval
            // (see wrapFunction).
            if (value instanceof IDBCursor) {
                cursorRequestMap.set(value, request);
            }
            // Catching to avoid "Uncaught Promise exceptions"
        })
            .catch(() => { });
        // This mapping exists in reverseTransformCache but doesn't doesn't exist in transformCache. This
        // is because we create many promises from a single IDBRequest.
        reverseTransformCache.set(promise, request);
        return promise;
    }
    function cacheDonePromiseForTransaction(tx) {
        // Early bail if we've already created a done promise for this transaction.
        if (transactionDoneMap.has(tx))
            return;
        const done = new Promise((resolve, reject) => {
            const unlisten = () => {
                tx.removeEventListener('complete', complete);
                tx.removeEventListener('error', error);
                tx.removeEventListener('abort', error);
            };
            const complete = () => {
                resolve();
                unlisten();
            };
            const error = () => {
                reject(tx.error || new DOMException('AbortError', 'AbortError'));
                unlisten();
            };
            tx.addEventListener('complete', complete);
            tx.addEventListener('error', error);
            tx.addEventListener('abort', error);
        });
        // Cache it for later retrieval.
        transactionDoneMap.set(tx, done);
    }
    let idbProxyTraps = {
        get(target, prop, receiver) {
            if (target instanceof IDBTransaction) {
                // Special handling for transaction.done.
                if (prop === 'done')
                    return transactionDoneMap.get(target);
                // Polyfill for objectStoreNames because of Edge.
                if (prop === 'objectStoreNames') {
                    return target.objectStoreNames || transactionStoreNamesMap.get(target);
                }
                // Make tx.store return the only store in the transaction, or undefined if there are many.
                if (prop === 'store') {
                    return receiver.objectStoreNames[1]
                        ? undefined
                        : receiver.objectStore(receiver.objectStoreNames[0]);
                }
            }
            // Else transform whatever we get back.
            return wrap(target[prop]);
        },
        set(target, prop, value) {
            target[prop] = value;
            return true;
        },
        has(target, prop) {
            if (target instanceof IDBTransaction &&
                (prop === 'done' || prop === 'store')) {
                return true;
            }
            return prop in target;
        },
    };
    function replaceTraps(callback) {
        idbProxyTraps = callback(idbProxyTraps);
    }
    function wrapFunction(func) {
        // Due to expected object equality (which is enforced by the caching in `wrap`), we
        // only create one new func per func.
        // Edge doesn't support objectStoreNames (booo), so we polyfill it here.
        if (func === IDBDatabase.prototype.transaction &&
            !('objectStoreNames' in IDBTransaction.prototype)) {
            return function (storeNames, ...args) {
                const tx = func.call(unwrap(this), storeNames, ...args);
                transactionStoreNamesMap.set(tx, storeNames.sort ? storeNames.sort() : [storeNames]);
                return wrap(tx);
            };
        }
        // Cursor methods are special, as the behaviour is a little more different to standard IDB. In
        // IDB, you advance the cursor and wait for a new 'success' on the IDBRequest that gave you the
        // cursor. It's kinda like a promise that can resolve with many values. That doesn't make sense
        // with real promises, so each advance methods returns a new promise for the cursor object, or
        // undefined if the end of the cursor has been reached.
        if (getCursorAdvanceMethods().includes(func)) {
            return function (...args) {
                // Calling the original function with the proxy as 'this' causes ILLEGAL INVOCATION, so we use
                // the original object.
                func.apply(unwrap(this), args);
                return wrap(cursorRequestMap.get(this));
            };
        }
        return function (...args) {
            // Calling the original function with the proxy as 'this' causes ILLEGAL INVOCATION, so we use
            // the original object.
            return wrap(func.apply(unwrap(this), args));
        };
    }
    function transformCachableValue(value) {
        if (typeof value === 'function')
            return wrapFunction(value);
        // This doesn't return, it just creates a 'done' promise for the transaction,
        // which is later returned for transaction.done (see idbObjectHandler).
        if (value instanceof IDBTransaction)
            cacheDonePromiseForTransaction(value);
        if (instanceOfAny(value, getIdbProxyableTypes()))
            return new Proxy(value, idbProxyTraps);
        // Return the same value back if we're not going to transform it.
        return value;
    }
    function wrap(value) {
        // We sometimes generate multiple promises from a single IDBRequest (eg when cursoring), because
        // IDB is weird and a single IDBRequest can yield many responses, so these can't be cached.
        if (value instanceof IDBRequest)
            return promisifyRequest(value);
        // If we've already transformed this value before, reuse the transformed value.
        // This is faster, but it also provides object equality.
        if (transformCache.has(value))
            return transformCache.get(value);
        const newValue = transformCachableValue(value);
        // Not all types are transformed.
        // These may be primitive types, so they can't be WeakMap keys.
        if (newValue !== value) {
            transformCache.set(value, newValue);
            reverseTransformCache.set(newValue, value);
        }
        return newValue;
    }
    const unwrap = (value) => reverseTransformCache.get(value);

    /**
     * Open a database.
     *
     * @param name Name of the database.
     * @param version Schema version.
     * @param callbacks Additional callbacks.
     */
    function openDB(name, version, { blocked, upgrade, blocking, terminated } = {}) {
        const request = indexedDB.open(name, version);
        const openPromise = wrap(request);
        if (upgrade) {
            request.addEventListener('upgradeneeded', (event) => {
                upgrade(wrap(request.result), event.oldVersion, event.newVersion, wrap(request.transaction), event);
            });
        }
        if (blocked) {
            request.addEventListener('blocked', (event) => blocked(
            // Casting due to https://github.com/microsoft/TypeScript-DOM-lib-generator/pull/1405
            event.oldVersion, event.newVersion, event));
        }
        openPromise
            .then((db) => {
            if (terminated)
                db.addEventListener('close', () => terminated());
            if (blocking) {
                db.addEventListener('versionchange', (event) => blocking(event.oldVersion, event.newVersion, event));
            }
        })
            .catch(() => { });
        return openPromise;
    }

    const readMethods = ['get', 'getKey', 'getAll', 'getAllKeys', 'count'];
    const writeMethods = ['put', 'add', 'delete', 'clear'];
    const cachedMethods = new Map();
    function getMethod(target, prop) {
        if (!(target instanceof IDBDatabase &&
            !(prop in target) &&
            typeof prop === 'string')) {
            return;
        }
        if (cachedMethods.get(prop))
            return cachedMethods.get(prop);
        const targetFuncName = prop.replace(/FromIndex$/, '');
        const useIndex = prop !== targetFuncName;
        const isWrite = writeMethods.includes(targetFuncName);
        if (
        // Bail if the target doesn't exist on the target. Eg, getAll isn't in Edge.
        !(targetFuncName in (useIndex ? IDBIndex : IDBObjectStore).prototype) ||
            !(isWrite || readMethods.includes(targetFuncName))) {
            return;
        }
        const method = async function (storeName, ...args) {
            // isWrite ? 'readwrite' : undefined gzipps better, but fails in Edge :(
            const tx = this.transaction(storeName, isWrite ? 'readwrite' : 'readonly');
            let target = tx.store;
            if (useIndex)
                target = target.index(args.shift());
            // Must reject if op rejects.
            // If it's a write operation, must reject if tx.done rejects.
            // Must reject with op rejection first.
            // Must resolve with op value.
            // Must handle both promises (no unhandled rejections)
            return (await Promise.all([
                target[targetFuncName](...args),
                isWrite && tx.done,
            ]))[0];
        };
        cachedMethods.set(prop, method);
        return method;
    }
    replaceTraps((oldTraps) => ({
        ...oldTraps,
        get: (target, prop, receiver) => getMethod(target, prop) || oldTraps.get(target, prop, receiver),
        has: (target, prop) => !!getMethod(target, prop) || oldTraps.has(target, prop),
    }));

    /**
     * @license
     * Copyright 2019 Google LLC
     *
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     *   http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     */
    class PlatformLoggerServiceImpl {
        constructor(container) {
            this.container = container;
        }
        // In initial implementation, this will be called by installations on
        // auth token refresh, and installations will send this string.
        getPlatformInfoString() {
            const providers = this.container.getProviders();
            // Loop through providers and get library/version pairs from any that are
            // version components.
            return providers
                .map(provider => {
                if (isVersionServiceProvider(provider)) {
                    const service = provider.getImmediate();
                    return `${service.library}/${service.version}`;
                }
                else {
                    return null;
                }
            })
                .filter(logString => logString)
                .join(' ');
        }
    }
    /**
     *
     * @param provider check if this provider provides a VersionService
     *
     * NOTE: Using Provider<'app-version'> is a hack to indicate that the provider
     * provides VersionService. The provider is not necessarily a 'app-version'
     * provider.
     */
    function isVersionServiceProvider(provider) {
        const component = provider.getComponent();
        return (component === null || component === void 0 ? void 0 : component.type) === "VERSION" /* ComponentType.VERSION */;
    }

    const name$p = "@firebase/app";
    const version$1$1 = "0.10.10";

    /**
     * @license
     * Copyright 2019 Google LLC
     *
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     *   http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     */
    const logger$1 = new Logger('@firebase/app');

    const name$o = "@firebase/app-compat";

    const name$n = "@firebase/analytics-compat";

    const name$m = "@firebase/analytics";

    const name$l = "@firebase/app-check-compat";

    const name$k = "@firebase/app-check";

    const name$j = "@firebase/auth";

    const name$i = "@firebase/auth-compat";

    const name$h = "@firebase/database";

    const name$g = "@firebase/database-compat";

    const name$f = "@firebase/functions";

    const name$e = "@firebase/functions-compat";

    const name$d = "@firebase/installations";

    const name$c = "@firebase/installations-compat";

    const name$b = "@firebase/messaging";

    const name$a = "@firebase/messaging-compat";

    const name$9 = "@firebase/performance";

    const name$8 = "@firebase/performance-compat";

    const name$7 = "@firebase/remote-config";

    const name$6 = "@firebase/remote-config-compat";

    const name$5 = "@firebase/storage";

    const name$4 = "@firebase/storage-compat";

    const name$3 = "@firebase/firestore";

    const name$2$1 = "@firebase/vertexai-preview";

    const name$1$1 = "@firebase/firestore-compat";

    const name$q = "firebase";

    /**
     * @license
     * Copyright 2019 Google LLC
     *
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     *   http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     */
    /**
     * The default app name
     *
     * @internal
     */
    const DEFAULT_ENTRY_NAME = '[DEFAULT]';
    const PLATFORM_LOG_STRING = {
        [name$p]: 'fire-core',
        [name$o]: 'fire-core-compat',
        [name$m]: 'fire-analytics',
        [name$n]: 'fire-analytics-compat',
        [name$k]: 'fire-app-check',
        [name$l]: 'fire-app-check-compat',
        [name$j]: 'fire-auth',
        [name$i]: 'fire-auth-compat',
        [name$h]: 'fire-rtdb',
        [name$g]: 'fire-rtdb-compat',
        [name$f]: 'fire-fn',
        [name$e]: 'fire-fn-compat',
        [name$d]: 'fire-iid',
        [name$c]: 'fire-iid-compat',
        [name$b]: 'fire-fcm',
        [name$a]: 'fire-fcm-compat',
        [name$9]: 'fire-perf',
        [name$8]: 'fire-perf-compat',
        [name$7]: 'fire-rc',
        [name$6]: 'fire-rc-compat',
        [name$5]: 'fire-gcs',
        [name$4]: 'fire-gcs-compat',
        [name$3]: 'fire-fst',
        [name$1$1]: 'fire-fst-compat',
        [name$2$1]: 'fire-vertex',
        'fire-js': 'fire-js',
        [name$q]: 'fire-js-all'
    };

    /**
     * @license
     * Copyright 2019 Google LLC
     *
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     *   http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     */
    /**
     * @internal
     */
    const _apps = new Map();
    /**
     * @internal
     */
    const _serverApps = new Map();
    /**
     * Registered components.
     *
     * @internal
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const _components = new Map();
    /**
     * @param component - the component being added to this app's container
     *
     * @internal
     */
    function _addComponent(app, component) {
        try {
            app.container.addComponent(component);
        }
        catch (e) {
            logger$1.debug(`Component ${component.name} failed to register with FirebaseApp ${app.name}`, e);
        }
    }
    /**
     *
     * @param component - the component to register
     * @returns whether or not the component is registered successfully
     *
     * @internal
     */
    function _registerComponent(component) {
        const componentName = component.name;
        if (_components.has(componentName)) {
            logger$1.debug(`There were multiple attempts to register component ${componentName}.`);
            return false;
        }
        _components.set(componentName, component);
        // add the component to existing app instances
        for (const app of _apps.values()) {
            _addComponent(app, component);
        }
        for (const serverApp of _serverApps.values()) {
            _addComponent(serverApp, component);
        }
        return true;
    }
    /**
     *
     * @param app - FirebaseApp instance
     * @param name - service name
     *
     * @returns the provider for the service with the matching name
     *
     * @internal
     */
    function _getProvider(app, name) {
        const heartbeatController = app.container
            .getProvider('heartbeat')
            .getImmediate({ optional: true });
        if (heartbeatController) {
            void heartbeatController.triggerHeartbeat();
        }
        return app.container.getProvider(name);
    }

    /**
     * @license
     * Copyright 2019 Google LLC
     *
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     *   http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     */
    const ERRORS$1 = {
        ["no-app" /* AppError.NO_APP */]: "No Firebase App '{$appName}' has been created - " +
            'call initializeApp() first',
        ["bad-app-name" /* AppError.BAD_APP_NAME */]: "Illegal App name: '{$appName}'",
        ["duplicate-app" /* AppError.DUPLICATE_APP */]: "Firebase App named '{$appName}' already exists with different options or config",
        ["app-deleted" /* AppError.APP_DELETED */]: "Firebase App named '{$appName}' already deleted",
        ["server-app-deleted" /* AppError.SERVER_APP_DELETED */]: 'Firebase Server App has been deleted',
        ["no-options" /* AppError.NO_OPTIONS */]: 'Need to provide options, when not being deployed to hosting via source.',
        ["invalid-app-argument" /* AppError.INVALID_APP_ARGUMENT */]: 'firebase.{$appName}() takes either no argument or a ' +
            'Firebase App instance.',
        ["invalid-log-argument" /* AppError.INVALID_LOG_ARGUMENT */]: 'First argument to `onLog` must be null or a function.',
        ["idb-open" /* AppError.IDB_OPEN */]: 'Error thrown when opening IndexedDB. Original error: {$originalErrorMessage}.',
        ["idb-get" /* AppError.IDB_GET */]: 'Error thrown when reading from IndexedDB. Original error: {$originalErrorMessage}.',
        ["idb-set" /* AppError.IDB_WRITE */]: 'Error thrown when writing to IndexedDB. Original error: {$originalErrorMessage}.',
        ["idb-delete" /* AppError.IDB_DELETE */]: 'Error thrown when deleting from IndexedDB. Original error: {$originalErrorMessage}.',
        ["finalization-registry-not-supported" /* AppError.FINALIZATION_REGISTRY_NOT_SUPPORTED */]: 'FirebaseServerApp deleteOnDeref field defined but the JS runtime does not support FinalizationRegistry.',
        ["invalid-server-app-environment" /* AppError.INVALID_SERVER_APP_ENVIRONMENT */]: 'FirebaseServerApp is not for use in browser environments.'
    };
    const ERROR_FACTORY$1 = new ErrorFactory('app', 'Firebase', ERRORS$1);

    /**
     * @license
     * Copyright 2019 Google LLC
     *
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     *   http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     */
    class FirebaseAppImpl {
        constructor(options, config, container) {
            this._isDeleted = false;
            this._options = Object.assign({}, options);
            this._config = Object.assign({}, config);
            this._name = config.name;
            this._automaticDataCollectionEnabled =
                config.automaticDataCollectionEnabled;
            this._container = container;
            this.container.addComponent(new Component('app', () => this, "PUBLIC" /* ComponentType.PUBLIC */));
        }
        get automaticDataCollectionEnabled() {
            this.checkDestroyed();
            return this._automaticDataCollectionEnabled;
        }
        set automaticDataCollectionEnabled(val) {
            this.checkDestroyed();
            this._automaticDataCollectionEnabled = val;
        }
        get name() {
            this.checkDestroyed();
            return this._name;
        }
        get options() {
            this.checkDestroyed();
            return this._options;
        }
        get config() {
            this.checkDestroyed();
            return this._config;
        }
        get container() {
            return this._container;
        }
        get isDeleted() {
            return this._isDeleted;
        }
        set isDeleted(val) {
            this._isDeleted = val;
        }
        /**
         * This function will throw an Error if the App has already been deleted -
         * use before performing API actions on the App.
         */
        checkDestroyed() {
            if (this.isDeleted) {
                throw ERROR_FACTORY$1.create("app-deleted" /* AppError.APP_DELETED */, { appName: this._name });
            }
        }
    }
    function initializeApp(_options, rawConfig = {}) {
        let options = _options;
        if (typeof rawConfig !== 'object') {
            const name = rawConfig;
            rawConfig = { name };
        }
        const config = Object.assign({ name: DEFAULT_ENTRY_NAME, automaticDataCollectionEnabled: false }, rawConfig);
        const name = config.name;
        if (typeof name !== 'string' || !name) {
            throw ERROR_FACTORY$1.create("bad-app-name" /* AppError.BAD_APP_NAME */, {
                appName: String(name)
            });
        }
        options || (options = getDefaultAppConfig());
        if (!options) {
            throw ERROR_FACTORY$1.create("no-options" /* AppError.NO_OPTIONS */);
        }
        const existingApp = _apps.get(name);
        if (existingApp) {
            // return the existing app if options and config deep equal the ones in the existing app.
            if (deepEqual(options, existingApp.options) &&
                deepEqual(config, existingApp.config)) {
                return existingApp;
            }
            else {
                throw ERROR_FACTORY$1.create("duplicate-app" /* AppError.DUPLICATE_APP */, { appName: name });
            }
        }
        const container = new ComponentContainer(name);
        for (const component of _components.values()) {
            container.addComponent(component);
        }
        const newApp = new FirebaseAppImpl(options, config, container);
        _apps.set(name, newApp);
        return newApp;
    }
    /**
     * Retrieves a {@link @firebase/app#FirebaseApp} instance.
     *
     * When called with no arguments, the default app is returned. When an app name
     * is provided, the app corresponding to that name is returned.
     *
     * An exception is thrown if the app being retrieved has not yet been
     * initialized.
     *
     * @example
     * ```javascript
     * // Return the default app
     * const app = getApp();
     * ```
     *
     * @example
     * ```javascript
     * // Return a named app
     * const otherApp = getApp("otherApp");
     * ```
     *
     * @param name - Optional name of the app to return. If no name is
     *   provided, the default is `"[DEFAULT]"`.
     *
     * @returns The app corresponding to the provided app name.
     *   If no app name is provided, the default app is returned.
     *
     * @public
     */
    function getApp(name = DEFAULT_ENTRY_NAME) {
        const app = _apps.get(name);
        if (!app && name === DEFAULT_ENTRY_NAME && getDefaultAppConfig()) {
            return initializeApp();
        }
        if (!app) {
            throw ERROR_FACTORY$1.create("no-app" /* AppError.NO_APP */, { appName: name });
        }
        return app;
    }
    /**
     * Registers a library's name and version for platform logging purposes.
     * @param library - Name of 1p or 3p library (e.g. firestore, angularfire)
     * @param version - Current version of that library.
     * @param variant - Bundle variant, e.g., node, rn, etc.
     *
     * @public
     */
    function registerVersion(libraryKeyOrName, version, variant) {
        var _a;
        // TODO: We can use this check to whitelist strings when/if we set up
        // a good whitelist system.
        let library = (_a = PLATFORM_LOG_STRING[libraryKeyOrName]) !== null && _a !== void 0 ? _a : libraryKeyOrName;
        if (variant) {
            library += `-${variant}`;
        }
        const libraryMismatch = library.match(/\s|\//);
        const versionMismatch = version.match(/\s|\//);
        if (libraryMismatch || versionMismatch) {
            const warning = [
                `Unable to register library "${library}" with version "${version}":`
            ];
            if (libraryMismatch) {
                warning.push(`library name "${library}" contains illegal characters (whitespace or "/")`);
            }
            if (libraryMismatch && versionMismatch) {
                warning.push('and');
            }
            if (versionMismatch) {
                warning.push(`version name "${version}" contains illegal characters (whitespace or "/")`);
            }
            logger$1.warn(warning.join(' '));
            return;
        }
        _registerComponent(new Component(`${library}-version`, () => ({ library, version }), "VERSION" /* ComponentType.VERSION */));
    }

    /**
     * @license
     * Copyright 2021 Google LLC
     *
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     *   http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     */
    const DB_NAME$1 = 'firebase-heartbeat-database';
    const DB_VERSION$1 = 1;
    const STORE_NAME$1 = 'firebase-heartbeat-store';
    let dbPromise$1 = null;
    function getDbPromise() {
        if (!dbPromise$1) {
            dbPromise$1 = openDB(DB_NAME$1, DB_VERSION$1, {
                upgrade: (db, oldVersion) => {
                    // We don't use 'break' in this switch statement, the fall-through
                    // behavior is what we want, because if there are multiple versions between
                    // the old version and the current version, we want ALL the migrations
                    // that correspond to those versions to run, not only the last one.
                    // eslint-disable-next-line default-case
                    switch (oldVersion) {
                        case 0:
                            try {
                                db.createObjectStore(STORE_NAME$1);
                            }
                            catch (e) {
                                // Safari/iOS browsers throw occasional exceptions on
                                // db.createObjectStore() that may be a bug. Avoid blocking
                                // the rest of the app functionality.
                                console.warn(e);
                            }
                    }
                }
            }).catch(e => {
                throw ERROR_FACTORY$1.create("idb-open" /* AppError.IDB_OPEN */, {
                    originalErrorMessage: e.message
                });
            });
        }
        return dbPromise$1;
    }
    async function readHeartbeatsFromIndexedDB(app) {
        try {
            const db = await getDbPromise();
            const tx = db.transaction(STORE_NAME$1);
            const result = await tx.objectStore(STORE_NAME$1).get(computeKey$1(app));
            // We already have the value but tx.done can throw,
            // so we need to await it here to catch errors
            await tx.done;
            return result;
        }
        catch (e) {
            if (e instanceof FirebaseError) {
                logger$1.warn(e.message);
            }
            else {
                const idbGetError = ERROR_FACTORY$1.create("idb-get" /* AppError.IDB_GET */, {
                    originalErrorMessage: e === null || e === void 0 ? void 0 : e.message
                });
                logger$1.warn(idbGetError.message);
            }
        }
    }
    async function writeHeartbeatsToIndexedDB(app, heartbeatObject) {
        try {
            const db = await getDbPromise();
            const tx = db.transaction(STORE_NAME$1, 'readwrite');
            const objectStore = tx.objectStore(STORE_NAME$1);
            await objectStore.put(heartbeatObject, computeKey$1(app));
            await tx.done;
        }
        catch (e) {
            if (e instanceof FirebaseError) {
                logger$1.warn(e.message);
            }
            else {
                const idbGetError = ERROR_FACTORY$1.create("idb-set" /* AppError.IDB_WRITE */, {
                    originalErrorMessage: e === null || e === void 0 ? void 0 : e.message
                });
                logger$1.warn(idbGetError.message);
            }
        }
    }
    function computeKey$1(app) {
        return `${app.name}!${app.options.appId}`;
    }

    /**
     * @license
     * Copyright 2021 Google LLC
     *
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     *   http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     */
    const MAX_HEADER_BYTES = 1024;
    // 30 days
    const STORED_HEARTBEAT_RETENTION_MAX_MILLIS = 30 * 24 * 60 * 60 * 1000;
    class HeartbeatServiceImpl {
        constructor(container) {
            this.container = container;
            /**
             * In-memory cache for heartbeats, used by getHeartbeatsHeader() to generate
             * the header string.
             * Stores one record per date. This will be consolidated into the standard
             * format of one record per user agent string before being sent as a header.
             * Populated from indexedDB when the controller is instantiated and should
             * be kept in sync with indexedDB.
             * Leave public for easier testing.
             */
            this._heartbeatsCache = null;
            const app = this.container.getProvider('app').getImmediate();
            this._storage = new HeartbeatStorageImpl(app);
            this._heartbeatsCachePromise = this._storage.read().then(result => {
                this._heartbeatsCache = result;
                return result;
            });
        }
        /**
         * Called to report a heartbeat. The function will generate
         * a HeartbeatsByUserAgent object, update heartbeatsCache, and persist it
         * to IndexedDB.
         * Note that we only store one heartbeat per day. So if a heartbeat for today is
         * already logged, subsequent calls to this function in the same day will be ignored.
         */
        async triggerHeartbeat() {
            var _a, _b;
            try {
                const platformLogger = this.container
                    .getProvider('platform-logger')
                    .getImmediate();
                // This is the "Firebase user agent" string from the platform logger
                // service, not the browser user agent.
                const agent = platformLogger.getPlatformInfoString();
                const date = getUTCDateString();
                if (((_a = this._heartbeatsCache) === null || _a === void 0 ? void 0 : _a.heartbeats) == null) {
                    this._heartbeatsCache = await this._heartbeatsCachePromise;
                    // If we failed to construct a heartbeats cache, then return immediately.
                    if (((_b = this._heartbeatsCache) === null || _b === void 0 ? void 0 : _b.heartbeats) == null) {
                        return;
                    }
                }
                // Do not store a heartbeat if one is already stored for this day
                // or if a header has already been sent today.
                if (this._heartbeatsCache.lastSentHeartbeatDate === date ||
                    this._heartbeatsCache.heartbeats.some(singleDateHeartbeat => singleDateHeartbeat.date === date)) {
                    return;
                }
                else {
                    // There is no entry for this date. Create one.
                    this._heartbeatsCache.heartbeats.push({ date, agent });
                }
                // Remove entries older than 30 days.
                this._heartbeatsCache.heartbeats =
                    this._heartbeatsCache.heartbeats.filter(singleDateHeartbeat => {
                        const hbTimestamp = new Date(singleDateHeartbeat.date).valueOf();
                        const now = Date.now();
                        return now - hbTimestamp <= STORED_HEARTBEAT_RETENTION_MAX_MILLIS;
                    });
                return this._storage.overwrite(this._heartbeatsCache);
            }
            catch (e) {
                logger$1.warn(e);
            }
        }
        /**
         * Returns a base64 encoded string which can be attached to the heartbeat-specific header directly.
         * It also clears all heartbeats from memory as well as in IndexedDB.
         *
         * NOTE: Consuming product SDKs should not send the header if this method
         * returns an empty string.
         */
        async getHeartbeatsHeader() {
            var _a;
            try {
                if (this._heartbeatsCache === null) {
                    await this._heartbeatsCachePromise;
                }
                // If it's still null or the array is empty, there is no data to send.
                if (((_a = this._heartbeatsCache) === null || _a === void 0 ? void 0 : _a.heartbeats) == null ||
                    this._heartbeatsCache.heartbeats.length === 0) {
                    return '';
                }
                const date = getUTCDateString();
                // Extract as many heartbeats from the cache as will fit under the size limit.
                const { heartbeatsToSend, unsentEntries } = extractHeartbeatsForHeader(this._heartbeatsCache.heartbeats);
                const headerString = base64urlEncodeWithoutPadding(JSON.stringify({ version: 2, heartbeats: heartbeatsToSend }));
                // Store last sent date to prevent another being logged/sent for the same day.
                this._heartbeatsCache.lastSentHeartbeatDate = date;
                if (unsentEntries.length > 0) {
                    // Store any unsent entries if they exist.
                    this._heartbeatsCache.heartbeats = unsentEntries;
                    // This seems more likely than emptying the array (below) to lead to some odd state
                    // since the cache isn't empty and this will be called again on the next request,
                    // and is probably safest if we await it.
                    await this._storage.overwrite(this._heartbeatsCache);
                }
                else {
                    this._heartbeatsCache.heartbeats = [];
                    // Do not wait for this, to reduce latency.
                    void this._storage.overwrite(this._heartbeatsCache);
                }
                return headerString;
            }
            catch (e) {
                logger$1.warn(e);
                return '';
            }
        }
    }
    function getUTCDateString() {
        const today = new Date();
        // Returns date format 'YYYY-MM-DD'
        return today.toISOString().substring(0, 10);
    }
    function extractHeartbeatsForHeader(heartbeatsCache, maxSize = MAX_HEADER_BYTES) {
        // Heartbeats grouped by user agent in the standard format to be sent in
        // the header.
        const heartbeatsToSend = [];
        // Single date format heartbeats that are not sent.
        let unsentEntries = heartbeatsCache.slice();
        for (const singleDateHeartbeat of heartbeatsCache) {
            // Look for an existing entry with the same user agent.
            const heartbeatEntry = heartbeatsToSend.find(hb => hb.agent === singleDateHeartbeat.agent);
            if (!heartbeatEntry) {
                // If no entry for this user agent exists, create one.
                heartbeatsToSend.push({
                    agent: singleDateHeartbeat.agent,
                    dates: [singleDateHeartbeat.date]
                });
                if (countBytes(heartbeatsToSend) > maxSize) {
                    // If the header would exceed max size, remove the added heartbeat
                    // entry and stop adding to the header.
                    heartbeatsToSend.pop();
                    break;
                }
            }
            else {
                heartbeatEntry.dates.push(singleDateHeartbeat.date);
                // If the header would exceed max size, remove the added date
                // and stop adding to the header.
                if (countBytes(heartbeatsToSend) > maxSize) {
                    heartbeatEntry.dates.pop();
                    break;
                }
            }
            // Pop unsent entry from queue. (Skipped if adding the entry exceeded
            // quota and the loop breaks early.)
            unsentEntries = unsentEntries.slice(1);
        }
        return {
            heartbeatsToSend,
            unsentEntries
        };
    }
    class HeartbeatStorageImpl {
        constructor(app) {
            this.app = app;
            this._canUseIndexedDBPromise = this.runIndexedDBEnvironmentCheck();
        }
        async runIndexedDBEnvironmentCheck() {
            if (!isIndexedDBAvailable()) {
                return false;
            }
            else {
                return validateIndexedDBOpenable()
                    .then(() => true)
                    .catch(() => false);
            }
        }
        /**
         * Read all heartbeats.
         */
        async read() {
            const canUseIndexedDB = await this._canUseIndexedDBPromise;
            if (!canUseIndexedDB) {
                return { heartbeats: [] };
            }
            else {
                const idbHeartbeatObject = await readHeartbeatsFromIndexedDB(this.app);
                if (idbHeartbeatObject === null || idbHeartbeatObject === void 0 ? void 0 : idbHeartbeatObject.heartbeats) {
                    return idbHeartbeatObject;
                }
                else {
                    return { heartbeats: [] };
                }
            }
        }
        // overwrite the storage with the provided heartbeats
        async overwrite(heartbeatsObject) {
            var _a;
            const canUseIndexedDB = await this._canUseIndexedDBPromise;
            if (!canUseIndexedDB) {
                return;
            }
            else {
                const existingHeartbeatsObject = await this.read();
                return writeHeartbeatsToIndexedDB(this.app, {
                    lastSentHeartbeatDate: (_a = heartbeatsObject.lastSentHeartbeatDate) !== null && _a !== void 0 ? _a : existingHeartbeatsObject.lastSentHeartbeatDate,
                    heartbeats: heartbeatsObject.heartbeats
                });
            }
        }
        // add heartbeats
        async add(heartbeatsObject) {
            var _a;
            const canUseIndexedDB = await this._canUseIndexedDBPromise;
            if (!canUseIndexedDB) {
                return;
            }
            else {
                const existingHeartbeatsObject = await this.read();
                return writeHeartbeatsToIndexedDB(this.app, {
                    lastSentHeartbeatDate: (_a = heartbeatsObject.lastSentHeartbeatDate) !== null && _a !== void 0 ? _a : existingHeartbeatsObject.lastSentHeartbeatDate,
                    heartbeats: [
                        ...existingHeartbeatsObject.heartbeats,
                        ...heartbeatsObject.heartbeats
                    ]
                });
            }
        }
    }
    /**
     * Calculate bytes of a HeartbeatsByUserAgent array after being wrapped
     * in a platform logging header JSON object, stringified, and converted
     * to base 64.
     */
    function countBytes(heartbeatsCache) {
        // base64 has a restricted set of characters, all of which should be 1 byte.
        return base64urlEncodeWithoutPadding(
        // heartbeatsCache wrapper properties
        JSON.stringify({ version: 2, heartbeats: heartbeatsCache })).length;
    }

    /**
     * @license
     * Copyright 2019 Google LLC
     *
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     *   http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     */
    function registerCoreComponents(variant) {
        _registerComponent(new Component('platform-logger', container => new PlatformLoggerServiceImpl(container), "PRIVATE" /* ComponentType.PRIVATE */));
        _registerComponent(new Component('heartbeat', container => new HeartbeatServiceImpl(container), "PRIVATE" /* ComponentType.PRIVATE */));
        // Register `app` package.
        registerVersion(name$p, version$1$1, variant);
        // BUILD_TARGET will be replaced by values like esm5, esm2017, cjs5, etc during the compilation
        registerVersion(name$p, version$1$1, 'esm2017');
        // Register platform SDK identifier (no version).
        registerVersion('fire-js', '');
    }

    /**
     * Firebase App
     *
     * @remarks This package coordinates the communication between the different Firebase components
     * @packageDocumentation
     */
    registerCoreComponents('');

    var name$2 = "firebase";
    var version$2 = "10.13.1";

    /**
     * @license
     * Copyright 2020 Google LLC
     *
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     *   http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     */
    registerVersion(name$2, version$2, 'app');

    /******************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */
    /* global Reflect, Promise, SuppressedError, Symbol, Iterator */


    function __await(v) {
      return this instanceof __await ? (this.v = v, this) : new __await(v);
    }

    function __asyncGenerator(thisArg, _arguments, generator) {
      if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
      var g = generator.apply(thisArg, _arguments || []), i, q = [];
      return i = Object.create((typeof AsyncIterator === "function" ? AsyncIterator : Object).prototype), verb("next"), verb("throw"), verb("return", awaitReturn), i[Symbol.asyncIterator] = function () { return this; }, i;
      function awaitReturn(f) { return function (v) { return Promise.resolve(v).then(f, reject); }; }
      function verb(n, f) { if (g[n]) { i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; if (f) i[n] = f(i[n]); } }
      function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
      function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
      function fulfill(value) { resume("next", value); }
      function reject(value) { resume("throw", value); }
      function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
    }

    typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
      var e = new Error(message);
      return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
    };

    var name$1 = "@firebase/vertexai-preview";
    var version$1 = "0.0.3";

    /**
     * @license
     * Copyright 2024 Google LLC
     *
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     *   http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     */
    const VERTEX_TYPE = 'vertexAI';
    const DEFAULT_LOCATION = 'us-central1';
    const DEFAULT_BASE_URL = 'https://firebaseml.googleapis.com';
    const DEFAULT_API_VERSION = 'v2beta';
    const PACKAGE_VERSION = version$1;
    const LANGUAGE_TAG = 'gl-js';

    /**
     * @license
     * Copyright 2024 Google LLC
     *
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     *   http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     */
    class VertexAIService {
        constructor(app, authProvider, appCheckProvider, options) {
            var _a;
            this.app = app;
            this.options = options;
            const appCheck = appCheckProvider === null || appCheckProvider === void 0 ? void 0 : appCheckProvider.getImmediate({ optional: true });
            const auth = authProvider === null || authProvider === void 0 ? void 0 : authProvider.getImmediate({ optional: true });
            this.auth = auth || null;
            this.appCheck = appCheck || null;
            this.location = ((_a = this.options) === null || _a === void 0 ? void 0 : _a.location) || DEFAULT_LOCATION;
        }
        _delete() {
            return Promise.resolve();
        }
    }

    /**
     * @license
     * Copyright 2024 Google LLC
     *
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     *   http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     */
    /**
     * Error class for the Vertex AI for Firebase SDK.
     *
     * @public
     */
    class VertexAIError extends FirebaseError {
        /**
         * Constructs a new instance of the `VertexAIError` class.
         *
         * @param code - The error code from {@link VertexAIErrorCode}.
         * @param message - A human-readable message describing the error.
         * @param customErrorData - Optional error data.
         */
        constructor(code, message, customErrorData) {
            // Match error format used by FirebaseError from ErrorFactory
            const service = VERTEX_TYPE;
            const serviceName = 'VertexAI';
            const fullCode = `${service}/${code}`;
            const fullMessage = `${serviceName}: ${message} (${fullCode}).`;
            super(fullCode, fullMessage);
            this.code = code;
            this.message = message;
            this.customErrorData = customErrorData;
            // FirebaseError initializes a stack trace, but it assumes the error is created from the error
            // factory. Since we break this assumption, we set the stack trace to be originating from this
            // constructor.
            // This is only supported in V8.
            if (Error.captureStackTrace) {
                // Allows us to initialize the stack trace without including the constructor itself at the
                // top level of the stack trace.
                Error.captureStackTrace(this, VertexAIError);
            }
            // Allows instanceof VertexAIError in ES5/ES6
            // https://github.com/Microsoft/TypeScript-wiki/blob/master/Breaking-Changes.md#extending-built-ins-like-error-array-and-map-may-no-longer-work
            Object.setPrototypeOf(this, VertexAIError.prototype);
            // Since Error is an interface, we don't inherit toString and so we define it ourselves.
            this.toString = () => fullMessage;
        }
    }

    /**
     * @license
     * Copyright 2024 Google LLC
     *
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     *   http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     */
    var Task;
    (function (Task) {
        Task["GENERATE_CONTENT"] = "generateContent";
        Task["STREAM_GENERATE_CONTENT"] = "streamGenerateContent";
        Task["COUNT_TOKENS"] = "countTokens";
    })(Task || (Task = {}));
    class RequestUrl {
        constructor(model, task, apiSettings, stream, requestOptions) {
            this.model = model;
            this.task = task;
            this.apiSettings = apiSettings;
            this.stream = stream;
            this.requestOptions = requestOptions;
        }
        toString() {
            var _a;
            // TODO: allow user-set option if that feature becomes available
            const apiVersion = DEFAULT_API_VERSION;
            const baseUrl = ((_a = this.requestOptions) === null || _a === void 0 ? void 0 : _a.baseUrl) || DEFAULT_BASE_URL;
            let url = `${baseUrl}/${apiVersion}`;
            url += `/projects/${this.apiSettings.project}`;
            url += `/locations/${this.apiSettings.location}`;
            url += `/${this.model}`;
            url += `:${this.task}`;
            if (this.stream) {
                url += '?alt=sse';
            }
            return url;
        }
        /**
         * If the model needs to be passed to the backend, it needs to
         * include project and location path.
         */
        get fullModelString() {
            let modelString = `projects/${this.apiSettings.project}`;
            modelString += `/locations/${this.apiSettings.location}`;
            modelString += `/${this.model}`;
            return modelString;
        }
    }
    /**
     * Log language and "fire/version" to x-goog-api-client
     */
    function getClientHeaders() {
        const loggingTags = [];
        loggingTags.push(`${LANGUAGE_TAG}/${PACKAGE_VERSION}`);
        loggingTags.push(`fire/${PACKAGE_VERSION}`);
        return loggingTags.join(' ');
    }
    async function getHeaders(url) {
        const headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('x-goog-api-client', getClientHeaders());
        headers.append('x-goog-api-key', url.apiSettings.apiKey);
        if (url.apiSettings.getAppCheckToken) {
            const appCheckToken = await url.apiSettings.getAppCheckToken();
            if (appCheckToken && !appCheckToken.error) {
                headers.append('X-Firebase-AppCheck', appCheckToken.token);
            }
        }
        if (url.apiSettings.getAuthToken) {
            const authToken = await url.apiSettings.getAuthToken();
            if (authToken) {
                headers.append('Authorization', `Firebase ${authToken.accessToken}`);
            }
        }
        return headers;
    }
    async function constructRequest(model, task, apiSettings, stream, body, requestOptions) {
        const url = new RequestUrl(model, task, apiSettings, stream, requestOptions);
        return {
            url: url.toString(),
            fetchOptions: Object.assign(Object.assign({}, buildFetchOptions(requestOptions)), { method: 'POST', headers: await getHeaders(url), body })
        };
    }
    async function makeRequest(model, task, apiSettings, stream, body, requestOptions) {
        const url = new RequestUrl(model, task, apiSettings, stream, requestOptions);
        let response;
        try {
            const request = await constructRequest(model, task, apiSettings, stream, body, requestOptions);
            response = await fetch(request.url, request.fetchOptions);
            if (!response.ok) {
                let message = '';
                let errorDetails;
                try {
                    const json = await response.json();
                    message = json.error.message;
                    if (json.error.details) {
                        message += ` ${JSON.stringify(json.error.details)}`;
                        errorDetails = json.error.details;
                    }
                }
                catch (e) {
                    // ignored
                }
                throw new VertexAIError("fetch-error" /* VertexAIErrorCode.FETCH_ERROR */, `Error fetching from ${url}: [${response.status} ${response.statusText}] ${message}`, {
                    status: response.status,
                    statusText: response.statusText,
                    errorDetails
                });
            }
        }
        catch (e) {
            let err = e;
            if (e.code !== "fetch-error" /* VertexAIErrorCode.FETCH_ERROR */ &&
                e instanceof Error) {
                err = new VertexAIError("error" /* VertexAIErrorCode.ERROR */, `Error fetching from ${url.toString()}: ${e.message}`);
                err.stack = e.stack;
            }
            throw err;
        }
        return response;
    }
    /**
     * Generates the request options to be passed to the fetch API.
     * @param requestOptions - The user-defined request options.
     * @returns The generated request options.
     */
    function buildFetchOptions(requestOptions) {
        const fetchOptions = {};
        if ((requestOptions === null || requestOptions === void 0 ? void 0 : requestOptions.timeout) && (requestOptions === null || requestOptions === void 0 ? void 0 : requestOptions.timeout) >= 0) {
            const abortController = new AbortController();
            const signal = abortController.signal;
            setTimeout(() => abortController.abort(), requestOptions.timeout);
            fetchOptions.signal = signal;
        }
        return fetchOptions;
    }

    /**
     * @license
     * Copyright 2024 Google LLC
     *
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     *   http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     */
    /**
     * Possible roles.
     * @public
     */
    const POSSIBLE_ROLES = ['user', 'model', 'function', 'system'];
    /**
     * Harm categories that would cause prompts or candidates to be blocked.
     * @public
     */
    var HarmCategory;
    (function (HarmCategory) {
        HarmCategory["HARM_CATEGORY_UNSPECIFIED"] = "HARM_CATEGORY_UNSPECIFIED";
        HarmCategory["HARM_CATEGORY_HATE_SPEECH"] = "HARM_CATEGORY_HATE_SPEECH";
        HarmCategory["HARM_CATEGORY_SEXUALLY_EXPLICIT"] = "HARM_CATEGORY_SEXUALLY_EXPLICIT";
        HarmCategory["HARM_CATEGORY_HARASSMENT"] = "HARM_CATEGORY_HARASSMENT";
        HarmCategory["HARM_CATEGORY_DANGEROUS_CONTENT"] = "HARM_CATEGORY_DANGEROUS_CONTENT";
    })(HarmCategory || (HarmCategory = {}));
    /**
     * Threshold above which a prompt or candidate will be blocked.
     * @public
     */
    var HarmBlockThreshold;
    (function (HarmBlockThreshold) {
        // Threshold is unspecified.
        HarmBlockThreshold["HARM_BLOCK_THRESHOLD_UNSPECIFIED"] = "HARM_BLOCK_THRESHOLD_UNSPECIFIED";
        // Content with NEGLIGIBLE will be allowed.
        HarmBlockThreshold["BLOCK_LOW_AND_ABOVE"] = "BLOCK_LOW_AND_ABOVE";
        // Content with NEGLIGIBLE and LOW will be allowed.
        HarmBlockThreshold["BLOCK_MEDIUM_AND_ABOVE"] = "BLOCK_MEDIUM_AND_ABOVE";
        // Content with NEGLIGIBLE, LOW, and MEDIUM will be allowed.
        HarmBlockThreshold["BLOCK_ONLY_HIGH"] = "BLOCK_ONLY_HIGH";
        // All content will be allowed.
        HarmBlockThreshold["BLOCK_NONE"] = "BLOCK_NONE";
    })(HarmBlockThreshold || (HarmBlockThreshold = {}));
    /**
     * @public
     */
    var HarmBlockMethod;
    (function (HarmBlockMethod) {
        // The harm block method is unspecified.
        HarmBlockMethod["HARM_BLOCK_METHOD_UNSPECIFIED"] = "HARM_BLOCK_METHOD_UNSPECIFIED";
        // The harm block method uses both probability and severity scores.
        HarmBlockMethod["SEVERITY"] = "SEVERITY";
        // The harm block method uses the probability score.
        HarmBlockMethod["PROBABILITY"] = "PROBABILITY";
    })(HarmBlockMethod || (HarmBlockMethod = {}));
    /**
     * Probability that a prompt or candidate matches a harm category.
     * @public
     */
    var HarmProbability;
    (function (HarmProbability) {
        // Probability is unspecified.
        HarmProbability["HARM_PROBABILITY_UNSPECIFIED"] = "HARM_PROBABILITY_UNSPECIFIED";
        // Content has a negligible chance of being unsafe.
        HarmProbability["NEGLIGIBLE"] = "NEGLIGIBLE";
        // Content has a low chance of being unsafe.
        HarmProbability["LOW"] = "LOW";
        // Content has a medium chance of being unsafe.
        HarmProbability["MEDIUM"] = "MEDIUM";
        // Content has a high chance of being unsafe.
        HarmProbability["HIGH"] = "HIGH";
    })(HarmProbability || (HarmProbability = {}));
    /**
     * Harm severity levels.
     * @public
     */
    var HarmSeverity;
    (function (HarmSeverity) {
        // Harm severity unspecified.
        HarmSeverity["HARM_SEVERITY_UNSPECIFIED"] = "HARM_SEVERITY_UNSPECIFIED";
        // Negligible level of harm severity.
        HarmSeverity["HARM_SEVERITY_NEGLIGIBLE"] = "HARM_SEVERITY_NEGLIGIBLE";
        // Low level of harm severity.
        HarmSeverity["HARM_SEVERITY_LOW"] = "HARM_SEVERITY_LOW";
        // Medium level of harm severity.
        HarmSeverity["HARM_SEVERITY_MEDIUM"] = "HARM_SEVERITY_MEDIUM";
        // High level of harm severity.
        HarmSeverity["HARM_SEVERITY_HIGH"] = "HARM_SEVERITY_HIGH";
    })(HarmSeverity || (HarmSeverity = {}));
    /**
     * Reason that a prompt was blocked.
     * @public
     */
    var BlockReason;
    (function (BlockReason) {
        // A blocked reason was not specified.
        BlockReason["BLOCKED_REASON_UNSPECIFIED"] = "BLOCKED_REASON_UNSPECIFIED";
        // Content was blocked by safety settings.
        BlockReason["SAFETY"] = "SAFETY";
        // Content was blocked, but the reason is uncategorized.
        BlockReason["OTHER"] = "OTHER";
    })(BlockReason || (BlockReason = {}));
    /**
     * Reason that a candidate finished.
     * @public
     */
    var FinishReason;
    (function (FinishReason) {
        // Default value. This value is unused.
        FinishReason["FINISH_REASON_UNSPECIFIED"] = "FINISH_REASON_UNSPECIFIED";
        // Natural stop point of the model or provided stop sequence.
        FinishReason["STOP"] = "STOP";
        // The maximum number of tokens as specified in the request was reached.
        FinishReason["MAX_TOKENS"] = "MAX_TOKENS";
        // The candidate content was flagged for safety reasons.
        FinishReason["SAFETY"] = "SAFETY";
        // The candidate content was flagged for recitation reasons.
        FinishReason["RECITATION"] = "RECITATION";
        // Unknown reason.
        FinishReason["OTHER"] = "OTHER";
    })(FinishReason || (FinishReason = {}));
    /**
     * @public
     */
    var FunctionCallingMode;
    (function (FunctionCallingMode) {
        // Unspecified function calling mode. This value should not be used.
        FunctionCallingMode["MODE_UNSPECIFIED"] = "MODE_UNSPECIFIED";
        // Default model behavior, model decides to predict either a function call
        // or a natural language repspose.
        FunctionCallingMode["AUTO"] = "AUTO";
        // Model is constrained to always predicting a function call only.
        // If "allowed_function_names" is set, the predicted function call will be
        // limited to any one of "allowed_function_names", else the predicted
        // function call will be any one of the provided "function_declarations".
        FunctionCallingMode["ANY"] = "ANY";
        // Model will not predict any function call. Model behavior is same as when
        // not passing any function declarations.
        FunctionCallingMode["NONE"] = "NONE";
    })(FunctionCallingMode || (FunctionCallingMode = {}));

    /**
     * @license
     * Copyright 2024 Google LLC
     *
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     *   http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     */
    /**
     * Contains the list of OpenAPI data types
     * as defined by https://swagger.io/docs/specification/data-models/data-types/
     * @public
     */
    var FunctionDeclarationSchemaType;
    (function (FunctionDeclarationSchemaType) {
        /** String type. */
        FunctionDeclarationSchemaType["STRING"] = "STRING";
        /** Number type. */
        FunctionDeclarationSchemaType["NUMBER"] = "NUMBER";
        /** Integer type. */
        FunctionDeclarationSchemaType["INTEGER"] = "INTEGER";
        /** Boolean type. */
        FunctionDeclarationSchemaType["BOOLEAN"] = "BOOLEAN";
        /** Array type. */
        FunctionDeclarationSchemaType["ARRAY"] = "ARRAY";
        /** Object type. */
        FunctionDeclarationSchemaType["OBJECT"] = "OBJECT";
    })(FunctionDeclarationSchemaType || (FunctionDeclarationSchemaType = {}));

    /**
     * @license
     * Copyright 2024 Google LLC
     *
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     *   http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     */
    /**
     * Adds convenience helper methods to a response object, including stream
     * chunks (as long as each chunk is a complete GenerateContentResponse JSON).
     */
    function addHelpers(response) {
        response.text = () => {
            if (response.candidates && response.candidates.length > 0) {
                if (response.candidates.length > 1) {
                    console.warn(`This response had ${response.candidates.length} ` +
                        `candidates. Returning text from the first candidate only. ` +
                        `Access response.candidates directly to use the other candidates.`);
                }
                if (hadBadFinishReason(response.candidates[0])) {
                    throw new VertexAIError("response-error" /* VertexAIErrorCode.RESPONSE_ERROR */, `Response error: ${formatBlockErrorMessage(response)}. Response body stored in error.response`, {
                        response
                    });
                }
                return getText(response);
            }
            else if (response.promptFeedback) {
                throw new VertexAIError("response-error" /* VertexAIErrorCode.RESPONSE_ERROR */, `Text not available. ${formatBlockErrorMessage(response)}`, {
                    response
                });
            }
            return '';
        };
        response.functionCalls = () => {
            if (response.candidates && response.candidates.length > 0) {
                if (response.candidates.length > 1) {
                    console.warn(`This response had ${response.candidates.length} ` +
                        `candidates. Returning function calls from the first candidate only. ` +
                        `Access response.candidates directly to use the other candidates.`);
                }
                if (hadBadFinishReason(response.candidates[0])) {
                    throw new VertexAIError("response-error" /* VertexAIErrorCode.RESPONSE_ERROR */, `Response error: ${formatBlockErrorMessage(response)}. Response body stored in error.response`, {
                        response
                    });
                }
                return getFunctionCalls(response);
            }
            else if (response.promptFeedback) {
                throw new VertexAIError("response-error" /* VertexAIErrorCode.RESPONSE_ERROR */, `Function call not available. ${formatBlockErrorMessage(response)}`, {
                    response
                });
            }
            return undefined;
        };
        return response;
    }
    /**
     * Returns all text found in all parts of first candidate.
     */
    function getText(response) {
        var _a, _b, _c, _d;
        const textStrings = [];
        if ((_b = (_a = response.candidates) === null || _a === void 0 ? void 0 : _a[0].content) === null || _b === void 0 ? void 0 : _b.parts) {
            for (const part of (_d = (_c = response.candidates) === null || _c === void 0 ? void 0 : _c[0].content) === null || _d === void 0 ? void 0 : _d.parts) {
                if (part.text) {
                    textStrings.push(part.text);
                }
            }
        }
        if (textStrings.length > 0) {
            return textStrings.join('');
        }
        else {
            return '';
        }
    }
    /**
     * Returns {@link FunctionCall}s associated with first candidate.
     */
    function getFunctionCalls(response) {
        var _a, _b, _c, _d;
        const functionCalls = [];
        if ((_b = (_a = response.candidates) === null || _a === void 0 ? void 0 : _a[0].content) === null || _b === void 0 ? void 0 : _b.parts) {
            for (const part of (_d = (_c = response.candidates) === null || _c === void 0 ? void 0 : _c[0].content) === null || _d === void 0 ? void 0 : _d.parts) {
                if (part.functionCall) {
                    functionCalls.push(part.functionCall);
                }
            }
        }
        if (functionCalls.length > 0) {
            return functionCalls;
        }
        else {
            return undefined;
        }
    }
    const badFinishReasons = [FinishReason.RECITATION, FinishReason.SAFETY];
    function hadBadFinishReason(candidate) {
        return (!!candidate.finishReason &&
            badFinishReasons.includes(candidate.finishReason));
    }
    function formatBlockErrorMessage(response) {
        var _a, _b, _c;
        let message = '';
        if ((!response.candidates || response.candidates.length === 0) &&
            response.promptFeedback) {
            message += 'Response was blocked';
            if ((_a = response.promptFeedback) === null || _a === void 0 ? void 0 : _a.blockReason) {
                message += ` due to ${response.promptFeedback.blockReason}`;
            }
            if ((_b = response.promptFeedback) === null || _b === void 0 ? void 0 : _b.blockReasonMessage) {
                message += `: ${response.promptFeedback.blockReasonMessage}`;
            }
        }
        else if ((_c = response.candidates) === null || _c === void 0 ? void 0 : _c[0]) {
            const firstCandidate = response.candidates[0];
            if (hadBadFinishReason(firstCandidate)) {
                message += `Candidate was blocked due to ${firstCandidate.finishReason}`;
                if (firstCandidate.finishMessage) {
                    message += `: ${firstCandidate.finishMessage}`;
                }
            }
        }
        return message;
    }

    /**
     * @license
     * Copyright 2024 Google LLC
     *
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     *   http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     */
    const responseLineRE = /^data\: (.*)(?:\n\n|\r\r|\r\n\r\n)/;
    /**
     * Process a response.body stream from the backend and return an
     * iterator that provides one complete GenerateContentResponse at a time
     * and a promise that resolves with a single aggregated
     * GenerateContentResponse.
     *
     * @param response - Response from a fetch call
     */
    function processStream(response) {
        const inputStream = response.body.pipeThrough(new TextDecoderStream('utf8', { fatal: true }));
        const responseStream = getResponseStream(inputStream);
        const [stream1, stream2] = responseStream.tee();
        return {
            stream: generateResponseSequence(stream1),
            response: getResponsePromise(stream2)
        };
    }
    async function getResponsePromise(stream) {
        const allResponses = [];
        const reader = stream.getReader();
        while (true) {
            const { done, value } = await reader.read();
            if (done) {
                return addHelpers(aggregateResponses(allResponses));
            }
            allResponses.push(value);
        }
    }
    function generateResponseSequence(stream) {
        return __asyncGenerator(this, arguments, function* generateResponseSequence_1() {
            const reader = stream.getReader();
            while (true) {
                const { value, done } = yield __await(reader.read());
                if (done) {
                    break;
                }
                yield yield __await(addHelpers(value));
            }
        });
    }
    /**
     * Reads a raw stream from the fetch response and join incomplete
     * chunks, returning a new stream that provides a single complete
     * GenerateContentResponse in each iteration.
     */
    function getResponseStream(inputStream) {
        const reader = inputStream.getReader();
        const stream = new ReadableStream({
            start(controller) {
                let currentText = '';
                return pump();
                function pump() {
                    return reader.read().then(({ value, done }) => {
                        if (done) {
                            if (currentText.trim()) {
                                controller.error(new VertexAIError("parse-failed" /* VertexAIErrorCode.PARSE_FAILED */, 'Failed to parse stream'));
                                return;
                            }
                            controller.close();
                            return;
                        }
                        currentText += value;
                        let match = currentText.match(responseLineRE);
                        let parsedResponse;
                        while (match) {
                            try {
                                parsedResponse = JSON.parse(match[1]);
                            }
                            catch (e) {
                                controller.error(new VertexAIError("parse-failed" /* VertexAIErrorCode.PARSE_FAILED */, `Error parsing JSON response: "${match[1]}`));
                                return;
                            }
                            controller.enqueue(parsedResponse);
                            currentText = currentText.substring(match[0].length);
                            match = currentText.match(responseLineRE);
                        }
                        return pump();
                    });
                }
            }
        });
        return stream;
    }
    /**
     * Aggregates an array of `GenerateContentResponse`s into a single
     * GenerateContentResponse.
     */
    function aggregateResponses(responses) {
        const lastResponse = responses[responses.length - 1];
        const aggregatedResponse = {
            promptFeedback: lastResponse === null || lastResponse === void 0 ? void 0 : lastResponse.promptFeedback
        };
        for (const response of responses) {
            if (response.candidates) {
                for (const candidate of response.candidates) {
                    const i = candidate.index;
                    if (!aggregatedResponse.candidates) {
                        aggregatedResponse.candidates = [];
                    }
                    if (!aggregatedResponse.candidates[i]) {
                        aggregatedResponse.candidates[i] = {
                            index: candidate.index
                        };
                    }
                    // Keep overwriting, the last one will be final
                    aggregatedResponse.candidates[i].citationMetadata =
                        candidate.citationMetadata;
                    aggregatedResponse.candidates[i].finishReason = candidate.finishReason;
                    aggregatedResponse.candidates[i].finishMessage =
                        candidate.finishMessage;
                    aggregatedResponse.candidates[i].safetyRatings =
                        candidate.safetyRatings;
                    /**
                     * Candidates should always have content and parts, but this handles
                     * possible malformed responses.
                     */
                    if (candidate.content && candidate.content.parts) {
                        if (!aggregatedResponse.candidates[i].content) {
                            aggregatedResponse.candidates[i].content = {
                                role: candidate.content.role || 'user',
                                parts: []
                            };
                        }
                        const newPart = {};
                        for (const part of candidate.content.parts) {
                            if (part.text) {
                                newPart.text = part.text;
                            }
                            if (part.functionCall) {
                                newPart.functionCall = part.functionCall;
                            }
                            if (Object.keys(newPart).length === 0) {
                                newPart.text = '';
                            }
                            aggregatedResponse.candidates[i].content.parts.push(newPart);
                        }
                    }
                }
            }
        }
        return aggregatedResponse;
    }

    /**
     * @license
     * Copyright 2024 Google LLC
     *
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     *   http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     */
    async function generateContentStream(apiSettings, model, params, requestOptions) {
        const response = await makeRequest(model, Task.STREAM_GENERATE_CONTENT, apiSettings, 
        /* stream */ true, JSON.stringify(params), requestOptions);
        return processStream(response);
    }
    async function generateContent(apiSettings, model, params, requestOptions) {
        const response = await makeRequest(model, Task.GENERATE_CONTENT, apiSettings, 
        /* stream */ false, JSON.stringify(params), requestOptions);
        const responseJson = await response.json();
        const enhancedResponse = addHelpers(responseJson);
        return {
            response: enhancedResponse
        };
    }

    /**
     * @license
     * Copyright 2024 Google LLC
     *
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     *   http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     */
    function formatSystemInstruction(input) {
        // null or undefined
        if (input == null) {
            return undefined;
        }
        else if (typeof input === 'string') {
            return { role: 'system', parts: [{ text: input }] };
        }
        else if (input.text) {
            return { role: 'system', parts: [input] };
        }
        else if (input.parts) {
            if (!input.role) {
                return { role: 'system', parts: input.parts };
            }
            else {
                return input;
            }
        }
    }
    function formatNewContent(request) {
        let newParts = [];
        if (typeof request === 'string') {
            newParts = [{ text: request }];
        }
        else {
            for (const partOrString of request) {
                if (typeof partOrString === 'string') {
                    newParts.push({ text: partOrString });
                }
                else {
                    newParts.push(partOrString);
                }
            }
        }
        return assignRoleToPartsAndValidateSendMessageRequest(newParts);
    }
    /**
     * When multiple Part types (i.e. FunctionResponsePart and TextPart) are
     * passed in a single Part array, we may need to assign different roles to each
     * part. Currently only FunctionResponsePart requires a role other than 'user'.
     * @private
     * @param parts Array of parts to pass to the model
     * @returns Array of content items
     */
    function assignRoleToPartsAndValidateSendMessageRequest(parts) {
        const userContent = { role: 'user', parts: [] };
        const functionContent = { role: 'function', parts: [] };
        let hasUserContent = false;
        let hasFunctionContent = false;
        for (const part of parts) {
            if ('functionResponse' in part) {
                functionContent.parts.push(part);
                hasFunctionContent = true;
            }
            else {
                userContent.parts.push(part);
                hasUserContent = true;
            }
        }
        if (hasUserContent && hasFunctionContent) {
            throw new VertexAIError("invalid-content" /* VertexAIErrorCode.INVALID_CONTENT */, 'Within a single message, FunctionResponse cannot be mixed with other type of Part in the request for sending chat message.');
        }
        if (!hasUserContent && !hasFunctionContent) {
            throw new VertexAIError("invalid-content" /* VertexAIErrorCode.INVALID_CONTENT */, 'No Content is provided for sending chat message.');
        }
        if (hasUserContent) {
            return userContent;
        }
        return functionContent;
    }
    function formatGenerateContentInput(params) {
        let formattedRequest;
        if (params.contents) {
            formattedRequest = params;
        }
        else {
            // Array or string
            const content = formatNewContent(params);
            formattedRequest = { contents: [content] };
        }
        if (params.systemInstruction) {
            formattedRequest.systemInstruction = formatSystemInstruction(params.systemInstruction);
        }
        return formattedRequest;
    }

    /**
     * @license
     * Copyright 2024 Google LLC
     *
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     *   http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     */
    // https://ai.google.dev/api/rest/v1beta/Content#part
    const VALID_PART_FIELDS = [
        'text',
        'inlineData',
        'functionCall',
        'functionResponse'
    ];
    const VALID_PARTS_PER_ROLE = {
        user: ['text', 'inlineData'],
        function: ['functionResponse'],
        model: ['text', 'functionCall'],
        // System instructions shouldn't be in history anyway.
        system: ['text']
    };
    const VALID_PREVIOUS_CONTENT_ROLES = {
        user: ['model'],
        function: ['model'],
        model: ['user', 'function'],
        // System instructions shouldn't be in history.
        system: []
    };
    function validateChatHistory(history) {
        let prevContent = null;
        for (const currContent of history) {
            const { role, parts } = currContent;
            if (!prevContent && role !== 'user') {
                throw new VertexAIError("invalid-content" /* VertexAIErrorCode.INVALID_CONTENT */, `First Content should be with role 'user', got ${role}`);
            }
            if (!POSSIBLE_ROLES.includes(role)) {
                throw new VertexAIError("invalid-content" /* VertexAIErrorCode.INVALID_CONTENT */, `Each item should include role field. Got ${role} but valid roles are: ${JSON.stringify(POSSIBLE_ROLES)}`);
            }
            if (!Array.isArray(parts)) {
                throw new VertexAIError("invalid-content" /* VertexAIErrorCode.INVALID_CONTENT */, `Content should have 'parts' but property with an array of Parts`);
            }
            if (parts.length === 0) {
                throw new VertexAIError("invalid-content" /* VertexAIErrorCode.INVALID_CONTENT */, `Each Content should have at least one part`);
            }
            const countFields = {
                text: 0,
                inlineData: 0,
                functionCall: 0,
                functionResponse: 0
            };
            for (const part of parts) {
                for (const key of VALID_PART_FIELDS) {
                    if (key in part) {
                        countFields[key] += 1;
                    }
                }
            }
            const validParts = VALID_PARTS_PER_ROLE[role];
            for (const key of VALID_PART_FIELDS) {
                if (!validParts.includes(key) && countFields[key] > 0) {
                    throw new VertexAIError("invalid-content" /* VertexAIErrorCode.INVALID_CONTENT */, `Content with role '${role}' can't contain '${key}' part`);
                }
            }
            if (prevContent) {
                const validPreviousContentRoles = VALID_PREVIOUS_CONTENT_ROLES[role];
                if (!validPreviousContentRoles.includes(prevContent.role)) {
                    throw new VertexAIError("invalid-content" /* VertexAIErrorCode.INVALID_CONTENT */, `Content with role '${role} can't follow '${prevContent.role}'. Valid previous roles: ${JSON.stringify(VALID_PREVIOUS_CONTENT_ROLES)}`);
                }
            }
            prevContent = currContent;
        }
    }

    /**
     * @license
     * Copyright 2024 Google LLC
     *
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     *   http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     */
    /**
     * Do not log a message for this error.
     */
    const SILENT_ERROR = 'SILENT_ERROR';
    /**
     * ChatSession class that enables sending chat messages and stores
     * history of sent and received messages so far.
     *
     * @public
     */
    class ChatSession {
        constructor(apiSettings, model, params, requestOptions) {
            this.model = model;
            this.params = params;
            this.requestOptions = requestOptions;
            this._history = [];
            this._sendPromise = Promise.resolve();
            this._apiSettings = apiSettings;
            if (params === null || params === void 0 ? void 0 : params.history) {
                validateChatHistory(params.history);
                this._history = params.history;
            }
        }
        /**
         * Gets the chat history so far. Blocked prompts are not added to history.
         * Blocked candidates are not added to history, nor are the prompts that
         * generated them.
         */
        async getHistory() {
            await this._sendPromise;
            return this._history;
        }
        /**
         * Sends a chat message and receives a non-streaming
         * {@link GenerateContentResult}
         */
        async sendMessage(request) {
            var _a, _b, _c, _d, _e;
            await this._sendPromise;
            const newContent = formatNewContent(request);
            const generateContentRequest = {
                safetySettings: (_a = this.params) === null || _a === void 0 ? void 0 : _a.safetySettings,
                generationConfig: (_b = this.params) === null || _b === void 0 ? void 0 : _b.generationConfig,
                tools: (_c = this.params) === null || _c === void 0 ? void 0 : _c.tools,
                toolConfig: (_d = this.params) === null || _d === void 0 ? void 0 : _d.toolConfig,
                systemInstruction: (_e = this.params) === null || _e === void 0 ? void 0 : _e.systemInstruction,
                contents: [...this._history, newContent]
            };
            let finalResult = {};
            // Add onto the chain.
            this._sendPromise = this._sendPromise
                .then(() => generateContent(this._apiSettings, this.model, generateContentRequest, this.requestOptions))
                .then(result => {
                var _a, _b;
                if (result.response.candidates &&
                    result.response.candidates.length > 0) {
                    this._history.push(newContent);
                    const responseContent = {
                        parts: ((_a = result.response.candidates) === null || _a === void 0 ? void 0 : _a[0].content.parts) || [],
                        // Response seems to come back without a role set.
                        role: ((_b = result.response.candidates) === null || _b === void 0 ? void 0 : _b[0].content.role) || 'model'
                    };
                    this._history.push(responseContent);
                }
                else {
                    const blockErrorMessage = formatBlockErrorMessage(result.response);
                    if (blockErrorMessage) {
                        console.warn(`sendMessage() was unsuccessful. ${blockErrorMessage}. Inspect response object for details.`);
                    }
                }
                finalResult = result;
            });
            await this._sendPromise;
            return finalResult;
        }
        /**
         * Sends a chat message and receives the response as a
         * {@link GenerateContentStreamResult} containing an iterable stream
         * and a response promise.
         */
        async sendMessageStream(request) {
            var _a, _b, _c, _d, _e;
            await this._sendPromise;
            const newContent = formatNewContent(request);
            const generateContentRequest = {
                safetySettings: (_a = this.params) === null || _a === void 0 ? void 0 : _a.safetySettings,
                generationConfig: (_b = this.params) === null || _b === void 0 ? void 0 : _b.generationConfig,
                tools: (_c = this.params) === null || _c === void 0 ? void 0 : _c.tools,
                toolConfig: (_d = this.params) === null || _d === void 0 ? void 0 : _d.toolConfig,
                systemInstruction: (_e = this.params) === null || _e === void 0 ? void 0 : _e.systemInstruction,
                contents: [...this._history, newContent]
            };
            const streamPromise = generateContentStream(this._apiSettings, this.model, generateContentRequest, this.requestOptions);
            // Add onto the chain.
            this._sendPromise = this._sendPromise
                .then(() => streamPromise)
                // This must be handled to avoid unhandled rejection, but jump
                // to the final catch block with a label to not log this error.
                .catch(_ignored => {
                throw new Error(SILENT_ERROR);
            })
                .then(streamResult => streamResult.response)
                .then(response => {
                if (response.candidates && response.candidates.length > 0) {
                    this._history.push(newContent);
                    const responseContent = Object.assign({}, response.candidates[0].content);
                    // Response seems to come back without a role set.
                    if (!responseContent.role) {
                        responseContent.role = 'model';
                    }
                    this._history.push(responseContent);
                }
                else {
                    const blockErrorMessage = formatBlockErrorMessage(response);
                    if (blockErrorMessage) {
                        console.warn(`sendMessageStream() was unsuccessful. ${blockErrorMessage}. Inspect response object for details.`);
                    }
                }
            })
                .catch(e => {
                // Errors in streamPromise are already catchable by the user as
                // streamPromise is returned.
                // Avoid duplicating the error message in logs.
                if (e.message !== SILENT_ERROR) {
                    // Users do not have access to _sendPromise to catch errors
                    // downstream from streamPromise, so they should not throw.
                    console.error(e);
                }
            });
            return streamPromise;
        }
    }

    /**
     * @license
     * Copyright 2024 Google LLC
     *
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     *   http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     */
    async function countTokens(apiSettings, model, params, requestOptions) {
        const response = await makeRequest(model, Task.COUNT_TOKENS, apiSettings, false, JSON.stringify(params), requestOptions);
        return response.json();
    }

    /**
     * @license
     * Copyright 2024 Google LLC
     *
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     *   http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     */
    /**
     * Class for generative model APIs.
     * @public
     */
    class GenerativeModel {
        constructor(vertexAI, modelParams, requestOptions) {
            var _a, _b, _c, _d;
            if (!((_b = (_a = vertexAI.app) === null || _a === void 0 ? void 0 : _a.options) === null || _b === void 0 ? void 0 : _b.apiKey)) {
                throw new VertexAIError("no-api-key" /* VertexAIErrorCode.NO_API_KEY */, `The "apiKey" field is empty in the local Firebase config. Firebase VertexAI requires this field to contain a valid API key.`);
            }
            else if (!((_d = (_c = vertexAI.app) === null || _c === void 0 ? void 0 : _c.options) === null || _d === void 0 ? void 0 : _d.projectId)) {
                throw new VertexAIError("no-project-id" /* VertexAIErrorCode.NO_PROJECT_ID */, `The "projectId" field is empty in the local Firebase config. Firebase VertexAI requires this field to contain a valid project ID.`);
            }
            else {
                this._apiSettings = {
                    apiKey: vertexAI.app.options.apiKey,
                    project: vertexAI.app.options.projectId,
                    location: vertexAI.location
                };
                if (vertexAI.appCheck) {
                    this._apiSettings.getAppCheckToken = () => vertexAI.appCheck.getToken();
                }
                if (vertexAI.auth) {
                    this._apiSettings.getAuthToken = () => vertexAI.auth.getToken();
                }
            }
            if (modelParams.model.includes('/')) {
                if (modelParams.model.startsWith('models/')) {
                    // Add "publishers/google" if the user is only passing in 'models/model-name'.
                    this.model = `publishers/google/${modelParams.model}`;
                }
                else {
                    // Any other custom format (e.g. tuned models) must be passed in correctly.
                    this.model = modelParams.model;
                }
            }
            else {
                // If path is not included, assume it's a non-tuned model.
                this.model = `publishers/google/models/${modelParams.model}`;
            }
            this.generationConfig = modelParams.generationConfig || {};
            this.safetySettings = modelParams.safetySettings || [];
            this.tools = modelParams.tools;
            this.toolConfig = modelParams.toolConfig;
            this.systemInstruction = formatSystemInstruction(modelParams.systemInstruction);
            this.requestOptions = requestOptions || {};
        }
        /**
         * Makes a single non-streaming call to the model
         * and returns an object containing a single {@link GenerateContentResponse}.
         */
        async generateContent(request) {
            const formattedParams = formatGenerateContentInput(request);
            return generateContent(this._apiSettings, this.model, Object.assign({ generationConfig: this.generationConfig, safetySettings: this.safetySettings, tools: this.tools, toolConfig: this.toolConfig, systemInstruction: this.systemInstruction }, formattedParams), this.requestOptions);
        }
        /**
         * Makes a single streaming call to the model
         * and returns an object containing an iterable stream that iterates
         * over all chunks in the streaming response as well as
         * a promise that returns the final aggregated response.
         */
        async generateContentStream(request) {
            const formattedParams = formatGenerateContentInput(request);
            return generateContentStream(this._apiSettings, this.model, Object.assign({ generationConfig: this.generationConfig, safetySettings: this.safetySettings, tools: this.tools, toolConfig: this.toolConfig, systemInstruction: this.systemInstruction }, formattedParams), this.requestOptions);
        }
        /**
         * Gets a new {@link ChatSession} instance which can be used for
         * multi-turn chats.
         */
        startChat(startChatParams) {
            return new ChatSession(this._apiSettings, this.model, Object.assign({ tools: this.tools, toolConfig: this.toolConfig, systemInstruction: this.systemInstruction }, startChatParams), this.requestOptions);
        }
        /**
         * Counts the tokens in the provided request.
         */
        async countTokens(request) {
            const formattedParams = formatGenerateContentInput(request);
            return countTokens(this._apiSettings, this.model, formattedParams);
        }
    }

    /**
     * @license
     * Copyright 2024 Google LLC
     *
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     *   http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     */
    /**
     * Returns a {@link VertexAI} instance for the given app.
     *
     * @public
     *
     * @param app - The {@link @firebase/app#FirebaseApp} to use.
     */
    function getVertexAI(app = getApp(), options) {
        app = getModularInstance(app);
        // Dependencies
        const vertexProvider = _getProvider(app, VERTEX_TYPE);
        return vertexProvider.getImmediate({
            identifier: DEFAULT_LOCATION
        });
    }
    /**
     * Returns a {@link GenerativeModel} class with methods for inference
     * and other functionality.
     *
     * @public
     */
    function getGenerativeModel(vertexAI, modelParams, requestOptions) {
        if (!modelParams.model) {
            throw new VertexAIError("no-model" /* VertexAIErrorCode.NO_MODEL */, `Must provide a model name. Example: getGenerativeModel({ model: 'my-model-name' })`);
        }
        return new GenerativeModel(vertexAI, modelParams, requestOptions);
    }

    /**
     * The Vertex AI For Firebase Web SDK.
     *
     * @packageDocumentation
     */
    function registerVertex() {
        _registerComponent(new Component(VERTEX_TYPE, (container, { instanceIdentifier: location }) => {
            // getImmediate for FirebaseApp will always succeed
            const app = container.getProvider('app').getImmediate();
            const auth = container.getProvider('auth-internal');
            const appCheckProvider = container.getProvider('app-check-internal');
            return new VertexAIService(app, auth, appCheckProvider, { location });
        }, "PUBLIC" /* ComponentType.PUBLIC */).setMultipleInstances(true));
        registerVersion(name$1, version$1);
        // BUILD_TARGET will be replaced by values like esm5, esm2017, cjs5, etc during the compilation
        registerVersion(name$1, version$1, 'esm2017');
    }
    registerVertex();

    /**
     * @license
     * Copyright 2020 Google LLC
     *
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     *   http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     */
    const APP_CHECK_STATES = new Map();
    const DEFAULT_STATE = {
        activated: false,
        tokenObservers: []
    };
    const DEBUG_STATE = {
        initialized: false,
        enabled: false
    };
    /**
     * Gets a reference to the state object.
     */
    function getStateReference(app) {
        return APP_CHECK_STATES.get(app) || Object.assign({}, DEFAULT_STATE);
    }
    /**
     * Set once on initialization. The map should hold the same reference to the
     * same object until this entry is deleted.
     */
    function setInitialState(app, state) {
        APP_CHECK_STATES.set(app, state);
        return APP_CHECK_STATES.get(app);
    }
    function getDebugState() {
        return DEBUG_STATE;
    }

    /**
     * @license
     * Copyright 2020 Google LLC
     *
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     *   http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     */
    const BASE_ENDPOINT = 'https://content-firebaseappcheck.googleapis.com/v1';
    const EXCHANGE_RECAPTCHA_TOKEN_METHOD = 'exchangeRecaptchaV3Token';
    const EXCHANGE_DEBUG_TOKEN_METHOD = 'exchangeDebugToken';
    const TOKEN_REFRESH_TIME = {
        /**
         * The offset time before token natural expiration to run the refresh.
         * This is currently 5 minutes.
         */
        OFFSET_DURATION: 5 * 60 * 1000,
        /**
         * This is the first retrial wait after an error. This is currently
         * 30 seconds.
         */
        RETRIAL_MIN_WAIT: 30 * 1000,
        /**
         * This is the maximum retrial wait, currently 16 minutes.
         */
        RETRIAL_MAX_WAIT: 16 * 60 * 1000
    };
    /**
     * One day in millis, for certain error code backoffs.
     */
    const ONE_DAY = 24 * 60 * 60 * 1000;

    /**
     * @license
     * Copyright 2020 Google LLC
     *
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     *   http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     */
    /**
     * Port from auth proactiverefresh.js
     *
     */
    // TODO: move it to @firebase/util?
    // TODO: allow to config whether refresh should happen in the background
    class Refresher {
        constructor(operation, retryPolicy, getWaitDuration, lowerBound, upperBound) {
            this.operation = operation;
            this.retryPolicy = retryPolicy;
            this.getWaitDuration = getWaitDuration;
            this.lowerBound = lowerBound;
            this.upperBound = upperBound;
            this.pending = null;
            this.nextErrorWaitInterval = lowerBound;
            if (lowerBound > upperBound) {
                throw new Error('Proactive refresh lower bound greater than upper bound!');
            }
        }
        start() {
            this.nextErrorWaitInterval = this.lowerBound;
            this.process(true).catch(() => {
                /* we don't care about the result */
            });
        }
        stop() {
            if (this.pending) {
                this.pending.reject('cancelled');
                this.pending = null;
            }
        }
        isRunning() {
            return !!this.pending;
        }
        async process(hasSucceeded) {
            this.stop();
            try {
                this.pending = new Deferred();
                this.pending.promise.catch(_e => {
                    /* ignore */
                });
                await sleep(this.getNextRun(hasSucceeded));
                // Why do we resolve a promise, then immediate wait for it?
                // We do it to make the promise chain cancellable.
                // We can call stop() which rejects the promise before the following line execute, which makes
                // the code jump to the catch block.
                // TODO: unit test this
                this.pending.resolve();
                await this.pending.promise;
                this.pending = new Deferred();
                this.pending.promise.catch(_e => {
                    /* ignore */
                });
                await this.operation();
                this.pending.resolve();
                await this.pending.promise;
                this.process(true).catch(() => {
                    /* we don't care about the result */
                });
            }
            catch (error) {
                if (this.retryPolicy(error)) {
                    this.process(false).catch(() => {
                        /* we don't care about the result */
                    });
                }
                else {
                    this.stop();
                }
            }
        }
        getNextRun(hasSucceeded) {
            if (hasSucceeded) {
                // If last operation succeeded, reset next error wait interval and return
                // the default wait duration.
                this.nextErrorWaitInterval = this.lowerBound;
                // Return typical wait duration interval after a successful operation.
                return this.getWaitDuration();
            }
            else {
                // Get next error wait interval.
                const currentErrorWaitInterval = this.nextErrorWaitInterval;
                // Double interval for next consecutive error.
                this.nextErrorWaitInterval *= 2;
                // Make sure next wait interval does not exceed the maximum upper bound.
                if (this.nextErrorWaitInterval > this.upperBound) {
                    this.nextErrorWaitInterval = this.upperBound;
                }
                return currentErrorWaitInterval;
            }
        }
    }
    function sleep(ms) {
        return new Promise(resolve => {
            setTimeout(resolve, ms);
        });
    }

    /**
     * @license
     * Copyright 2020 Google LLC
     *
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     *   http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     */
    const ERRORS = {
        ["already-initialized" /* AppCheckError.ALREADY_INITIALIZED */]: 'You have already called initializeAppCheck() for FirebaseApp {$appName} with ' +
            'different options. To avoid this error, call initializeAppCheck() with the ' +
            'same options as when it was originally called. This will return the ' +
            'already initialized instance.',
        ["use-before-activation" /* AppCheckError.USE_BEFORE_ACTIVATION */]: 'App Check is being used before initializeAppCheck() is called for FirebaseApp {$appName}. ' +
            'Call initializeAppCheck() before instantiating other Firebase services.',
        ["fetch-network-error" /* AppCheckError.FETCH_NETWORK_ERROR */]: 'Fetch failed to connect to a network. Check Internet connection. ' +
            'Original error: {$originalErrorMessage}.',
        ["fetch-parse-error" /* AppCheckError.FETCH_PARSE_ERROR */]: 'Fetch client could not parse response.' +
            ' Original error: {$originalErrorMessage}.',
        ["fetch-status-error" /* AppCheckError.FETCH_STATUS_ERROR */]: 'Fetch server returned an HTTP error status. HTTP status: {$httpStatus}.',
        ["storage-open" /* AppCheckError.STORAGE_OPEN */]: 'Error thrown when opening storage. Original error: {$originalErrorMessage}.',
        ["storage-get" /* AppCheckError.STORAGE_GET */]: 'Error thrown when reading from storage. Original error: {$originalErrorMessage}.',
        ["storage-set" /* AppCheckError.STORAGE_WRITE */]: 'Error thrown when writing to storage. Original error: {$originalErrorMessage}.',
        ["recaptcha-error" /* AppCheckError.RECAPTCHA_ERROR */]: 'ReCAPTCHA error.',
        ["throttled" /* AppCheckError.THROTTLED */]: `Requests throttled due to {$httpStatus} error. Attempts allowed again after {$time}`
    };
    const ERROR_FACTORY = new ErrorFactory('appCheck', 'AppCheck', ERRORS);

    /**
     * @license
     * Copyright 2020 Google LLC
     *
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     *   http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     */
    function getRecaptcha(isEnterprise = false) {
        var _a;
        if (isEnterprise) {
            return (_a = self.grecaptcha) === null || _a === void 0 ? void 0 : _a.enterprise;
        }
        return self.grecaptcha;
    }
    function ensureActivated(app) {
        if (!getStateReference(app).activated) {
            throw ERROR_FACTORY.create("use-before-activation" /* AppCheckError.USE_BEFORE_ACTIVATION */, {
                appName: app.name
            });
        }
    }
    function getDurationString(durationInMillis) {
        const totalSeconds = Math.round(durationInMillis / 1000);
        const days = Math.floor(totalSeconds / (3600 * 24));
        const hours = Math.floor((totalSeconds - days * 3600 * 24) / 3600);
        const minutes = Math.floor((totalSeconds - days * 3600 * 24 - hours * 3600) / 60);
        const seconds = totalSeconds - days * 3600 * 24 - hours * 3600 - minutes * 60;
        let result = '';
        if (days) {
            result += pad(days) + 'd:';
        }
        if (hours) {
            result += pad(hours) + 'h:';
        }
        result += pad(minutes) + 'm:' + pad(seconds) + 's';
        return result;
    }
    function pad(value) {
        if (value === 0) {
            return '00';
        }
        return value >= 10 ? value.toString() : '0' + value;
    }

    /**
     * @license
     * Copyright 2020 Google LLC
     *
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     *   http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     */
    async function exchangeToken({ url, body }, heartbeatServiceProvider) {
        const headers = {
            'Content-Type': 'application/json'
        };
        // If heartbeat service exists, add heartbeat header string to the header.
        const heartbeatService = heartbeatServiceProvider.getImmediate({
            optional: true
        });
        if (heartbeatService) {
            const heartbeatsHeader = await heartbeatService.getHeartbeatsHeader();
            if (heartbeatsHeader) {
                headers['X-Firebase-Client'] = heartbeatsHeader;
            }
        }
        const options = {
            method: 'POST',
            body: JSON.stringify(body),
            headers
        };
        let response;
        try {
            response = await fetch(url, options);
        }
        catch (originalError) {
            throw ERROR_FACTORY.create("fetch-network-error" /* AppCheckError.FETCH_NETWORK_ERROR */, {
                originalErrorMessage: originalError === null || originalError === void 0 ? void 0 : originalError.message
            });
        }
        if (response.status !== 200) {
            throw ERROR_FACTORY.create("fetch-status-error" /* AppCheckError.FETCH_STATUS_ERROR */, {
                httpStatus: response.status
            });
        }
        let responseBody;
        try {
            // JSON parsing throws SyntaxError if the response body isn't a JSON string.
            responseBody = await response.json();
        }
        catch (originalError) {
            throw ERROR_FACTORY.create("fetch-parse-error" /* AppCheckError.FETCH_PARSE_ERROR */, {
                originalErrorMessage: originalError === null || originalError === void 0 ? void 0 : originalError.message
            });
        }
        // Protobuf duration format.
        // https://developers.google.com/protocol-buffers/docs/reference/java/com/google/protobuf/Duration
        const match = responseBody.ttl.match(/^([\d.]+)(s)$/);
        if (!match || !match[2] || isNaN(Number(match[1]))) {
            throw ERROR_FACTORY.create("fetch-parse-error" /* AppCheckError.FETCH_PARSE_ERROR */, {
                originalErrorMessage: `ttl field (timeToLive) is not in standard Protobuf Duration ` +
                    `format: ${responseBody.ttl}`
            });
        }
        const timeToLiveAsNumber = Number(match[1]) * 1000;
        const now = Date.now();
        return {
            token: responseBody.token,
            expireTimeMillis: now + timeToLiveAsNumber,
            issuedAtTimeMillis: now
        };
    }
    function getExchangeRecaptchaV3TokenRequest(app, reCAPTCHAToken) {
        const { projectId, appId, apiKey } = app.options;
        return {
            url: `${BASE_ENDPOINT}/projects/${projectId}/apps/${appId}:${EXCHANGE_RECAPTCHA_TOKEN_METHOD}?key=${apiKey}`,
            body: {
                'recaptcha_v3_token': reCAPTCHAToken
            }
        };
    }
    function getExchangeDebugTokenRequest(app, debugToken) {
        const { projectId, appId, apiKey } = app.options;
        return {
            url: `${BASE_ENDPOINT}/projects/${projectId}/apps/${appId}:${EXCHANGE_DEBUG_TOKEN_METHOD}?key=${apiKey}`,
            body: {
                // eslint-disable-next-line
                debug_token: debugToken
            }
        };
    }

    /**
     * @license
     * Copyright 2020 Google LLC
     *
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     *   http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     */
    const DB_NAME = 'firebase-app-check-database';
    const DB_VERSION = 1;
    const STORE_NAME = 'firebase-app-check-store';
    const DEBUG_TOKEN_KEY = 'debug-token';
    let dbPromise = null;
    function getDBPromise() {
        if (dbPromise) {
            return dbPromise;
        }
        dbPromise = new Promise((resolve, reject) => {
            try {
                const request = indexedDB.open(DB_NAME, DB_VERSION);
                request.onsuccess = event => {
                    resolve(event.target.result);
                };
                request.onerror = event => {
                    var _a;
                    reject(ERROR_FACTORY.create("storage-open" /* AppCheckError.STORAGE_OPEN */, {
                        originalErrorMessage: (_a = event.target.error) === null || _a === void 0 ? void 0 : _a.message
                    }));
                };
                request.onupgradeneeded = event => {
                    const db = event.target.result;
                    // We don't use 'break' in this switch statement, the fall-through
                    // behavior is what we want, because if there are multiple versions between
                    // the old version and the current version, we want ALL the migrations
                    // that correspond to those versions to run, not only the last one.
                    // eslint-disable-next-line default-case
                    switch (event.oldVersion) {
                        case 0:
                            db.createObjectStore(STORE_NAME, {
                                keyPath: 'compositeKey'
                            });
                    }
                };
            }
            catch (e) {
                reject(ERROR_FACTORY.create("storage-open" /* AppCheckError.STORAGE_OPEN */, {
                    originalErrorMessage: e === null || e === void 0 ? void 0 : e.message
                }));
            }
        });
        return dbPromise;
    }
    function readTokenFromIndexedDB(app) {
        return read(computeKey(app));
    }
    function writeTokenToIndexedDB(app, token) {
        return write(computeKey(app), token);
    }
    function writeDebugTokenToIndexedDB(token) {
        return write(DEBUG_TOKEN_KEY, token);
    }
    function readDebugTokenFromIndexedDB() {
        return read(DEBUG_TOKEN_KEY);
    }
    async function write(key, value) {
        const db = await getDBPromise();
        const transaction = db.transaction(STORE_NAME, 'readwrite');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.put({
            compositeKey: key,
            value
        });
        return new Promise((resolve, reject) => {
            request.onsuccess = _event => {
                resolve();
            };
            transaction.onerror = event => {
                var _a;
                reject(ERROR_FACTORY.create("storage-set" /* AppCheckError.STORAGE_WRITE */, {
                    originalErrorMessage: (_a = event.target.error) === null || _a === void 0 ? void 0 : _a.message
                }));
            };
        });
    }
    async function read(key) {
        const db = await getDBPromise();
        const transaction = db.transaction(STORE_NAME, 'readonly');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.get(key);
        return new Promise((resolve, reject) => {
            request.onsuccess = event => {
                const result = event.target.result;
                if (result) {
                    resolve(result.value);
                }
                else {
                    resolve(undefined);
                }
            };
            transaction.onerror = event => {
                var _a;
                reject(ERROR_FACTORY.create("storage-get" /* AppCheckError.STORAGE_GET */, {
                    originalErrorMessage: (_a = event.target.error) === null || _a === void 0 ? void 0 : _a.message
                }));
            };
        });
    }
    function computeKey(app) {
        return `${app.options.appId}-${app.name}`;
    }

    /**
     * @license
     * Copyright 2020 Google LLC
     *
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     *   http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     */
    const logger = new Logger('@firebase/app-check');

    /**
     * @license
     * Copyright 2020 Google LLC
     *
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     *   http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     */
    /**
     * Always resolves. In case of an error reading from indexeddb, resolve with undefined
     */
    async function readTokenFromStorage(app) {
        if (isIndexedDBAvailable()) {
            let token = undefined;
            try {
                token = await readTokenFromIndexedDB(app);
            }
            catch (e) {
                // swallow the error and return undefined
                logger.warn(`Failed to read token from IndexedDB. Error: ${e}`);
            }
            return token;
        }
        return undefined;
    }
    /**
     * Always resolves. In case of an error writing to indexeddb, print a warning and resolve the promise
     */
    function writeTokenToStorage(app, token) {
        if (isIndexedDBAvailable()) {
            return writeTokenToIndexedDB(app, token).catch(e => {
                // swallow the error and resolve the promise
                logger.warn(`Failed to write token to IndexedDB. Error: ${e}`);
            });
        }
        return Promise.resolve();
    }
    async function readOrCreateDebugTokenFromStorage() {
        /**
         * Theoretically race condition can happen if we read, then write in 2 separate transactions.
         * But it won't happen here, because this function will be called exactly once.
         */
        let existingDebugToken = undefined;
        try {
            existingDebugToken = await readDebugTokenFromIndexedDB();
        }
        catch (_e) {
            // failed to read from indexeddb. We assume there is no existing debug token, and generate a new one.
        }
        if (!existingDebugToken) {
            // create a new debug token
            const newToken = uuidv4();
            // We don't need to block on writing to indexeddb
            // In case persistence failed, a new debug token will be generated every time the page is refreshed.
            // It renders the debug token useless because you have to manually register(whitelist) the new token in the firebase console again and again.
            // If you see this error trying to use debug token, it probably means you are using a browser that doesn't support indexeddb.
            // You should switch to a different browser that supports indexeddb
            writeDebugTokenToIndexedDB(newToken).catch(e => logger.warn(`Failed to persist debug token to IndexedDB. Error: ${e}`));
            return newToken;
        }
        else {
            return existingDebugToken;
        }
    }

    /**
     * @license
     * Copyright 2020 Google LLC
     *
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     *   http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     */
    function isDebugMode() {
        const debugState = getDebugState();
        return debugState.enabled;
    }
    async function getDebugToken() {
        const state = getDebugState();
        if (state.enabled && state.token) {
            return state.token.promise;
        }
        else {
            // should not happen!
            throw Error(`
            Can't get debug token in production mode.
        `);
        }
    }
    function initializeDebugMode() {
        const globals = getGlobal();
        const debugState = getDebugState();
        // Set to true if this function has been called, whether or not
        // it enabled debug mode.
        debugState.initialized = true;
        if (typeof globals.FIREBASE_APPCHECK_DEBUG_TOKEN !== 'string' &&
            globals.FIREBASE_APPCHECK_DEBUG_TOKEN !== true) {
            return;
        }
        debugState.enabled = true;
        const deferredToken = new Deferred();
        debugState.token = deferredToken;
        if (typeof globals.FIREBASE_APPCHECK_DEBUG_TOKEN === 'string') {
            deferredToken.resolve(globals.FIREBASE_APPCHECK_DEBUG_TOKEN);
        }
        else {
            deferredToken.resolve(readOrCreateDebugTokenFromStorage());
        }
    }

    /**
     * @license
     * Copyright 2020 Google LLC
     *
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     *   http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     */
    // Initial hardcoded value agreed upon across platforms for initial launch.
    // Format left open for possible dynamic error values and other fields in the future.
    const defaultTokenErrorData = { error: 'UNKNOWN_ERROR' };
    /**
     * Stringify and base64 encode token error data.
     *
     * @param tokenError Error data, currently hardcoded.
     */
    function formatDummyToken(tokenErrorData) {
        return base64.encodeString(JSON.stringify(tokenErrorData), 
        /* webSafe= */ false);
    }
    /**
     * This function always resolves.
     * The result will contain an error field if there is any error.
     * In case there is an error, the token field in the result will be populated with a dummy value
     */
    async function getToken$2(appCheck, forceRefresh = false) {
        const app = appCheck.app;
        ensureActivated(app);
        const state = getStateReference(app);
        /**
         * First check if there is a token in memory from a previous `getToken()` call.
         */
        let token = state.token;
        let error = undefined;
        /**
         * If an invalid token was found in memory, clear token from
         * memory and unset the local variable `token`.
         */
        if (token && !isValid(token)) {
            state.token = undefined;
            token = undefined;
        }
        /**
         * If there is no valid token in memory, try to load token from indexedDB.
         */
        if (!token) {
            // cachedTokenPromise contains the token found in IndexedDB or undefined if not found.
            const cachedToken = await state.cachedTokenPromise;
            if (cachedToken) {
                if (isValid(cachedToken)) {
                    token = cachedToken;
                }
                else {
                    // If there was an invalid token in the indexedDB cache, clear it.
                    await writeTokenToStorage(app, undefined);
                }
            }
        }
        // Return the cached token (from either memory or indexedDB) if it's valid
        if (!forceRefresh && token && isValid(token)) {
            return {
                token: token.token
            };
        }
        // Only set to true if this `getToken()` call is making the actual
        // REST call to the exchange endpoint, versus waiting for an already
        // in-flight call (see debug and regular exchange endpoint paths below)
        let shouldCallListeners = false;
        /**
         * DEBUG MODE
         * If debug mode is set, and there is no cached token, fetch a new App
         * Check token using the debug token, and return it directly.
         */
        if (isDebugMode()) {
            // Avoid making another call to the exchange endpoint if one is in flight.
            if (!state.exchangeTokenPromise) {
                state.exchangeTokenPromise = exchangeToken(getExchangeDebugTokenRequest(app, await getDebugToken()), appCheck.heartbeatServiceProvider).finally(() => {
                    // Clear promise when settled - either resolved or rejected.
                    state.exchangeTokenPromise = undefined;
                });
                shouldCallListeners = true;
            }
            const tokenFromDebugExchange = await state.exchangeTokenPromise;
            // Write debug token to indexedDB.
            await writeTokenToStorage(app, tokenFromDebugExchange);
            // Write debug token to state.
            state.token = tokenFromDebugExchange;
            return { token: tokenFromDebugExchange.token };
        }
        /**
         * There are no valid tokens in memory or indexedDB and we are not in
         * debug mode.
         * Request a new token from the exchange endpoint.
         */
        try {
            // Avoid making another call to the exchange endpoint if one is in flight.
            if (!state.exchangeTokenPromise) {
                // state.provider is populated in initializeAppCheck()
                // ensureActivated() at the top of this function checks that
                // initializeAppCheck() has been called.
                state.exchangeTokenPromise = state.provider.getToken().finally(() => {
                    // Clear promise when settled - either resolved or rejected.
                    state.exchangeTokenPromise = undefined;
                });
                shouldCallListeners = true;
            }
            token = await getStateReference(app).exchangeTokenPromise;
        }
        catch (e) {
            if (e.code === `appCheck/${"throttled" /* AppCheckError.THROTTLED */}`) {
                // Warn if throttled, but do not treat it as an error.
                logger.warn(e.message);
            }
            else {
                // `getToken()` should never throw, but logging error text to console will aid debugging.
                logger.error(e);
            }
            // Always save error to be added to dummy token.
            error = e;
        }
        let interopTokenResult;
        if (!token) {
            // If token is undefined, there must be an error.
            // Return a dummy token along with the error.
            interopTokenResult = makeDummyTokenResult(error);
        }
        else if (error) {
            if (isValid(token)) {
                // It's also possible a valid token exists, but there's also an error.
                // (Such as if the token is almost expired, tries to refresh, and
                // the exchange request fails.)
                // We add a special error property here so that the refresher will
                // count this as a failed attempt and use the backoff instead of
                // retrying repeatedly with no delay, but any 3P listeners will not
                // be hindered in getting the still-valid token.
                interopTokenResult = {
                    token: token.token,
                    internalError: error
                };
            }
            else {
                // No invalid tokens should make it to this step. Memory and cached tokens
                // are checked. Other tokens are from fresh exchanges. But just in case.
                interopTokenResult = makeDummyTokenResult(error);
            }
        }
        else {
            interopTokenResult = {
                token: token.token
            };
            // write the new token to the memory state as well as the persistent storage.
            // Only do it if we got a valid new token
            state.token = token;
            await writeTokenToStorage(app, token);
        }
        if (shouldCallListeners) {
            notifyTokenListeners(app, interopTokenResult);
        }
        return interopTokenResult;
    }
    /**
     * Internal API for limited use tokens. Skips all FAC state and simply calls
     * the underlying provider.
     */
    async function getLimitedUseToken$1(appCheck) {
        const app = appCheck.app;
        ensureActivated(app);
        const { provider } = getStateReference(app);
        if (isDebugMode()) {
            const debugToken = await getDebugToken();
            const { token } = await exchangeToken(getExchangeDebugTokenRequest(app, debugToken), appCheck.heartbeatServiceProvider);
            return { token };
        }
        else {
            // provider is definitely valid since we ensure AppCheck was activated
            const { token } = await provider.getToken();
            return { token };
        }
    }
    function addTokenListener(appCheck, type, listener, onError) {
        const { app } = appCheck;
        const state = getStateReference(app);
        const tokenObserver = {
            next: listener,
            error: onError,
            type
        };
        state.tokenObservers = [...state.tokenObservers, tokenObserver];
        // Invoke the listener async immediately if there is a valid token
        // in memory.
        if (state.token && isValid(state.token)) {
            const validToken = state.token;
            Promise.resolve()
                .then(() => {
                listener({ token: validToken.token });
                initTokenRefresher(appCheck);
            })
                .catch(() => {
                /* we don't care about exceptions thrown in listeners */
            });
        }
        /**
         * Wait for any cached token promise to resolve before starting the token
         * refresher. The refresher checks to see if there is an existing token
         * in state and calls the exchange endpoint if not. We should first let the
         * IndexedDB check have a chance to populate state if it can.
         *
         * Listener call isn't needed here because cachedTokenPromise will call any
         * listeners that exist when it resolves.
         */
        // state.cachedTokenPromise is always populated in `activate()`.
        void state.cachedTokenPromise.then(() => initTokenRefresher(appCheck));
    }
    function removeTokenListener(app, listener) {
        const state = getStateReference(app);
        const newObservers = state.tokenObservers.filter(tokenObserver => tokenObserver.next !== listener);
        if (newObservers.length === 0 &&
            state.tokenRefresher &&
            state.tokenRefresher.isRunning()) {
            state.tokenRefresher.stop();
        }
        state.tokenObservers = newObservers;
    }
    /**
     * Logic to create and start refresher as needed.
     */
    function initTokenRefresher(appCheck) {
        const { app } = appCheck;
        const state = getStateReference(app);
        // Create the refresher but don't start it if `isTokenAutoRefreshEnabled`
        // is not true.
        let refresher = state.tokenRefresher;
        if (!refresher) {
            refresher = createTokenRefresher(appCheck);
            state.tokenRefresher = refresher;
        }
        if (!refresher.isRunning() && state.isTokenAutoRefreshEnabled) {
            refresher.start();
        }
    }
    function createTokenRefresher(appCheck) {
        const { app } = appCheck;
        return new Refresher(
        // Keep in mind when this fails for any reason other than the ones
        // for which we should retry, it will effectively stop the proactive refresh.
        async () => {
            const state = getStateReference(app);
            // If there is no token, we will try to load it from storage and use it
            // If there is a token, we force refresh it because we know it's going to expire soon
            let result;
            if (!state.token) {
                result = await getToken$2(appCheck);
            }
            else {
                result = await getToken$2(appCheck, true);
            }
            /**
             * getToken() always resolves. In case the result has an error field defined, it means
             * the operation failed, and we should retry.
             */
            if (result.error) {
                throw result.error;
            }
            /**
             * A special `internalError` field reflects that there was an error
             * getting a new token from the exchange endpoint, but there's still a
             * previous token that's valid for now and this should be passed to 2P/3P
             * requests for a token. But we want this callback (`this.operation` in
             * `Refresher`) to throw in order to kick off the Refresher's retry
             * backoff. (Setting `hasSucceeded` to false.)
             */
            if (result.internalError) {
                throw result.internalError;
            }
        }, () => {
            return true;
        }, () => {
            const state = getStateReference(app);
            if (state.token) {
                // issuedAtTime + (50% * total TTL) + 5 minutes
                let nextRefreshTimeMillis = state.token.issuedAtTimeMillis +
                    (state.token.expireTimeMillis - state.token.issuedAtTimeMillis) *
                        0.5 +
                    5 * 60 * 1000;
                // Do not allow refresh time to be past (expireTime - 5 minutes)
                const latestAllowableRefresh = state.token.expireTimeMillis - 5 * 60 * 1000;
                nextRefreshTimeMillis = Math.min(nextRefreshTimeMillis, latestAllowableRefresh);
                return Math.max(0, nextRefreshTimeMillis - Date.now());
            }
            else {
                return 0;
            }
        }, TOKEN_REFRESH_TIME.RETRIAL_MIN_WAIT, TOKEN_REFRESH_TIME.RETRIAL_MAX_WAIT);
    }
    function notifyTokenListeners(app, token) {
        const observers = getStateReference(app).tokenObservers;
        for (const observer of observers) {
            try {
                if (observer.type === "EXTERNAL" /* ListenerType.EXTERNAL */ && token.error != null) {
                    // If this listener was added by a 3P call, send any token error to
                    // the supplied error handler. A 3P observer always has an error
                    // handler.
                    observer.error(token.error);
                }
                else {
                    // If the token has no error field, always return the token.
                    // If this is a 2P listener, return the token, whether or not it
                    // has an error field.
                    observer.next(token);
                }
            }
            catch (e) {
                // Errors in the listener function itself are always ignored.
            }
        }
    }
    function isValid(token) {
        return token.expireTimeMillis - Date.now() > 0;
    }
    function makeDummyTokenResult(error) {
        return {
            token: formatDummyToken(defaultTokenErrorData),
            error
        };
    }

    /**
     * @license
     * Copyright 2020 Google LLC
     *
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     *   http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     */
    /**
     * AppCheck Service class.
     */
    class AppCheckService {
        constructor(app, heartbeatServiceProvider) {
            this.app = app;
            this.heartbeatServiceProvider = heartbeatServiceProvider;
        }
        _delete() {
            const { tokenObservers } = getStateReference(this.app);
            for (const tokenObserver of tokenObservers) {
                removeTokenListener(this.app, tokenObserver.next);
            }
            return Promise.resolve();
        }
    }
    function factory(app, heartbeatServiceProvider) {
        return new AppCheckService(app, heartbeatServiceProvider);
    }
    function internalFactory(appCheck) {
        return {
            getToken: forceRefresh => getToken$2(appCheck, forceRefresh),
            getLimitedUseToken: () => getLimitedUseToken$1(appCheck),
            addTokenListener: listener => addTokenListener(appCheck, "INTERNAL" /* ListenerType.INTERNAL */, listener),
            removeTokenListener: listener => removeTokenListener(appCheck.app, listener)
        };
    }

    const name = "@firebase/app-check";
    const version = "0.8.7";

    /**
     * @license
     * Copyright 2020 Google LLC
     *
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     *   http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     */
    const RECAPTCHA_URL = 'https://www.google.com/recaptcha/api.js';
    function initializeV3(app, siteKey) {
        const initialized = new Deferred();
        const state = getStateReference(app);
        state.reCAPTCHAState = { initialized };
        const divId = makeDiv(app);
        const grecaptcha = getRecaptcha(false);
        if (!grecaptcha) {
            loadReCAPTCHAV3Script(() => {
                const grecaptcha = getRecaptcha(false);
                if (!grecaptcha) {
                    // it shouldn't happen.
                    throw new Error('no recaptcha');
                }
                queueWidgetRender(app, siteKey, grecaptcha, divId, initialized);
            });
        }
        else {
            queueWidgetRender(app, siteKey, grecaptcha, divId, initialized);
        }
        return initialized.promise;
    }
    /**
     * Add listener to render the widget and resolve the promise when
     * the grecaptcha.ready() event fires.
     */
    function queueWidgetRender(app, siteKey, grecaptcha, container, initialized) {
        grecaptcha.ready(() => {
            // Invisible widgets allow us to set a different siteKey for each widget,
            // so we use them to support multiple apps
            renderInvisibleWidget(app, siteKey, grecaptcha, container);
            initialized.resolve(grecaptcha);
        });
    }
    /**
     * Add invisible div to page.
     */
    function makeDiv(app) {
        const divId = `fire_app_check_${app.name}`;
        const invisibleDiv = document.createElement('div');
        invisibleDiv.id = divId;
        invisibleDiv.style.display = 'none';
        document.body.appendChild(invisibleDiv);
        return divId;
    }
    async function getToken$1(app) {
        ensureActivated(app);
        // ensureActivated() guarantees that reCAPTCHAState is set
        const reCAPTCHAState = getStateReference(app).reCAPTCHAState;
        const recaptcha = await reCAPTCHAState.initialized.promise;
        return new Promise((resolve, _reject) => {
            // Updated after initialization is complete.
            const reCAPTCHAState = getStateReference(app).reCAPTCHAState;
            recaptcha.ready(() => {
                resolve(
                // widgetId is guaranteed to be available if reCAPTCHAState.initialized.promise resolved.
                recaptcha.execute(reCAPTCHAState.widgetId, {
                    action: 'fire_app_check'
                }));
            });
        });
    }
    /**
     *
     * @param app
     * @param container - Id of a HTML element.
     */
    function renderInvisibleWidget(app, siteKey, grecaptcha, container) {
        const widgetId = grecaptcha.render(container, {
            sitekey: siteKey,
            size: 'invisible',
            // Success callback - set state
            callback: () => {
                getStateReference(app).reCAPTCHAState.succeeded = true;
            },
            // Failure callback - set state
            'error-callback': () => {
                getStateReference(app).reCAPTCHAState.succeeded = false;
            }
        });
        const state = getStateReference(app);
        state.reCAPTCHAState = Object.assign(Object.assign({}, state.reCAPTCHAState), { // state.reCAPTCHAState is set in the initialize()
            widgetId });
    }
    function loadReCAPTCHAV3Script(onload) {
        const script = document.createElement('script');
        script.src = RECAPTCHA_URL;
        script.onload = onload;
        document.head.appendChild(script);
    }

    /**
     * @license
     * Copyright 2021 Google LLC
     *
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     *   http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     */
    /**
     * App Check provider that can obtain a reCAPTCHA V3 token and exchange it
     * for an App Check token.
     *
     * @public
     */
    class ReCaptchaV3Provider {
        /**
         * Create a ReCaptchaV3Provider instance.
         * @param siteKey - ReCAPTCHA V3 siteKey.
         */
        constructor(_siteKey) {
            this._siteKey = _siteKey;
            /**
             * Throttle requests on certain error codes to prevent too many retries
             * in a short time.
             */
            this._throttleData = null;
        }
        /**
         * Returns an App Check token.
         * @internal
         */
        async getToken() {
            var _a, _b, _c;
            throwIfThrottled(this._throttleData);
            // Top-level `getToken()` has already checked that App Check is initialized
            // and therefore this._app and this._heartbeatServiceProvider are available.
            const attestedClaimsToken = await getToken$1(this._app).catch(_e => {
                // reCaptcha.execute() throws null which is not very descriptive.
                throw ERROR_FACTORY.create("recaptcha-error" /* AppCheckError.RECAPTCHA_ERROR */);
            });
            // Check if a failure state was set by the recaptcha "error-callback".
            if (!((_a = getStateReference(this._app).reCAPTCHAState) === null || _a === void 0 ? void 0 : _a.succeeded)) {
                throw ERROR_FACTORY.create("recaptcha-error" /* AppCheckError.RECAPTCHA_ERROR */);
            }
            let result;
            try {
                result = await exchangeToken(getExchangeRecaptchaV3TokenRequest(this._app, attestedClaimsToken), this._heartbeatServiceProvider);
            }
            catch (e) {
                if ((_b = e.code) === null || _b === void 0 ? void 0 : _b.includes("fetch-status-error" /* AppCheckError.FETCH_STATUS_ERROR */)) {
                    this._throttleData = setBackoff(Number((_c = e.customData) === null || _c === void 0 ? void 0 : _c.httpStatus), this._throttleData);
                    throw ERROR_FACTORY.create("throttled" /* AppCheckError.THROTTLED */, {
                        time: getDurationString(this._throttleData.allowRequestsAfter - Date.now()),
                        httpStatus: this._throttleData.httpStatus
                    });
                }
                else {
                    throw e;
                }
            }
            // If successful, clear throttle data.
            this._throttleData = null;
            return result;
        }
        /**
         * @internal
         */
        initialize(app) {
            this._app = app;
            this._heartbeatServiceProvider = _getProvider(app, 'heartbeat');
            initializeV3(app, this._siteKey).catch(() => {
                /* we don't care about the initialization result */
            });
        }
        /**
         * @internal
         */
        isEqual(otherProvider) {
            if (otherProvider instanceof ReCaptchaV3Provider) {
                return this._siteKey === otherProvider._siteKey;
            }
            else {
                return false;
            }
        }
    }
    /**
     * Set throttle data to block requests until after a certain time
     * depending on the failed request's status code.
     * @param httpStatus - Status code of failed request.
     * @param throttleData - `ThrottleData` object containing previous throttle
     * data state.
     * @returns Data about current throttle state and expiration time.
     */
    function setBackoff(httpStatus, throttleData) {
        /**
         * Block retries for 1 day for the following error codes:
         *
         * 404: Likely malformed URL.
         *
         * 403:
         * - Attestation failed
         * - Wrong API key
         * - Project deleted
         */
        if (httpStatus === 404 || httpStatus === 403) {
            return {
                backoffCount: 1,
                allowRequestsAfter: Date.now() + ONE_DAY,
                httpStatus
            };
        }
        else {
            /**
             * For all other error codes, the time when it is ok to retry again
             * is based on exponential backoff.
             */
            const backoffCount = throttleData ? throttleData.backoffCount : 0;
            const backoffMillis = calculateBackoffMillis(backoffCount, 1000, 2);
            return {
                backoffCount: backoffCount + 1,
                allowRequestsAfter: Date.now() + backoffMillis,
                httpStatus
            };
        }
    }
    function throwIfThrottled(throttleData) {
        if (throttleData) {
            if (Date.now() - throttleData.allowRequestsAfter <= 0) {
                // If before, throw.
                throw ERROR_FACTORY.create("throttled" /* AppCheckError.THROTTLED */, {
                    time: getDurationString(throttleData.allowRequestsAfter - Date.now()),
                    httpStatus: throttleData.httpStatus
                });
            }
        }
    }

    /**
     * @license
     * Copyright 2020 Google LLC
     *
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     *   http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     */
    /**
     * Activate App Check for the given app. Can be called only once per app.
     * @param app - the {@link @firebase/app#FirebaseApp} to activate App Check for
     * @param options - App Check initialization options
     * @public
     */
    function initializeAppCheck(app = getApp(), options) {
        app = getModularInstance(app);
        const provider = _getProvider(app, 'app-check');
        // Ensure initializeDebugMode() is only called once.
        if (!getDebugState().initialized) {
            initializeDebugMode();
        }
        // Log a message containing the debug token when `initializeAppCheck()`
        // is called in debug mode.
        if (isDebugMode()) {
            // Do not block initialization to get the token for the message.
            void getDebugToken().then(token => 
            // Not using logger because I don't think we ever want this accidentally hidden.
            console.log(`App Check debug token: ${token}. You will need to add it to your app's App Check settings in the Firebase console for it to work.`));
        }
        if (provider.isInitialized()) {
            const existingInstance = provider.getImmediate();
            const initialOptions = provider.getOptions();
            if (initialOptions.isTokenAutoRefreshEnabled ===
                options.isTokenAutoRefreshEnabled &&
                initialOptions.provider.isEqual(options.provider)) {
                return existingInstance;
            }
            else {
                throw ERROR_FACTORY.create("already-initialized" /* AppCheckError.ALREADY_INITIALIZED */, {
                    appName: app.name
                });
            }
        }
        const appCheck = provider.initialize({ options });
        _activate(app, options.provider, options.isTokenAutoRefreshEnabled);
        // If isTokenAutoRefreshEnabled is false, do not send any requests to the
        // exchange endpoint without an explicit call from the user either directly
        // or through another Firebase library (storage, functions, etc.)
        if (getStateReference(app).isTokenAutoRefreshEnabled) {
            // Adding a listener will start the refresher and fetch a token if needed.
            // This gets a token ready and prevents a delay when an internal library
            // requests the token.
            // Listener function does not need to do anything, its base functionality
            // of calling getToken() already fetches token and writes it to memory/storage.
            addTokenListener(appCheck, "INTERNAL" /* ListenerType.INTERNAL */, () => { });
        }
        return appCheck;
    }
    /**
     * Activate App Check
     * @param app - Firebase app to activate App Check for.
     * @param provider - reCAPTCHA v3 provider or
     * custom token provider.
     * @param isTokenAutoRefreshEnabled - If true, the SDK automatically
     * refreshes App Check tokens as needed. If undefined, defaults to the
     * value of `app.automaticDataCollectionEnabled`, which defaults to
     * false and can be set in the app config.
     */
    function _activate(app, provider, isTokenAutoRefreshEnabled) {
        // Create an entry in the APP_CHECK_STATES map. Further changes should
        // directly mutate this object.
        const state = setInitialState(app, Object.assign({}, DEFAULT_STATE));
        state.activated = true;
        state.provider = provider; // Read cached token from storage if it exists and store it in memory.
        state.cachedTokenPromise = readTokenFromStorage(app).then(cachedToken => {
            if (cachedToken && isValid(cachedToken)) {
                state.token = cachedToken;
                // notify all listeners with the cached token
                notifyTokenListeners(app, { token: cachedToken.token });
            }
            return cachedToken;
        });
        // Use value of global `automaticDataCollectionEnabled` (which
        // itself defaults to false if not specified in config) if
        // `isTokenAutoRefreshEnabled` param was not provided by user.
        state.isTokenAutoRefreshEnabled =
            isTokenAutoRefreshEnabled === undefined
                ? app.automaticDataCollectionEnabled
                : isTokenAutoRefreshEnabled;
        state.provider.initialize(app);
    }

    /**
     * The Firebase App Check Web SDK.
     *
     * @remarks
     * Firebase App Check does not work in a Node.js environment using `ReCaptchaV3Provider` or
     * `ReCaptchaEnterpriseProvider`, but can be used in Node.js if you use
     * `CustomProvider` and write your own attestation method.
     *
     * @packageDocumentation
     */
    const APP_CHECK_NAME = 'app-check';
    const APP_CHECK_NAME_INTERNAL = 'app-check-internal';
    function registerAppCheck() {
        // The public interface
        _registerComponent(new Component(APP_CHECK_NAME, container => {
            // getImmediate for FirebaseApp will always succeed
            const app = container.getProvider('app').getImmediate();
            const heartbeatServiceProvider = container.getProvider('heartbeat');
            return factory(app, heartbeatServiceProvider);
        }, "PUBLIC" /* ComponentType.PUBLIC */)
            .setInstantiationMode("EXPLICIT" /* InstantiationMode.EXPLICIT */)
            /**
             * Initialize app-check-internal after app-check is initialized to make AppCheck available to
             * other Firebase SDKs
             */
            .setInstanceCreatedCallback((container, _identifier, _appcheckService) => {
            container.getProvider(APP_CHECK_NAME_INTERNAL).initialize();
        }));
        // The internal interface used by other Firebase products
        _registerComponent(new Component(APP_CHECK_NAME_INTERNAL, container => {
            const appCheck = container.getProvider('app-check').getImmediate();
            return internalFactory(appCheck);
        }, "PUBLIC" /* ComponentType.PUBLIC */).setInstantiationMode("EXPLICIT" /* InstantiationMode.EXPLICIT */));
        registerVersion(name, version);
    }
    registerAppCheck();

    // Your web app's Firebase configuration
    const firebaseConfig = {
      apiKey: "AIzaSyA2E_U5N09zCVHdIecaFuIeDRuUWNX8xNg",
      authDomain: "mysyllabusbot.firebaseapp.com",
      projectId: "mysyllabusbot",
      storageBucket: "mysyllabusbot.appspot.com",
      messagingSenderId: "326497831637",
      appId: "1:326497831637:web:34d6cdc687a3b6a281f05c"
    };

    // Initialize Firebase
    const firebaseApp = initializeApp(firebaseConfig);

    // Configure app attestation via reCAPTCHA v3
    initializeAppCheck(firebaseApp, {
        provider: new ReCaptchaV3Provider("6LdMDzkqAAAAANzev1MaHzN4MaEcflpuzXgKqQz_"),
      
        // Optional argument. If true, the SDK automatically refreshes App Check
        // tokens as needed.
        isTokenAutoRefreshEnabled: true
    });

    const vertexAI = getVertexAI(firebaseApp);

    const model = getGenerativeModel(vertexAI, { model: "gemini-1.5-flash" });

    async function runModel(prompt) {
        
        const result = await model.generateContent([prompt]);

        const response = result.response;
        const text = response.text();
      
        return text;
    }

    function createChatText(text, direction) {
        const chatDiv = document.getElementById("chatDiv");
        const chatText = document.createElement("p");
        
        chatText.innerText = text;
        chatText.style.textAlign = direction;

        chatDiv.appendChild(chatText);
    }

    document.addEventListener("DOMContentLoaded", () => {
        const messageBox = document.getElementById("messageInput");
        messageBox.focus();

        function sendUserPrompt() {
            const messageText = messageBox.value;
            messageBox.value = "";
        
            createChatText(messageText, "left");
        
            runModel(messageText).then((response) => {
                createChatText(response, "right");
            });
        }

        // Trigger on user pressing enter
        messageBox.addEventListener('keydown', function(event) {
            if (event.key === 'Enter') {
                sendUserPrompt();
            }
        });

        // Add the function to the global scope so it can be called via HTML
        window.sendUserPrompt = sendUserPrompt;
    });

})();
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnVuZGxlLmpzIiwic291cmNlcyI6WyIuLi9ub2RlX21vZHVsZXMvQGZpcmViYXNlL2xvZ2dlci9kaXN0L2VzbS9pbmRleC5lc20yMDE3LmpzIiwiLi4vbm9kZV9tb2R1bGVzL0BmaXJlYmFzZS91dGlsL2Rpc3QvaW5kZXguZXNtMjAxNy5qcyIsIi4uL25vZGVfbW9kdWxlcy9AZmlyZWJhc2UvY29tcG9uZW50L2Rpc3QvZXNtL2luZGV4LmVzbTIwMTcuanMiLCIuLi9ub2RlX21vZHVsZXMvaWRiL2J1aWxkL3dyYXAtaWRiLXZhbHVlLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2lkYi9idWlsZC9pbmRleC5qcyIsIi4uL25vZGVfbW9kdWxlcy9AZmlyZWJhc2UvYXBwL2Rpc3QvZXNtL2luZGV4LmVzbTIwMTcuanMiLCIuLi9ub2RlX21vZHVsZXMvZmlyZWJhc2UvYXBwL2Rpc3QvZXNtL2luZGV4LmVzbS5qcyIsIi4uL25vZGVfbW9kdWxlcy90c2xpYi90c2xpYi5lczYubWpzIiwiLi4vbm9kZV9tb2R1bGVzL0BmaXJlYmFzZS92ZXJ0ZXhhaS1wcmV2aWV3L2Rpc3QvZXNtL2luZGV4LmVzbTIwMTcuanMiLCIuLi9ub2RlX21vZHVsZXMvQGZpcmViYXNlL2FwcC1jaGVjay9kaXN0L2VzbS9pbmRleC5lc20yMDE3LmpzIiwiLi4vc3JjL3NjcmlwdC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIvKipcclxuICogQGxpY2Vuc2VcclxuICogQ29weXJpZ2h0IDIwMTcgR29vZ2xlIExMQ1xyXG4gKlxyXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xyXG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXHJcbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxyXG4gKlxyXG4gKiAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxyXG4gKlxyXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXHJcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcclxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXHJcbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcclxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXHJcbiAqL1xyXG4vKipcclxuICogQSBjb250YWluZXIgZm9yIGFsbCBvZiB0aGUgTG9nZ2VyIGluc3RhbmNlc1xyXG4gKi9cclxuY29uc3QgaW5zdGFuY2VzID0gW107XHJcbi8qKlxyXG4gKiBUaGUgSlMgU0RLIHN1cHBvcnRzIDUgbG9nIGxldmVscyBhbmQgYWxzbyBhbGxvd3MgYSB1c2VyIHRoZSBhYmlsaXR5IHRvXHJcbiAqIHNpbGVuY2UgdGhlIGxvZ3MgYWx0b2dldGhlci5cclxuICpcclxuICogVGhlIG9yZGVyIGlzIGEgZm9sbG93czpcclxuICogREVCVUcgPCBWRVJCT1NFIDwgSU5GTyA8IFdBUk4gPCBFUlJPUlxyXG4gKlxyXG4gKiBBbGwgb2YgdGhlIGxvZyB0eXBlcyBhYm92ZSB0aGUgY3VycmVudCBsb2cgbGV2ZWwgd2lsbCBiZSBjYXB0dXJlZCAoaS5lLiBpZlxyXG4gKiB5b3Ugc2V0IHRoZSBsb2cgbGV2ZWwgdG8gYElORk9gLCBlcnJvcnMgd2lsbCBzdGlsbCBiZSBsb2dnZWQsIGJ1dCBgREVCVUdgIGFuZFxyXG4gKiBgVkVSQk9TRWAgbG9ncyB3aWxsIG5vdClcclxuICovXHJcbnZhciBMb2dMZXZlbDtcclxuKGZ1bmN0aW9uIChMb2dMZXZlbCkge1xyXG4gICAgTG9nTGV2ZWxbTG9nTGV2ZWxbXCJERUJVR1wiXSA9IDBdID0gXCJERUJVR1wiO1xyXG4gICAgTG9nTGV2ZWxbTG9nTGV2ZWxbXCJWRVJCT1NFXCJdID0gMV0gPSBcIlZFUkJPU0VcIjtcclxuICAgIExvZ0xldmVsW0xvZ0xldmVsW1wiSU5GT1wiXSA9IDJdID0gXCJJTkZPXCI7XHJcbiAgICBMb2dMZXZlbFtMb2dMZXZlbFtcIldBUk5cIl0gPSAzXSA9IFwiV0FSTlwiO1xyXG4gICAgTG9nTGV2ZWxbTG9nTGV2ZWxbXCJFUlJPUlwiXSA9IDRdID0gXCJFUlJPUlwiO1xyXG4gICAgTG9nTGV2ZWxbTG9nTGV2ZWxbXCJTSUxFTlRcIl0gPSA1XSA9IFwiU0lMRU5UXCI7XHJcbn0pKExvZ0xldmVsIHx8IChMb2dMZXZlbCA9IHt9KSk7XHJcbmNvbnN0IGxldmVsU3RyaW5nVG9FbnVtID0ge1xyXG4gICAgJ2RlYnVnJzogTG9nTGV2ZWwuREVCVUcsXHJcbiAgICAndmVyYm9zZSc6IExvZ0xldmVsLlZFUkJPU0UsXHJcbiAgICAnaW5mbyc6IExvZ0xldmVsLklORk8sXHJcbiAgICAnd2Fybic6IExvZ0xldmVsLldBUk4sXHJcbiAgICAnZXJyb3InOiBMb2dMZXZlbC5FUlJPUixcclxuICAgICdzaWxlbnQnOiBMb2dMZXZlbC5TSUxFTlRcclxufTtcclxuLyoqXHJcbiAqIFRoZSBkZWZhdWx0IGxvZyBsZXZlbFxyXG4gKi9cclxuY29uc3QgZGVmYXVsdExvZ0xldmVsID0gTG9nTGV2ZWwuSU5GTztcclxuLyoqXHJcbiAqIEJ5IGRlZmF1bHQsIGBjb25zb2xlLmRlYnVnYCBpcyBub3QgZGlzcGxheWVkIGluIHRoZSBkZXZlbG9wZXIgY29uc29sZSAoaW5cclxuICogY2hyb21lKS4gVG8gYXZvaWQgZm9yY2luZyB1c2VycyB0byBoYXZlIHRvIG9wdC1pbiB0byB0aGVzZSBsb2dzIHR3aWNlXHJcbiAqIChpLmUuIG9uY2UgZm9yIGZpcmViYXNlLCBhbmQgb25jZSBpbiB0aGUgY29uc29sZSksIHdlIGFyZSBzZW5kaW5nIGBERUJVR2BcclxuICogbG9ncyB0byB0aGUgYGNvbnNvbGUubG9nYCBmdW5jdGlvbi5cclxuICovXHJcbmNvbnN0IENvbnNvbGVNZXRob2QgPSB7XHJcbiAgICBbTG9nTGV2ZWwuREVCVUddOiAnbG9nJyxcclxuICAgIFtMb2dMZXZlbC5WRVJCT1NFXTogJ2xvZycsXHJcbiAgICBbTG9nTGV2ZWwuSU5GT106ICdpbmZvJyxcclxuICAgIFtMb2dMZXZlbC5XQVJOXTogJ3dhcm4nLFxyXG4gICAgW0xvZ0xldmVsLkVSUk9SXTogJ2Vycm9yJ1xyXG59O1xyXG4vKipcclxuICogVGhlIGRlZmF1bHQgbG9nIGhhbmRsZXIgd2lsbCBmb3J3YXJkIERFQlVHLCBWRVJCT1NFLCBJTkZPLCBXQVJOLCBhbmQgRVJST1JcclxuICogbWVzc2FnZXMgb24gdG8gdGhlaXIgY29ycmVzcG9uZGluZyBjb25zb2xlIGNvdW50ZXJwYXJ0cyAoaWYgdGhlIGxvZyBtZXRob2RcclxuICogaXMgc3VwcG9ydGVkIGJ5IHRoZSBjdXJyZW50IGxvZyBsZXZlbClcclxuICovXHJcbmNvbnN0IGRlZmF1bHRMb2dIYW5kbGVyID0gKGluc3RhbmNlLCBsb2dUeXBlLCAuLi5hcmdzKSA9PiB7XHJcbiAgICBpZiAobG9nVHlwZSA8IGluc3RhbmNlLmxvZ0xldmVsKSB7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG4gICAgY29uc3Qgbm93ID0gbmV3IERhdGUoKS50b0lTT1N0cmluZygpO1xyXG4gICAgY29uc3QgbWV0aG9kID0gQ29uc29sZU1ldGhvZFtsb2dUeXBlXTtcclxuICAgIGlmIChtZXRob2QpIHtcclxuICAgICAgICBjb25zb2xlW21ldGhvZF0oYFske25vd31dICAke2luc3RhbmNlLm5hbWV9OmAsIC4uLmFyZ3MpO1xyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBBdHRlbXB0ZWQgdG8gbG9nIGEgbWVzc2FnZSB3aXRoIGFuIGludmFsaWQgbG9nVHlwZSAodmFsdWU6ICR7bG9nVHlwZX0pYCk7XHJcbiAgICB9XHJcbn07XHJcbmNsYXNzIExvZ2dlciB7XHJcbiAgICAvKipcclxuICAgICAqIEdpdmVzIHlvdSBhbiBpbnN0YW5jZSBvZiBhIExvZ2dlciB0byBjYXB0dXJlIG1lc3NhZ2VzIGFjY29yZGluZyB0b1xyXG4gICAgICogRmlyZWJhc2UncyBsb2dnaW5nIHNjaGVtZS5cclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0gbmFtZSBUaGUgbmFtZSB0aGF0IHRoZSBsb2dzIHdpbGwgYmUgYXNzb2NpYXRlZCB3aXRoXHJcbiAgICAgKi9cclxuICAgIGNvbnN0cnVjdG9yKG5hbWUpIHtcclxuICAgICAgICB0aGlzLm5hbWUgPSBuYW1lO1xyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIFRoZSBsb2cgbGV2ZWwgb2YgdGhlIGdpdmVuIExvZ2dlciBpbnN0YW5jZS5cclxuICAgICAgICAgKi9cclxuICAgICAgICB0aGlzLl9sb2dMZXZlbCA9IGRlZmF1bHRMb2dMZXZlbDtcclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBUaGUgbWFpbiAoaW50ZXJuYWwpIGxvZyBoYW5kbGVyIGZvciB0aGUgTG9nZ2VyIGluc3RhbmNlLlxyXG4gICAgICAgICAqIENhbiBiZSBzZXQgdG8gYSBuZXcgZnVuY3Rpb24gaW4gaW50ZXJuYWwgcGFja2FnZSBjb2RlIGJ1dCBub3QgYnkgdXNlci5cclxuICAgICAgICAgKi9cclxuICAgICAgICB0aGlzLl9sb2dIYW5kbGVyID0gZGVmYXVsdExvZ0hhbmRsZXI7XHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogVGhlIG9wdGlvbmFsLCBhZGRpdGlvbmFsLCB1c2VyLWRlZmluZWQgbG9nIGhhbmRsZXIgZm9yIHRoZSBMb2dnZXIgaW5zdGFuY2UuXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgdGhpcy5fdXNlckxvZ0hhbmRsZXIgPSBudWxsO1xyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIENhcHR1cmUgdGhlIGN1cnJlbnQgaW5zdGFuY2UgZm9yIGxhdGVyIHVzZVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGluc3RhbmNlcy5wdXNoKHRoaXMpO1xyXG4gICAgfVxyXG4gICAgZ2V0IGxvZ0xldmVsKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9sb2dMZXZlbDtcclxuICAgIH1cclxuICAgIHNldCBsb2dMZXZlbCh2YWwpIHtcclxuICAgICAgICBpZiAoISh2YWwgaW4gTG9nTGV2ZWwpKSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoYEludmFsaWQgdmFsdWUgXCIke3ZhbH1cIiBhc3NpZ25lZCB0byBcXGBsb2dMZXZlbFxcYGApO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLl9sb2dMZXZlbCA9IHZhbDtcclxuICAgIH1cclxuICAgIC8vIFdvcmthcm91bmQgZm9yIHNldHRlci9nZXR0ZXIgaGF2aW5nIHRvIGJlIHRoZSBzYW1lIHR5cGUuXHJcbiAgICBzZXRMb2dMZXZlbCh2YWwpIHtcclxuICAgICAgICB0aGlzLl9sb2dMZXZlbCA9IHR5cGVvZiB2YWwgPT09ICdzdHJpbmcnID8gbGV2ZWxTdHJpbmdUb0VudW1bdmFsXSA6IHZhbDtcclxuICAgIH1cclxuICAgIGdldCBsb2dIYW5kbGVyKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9sb2dIYW5kbGVyO1xyXG4gICAgfVxyXG4gICAgc2V0IGxvZ0hhbmRsZXIodmFsKSB7XHJcbiAgICAgICAgaWYgKHR5cGVvZiB2YWwgIT09ICdmdW5jdGlvbicpIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignVmFsdWUgYXNzaWduZWQgdG8gYGxvZ0hhbmRsZXJgIG11c3QgYmUgYSBmdW5jdGlvbicpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLl9sb2dIYW5kbGVyID0gdmFsO1xyXG4gICAgfVxyXG4gICAgZ2V0IHVzZXJMb2dIYW5kbGVyKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl91c2VyTG9nSGFuZGxlcjtcclxuICAgIH1cclxuICAgIHNldCB1c2VyTG9nSGFuZGxlcih2YWwpIHtcclxuICAgICAgICB0aGlzLl91c2VyTG9nSGFuZGxlciA9IHZhbDtcclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICogVGhlIGZ1bmN0aW9ucyBiZWxvdyBhcmUgYWxsIGJhc2VkIG9uIHRoZSBgY29uc29sZWAgaW50ZXJmYWNlXHJcbiAgICAgKi9cclxuICAgIGRlYnVnKC4uLmFyZ3MpIHtcclxuICAgICAgICB0aGlzLl91c2VyTG9nSGFuZGxlciAmJiB0aGlzLl91c2VyTG9nSGFuZGxlcih0aGlzLCBMb2dMZXZlbC5ERUJVRywgLi4uYXJncyk7XHJcbiAgICAgICAgdGhpcy5fbG9nSGFuZGxlcih0aGlzLCBMb2dMZXZlbC5ERUJVRywgLi4uYXJncyk7XHJcbiAgICB9XHJcbiAgICBsb2coLi4uYXJncykge1xyXG4gICAgICAgIHRoaXMuX3VzZXJMb2dIYW5kbGVyICYmXHJcbiAgICAgICAgICAgIHRoaXMuX3VzZXJMb2dIYW5kbGVyKHRoaXMsIExvZ0xldmVsLlZFUkJPU0UsIC4uLmFyZ3MpO1xyXG4gICAgICAgIHRoaXMuX2xvZ0hhbmRsZXIodGhpcywgTG9nTGV2ZWwuVkVSQk9TRSwgLi4uYXJncyk7XHJcbiAgICB9XHJcbiAgICBpbmZvKC4uLmFyZ3MpIHtcclxuICAgICAgICB0aGlzLl91c2VyTG9nSGFuZGxlciAmJiB0aGlzLl91c2VyTG9nSGFuZGxlcih0aGlzLCBMb2dMZXZlbC5JTkZPLCAuLi5hcmdzKTtcclxuICAgICAgICB0aGlzLl9sb2dIYW5kbGVyKHRoaXMsIExvZ0xldmVsLklORk8sIC4uLmFyZ3MpO1xyXG4gICAgfVxyXG4gICAgd2FybiguLi5hcmdzKSB7XHJcbiAgICAgICAgdGhpcy5fdXNlckxvZ0hhbmRsZXIgJiYgdGhpcy5fdXNlckxvZ0hhbmRsZXIodGhpcywgTG9nTGV2ZWwuV0FSTiwgLi4uYXJncyk7XHJcbiAgICAgICAgdGhpcy5fbG9nSGFuZGxlcih0aGlzLCBMb2dMZXZlbC5XQVJOLCAuLi5hcmdzKTtcclxuICAgIH1cclxuICAgIGVycm9yKC4uLmFyZ3MpIHtcclxuICAgICAgICB0aGlzLl91c2VyTG9nSGFuZGxlciAmJiB0aGlzLl91c2VyTG9nSGFuZGxlcih0aGlzLCBMb2dMZXZlbC5FUlJPUiwgLi4uYXJncyk7XHJcbiAgICAgICAgdGhpcy5fbG9nSGFuZGxlcih0aGlzLCBMb2dMZXZlbC5FUlJPUiwgLi4uYXJncyk7XHJcbiAgICB9XHJcbn1cclxuZnVuY3Rpb24gc2V0TG9nTGV2ZWwobGV2ZWwpIHtcclxuICAgIGluc3RhbmNlcy5mb3JFYWNoKGluc3QgPT4ge1xyXG4gICAgICAgIGluc3Quc2V0TG9nTGV2ZWwobGV2ZWwpO1xyXG4gICAgfSk7XHJcbn1cclxuZnVuY3Rpb24gc2V0VXNlckxvZ0hhbmRsZXIobG9nQ2FsbGJhY2ssIG9wdGlvbnMpIHtcclxuICAgIGZvciAoY29uc3QgaW5zdGFuY2Ugb2YgaW5zdGFuY2VzKSB7XHJcbiAgICAgICAgbGV0IGN1c3RvbUxvZ0xldmVsID0gbnVsbDtcclxuICAgICAgICBpZiAob3B0aW9ucyAmJiBvcHRpb25zLmxldmVsKSB7XHJcbiAgICAgICAgICAgIGN1c3RvbUxvZ0xldmVsID0gbGV2ZWxTdHJpbmdUb0VudW1bb3B0aW9ucy5sZXZlbF07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChsb2dDYWxsYmFjayA9PT0gbnVsbCkge1xyXG4gICAgICAgICAgICBpbnN0YW5jZS51c2VyTG9nSGFuZGxlciA9IG51bGw7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBpbnN0YW5jZS51c2VyTG9nSGFuZGxlciA9IChpbnN0YW5jZSwgbGV2ZWwsIC4uLmFyZ3MpID0+IHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IG1lc3NhZ2UgPSBhcmdzXHJcbiAgICAgICAgICAgICAgICAgICAgLm1hcChhcmcgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChhcmcgPT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgZWxzZSBpZiAodHlwZW9mIGFyZyA9PT0gJ3N0cmluZycpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGFyZztcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgZWxzZSBpZiAodHlwZW9mIGFyZyA9PT0gJ251bWJlcicgfHwgdHlwZW9mIGFyZyA9PT0gJ2Jvb2xlYW4nKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBhcmcudG9TdHJpbmcoKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgZWxzZSBpZiAoYXJnIGluc3RhbmNlb2YgRXJyb3IpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGFyZy5tZXNzYWdlO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBKU09OLnN0cmluZ2lmeShhcmcpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhdGNoIChpZ25vcmVkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAgICAgLmZpbHRlcihhcmcgPT4gYXJnKVxyXG4gICAgICAgICAgICAgICAgICAgIC5qb2luKCcgJyk7XHJcbiAgICAgICAgICAgICAgICBpZiAobGV2ZWwgPj0gKGN1c3RvbUxvZ0xldmVsICE9PSBudWxsICYmIGN1c3RvbUxvZ0xldmVsICE9PSB2b2lkIDAgPyBjdXN0b21Mb2dMZXZlbCA6IGluc3RhbmNlLmxvZ0xldmVsKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGxvZ0NhbGxiYWNrKHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbGV2ZWw6IExvZ0xldmVsW2xldmVsXS50b0xvd2VyQ2FzZSgpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBtZXNzYWdlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBhcmdzLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiBpbnN0YW5jZS5uYW1lXHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XG5cbmV4cG9ydCB7IExvZ0xldmVsLCBMb2dnZXIsIHNldExvZ0xldmVsLCBzZXRVc2VyTG9nSGFuZGxlciB9O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9aW5kZXguZXNtMjAxNy5qcy5tYXBcbiIsIi8qKlxyXG4gKiBAbGljZW5zZVxyXG4gKiBDb3B5cmlnaHQgMjAxNyBHb29nbGUgTExDXHJcbiAqXHJcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XHJcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cclxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XHJcbiAqXHJcbiAqICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXHJcbiAqXHJcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcclxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxyXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cclxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxyXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cclxuICovXHJcbi8qKlxyXG4gKiBAZmlsZW92ZXJ2aWV3IEZpcmViYXNlIGNvbnN0YW50cy4gIFNvbWUgb2YgdGhlc2UgKEBkZWZpbmVzKSBjYW4gYmUgb3ZlcnJpZGRlbiBhdCBjb21waWxlLXRpbWUuXHJcbiAqL1xyXG5jb25zdCBDT05TVEFOVFMgPSB7XHJcbiAgICAvKipcclxuICAgICAqIEBkZWZpbmUge2Jvb2xlYW59IFdoZXRoZXIgdGhpcyBpcyB0aGUgY2xpZW50IE5vZGUuanMgU0RLLlxyXG4gICAgICovXHJcbiAgICBOT0RFX0NMSUVOVDogZmFsc2UsXHJcbiAgICAvKipcclxuICAgICAqIEBkZWZpbmUge2Jvb2xlYW59IFdoZXRoZXIgdGhpcyBpcyB0aGUgQWRtaW4gTm9kZS5qcyBTREsuXHJcbiAgICAgKi9cclxuICAgIE5PREVfQURNSU46IGZhbHNlLFxyXG4gICAgLyoqXHJcbiAgICAgKiBGaXJlYmFzZSBTREsgVmVyc2lvblxyXG4gICAgICovXHJcbiAgICBTREtfVkVSU0lPTjogJyR7SlNDT1JFX1ZFUlNJT059J1xyXG59O1xuXG4vKipcclxuICogQGxpY2Vuc2VcclxuICogQ29weXJpZ2h0IDIwMTcgR29vZ2xlIExMQ1xyXG4gKlxyXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xyXG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXHJcbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxyXG4gKlxyXG4gKiAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxyXG4gKlxyXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXHJcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcclxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXHJcbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcclxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXHJcbiAqL1xyXG4vKipcclxuICogVGhyb3dzIGFuIGVycm9yIGlmIHRoZSBwcm92aWRlZCBhc3NlcnRpb24gaXMgZmFsc3lcclxuICovXHJcbmNvbnN0IGFzc2VydCA9IGZ1bmN0aW9uIChhc3NlcnRpb24sIG1lc3NhZ2UpIHtcclxuICAgIGlmICghYXNzZXJ0aW9uKSB7XHJcbiAgICAgICAgdGhyb3cgYXNzZXJ0aW9uRXJyb3IobWVzc2FnZSk7XHJcbiAgICB9XHJcbn07XHJcbi8qKlxyXG4gKiBSZXR1cm5zIGFuIEVycm9yIG9iamVjdCBzdWl0YWJsZSBmb3IgdGhyb3dpbmcuXHJcbiAqL1xyXG5jb25zdCBhc3NlcnRpb25FcnJvciA9IGZ1bmN0aW9uIChtZXNzYWdlKSB7XHJcbiAgICByZXR1cm4gbmV3IEVycm9yKCdGaXJlYmFzZSBEYXRhYmFzZSAoJyArXHJcbiAgICAgICAgQ09OU1RBTlRTLlNES19WRVJTSU9OICtcclxuICAgICAgICAnKSBJTlRFUk5BTCBBU1NFUlQgRkFJTEVEOiAnICtcclxuICAgICAgICBtZXNzYWdlKTtcclxufTtcblxuLyoqXHJcbiAqIEBsaWNlbnNlXHJcbiAqIENvcHlyaWdodCAyMDE3IEdvb2dsZSBMTENcclxuICpcclxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcclxuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxyXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcclxuICpcclxuICogICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcclxuICpcclxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxyXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXHJcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxyXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXHJcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxyXG4gKi9cclxuY29uc3Qgc3RyaW5nVG9CeXRlQXJyYXkkMSA9IGZ1bmN0aW9uIChzdHIpIHtcclxuICAgIC8vIFRPRE8odXNlcik6IFVzZSBuYXRpdmUgaW1wbGVtZW50YXRpb25zIGlmL3doZW4gYXZhaWxhYmxlXHJcbiAgICBjb25zdCBvdXQgPSBbXTtcclxuICAgIGxldCBwID0gMDtcclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc3RyLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgbGV0IGMgPSBzdHIuY2hhckNvZGVBdChpKTtcclxuICAgICAgICBpZiAoYyA8IDEyOCkge1xyXG4gICAgICAgICAgICBvdXRbcCsrXSA9IGM7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKGMgPCAyMDQ4KSB7XHJcbiAgICAgICAgICAgIG91dFtwKytdID0gKGMgPj4gNikgfCAxOTI7XHJcbiAgICAgICAgICAgIG91dFtwKytdID0gKGMgJiA2MykgfCAxMjg7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKChjICYgMHhmYzAwKSA9PT0gMHhkODAwICYmXHJcbiAgICAgICAgICAgIGkgKyAxIDwgc3RyLmxlbmd0aCAmJlxyXG4gICAgICAgICAgICAoc3RyLmNoYXJDb2RlQXQoaSArIDEpICYgMHhmYzAwKSA9PT0gMHhkYzAwKSB7XHJcbiAgICAgICAgICAgIC8vIFN1cnJvZ2F0ZSBQYWlyXHJcbiAgICAgICAgICAgIGMgPSAweDEwMDAwICsgKChjICYgMHgwM2ZmKSA8PCAxMCkgKyAoc3RyLmNoYXJDb2RlQXQoKytpKSAmIDB4MDNmZik7XHJcbiAgICAgICAgICAgIG91dFtwKytdID0gKGMgPj4gMTgpIHwgMjQwO1xyXG4gICAgICAgICAgICBvdXRbcCsrXSA9ICgoYyA+PiAxMikgJiA2MykgfCAxMjg7XHJcbiAgICAgICAgICAgIG91dFtwKytdID0gKChjID4+IDYpICYgNjMpIHwgMTI4O1xyXG4gICAgICAgICAgICBvdXRbcCsrXSA9IChjICYgNjMpIHwgMTI4O1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgb3V0W3ArK10gPSAoYyA+PiAxMikgfCAyMjQ7XHJcbiAgICAgICAgICAgIG91dFtwKytdID0gKChjID4+IDYpICYgNjMpIHwgMTI4O1xyXG4gICAgICAgICAgICBvdXRbcCsrXSA9IChjICYgNjMpIHwgMTI4O1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiBvdXQ7XHJcbn07XHJcbi8qKlxyXG4gKiBUdXJucyBhbiBhcnJheSBvZiBudW1iZXJzIGludG8gdGhlIHN0cmluZyBnaXZlbiBieSB0aGUgY29uY2F0ZW5hdGlvbiBvZiB0aGVcclxuICogY2hhcmFjdGVycyB0byB3aGljaCB0aGUgbnVtYmVycyBjb3JyZXNwb25kLlxyXG4gKiBAcGFyYW0gYnl0ZXMgQXJyYXkgb2YgbnVtYmVycyByZXByZXNlbnRpbmcgY2hhcmFjdGVycy5cclxuICogQHJldHVybiBTdHJpbmdpZmljYXRpb24gb2YgdGhlIGFycmF5LlxyXG4gKi9cclxuY29uc3QgYnl0ZUFycmF5VG9TdHJpbmcgPSBmdW5jdGlvbiAoYnl0ZXMpIHtcclxuICAgIC8vIFRPRE8odXNlcik6IFVzZSBuYXRpdmUgaW1wbGVtZW50YXRpb25zIGlmL3doZW4gYXZhaWxhYmxlXHJcbiAgICBjb25zdCBvdXQgPSBbXTtcclxuICAgIGxldCBwb3MgPSAwLCBjID0gMDtcclxuICAgIHdoaWxlIChwb3MgPCBieXRlcy5sZW5ndGgpIHtcclxuICAgICAgICBjb25zdCBjMSA9IGJ5dGVzW3BvcysrXTtcclxuICAgICAgICBpZiAoYzEgPCAxMjgpIHtcclxuICAgICAgICAgICAgb3V0W2MrK10gPSBTdHJpbmcuZnJvbUNoYXJDb2RlKGMxKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAoYzEgPiAxOTEgJiYgYzEgPCAyMjQpIHtcclxuICAgICAgICAgICAgY29uc3QgYzIgPSBieXRlc1twb3MrK107XHJcbiAgICAgICAgICAgIG91dFtjKytdID0gU3RyaW5nLmZyb21DaGFyQ29kZSgoKGMxICYgMzEpIDw8IDYpIHwgKGMyICYgNjMpKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAoYzEgPiAyMzkgJiYgYzEgPCAzNjUpIHtcclxuICAgICAgICAgICAgLy8gU3Vycm9nYXRlIFBhaXJcclxuICAgICAgICAgICAgY29uc3QgYzIgPSBieXRlc1twb3MrK107XHJcbiAgICAgICAgICAgIGNvbnN0IGMzID0gYnl0ZXNbcG9zKytdO1xyXG4gICAgICAgICAgICBjb25zdCBjNCA9IGJ5dGVzW3BvcysrXTtcclxuICAgICAgICAgICAgY29uc3QgdSA9ICgoKGMxICYgNykgPDwgMTgpIHwgKChjMiAmIDYzKSA8PCAxMikgfCAoKGMzICYgNjMpIDw8IDYpIHwgKGM0ICYgNjMpKSAtXHJcbiAgICAgICAgICAgICAgICAweDEwMDAwO1xyXG4gICAgICAgICAgICBvdXRbYysrXSA9IFN0cmluZy5mcm9tQ2hhckNvZGUoMHhkODAwICsgKHUgPj4gMTApKTtcclxuICAgICAgICAgICAgb3V0W2MrK10gPSBTdHJpbmcuZnJvbUNoYXJDb2RlKDB4ZGMwMCArICh1ICYgMTAyMykpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgY29uc3QgYzIgPSBieXRlc1twb3MrK107XHJcbiAgICAgICAgICAgIGNvbnN0IGMzID0gYnl0ZXNbcG9zKytdO1xyXG4gICAgICAgICAgICBvdXRbYysrXSA9IFN0cmluZy5mcm9tQ2hhckNvZGUoKChjMSAmIDE1KSA8PCAxMikgfCAoKGMyICYgNjMpIDw8IDYpIHwgKGMzICYgNjMpKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gb3V0LmpvaW4oJycpO1xyXG59O1xyXG4vLyBXZSBkZWZpbmUgaXQgYXMgYW4gb2JqZWN0IGxpdGVyYWwgaW5zdGVhZCBvZiBhIGNsYXNzIGJlY2F1c2UgYSBjbGFzcyBjb21waWxlZCBkb3duIHRvIGVzNSBjYW4ndFxyXG4vLyBiZSB0cmVlc2hha2VkLiBodHRwczovL2dpdGh1Yi5jb20vcm9sbHVwL3JvbGx1cC9pc3N1ZXMvMTY5MVxyXG4vLyBTdGF0aWMgbG9va3VwIG1hcHMsIGxhemlseSBwb3B1bGF0ZWQgYnkgaW5pdF8oKVxyXG5jb25zdCBiYXNlNjQgPSB7XHJcbiAgICAvKipcclxuICAgICAqIE1hcHMgYnl0ZXMgdG8gY2hhcmFjdGVycy5cclxuICAgICAqL1xyXG4gICAgYnl0ZVRvQ2hhck1hcF86IG51bGwsXHJcbiAgICAvKipcclxuICAgICAqIE1hcHMgY2hhcmFjdGVycyB0byBieXRlcy5cclxuICAgICAqL1xyXG4gICAgY2hhclRvQnl0ZU1hcF86IG51bGwsXHJcbiAgICAvKipcclxuICAgICAqIE1hcHMgYnl0ZXMgdG8gd2Vic2FmZSBjaGFyYWN0ZXJzLlxyXG4gICAgICogQHByaXZhdGVcclxuICAgICAqL1xyXG4gICAgYnl0ZVRvQ2hhck1hcFdlYlNhZmVfOiBudWxsLFxyXG4gICAgLyoqXHJcbiAgICAgKiBNYXBzIHdlYnNhZmUgY2hhcmFjdGVycyB0byBieXRlcy5cclxuICAgICAqIEBwcml2YXRlXHJcbiAgICAgKi9cclxuICAgIGNoYXJUb0J5dGVNYXBXZWJTYWZlXzogbnVsbCxcclxuICAgIC8qKlxyXG4gICAgICogT3VyIGRlZmF1bHQgYWxwaGFiZXQsIHNoYXJlZCBiZXR3ZWVuXHJcbiAgICAgKiBFTkNPREVEX1ZBTFMgYW5kIEVOQ09ERURfVkFMU19XRUJTQUZFXHJcbiAgICAgKi9cclxuICAgIEVOQ09ERURfVkFMU19CQVNFOiAnQUJDREVGR0hJSktMTU5PUFFSU1RVVldYWVonICsgJ2FiY2RlZmdoaWprbG1ub3BxcnN0dXZ3eHl6JyArICcwMTIzNDU2Nzg5JyxcclxuICAgIC8qKlxyXG4gICAgICogT3VyIGRlZmF1bHQgYWxwaGFiZXQuIFZhbHVlIDY0ICg9KSBpcyBzcGVjaWFsOyBpdCBtZWFucyBcIm5vdGhpbmcuXCJcclxuICAgICAqL1xyXG4gICAgZ2V0IEVOQ09ERURfVkFMUygpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5FTkNPREVEX1ZBTFNfQkFTRSArICcrLz0nO1xyXG4gICAgfSxcclxuICAgIC8qKlxyXG4gICAgICogT3VyIHdlYnNhZmUgYWxwaGFiZXQuXHJcbiAgICAgKi9cclxuICAgIGdldCBFTkNPREVEX1ZBTFNfV0VCU0FGRSgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5FTkNPREVEX1ZBTFNfQkFTRSArICctXy4nO1xyXG4gICAgfSxcclxuICAgIC8qKlxyXG4gICAgICogV2hldGhlciB0aGlzIGJyb3dzZXIgc3VwcG9ydHMgdGhlIGF0b2IgYW5kIGJ0b2EgZnVuY3Rpb25zLiBUaGlzIGV4dGVuc2lvblxyXG4gICAgICogc3RhcnRlZCBhdCBNb3ppbGxhIGJ1dCBpcyBub3cgaW1wbGVtZW50ZWQgYnkgbWFueSBicm93c2Vycy4gV2UgdXNlIHRoZVxyXG4gICAgICogQVNTVU1FXyogdmFyaWFibGVzIHRvIGF2b2lkIHB1bGxpbmcgaW4gdGhlIGZ1bGwgdXNlcmFnZW50IGRldGVjdGlvbiBsaWJyYXJ5XHJcbiAgICAgKiBidXQgc3RpbGwgYWxsb3dpbmcgdGhlIHN0YW5kYXJkIHBlci1icm93c2VyIGNvbXBpbGF0aW9ucy5cclxuICAgICAqXHJcbiAgICAgKi9cclxuICAgIEhBU19OQVRJVkVfU1VQUE9SVDogdHlwZW9mIGF0b2IgPT09ICdmdW5jdGlvbicsXHJcbiAgICAvKipcclxuICAgICAqIEJhc2U2NC1lbmNvZGUgYW4gYXJyYXkgb2YgYnl0ZXMuXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIGlucHV0IEFuIGFycmF5IG9mIGJ5dGVzIChudW1iZXJzIHdpdGhcclxuICAgICAqICAgICB2YWx1ZSBpbiBbMCwgMjU1XSkgdG8gZW5jb2RlLlxyXG4gICAgICogQHBhcmFtIHdlYlNhZmUgQm9vbGVhbiBpbmRpY2F0aW5nIHdlIHNob3VsZCB1c2UgdGhlXHJcbiAgICAgKiAgICAgYWx0ZXJuYXRpdmUgYWxwaGFiZXQuXHJcbiAgICAgKiBAcmV0dXJuIFRoZSBiYXNlNjQgZW5jb2RlZCBzdHJpbmcuXHJcbiAgICAgKi9cclxuICAgIGVuY29kZUJ5dGVBcnJheShpbnB1dCwgd2ViU2FmZSkge1xyXG4gICAgICAgIGlmICghQXJyYXkuaXNBcnJheShpbnB1dCkpIHtcclxuICAgICAgICAgICAgdGhyb3cgRXJyb3IoJ2VuY29kZUJ5dGVBcnJheSB0YWtlcyBhbiBhcnJheSBhcyBhIHBhcmFtZXRlcicpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmluaXRfKCk7XHJcbiAgICAgICAgY29uc3QgYnl0ZVRvQ2hhck1hcCA9IHdlYlNhZmVcclxuICAgICAgICAgICAgPyB0aGlzLmJ5dGVUb0NoYXJNYXBXZWJTYWZlX1xyXG4gICAgICAgICAgICA6IHRoaXMuYnl0ZVRvQ2hhck1hcF87XHJcbiAgICAgICAgY29uc3Qgb3V0cHV0ID0gW107XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBpbnB1dC5sZW5ndGg7IGkgKz0gMykge1xyXG4gICAgICAgICAgICBjb25zdCBieXRlMSA9IGlucHV0W2ldO1xyXG4gICAgICAgICAgICBjb25zdCBoYXZlQnl0ZTIgPSBpICsgMSA8IGlucHV0Lmxlbmd0aDtcclxuICAgICAgICAgICAgY29uc3QgYnl0ZTIgPSBoYXZlQnl0ZTIgPyBpbnB1dFtpICsgMV0gOiAwO1xyXG4gICAgICAgICAgICBjb25zdCBoYXZlQnl0ZTMgPSBpICsgMiA8IGlucHV0Lmxlbmd0aDtcclxuICAgICAgICAgICAgY29uc3QgYnl0ZTMgPSBoYXZlQnl0ZTMgPyBpbnB1dFtpICsgMl0gOiAwO1xyXG4gICAgICAgICAgICBjb25zdCBvdXRCeXRlMSA9IGJ5dGUxID4+IDI7XHJcbiAgICAgICAgICAgIGNvbnN0IG91dEJ5dGUyID0gKChieXRlMSAmIDB4MDMpIDw8IDQpIHwgKGJ5dGUyID4+IDQpO1xyXG4gICAgICAgICAgICBsZXQgb3V0Qnl0ZTMgPSAoKGJ5dGUyICYgMHgwZikgPDwgMikgfCAoYnl0ZTMgPj4gNik7XHJcbiAgICAgICAgICAgIGxldCBvdXRCeXRlNCA9IGJ5dGUzICYgMHgzZjtcclxuICAgICAgICAgICAgaWYgKCFoYXZlQnl0ZTMpIHtcclxuICAgICAgICAgICAgICAgIG91dEJ5dGU0ID0gNjQ7XHJcbiAgICAgICAgICAgICAgICBpZiAoIWhhdmVCeXRlMikge1xyXG4gICAgICAgICAgICAgICAgICAgIG91dEJ5dGUzID0gNjQ7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgb3V0cHV0LnB1c2goYnl0ZVRvQ2hhck1hcFtvdXRCeXRlMV0sIGJ5dGVUb0NoYXJNYXBbb3V0Qnl0ZTJdLCBieXRlVG9DaGFyTWFwW291dEJ5dGUzXSwgYnl0ZVRvQ2hhck1hcFtvdXRCeXRlNF0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gb3V0cHV0LmpvaW4oJycpO1xyXG4gICAgfSxcclxuICAgIC8qKlxyXG4gICAgICogQmFzZTY0LWVuY29kZSBhIHN0cmluZy5cclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0gaW5wdXQgQSBzdHJpbmcgdG8gZW5jb2RlLlxyXG4gICAgICogQHBhcmFtIHdlYlNhZmUgSWYgdHJ1ZSwgd2Ugc2hvdWxkIHVzZSB0aGVcclxuICAgICAqICAgICBhbHRlcm5hdGl2ZSBhbHBoYWJldC5cclxuICAgICAqIEByZXR1cm4gVGhlIGJhc2U2NCBlbmNvZGVkIHN0cmluZy5cclxuICAgICAqL1xyXG4gICAgZW5jb2RlU3RyaW5nKGlucHV0LCB3ZWJTYWZlKSB7XHJcbiAgICAgICAgLy8gU2hvcnRjdXQgZm9yIE1vemlsbGEgYnJvd3NlcnMgdGhhdCBpbXBsZW1lbnRcclxuICAgICAgICAvLyBhIG5hdGl2ZSBiYXNlNjQgZW5jb2RlciBpbiB0aGUgZm9ybSBvZiBcImJ0b2EvYXRvYlwiXHJcbiAgICAgICAgaWYgKHRoaXMuSEFTX05BVElWRV9TVVBQT1JUICYmICF3ZWJTYWZlKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBidG9hKGlucHV0KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZW5jb2RlQnl0ZUFycmF5KHN0cmluZ1RvQnl0ZUFycmF5JDEoaW5wdXQpLCB3ZWJTYWZlKTtcclxuICAgIH0sXHJcbiAgICAvKipcclxuICAgICAqIEJhc2U2NC1kZWNvZGUgYSBzdHJpbmcuXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIGlucHV0IHRvIGRlY29kZS5cclxuICAgICAqIEBwYXJhbSB3ZWJTYWZlIFRydWUgaWYgd2Ugc2hvdWxkIHVzZSB0aGVcclxuICAgICAqICAgICBhbHRlcm5hdGl2ZSBhbHBoYWJldC5cclxuICAgICAqIEByZXR1cm4gc3RyaW5nIHJlcHJlc2VudGluZyB0aGUgZGVjb2RlZCB2YWx1ZS5cclxuICAgICAqL1xyXG4gICAgZGVjb2RlU3RyaW5nKGlucHV0LCB3ZWJTYWZlKSB7XHJcbiAgICAgICAgLy8gU2hvcnRjdXQgZm9yIE1vemlsbGEgYnJvd3NlcnMgdGhhdCBpbXBsZW1lbnRcclxuICAgICAgICAvLyBhIG5hdGl2ZSBiYXNlNjQgZW5jb2RlciBpbiB0aGUgZm9ybSBvZiBcImJ0b2EvYXRvYlwiXHJcbiAgICAgICAgaWYgKHRoaXMuSEFTX05BVElWRV9TVVBQT1JUICYmICF3ZWJTYWZlKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBhdG9iKGlucHV0KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGJ5dGVBcnJheVRvU3RyaW5nKHRoaXMuZGVjb2RlU3RyaW5nVG9CeXRlQXJyYXkoaW5wdXQsIHdlYlNhZmUpKTtcclxuICAgIH0sXHJcbiAgICAvKipcclxuICAgICAqIEJhc2U2NC1kZWNvZGUgYSBzdHJpbmcuXHJcbiAgICAgKlxyXG4gICAgICogSW4gYmFzZS02NCBkZWNvZGluZywgZ3JvdXBzIG9mIGZvdXIgY2hhcmFjdGVycyBhcmUgY29udmVydGVkIGludG8gdGhyZWVcclxuICAgICAqIGJ5dGVzLiAgSWYgdGhlIGVuY29kZXIgZGlkIG5vdCBhcHBseSBwYWRkaW5nLCB0aGUgaW5wdXQgbGVuZ3RoIG1heSBub3RcclxuICAgICAqIGJlIGEgbXVsdGlwbGUgb2YgNC5cclxuICAgICAqXHJcbiAgICAgKiBJbiB0aGlzIGNhc2UsIHRoZSBsYXN0IGdyb3VwIHdpbGwgaGF2ZSBmZXdlciB0aGFuIDQgY2hhcmFjdGVycywgYW5kXHJcbiAgICAgKiBwYWRkaW5nIHdpbGwgYmUgaW5mZXJyZWQuICBJZiB0aGUgZ3JvdXAgaGFzIG9uZSBvciB0d28gY2hhcmFjdGVycywgaXQgZGVjb2Rlc1xyXG4gICAgICogdG8gb25lIGJ5dGUuICBJZiB0aGUgZ3JvdXAgaGFzIHRocmVlIGNoYXJhY3RlcnMsIGl0IGRlY29kZXMgdG8gdHdvIGJ5dGVzLlxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSBpbnB1dCBJbnB1dCB0byBkZWNvZGUuXHJcbiAgICAgKiBAcGFyYW0gd2ViU2FmZSBUcnVlIGlmIHdlIHNob3VsZCB1c2UgdGhlIHdlYi1zYWZlIGFscGhhYmV0LlxyXG4gICAgICogQHJldHVybiBieXRlcyByZXByZXNlbnRpbmcgdGhlIGRlY29kZWQgdmFsdWUuXHJcbiAgICAgKi9cclxuICAgIGRlY29kZVN0cmluZ1RvQnl0ZUFycmF5KGlucHV0LCB3ZWJTYWZlKSB7XHJcbiAgICAgICAgdGhpcy5pbml0XygpO1xyXG4gICAgICAgIGNvbnN0IGNoYXJUb0J5dGVNYXAgPSB3ZWJTYWZlXHJcbiAgICAgICAgICAgID8gdGhpcy5jaGFyVG9CeXRlTWFwV2ViU2FmZV9cclxuICAgICAgICAgICAgOiB0aGlzLmNoYXJUb0J5dGVNYXBfO1xyXG4gICAgICAgIGNvbnN0IG91dHB1dCA9IFtdO1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgaW5wdXQubGVuZ3RoOykge1xyXG4gICAgICAgICAgICBjb25zdCBieXRlMSA9IGNoYXJUb0J5dGVNYXBbaW5wdXQuY2hhckF0KGkrKyldO1xyXG4gICAgICAgICAgICBjb25zdCBoYXZlQnl0ZTIgPSBpIDwgaW5wdXQubGVuZ3RoO1xyXG4gICAgICAgICAgICBjb25zdCBieXRlMiA9IGhhdmVCeXRlMiA/IGNoYXJUb0J5dGVNYXBbaW5wdXQuY2hhckF0KGkpXSA6IDA7XHJcbiAgICAgICAgICAgICsraTtcclxuICAgICAgICAgICAgY29uc3QgaGF2ZUJ5dGUzID0gaSA8IGlucHV0Lmxlbmd0aDtcclxuICAgICAgICAgICAgY29uc3QgYnl0ZTMgPSBoYXZlQnl0ZTMgPyBjaGFyVG9CeXRlTWFwW2lucHV0LmNoYXJBdChpKV0gOiA2NDtcclxuICAgICAgICAgICAgKytpO1xyXG4gICAgICAgICAgICBjb25zdCBoYXZlQnl0ZTQgPSBpIDwgaW5wdXQubGVuZ3RoO1xyXG4gICAgICAgICAgICBjb25zdCBieXRlNCA9IGhhdmVCeXRlNCA/IGNoYXJUb0J5dGVNYXBbaW5wdXQuY2hhckF0KGkpXSA6IDY0O1xyXG4gICAgICAgICAgICArK2k7XHJcbiAgICAgICAgICAgIGlmIChieXRlMSA9PSBudWxsIHx8IGJ5dGUyID09IG51bGwgfHwgYnl0ZTMgPT0gbnVsbCB8fCBieXRlNCA9PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRGVjb2RlQmFzZTY0U3RyaW5nRXJyb3IoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjb25zdCBvdXRCeXRlMSA9IChieXRlMSA8PCAyKSB8IChieXRlMiA+PiA0KTtcclxuICAgICAgICAgICAgb3V0cHV0LnB1c2gob3V0Qnl0ZTEpO1xyXG4gICAgICAgICAgICBpZiAoYnl0ZTMgIT09IDY0KSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBvdXRCeXRlMiA9ICgoYnl0ZTIgPDwgNCkgJiAweGYwKSB8IChieXRlMyA+PiAyKTtcclxuICAgICAgICAgICAgICAgIG91dHB1dC5wdXNoKG91dEJ5dGUyKTtcclxuICAgICAgICAgICAgICAgIGlmIChieXRlNCAhPT0gNjQpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBvdXRCeXRlMyA9ICgoYnl0ZTMgPDwgNikgJiAweGMwKSB8IGJ5dGU0O1xyXG4gICAgICAgICAgICAgICAgICAgIG91dHB1dC5wdXNoKG91dEJ5dGUzKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gb3V0cHV0O1xyXG4gICAgfSxcclxuICAgIC8qKlxyXG4gICAgICogTGF6eSBzdGF0aWMgaW5pdGlhbGl6YXRpb24gZnVuY3Rpb24uIENhbGxlZCBiZWZvcmVcclxuICAgICAqIGFjY2Vzc2luZyBhbnkgb2YgdGhlIHN0YXRpYyBtYXAgdmFyaWFibGVzLlxyXG4gICAgICogQHByaXZhdGVcclxuICAgICAqL1xyXG4gICAgaW5pdF8oKSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLmJ5dGVUb0NoYXJNYXBfKSB7XHJcbiAgICAgICAgICAgIHRoaXMuYnl0ZVRvQ2hhck1hcF8gPSB7fTtcclxuICAgICAgICAgICAgdGhpcy5jaGFyVG9CeXRlTWFwXyA9IHt9O1xyXG4gICAgICAgICAgICB0aGlzLmJ5dGVUb0NoYXJNYXBXZWJTYWZlXyA9IHt9O1xyXG4gICAgICAgICAgICB0aGlzLmNoYXJUb0J5dGVNYXBXZWJTYWZlXyA9IHt9O1xyXG4gICAgICAgICAgICAvLyBXZSB3YW50IHF1aWNrIG1hcHBpbmdzIGJhY2sgYW5kIGZvcnRoLCBzbyB3ZSBwcmVjb21wdXRlIHR3byBtYXBzLlxyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuRU5DT0RFRF9WQUxTLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmJ5dGVUb0NoYXJNYXBfW2ldID0gdGhpcy5FTkNPREVEX1ZBTFMuY2hhckF0KGkpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jaGFyVG9CeXRlTWFwX1t0aGlzLmJ5dGVUb0NoYXJNYXBfW2ldXSA9IGk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmJ5dGVUb0NoYXJNYXBXZWJTYWZlX1tpXSA9IHRoaXMuRU5DT0RFRF9WQUxTX1dFQlNBRkUuY2hhckF0KGkpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jaGFyVG9CeXRlTWFwV2ViU2FmZV9bdGhpcy5ieXRlVG9DaGFyTWFwV2ViU2FmZV9baV1dID0gaTtcclxuICAgICAgICAgICAgICAgIC8vIEJlIGZvcmdpdmluZyB3aGVuIGRlY29kaW5nIGFuZCBjb3JyZWN0bHkgZGVjb2RlIGJvdGggZW5jb2RpbmdzLlxyXG4gICAgICAgICAgICAgICAgaWYgKGkgPj0gdGhpcy5FTkNPREVEX1ZBTFNfQkFTRS5sZW5ndGgpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmNoYXJUb0J5dGVNYXBfW3RoaXMuRU5DT0RFRF9WQUxTX1dFQlNBRkUuY2hhckF0KGkpXSA9IGk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jaGFyVG9CeXRlTWFwV2ViU2FmZV9bdGhpcy5FTkNPREVEX1ZBTFMuY2hhckF0KGkpXSA9IGk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbn07XHJcbi8qKlxyXG4gKiBBbiBlcnJvciBlbmNvdW50ZXJlZCB3aGlsZSBkZWNvZGluZyBiYXNlNjQgc3RyaW5nLlxyXG4gKi9cclxuY2xhc3MgRGVjb2RlQmFzZTY0U3RyaW5nRXJyb3IgZXh0ZW5kcyBFcnJvciB7XHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICBzdXBlciguLi5hcmd1bWVudHMpO1xyXG4gICAgICAgIHRoaXMubmFtZSA9ICdEZWNvZGVCYXNlNjRTdHJpbmdFcnJvcic7XHJcbiAgICB9XHJcbn1cclxuLyoqXHJcbiAqIFVSTC1zYWZlIGJhc2U2NCBlbmNvZGluZ1xyXG4gKi9cclxuY29uc3QgYmFzZTY0RW5jb2RlID0gZnVuY3Rpb24gKHN0cikge1xyXG4gICAgY29uc3QgdXRmOEJ5dGVzID0gc3RyaW5nVG9CeXRlQXJyYXkkMShzdHIpO1xyXG4gICAgcmV0dXJuIGJhc2U2NC5lbmNvZGVCeXRlQXJyYXkodXRmOEJ5dGVzLCB0cnVlKTtcclxufTtcclxuLyoqXHJcbiAqIFVSTC1zYWZlIGJhc2U2NCBlbmNvZGluZyAod2l0aG91dCBcIi5cIiBwYWRkaW5nIGluIHRoZSBlbmQpLlxyXG4gKiBlLmcuIFVzZWQgaW4gSlNPTiBXZWIgVG9rZW4gKEpXVCkgcGFydHMuXHJcbiAqL1xyXG5jb25zdCBiYXNlNjR1cmxFbmNvZGVXaXRob3V0UGFkZGluZyA9IGZ1bmN0aW9uIChzdHIpIHtcclxuICAgIC8vIFVzZSBiYXNlNjR1cmwgZW5jb2RpbmcgYW5kIHJlbW92ZSBwYWRkaW5nIGluIHRoZSBlbmQgKGRvdCBjaGFyYWN0ZXJzKS5cclxuICAgIHJldHVybiBiYXNlNjRFbmNvZGUoc3RyKS5yZXBsYWNlKC9cXC4vZywgJycpO1xyXG59O1xyXG4vKipcclxuICogVVJMLXNhZmUgYmFzZTY0IGRlY29kaW5nXHJcbiAqXHJcbiAqIE5PVEU6IERPIE5PVCB1c2UgdGhlIGdsb2JhbCBhdG9iKCkgZnVuY3Rpb24gLSBpdCBkb2VzIE5PVCBzdXBwb3J0IHRoZVxyXG4gKiBiYXNlNjRVcmwgdmFyaWFudCBlbmNvZGluZy5cclxuICpcclxuICogQHBhcmFtIHN0ciBUbyBiZSBkZWNvZGVkXHJcbiAqIEByZXR1cm4gRGVjb2RlZCByZXN1bHQsIGlmIHBvc3NpYmxlXHJcbiAqL1xyXG5jb25zdCBiYXNlNjREZWNvZGUgPSBmdW5jdGlvbiAoc3RyKSB7XHJcbiAgICB0cnkge1xyXG4gICAgICAgIHJldHVybiBiYXNlNjQuZGVjb2RlU3RyaW5nKHN0ciwgdHJ1ZSk7XHJcbiAgICB9XHJcbiAgICBjYXRjaCAoZSkge1xyXG4gICAgICAgIGNvbnNvbGUuZXJyb3IoJ2Jhc2U2NERlY29kZSBmYWlsZWQ6ICcsIGUpO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIG51bGw7XHJcbn07XG5cbi8qKlxyXG4gKiBAbGljZW5zZVxyXG4gKiBDb3B5cmlnaHQgMjAxNyBHb29nbGUgTExDXHJcbiAqXHJcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XHJcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cclxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XHJcbiAqXHJcbiAqICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXHJcbiAqXHJcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcclxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxyXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cclxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxyXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cclxuICovXHJcbi8qKlxyXG4gKiBEbyBhIGRlZXAtY29weSBvZiBiYXNpYyBKYXZhU2NyaXB0IE9iamVjdHMgb3IgQXJyYXlzLlxyXG4gKi9cclxuZnVuY3Rpb24gZGVlcENvcHkodmFsdWUpIHtcclxuICAgIHJldHVybiBkZWVwRXh0ZW5kKHVuZGVmaW5lZCwgdmFsdWUpO1xyXG59XHJcbi8qKlxyXG4gKiBDb3B5IHByb3BlcnRpZXMgZnJvbSBzb3VyY2UgdG8gdGFyZ2V0IChyZWN1cnNpdmVseSBhbGxvd3MgZXh0ZW5zaW9uXHJcbiAqIG9mIE9iamVjdHMgYW5kIEFycmF5cykuICBTY2FsYXIgdmFsdWVzIGluIHRoZSB0YXJnZXQgYXJlIG92ZXItd3JpdHRlbi5cclxuICogSWYgdGFyZ2V0IGlzIHVuZGVmaW5lZCwgYW4gb2JqZWN0IG9mIHRoZSBhcHByb3ByaWF0ZSB0eXBlIHdpbGwgYmUgY3JlYXRlZFxyXG4gKiAoYW5kIHJldHVybmVkKS5cclxuICpcclxuICogV2UgcmVjdXJzaXZlbHkgY29weSBhbGwgY2hpbGQgcHJvcGVydGllcyBvZiBwbGFpbiBPYmplY3RzIGluIHRoZSBzb3VyY2UtIHNvXHJcbiAqIHRoYXQgbmFtZXNwYWNlLSBsaWtlIGRpY3Rpb25hcmllcyBhcmUgbWVyZ2VkLlxyXG4gKlxyXG4gKiBOb3RlIHRoYXQgdGhlIHRhcmdldCBjYW4gYmUgYSBmdW5jdGlvbiwgaW4gd2hpY2ggY2FzZSB0aGUgcHJvcGVydGllcyBpblxyXG4gKiB0aGUgc291cmNlIE9iamVjdCBhcmUgY29waWVkIG9udG8gaXQgYXMgc3RhdGljIHByb3BlcnRpZXMgb2YgdGhlIEZ1bmN0aW9uLlxyXG4gKlxyXG4gKiBOb3RlOiB3ZSBkb24ndCBtZXJnZSBfX3Byb3RvX18gdG8gcHJldmVudCBwcm90b3R5cGUgcG9sbHV0aW9uXHJcbiAqL1xyXG5mdW5jdGlvbiBkZWVwRXh0ZW5kKHRhcmdldCwgc291cmNlKSB7XHJcbiAgICBpZiAoIShzb3VyY2UgaW5zdGFuY2VvZiBPYmplY3QpKSB7XHJcbiAgICAgICAgcmV0dXJuIHNvdXJjZTtcclxuICAgIH1cclxuICAgIHN3aXRjaCAoc291cmNlLmNvbnN0cnVjdG9yKSB7XHJcbiAgICAgICAgY2FzZSBEYXRlOlxyXG4gICAgICAgICAgICAvLyBUcmVhdCBEYXRlcyBsaWtlIHNjYWxhcnM7IGlmIHRoZSB0YXJnZXQgZGF0ZSBvYmplY3QgaGFkIGFueSBjaGlsZFxyXG4gICAgICAgICAgICAvLyBwcm9wZXJ0aWVzIC0gdGhleSB3aWxsIGJlIGxvc3QhXHJcbiAgICAgICAgICAgIGNvbnN0IGRhdGVWYWx1ZSA9IHNvdXJjZTtcclxuICAgICAgICAgICAgcmV0dXJuIG5ldyBEYXRlKGRhdGVWYWx1ZS5nZXRUaW1lKCkpO1xyXG4gICAgICAgIGNhc2UgT2JqZWN0OlxyXG4gICAgICAgICAgICBpZiAodGFyZ2V0ID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICAgIHRhcmdldCA9IHt9O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgQXJyYXk6XHJcbiAgICAgICAgICAgIC8vIEFsd2F5cyBjb3B5IHRoZSBhcnJheSBzb3VyY2UgYW5kIG92ZXJ3cml0ZSB0aGUgdGFyZ2V0LlxyXG4gICAgICAgICAgICB0YXJnZXQgPSBbXTtcclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgLy8gTm90IGEgcGxhaW4gT2JqZWN0IC0gdHJlYXQgaXQgYXMgYSBzY2FsYXIuXHJcbiAgICAgICAgICAgIHJldHVybiBzb3VyY2U7XHJcbiAgICB9XHJcbiAgICBmb3IgKGNvbnN0IHByb3AgaW4gc291cmNlKSB7XHJcbiAgICAgICAgLy8gdXNlIGlzVmFsaWRLZXkgdG8gZ3VhcmQgYWdhaW5zdCBwcm90b3R5cGUgcG9sbHV0aW9uLiBTZWUgaHR0cHM6Ly9zbnlrLmlvL3Z1bG4vU05ZSy1KUy1MT0RBU0gtNDUwMjAyXHJcbiAgICAgICAgaWYgKCFzb3VyY2UuaGFzT3duUHJvcGVydHkocHJvcCkgfHwgIWlzVmFsaWRLZXkocHJvcCkpIHtcclxuICAgICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRhcmdldFtwcm9wXSA9IGRlZXBFeHRlbmQodGFyZ2V0W3Byb3BdLCBzb3VyY2VbcHJvcF0pO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHRhcmdldDtcclxufVxyXG5mdW5jdGlvbiBpc1ZhbGlkS2V5KGtleSkge1xyXG4gICAgcmV0dXJuIGtleSAhPT0gJ19fcHJvdG9fXyc7XHJcbn1cblxuLyoqXHJcbiAqIEBsaWNlbnNlXHJcbiAqIENvcHlyaWdodCAyMDIyIEdvb2dsZSBMTENcclxuICpcclxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcclxuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxyXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcclxuICpcclxuICogICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcclxuICpcclxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxyXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXHJcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxyXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXHJcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxyXG4gKi9cclxuLyoqXHJcbiAqIFBvbHlmaWxsIGZvciBgZ2xvYmFsVGhpc2Agb2JqZWN0LlxyXG4gKiBAcmV0dXJucyB0aGUgYGdsb2JhbFRoaXNgIG9iamVjdCBmb3IgdGhlIGdpdmVuIGVudmlyb25tZW50LlxyXG4gKiBAcHVibGljXHJcbiAqL1xyXG5mdW5jdGlvbiBnZXRHbG9iYWwoKSB7XHJcbiAgICBpZiAodHlwZW9mIHNlbGYgIT09ICd1bmRlZmluZWQnKSB7XHJcbiAgICAgICAgcmV0dXJuIHNlbGY7XHJcbiAgICB9XHJcbiAgICBpZiAodHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcpIHtcclxuICAgICAgICByZXR1cm4gd2luZG93O1xyXG4gICAgfVxyXG4gICAgaWYgKHR5cGVvZiBnbG9iYWwgIT09ICd1bmRlZmluZWQnKSB7XHJcbiAgICAgICAgcmV0dXJuIGdsb2JhbDtcclxuICAgIH1cclxuICAgIHRocm93IG5ldyBFcnJvcignVW5hYmxlIHRvIGxvY2F0ZSBnbG9iYWwgb2JqZWN0LicpO1xyXG59XG5cbi8qKlxyXG4gKiBAbGljZW5zZVxyXG4gKiBDb3B5cmlnaHQgMjAyMiBHb29nbGUgTExDXHJcbiAqXHJcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XHJcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cclxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XHJcbiAqXHJcbiAqICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXHJcbiAqXHJcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcclxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxyXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cclxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxyXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cclxuICovXHJcbmNvbnN0IGdldERlZmF1bHRzRnJvbUdsb2JhbCA9ICgpID0+IGdldEdsb2JhbCgpLl9fRklSRUJBU0VfREVGQVVMVFNfXztcclxuLyoqXHJcbiAqIEF0dGVtcHQgdG8gcmVhZCBkZWZhdWx0cyBmcm9tIGEgSlNPTiBzdHJpbmcgcHJvdmlkZWQgdG9cclxuICogcHJvY2VzcyguKWVudiguKV9fRklSRUJBU0VfREVGQVVMVFNfXyBvciBhIEpTT04gZmlsZSB3aG9zZSBwYXRoIGlzIGluXHJcbiAqIHByb2Nlc3MoLillbnYoLilfX0ZJUkVCQVNFX0RFRkFVTFRTX1BBVEhfX1xyXG4gKiBUaGUgZG90cyBhcmUgaW4gcGFyZW5zIGJlY2F1c2UgY2VydGFpbiBjb21waWxlcnMgKFZpdGU/KSBjYW5ub3RcclxuICogaGFuZGxlIHNlZWluZyB0aGF0IHZhcmlhYmxlIGluIGNvbW1lbnRzLlxyXG4gKiBTZWUgaHR0cHM6Ly9naXRodWIuY29tL2ZpcmViYXNlL2ZpcmViYXNlLWpzLXNkay9pc3N1ZXMvNjgzOFxyXG4gKi9cclxuY29uc3QgZ2V0RGVmYXVsdHNGcm9tRW52VmFyaWFibGUgPSAoKSA9PiB7XHJcbiAgICBpZiAodHlwZW9mIHByb2Nlc3MgPT09ICd1bmRlZmluZWQnIHx8IHR5cGVvZiBwcm9jZXNzLmVudiA9PT0gJ3VuZGVmaW5lZCcpIHtcclxuICAgICAgICByZXR1cm47XHJcbiAgICB9XHJcbiAgICBjb25zdCBkZWZhdWx0c0pzb25TdHJpbmcgPSBwcm9jZXNzLmVudi5fX0ZJUkVCQVNFX0RFRkFVTFRTX187XHJcbiAgICBpZiAoZGVmYXVsdHNKc29uU3RyaW5nKSB7XHJcbiAgICAgICAgcmV0dXJuIEpTT04ucGFyc2UoZGVmYXVsdHNKc29uU3RyaW5nKTtcclxuICAgIH1cclxufTtcclxuY29uc3QgZ2V0RGVmYXVsdHNGcm9tQ29va2llID0gKCkgPT4ge1xyXG4gICAgaWYgKHR5cGVvZiBkb2N1bWVudCA9PT0gJ3VuZGVmaW5lZCcpIHtcclxuICAgICAgICByZXR1cm47XHJcbiAgICB9XHJcbiAgICBsZXQgbWF0Y2g7XHJcbiAgICB0cnkge1xyXG4gICAgICAgIG1hdGNoID0gZG9jdW1lbnQuY29va2llLm1hdGNoKC9fX0ZJUkVCQVNFX0RFRkFVTFRTX189KFteO10rKS8pO1xyXG4gICAgfVxyXG4gICAgY2F0Y2ggKGUpIHtcclxuICAgICAgICAvLyBTb21lIGVudmlyb25tZW50cyBzdWNoIGFzIEFuZ3VsYXIgVW5pdmVyc2FsIFNTUiBoYXZlIGFcclxuICAgICAgICAvLyBgZG9jdW1lbnRgIG9iamVjdCBidXQgZXJyb3Igb24gYWNjZXNzaW5nIGBkb2N1bWVudC5jb29raWVgLlxyXG4gICAgICAgIHJldHVybjtcclxuICAgIH1cclxuICAgIGNvbnN0IGRlY29kZWQgPSBtYXRjaCAmJiBiYXNlNjREZWNvZGUobWF0Y2hbMV0pO1xyXG4gICAgcmV0dXJuIGRlY29kZWQgJiYgSlNPTi5wYXJzZShkZWNvZGVkKTtcclxufTtcclxuLyoqXHJcbiAqIEdldCB0aGUgX19GSVJFQkFTRV9ERUZBVUxUU19fIG9iamVjdC4gSXQgY2hlY2tzIGluIG9yZGVyOlxyXG4gKiAoMSkgaWYgc3VjaCBhbiBvYmplY3QgZXhpc3RzIGFzIGEgcHJvcGVydHkgb2YgYGdsb2JhbFRoaXNgXHJcbiAqICgyKSBpZiBzdWNoIGFuIG9iamVjdCB3YXMgcHJvdmlkZWQgb24gYSBzaGVsbCBlbnZpcm9ubWVudCB2YXJpYWJsZVxyXG4gKiAoMykgaWYgc3VjaCBhbiBvYmplY3QgZXhpc3RzIGluIGEgY29va2llXHJcbiAqIEBwdWJsaWNcclxuICovXHJcbmNvbnN0IGdldERlZmF1bHRzID0gKCkgPT4ge1xyXG4gICAgdHJ5IHtcclxuICAgICAgICByZXR1cm4gKGdldERlZmF1bHRzRnJvbUdsb2JhbCgpIHx8XHJcbiAgICAgICAgICAgIGdldERlZmF1bHRzRnJvbUVudlZhcmlhYmxlKCkgfHxcclxuICAgICAgICAgICAgZ2V0RGVmYXVsdHNGcm9tQ29va2llKCkpO1xyXG4gICAgfVxyXG4gICAgY2F0Y2ggKGUpIHtcclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBDYXRjaC1hbGwgZm9yIGJlaW5nIHVuYWJsZSB0byBnZXQgX19GSVJFQkFTRV9ERUZBVUxUU19fIGR1ZVxyXG4gICAgICAgICAqIHRvIGFueSBlbnZpcm9ubWVudCBjYXNlIHdlIGhhdmUgbm90IGFjY291bnRlZCBmb3IuIExvZyB0b1xyXG4gICAgICAgICAqIGluZm8gaW5zdGVhZCBvZiBzd2FsbG93aW5nIHNvIHdlIGNhbiBmaW5kIHRoZXNlIHVua25vd24gY2FzZXNcclxuICAgICAgICAgKiBhbmQgYWRkIHBhdGhzIGZvciB0aGVtIGlmIG5lZWRlZC5cclxuICAgICAgICAgKi9cclxuICAgICAgICBjb25zb2xlLmluZm8oYFVuYWJsZSB0byBnZXQgX19GSVJFQkFTRV9ERUZBVUxUU19fIGR1ZSB0bzogJHtlfWApO1xyXG4gICAgICAgIHJldHVybjtcclxuICAgIH1cclxufTtcclxuLyoqXHJcbiAqIFJldHVybnMgZW11bGF0b3IgaG9zdCBzdG9yZWQgaW4gdGhlIF9fRklSRUJBU0VfREVGQVVMVFNfXyBvYmplY3RcclxuICogZm9yIHRoZSBnaXZlbiBwcm9kdWN0LlxyXG4gKiBAcmV0dXJucyBhIFVSTCBob3N0IGZvcm1hdHRlZCBsaWtlIGAxMjcuMC4wLjE6OTk5OWAgb3IgYFs6OjFdOjQwMDBgIGlmIGF2YWlsYWJsZVxyXG4gKiBAcHVibGljXHJcbiAqL1xyXG5jb25zdCBnZXREZWZhdWx0RW11bGF0b3JIb3N0ID0gKHByb2R1Y3ROYW1lKSA9PiB7IHZhciBfYSwgX2I7IHJldHVybiAoX2IgPSAoX2EgPSBnZXREZWZhdWx0cygpKSA9PT0gbnVsbCB8fCBfYSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2EuZW11bGF0b3JIb3N0cykgPT09IG51bGwgfHwgX2IgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9iW3Byb2R1Y3ROYW1lXTsgfTtcclxuLyoqXHJcbiAqIFJldHVybnMgZW11bGF0b3IgaG9zdG5hbWUgYW5kIHBvcnQgc3RvcmVkIGluIHRoZSBfX0ZJUkVCQVNFX0RFRkFVTFRTX18gb2JqZWN0XHJcbiAqIGZvciB0aGUgZ2l2ZW4gcHJvZHVjdC5cclxuICogQHJldHVybnMgYSBwYWlyIG9mIGhvc3RuYW1lIGFuZCBwb3J0IGxpa2UgYFtcIjo6MVwiLCA0MDAwXWAgaWYgYXZhaWxhYmxlXHJcbiAqIEBwdWJsaWNcclxuICovXHJcbmNvbnN0IGdldERlZmF1bHRFbXVsYXRvckhvc3RuYW1lQW5kUG9ydCA9IChwcm9kdWN0TmFtZSkgPT4ge1xyXG4gICAgY29uc3QgaG9zdCA9IGdldERlZmF1bHRFbXVsYXRvckhvc3QocHJvZHVjdE5hbWUpO1xyXG4gICAgaWYgKCFob3N0KSB7XHJcbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcclxuICAgIH1cclxuICAgIGNvbnN0IHNlcGFyYXRvckluZGV4ID0gaG9zdC5sYXN0SW5kZXhPZignOicpOyAvLyBGaW5kaW5nIHRoZSBsYXN0IHNpbmNlIElQdjYgYWRkciBhbHNvIGhhcyBjb2xvbnMuXHJcbiAgICBpZiAoc2VwYXJhdG9ySW5kZXggPD0gMCB8fCBzZXBhcmF0b3JJbmRleCArIDEgPT09IGhvc3QubGVuZ3RoKSB7XHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBJbnZhbGlkIGhvc3QgJHtob3N0fSB3aXRoIG5vIHNlcGFyYXRlIGhvc3RuYW1lIGFuZCBwb3J0IWApO1xyXG4gICAgfVxyXG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXJlc3RyaWN0ZWQtZ2xvYmFsc1xyXG4gICAgY29uc3QgcG9ydCA9IHBhcnNlSW50KGhvc3Quc3Vic3RyaW5nKHNlcGFyYXRvckluZGV4ICsgMSksIDEwKTtcclxuICAgIGlmIChob3N0WzBdID09PSAnWycpIHtcclxuICAgICAgICAvLyBCcmFja2V0LXF1b3RlZCBgW2lwdjZhZGRyXTpwb3J0YCA9PiByZXR1cm4gXCJpcHY2YWRkclwiICh3aXRob3V0IGJyYWNrZXRzKS5cclxuICAgICAgICByZXR1cm4gW2hvc3Quc3Vic3RyaW5nKDEsIHNlcGFyYXRvckluZGV4IC0gMSksIHBvcnRdO1xyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgICAgcmV0dXJuIFtob3N0LnN1YnN0cmluZygwLCBzZXBhcmF0b3JJbmRleCksIHBvcnRdO1xyXG4gICAgfVxyXG59O1xyXG4vKipcclxuICogUmV0dXJucyBGaXJlYmFzZSBhcHAgY29uZmlnIHN0b3JlZCBpbiB0aGUgX19GSVJFQkFTRV9ERUZBVUxUU19fIG9iamVjdC5cclxuICogQHB1YmxpY1xyXG4gKi9cclxuY29uc3QgZ2V0RGVmYXVsdEFwcENvbmZpZyA9ICgpID0+IHsgdmFyIF9hOyByZXR1cm4gKF9hID0gZ2V0RGVmYXVsdHMoKSkgPT09IG51bGwgfHwgX2EgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9hLmNvbmZpZzsgfTtcclxuLyoqXHJcbiAqIFJldHVybnMgYW4gZXhwZXJpbWVudGFsIHNldHRpbmcgb24gdGhlIF9fRklSRUJBU0VfREVGQVVMVFNfXyBvYmplY3QgKHByb3BlcnRpZXNcclxuICogcHJlZml4ZWQgYnkgXCJfXCIpXHJcbiAqIEBwdWJsaWNcclxuICovXHJcbmNvbnN0IGdldEV4cGVyaW1lbnRhbFNldHRpbmcgPSAobmFtZSkgPT4geyB2YXIgX2E7IHJldHVybiAoX2EgPSBnZXREZWZhdWx0cygpKSA9PT0gbnVsbCB8fCBfYSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2FbYF8ke25hbWV9YF07IH07XG5cbi8qKlxyXG4gKiBAbGljZW5zZVxyXG4gKiBDb3B5cmlnaHQgMjAxNyBHb29nbGUgTExDXHJcbiAqXHJcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XHJcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cclxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XHJcbiAqXHJcbiAqICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXHJcbiAqXHJcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcclxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxyXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cclxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxyXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cclxuICovXHJcbmNsYXNzIERlZmVycmVkIHtcclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIHRoaXMucmVqZWN0ID0gKCkgPT4geyB9O1xyXG4gICAgICAgIHRoaXMucmVzb2x2ZSA9ICgpID0+IHsgfTtcclxuICAgICAgICB0aGlzLnByb21pc2UgPSBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMucmVzb2x2ZSA9IHJlc29sdmU7XHJcbiAgICAgICAgICAgIHRoaXMucmVqZWN0ID0gcmVqZWN0O1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiBPdXIgQVBJIGludGVybmFscyBhcmUgbm90IHByb21pc2VpZmllZCBhbmQgY2Fubm90IGJlY2F1c2Ugb3VyIGNhbGxiYWNrIEFQSXMgaGF2ZSBzdWJ0bGUgZXhwZWN0YXRpb25zIGFyb3VuZFxyXG4gICAgICogaW52b2tpbmcgcHJvbWlzZXMgaW5saW5lLCB3aGljaCBQcm9taXNlcyBhcmUgZm9yYmlkZGVuIHRvIGRvLiBUaGlzIG1ldGhvZCBhY2NlcHRzIGFuIG9wdGlvbmFsIG5vZGUtc3R5bGUgY2FsbGJhY2tcclxuICAgICAqIGFuZCByZXR1cm5zIGEgbm9kZS1zdHlsZSBjYWxsYmFjayB3aGljaCB3aWxsIHJlc29sdmUgb3IgcmVqZWN0IHRoZSBEZWZlcnJlZCdzIHByb21pc2UuXHJcbiAgICAgKi9cclxuICAgIHdyYXBDYWxsYmFjayhjYWxsYmFjaykge1xyXG4gICAgICAgIHJldHVybiAoZXJyb3IsIHZhbHVlKSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChlcnJvcikge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5yZWplY3QoZXJyb3IpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5yZXNvbHZlKHZhbHVlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAodHlwZW9mIGNhbGxiYWNrID09PSAnZnVuY3Rpb24nKSB7XHJcbiAgICAgICAgICAgICAgICAvLyBBdHRhY2hpbmcgbm9vcCBoYW5kbGVyIGp1c3QgaW4gY2FzZSBkZXZlbG9wZXIgd2Fzbid0IGV4cGVjdGluZ1xyXG4gICAgICAgICAgICAgICAgLy8gcHJvbWlzZXNcclxuICAgICAgICAgICAgICAgIHRoaXMucHJvbWlzZS5jYXRjaCgoKSA9PiB7IH0pO1xyXG4gICAgICAgICAgICAgICAgLy8gU29tZSBvZiBvdXIgY2FsbGJhY2tzIGRvbid0IGV4cGVjdCBhIHZhbHVlIGFuZCBvdXIgb3duIHRlc3RzXHJcbiAgICAgICAgICAgICAgICAvLyBhc3NlcnQgdGhhdCB0aGUgcGFyYW1ldGVyIGxlbmd0aCBpcyAxXHJcbiAgICAgICAgICAgICAgICBpZiAoY2FsbGJhY2subGVuZ3RoID09PSAxKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2soZXJyb3IpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2soZXJyb3IsIHZhbHVlKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcbiAgICB9XHJcbn1cblxuLyoqXHJcbiAqIEBsaWNlbnNlXHJcbiAqIENvcHlyaWdodCAyMDIxIEdvb2dsZSBMTENcclxuICpcclxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcclxuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxyXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcclxuICpcclxuICogICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcclxuICpcclxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxyXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXHJcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxyXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXHJcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxyXG4gKi9cclxuZnVuY3Rpb24gY3JlYXRlTW9ja1VzZXJUb2tlbih0b2tlbiwgcHJvamVjdElkKSB7XHJcbiAgICBpZiAodG9rZW4udWlkKSB7XHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdUaGUgXCJ1aWRcIiBmaWVsZCBpcyBubyBsb25nZXIgc3VwcG9ydGVkIGJ5IG1vY2tVc2VyVG9rZW4uIFBsZWFzZSB1c2UgXCJzdWJcIiBpbnN0ZWFkIGZvciBGaXJlYmFzZSBBdXRoIFVzZXIgSUQuJyk7XHJcbiAgICB9XHJcbiAgICAvLyBVbnNlY3VyZWQgSldUcyB1c2UgXCJub25lXCIgYXMgdGhlIGFsZ29yaXRobS5cclxuICAgIGNvbnN0IGhlYWRlciA9IHtcclxuICAgICAgICBhbGc6ICdub25lJyxcclxuICAgICAgICB0eXBlOiAnSldUJ1xyXG4gICAgfTtcclxuICAgIGNvbnN0IHByb2plY3QgPSBwcm9qZWN0SWQgfHwgJ2RlbW8tcHJvamVjdCc7XHJcbiAgICBjb25zdCBpYXQgPSB0b2tlbi5pYXQgfHwgMDtcclxuICAgIGNvbnN0IHN1YiA9IHRva2VuLnN1YiB8fCB0b2tlbi51c2VyX2lkO1xyXG4gICAgaWYgKCFzdWIpIHtcclxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJtb2NrVXNlclRva2VuIG11c3QgY29udGFpbiAnc3ViJyBvciAndXNlcl9pZCcgZmllbGQhXCIpO1xyXG4gICAgfVxyXG4gICAgY29uc3QgcGF5bG9hZCA9IE9iamVjdC5hc3NpZ24oeyBcclxuICAgICAgICAvLyBTZXQgYWxsIHJlcXVpcmVkIGZpZWxkcyB0byBkZWNlbnQgZGVmYXVsdHNcclxuICAgICAgICBpc3M6IGBodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vJHtwcm9qZWN0fWAsIGF1ZDogcHJvamVjdCwgaWF0LCBleHA6IGlhdCArIDM2MDAsIGF1dGhfdGltZTogaWF0LCBzdWIsIHVzZXJfaWQ6IHN1YiwgZmlyZWJhc2U6IHtcclxuICAgICAgICAgICAgc2lnbl9pbl9wcm92aWRlcjogJ2N1c3RvbScsXHJcbiAgICAgICAgICAgIGlkZW50aXRpZXM6IHt9XHJcbiAgICAgICAgfSB9LCB0b2tlbik7XHJcbiAgICAvLyBVbnNlY3VyZWQgSldUcyB1c2UgdGhlIGVtcHR5IHN0cmluZyBhcyBhIHNpZ25hdHVyZS5cclxuICAgIGNvbnN0IHNpZ25hdHVyZSA9ICcnO1xyXG4gICAgcmV0dXJuIFtcclxuICAgICAgICBiYXNlNjR1cmxFbmNvZGVXaXRob3V0UGFkZGluZyhKU09OLnN0cmluZ2lmeShoZWFkZXIpKSxcclxuICAgICAgICBiYXNlNjR1cmxFbmNvZGVXaXRob3V0UGFkZGluZyhKU09OLnN0cmluZ2lmeShwYXlsb2FkKSksXHJcbiAgICAgICAgc2lnbmF0dXJlXHJcbiAgICBdLmpvaW4oJy4nKTtcclxufVxuXG4vKipcclxuICogQGxpY2Vuc2VcclxuICogQ29weXJpZ2h0IDIwMTcgR29vZ2xlIExMQ1xyXG4gKlxyXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xyXG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXHJcbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxyXG4gKlxyXG4gKiAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxyXG4gKlxyXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXHJcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcclxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXHJcbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcclxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXHJcbiAqL1xyXG4vKipcclxuICogUmV0dXJucyBuYXZpZ2F0b3IudXNlckFnZW50IHN0cmluZyBvciAnJyBpZiBpdCdzIG5vdCBkZWZpbmVkLlxyXG4gKiBAcmV0dXJuIHVzZXIgYWdlbnQgc3RyaW5nXHJcbiAqL1xyXG5mdW5jdGlvbiBnZXRVQSgpIHtcclxuICAgIGlmICh0eXBlb2YgbmF2aWdhdG9yICE9PSAndW5kZWZpbmVkJyAmJlxyXG4gICAgICAgIHR5cGVvZiBuYXZpZ2F0b3JbJ3VzZXJBZ2VudCddID09PSAnc3RyaW5nJykge1xyXG4gICAgICAgIHJldHVybiBuYXZpZ2F0b3JbJ3VzZXJBZ2VudCddO1xyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgICAgcmV0dXJuICcnO1xyXG4gICAgfVxyXG59XHJcbi8qKlxyXG4gKiBEZXRlY3QgQ29yZG92YSAvIFBob25lR2FwIC8gSW9uaWMgZnJhbWV3b3JrcyBvbiBhIG1vYmlsZSBkZXZpY2UuXHJcbiAqXHJcbiAqIERlbGliZXJhdGVseSBkb2VzIG5vdCByZWx5IG9uIGNoZWNraW5nIGBmaWxlOi8vYCBVUkxzIChhcyB0aGlzIGZhaWxzIFBob25lR2FwXHJcbiAqIGluIHRoZSBSaXBwbGUgZW11bGF0b3IpIG5vciBDb3Jkb3ZhIGBvbkRldmljZVJlYWR5YCwgd2hpY2ggd291bGQgbm9ybWFsbHlcclxuICogd2FpdCBmb3IgYSBjYWxsYmFjay5cclxuICovXHJcbmZ1bmN0aW9uIGlzTW9iaWxlQ29yZG92YSgpIHtcclxuICAgIHJldHVybiAodHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcgJiZcclxuICAgICAgICAvLyBAdHMtaWdub3JlIFNldHRpbmcgdXAgYW4gYnJvYWRseSBhcHBsaWNhYmxlIGluZGV4IHNpZ25hdHVyZSBmb3IgV2luZG93XHJcbiAgICAgICAgLy8ganVzdCB0byBkZWFsIHdpdGggdGhpcyBjYXNlIHdvdWxkIHByb2JhYmx5IGJlIGEgYmFkIGlkZWEuXHJcbiAgICAgICAgISEod2luZG93Wydjb3Jkb3ZhJ10gfHwgd2luZG93WydwaG9uZWdhcCddIHx8IHdpbmRvd1snUGhvbmVHYXAnXSkgJiZcclxuICAgICAgICAvaW9zfGlwaG9uZXxpcG9kfGlwYWR8YW5kcm9pZHxibGFja2JlcnJ5fGllbW9iaWxlL2kudGVzdChnZXRVQSgpKSk7XHJcbn1cclxuLyoqXHJcbiAqIERldGVjdCBOb2RlLmpzLlxyXG4gKlxyXG4gKiBAcmV0dXJuIHRydWUgaWYgTm9kZS5qcyBlbnZpcm9ubWVudCBpcyBkZXRlY3RlZCBvciBzcGVjaWZpZWQuXHJcbiAqL1xyXG4vLyBOb2RlIGRldGVjdGlvbiBsb2dpYyBmcm9tOiBodHRwczovL2dpdGh1Yi5jb20vaWxpYWthbi9kZXRlY3Qtbm9kZS9cclxuZnVuY3Rpb24gaXNOb2RlKCkge1xyXG4gICAgdmFyIF9hO1xyXG4gICAgY29uc3QgZm9yY2VFbnZpcm9ubWVudCA9IChfYSA9IGdldERlZmF1bHRzKCkpID09PSBudWxsIHx8IF9hID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYS5mb3JjZUVudmlyb25tZW50O1xyXG4gICAgaWYgKGZvcmNlRW52aXJvbm1lbnQgPT09ICdub2RlJykge1xyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG4gICAgZWxzZSBpZiAoZm9yY2VFbnZpcm9ubWVudCA9PT0gJ2Jyb3dzZXInKSB7XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG4gICAgdHJ5IHtcclxuICAgICAgICByZXR1cm4gKE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChnbG9iYWwucHJvY2VzcykgPT09ICdbb2JqZWN0IHByb2Nlc3NdJyk7XHJcbiAgICB9XHJcbiAgICBjYXRjaCAoZSkge1xyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxufVxyXG4vKipcclxuICogRGV0ZWN0IEJyb3dzZXIgRW52aXJvbm1lbnRcclxuICovXHJcbmZ1bmN0aW9uIGlzQnJvd3NlcigpIHtcclxuICAgIHJldHVybiB0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJyB8fCBpc1dlYldvcmtlcigpO1xyXG59XHJcbi8qKlxyXG4gKiBEZXRlY3QgV2ViIFdvcmtlciBjb250ZXh0XHJcbiAqL1xyXG5mdW5jdGlvbiBpc1dlYldvcmtlcigpIHtcclxuICAgIHJldHVybiAodHlwZW9mIFdvcmtlckdsb2JhbFNjb3BlICE9PSAndW5kZWZpbmVkJyAmJlxyXG4gICAgICAgIHR5cGVvZiBzZWxmICE9PSAndW5kZWZpbmVkJyAmJlxyXG4gICAgICAgIHNlbGYgaW5zdGFuY2VvZiBXb3JrZXJHbG9iYWxTY29wZSk7XHJcbn1cclxuZnVuY3Rpb24gaXNCcm93c2VyRXh0ZW5zaW9uKCkge1xyXG4gICAgY29uc3QgcnVudGltZSA9IHR5cGVvZiBjaHJvbWUgPT09ICdvYmplY3QnXHJcbiAgICAgICAgPyBjaHJvbWUucnVudGltZVxyXG4gICAgICAgIDogdHlwZW9mIGJyb3dzZXIgPT09ICdvYmplY3QnXHJcbiAgICAgICAgICAgID8gYnJvd3Nlci5ydW50aW1lXHJcbiAgICAgICAgICAgIDogdW5kZWZpbmVkO1xyXG4gICAgcmV0dXJuIHR5cGVvZiBydW50aW1lID09PSAnb2JqZWN0JyAmJiBydW50aW1lLmlkICE9PSB1bmRlZmluZWQ7XHJcbn1cclxuLyoqXHJcbiAqIERldGVjdCBSZWFjdCBOYXRpdmUuXHJcbiAqXHJcbiAqIEByZXR1cm4gdHJ1ZSBpZiBSZWFjdE5hdGl2ZSBlbnZpcm9ubWVudCBpcyBkZXRlY3RlZC5cclxuICovXHJcbmZ1bmN0aW9uIGlzUmVhY3ROYXRpdmUoKSB7XHJcbiAgICByZXR1cm4gKHR5cGVvZiBuYXZpZ2F0b3IgPT09ICdvYmplY3QnICYmIG5hdmlnYXRvclsncHJvZHVjdCddID09PSAnUmVhY3ROYXRpdmUnKTtcclxufVxyXG4vKiogRGV0ZWN0cyBFbGVjdHJvbiBhcHBzLiAqL1xyXG5mdW5jdGlvbiBpc0VsZWN0cm9uKCkge1xyXG4gICAgcmV0dXJuIGdldFVBKCkuaW5kZXhPZignRWxlY3Ryb24vJykgPj0gMDtcclxufVxyXG4vKiogRGV0ZWN0cyBJbnRlcm5ldCBFeHBsb3Jlci4gKi9cclxuZnVuY3Rpb24gaXNJRSgpIHtcclxuICAgIGNvbnN0IHVhID0gZ2V0VUEoKTtcclxuICAgIHJldHVybiB1YS5pbmRleE9mKCdNU0lFICcpID49IDAgfHwgdWEuaW5kZXhPZignVHJpZGVudC8nKSA+PSAwO1xyXG59XHJcbi8qKiBEZXRlY3RzIFVuaXZlcnNhbCBXaW5kb3dzIFBsYXRmb3JtIGFwcHMuICovXHJcbmZ1bmN0aW9uIGlzVVdQKCkge1xyXG4gICAgcmV0dXJuIGdldFVBKCkuaW5kZXhPZignTVNBcHBIb3N0LycpID49IDA7XHJcbn1cclxuLyoqXHJcbiAqIERldGVjdCB3aGV0aGVyIHRoZSBjdXJyZW50IFNESyBidWlsZCBpcyB0aGUgTm9kZSB2ZXJzaW9uLlxyXG4gKlxyXG4gKiBAcmV0dXJuIHRydWUgaWYgaXQncyB0aGUgTm9kZSBTREsgYnVpbGQuXHJcbiAqL1xyXG5mdW5jdGlvbiBpc05vZGVTZGsoKSB7XHJcbiAgICByZXR1cm4gQ09OU1RBTlRTLk5PREVfQ0xJRU5UID09PSB0cnVlIHx8IENPTlNUQU5UUy5OT0RFX0FETUlOID09PSB0cnVlO1xyXG59XHJcbi8qKiBSZXR1cm5zIHRydWUgaWYgd2UgYXJlIHJ1bm5pbmcgaW4gU2FmYXJpLiAqL1xyXG5mdW5jdGlvbiBpc1NhZmFyaSgpIHtcclxuICAgIHJldHVybiAoIWlzTm9kZSgpICYmXHJcbiAgICAgICAgISFuYXZpZ2F0b3IudXNlckFnZW50ICYmXHJcbiAgICAgICAgbmF2aWdhdG9yLnVzZXJBZ2VudC5pbmNsdWRlcygnU2FmYXJpJykgJiZcclxuICAgICAgICAhbmF2aWdhdG9yLnVzZXJBZ2VudC5pbmNsdWRlcygnQ2hyb21lJykpO1xyXG59XHJcbi8qKlxyXG4gKiBUaGlzIG1ldGhvZCBjaGVja3MgaWYgaW5kZXhlZERCIGlzIHN1cHBvcnRlZCBieSBjdXJyZW50IGJyb3dzZXIvc2VydmljZSB3b3JrZXIgY29udGV4dFxyXG4gKiBAcmV0dXJuIHRydWUgaWYgaW5kZXhlZERCIGlzIHN1cHBvcnRlZCBieSBjdXJyZW50IGJyb3dzZXIvc2VydmljZSB3b3JrZXIgY29udGV4dFxyXG4gKi9cclxuZnVuY3Rpb24gaXNJbmRleGVkREJBdmFpbGFibGUoKSB7XHJcbiAgICB0cnkge1xyXG4gICAgICAgIHJldHVybiB0eXBlb2YgaW5kZXhlZERCID09PSAnb2JqZWN0JztcclxuICAgIH1cclxuICAgIGNhdGNoIChlKSB7XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG59XHJcbi8qKlxyXG4gKiBUaGlzIG1ldGhvZCB2YWxpZGF0ZXMgYnJvd3Nlci9zdyBjb250ZXh0IGZvciBpbmRleGVkREIgYnkgb3BlbmluZyBhIGR1bW15IGluZGV4ZWREQiBkYXRhYmFzZSBhbmQgcmVqZWN0XHJcbiAqIGlmIGVycm9ycyBvY2N1ciBkdXJpbmcgdGhlIGRhdGFiYXNlIG9wZW4gb3BlcmF0aW9uLlxyXG4gKlxyXG4gKiBAdGhyb3dzIGV4Y2VwdGlvbiBpZiBjdXJyZW50IGJyb3dzZXIvc3cgY29udGV4dCBjYW4ndCBydW4gaWRiLm9wZW4gKGV4OiBTYWZhcmkgaWZyYW1lLCBGaXJlZm94XHJcbiAqIHByaXZhdGUgYnJvd3NpbmcpXHJcbiAqL1xyXG5mdW5jdGlvbiB2YWxpZGF0ZUluZGV4ZWREQk9wZW5hYmxlKCkge1xyXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICBsZXQgcHJlRXhpc3QgPSB0cnVlO1xyXG4gICAgICAgICAgICBjb25zdCBEQl9DSEVDS19OQU1FID0gJ3ZhbGlkYXRlLWJyb3dzZXItY29udGV4dC1mb3ItaW5kZXhlZGRiLWFuYWx5dGljcy1tb2R1bGUnO1xyXG4gICAgICAgICAgICBjb25zdCByZXF1ZXN0ID0gc2VsZi5pbmRleGVkREIub3BlbihEQl9DSEVDS19OQU1FKTtcclxuICAgICAgICAgICAgcmVxdWVzdC5vbnN1Y2Nlc3MgPSAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICByZXF1ZXN0LnJlc3VsdC5jbG9zZSgpO1xyXG4gICAgICAgICAgICAgICAgLy8gZGVsZXRlIGRhdGFiYXNlIG9ubHkgd2hlbiBpdCBkb2Vzbid0IHByZS1leGlzdFxyXG4gICAgICAgICAgICAgICAgaWYgKCFwcmVFeGlzdCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHNlbGYuaW5kZXhlZERCLmRlbGV0ZURhdGFiYXNlKERCX0NIRUNLX05BTUUpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgcmVzb2x2ZSh0cnVlKTtcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgcmVxdWVzdC5vbnVwZ3JhZGVuZWVkZWQgPSAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBwcmVFeGlzdCA9IGZhbHNlO1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICByZXF1ZXN0Lm9uZXJyb3IgPSAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICB2YXIgX2E7XHJcbiAgICAgICAgICAgICAgICByZWplY3QoKChfYSA9IHJlcXVlc3QuZXJyb3IpID09PSBudWxsIHx8IF9hID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYS5tZXNzYWdlKSB8fCAnJyk7XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgICAgICByZWplY3QoZXJyb3IpO1xyXG4gICAgICAgIH1cclxuICAgIH0pO1xyXG59XHJcbi8qKlxyXG4gKlxyXG4gKiBUaGlzIG1ldGhvZCBjaGVja3Mgd2hldGhlciBjb29raWUgaXMgZW5hYmxlZCB3aXRoaW4gY3VycmVudCBicm93c2VyXHJcbiAqIEByZXR1cm4gdHJ1ZSBpZiBjb29raWUgaXMgZW5hYmxlZCB3aXRoaW4gY3VycmVudCBicm93c2VyXHJcbiAqL1xyXG5mdW5jdGlvbiBhcmVDb29raWVzRW5hYmxlZCgpIHtcclxuICAgIGlmICh0eXBlb2YgbmF2aWdhdG9yID09PSAndW5kZWZpbmVkJyB8fCAhbmF2aWdhdG9yLmNvb2tpZUVuYWJsZWQpIHtcclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gdHJ1ZTtcclxufVxuXG4vKipcclxuICogQGxpY2Vuc2VcclxuICogQ29weXJpZ2h0IDIwMTcgR29vZ2xlIExMQ1xyXG4gKlxyXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xyXG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXHJcbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxyXG4gKlxyXG4gKiAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxyXG4gKlxyXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXHJcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcclxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXHJcbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcclxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXHJcbiAqL1xyXG4vKipcclxuICogQGZpbGVvdmVydmlldyBTdGFuZGFyZGl6ZWQgRmlyZWJhc2UgRXJyb3IuXHJcbiAqXHJcbiAqIFVzYWdlOlxyXG4gKlxyXG4gKiAgIC8vIFR5cGVzY3JpcHQgc3RyaW5nIGxpdGVyYWxzIGZvciB0eXBlLXNhZmUgY29kZXNcclxuICogICB0eXBlIEVyciA9XHJcbiAqICAgICAndW5rbm93bicgfFxyXG4gKiAgICAgJ29iamVjdC1ub3QtZm91bmQnXHJcbiAqICAgICA7XHJcbiAqXHJcbiAqICAgLy8gQ2xvc3VyZSBlbnVtIGZvciB0eXBlLXNhZmUgZXJyb3IgY29kZXNcclxuICogICAvLyBhdC1lbnVtIHtzdHJpbmd9XHJcbiAqICAgdmFyIEVyciA9IHtcclxuICogICAgIFVOS05PV046ICd1bmtub3duJyxcclxuICogICAgIE9CSkVDVF9OT1RfRk9VTkQ6ICdvYmplY3Qtbm90LWZvdW5kJyxcclxuICogICB9XHJcbiAqXHJcbiAqICAgbGV0IGVycm9yczogTWFwPEVyciwgc3RyaW5nPiA9IHtcclxuICogICAgICdnZW5lcmljLWVycm9yJzogXCJVbmtub3duIGVycm9yXCIsXHJcbiAqICAgICAnZmlsZS1ub3QtZm91bmQnOiBcIkNvdWxkIG5vdCBmaW5kIGZpbGU6IHskZmlsZX1cIixcclxuICogICB9O1xyXG4gKlxyXG4gKiAgIC8vIFR5cGUtc2FmZSBmdW5jdGlvbiAtIG11c3QgcGFzcyBhIHZhbGlkIGVycm9yIGNvZGUgYXMgcGFyYW0uXHJcbiAqICAgbGV0IGVycm9yID0gbmV3IEVycm9yRmFjdG9yeTxFcnI+KCdzZXJ2aWNlJywgJ1NlcnZpY2UnLCBlcnJvcnMpO1xyXG4gKlxyXG4gKiAgIC4uLlxyXG4gKiAgIHRocm93IGVycm9yLmNyZWF0ZShFcnIuR0VORVJJQyk7XHJcbiAqICAgLi4uXHJcbiAqICAgdGhyb3cgZXJyb3IuY3JlYXRlKEVyci5GSUxFX05PVF9GT1VORCwgeydmaWxlJzogZmlsZU5hbWV9KTtcclxuICogICAuLi5cclxuICogICAvLyBTZXJ2aWNlOiBDb3VsZCBub3QgZmlsZSBmaWxlOiBmb28udHh0IChzZXJ2aWNlL2ZpbGUtbm90LWZvdW5kKS5cclxuICpcclxuICogICBjYXRjaCAoZSkge1xyXG4gKiAgICAgYXNzZXJ0KGUubWVzc2FnZSA9PT0gXCJDb3VsZCBub3QgZmluZCBmaWxlOiBmb28udHh0LlwiKTtcclxuICogICAgIGlmICgoZSBhcyBGaXJlYmFzZUVycm9yKT8uY29kZSA9PT0gJ3NlcnZpY2UvZmlsZS1ub3QtZm91bmQnKSB7XHJcbiAqICAgICAgIGNvbnNvbGUubG9nKFwiQ291bGQgbm90IHJlYWQgZmlsZTogXCIgKyBlWydmaWxlJ10pO1xyXG4gKiAgICAgfVxyXG4gKiAgIH1cclxuICovXHJcbmNvbnN0IEVSUk9SX05BTUUgPSAnRmlyZWJhc2VFcnJvcic7XHJcbi8vIEJhc2VkIG9uIGNvZGUgZnJvbTpcclxuLy8gaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvSmF2YVNjcmlwdC9SZWZlcmVuY2UvR2xvYmFsX09iamVjdHMvRXJyb3IjQ3VzdG9tX0Vycm9yX1R5cGVzXHJcbmNsYXNzIEZpcmViYXNlRXJyb3IgZXh0ZW5kcyBFcnJvciB7XHJcbiAgICBjb25zdHJ1Y3RvcihcclxuICAgIC8qKiBUaGUgZXJyb3IgY29kZSBmb3IgdGhpcyBlcnJvci4gKi9cclxuICAgIGNvZGUsIG1lc3NhZ2UsIFxyXG4gICAgLyoqIEN1c3RvbSBkYXRhIGZvciB0aGlzIGVycm9yLiAqL1xyXG4gICAgY3VzdG9tRGF0YSkge1xyXG4gICAgICAgIHN1cGVyKG1lc3NhZ2UpO1xyXG4gICAgICAgIHRoaXMuY29kZSA9IGNvZGU7XHJcbiAgICAgICAgdGhpcy5jdXN0b21EYXRhID0gY3VzdG9tRGF0YTtcclxuICAgICAgICAvKiogVGhlIGN1c3RvbSBuYW1lIGZvciBhbGwgRmlyZWJhc2VFcnJvcnMuICovXHJcbiAgICAgICAgdGhpcy5uYW1lID0gRVJST1JfTkFNRTtcclxuICAgICAgICAvLyBGaXggRm9yIEVTNVxyXG4gICAgICAgIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9NaWNyb3NvZnQvVHlwZVNjcmlwdC13aWtpL2Jsb2IvbWFzdGVyL0JyZWFraW5nLUNoYW5nZXMubWQjZXh0ZW5kaW5nLWJ1aWx0LWlucy1saWtlLWVycm9yLWFycmF5LWFuZC1tYXAtbWF5LW5vLWxvbmdlci13b3JrXHJcbiAgICAgICAgT2JqZWN0LnNldFByb3RvdHlwZU9mKHRoaXMsIEZpcmViYXNlRXJyb3IucHJvdG90eXBlKTtcclxuICAgICAgICAvLyBNYWludGFpbnMgcHJvcGVyIHN0YWNrIHRyYWNlIGZvciB3aGVyZSBvdXIgZXJyb3Igd2FzIHRocm93bi5cclxuICAgICAgICAvLyBPbmx5IGF2YWlsYWJsZSBvbiBWOC5cclxuICAgICAgICBpZiAoRXJyb3IuY2FwdHVyZVN0YWNrVHJhY2UpIHtcclxuICAgICAgICAgICAgRXJyb3IuY2FwdHVyZVN0YWNrVHJhY2UodGhpcywgRXJyb3JGYWN0b3J5LnByb3RvdHlwZS5jcmVhdGUpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5jbGFzcyBFcnJvckZhY3Rvcnkge1xyXG4gICAgY29uc3RydWN0b3Ioc2VydmljZSwgc2VydmljZU5hbWUsIGVycm9ycykge1xyXG4gICAgICAgIHRoaXMuc2VydmljZSA9IHNlcnZpY2U7XHJcbiAgICAgICAgdGhpcy5zZXJ2aWNlTmFtZSA9IHNlcnZpY2VOYW1lO1xyXG4gICAgICAgIHRoaXMuZXJyb3JzID0gZXJyb3JzO1xyXG4gICAgfVxyXG4gICAgY3JlYXRlKGNvZGUsIC4uLmRhdGEpIHtcclxuICAgICAgICBjb25zdCBjdXN0b21EYXRhID0gZGF0YVswXSB8fCB7fTtcclxuICAgICAgICBjb25zdCBmdWxsQ29kZSA9IGAke3RoaXMuc2VydmljZX0vJHtjb2RlfWA7XHJcbiAgICAgICAgY29uc3QgdGVtcGxhdGUgPSB0aGlzLmVycm9yc1tjb2RlXTtcclxuICAgICAgICBjb25zdCBtZXNzYWdlID0gdGVtcGxhdGUgPyByZXBsYWNlVGVtcGxhdGUodGVtcGxhdGUsIGN1c3RvbURhdGEpIDogJ0Vycm9yJztcclxuICAgICAgICAvLyBTZXJ2aWNlIE5hbWU6IEVycm9yIG1lc3NhZ2UgKHNlcnZpY2UvY29kZSkuXHJcbiAgICAgICAgY29uc3QgZnVsbE1lc3NhZ2UgPSBgJHt0aGlzLnNlcnZpY2VOYW1lfTogJHttZXNzYWdlfSAoJHtmdWxsQ29kZX0pLmA7XHJcbiAgICAgICAgY29uc3QgZXJyb3IgPSBuZXcgRmlyZWJhc2VFcnJvcihmdWxsQ29kZSwgZnVsbE1lc3NhZ2UsIGN1c3RvbURhdGEpO1xyXG4gICAgICAgIHJldHVybiBlcnJvcjtcclxuICAgIH1cclxufVxyXG5mdW5jdGlvbiByZXBsYWNlVGVtcGxhdGUodGVtcGxhdGUsIGRhdGEpIHtcclxuICAgIHJldHVybiB0ZW1wbGF0ZS5yZXBsYWNlKFBBVFRFUk4sIChfLCBrZXkpID0+IHtcclxuICAgICAgICBjb25zdCB2YWx1ZSA9IGRhdGFba2V5XTtcclxuICAgICAgICByZXR1cm4gdmFsdWUgIT0gbnVsbCA/IFN0cmluZyh2YWx1ZSkgOiBgPCR7a2V5fT8+YDtcclxuICAgIH0pO1xyXG59XHJcbmNvbnN0IFBBVFRFUk4gPSAvXFx7XFwkKFtefV0rKX0vZztcblxuLyoqXHJcbiAqIEBsaWNlbnNlXHJcbiAqIENvcHlyaWdodCAyMDE3IEdvb2dsZSBMTENcclxuICpcclxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcclxuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxyXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcclxuICpcclxuICogICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcclxuICpcclxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxyXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXHJcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxyXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXHJcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxyXG4gKi9cclxuLyoqXHJcbiAqIEV2YWx1YXRlcyBhIEpTT04gc3RyaW5nIGludG8gYSBqYXZhc2NyaXB0IG9iamVjdC5cclxuICpcclxuICogQHBhcmFtIHtzdHJpbmd9IHN0ciBBIHN0cmluZyBjb250YWluaW5nIEpTT04uXHJcbiAqIEByZXR1cm4geyp9IFRoZSBqYXZhc2NyaXB0IG9iamVjdCByZXByZXNlbnRpbmcgdGhlIHNwZWNpZmllZCBKU09OLlxyXG4gKi9cclxuZnVuY3Rpb24ganNvbkV2YWwoc3RyKSB7XHJcbiAgICByZXR1cm4gSlNPTi5wYXJzZShzdHIpO1xyXG59XHJcbi8qKlxyXG4gKiBSZXR1cm5zIEpTT04gcmVwcmVzZW50aW5nIGEgamF2YXNjcmlwdCBvYmplY3QuXHJcbiAqIEBwYXJhbSB7Kn0gZGF0YSBKYXZhc2NyaXB0IG9iamVjdCB0byBiZSBzdHJpbmdpZmllZC5cclxuICogQHJldHVybiB7c3RyaW5nfSBUaGUgSlNPTiBjb250ZW50cyBvZiB0aGUgb2JqZWN0LlxyXG4gKi9cclxuZnVuY3Rpb24gc3RyaW5naWZ5KGRhdGEpIHtcclxuICAgIHJldHVybiBKU09OLnN0cmluZ2lmeShkYXRhKTtcclxufVxuXG4vKipcclxuICogQGxpY2Vuc2VcclxuICogQ29weXJpZ2h0IDIwMTcgR29vZ2xlIExMQ1xyXG4gKlxyXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xyXG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXHJcbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxyXG4gKlxyXG4gKiAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxyXG4gKlxyXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXHJcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcclxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXHJcbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcclxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXHJcbiAqL1xyXG4vKipcclxuICogRGVjb2RlcyBhIEZpcmViYXNlIGF1dGguIHRva2VuIGludG8gY29uc3RpdHVlbnQgcGFydHMuXHJcbiAqXHJcbiAqIE5vdGVzOlxyXG4gKiAtIE1heSByZXR1cm4gd2l0aCBpbnZhbGlkIC8gaW5jb21wbGV0ZSBjbGFpbXMgaWYgdGhlcmUncyBubyBuYXRpdmUgYmFzZTY0IGRlY29kaW5nIHN1cHBvcnQuXHJcbiAqIC0gRG9lc24ndCBjaGVjayBpZiB0aGUgdG9rZW4gaXMgYWN0dWFsbHkgdmFsaWQuXHJcbiAqL1xyXG5jb25zdCBkZWNvZGUgPSBmdW5jdGlvbiAodG9rZW4pIHtcclxuICAgIGxldCBoZWFkZXIgPSB7fSwgY2xhaW1zID0ge30sIGRhdGEgPSB7fSwgc2lnbmF0dXJlID0gJyc7XHJcbiAgICB0cnkge1xyXG4gICAgICAgIGNvbnN0IHBhcnRzID0gdG9rZW4uc3BsaXQoJy4nKTtcclxuICAgICAgICBoZWFkZXIgPSBqc29uRXZhbChiYXNlNjREZWNvZGUocGFydHNbMF0pIHx8ICcnKTtcclxuICAgICAgICBjbGFpbXMgPSBqc29uRXZhbChiYXNlNjREZWNvZGUocGFydHNbMV0pIHx8ICcnKTtcclxuICAgICAgICBzaWduYXR1cmUgPSBwYXJ0c1syXTtcclxuICAgICAgICBkYXRhID0gY2xhaW1zWydkJ10gfHwge307XHJcbiAgICAgICAgZGVsZXRlIGNsYWltc1snZCddO1xyXG4gICAgfVxyXG4gICAgY2F0Y2ggKGUpIHsgfVxyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICBoZWFkZXIsXHJcbiAgICAgICAgY2xhaW1zLFxyXG4gICAgICAgIGRhdGEsXHJcbiAgICAgICAgc2lnbmF0dXJlXHJcbiAgICB9O1xyXG59O1xyXG4vKipcclxuICogRGVjb2RlcyBhIEZpcmViYXNlIGF1dGguIHRva2VuIGFuZCBjaGVja3MgdGhlIHZhbGlkaXR5IG9mIGl0cyB0aW1lLWJhc2VkIGNsYWltcy4gV2lsbCByZXR1cm4gdHJ1ZSBpZiB0aGVcclxuICogdG9rZW4gaXMgd2l0aGluIHRoZSB0aW1lIHdpbmRvdyBhdXRob3JpemVkIGJ5IHRoZSAnbmJmJyAobm90LWJlZm9yZSkgYW5kICdpYXQnIChpc3N1ZWQtYXQpIGNsYWltcy5cclxuICpcclxuICogTm90ZXM6XHJcbiAqIC0gTWF5IHJldHVybiBhIGZhbHNlIG5lZ2F0aXZlIGlmIHRoZXJlJ3Mgbm8gbmF0aXZlIGJhc2U2NCBkZWNvZGluZyBzdXBwb3J0LlxyXG4gKiAtIERvZXNuJ3QgY2hlY2sgaWYgdGhlIHRva2VuIGlzIGFjdHVhbGx5IHZhbGlkLlxyXG4gKi9cclxuY29uc3QgaXNWYWxpZFRpbWVzdGFtcCA9IGZ1bmN0aW9uICh0b2tlbikge1xyXG4gICAgY29uc3QgY2xhaW1zID0gZGVjb2RlKHRva2VuKS5jbGFpbXM7XHJcbiAgICBjb25zdCBub3cgPSBNYXRoLmZsb29yKG5ldyBEYXRlKCkuZ2V0VGltZSgpIC8gMTAwMCk7XHJcbiAgICBsZXQgdmFsaWRTaW5jZSA9IDAsIHZhbGlkVW50aWwgPSAwO1xyXG4gICAgaWYgKHR5cGVvZiBjbGFpbXMgPT09ICdvYmplY3QnKSB7XHJcbiAgICAgICAgaWYgKGNsYWltcy5oYXNPd25Qcm9wZXJ0eSgnbmJmJykpIHtcclxuICAgICAgICAgICAgdmFsaWRTaW5jZSA9IGNsYWltc1snbmJmJ107XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKGNsYWltcy5oYXNPd25Qcm9wZXJ0eSgnaWF0JykpIHtcclxuICAgICAgICAgICAgdmFsaWRTaW5jZSA9IGNsYWltc1snaWF0J107XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChjbGFpbXMuaGFzT3duUHJvcGVydHkoJ2V4cCcpKSB7XHJcbiAgICAgICAgICAgIHZhbGlkVW50aWwgPSBjbGFpbXNbJ2V4cCddO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgLy8gdG9rZW4gd2lsbCBleHBpcmUgYWZ0ZXIgMjRoIGJ5IGRlZmF1bHRcclxuICAgICAgICAgICAgdmFsaWRVbnRpbCA9IHZhbGlkU2luY2UgKyA4NjQwMDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gKCEhbm93ICYmXHJcbiAgICAgICAgISF2YWxpZFNpbmNlICYmXHJcbiAgICAgICAgISF2YWxpZFVudGlsICYmXHJcbiAgICAgICAgbm93ID49IHZhbGlkU2luY2UgJiZcclxuICAgICAgICBub3cgPD0gdmFsaWRVbnRpbCk7XHJcbn07XHJcbi8qKlxyXG4gKiBEZWNvZGVzIGEgRmlyZWJhc2UgYXV0aC4gdG9rZW4gYW5kIHJldHVybnMgaXRzIGlzc3VlZCBhdCB0aW1lIGlmIHZhbGlkLCBudWxsIG90aGVyd2lzZS5cclxuICpcclxuICogTm90ZXM6XHJcbiAqIC0gTWF5IHJldHVybiBudWxsIGlmIHRoZXJlJ3Mgbm8gbmF0aXZlIGJhc2U2NCBkZWNvZGluZyBzdXBwb3J0LlxyXG4gKiAtIERvZXNuJ3QgY2hlY2sgaWYgdGhlIHRva2VuIGlzIGFjdHVhbGx5IHZhbGlkLlxyXG4gKi9cclxuY29uc3QgaXNzdWVkQXRUaW1lID0gZnVuY3Rpb24gKHRva2VuKSB7XHJcbiAgICBjb25zdCBjbGFpbXMgPSBkZWNvZGUodG9rZW4pLmNsYWltcztcclxuICAgIGlmICh0eXBlb2YgY2xhaW1zID09PSAnb2JqZWN0JyAmJiBjbGFpbXMuaGFzT3duUHJvcGVydHkoJ2lhdCcpKSB7XHJcbiAgICAgICAgcmV0dXJuIGNsYWltc1snaWF0J107XHJcbiAgICB9XHJcbiAgICByZXR1cm4gbnVsbDtcclxufTtcclxuLyoqXHJcbiAqIERlY29kZXMgYSBGaXJlYmFzZSBhdXRoLiB0b2tlbiBhbmQgY2hlY2tzIHRoZSB2YWxpZGl0eSBvZiBpdHMgZm9ybWF0LiBFeHBlY3RzIGEgdmFsaWQgaXNzdWVkLWF0IHRpbWUuXHJcbiAqXHJcbiAqIE5vdGVzOlxyXG4gKiAtIE1heSByZXR1cm4gYSBmYWxzZSBuZWdhdGl2ZSBpZiB0aGVyZSdzIG5vIG5hdGl2ZSBiYXNlNjQgZGVjb2Rpbmcgc3VwcG9ydC5cclxuICogLSBEb2Vzbid0IGNoZWNrIGlmIHRoZSB0b2tlbiBpcyBhY3R1YWxseSB2YWxpZC5cclxuICovXHJcbmNvbnN0IGlzVmFsaWRGb3JtYXQgPSBmdW5jdGlvbiAodG9rZW4pIHtcclxuICAgIGNvbnN0IGRlY29kZWQgPSBkZWNvZGUodG9rZW4pLCBjbGFpbXMgPSBkZWNvZGVkLmNsYWltcztcclxuICAgIHJldHVybiAhIWNsYWltcyAmJiB0eXBlb2YgY2xhaW1zID09PSAnb2JqZWN0JyAmJiBjbGFpbXMuaGFzT3duUHJvcGVydHkoJ2lhdCcpO1xyXG59O1xyXG4vKipcclxuICogQXR0ZW1wdHMgdG8gcGVlciBpbnRvIGFuIGF1dGggdG9rZW4gYW5kIGRldGVybWluZSBpZiBpdCdzIGFuIGFkbWluIGF1dGggdG9rZW4gYnkgbG9va2luZyBhdCB0aGUgY2xhaW1zIHBvcnRpb24uXHJcbiAqXHJcbiAqIE5vdGVzOlxyXG4gKiAtIE1heSByZXR1cm4gYSBmYWxzZSBuZWdhdGl2ZSBpZiB0aGVyZSdzIG5vIG5hdGl2ZSBiYXNlNjQgZGVjb2Rpbmcgc3VwcG9ydC5cclxuICogLSBEb2Vzbid0IGNoZWNrIGlmIHRoZSB0b2tlbiBpcyBhY3R1YWxseSB2YWxpZC5cclxuICovXHJcbmNvbnN0IGlzQWRtaW4gPSBmdW5jdGlvbiAodG9rZW4pIHtcclxuICAgIGNvbnN0IGNsYWltcyA9IGRlY29kZSh0b2tlbikuY2xhaW1zO1xyXG4gICAgcmV0dXJuIHR5cGVvZiBjbGFpbXMgPT09ICdvYmplY3QnICYmIGNsYWltc1snYWRtaW4nXSA9PT0gdHJ1ZTtcclxufTtcblxuLyoqXHJcbiAqIEBsaWNlbnNlXHJcbiAqIENvcHlyaWdodCAyMDE3IEdvb2dsZSBMTENcclxuICpcclxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcclxuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxyXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcclxuICpcclxuICogICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcclxuICpcclxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxyXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXHJcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxyXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXHJcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxyXG4gKi9cclxuZnVuY3Rpb24gY29udGFpbnMob2JqLCBrZXkpIHtcclxuICAgIHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBrZXkpO1xyXG59XHJcbmZ1bmN0aW9uIHNhZmVHZXQob2JqLCBrZXkpIHtcclxuICAgIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBrZXkpKSB7XHJcbiAgICAgICAgcmV0dXJuIG9ialtrZXldO1xyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcclxuICAgIH1cclxufVxyXG5mdW5jdGlvbiBpc0VtcHR5KG9iaikge1xyXG4gICAgZm9yIChjb25zdCBrZXkgaW4gb2JqKSB7XHJcbiAgICAgICAgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIGtleSkpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiB0cnVlO1xyXG59XHJcbmZ1bmN0aW9uIG1hcChvYmosIGZuLCBjb250ZXh0T2JqKSB7XHJcbiAgICBjb25zdCByZXMgPSB7fTtcclxuICAgIGZvciAoY29uc3Qga2V5IGluIG9iaikge1xyXG4gICAgICAgIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBrZXkpKSB7XHJcbiAgICAgICAgICAgIHJlc1trZXldID0gZm4uY2FsbChjb250ZXh0T2JqLCBvYmpba2V5XSwga2V5LCBvYmopO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiByZXM7XHJcbn1cclxuLyoqXHJcbiAqIERlZXAgZXF1YWwgdHdvIG9iamVjdHMuIFN1cHBvcnQgQXJyYXlzIGFuZCBPYmplY3RzLlxyXG4gKi9cclxuZnVuY3Rpb24gZGVlcEVxdWFsKGEsIGIpIHtcclxuICAgIGlmIChhID09PSBiKSB7XHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcbiAgICBjb25zdCBhS2V5cyA9IE9iamVjdC5rZXlzKGEpO1xyXG4gICAgY29uc3QgYktleXMgPSBPYmplY3Qua2V5cyhiKTtcclxuICAgIGZvciAoY29uc3QgayBvZiBhS2V5cykge1xyXG4gICAgICAgIGlmICghYktleXMuaW5jbHVkZXMoaykpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjb25zdCBhUHJvcCA9IGFba107XHJcbiAgICAgICAgY29uc3QgYlByb3AgPSBiW2tdO1xyXG4gICAgICAgIGlmIChpc09iamVjdChhUHJvcCkgJiYgaXNPYmplY3QoYlByb3ApKSB7XHJcbiAgICAgICAgICAgIGlmICghZGVlcEVxdWFsKGFQcm9wLCBiUHJvcCkpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmIChhUHJvcCAhPT0gYlByb3ApIHtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGZvciAoY29uc3QgayBvZiBiS2V5cykge1xyXG4gICAgICAgIGlmICghYUtleXMuaW5jbHVkZXMoaykpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiB0cnVlO1xyXG59XHJcbmZ1bmN0aW9uIGlzT2JqZWN0KHRoaW5nKSB7XHJcbiAgICByZXR1cm4gdGhpbmcgIT09IG51bGwgJiYgdHlwZW9mIHRoaW5nID09PSAnb2JqZWN0JztcclxufVxuXG4vKipcclxuICogQGxpY2Vuc2VcclxuICogQ29weXJpZ2h0IDIwMjIgR29vZ2xlIExMQ1xyXG4gKlxyXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xyXG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXHJcbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxyXG4gKlxyXG4gKiAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxyXG4gKlxyXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXHJcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcclxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXHJcbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcclxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXHJcbiAqL1xyXG4vKipcclxuICogUmVqZWN0cyBpZiB0aGUgZ2l2ZW4gcHJvbWlzZSBkb2Vzbid0IHJlc29sdmUgaW4gdGltZUluTVMgbWlsbGlzZWNvbmRzLlxyXG4gKiBAaW50ZXJuYWxcclxuICovXHJcbmZ1bmN0aW9uIHByb21pc2VXaXRoVGltZW91dChwcm9taXNlLCB0aW1lSW5NUyA9IDIwMDApIHtcclxuICAgIGNvbnN0IGRlZmVycmVkUHJvbWlzZSA9IG5ldyBEZWZlcnJlZCgpO1xyXG4gICAgc2V0VGltZW91dCgoKSA9PiBkZWZlcnJlZFByb21pc2UucmVqZWN0KCd0aW1lb3V0IScpLCB0aW1lSW5NUyk7XHJcbiAgICBwcm9taXNlLnRoZW4oZGVmZXJyZWRQcm9taXNlLnJlc29sdmUsIGRlZmVycmVkUHJvbWlzZS5yZWplY3QpO1xyXG4gICAgcmV0dXJuIGRlZmVycmVkUHJvbWlzZS5wcm9taXNlO1xyXG59XG5cbi8qKlxyXG4gKiBAbGljZW5zZVxyXG4gKiBDb3B5cmlnaHQgMjAxNyBHb29nbGUgTExDXHJcbiAqXHJcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XHJcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cclxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XHJcbiAqXHJcbiAqICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXHJcbiAqXHJcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcclxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxyXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cclxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxyXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cclxuICovXHJcbi8qKlxyXG4gKiBSZXR1cm5zIGEgcXVlcnlzdHJpbmctZm9ybWF0dGVkIHN0cmluZyAoZS5nLiAmYXJnPXZhbCZhcmcyPXZhbDIpIGZyb20gYVxyXG4gKiBwYXJhbXMgb2JqZWN0IChlLmcuIHthcmc6ICd2YWwnLCBhcmcyOiAndmFsMid9KVxyXG4gKiBOb3RlOiBZb3UgbXVzdCBwcmVwZW5kIGl0IHdpdGggPyB3aGVuIGFkZGluZyBpdCB0byBhIFVSTC5cclxuICovXHJcbmZ1bmN0aW9uIHF1ZXJ5c3RyaW5nKHF1ZXJ5c3RyaW5nUGFyYW1zKSB7XHJcbiAgICBjb25zdCBwYXJhbXMgPSBbXTtcclxuICAgIGZvciAoY29uc3QgW2tleSwgdmFsdWVdIG9mIE9iamVjdC5lbnRyaWVzKHF1ZXJ5c3RyaW5nUGFyYW1zKSkge1xyXG4gICAgICAgIGlmIChBcnJheS5pc0FycmF5KHZhbHVlKSkge1xyXG4gICAgICAgICAgICB2YWx1ZS5mb3JFYWNoKGFycmF5VmFsID0+IHtcclxuICAgICAgICAgICAgICAgIHBhcmFtcy5wdXNoKGVuY29kZVVSSUNvbXBvbmVudChrZXkpICsgJz0nICsgZW5jb2RlVVJJQ29tcG9uZW50KGFycmF5VmFsKSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgcGFyYW1zLnB1c2goZW5jb2RlVVJJQ29tcG9uZW50KGtleSkgKyAnPScgKyBlbmNvZGVVUklDb21wb25lbnQodmFsdWUpKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gcGFyYW1zLmxlbmd0aCA/ICcmJyArIHBhcmFtcy5qb2luKCcmJykgOiAnJztcclxufVxyXG4vKipcclxuICogRGVjb2RlcyBhIHF1ZXJ5c3RyaW5nIChlLmcuID9hcmc9dmFsJmFyZzI9dmFsMikgaW50byBhIHBhcmFtcyBvYmplY3RcclxuICogKGUuZy4ge2FyZzogJ3ZhbCcsIGFyZzI6ICd2YWwyJ30pXHJcbiAqL1xyXG5mdW5jdGlvbiBxdWVyeXN0cmluZ0RlY29kZShxdWVyeXN0cmluZykge1xyXG4gICAgY29uc3Qgb2JqID0ge307XHJcbiAgICBjb25zdCB0b2tlbnMgPSBxdWVyeXN0cmluZy5yZXBsYWNlKC9eXFw/LywgJycpLnNwbGl0KCcmJyk7XHJcbiAgICB0b2tlbnMuZm9yRWFjaCh0b2tlbiA9PiB7XHJcbiAgICAgICAgaWYgKHRva2VuKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IFtrZXksIHZhbHVlXSA9IHRva2VuLnNwbGl0KCc9Jyk7XHJcbiAgICAgICAgICAgIG9ialtkZWNvZGVVUklDb21wb25lbnQoa2V5KV0gPSBkZWNvZGVVUklDb21wb25lbnQodmFsdWUpO1xyXG4gICAgICAgIH1cclxuICAgIH0pO1xyXG4gICAgcmV0dXJuIG9iajtcclxufVxyXG4vKipcclxuICogRXh0cmFjdCB0aGUgcXVlcnkgc3RyaW5nIHBhcnQgb2YgYSBVUkwsIGluY2x1ZGluZyB0aGUgbGVhZGluZyBxdWVzdGlvbiBtYXJrIChpZiBwcmVzZW50KS5cclxuICovXHJcbmZ1bmN0aW9uIGV4dHJhY3RRdWVyeXN0cmluZyh1cmwpIHtcclxuICAgIGNvbnN0IHF1ZXJ5U3RhcnQgPSB1cmwuaW5kZXhPZignPycpO1xyXG4gICAgaWYgKCFxdWVyeVN0YXJ0KSB7XHJcbiAgICAgICAgcmV0dXJuICcnO1xyXG4gICAgfVxyXG4gICAgY29uc3QgZnJhZ21lbnRTdGFydCA9IHVybC5pbmRleE9mKCcjJywgcXVlcnlTdGFydCk7XHJcbiAgICByZXR1cm4gdXJsLnN1YnN0cmluZyhxdWVyeVN0YXJ0LCBmcmFnbWVudFN0YXJ0ID4gMCA/IGZyYWdtZW50U3RhcnQgOiB1bmRlZmluZWQpO1xyXG59XG5cbi8qKlxyXG4gKiBAbGljZW5zZVxyXG4gKiBDb3B5cmlnaHQgMjAxNyBHb29nbGUgTExDXHJcbiAqXHJcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XHJcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cclxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XHJcbiAqXHJcbiAqICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXHJcbiAqXHJcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcclxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxyXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cclxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxyXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cclxuICovXHJcbi8qKlxyXG4gKiBAZmlsZW92ZXJ2aWV3IFNIQS0xIGNyeXB0b2dyYXBoaWMgaGFzaC5cclxuICogVmFyaWFibGUgbmFtZXMgZm9sbG93IHRoZSBub3RhdGlvbiBpbiBGSVBTIFBVQiAxODAtMzpcclxuICogaHR0cDovL2NzcmMubmlzdC5nb3YvcHVibGljYXRpb25zL2ZpcHMvZmlwczE4MC0zL2ZpcHMxODAtM19maW5hbC5wZGYuXHJcbiAqXHJcbiAqIFVzYWdlOlxyXG4gKiAgIHZhciBzaGExID0gbmV3IHNoYTEoKTtcclxuICogICBzaGExLnVwZGF0ZShieXRlcyk7XHJcbiAqICAgdmFyIGhhc2ggPSBzaGExLmRpZ2VzdCgpO1xyXG4gKlxyXG4gKiBQZXJmb3JtYW5jZTpcclxuICogICBDaHJvbWUgMjM6ICAgfjQwMCBNYml0L3NcclxuICogICBGaXJlZm94IDE2OiAgfjI1MCBNYml0L3NcclxuICpcclxuICovXHJcbi8qKlxyXG4gKiBTSEEtMSBjcnlwdG9ncmFwaGljIGhhc2ggY29uc3RydWN0b3IuXHJcbiAqXHJcbiAqIFRoZSBwcm9wZXJ0aWVzIGRlY2xhcmVkIGhlcmUgYXJlIGRpc2N1c3NlZCBpbiB0aGUgYWJvdmUgYWxnb3JpdGhtIGRvY3VtZW50LlxyXG4gKiBAY29uc3RydWN0b3JcclxuICogQGZpbmFsXHJcbiAqIEBzdHJ1Y3RcclxuICovXHJcbmNsYXNzIFNoYTEge1xyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogSG9sZHMgdGhlIHByZXZpb3VzIHZhbHVlcyBvZiBhY2N1bXVsYXRlZCB2YXJpYWJsZXMgYS1lIGluIHRoZSBjb21wcmVzc19cclxuICAgICAgICAgKiBmdW5jdGlvbi5cclxuICAgICAgICAgKiBAcHJpdmF0ZVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHRoaXMuY2hhaW5fID0gW107XHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogQSBidWZmZXIgaG9sZGluZyB0aGUgcGFydGlhbGx5IGNvbXB1dGVkIGhhc2ggcmVzdWx0LlxyXG4gICAgICAgICAqIEBwcml2YXRlXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgdGhpcy5idWZfID0gW107XHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogQW4gYXJyYXkgb2YgODAgYnl0ZXMsIGVhY2ggYSBwYXJ0IG9mIHRoZSBtZXNzYWdlIHRvIGJlIGhhc2hlZC4gIFJlZmVycmVkIHRvXHJcbiAgICAgICAgICogYXMgdGhlIG1lc3NhZ2Ugc2NoZWR1bGUgaW4gdGhlIGRvY3MuXHJcbiAgICAgICAgICogQHByaXZhdGVcclxuICAgICAgICAgKi9cclxuICAgICAgICB0aGlzLldfID0gW107XHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogQ29udGFpbnMgZGF0YSBuZWVkZWQgdG8gcGFkIG1lc3NhZ2VzIGxlc3MgdGhhbiA2NCBieXRlcy5cclxuICAgICAgICAgKiBAcHJpdmF0ZVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHRoaXMucGFkXyA9IFtdO1xyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIEBwcml2YXRlIHtudW1iZXJ9XHJcbiAgICAgICAgICovXHJcbiAgICAgICAgdGhpcy5pbmJ1Zl8gPSAwO1xyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIEBwcml2YXRlIHtudW1iZXJ9XHJcbiAgICAgICAgICovXHJcbiAgICAgICAgdGhpcy50b3RhbF8gPSAwO1xyXG4gICAgICAgIHRoaXMuYmxvY2tTaXplID0gNTEyIC8gODtcclxuICAgICAgICB0aGlzLnBhZF9bMF0gPSAxMjg7XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDE7IGkgPCB0aGlzLmJsb2NrU2l6ZTsgKytpKSB7XHJcbiAgICAgICAgICAgIHRoaXMucGFkX1tpXSA9IDA7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMucmVzZXQoKTtcclxuICAgIH1cclxuICAgIHJlc2V0KCkge1xyXG4gICAgICAgIHRoaXMuY2hhaW5fWzBdID0gMHg2NzQ1MjMwMTtcclxuICAgICAgICB0aGlzLmNoYWluX1sxXSA9IDB4ZWZjZGFiODk7XHJcbiAgICAgICAgdGhpcy5jaGFpbl9bMl0gPSAweDk4YmFkY2ZlO1xyXG4gICAgICAgIHRoaXMuY2hhaW5fWzNdID0gMHgxMDMyNTQ3NjtcclxuICAgICAgICB0aGlzLmNoYWluX1s0XSA9IDB4YzNkMmUxZjA7XHJcbiAgICAgICAgdGhpcy5pbmJ1Zl8gPSAwO1xyXG4gICAgICAgIHRoaXMudG90YWxfID0gMDtcclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICogSW50ZXJuYWwgY29tcHJlc3MgaGVscGVyIGZ1bmN0aW9uLlxyXG4gICAgICogQHBhcmFtIGJ1ZiBCbG9jayB0byBjb21wcmVzcy5cclxuICAgICAqIEBwYXJhbSBvZmZzZXQgT2Zmc2V0IG9mIHRoZSBibG9jayBpbiB0aGUgYnVmZmVyLlxyXG4gICAgICogQHByaXZhdGVcclxuICAgICAqL1xyXG4gICAgY29tcHJlc3NfKGJ1Ziwgb2Zmc2V0KSB7XHJcbiAgICAgICAgaWYgKCFvZmZzZXQpIHtcclxuICAgICAgICAgICAgb2Zmc2V0ID0gMDtcclxuICAgICAgICB9XHJcbiAgICAgICAgY29uc3QgVyA9IHRoaXMuV187XHJcbiAgICAgICAgLy8gZ2V0IDE2IGJpZyBlbmRpYW4gd29yZHNcclxuICAgICAgICBpZiAodHlwZW9mIGJ1ZiA9PT0gJ3N0cmluZycpIHtcclxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCAxNjsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICAvLyBUT0RPKHVzZXIpOiBbYnVnIDgxNDAxMjJdIFJlY2VudCB2ZXJzaW9ucyBvZiBTYWZhcmkgZm9yIE1hYyBPUyBhbmQgaU9TXHJcbiAgICAgICAgICAgICAgICAvLyBoYXZlIGEgYnVnIHRoYXQgdHVybnMgdGhlIHBvc3QtaW5jcmVtZW50ICsrIG9wZXJhdG9yIGludG8gcHJlLWluY3JlbWVudFxyXG4gICAgICAgICAgICAgICAgLy8gZHVyaW5nIEpJVCBjb21waWxhdGlvbi4gIFdlIGhhdmUgY29kZSB0aGF0IGRlcGVuZHMgaGVhdmlseSBvbiBTSEEtMSBmb3JcclxuICAgICAgICAgICAgICAgIC8vIGNvcnJlY3RuZXNzIGFuZCB3aGljaCBpcyBhZmZlY3RlZCBieSB0aGlzIGJ1Zywgc28gSSd2ZSByZW1vdmVkIGFsbCB1c2VzXHJcbiAgICAgICAgICAgICAgICAvLyBvZiBwb3N0LWluY3JlbWVudCArKyBpbiB3aGljaCB0aGUgcmVzdWx0IHZhbHVlIGlzIHVzZWQuICBXZSBjYW4gcmV2ZXJ0XHJcbiAgICAgICAgICAgICAgICAvLyB0aGlzIGNoYW5nZSBvbmNlIHRoZSBTYWZhcmkgYnVnXHJcbiAgICAgICAgICAgICAgICAvLyAoaHR0cHM6Ly9idWdzLndlYmtpdC5vcmcvc2hvd19idWcuY2dpP2lkPTEwOTAzNikgaGFzIGJlZW4gZml4ZWQgYW5kXHJcbiAgICAgICAgICAgICAgICAvLyBtb3N0IGNsaWVudHMgaGF2ZSBiZWVuIHVwZGF0ZWQuXHJcbiAgICAgICAgICAgICAgICBXW2ldID1cclxuICAgICAgICAgICAgICAgICAgICAoYnVmLmNoYXJDb2RlQXQob2Zmc2V0KSA8PCAyNCkgfFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAoYnVmLmNoYXJDb2RlQXQob2Zmc2V0ICsgMSkgPDwgMTYpIHxcclxuICAgICAgICAgICAgICAgICAgICAgICAgKGJ1Zi5jaGFyQ29kZUF0KG9mZnNldCArIDIpIDw8IDgpIHxcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnVmLmNoYXJDb2RlQXQob2Zmc2V0ICsgMyk7XHJcbiAgICAgICAgICAgICAgICBvZmZzZXQgKz0gNDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCAxNjsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBXW2ldID1cclxuICAgICAgICAgICAgICAgICAgICAoYnVmW29mZnNldF0gPDwgMjQpIHxcclxuICAgICAgICAgICAgICAgICAgICAgICAgKGJ1ZltvZmZzZXQgKyAxXSA8PCAxNikgfFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAoYnVmW29mZnNldCArIDJdIDw8IDgpIHxcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnVmW29mZnNldCArIDNdO1xyXG4gICAgICAgICAgICAgICAgb2Zmc2V0ICs9IDQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gZXhwYW5kIHRvIDgwIHdvcmRzXHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDE2OyBpIDwgODA7IGkrKykge1xyXG4gICAgICAgICAgICBjb25zdCB0ID0gV1tpIC0gM10gXiBXW2kgLSA4XSBeIFdbaSAtIDE0XSBeIFdbaSAtIDE2XTtcclxuICAgICAgICAgICAgV1tpXSA9ICgodCA8PCAxKSB8ICh0ID4+PiAzMSkpICYgMHhmZmZmZmZmZjtcclxuICAgICAgICB9XHJcbiAgICAgICAgbGV0IGEgPSB0aGlzLmNoYWluX1swXTtcclxuICAgICAgICBsZXQgYiA9IHRoaXMuY2hhaW5fWzFdO1xyXG4gICAgICAgIGxldCBjID0gdGhpcy5jaGFpbl9bMl07XHJcbiAgICAgICAgbGV0IGQgPSB0aGlzLmNoYWluX1szXTtcclxuICAgICAgICBsZXQgZSA9IHRoaXMuY2hhaW5fWzRdO1xyXG4gICAgICAgIGxldCBmLCBrO1xyXG4gICAgICAgIC8vIFRPRE8odXNlcik6IFRyeSB0byB1bnJvbGwgdGhpcyBsb29wIHRvIHNwZWVkIHVwIHRoZSBjb21wdXRhdGlvbi5cclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IDgwOyBpKyspIHtcclxuICAgICAgICAgICAgaWYgKGkgPCA0MCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKGkgPCAyMCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGYgPSBkIF4gKGIgJiAoYyBeIGQpKTtcclxuICAgICAgICAgICAgICAgICAgICBrID0gMHg1YTgyNzk5OTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGYgPSBiIF4gYyBeIGQ7XHJcbiAgICAgICAgICAgICAgICAgICAgayA9IDB4NmVkOWViYTE7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoaSA8IDYwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZiA9IChiICYgYykgfCAoZCAmIChiIHwgYykpO1xyXG4gICAgICAgICAgICAgICAgICAgIGsgPSAweDhmMWJiY2RjO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZiA9IGIgXiBjIF4gZDtcclxuICAgICAgICAgICAgICAgICAgICBrID0gMHhjYTYyYzFkNjtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjb25zdCB0ID0gKCgoYSA8PCA1KSB8IChhID4+PiAyNykpICsgZiArIGUgKyBrICsgV1tpXSkgJiAweGZmZmZmZmZmO1xyXG4gICAgICAgICAgICBlID0gZDtcclxuICAgICAgICAgICAgZCA9IGM7XHJcbiAgICAgICAgICAgIGMgPSAoKGIgPDwgMzApIHwgKGIgPj4+IDIpKSAmIDB4ZmZmZmZmZmY7XHJcbiAgICAgICAgICAgIGIgPSBhO1xyXG4gICAgICAgICAgICBhID0gdDtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5jaGFpbl9bMF0gPSAodGhpcy5jaGFpbl9bMF0gKyBhKSAmIDB4ZmZmZmZmZmY7XHJcbiAgICAgICAgdGhpcy5jaGFpbl9bMV0gPSAodGhpcy5jaGFpbl9bMV0gKyBiKSAmIDB4ZmZmZmZmZmY7XHJcbiAgICAgICAgdGhpcy5jaGFpbl9bMl0gPSAodGhpcy5jaGFpbl9bMl0gKyBjKSAmIDB4ZmZmZmZmZmY7XHJcbiAgICAgICAgdGhpcy5jaGFpbl9bM10gPSAodGhpcy5jaGFpbl9bM10gKyBkKSAmIDB4ZmZmZmZmZmY7XHJcbiAgICAgICAgdGhpcy5jaGFpbl9bNF0gPSAodGhpcy5jaGFpbl9bNF0gKyBlKSAmIDB4ZmZmZmZmZmY7XHJcbiAgICB9XHJcbiAgICB1cGRhdGUoYnl0ZXMsIGxlbmd0aCkge1xyXG4gICAgICAgIC8vIFRPRE8oam9obmxlbnopOiB0aWdodGVuIHRoZSBmdW5jdGlvbiBzaWduYXR1cmUgYW5kIHJlbW92ZSB0aGlzIGNoZWNrXHJcbiAgICAgICAgaWYgKGJ5dGVzID09IG51bGwpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAobGVuZ3RoID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgbGVuZ3RoID0gYnl0ZXMubGVuZ3RoO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjb25zdCBsZW5ndGhNaW51c0Jsb2NrID0gbGVuZ3RoIC0gdGhpcy5ibG9ja1NpemU7XHJcbiAgICAgICAgbGV0IG4gPSAwO1xyXG4gICAgICAgIC8vIFVzaW5nIGxvY2FsIGluc3RlYWQgb2YgbWVtYmVyIHZhcmlhYmxlcyBnaXZlcyB+NSUgc3BlZWR1cCBvbiBGaXJlZm94IDE2LlxyXG4gICAgICAgIGNvbnN0IGJ1ZiA9IHRoaXMuYnVmXztcclxuICAgICAgICBsZXQgaW5idWYgPSB0aGlzLmluYnVmXztcclxuICAgICAgICAvLyBUaGUgb3V0ZXIgd2hpbGUgbG9vcCBzaG91bGQgZXhlY3V0ZSBhdCBtb3N0IHR3aWNlLlxyXG4gICAgICAgIHdoaWxlIChuIDwgbGVuZ3RoKSB7XHJcbiAgICAgICAgICAgIC8vIFdoZW4gd2UgaGF2ZSBubyBkYXRhIGluIHRoZSBibG9jayB0byB0b3AgdXAsIHdlIGNhbiBkaXJlY3RseSBwcm9jZXNzIHRoZVxyXG4gICAgICAgICAgICAvLyBpbnB1dCBidWZmZXIgKGFzc3VtaW5nIGl0IGNvbnRhaW5zIHN1ZmZpY2llbnQgZGF0YSkuIFRoaXMgZ2l2ZXMgfjI1JVxyXG4gICAgICAgICAgICAvLyBzcGVlZHVwIG9uIENocm9tZSAyMyBhbmQgfjE1JSBzcGVlZHVwIG9uIEZpcmVmb3ggMTYsIGJ1dCByZXF1aXJlcyB0aGF0XHJcbiAgICAgICAgICAgIC8vIHRoZSBkYXRhIGlzIHByb3ZpZGVkIGluIGxhcmdlIGNodW5rcyAob3IgaW4gbXVsdGlwbGVzIG9mIDY0IGJ5dGVzKS5cclxuICAgICAgICAgICAgaWYgKGluYnVmID09PSAwKSB7XHJcbiAgICAgICAgICAgICAgICB3aGlsZSAobiA8PSBsZW5ndGhNaW51c0Jsb2NrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jb21wcmVzc18oYnl0ZXMsIG4pO1xyXG4gICAgICAgICAgICAgICAgICAgIG4gKz0gdGhpcy5ibG9ja1NpemU7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKHR5cGVvZiBieXRlcyA9PT0gJ3N0cmluZycpIHtcclxuICAgICAgICAgICAgICAgIHdoaWxlIChuIDwgbGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgYnVmW2luYnVmXSA9IGJ5dGVzLmNoYXJDb2RlQXQobik7XHJcbiAgICAgICAgICAgICAgICAgICAgKytpbmJ1ZjtcclxuICAgICAgICAgICAgICAgICAgICArK247XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGluYnVmID09PSB0aGlzLmJsb2NrU2l6ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNvbXByZXNzXyhidWYpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpbmJ1ZiA9IDA7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIEp1bXAgdG8gdGhlIG91dGVyIGxvb3Agc28gd2UgdXNlIHRoZSBmdWxsLWJsb2NrIG9wdGltaXphdGlvbi5cclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgd2hpbGUgKG4gPCBsZW5ndGgpIHtcclxuICAgICAgICAgICAgICAgICAgICBidWZbaW5idWZdID0gYnl0ZXNbbl07XHJcbiAgICAgICAgICAgICAgICAgICAgKytpbmJ1ZjtcclxuICAgICAgICAgICAgICAgICAgICArK247XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGluYnVmID09PSB0aGlzLmJsb2NrU2l6ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNvbXByZXNzXyhidWYpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpbmJ1ZiA9IDA7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIEp1bXAgdG8gdGhlIG91dGVyIGxvb3Agc28gd2UgdXNlIHRoZSBmdWxsLWJsb2NrIG9wdGltaXphdGlvbi5cclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuaW5idWZfID0gaW5idWY7XHJcbiAgICAgICAgdGhpcy50b3RhbF8gKz0gbGVuZ3RoO1xyXG4gICAgfVxyXG4gICAgLyoqIEBvdmVycmlkZSAqL1xyXG4gICAgZGlnZXN0KCkge1xyXG4gICAgICAgIGNvbnN0IGRpZ2VzdCA9IFtdO1xyXG4gICAgICAgIGxldCB0b3RhbEJpdHMgPSB0aGlzLnRvdGFsXyAqIDg7XHJcbiAgICAgICAgLy8gQWRkIHBhZCAweDgwIDB4MDAqLlxyXG4gICAgICAgIGlmICh0aGlzLmluYnVmXyA8IDU2KSB7XHJcbiAgICAgICAgICAgIHRoaXMudXBkYXRlKHRoaXMucGFkXywgNTYgLSB0aGlzLmluYnVmXyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLnVwZGF0ZSh0aGlzLnBhZF8sIHRoaXMuYmxvY2tTaXplIC0gKHRoaXMuaW5idWZfIC0gNTYpKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gQWRkICMgYml0cy5cclxuICAgICAgICBmb3IgKGxldCBpID0gdGhpcy5ibG9ja1NpemUgLSAxOyBpID49IDU2OyBpLS0pIHtcclxuICAgICAgICAgICAgdGhpcy5idWZfW2ldID0gdG90YWxCaXRzICYgMjU1O1xyXG4gICAgICAgICAgICB0b3RhbEJpdHMgLz0gMjU2OyAvLyBEb24ndCB1c2UgYml0LXNoaWZ0aW5nIGhlcmUhXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuY29tcHJlc3NfKHRoaXMuYnVmXyk7XHJcbiAgICAgICAgbGV0IG4gPSAwO1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgNTsgaSsrKSB7XHJcbiAgICAgICAgICAgIGZvciAobGV0IGogPSAyNDsgaiA+PSAwOyBqIC09IDgpIHtcclxuICAgICAgICAgICAgICAgIGRpZ2VzdFtuXSA9ICh0aGlzLmNoYWluX1tpXSA+PiBqKSAmIDI1NTtcclxuICAgICAgICAgICAgICAgICsrbjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gZGlnZXN0O1xyXG4gICAgfVxyXG59XG5cbi8qKlxyXG4gKiBIZWxwZXIgdG8gbWFrZSBhIFN1YnNjcmliZSBmdW5jdGlvbiAoanVzdCBsaWtlIFByb21pc2UgaGVscHMgbWFrZSBhXHJcbiAqIFRoZW5hYmxlKS5cclxuICpcclxuICogQHBhcmFtIGV4ZWN1dG9yIEZ1bmN0aW9uIHdoaWNoIGNhbiBtYWtlIGNhbGxzIHRvIGEgc2luZ2xlIE9ic2VydmVyXHJcbiAqICAgICBhcyBhIHByb3h5LlxyXG4gKiBAcGFyYW0gb25Ob09ic2VydmVycyBDYWxsYmFjayB3aGVuIGNvdW50IG9mIE9ic2VydmVycyBnb2VzIHRvIHplcm8uXHJcbiAqL1xyXG5mdW5jdGlvbiBjcmVhdGVTdWJzY3JpYmUoZXhlY3V0b3IsIG9uTm9PYnNlcnZlcnMpIHtcclxuICAgIGNvbnN0IHByb3h5ID0gbmV3IE9ic2VydmVyUHJveHkoZXhlY3V0b3IsIG9uTm9PYnNlcnZlcnMpO1xyXG4gICAgcmV0dXJuIHByb3h5LnN1YnNjcmliZS5iaW5kKHByb3h5KTtcclxufVxyXG4vKipcclxuICogSW1wbGVtZW50IGZhbi1vdXQgZm9yIGFueSBudW1iZXIgb2YgT2JzZXJ2ZXJzIGF0dGFjaGVkIHZpYSBhIHN1YnNjcmliZVxyXG4gKiBmdW5jdGlvbi5cclxuICovXHJcbmNsYXNzIE9ic2VydmVyUHJveHkge1xyXG4gICAgLyoqXHJcbiAgICAgKiBAcGFyYW0gZXhlY3V0b3IgRnVuY3Rpb24gd2hpY2ggY2FuIG1ha2UgY2FsbHMgdG8gYSBzaW5nbGUgT2JzZXJ2ZXJcclxuICAgICAqICAgICBhcyBhIHByb3h5LlxyXG4gICAgICogQHBhcmFtIG9uTm9PYnNlcnZlcnMgQ2FsbGJhY2sgd2hlbiBjb3VudCBvZiBPYnNlcnZlcnMgZ29lcyB0byB6ZXJvLlxyXG4gICAgICovXHJcbiAgICBjb25zdHJ1Y3RvcihleGVjdXRvciwgb25Ob09ic2VydmVycykge1xyXG4gICAgICAgIHRoaXMub2JzZXJ2ZXJzID0gW107XHJcbiAgICAgICAgdGhpcy51bnN1YnNjcmliZXMgPSBbXTtcclxuICAgICAgICB0aGlzLm9ic2VydmVyQ291bnQgPSAwO1xyXG4gICAgICAgIC8vIE1pY3JvLXRhc2sgc2NoZWR1bGluZyBieSBjYWxsaW5nIHRhc2sudGhlbigpLlxyXG4gICAgICAgIHRoaXMudGFzayA9IFByb21pc2UucmVzb2x2ZSgpO1xyXG4gICAgICAgIHRoaXMuZmluYWxpemVkID0gZmFsc2U7XHJcbiAgICAgICAgdGhpcy5vbk5vT2JzZXJ2ZXJzID0gb25Ob09ic2VydmVycztcclxuICAgICAgICAvLyBDYWxsIHRoZSBleGVjdXRvciBhc3luY2hyb25vdXNseSBzbyBzdWJzY3JpYmVycyB0aGF0IGFyZSBjYWxsZWRcclxuICAgICAgICAvLyBzeW5jaHJvbm91c2x5IGFmdGVyIHRoZSBjcmVhdGlvbiBvZiB0aGUgc3Vic2NyaWJlIGZ1bmN0aW9uXHJcbiAgICAgICAgLy8gY2FuIHN0aWxsIHJlY2VpdmUgdGhlIHZlcnkgZmlyc3QgdmFsdWUgZ2VuZXJhdGVkIGluIHRoZSBleGVjdXRvci5cclxuICAgICAgICB0aGlzLnRhc2tcclxuICAgICAgICAgICAgLnRoZW4oKCkgPT4ge1xyXG4gICAgICAgICAgICBleGVjdXRvcih0aGlzKTtcclxuICAgICAgICB9KVxyXG4gICAgICAgICAgICAuY2F0Y2goZSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuZXJyb3IoZSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICBuZXh0KHZhbHVlKSB7XHJcbiAgICAgICAgdGhpcy5mb3JFYWNoT2JzZXJ2ZXIoKG9ic2VydmVyKSA9PiB7XHJcbiAgICAgICAgICAgIG9ic2VydmVyLm5leHQodmFsdWUpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgZXJyb3IoZXJyb3IpIHtcclxuICAgICAgICB0aGlzLmZvckVhY2hPYnNlcnZlcigob2JzZXJ2ZXIpID0+IHtcclxuICAgICAgICAgICAgb2JzZXJ2ZXIuZXJyb3IoZXJyb3IpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHRoaXMuY2xvc2UoZXJyb3IpO1xyXG4gICAgfVxyXG4gICAgY29tcGxldGUoKSB7XHJcbiAgICAgICAgdGhpcy5mb3JFYWNoT2JzZXJ2ZXIoKG9ic2VydmVyKSA9PiB7XHJcbiAgICAgICAgICAgIG9ic2VydmVyLmNvbXBsZXRlKCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGhpcy5jbG9zZSgpO1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiBTdWJzY3JpYmUgZnVuY3Rpb24gdGhhdCBjYW4gYmUgdXNlZCB0byBhZGQgYW4gT2JzZXJ2ZXIgdG8gdGhlIGZhbi1vdXQgbGlzdC5cclxuICAgICAqXHJcbiAgICAgKiAtIFdlIHJlcXVpcmUgdGhhdCBubyBldmVudCBpcyBzZW50IHRvIGEgc3Vic2NyaWJlciBzeWNocm9ub3VzbHkgdG8gdGhlaXJcclxuICAgICAqICAgY2FsbCB0byBzdWJzY3JpYmUoKS5cclxuICAgICAqL1xyXG4gICAgc3Vic2NyaWJlKG5leHRPck9ic2VydmVyLCBlcnJvciwgY29tcGxldGUpIHtcclxuICAgICAgICBsZXQgb2JzZXJ2ZXI7XHJcbiAgICAgICAgaWYgKG5leHRPck9ic2VydmVyID09PSB1bmRlZmluZWQgJiZcclxuICAgICAgICAgICAgZXJyb3IgPT09IHVuZGVmaW5lZCAmJlxyXG4gICAgICAgICAgICBjb21wbGV0ZSA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignTWlzc2luZyBPYnNlcnZlci4nKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gQXNzZW1ibGUgYW4gT2JzZXJ2ZXIgb2JqZWN0IHdoZW4gcGFzc2VkIGFzIGNhbGxiYWNrIGZ1bmN0aW9ucy5cclxuICAgICAgICBpZiAoaW1wbGVtZW50c0FueU1ldGhvZHMobmV4dE9yT2JzZXJ2ZXIsIFtcclxuICAgICAgICAgICAgJ25leHQnLFxyXG4gICAgICAgICAgICAnZXJyb3InLFxyXG4gICAgICAgICAgICAnY29tcGxldGUnXHJcbiAgICAgICAgXSkpIHtcclxuICAgICAgICAgICAgb2JzZXJ2ZXIgPSBuZXh0T3JPYnNlcnZlcjtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIG9ic2VydmVyID0ge1xyXG4gICAgICAgICAgICAgICAgbmV4dDogbmV4dE9yT2JzZXJ2ZXIsXHJcbiAgICAgICAgICAgICAgICBlcnJvcixcclxuICAgICAgICAgICAgICAgIGNvbXBsZXRlXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChvYnNlcnZlci5uZXh0ID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgb2JzZXJ2ZXIubmV4dCA9IG5vb3A7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChvYnNlcnZlci5lcnJvciA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIG9ic2VydmVyLmVycm9yID0gbm9vcDtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKG9ic2VydmVyLmNvbXBsZXRlID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgb2JzZXJ2ZXIuY29tcGxldGUgPSBub29wO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjb25zdCB1bnN1YiA9IHRoaXMudW5zdWJzY3JpYmVPbmUuYmluZCh0aGlzLCB0aGlzLm9ic2VydmVycy5sZW5ndGgpO1xyXG4gICAgICAgIC8vIEF0dGVtcHQgdG8gc3Vic2NyaWJlIHRvIGEgdGVybWluYXRlZCBPYnNlcnZhYmxlIC0gd2VcclxuICAgICAgICAvLyBqdXN0IHJlc3BvbmQgdG8gdGhlIE9ic2VydmVyIHdpdGggdGhlIGZpbmFsIGVycm9yIG9yIGNvbXBsZXRlXHJcbiAgICAgICAgLy8gZXZlbnQuXHJcbiAgICAgICAgaWYgKHRoaXMuZmluYWxpemVkKSB7XHJcbiAgICAgICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tZmxvYXRpbmctcHJvbWlzZXNcclxuICAgICAgICAgICAgdGhpcy50YXNrLnRoZW4oKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5maW5hbEVycm9yKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG9ic2VydmVyLmVycm9yKHRoaXMuZmluYWxFcnJvcik7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBvYnNlcnZlci5jb21wbGV0ZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGNhdGNoIChlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gbm90aGluZ1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5vYnNlcnZlcnMucHVzaChvYnNlcnZlcik7XHJcbiAgICAgICAgcmV0dXJuIHVuc3ViO1xyXG4gICAgfVxyXG4gICAgLy8gVW5zdWJzY3JpYmUgaXMgc3luY2hyb25vdXMgLSB3ZSBndWFyYW50ZWUgdGhhdCBubyBldmVudHMgYXJlIHNlbnQgdG9cclxuICAgIC8vIGFueSB1bnN1YnNjcmliZWQgT2JzZXJ2ZXIuXHJcbiAgICB1bnN1YnNjcmliZU9uZShpKSB7XHJcbiAgICAgICAgaWYgKHRoaXMub2JzZXJ2ZXJzID09PSB1bmRlZmluZWQgfHwgdGhpcy5vYnNlcnZlcnNbaV0gPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGRlbGV0ZSB0aGlzLm9ic2VydmVyc1tpXTtcclxuICAgICAgICB0aGlzLm9ic2VydmVyQ291bnQgLT0gMTtcclxuICAgICAgICBpZiAodGhpcy5vYnNlcnZlckNvdW50ID09PSAwICYmIHRoaXMub25Ob09ic2VydmVycyAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIHRoaXMub25Ob09ic2VydmVycyh0aGlzKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBmb3JFYWNoT2JzZXJ2ZXIoZm4pIHtcclxuICAgICAgICBpZiAodGhpcy5maW5hbGl6ZWQpIHtcclxuICAgICAgICAgICAgLy8gQWxyZWFkeSBjbG9zZWQgYnkgcHJldmlvdXMgZXZlbnQuLi4uanVzdCBlYXQgdGhlIGFkZGl0aW9uYWwgdmFsdWVzLlxyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIFNpbmNlIHNlbmRPbmUgY2FsbHMgYXN5bmNocm9ub3VzbHkgLSB0aGVyZSBpcyBubyBjaGFuY2UgdGhhdFxyXG4gICAgICAgIC8vIHRoaXMub2JzZXJ2ZXJzIHdpbGwgYmVjb21lIHVuZGVmaW5lZC5cclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMub2JzZXJ2ZXJzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIHRoaXMuc2VuZE9uZShpLCBmbik7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgLy8gQ2FsbCB0aGUgT2JzZXJ2ZXIgdmlhIG9uZSBvZiBpdCdzIGNhbGxiYWNrIGZ1bmN0aW9uLiBXZSBhcmUgY2FyZWZ1bCB0b1xyXG4gICAgLy8gY29uZmlybSB0aGF0IHRoZSBvYnNlcnZlIGhhcyBub3QgYmVlbiB1bnN1YnNjcmliZWQgc2luY2UgdGhpcyBhc3luY2hyb25vdXNcclxuICAgIC8vIGZ1bmN0aW9uIGhhZCBiZWVuIHF1ZXVlZC5cclxuICAgIHNlbmRPbmUoaSwgZm4pIHtcclxuICAgICAgICAvLyBFeGVjdXRlIHRoZSBjYWxsYmFjayBhc3luY2hyb25vdXNseVxyXG4gICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tZmxvYXRpbmctcHJvbWlzZXNcclxuICAgICAgICB0aGlzLnRhc2sudGhlbigoKSA9PiB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLm9ic2VydmVycyAhPT0gdW5kZWZpbmVkICYmIHRoaXMub2JzZXJ2ZXJzW2ldICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZm4odGhpcy5vYnNlcnZlcnNbaV0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgY2F0Y2ggKGUpIHtcclxuICAgICAgICAgICAgICAgICAgICAvLyBJZ25vcmUgZXhjZXB0aW9ucyByYWlzZWQgaW4gT2JzZXJ2ZXJzIG9yIG1pc3NpbmcgbWV0aG9kcyBvZiBhblxyXG4gICAgICAgICAgICAgICAgICAgIC8vIE9ic2VydmVyLlxyXG4gICAgICAgICAgICAgICAgICAgIC8vIExvZyBlcnJvciB0byBjb25zb2xlLiBiLzMxNDA0ODA2XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBjb25zb2xlICE9PSAndW5kZWZpbmVkJyAmJiBjb25zb2xlLmVycm9yKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICBjbG9zZShlcnIpIHtcclxuICAgICAgICBpZiAodGhpcy5maW5hbGl6ZWQpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmZpbmFsaXplZCA9IHRydWU7XHJcbiAgICAgICAgaWYgKGVyciAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZmluYWxFcnJvciA9IGVycjtcclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gUHJveHkgaXMgbm8gbG9uZ2VyIG5lZWRlZCAtIGdhcmJhZ2UgY29sbGVjdCByZWZlcmVuY2VzXHJcbiAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9uby1mbG9hdGluZy1wcm9taXNlc1xyXG4gICAgICAgIHRoaXMudGFzay50aGVuKCgpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5vYnNlcnZlcnMgPSB1bmRlZmluZWQ7XHJcbiAgICAgICAgICAgIHRoaXMub25Ob09ic2VydmVycyA9IHVuZGVmaW5lZDtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxufVxyXG4vKiogVHVybiBzeW5jaHJvbm91cyBmdW5jdGlvbiBpbnRvIG9uZSBjYWxsZWQgYXN5bmNocm9ub3VzbHkuICovXHJcbi8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvYmFuLXR5cGVzXHJcbmZ1bmN0aW9uIGFzeW5jKGZuLCBvbkVycm9yKSB7XHJcbiAgICByZXR1cm4gKC4uLmFyZ3MpID0+IHtcclxuICAgICAgICBQcm9taXNlLnJlc29sdmUodHJ1ZSlcclxuICAgICAgICAgICAgLnRoZW4oKCkgPT4ge1xyXG4gICAgICAgICAgICBmbiguLi5hcmdzKTtcclxuICAgICAgICB9KVxyXG4gICAgICAgICAgICAuY2F0Y2goKGVycm9yKSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChvbkVycm9yKSB7XHJcbiAgICAgICAgICAgICAgICBvbkVycm9yKGVycm9yKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfTtcclxufVxyXG4vKipcclxuICogUmV0dXJuIHRydWUgaWYgdGhlIG9iamVjdCBwYXNzZWQgaW4gaW1wbGVtZW50cyBhbnkgb2YgdGhlIG5hbWVkIG1ldGhvZHMuXHJcbiAqL1xyXG5mdW5jdGlvbiBpbXBsZW1lbnRzQW55TWV0aG9kcyhvYmosIG1ldGhvZHMpIHtcclxuICAgIGlmICh0eXBlb2Ygb2JqICE9PSAnb2JqZWN0JyB8fCBvYmogPT09IG51bGwpIHtcclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcbiAgICBmb3IgKGNvbnN0IG1ldGhvZCBvZiBtZXRob2RzKSB7XHJcbiAgICAgICAgaWYgKG1ldGhvZCBpbiBvYmogJiYgdHlwZW9mIG9ialttZXRob2RdID09PSAnZnVuY3Rpb24nKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiBmYWxzZTtcclxufVxyXG5mdW5jdGlvbiBub29wKCkge1xyXG4gICAgLy8gZG8gbm90aGluZ1xyXG59XG5cbi8qKlxyXG4gKiBAbGljZW5zZVxyXG4gKiBDb3B5cmlnaHQgMjAxNyBHb29nbGUgTExDXHJcbiAqXHJcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XHJcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cclxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XHJcbiAqXHJcbiAqICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXHJcbiAqXHJcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcclxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxyXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cclxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxyXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cclxuICovXHJcbi8qKlxyXG4gKiBDaGVjayB0byBtYWtlIHN1cmUgdGhlIGFwcHJvcHJpYXRlIG51bWJlciBvZiBhcmd1bWVudHMgYXJlIHByb3ZpZGVkIGZvciBhIHB1YmxpYyBmdW5jdGlvbi5cclxuICogVGhyb3dzIGFuIGVycm9yIGlmIGl0IGZhaWxzLlxyXG4gKlxyXG4gKiBAcGFyYW0gZm5OYW1lIFRoZSBmdW5jdGlvbiBuYW1lXHJcbiAqIEBwYXJhbSBtaW5Db3VudCBUaGUgbWluaW11bSBudW1iZXIgb2YgYXJndW1lbnRzIHRvIGFsbG93IGZvciB0aGUgZnVuY3Rpb24gY2FsbFxyXG4gKiBAcGFyYW0gbWF4Q291bnQgVGhlIG1heGltdW0gbnVtYmVyIG9mIGFyZ3VtZW50IHRvIGFsbG93IGZvciB0aGUgZnVuY3Rpb24gY2FsbFxyXG4gKiBAcGFyYW0gYXJnQ291bnQgVGhlIGFjdHVhbCBudW1iZXIgb2YgYXJndW1lbnRzIHByb3ZpZGVkLlxyXG4gKi9cclxuY29uc3QgdmFsaWRhdGVBcmdDb3VudCA9IGZ1bmN0aW9uIChmbk5hbWUsIG1pbkNvdW50LCBtYXhDb3VudCwgYXJnQ291bnQpIHtcclxuICAgIGxldCBhcmdFcnJvcjtcclxuICAgIGlmIChhcmdDb3VudCA8IG1pbkNvdW50KSB7XHJcbiAgICAgICAgYXJnRXJyb3IgPSAnYXQgbGVhc3QgJyArIG1pbkNvdW50O1xyXG4gICAgfVxyXG4gICAgZWxzZSBpZiAoYXJnQ291bnQgPiBtYXhDb3VudCkge1xyXG4gICAgICAgIGFyZ0Vycm9yID0gbWF4Q291bnQgPT09IDAgPyAnbm9uZScgOiAnbm8gbW9yZSB0aGFuICcgKyBtYXhDb3VudDtcclxuICAgIH1cclxuICAgIGlmIChhcmdFcnJvcikge1xyXG4gICAgICAgIGNvbnN0IGVycm9yID0gZm5OYW1lICtcclxuICAgICAgICAgICAgJyBmYWlsZWQ6IFdhcyBjYWxsZWQgd2l0aCAnICtcclxuICAgICAgICAgICAgYXJnQ291bnQgK1xyXG4gICAgICAgICAgICAoYXJnQ291bnQgPT09IDEgPyAnIGFyZ3VtZW50LicgOiAnIGFyZ3VtZW50cy4nKSArXHJcbiAgICAgICAgICAgICcgRXhwZWN0cyAnICtcclxuICAgICAgICAgICAgYXJnRXJyb3IgK1xyXG4gICAgICAgICAgICAnLic7XHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGVycm9yKTtcclxuICAgIH1cclxufTtcclxuLyoqXHJcbiAqIEdlbmVyYXRlcyBhIHN0cmluZyB0byBwcmVmaXggYW4gZXJyb3IgbWVzc2FnZSBhYm91dCBmYWlsZWQgYXJndW1lbnQgdmFsaWRhdGlvblxyXG4gKlxyXG4gKiBAcGFyYW0gZm5OYW1lIFRoZSBmdW5jdGlvbiBuYW1lXHJcbiAqIEBwYXJhbSBhcmdOYW1lIFRoZSBuYW1lIG9mIHRoZSBhcmd1bWVudFxyXG4gKiBAcmV0dXJuIFRoZSBwcmVmaXggdG8gYWRkIHRvIHRoZSBlcnJvciB0aHJvd24gZm9yIHZhbGlkYXRpb24uXHJcbiAqL1xyXG5mdW5jdGlvbiBlcnJvclByZWZpeChmbk5hbWUsIGFyZ05hbWUpIHtcclxuICAgIHJldHVybiBgJHtmbk5hbWV9IGZhaWxlZDogJHthcmdOYW1lfSBhcmd1bWVudCBgO1xyXG59XHJcbi8qKlxyXG4gKiBAcGFyYW0gZm5OYW1lXHJcbiAqIEBwYXJhbSBhcmd1bWVudE51bWJlclxyXG4gKiBAcGFyYW0gbmFtZXNwYWNlXHJcbiAqIEBwYXJhbSBvcHRpb25hbFxyXG4gKi9cclxuZnVuY3Rpb24gdmFsaWRhdGVOYW1lc3BhY2UoZm5OYW1lLCBuYW1lc3BhY2UsIG9wdGlvbmFsKSB7XHJcbiAgICBpZiAob3B0aW9uYWwgJiYgIW5hbWVzcGFjZSkge1xyXG4gICAgICAgIHJldHVybjtcclxuICAgIH1cclxuICAgIGlmICh0eXBlb2YgbmFtZXNwYWNlICE9PSAnc3RyaW5nJykge1xyXG4gICAgICAgIC8vVE9ETzogSSBzaG91bGQgZG8gbW9yZSB2YWxpZGF0aW9uIGhlcmUuIFdlIG9ubHkgYWxsb3cgY2VydGFpbiBjaGFycyBpbiBuYW1lc3BhY2VzLlxyXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihlcnJvclByZWZpeChmbk5hbWUsICduYW1lc3BhY2UnKSArICdtdXN0IGJlIGEgdmFsaWQgZmlyZWJhc2UgbmFtZXNwYWNlLicpO1xyXG4gICAgfVxyXG59XHJcbmZ1bmN0aW9uIHZhbGlkYXRlQ2FsbGJhY2soZm5OYW1lLCBhcmd1bWVudE5hbWUsIFxyXG4vLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L2Jhbi10eXBlc1xyXG5jYWxsYmFjaywgb3B0aW9uYWwpIHtcclxuICAgIGlmIChvcHRpb25hbCAmJiAhY2FsbGJhY2spIHtcclxuICAgICAgICByZXR1cm47XHJcbiAgICB9XHJcbiAgICBpZiAodHlwZW9mIGNhbGxiYWNrICE9PSAnZnVuY3Rpb24nKSB7XHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGVycm9yUHJlZml4KGZuTmFtZSwgYXJndW1lbnROYW1lKSArICdtdXN0IGJlIGEgdmFsaWQgZnVuY3Rpb24uJyk7XHJcbiAgICB9XHJcbn1cclxuZnVuY3Rpb24gdmFsaWRhdGVDb250ZXh0T2JqZWN0KGZuTmFtZSwgYXJndW1lbnROYW1lLCBjb250ZXh0LCBvcHRpb25hbCkge1xyXG4gICAgaWYgKG9wdGlvbmFsICYmICFjb250ZXh0KSB7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG4gICAgaWYgKHR5cGVvZiBjb250ZXh0ICE9PSAnb2JqZWN0JyB8fCBjb250ZXh0ID09PSBudWxsKSB7XHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGVycm9yUHJlZml4KGZuTmFtZSwgYXJndW1lbnROYW1lKSArICdtdXN0IGJlIGEgdmFsaWQgY29udGV4dCBvYmplY3QuJyk7XHJcbiAgICB9XHJcbn1cblxuLyoqXHJcbiAqIEBsaWNlbnNlXHJcbiAqIENvcHlyaWdodCAyMDE3IEdvb2dsZSBMTENcclxuICpcclxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcclxuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxyXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcclxuICpcclxuICogICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcclxuICpcclxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxyXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXHJcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxyXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXHJcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxyXG4gKi9cclxuLy8gQ29kZSBvcmlnaW5hbGx5IGNhbWUgZnJvbSBnb29nLmNyeXB0LnN0cmluZ1RvVXRmOEJ5dGVBcnJheSwgYnV0IGZvciBzb21lIHJlYXNvbiB0aGV5XHJcbi8vIGF1dG9tYXRpY2FsbHkgcmVwbGFjZWQgJ1xcclxcbicgd2l0aCAnXFxuJywgYW5kIHRoZXkgZGlkbid0IGhhbmRsZSBzdXJyb2dhdGUgcGFpcnMsXHJcbi8vIHNvIGl0J3MgYmVlbiBtb2RpZmllZC5cclxuLy8gTm90ZSB0aGF0IG5vdCBhbGwgVW5pY29kZSBjaGFyYWN0ZXJzIGFwcGVhciBhcyBzaW5nbGUgY2hhcmFjdGVycyBpbiBKYXZhU2NyaXB0IHN0cmluZ3MuXHJcbi8vIGZyb21DaGFyQ29kZSByZXR1cm5zIHRoZSBVVEYtMTYgZW5jb2Rpbmcgb2YgYSBjaGFyYWN0ZXIgLSBzbyBzb21lIFVuaWNvZGUgY2hhcmFjdGVyc1xyXG4vLyB1c2UgMiBjaGFyYWN0ZXJzIGluIEphdmFzY3JpcHQuICBBbGwgNC1ieXRlIFVURi04IGNoYXJhY3RlcnMgYmVnaW4gd2l0aCBhIGZpcnN0XHJcbi8vIGNoYXJhY3RlciBpbiB0aGUgcmFuZ2UgMHhEODAwIC0gMHhEQkZGICh0aGUgZmlyc3QgY2hhcmFjdGVyIG9mIGEgc28tY2FsbGVkIHN1cnJvZ2F0ZVxyXG4vLyBwYWlyKS5cclxuLy8gU2VlIGh0dHA6Ly93d3cuZWNtYS1pbnRlcm5hdGlvbmFsLm9yZy9lY21hLTI2Mi81LjEvI3NlYy0xNS4xLjNcclxuLyoqXHJcbiAqIEBwYXJhbSB7c3RyaW5nfSBzdHJcclxuICogQHJldHVybiB7QXJyYXl9XHJcbiAqL1xyXG5jb25zdCBzdHJpbmdUb0J5dGVBcnJheSA9IGZ1bmN0aW9uIChzdHIpIHtcclxuICAgIGNvbnN0IG91dCA9IFtdO1xyXG4gICAgbGV0IHAgPSAwO1xyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzdHIubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBsZXQgYyA9IHN0ci5jaGFyQ29kZUF0KGkpO1xyXG4gICAgICAgIC8vIElzIHRoaXMgdGhlIGxlYWQgc3Vycm9nYXRlIGluIGEgc3Vycm9nYXRlIHBhaXI/XHJcbiAgICAgICAgaWYgKGMgPj0gMHhkODAwICYmIGMgPD0gMHhkYmZmKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGhpZ2ggPSBjIC0gMHhkODAwOyAvLyB0aGUgaGlnaCAxMCBiaXRzLlxyXG4gICAgICAgICAgICBpKys7XHJcbiAgICAgICAgICAgIGFzc2VydChpIDwgc3RyLmxlbmd0aCwgJ1N1cnJvZ2F0ZSBwYWlyIG1pc3NpbmcgdHJhaWwgc3Vycm9nYXRlLicpO1xyXG4gICAgICAgICAgICBjb25zdCBsb3cgPSBzdHIuY2hhckNvZGVBdChpKSAtIDB4ZGMwMDsgLy8gdGhlIGxvdyAxMCBiaXRzLlxyXG4gICAgICAgICAgICBjID0gMHgxMDAwMCArIChoaWdoIDw8IDEwKSArIGxvdztcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKGMgPCAxMjgpIHtcclxuICAgICAgICAgICAgb3V0W3ArK10gPSBjO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmIChjIDwgMjA0OCkge1xyXG4gICAgICAgICAgICBvdXRbcCsrXSA9IChjID4+IDYpIHwgMTkyO1xyXG4gICAgICAgICAgICBvdXRbcCsrXSA9IChjICYgNjMpIHwgMTI4O1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmIChjIDwgNjU1MzYpIHtcclxuICAgICAgICAgICAgb3V0W3ArK10gPSAoYyA+PiAxMikgfCAyMjQ7XHJcbiAgICAgICAgICAgIG91dFtwKytdID0gKChjID4+IDYpICYgNjMpIHwgMTI4O1xyXG4gICAgICAgICAgICBvdXRbcCsrXSA9IChjICYgNjMpIHwgMTI4O1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgb3V0W3ArK10gPSAoYyA+PiAxOCkgfCAyNDA7XHJcbiAgICAgICAgICAgIG91dFtwKytdID0gKChjID4+IDEyKSAmIDYzKSB8IDEyODtcclxuICAgICAgICAgICAgb3V0W3ArK10gPSAoKGMgPj4gNikgJiA2MykgfCAxMjg7XHJcbiAgICAgICAgICAgIG91dFtwKytdID0gKGMgJiA2MykgfCAxMjg7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIG91dDtcclxufTtcclxuLyoqXHJcbiAqIENhbGN1bGF0ZSBsZW5ndGggd2l0aG91dCBhY3R1YWxseSBjb252ZXJ0aW5nOyB1c2VmdWwgZm9yIGRvaW5nIGNoZWFwZXIgdmFsaWRhdGlvbi5cclxuICogQHBhcmFtIHtzdHJpbmd9IHN0clxyXG4gKiBAcmV0dXJuIHtudW1iZXJ9XHJcbiAqL1xyXG5jb25zdCBzdHJpbmdMZW5ndGggPSBmdW5jdGlvbiAoc3RyKSB7XHJcbiAgICBsZXQgcCA9IDA7XHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHN0ci5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIGNvbnN0IGMgPSBzdHIuY2hhckNvZGVBdChpKTtcclxuICAgICAgICBpZiAoYyA8IDEyOCkge1xyXG4gICAgICAgICAgICBwKys7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKGMgPCAyMDQ4KSB7XHJcbiAgICAgICAgICAgIHAgKz0gMjtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAoYyA+PSAweGQ4MDAgJiYgYyA8PSAweGRiZmYpIHtcclxuICAgICAgICAgICAgLy8gTGVhZCBzdXJyb2dhdGUgb2YgYSBzdXJyb2dhdGUgcGFpci4gIFRoZSBwYWlyIHRvZ2V0aGVyIHdpbGwgdGFrZSA0IGJ5dGVzIHRvIHJlcHJlc2VudC5cclxuICAgICAgICAgICAgcCArPSA0O1xyXG4gICAgICAgICAgICBpKys7IC8vIHNraXAgdHJhaWwgc3Vycm9nYXRlLlxyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgcCArPSAzO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiBwO1xyXG59O1xuXG4vKipcclxuICogQGxpY2Vuc2VcclxuICogQ29weXJpZ2h0IDIwMjIgR29vZ2xlIExMQ1xyXG4gKlxyXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xyXG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXHJcbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxyXG4gKlxyXG4gKiAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxyXG4gKlxyXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXHJcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcclxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXHJcbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcclxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXHJcbiAqL1xyXG4vKipcclxuICogQ29waWVkIGZyb20gaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9hLzIxMTc1MjNcclxuICogR2VuZXJhdGVzIGEgbmV3IHV1aWQuXHJcbiAqIEBwdWJsaWNcclxuICovXHJcbmNvbnN0IHV1aWR2NCA9IGZ1bmN0aW9uICgpIHtcclxuICAgIHJldHVybiAneHh4eHh4eHgteHh4eC00eHh4LXl4eHgteHh4eHh4eHh4eHh4Jy5yZXBsYWNlKC9beHldL2csIGMgPT4ge1xyXG4gICAgICAgIGNvbnN0IHIgPSAoTWF0aC5yYW5kb20oKSAqIDE2KSB8IDAsIHYgPSBjID09PSAneCcgPyByIDogKHIgJiAweDMpIHwgMHg4O1xyXG4gICAgICAgIHJldHVybiB2LnRvU3RyaW5nKDE2KTtcclxuICAgIH0pO1xyXG59O1xuXG4vKipcclxuICogQGxpY2Vuc2VcclxuICogQ29weXJpZ2h0IDIwMTkgR29vZ2xlIExMQ1xyXG4gKlxyXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xyXG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXHJcbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxyXG4gKlxyXG4gKiAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxyXG4gKlxyXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXHJcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcclxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXHJcbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcclxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXHJcbiAqL1xyXG4vKipcclxuICogVGhlIGFtb3VudCBvZiBtaWxsaXNlY29uZHMgdG8gZXhwb25lbnRpYWxseSBpbmNyZWFzZS5cclxuICovXHJcbmNvbnN0IERFRkFVTFRfSU5URVJWQUxfTUlMTElTID0gMTAwMDtcclxuLyoqXHJcbiAqIFRoZSBmYWN0b3IgdG8gYmFja29mZiBieS5cclxuICogU2hvdWxkIGJlIGEgbnVtYmVyIGdyZWF0ZXIgdGhhbiAxLlxyXG4gKi9cclxuY29uc3QgREVGQVVMVF9CQUNLT0ZGX0ZBQ1RPUiA9IDI7XHJcbi8qKlxyXG4gKiBUaGUgbWF4aW11bSBtaWxsaXNlY29uZHMgdG8gaW5jcmVhc2UgdG8uXHJcbiAqXHJcbiAqIDxwPlZpc2libGUgZm9yIHRlc3RpbmdcclxuICovXHJcbmNvbnN0IE1BWF9WQUxVRV9NSUxMSVMgPSA0ICogNjAgKiA2MCAqIDEwMDA7IC8vIEZvdXIgaG91cnMsIGxpa2UgaU9TIGFuZCBBbmRyb2lkLlxyXG4vKipcclxuICogVGhlIHBlcmNlbnRhZ2Ugb2YgYmFja29mZiB0aW1lIHRvIHJhbmRvbWl6ZSBieS5cclxuICogU2VlXHJcbiAqIGh0dHA6Ly9nby9zYWZlLWNsaWVudC1iZWhhdmlvciNzdGVwLTEtZGV0ZXJtaW5lLXRoZS1hcHByb3ByaWF0ZS1yZXRyeS1pbnRlcnZhbC10by1oYW5kbGUtc3Bpa2UtdHJhZmZpY1xyXG4gKiBmb3IgY29udGV4dC5cclxuICpcclxuICogPHA+VmlzaWJsZSBmb3IgdGVzdGluZ1xyXG4gKi9cclxuY29uc3QgUkFORE9NX0ZBQ1RPUiA9IDAuNTtcclxuLyoqXHJcbiAqIEJhc2VkIG9uIHRoZSBiYWNrb2ZmIG1ldGhvZCBmcm9tXHJcbiAqIGh0dHBzOi8vZ2l0aHViLmNvbS9nb29nbGUvY2xvc3VyZS1saWJyYXJ5L2Jsb2IvbWFzdGVyL2Nsb3N1cmUvZ29vZy9tYXRoL2V4cG9uZW50aWFsYmFja29mZi5qcy5cclxuICogRXh0cmFjdGVkIGhlcmUgc28gd2UgZG9uJ3QgbmVlZCB0byBwYXNzIG1ldGFkYXRhIGFuZCBhIHN0YXRlZnVsIEV4cG9uZW50aWFsQmFja29mZiBvYmplY3QgYXJvdW5kLlxyXG4gKi9cclxuZnVuY3Rpb24gY2FsY3VsYXRlQmFja29mZk1pbGxpcyhiYWNrb2ZmQ291bnQsIGludGVydmFsTWlsbGlzID0gREVGQVVMVF9JTlRFUlZBTF9NSUxMSVMsIGJhY2tvZmZGYWN0b3IgPSBERUZBVUxUX0JBQ0tPRkZfRkFDVE9SKSB7XHJcbiAgICAvLyBDYWxjdWxhdGVzIGFuIGV4cG9uZW50aWFsbHkgaW5jcmVhc2luZyB2YWx1ZS5cclxuICAgIC8vIERldmlhdGlvbjogY2FsY3VsYXRlcyB2YWx1ZSBmcm9tIGNvdW50IGFuZCBhIGNvbnN0YW50IGludGVydmFsLCBzbyB3ZSBvbmx5IG5lZWQgdG8gc2F2ZSB2YWx1ZVxyXG4gICAgLy8gYW5kIGNvdW50IHRvIHJlc3RvcmUgc3RhdGUuXHJcbiAgICBjb25zdCBjdXJyQmFzZVZhbHVlID0gaW50ZXJ2YWxNaWxsaXMgKiBNYXRoLnBvdyhiYWNrb2ZmRmFjdG9yLCBiYWNrb2ZmQ291bnQpO1xyXG4gICAgLy8gQSByYW5kb20gXCJmdXp6XCIgdG8gYXZvaWQgd2F2ZXMgb2YgcmV0cmllcy5cclxuICAgIC8vIERldmlhdGlvbjogcmFuZG9tRmFjdG9yIGlzIHJlcXVpcmVkLlxyXG4gICAgY29uc3QgcmFuZG9tV2FpdCA9IE1hdGgucm91bmQoXHJcbiAgICAvLyBBIGZyYWN0aW9uIG9mIHRoZSBiYWNrb2ZmIHZhbHVlIHRvIGFkZC9zdWJ0cmFjdC5cclxuICAgIC8vIERldmlhdGlvbjogY2hhbmdlcyBtdWx0aXBsaWNhdGlvbiBvcmRlciB0byBpbXByb3ZlIHJlYWRhYmlsaXR5LlxyXG4gICAgUkFORE9NX0ZBQ1RPUiAqXHJcbiAgICAgICAgY3VyckJhc2VWYWx1ZSAqXHJcbiAgICAgICAgLy8gQSByYW5kb20gZmxvYXQgKHJvdW5kZWQgdG8gaW50IGJ5IE1hdGgucm91bmQgYWJvdmUpIGluIHRoZSByYW5nZSBbLTEsIDFdLiBEZXRlcm1pbmVzXHJcbiAgICAgICAgLy8gaWYgd2UgYWRkIG9yIHN1YnRyYWN0LlxyXG4gICAgICAgIChNYXRoLnJhbmRvbSgpIC0gMC41KSAqXHJcbiAgICAgICAgMik7XHJcbiAgICAvLyBMaW1pdHMgYmFja29mZiB0byBtYXggdG8gYXZvaWQgZWZmZWN0aXZlbHkgcGVybWFuZW50IGJhY2tvZmYuXHJcbiAgICByZXR1cm4gTWF0aC5taW4oTUFYX1ZBTFVFX01JTExJUywgY3VyckJhc2VWYWx1ZSArIHJhbmRvbVdhaXQpO1xyXG59XG5cbi8qKlxyXG4gKiBAbGljZW5zZVxyXG4gKiBDb3B5cmlnaHQgMjAyMCBHb29nbGUgTExDXHJcbiAqXHJcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XHJcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cclxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XHJcbiAqXHJcbiAqICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXHJcbiAqXHJcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcclxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxyXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cclxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxyXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cclxuICovXHJcbi8qKlxyXG4gKiBQcm92aWRlIEVuZ2xpc2ggb3JkaW5hbCBsZXR0ZXJzIGFmdGVyIGEgbnVtYmVyXHJcbiAqL1xyXG5mdW5jdGlvbiBvcmRpbmFsKGkpIHtcclxuICAgIGlmICghTnVtYmVyLmlzRmluaXRlKGkpKSB7XHJcbiAgICAgICAgcmV0dXJuIGAke2l9YDtcclxuICAgIH1cclxuICAgIHJldHVybiBpICsgaW5kaWNhdG9yKGkpO1xyXG59XHJcbmZ1bmN0aW9uIGluZGljYXRvcihpKSB7XHJcbiAgICBpID0gTWF0aC5hYnMoaSk7XHJcbiAgICBjb25zdCBjZW50ID0gaSAlIDEwMDtcclxuICAgIGlmIChjZW50ID49IDEwICYmIGNlbnQgPD0gMjApIHtcclxuICAgICAgICByZXR1cm4gJ3RoJztcclxuICAgIH1cclxuICAgIGNvbnN0IGRlYyA9IGkgJSAxMDtcclxuICAgIGlmIChkZWMgPT09IDEpIHtcclxuICAgICAgICByZXR1cm4gJ3N0JztcclxuICAgIH1cclxuICAgIGlmIChkZWMgPT09IDIpIHtcclxuICAgICAgICByZXR1cm4gJ25kJztcclxuICAgIH1cclxuICAgIGlmIChkZWMgPT09IDMpIHtcclxuICAgICAgICByZXR1cm4gJ3JkJztcclxuICAgIH1cclxuICAgIHJldHVybiAndGgnO1xyXG59XG5cbi8qKlxyXG4gKiBAbGljZW5zZVxyXG4gKiBDb3B5cmlnaHQgMjAyMSBHb29nbGUgTExDXHJcbiAqXHJcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XHJcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cclxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XHJcbiAqXHJcbiAqICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXHJcbiAqXHJcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcclxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxyXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cclxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxyXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cclxuICovXHJcbmZ1bmN0aW9uIGdldE1vZHVsYXJJbnN0YW5jZShzZXJ2aWNlKSB7XHJcbiAgICBpZiAoc2VydmljZSAmJiBzZXJ2aWNlLl9kZWxlZ2F0ZSkge1xyXG4gICAgICAgIHJldHVybiBzZXJ2aWNlLl9kZWxlZ2F0ZTtcclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICAgIHJldHVybiBzZXJ2aWNlO1xyXG4gICAgfVxyXG59XG5cbmV4cG9ydCB7IENPTlNUQU5UUywgRGVjb2RlQmFzZTY0U3RyaW5nRXJyb3IsIERlZmVycmVkLCBFcnJvckZhY3RvcnksIEZpcmViYXNlRXJyb3IsIE1BWF9WQUxVRV9NSUxMSVMsIFJBTkRPTV9GQUNUT1IsIFNoYTEsIGFyZUNvb2tpZXNFbmFibGVkLCBhc3NlcnQsIGFzc2VydGlvbkVycm9yLCBhc3luYywgYmFzZTY0LCBiYXNlNjREZWNvZGUsIGJhc2U2NEVuY29kZSwgYmFzZTY0dXJsRW5jb2RlV2l0aG91dFBhZGRpbmcsIGNhbGN1bGF0ZUJhY2tvZmZNaWxsaXMsIGNvbnRhaW5zLCBjcmVhdGVNb2NrVXNlclRva2VuLCBjcmVhdGVTdWJzY3JpYmUsIGRlY29kZSwgZGVlcENvcHksIGRlZXBFcXVhbCwgZGVlcEV4dGVuZCwgZXJyb3JQcmVmaXgsIGV4dHJhY3RRdWVyeXN0cmluZywgZ2V0RGVmYXVsdEFwcENvbmZpZywgZ2V0RGVmYXVsdEVtdWxhdG9ySG9zdCwgZ2V0RGVmYXVsdEVtdWxhdG9ySG9zdG5hbWVBbmRQb3J0LCBnZXREZWZhdWx0cywgZ2V0RXhwZXJpbWVudGFsU2V0dGluZywgZ2V0R2xvYmFsLCBnZXRNb2R1bGFySW5zdGFuY2UsIGdldFVBLCBpc0FkbWluLCBpc0Jyb3dzZXIsIGlzQnJvd3NlckV4dGVuc2lvbiwgaXNFbGVjdHJvbiwgaXNFbXB0eSwgaXNJRSwgaXNJbmRleGVkREJBdmFpbGFibGUsIGlzTW9iaWxlQ29yZG92YSwgaXNOb2RlLCBpc05vZGVTZGssIGlzUmVhY3ROYXRpdmUsIGlzU2FmYXJpLCBpc1VXUCwgaXNWYWxpZEZvcm1hdCwgaXNWYWxpZFRpbWVzdGFtcCwgaXNXZWJXb3JrZXIsIGlzc3VlZEF0VGltZSwganNvbkV2YWwsIG1hcCwgb3JkaW5hbCwgcHJvbWlzZVdpdGhUaW1lb3V0LCBxdWVyeXN0cmluZywgcXVlcnlzdHJpbmdEZWNvZGUsIHNhZmVHZXQsIHN0cmluZ0xlbmd0aCwgc3RyaW5nVG9CeXRlQXJyYXksIHN0cmluZ2lmeSwgdXVpZHY0LCB2YWxpZGF0ZUFyZ0NvdW50LCB2YWxpZGF0ZUNhbGxiYWNrLCB2YWxpZGF0ZUNvbnRleHRPYmplY3QsIHZhbGlkYXRlSW5kZXhlZERCT3BlbmFibGUsIHZhbGlkYXRlTmFtZXNwYWNlIH07XG4vLyMgc291cmNlTWFwcGluZ1VSTD1pbmRleC5lc20yMDE3LmpzLm1hcFxuIiwiaW1wb3J0IHsgRGVmZXJyZWQgfSBmcm9tICdAZmlyZWJhc2UvdXRpbCc7XG5cbi8qKlxyXG4gKiBDb21wb25lbnQgZm9yIHNlcnZpY2UgbmFtZSBULCBlLmcuIGBhdXRoYCwgYGF1dGgtaW50ZXJuYWxgXHJcbiAqL1xyXG5jbGFzcyBDb21wb25lbnQge1xyXG4gICAgLyoqXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIG5hbWUgVGhlIHB1YmxpYyBzZXJ2aWNlIG5hbWUsIGUuZy4gYXBwLCBhdXRoLCBmaXJlc3RvcmUsIGRhdGFiYXNlXHJcbiAgICAgKiBAcGFyYW0gaW5zdGFuY2VGYWN0b3J5IFNlcnZpY2UgZmFjdG9yeSByZXNwb25zaWJsZSBmb3IgY3JlYXRpbmcgdGhlIHB1YmxpYyBpbnRlcmZhY2VcclxuICAgICAqIEBwYXJhbSB0eXBlIHdoZXRoZXIgdGhlIHNlcnZpY2UgcHJvdmlkZWQgYnkgdGhlIGNvbXBvbmVudCBpcyBwdWJsaWMgb3IgcHJpdmF0ZVxyXG4gICAgICovXHJcbiAgICBjb25zdHJ1Y3RvcihuYW1lLCBpbnN0YW5jZUZhY3RvcnksIHR5cGUpIHtcclxuICAgICAgICB0aGlzLm5hbWUgPSBuYW1lO1xyXG4gICAgICAgIHRoaXMuaW5zdGFuY2VGYWN0b3J5ID0gaW5zdGFuY2VGYWN0b3J5O1xyXG4gICAgICAgIHRoaXMudHlwZSA9IHR5cGU7XHJcbiAgICAgICAgdGhpcy5tdWx0aXBsZUluc3RhbmNlcyA9IGZhbHNlO1xyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIFByb3BlcnRpZXMgdG8gYmUgYWRkZWQgdG8gdGhlIHNlcnZpY2UgbmFtZXNwYWNlXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgdGhpcy5zZXJ2aWNlUHJvcHMgPSB7fTtcclxuICAgICAgICB0aGlzLmluc3RhbnRpYXRpb25Nb2RlID0gXCJMQVpZXCIgLyogSW5zdGFudGlhdGlvbk1vZGUuTEFaWSAqLztcclxuICAgICAgICB0aGlzLm9uSW5zdGFuY2VDcmVhdGVkID0gbnVsbDtcclxuICAgIH1cclxuICAgIHNldEluc3RhbnRpYXRpb25Nb2RlKG1vZGUpIHtcclxuICAgICAgICB0aGlzLmluc3RhbnRpYXRpb25Nb2RlID0gbW9kZTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuICAgIHNldE11bHRpcGxlSW5zdGFuY2VzKG11bHRpcGxlSW5zdGFuY2VzKSB7XHJcbiAgICAgICAgdGhpcy5tdWx0aXBsZUluc3RhbmNlcyA9IG11bHRpcGxlSW5zdGFuY2VzO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG4gICAgc2V0U2VydmljZVByb3BzKHByb3BzKSB7XHJcbiAgICAgICAgdGhpcy5zZXJ2aWNlUHJvcHMgPSBwcm9wcztcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuICAgIHNldEluc3RhbmNlQ3JlYXRlZENhbGxiYWNrKGNhbGxiYWNrKSB7XHJcbiAgICAgICAgdGhpcy5vbkluc3RhbmNlQ3JlYXRlZCA9IGNhbGxiYWNrO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG59XG5cbi8qKlxyXG4gKiBAbGljZW5zZVxyXG4gKiBDb3B5cmlnaHQgMjAxOSBHb29nbGUgTExDXHJcbiAqXHJcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XHJcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cclxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XHJcbiAqXHJcbiAqICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXHJcbiAqXHJcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcclxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxyXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cclxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxyXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cclxuICovXHJcbmNvbnN0IERFRkFVTFRfRU5UUllfTkFNRSA9ICdbREVGQVVMVF0nO1xuXG4vKipcclxuICogQGxpY2Vuc2VcclxuICogQ29weXJpZ2h0IDIwMTkgR29vZ2xlIExMQ1xyXG4gKlxyXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xyXG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXHJcbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxyXG4gKlxyXG4gKiAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxyXG4gKlxyXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXHJcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcclxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXHJcbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcclxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXHJcbiAqL1xyXG4vKipcclxuICogUHJvdmlkZXIgZm9yIGluc3RhbmNlIGZvciBzZXJ2aWNlIG5hbWUgVCwgZS5nLiAnYXV0aCcsICdhdXRoLWludGVybmFsJ1xyXG4gKiBOYW1lU2VydmljZU1hcHBpbmdbVF0gaXMgYW4gYWxpYXMgZm9yIHRoZSB0eXBlIG9mIHRoZSBpbnN0YW5jZVxyXG4gKi9cclxuY2xhc3MgUHJvdmlkZXIge1xyXG4gICAgY29uc3RydWN0b3IobmFtZSwgY29udGFpbmVyKSB7XHJcbiAgICAgICAgdGhpcy5uYW1lID0gbmFtZTtcclxuICAgICAgICB0aGlzLmNvbnRhaW5lciA9IGNvbnRhaW5lcjtcclxuICAgICAgICB0aGlzLmNvbXBvbmVudCA9IG51bGw7XHJcbiAgICAgICAgdGhpcy5pbnN0YW5jZXMgPSBuZXcgTWFwKCk7XHJcbiAgICAgICAgdGhpcy5pbnN0YW5jZXNEZWZlcnJlZCA9IG5ldyBNYXAoKTtcclxuICAgICAgICB0aGlzLmluc3RhbmNlc09wdGlvbnMgPSBuZXcgTWFwKCk7XHJcbiAgICAgICAgdGhpcy5vbkluaXRDYWxsYmFja3MgPSBuZXcgTWFwKCk7XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIEBwYXJhbSBpZGVudGlmaWVyIEEgcHJvdmlkZXIgY2FuIHByb3ZpZGUgbXVsaXRwbGUgaW5zdGFuY2VzIG9mIGEgc2VydmljZVxyXG4gICAgICogaWYgdGhpcy5jb21wb25lbnQubXVsdGlwbGVJbnN0YW5jZXMgaXMgdHJ1ZS5cclxuICAgICAqL1xyXG4gICAgZ2V0KGlkZW50aWZpZXIpIHtcclxuICAgICAgICAvLyBpZiBtdWx0aXBsZUluc3RhbmNlcyBpcyBub3Qgc3VwcG9ydGVkLCB1c2UgdGhlIGRlZmF1bHQgbmFtZVxyXG4gICAgICAgIGNvbnN0IG5vcm1hbGl6ZWRJZGVudGlmaWVyID0gdGhpcy5ub3JtYWxpemVJbnN0YW5jZUlkZW50aWZpZXIoaWRlbnRpZmllcik7XHJcbiAgICAgICAgaWYgKCF0aGlzLmluc3RhbmNlc0RlZmVycmVkLmhhcyhub3JtYWxpemVkSWRlbnRpZmllcikpIHtcclxuICAgICAgICAgICAgY29uc3QgZGVmZXJyZWQgPSBuZXcgRGVmZXJyZWQoKTtcclxuICAgICAgICAgICAgdGhpcy5pbnN0YW5jZXNEZWZlcnJlZC5zZXQobm9ybWFsaXplZElkZW50aWZpZXIsIGRlZmVycmVkKTtcclxuICAgICAgICAgICAgaWYgKHRoaXMuaXNJbml0aWFsaXplZChub3JtYWxpemVkSWRlbnRpZmllcikgfHxcclxuICAgICAgICAgICAgICAgIHRoaXMuc2hvdWxkQXV0b0luaXRpYWxpemUoKSkge1xyXG4gICAgICAgICAgICAgICAgLy8gaW5pdGlhbGl6ZSB0aGUgc2VydmljZSBpZiBpdCBjYW4gYmUgYXV0by1pbml0aWFsaXplZFxyXG4gICAgICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBpbnN0YW5jZSA9IHRoaXMuZ2V0T3JJbml0aWFsaXplU2VydmljZSh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGluc3RhbmNlSWRlbnRpZmllcjogbm9ybWFsaXplZElkZW50aWZpZXJcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoaW5zdGFuY2UpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGVmZXJyZWQucmVzb2x2ZShpbnN0YW5jZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgY2F0Y2ggKGUpIHtcclxuICAgICAgICAgICAgICAgICAgICAvLyB3aGVuIHRoZSBpbnN0YW5jZSBmYWN0b3J5IHRocm93cyBhbiBleGNlcHRpb24gZHVyaW5nIGdldCgpLCBpdCBzaG91bGQgbm90IGNhdXNlXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gYSBmYXRhbCBlcnJvci4gV2UganVzdCByZXR1cm4gdGhlIHVucmVzb2x2ZWQgcHJvbWlzZSBpbiB0aGlzIGNhc2UuXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuaW5zdGFuY2VzRGVmZXJyZWQuZ2V0KG5vcm1hbGl6ZWRJZGVudGlmaWVyKS5wcm9taXNlO1xyXG4gICAgfVxyXG4gICAgZ2V0SW1tZWRpYXRlKG9wdGlvbnMpIHtcclxuICAgICAgICB2YXIgX2E7XHJcbiAgICAgICAgLy8gaWYgbXVsdGlwbGVJbnN0YW5jZXMgaXMgbm90IHN1cHBvcnRlZCwgdXNlIHRoZSBkZWZhdWx0IG5hbWVcclxuICAgICAgICBjb25zdCBub3JtYWxpemVkSWRlbnRpZmllciA9IHRoaXMubm9ybWFsaXplSW5zdGFuY2VJZGVudGlmaWVyKG9wdGlvbnMgPT09IG51bGwgfHwgb3B0aW9ucyA9PT0gdm9pZCAwID8gdm9pZCAwIDogb3B0aW9ucy5pZGVudGlmaWVyKTtcclxuICAgICAgICBjb25zdCBvcHRpb25hbCA9IChfYSA9IG9wdGlvbnMgPT09IG51bGwgfHwgb3B0aW9ucyA9PT0gdm9pZCAwID8gdm9pZCAwIDogb3B0aW9ucy5vcHRpb25hbCkgIT09IG51bGwgJiYgX2EgIT09IHZvaWQgMCA/IF9hIDogZmFsc2U7XHJcbiAgICAgICAgaWYgKHRoaXMuaXNJbml0aWFsaXplZChub3JtYWxpemVkSWRlbnRpZmllcikgfHxcclxuICAgICAgICAgICAgdGhpcy5zaG91bGRBdXRvSW5pdGlhbGl6ZSgpKSB7XHJcbiAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5nZXRPckluaXRpYWxpemVTZXJ2aWNlKHtcclxuICAgICAgICAgICAgICAgICAgICBpbnN0YW5jZUlkZW50aWZpZXI6IG5vcm1hbGl6ZWRJZGVudGlmaWVyXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjYXRjaCAoZSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKG9wdGlvbmFsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICB0aHJvdyBlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAvLyBJbiBjYXNlIGEgY29tcG9uZW50IGlzIG5vdCBpbml0aWFsaXplZCBhbmQgc2hvdWxkL2NhbiBub3QgYmUgYXV0by1pbml0aWFsaXplZCBhdCB0aGUgbW9tZW50LCByZXR1cm4gbnVsbCBpZiB0aGUgb3B0aW9uYWwgZmxhZyBpcyBzZXQsIG9yIHRocm93XHJcbiAgICAgICAgICAgIGlmIChvcHRpb25hbCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aHJvdyBFcnJvcihgU2VydmljZSAke3RoaXMubmFtZX0gaXMgbm90IGF2YWlsYWJsZWApO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgZ2V0Q29tcG9uZW50KCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmNvbXBvbmVudDtcclxuICAgIH1cclxuICAgIHNldENvbXBvbmVudChjb21wb25lbnQpIHtcclxuICAgICAgICBpZiAoY29tcG9uZW50Lm5hbWUgIT09IHRoaXMubmFtZSkge1xyXG4gICAgICAgICAgICB0aHJvdyBFcnJvcihgTWlzbWF0Y2hpbmcgQ29tcG9uZW50ICR7Y29tcG9uZW50Lm5hbWV9IGZvciBQcm92aWRlciAke3RoaXMubmFtZX0uYCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh0aGlzLmNvbXBvbmVudCkge1xyXG4gICAgICAgICAgICB0aHJvdyBFcnJvcihgQ29tcG9uZW50IGZvciAke3RoaXMubmFtZX0gaGFzIGFscmVhZHkgYmVlbiBwcm92aWRlZGApO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmNvbXBvbmVudCA9IGNvbXBvbmVudDtcclxuICAgICAgICAvLyByZXR1cm4gZWFybHkgd2l0aG91dCBhdHRlbXB0aW5nIHRvIGluaXRpYWxpemUgdGhlIGNvbXBvbmVudCBpZiB0aGUgY29tcG9uZW50IHJlcXVpcmVzIGV4cGxpY2l0IGluaXRpYWxpemF0aW9uIChjYWxsaW5nIGBQcm92aWRlci5pbml0aWFsaXplKClgKVxyXG4gICAgICAgIGlmICghdGhpcy5zaG91bGRBdXRvSW5pdGlhbGl6ZSgpKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gaWYgdGhlIHNlcnZpY2UgaXMgZWFnZXIsIGluaXRpYWxpemUgdGhlIGRlZmF1bHQgaW5zdGFuY2VcclxuICAgICAgICBpZiAoaXNDb21wb25lbnRFYWdlcihjb21wb25lbnQpKSB7XHJcbiAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmdldE9ySW5pdGlhbGl6ZVNlcnZpY2UoeyBpbnN0YW5jZUlkZW50aWZpZXI6IERFRkFVTFRfRU5UUllfTkFNRSB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjYXRjaCAoZSkge1xyXG4gICAgICAgICAgICAgICAgLy8gd2hlbiB0aGUgaW5zdGFuY2UgZmFjdG9yeSBmb3IgYW4gZWFnZXIgQ29tcG9uZW50IHRocm93cyBhbiBleGNlcHRpb24gZHVyaW5nIHRoZSBlYWdlclxyXG4gICAgICAgICAgICAgICAgLy8gaW5pdGlhbGl6YXRpb24sIGl0IHNob3VsZCBub3QgY2F1c2UgYSBmYXRhbCBlcnJvci5cclxuICAgICAgICAgICAgICAgIC8vIFRPRE86IEludmVzdGlnYXRlIGlmIHdlIG5lZWQgdG8gbWFrZSBpdCBjb25maWd1cmFibGUsIGJlY2F1c2Ugc29tZSBjb21wb25lbnQgbWF5IHdhbnQgdG8gY2F1c2VcclxuICAgICAgICAgICAgICAgIC8vIGEgZmF0YWwgZXJyb3IgaW4gdGhpcyBjYXNlP1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIENyZWF0ZSBzZXJ2aWNlIGluc3RhbmNlcyBmb3IgdGhlIHBlbmRpbmcgcHJvbWlzZXMgYW5kIHJlc29sdmUgdGhlbVxyXG4gICAgICAgIC8vIE5PVEU6IGlmIHRoaXMubXVsdGlwbGVJbnN0YW5jZXMgaXMgZmFsc2UsIG9ubHkgdGhlIGRlZmF1bHQgaW5zdGFuY2Ugd2lsbCBiZSBjcmVhdGVkXHJcbiAgICAgICAgLy8gYW5kIGFsbCBwcm9taXNlcyB3aXRoIHJlc29sdmUgd2l0aCBpdCByZWdhcmRsZXNzIG9mIHRoZSBpZGVudGlmaWVyLlxyXG4gICAgICAgIGZvciAoY29uc3QgW2luc3RhbmNlSWRlbnRpZmllciwgaW5zdGFuY2VEZWZlcnJlZF0gb2YgdGhpcy5pbnN0YW5jZXNEZWZlcnJlZC5lbnRyaWVzKCkpIHtcclxuICAgICAgICAgICAgY29uc3Qgbm9ybWFsaXplZElkZW50aWZpZXIgPSB0aGlzLm5vcm1hbGl6ZUluc3RhbmNlSWRlbnRpZmllcihpbnN0YW5jZUlkZW50aWZpZXIpO1xyXG4gICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgLy8gYGdldE9ySW5pdGlhbGl6ZVNlcnZpY2UoKWAgc2hvdWxkIGFsd2F5cyByZXR1cm4gYSB2YWxpZCBpbnN0YW5jZSBzaW5jZSBhIGNvbXBvbmVudCBpcyBndWFyYW50ZWVkLiB1c2UgISB0byBtYWtlIHR5cGVzY3JpcHQgaGFwcHkuXHJcbiAgICAgICAgICAgICAgICBjb25zdCBpbnN0YW5jZSA9IHRoaXMuZ2V0T3JJbml0aWFsaXplU2VydmljZSh7XHJcbiAgICAgICAgICAgICAgICAgICAgaW5zdGFuY2VJZGVudGlmaWVyOiBub3JtYWxpemVkSWRlbnRpZmllclxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICBpbnN0YW5jZURlZmVycmVkLnJlc29sdmUoaW5zdGFuY2UpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGNhdGNoIChlKSB7XHJcbiAgICAgICAgICAgICAgICAvLyB3aGVuIHRoZSBpbnN0YW5jZSBmYWN0b3J5IHRocm93cyBhbiBleGNlcHRpb24sIGl0IHNob3VsZCBub3QgY2F1c2VcclxuICAgICAgICAgICAgICAgIC8vIGEgZmF0YWwgZXJyb3IuIFdlIGp1c3QgbGVhdmUgdGhlIHByb21pc2UgdW5yZXNvbHZlZC5cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGNsZWFySW5zdGFuY2UoaWRlbnRpZmllciA9IERFRkFVTFRfRU5UUllfTkFNRSkge1xyXG4gICAgICAgIHRoaXMuaW5zdGFuY2VzRGVmZXJyZWQuZGVsZXRlKGlkZW50aWZpZXIpO1xyXG4gICAgICAgIHRoaXMuaW5zdGFuY2VzT3B0aW9ucy5kZWxldGUoaWRlbnRpZmllcik7XHJcbiAgICAgICAgdGhpcy5pbnN0YW5jZXMuZGVsZXRlKGlkZW50aWZpZXIpO1xyXG4gICAgfVxyXG4gICAgLy8gYXBwLmRlbGV0ZSgpIHdpbGwgY2FsbCB0aGlzIG1ldGhvZCBvbiBldmVyeSBwcm92aWRlciB0byBkZWxldGUgdGhlIHNlcnZpY2VzXHJcbiAgICAvLyBUT0RPOiBzaG91bGQgd2UgbWFyayB0aGUgcHJvdmlkZXIgYXMgZGVsZXRlZD9cclxuICAgIGFzeW5jIGRlbGV0ZSgpIHtcclxuICAgICAgICBjb25zdCBzZXJ2aWNlcyA9IEFycmF5LmZyb20odGhpcy5pbnN0YW5jZXMudmFsdWVzKCkpO1xyXG4gICAgICAgIGF3YWl0IFByb21pc2UuYWxsKFtcclxuICAgICAgICAgICAgLi4uc2VydmljZXNcclxuICAgICAgICAgICAgICAgIC5maWx0ZXIoc2VydmljZSA9PiAnSU5URVJOQUwnIGluIHNlcnZpY2UpIC8vIGxlZ2FjeSBzZXJ2aWNlc1xyXG4gICAgICAgICAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9uby1leHBsaWNpdC1hbnlcclxuICAgICAgICAgICAgICAgIC5tYXAoc2VydmljZSA9PiBzZXJ2aWNlLklOVEVSTkFMLmRlbGV0ZSgpKSxcclxuICAgICAgICAgICAgLi4uc2VydmljZXNcclxuICAgICAgICAgICAgICAgIC5maWx0ZXIoc2VydmljZSA9PiAnX2RlbGV0ZScgaW4gc2VydmljZSkgLy8gbW9kdWxhcml6ZWQgc2VydmljZXNcclxuICAgICAgICAgICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tZXhwbGljaXQtYW55XHJcbiAgICAgICAgICAgICAgICAubWFwKHNlcnZpY2UgPT4gc2VydmljZS5fZGVsZXRlKCkpXHJcbiAgICAgICAgXSk7XHJcbiAgICB9XHJcbiAgICBpc0NvbXBvbmVudFNldCgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5jb21wb25lbnQgIT0gbnVsbDtcclxuICAgIH1cclxuICAgIGlzSW5pdGlhbGl6ZWQoaWRlbnRpZmllciA9IERFRkFVTFRfRU5UUllfTkFNRSkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmluc3RhbmNlcy5oYXMoaWRlbnRpZmllcik7XHJcbiAgICB9XHJcbiAgICBnZXRPcHRpb25zKGlkZW50aWZpZXIgPSBERUZBVUxUX0VOVFJZX05BTUUpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5pbnN0YW5jZXNPcHRpb25zLmdldChpZGVudGlmaWVyKSB8fCB7fTtcclxuICAgIH1cclxuICAgIGluaXRpYWxpemUob3B0cyA9IHt9KSB7XHJcbiAgICAgICAgY29uc3QgeyBvcHRpb25zID0ge30gfSA9IG9wdHM7XHJcbiAgICAgICAgY29uc3Qgbm9ybWFsaXplZElkZW50aWZpZXIgPSB0aGlzLm5vcm1hbGl6ZUluc3RhbmNlSWRlbnRpZmllcihvcHRzLmluc3RhbmNlSWRlbnRpZmllcik7XHJcbiAgICAgICAgaWYgKHRoaXMuaXNJbml0aWFsaXplZChub3JtYWxpemVkSWRlbnRpZmllcikpIHtcclxuICAgICAgICAgICAgdGhyb3cgRXJyb3IoYCR7dGhpcy5uYW1lfSgke25vcm1hbGl6ZWRJZGVudGlmaWVyfSkgaGFzIGFscmVhZHkgYmVlbiBpbml0aWFsaXplZGApO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoIXRoaXMuaXNDb21wb25lbnRTZXQoKSkge1xyXG4gICAgICAgICAgICB0aHJvdyBFcnJvcihgQ29tcG9uZW50ICR7dGhpcy5uYW1lfSBoYXMgbm90IGJlZW4gcmVnaXN0ZXJlZCB5ZXRgKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgY29uc3QgaW5zdGFuY2UgPSB0aGlzLmdldE9ySW5pdGlhbGl6ZVNlcnZpY2Uoe1xyXG4gICAgICAgICAgICBpbnN0YW5jZUlkZW50aWZpZXI6IG5vcm1hbGl6ZWRJZGVudGlmaWVyLFxyXG4gICAgICAgICAgICBvcHRpb25zXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgLy8gcmVzb2x2ZSBhbnkgcGVuZGluZyBwcm9taXNlIHdhaXRpbmcgZm9yIHRoZSBzZXJ2aWNlIGluc3RhbmNlXHJcbiAgICAgICAgZm9yIChjb25zdCBbaW5zdGFuY2VJZGVudGlmaWVyLCBpbnN0YW5jZURlZmVycmVkXSBvZiB0aGlzLmluc3RhbmNlc0RlZmVycmVkLmVudHJpZXMoKSkge1xyXG4gICAgICAgICAgICBjb25zdCBub3JtYWxpemVkRGVmZXJyZWRJZGVudGlmaWVyID0gdGhpcy5ub3JtYWxpemVJbnN0YW5jZUlkZW50aWZpZXIoaW5zdGFuY2VJZGVudGlmaWVyKTtcclxuICAgICAgICAgICAgaWYgKG5vcm1hbGl6ZWRJZGVudGlmaWVyID09PSBub3JtYWxpemVkRGVmZXJyZWRJZGVudGlmaWVyKSB7XHJcbiAgICAgICAgICAgICAgICBpbnN0YW5jZURlZmVycmVkLnJlc29sdmUoaW5zdGFuY2UpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBpbnN0YW5jZTtcclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSBjYWxsYmFjayAtIGEgZnVuY3Rpb24gdGhhdCB3aWxsIGJlIGludm9rZWQgIGFmdGVyIHRoZSBwcm92aWRlciBoYXMgYmVlbiBpbml0aWFsaXplZCBieSBjYWxsaW5nIHByb3ZpZGVyLmluaXRpYWxpemUoKS5cclxuICAgICAqIFRoZSBmdW5jdGlvbiBpcyBpbnZva2VkIFNZTkNIUk9OT1VTTFksIHNvIGl0IHNob3VsZCBub3QgZXhlY3V0ZSBhbnkgbG9uZ3J1bm5pbmcgdGFza3MgaW4gb3JkZXIgdG8gbm90IGJsb2NrIHRoZSBwcm9ncmFtLlxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSBpZGVudGlmaWVyIEFuIG9wdGlvbmFsIGluc3RhbmNlIGlkZW50aWZpZXJcclxuICAgICAqIEByZXR1cm5zIGEgZnVuY3Rpb24gdG8gdW5yZWdpc3RlciB0aGUgY2FsbGJhY2tcclxuICAgICAqL1xyXG4gICAgb25Jbml0KGNhbGxiYWNrLCBpZGVudGlmaWVyKSB7XHJcbiAgICAgICAgdmFyIF9hO1xyXG4gICAgICAgIGNvbnN0IG5vcm1hbGl6ZWRJZGVudGlmaWVyID0gdGhpcy5ub3JtYWxpemVJbnN0YW5jZUlkZW50aWZpZXIoaWRlbnRpZmllcik7XHJcbiAgICAgICAgY29uc3QgZXhpc3RpbmdDYWxsYmFja3MgPSAoX2EgPSB0aGlzLm9uSW5pdENhbGxiYWNrcy5nZXQobm9ybWFsaXplZElkZW50aWZpZXIpKSAhPT0gbnVsbCAmJiBfYSAhPT0gdm9pZCAwID8gX2EgOiBuZXcgU2V0KCk7XHJcbiAgICAgICAgZXhpc3RpbmdDYWxsYmFja3MuYWRkKGNhbGxiYWNrKTtcclxuICAgICAgICB0aGlzLm9uSW5pdENhbGxiYWNrcy5zZXQobm9ybWFsaXplZElkZW50aWZpZXIsIGV4aXN0aW5nQ2FsbGJhY2tzKTtcclxuICAgICAgICBjb25zdCBleGlzdGluZ0luc3RhbmNlID0gdGhpcy5pbnN0YW5jZXMuZ2V0KG5vcm1hbGl6ZWRJZGVudGlmaWVyKTtcclxuICAgICAgICBpZiAoZXhpc3RpbmdJbnN0YW5jZSkge1xyXG4gICAgICAgICAgICBjYWxsYmFjayhleGlzdGluZ0luc3RhbmNlLCBub3JtYWxpemVkSWRlbnRpZmllcik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiAoKSA9PiB7XHJcbiAgICAgICAgICAgIGV4aXN0aW5nQ2FsbGJhY2tzLmRlbGV0ZShjYWxsYmFjayk7XHJcbiAgICAgICAgfTtcclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICogSW52b2tlIG9uSW5pdCBjYWxsYmFja3Mgc3luY2hyb25vdXNseVxyXG4gICAgICogQHBhcmFtIGluc3RhbmNlIHRoZSBzZXJ2aWNlIGluc3RhbmNlYFxyXG4gICAgICovXHJcbiAgICBpbnZva2VPbkluaXRDYWxsYmFja3MoaW5zdGFuY2UsIGlkZW50aWZpZXIpIHtcclxuICAgICAgICBjb25zdCBjYWxsYmFja3MgPSB0aGlzLm9uSW5pdENhbGxiYWNrcy5nZXQoaWRlbnRpZmllcik7XHJcbiAgICAgICAgaWYgKCFjYWxsYmFja3MpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICBmb3IgKGNvbnN0IGNhbGxiYWNrIG9mIGNhbGxiYWNrcykge1xyXG4gICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgY2FsbGJhY2soaW5zdGFuY2UsIGlkZW50aWZpZXIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGNhdGNoIChfYSkge1xyXG4gICAgICAgICAgICAgICAgLy8gaWdub3JlIGVycm9ycyBpbiB0aGUgb25Jbml0IGNhbGxiYWNrXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBnZXRPckluaXRpYWxpemVTZXJ2aWNlKHsgaW5zdGFuY2VJZGVudGlmaWVyLCBvcHRpb25zID0ge30gfSkge1xyXG4gICAgICAgIGxldCBpbnN0YW5jZSA9IHRoaXMuaW5zdGFuY2VzLmdldChpbnN0YW5jZUlkZW50aWZpZXIpO1xyXG4gICAgICAgIGlmICghaW5zdGFuY2UgJiYgdGhpcy5jb21wb25lbnQpIHtcclxuICAgICAgICAgICAgaW5zdGFuY2UgPSB0aGlzLmNvbXBvbmVudC5pbnN0YW5jZUZhY3RvcnkodGhpcy5jb250YWluZXIsIHtcclxuICAgICAgICAgICAgICAgIGluc3RhbmNlSWRlbnRpZmllcjogbm9ybWFsaXplSWRlbnRpZmllckZvckZhY3RvcnkoaW5zdGFuY2VJZGVudGlmaWVyKSxcclxuICAgICAgICAgICAgICAgIG9wdGlvbnNcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIHRoaXMuaW5zdGFuY2VzLnNldChpbnN0YW5jZUlkZW50aWZpZXIsIGluc3RhbmNlKTtcclxuICAgICAgICAgICAgdGhpcy5pbnN0YW5jZXNPcHRpb25zLnNldChpbnN0YW5jZUlkZW50aWZpZXIsIG9wdGlvbnMpO1xyXG4gICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgICogSW52b2tlIG9uSW5pdCBsaXN0ZW5lcnMuXHJcbiAgICAgICAgICAgICAqIE5vdGUgdGhpcy5jb21wb25lbnQub25JbnN0YW5jZUNyZWF0ZWQgaXMgZGlmZmVyZW50LCB3aGljaCBpcyB1c2VkIGJ5IHRoZSBjb21wb25lbnQgY3JlYXRvcixcclxuICAgICAgICAgICAgICogd2hpbGUgb25Jbml0IGxpc3RlbmVycyBhcmUgcmVnaXN0ZXJlZCBieSBjb25zdW1lcnMgb2YgdGhlIHByb3ZpZGVyLlxyXG4gICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgdGhpcy5pbnZva2VPbkluaXRDYWxsYmFja3MoaW5zdGFuY2UsIGluc3RhbmNlSWRlbnRpZmllcik7XHJcbiAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgKiBPcmRlciBpcyBpbXBvcnRhbnRcclxuICAgICAgICAgICAgICogb25JbnN0YW5jZUNyZWF0ZWQoKSBzaG91bGQgYmUgY2FsbGVkIGFmdGVyIHRoaXMuaW5zdGFuY2VzLnNldChpbnN0YW5jZUlkZW50aWZpZXIsIGluc3RhbmNlKTsgd2hpY2hcclxuICAgICAgICAgICAgICogbWFrZXMgYGlzSW5pdGlhbGl6ZWQoKWAgcmV0dXJuIHRydWUuXHJcbiAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICBpZiAodGhpcy5jb21wb25lbnQub25JbnN0YW5jZUNyZWF0ZWQpIHtcclxuICAgICAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jb21wb25lbnQub25JbnN0YW5jZUNyZWF0ZWQodGhpcy5jb250YWluZXIsIGluc3RhbmNlSWRlbnRpZmllciwgaW5zdGFuY2UpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgY2F0Y2ggKF9hKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gaWdub3JlIGVycm9ycyBpbiB0aGUgb25JbnN0YW5jZUNyZWF0ZWRDYWxsYmFja1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBpbnN0YW5jZSB8fCBudWxsO1xyXG4gICAgfVxyXG4gICAgbm9ybWFsaXplSW5zdGFuY2VJZGVudGlmaWVyKGlkZW50aWZpZXIgPSBERUZBVUxUX0VOVFJZX05BTUUpIHtcclxuICAgICAgICBpZiAodGhpcy5jb21wb25lbnQpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuY29tcG9uZW50Lm11bHRpcGxlSW5zdGFuY2VzID8gaWRlbnRpZmllciA6IERFRkFVTFRfRU5UUllfTkFNRTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIHJldHVybiBpZGVudGlmaWVyOyAvLyBhc3N1bWUgbXVsdGlwbGUgaW5zdGFuY2VzIGFyZSBzdXBwb3J0ZWQgYmVmb3JlIHRoZSBjb21wb25lbnQgaXMgcHJvdmlkZWQuXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgc2hvdWxkQXV0b0luaXRpYWxpemUoKSB7XHJcbiAgICAgICAgcmV0dXJuICghIXRoaXMuY29tcG9uZW50ICYmXHJcbiAgICAgICAgICAgIHRoaXMuY29tcG9uZW50Lmluc3RhbnRpYXRpb25Nb2RlICE9PSBcIkVYUExJQ0lUXCIgLyogSW5zdGFudGlhdGlvbk1vZGUuRVhQTElDSVQgKi8pO1xyXG4gICAgfVxyXG59XHJcbi8vIHVuZGVmaW5lZCBzaG91bGQgYmUgcGFzc2VkIHRvIHRoZSBzZXJ2aWNlIGZhY3RvcnkgZm9yIHRoZSBkZWZhdWx0IGluc3RhbmNlXHJcbmZ1bmN0aW9uIG5vcm1hbGl6ZUlkZW50aWZpZXJGb3JGYWN0b3J5KGlkZW50aWZpZXIpIHtcclxuICAgIHJldHVybiBpZGVudGlmaWVyID09PSBERUZBVUxUX0VOVFJZX05BTUUgPyB1bmRlZmluZWQgOiBpZGVudGlmaWVyO1xyXG59XHJcbmZ1bmN0aW9uIGlzQ29tcG9uZW50RWFnZXIoY29tcG9uZW50KSB7XHJcbiAgICByZXR1cm4gY29tcG9uZW50Lmluc3RhbnRpYXRpb25Nb2RlID09PSBcIkVBR0VSXCIgLyogSW5zdGFudGlhdGlvbk1vZGUuRUFHRVIgKi87XHJcbn1cblxuLyoqXHJcbiAqIEBsaWNlbnNlXHJcbiAqIENvcHlyaWdodCAyMDE5IEdvb2dsZSBMTENcclxuICpcclxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcclxuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxyXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcclxuICpcclxuICogICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcclxuICpcclxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxyXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXHJcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxyXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXHJcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxyXG4gKi9cclxuLyoqXHJcbiAqIENvbXBvbmVudENvbnRhaW5lciB0aGF0IHByb3ZpZGVzIFByb3ZpZGVycyBmb3Igc2VydmljZSBuYW1lIFQsIGUuZy4gYGF1dGhgLCBgYXV0aC1pbnRlcm5hbGBcclxuICovXHJcbmNsYXNzIENvbXBvbmVudENvbnRhaW5lciB7XHJcbiAgICBjb25zdHJ1Y3RvcihuYW1lKSB7XHJcbiAgICAgICAgdGhpcy5uYW1lID0gbmFtZTtcclxuICAgICAgICB0aGlzLnByb3ZpZGVycyA9IG5ldyBNYXAoKTtcclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSBjb21wb25lbnQgQ29tcG9uZW50IGJlaW5nIGFkZGVkXHJcbiAgICAgKiBAcGFyYW0gb3ZlcndyaXRlIFdoZW4gYSBjb21wb25lbnQgd2l0aCB0aGUgc2FtZSBuYW1lIGhhcyBhbHJlYWR5IGJlZW4gcmVnaXN0ZXJlZCxcclxuICAgICAqIGlmIG92ZXJ3cml0ZSBpcyB0cnVlOiBvdmVyd3JpdGUgdGhlIGV4aXN0aW5nIGNvbXBvbmVudCB3aXRoIHRoZSBuZXcgY29tcG9uZW50IGFuZCBjcmVhdGUgYSBuZXdcclxuICAgICAqIHByb3ZpZGVyIHdpdGggdGhlIG5ldyBjb21wb25lbnQuIEl0IGNhbiBiZSB1c2VmdWwgaW4gdGVzdHMgd2hlcmUgeW91IHdhbnQgdG8gdXNlIGRpZmZlcmVudCBtb2Nrc1xyXG4gICAgICogZm9yIGRpZmZlcmVudCB0ZXN0cy5cclxuICAgICAqIGlmIG92ZXJ3cml0ZSBpcyBmYWxzZTogdGhyb3cgYW4gZXhjZXB0aW9uXHJcbiAgICAgKi9cclxuICAgIGFkZENvbXBvbmVudChjb21wb25lbnQpIHtcclxuICAgICAgICBjb25zdCBwcm92aWRlciA9IHRoaXMuZ2V0UHJvdmlkZXIoY29tcG9uZW50Lm5hbWUpO1xyXG4gICAgICAgIGlmIChwcm92aWRlci5pc0NvbXBvbmVudFNldCgpKSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgQ29tcG9uZW50ICR7Y29tcG9uZW50Lm5hbWV9IGhhcyBhbHJlYWR5IGJlZW4gcmVnaXN0ZXJlZCB3aXRoICR7dGhpcy5uYW1lfWApO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcm92aWRlci5zZXRDb21wb25lbnQoY29tcG9uZW50KTtcclxuICAgIH1cclxuICAgIGFkZE9yT3ZlcndyaXRlQ29tcG9uZW50KGNvbXBvbmVudCkge1xyXG4gICAgICAgIGNvbnN0IHByb3ZpZGVyID0gdGhpcy5nZXRQcm92aWRlcihjb21wb25lbnQubmFtZSk7XHJcbiAgICAgICAgaWYgKHByb3ZpZGVyLmlzQ29tcG9uZW50U2V0KCkpIHtcclxuICAgICAgICAgICAgLy8gZGVsZXRlIHRoZSBleGlzdGluZyBwcm92aWRlciBmcm9tIHRoZSBjb250YWluZXIsIHNvIHdlIGNhbiByZWdpc3RlciB0aGUgbmV3IGNvbXBvbmVudFxyXG4gICAgICAgICAgICB0aGlzLnByb3ZpZGVycy5kZWxldGUoY29tcG9uZW50Lm5hbWUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmFkZENvbXBvbmVudChjb21wb25lbnQpO1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiBnZXRQcm92aWRlciBwcm92aWRlcyBhIHR5cGUgc2FmZSBpbnRlcmZhY2Ugd2hlcmUgaXQgY2FuIG9ubHkgYmUgY2FsbGVkIHdpdGggYSBmaWVsZCBuYW1lXHJcbiAgICAgKiBwcmVzZW50IGluIE5hbWVTZXJ2aWNlTWFwcGluZyBpbnRlcmZhY2UuXHJcbiAgICAgKlxyXG4gICAgICogRmlyZWJhc2UgU0RLcyBwcm92aWRpbmcgc2VydmljZXMgc2hvdWxkIGV4dGVuZCBOYW1lU2VydmljZU1hcHBpbmcgaW50ZXJmYWNlIHRvIHJlZ2lzdGVyXHJcbiAgICAgKiB0aGVtc2VsdmVzLlxyXG4gICAgICovXHJcbiAgICBnZXRQcm92aWRlcihuYW1lKSB7XHJcbiAgICAgICAgaWYgKHRoaXMucHJvdmlkZXJzLmhhcyhuYW1lKSkge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5wcm92aWRlcnMuZ2V0KG5hbWUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBjcmVhdGUgYSBQcm92aWRlciBmb3IgYSBzZXJ2aWNlIHRoYXQgaGFzbid0IHJlZ2lzdGVyZWQgd2l0aCBGaXJlYmFzZVxyXG4gICAgICAgIGNvbnN0IHByb3ZpZGVyID0gbmV3IFByb3ZpZGVyKG5hbWUsIHRoaXMpO1xyXG4gICAgICAgIHRoaXMucHJvdmlkZXJzLnNldChuYW1lLCBwcm92aWRlcik7XHJcbiAgICAgICAgcmV0dXJuIHByb3ZpZGVyO1xyXG4gICAgfVxyXG4gICAgZ2V0UHJvdmlkZXJzKCkge1xyXG4gICAgICAgIHJldHVybiBBcnJheS5mcm9tKHRoaXMucHJvdmlkZXJzLnZhbHVlcygpKTtcclxuICAgIH1cclxufVxuXG5leHBvcnQgeyBDb21wb25lbnQsIENvbXBvbmVudENvbnRhaW5lciwgUHJvdmlkZXIgfTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWluZGV4LmVzbTIwMTcuanMubWFwXG4iLCJjb25zdCBpbnN0YW5jZU9mQW55ID0gKG9iamVjdCwgY29uc3RydWN0b3JzKSA9PiBjb25zdHJ1Y3RvcnMuc29tZSgoYykgPT4gb2JqZWN0IGluc3RhbmNlb2YgYyk7XG5cbmxldCBpZGJQcm94eWFibGVUeXBlcztcbmxldCBjdXJzb3JBZHZhbmNlTWV0aG9kcztcbi8vIFRoaXMgaXMgYSBmdW5jdGlvbiB0byBwcmV2ZW50IGl0IHRocm93aW5nIHVwIGluIG5vZGUgZW52aXJvbm1lbnRzLlxuZnVuY3Rpb24gZ2V0SWRiUHJveHlhYmxlVHlwZXMoKSB7XG4gICAgcmV0dXJuIChpZGJQcm94eWFibGVUeXBlcyB8fFxuICAgICAgICAoaWRiUHJveHlhYmxlVHlwZXMgPSBbXG4gICAgICAgICAgICBJREJEYXRhYmFzZSxcbiAgICAgICAgICAgIElEQk9iamVjdFN0b3JlLFxuICAgICAgICAgICAgSURCSW5kZXgsXG4gICAgICAgICAgICBJREJDdXJzb3IsXG4gICAgICAgICAgICBJREJUcmFuc2FjdGlvbixcbiAgICAgICAgXSkpO1xufVxuLy8gVGhpcyBpcyBhIGZ1bmN0aW9uIHRvIHByZXZlbnQgaXQgdGhyb3dpbmcgdXAgaW4gbm9kZSBlbnZpcm9ubWVudHMuXG5mdW5jdGlvbiBnZXRDdXJzb3JBZHZhbmNlTWV0aG9kcygpIHtcbiAgICByZXR1cm4gKGN1cnNvckFkdmFuY2VNZXRob2RzIHx8XG4gICAgICAgIChjdXJzb3JBZHZhbmNlTWV0aG9kcyA9IFtcbiAgICAgICAgICAgIElEQkN1cnNvci5wcm90b3R5cGUuYWR2YW5jZSxcbiAgICAgICAgICAgIElEQkN1cnNvci5wcm90b3R5cGUuY29udGludWUsXG4gICAgICAgICAgICBJREJDdXJzb3IucHJvdG90eXBlLmNvbnRpbnVlUHJpbWFyeUtleSxcbiAgICAgICAgXSkpO1xufVxuY29uc3QgY3Vyc29yUmVxdWVzdE1hcCA9IG5ldyBXZWFrTWFwKCk7XG5jb25zdCB0cmFuc2FjdGlvbkRvbmVNYXAgPSBuZXcgV2Vha01hcCgpO1xuY29uc3QgdHJhbnNhY3Rpb25TdG9yZU5hbWVzTWFwID0gbmV3IFdlYWtNYXAoKTtcbmNvbnN0IHRyYW5zZm9ybUNhY2hlID0gbmV3IFdlYWtNYXAoKTtcbmNvbnN0IHJldmVyc2VUcmFuc2Zvcm1DYWNoZSA9IG5ldyBXZWFrTWFwKCk7XG5mdW5jdGlvbiBwcm9taXNpZnlSZXF1ZXN0KHJlcXVlc3QpIHtcbiAgICBjb25zdCBwcm9taXNlID0gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICBjb25zdCB1bmxpc3RlbiA9ICgpID0+IHtcbiAgICAgICAgICAgIHJlcXVlc3QucmVtb3ZlRXZlbnRMaXN0ZW5lcignc3VjY2VzcycsIHN1Y2Nlc3MpO1xuICAgICAgICAgICAgcmVxdWVzdC5yZW1vdmVFdmVudExpc3RlbmVyKCdlcnJvcicsIGVycm9yKTtcbiAgICAgICAgfTtcbiAgICAgICAgY29uc3Qgc3VjY2VzcyA9ICgpID0+IHtcbiAgICAgICAgICAgIHJlc29sdmUod3JhcChyZXF1ZXN0LnJlc3VsdCkpO1xuICAgICAgICAgICAgdW5saXN0ZW4oKTtcbiAgICAgICAgfTtcbiAgICAgICAgY29uc3QgZXJyb3IgPSAoKSA9PiB7XG4gICAgICAgICAgICByZWplY3QocmVxdWVzdC5lcnJvcik7XG4gICAgICAgICAgICB1bmxpc3RlbigpO1xuICAgICAgICB9O1xuICAgICAgICByZXF1ZXN0LmFkZEV2ZW50TGlzdGVuZXIoJ3N1Y2Nlc3MnLCBzdWNjZXNzKTtcbiAgICAgICAgcmVxdWVzdC5hZGRFdmVudExpc3RlbmVyKCdlcnJvcicsIGVycm9yKTtcbiAgICB9KTtcbiAgICBwcm9taXNlXG4gICAgICAgIC50aGVuKCh2YWx1ZSkgPT4ge1xuICAgICAgICAvLyBTaW5jZSBjdXJzb3JpbmcgcmV1c2VzIHRoZSBJREJSZXF1ZXN0ICgqc2lnaCopLCB3ZSBjYWNoZSBpdCBmb3IgbGF0ZXIgcmV0cmlldmFsXG4gICAgICAgIC8vIChzZWUgd3JhcEZ1bmN0aW9uKS5cbiAgICAgICAgaWYgKHZhbHVlIGluc3RhbmNlb2YgSURCQ3Vyc29yKSB7XG4gICAgICAgICAgICBjdXJzb3JSZXF1ZXN0TWFwLnNldCh2YWx1ZSwgcmVxdWVzdCk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gQ2F0Y2hpbmcgdG8gYXZvaWQgXCJVbmNhdWdodCBQcm9taXNlIGV4Y2VwdGlvbnNcIlxuICAgIH0pXG4gICAgICAgIC5jYXRjaCgoKSA9PiB7IH0pO1xuICAgIC8vIFRoaXMgbWFwcGluZyBleGlzdHMgaW4gcmV2ZXJzZVRyYW5zZm9ybUNhY2hlIGJ1dCBkb2Vzbid0IGRvZXNuJ3QgZXhpc3QgaW4gdHJhbnNmb3JtQ2FjaGUuIFRoaXNcbiAgICAvLyBpcyBiZWNhdXNlIHdlIGNyZWF0ZSBtYW55IHByb21pc2VzIGZyb20gYSBzaW5nbGUgSURCUmVxdWVzdC5cbiAgICByZXZlcnNlVHJhbnNmb3JtQ2FjaGUuc2V0KHByb21pc2UsIHJlcXVlc3QpO1xuICAgIHJldHVybiBwcm9taXNlO1xufVxuZnVuY3Rpb24gY2FjaGVEb25lUHJvbWlzZUZvclRyYW5zYWN0aW9uKHR4KSB7XG4gICAgLy8gRWFybHkgYmFpbCBpZiB3ZSd2ZSBhbHJlYWR5IGNyZWF0ZWQgYSBkb25lIHByb21pc2UgZm9yIHRoaXMgdHJhbnNhY3Rpb24uXG4gICAgaWYgKHRyYW5zYWN0aW9uRG9uZU1hcC5oYXModHgpKVxuICAgICAgICByZXR1cm47XG4gICAgY29uc3QgZG9uZSA9IG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgY29uc3QgdW5saXN0ZW4gPSAoKSA9PiB7XG4gICAgICAgICAgICB0eC5yZW1vdmVFdmVudExpc3RlbmVyKCdjb21wbGV0ZScsIGNvbXBsZXRlKTtcbiAgICAgICAgICAgIHR4LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2Vycm9yJywgZXJyb3IpO1xuICAgICAgICAgICAgdHgucmVtb3ZlRXZlbnRMaXN0ZW5lcignYWJvcnQnLCBlcnJvcik7XG4gICAgICAgIH07XG4gICAgICAgIGNvbnN0IGNvbXBsZXRlID0gKCkgPT4ge1xuICAgICAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgICAgICAgdW5saXN0ZW4oKTtcbiAgICAgICAgfTtcbiAgICAgICAgY29uc3QgZXJyb3IgPSAoKSA9PiB7XG4gICAgICAgICAgICByZWplY3QodHguZXJyb3IgfHwgbmV3IERPTUV4Y2VwdGlvbignQWJvcnRFcnJvcicsICdBYm9ydEVycm9yJykpO1xuICAgICAgICAgICAgdW5saXN0ZW4oKTtcbiAgICAgICAgfTtcbiAgICAgICAgdHguYWRkRXZlbnRMaXN0ZW5lcignY29tcGxldGUnLCBjb21wbGV0ZSk7XG4gICAgICAgIHR4LmFkZEV2ZW50TGlzdGVuZXIoJ2Vycm9yJywgZXJyb3IpO1xuICAgICAgICB0eC5hZGRFdmVudExpc3RlbmVyKCdhYm9ydCcsIGVycm9yKTtcbiAgICB9KTtcbiAgICAvLyBDYWNoZSBpdCBmb3IgbGF0ZXIgcmV0cmlldmFsLlxuICAgIHRyYW5zYWN0aW9uRG9uZU1hcC5zZXQodHgsIGRvbmUpO1xufVxubGV0IGlkYlByb3h5VHJhcHMgPSB7XG4gICAgZ2V0KHRhcmdldCwgcHJvcCwgcmVjZWl2ZXIpIHtcbiAgICAgICAgaWYgKHRhcmdldCBpbnN0YW5jZW9mIElEQlRyYW5zYWN0aW9uKSB7XG4gICAgICAgICAgICAvLyBTcGVjaWFsIGhhbmRsaW5nIGZvciB0cmFuc2FjdGlvbi5kb25lLlxuICAgICAgICAgICAgaWYgKHByb3AgPT09ICdkb25lJylcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJhbnNhY3Rpb25Eb25lTWFwLmdldCh0YXJnZXQpO1xuICAgICAgICAgICAgLy8gUG9seWZpbGwgZm9yIG9iamVjdFN0b3JlTmFtZXMgYmVjYXVzZSBvZiBFZGdlLlxuICAgICAgICAgICAgaWYgKHByb3AgPT09ICdvYmplY3RTdG9yZU5hbWVzJykge1xuICAgICAgICAgICAgICAgIHJldHVybiB0YXJnZXQub2JqZWN0U3RvcmVOYW1lcyB8fCB0cmFuc2FjdGlvblN0b3JlTmFtZXNNYXAuZ2V0KHRhcmdldCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBNYWtlIHR4LnN0b3JlIHJldHVybiB0aGUgb25seSBzdG9yZSBpbiB0aGUgdHJhbnNhY3Rpb24sIG9yIHVuZGVmaW5lZCBpZiB0aGVyZSBhcmUgbWFueS5cbiAgICAgICAgICAgIGlmIChwcm9wID09PSAnc3RvcmUnKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlY2VpdmVyLm9iamVjdFN0b3JlTmFtZXNbMV1cbiAgICAgICAgICAgICAgICAgICAgPyB1bmRlZmluZWRcbiAgICAgICAgICAgICAgICAgICAgOiByZWNlaXZlci5vYmplY3RTdG9yZShyZWNlaXZlci5vYmplY3RTdG9yZU5hbWVzWzBdKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICAvLyBFbHNlIHRyYW5zZm9ybSB3aGF0ZXZlciB3ZSBnZXQgYmFjay5cbiAgICAgICAgcmV0dXJuIHdyYXAodGFyZ2V0W3Byb3BdKTtcbiAgICB9LFxuICAgIHNldCh0YXJnZXQsIHByb3AsIHZhbHVlKSB7XG4gICAgICAgIHRhcmdldFtwcm9wXSA9IHZhbHVlO1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9LFxuICAgIGhhcyh0YXJnZXQsIHByb3ApIHtcbiAgICAgICAgaWYgKHRhcmdldCBpbnN0YW5jZW9mIElEQlRyYW5zYWN0aW9uICYmXG4gICAgICAgICAgICAocHJvcCA9PT0gJ2RvbmUnIHx8IHByb3AgPT09ICdzdG9yZScpKSB7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcHJvcCBpbiB0YXJnZXQ7XG4gICAgfSxcbn07XG5mdW5jdGlvbiByZXBsYWNlVHJhcHMoY2FsbGJhY2spIHtcbiAgICBpZGJQcm94eVRyYXBzID0gY2FsbGJhY2soaWRiUHJveHlUcmFwcyk7XG59XG5mdW5jdGlvbiB3cmFwRnVuY3Rpb24oZnVuYykge1xuICAgIC8vIER1ZSB0byBleHBlY3RlZCBvYmplY3QgZXF1YWxpdHkgKHdoaWNoIGlzIGVuZm9yY2VkIGJ5IHRoZSBjYWNoaW5nIGluIGB3cmFwYCksIHdlXG4gICAgLy8gb25seSBjcmVhdGUgb25lIG5ldyBmdW5jIHBlciBmdW5jLlxuICAgIC8vIEVkZ2UgZG9lc24ndCBzdXBwb3J0IG9iamVjdFN0b3JlTmFtZXMgKGJvb28pLCBzbyB3ZSBwb2x5ZmlsbCBpdCBoZXJlLlxuICAgIGlmIChmdW5jID09PSBJREJEYXRhYmFzZS5wcm90b3R5cGUudHJhbnNhY3Rpb24gJiZcbiAgICAgICAgISgnb2JqZWN0U3RvcmVOYW1lcycgaW4gSURCVHJhbnNhY3Rpb24ucHJvdG90eXBlKSkge1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24gKHN0b3JlTmFtZXMsIC4uLmFyZ3MpIHtcbiAgICAgICAgICAgIGNvbnN0IHR4ID0gZnVuYy5jYWxsKHVud3JhcCh0aGlzKSwgc3RvcmVOYW1lcywgLi4uYXJncyk7XG4gICAgICAgICAgICB0cmFuc2FjdGlvblN0b3JlTmFtZXNNYXAuc2V0KHR4LCBzdG9yZU5hbWVzLnNvcnQgPyBzdG9yZU5hbWVzLnNvcnQoKSA6IFtzdG9yZU5hbWVzXSk7XG4gICAgICAgICAgICByZXR1cm4gd3JhcCh0eCk7XG4gICAgICAgIH07XG4gICAgfVxuICAgIC8vIEN1cnNvciBtZXRob2RzIGFyZSBzcGVjaWFsLCBhcyB0aGUgYmVoYXZpb3VyIGlzIGEgbGl0dGxlIG1vcmUgZGlmZmVyZW50IHRvIHN0YW5kYXJkIElEQi4gSW5cbiAgICAvLyBJREIsIHlvdSBhZHZhbmNlIHRoZSBjdXJzb3IgYW5kIHdhaXQgZm9yIGEgbmV3ICdzdWNjZXNzJyBvbiB0aGUgSURCUmVxdWVzdCB0aGF0IGdhdmUgeW91IHRoZVxuICAgIC8vIGN1cnNvci4gSXQncyBraW5kYSBsaWtlIGEgcHJvbWlzZSB0aGF0IGNhbiByZXNvbHZlIHdpdGggbWFueSB2YWx1ZXMuIFRoYXQgZG9lc24ndCBtYWtlIHNlbnNlXG4gICAgLy8gd2l0aCByZWFsIHByb21pc2VzLCBzbyBlYWNoIGFkdmFuY2UgbWV0aG9kcyByZXR1cm5zIGEgbmV3IHByb21pc2UgZm9yIHRoZSBjdXJzb3Igb2JqZWN0LCBvclxuICAgIC8vIHVuZGVmaW5lZCBpZiB0aGUgZW5kIG9mIHRoZSBjdXJzb3IgaGFzIGJlZW4gcmVhY2hlZC5cbiAgICBpZiAoZ2V0Q3Vyc29yQWR2YW5jZU1ldGhvZHMoKS5pbmNsdWRlcyhmdW5jKSkge1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24gKC4uLmFyZ3MpIHtcbiAgICAgICAgICAgIC8vIENhbGxpbmcgdGhlIG9yaWdpbmFsIGZ1bmN0aW9uIHdpdGggdGhlIHByb3h5IGFzICd0aGlzJyBjYXVzZXMgSUxMRUdBTCBJTlZPQ0FUSU9OLCBzbyB3ZSB1c2VcbiAgICAgICAgICAgIC8vIHRoZSBvcmlnaW5hbCBvYmplY3QuXG4gICAgICAgICAgICBmdW5jLmFwcGx5KHVud3JhcCh0aGlzKSwgYXJncyk7XG4gICAgICAgICAgICByZXR1cm4gd3JhcChjdXJzb3JSZXF1ZXN0TWFwLmdldCh0aGlzKSk7XG4gICAgICAgIH07XG4gICAgfVxuICAgIHJldHVybiBmdW5jdGlvbiAoLi4uYXJncykge1xuICAgICAgICAvLyBDYWxsaW5nIHRoZSBvcmlnaW5hbCBmdW5jdGlvbiB3aXRoIHRoZSBwcm94eSBhcyAndGhpcycgY2F1c2VzIElMTEVHQUwgSU5WT0NBVElPTiwgc28gd2UgdXNlXG4gICAgICAgIC8vIHRoZSBvcmlnaW5hbCBvYmplY3QuXG4gICAgICAgIHJldHVybiB3cmFwKGZ1bmMuYXBwbHkodW53cmFwKHRoaXMpLCBhcmdzKSk7XG4gICAgfTtcbn1cbmZ1bmN0aW9uIHRyYW5zZm9ybUNhY2hhYmxlVmFsdWUodmFsdWUpIHtcbiAgICBpZiAodHlwZW9mIHZhbHVlID09PSAnZnVuY3Rpb24nKVxuICAgICAgICByZXR1cm4gd3JhcEZ1bmN0aW9uKHZhbHVlKTtcbiAgICAvLyBUaGlzIGRvZXNuJ3QgcmV0dXJuLCBpdCBqdXN0IGNyZWF0ZXMgYSAnZG9uZScgcHJvbWlzZSBmb3IgdGhlIHRyYW5zYWN0aW9uLFxuICAgIC8vIHdoaWNoIGlzIGxhdGVyIHJldHVybmVkIGZvciB0cmFuc2FjdGlvbi5kb25lIChzZWUgaWRiT2JqZWN0SGFuZGxlcikuXG4gICAgaWYgKHZhbHVlIGluc3RhbmNlb2YgSURCVHJhbnNhY3Rpb24pXG4gICAgICAgIGNhY2hlRG9uZVByb21pc2VGb3JUcmFuc2FjdGlvbih2YWx1ZSk7XG4gICAgaWYgKGluc3RhbmNlT2ZBbnkodmFsdWUsIGdldElkYlByb3h5YWJsZVR5cGVzKCkpKVxuICAgICAgICByZXR1cm4gbmV3IFByb3h5KHZhbHVlLCBpZGJQcm94eVRyYXBzKTtcbiAgICAvLyBSZXR1cm4gdGhlIHNhbWUgdmFsdWUgYmFjayBpZiB3ZSdyZSBub3QgZ29pbmcgdG8gdHJhbnNmb3JtIGl0LlxuICAgIHJldHVybiB2YWx1ZTtcbn1cbmZ1bmN0aW9uIHdyYXAodmFsdWUpIHtcbiAgICAvLyBXZSBzb21ldGltZXMgZ2VuZXJhdGUgbXVsdGlwbGUgcHJvbWlzZXMgZnJvbSBhIHNpbmdsZSBJREJSZXF1ZXN0IChlZyB3aGVuIGN1cnNvcmluZyksIGJlY2F1c2VcbiAgICAvLyBJREIgaXMgd2VpcmQgYW5kIGEgc2luZ2xlIElEQlJlcXVlc3QgY2FuIHlpZWxkIG1hbnkgcmVzcG9uc2VzLCBzbyB0aGVzZSBjYW4ndCBiZSBjYWNoZWQuXG4gICAgaWYgKHZhbHVlIGluc3RhbmNlb2YgSURCUmVxdWVzdClcbiAgICAgICAgcmV0dXJuIHByb21pc2lmeVJlcXVlc3QodmFsdWUpO1xuICAgIC8vIElmIHdlJ3ZlIGFscmVhZHkgdHJhbnNmb3JtZWQgdGhpcyB2YWx1ZSBiZWZvcmUsIHJldXNlIHRoZSB0cmFuc2Zvcm1lZCB2YWx1ZS5cbiAgICAvLyBUaGlzIGlzIGZhc3RlciwgYnV0IGl0IGFsc28gcHJvdmlkZXMgb2JqZWN0IGVxdWFsaXR5LlxuICAgIGlmICh0cmFuc2Zvcm1DYWNoZS5oYXModmFsdWUpKVxuICAgICAgICByZXR1cm4gdHJhbnNmb3JtQ2FjaGUuZ2V0KHZhbHVlKTtcbiAgICBjb25zdCBuZXdWYWx1ZSA9IHRyYW5zZm9ybUNhY2hhYmxlVmFsdWUodmFsdWUpO1xuICAgIC8vIE5vdCBhbGwgdHlwZXMgYXJlIHRyYW5zZm9ybWVkLlxuICAgIC8vIFRoZXNlIG1heSBiZSBwcmltaXRpdmUgdHlwZXMsIHNvIHRoZXkgY2FuJ3QgYmUgV2Vha01hcCBrZXlzLlxuICAgIGlmIChuZXdWYWx1ZSAhPT0gdmFsdWUpIHtcbiAgICAgICAgdHJhbnNmb3JtQ2FjaGUuc2V0KHZhbHVlLCBuZXdWYWx1ZSk7XG4gICAgICAgIHJldmVyc2VUcmFuc2Zvcm1DYWNoZS5zZXQobmV3VmFsdWUsIHZhbHVlKTtcbiAgICB9XG4gICAgcmV0dXJuIG5ld1ZhbHVlO1xufVxuY29uc3QgdW53cmFwID0gKHZhbHVlKSA9PiByZXZlcnNlVHJhbnNmb3JtQ2FjaGUuZ2V0KHZhbHVlKTtcblxuZXhwb3J0IHsgcmV2ZXJzZVRyYW5zZm9ybUNhY2hlIGFzIGEsIGluc3RhbmNlT2ZBbnkgYXMgaSwgcmVwbGFjZVRyYXBzIGFzIHIsIHVud3JhcCBhcyB1LCB3cmFwIGFzIHcgfTtcbiIsImltcG9ydCB7IHcgYXMgd3JhcCwgciBhcyByZXBsYWNlVHJhcHMgfSBmcm9tICcuL3dyYXAtaWRiLXZhbHVlLmpzJztcbmV4cG9ydCB7IHUgYXMgdW53cmFwLCB3IGFzIHdyYXAgfSBmcm9tICcuL3dyYXAtaWRiLXZhbHVlLmpzJztcblxuLyoqXG4gKiBPcGVuIGEgZGF0YWJhc2UuXG4gKlxuICogQHBhcmFtIG5hbWUgTmFtZSBvZiB0aGUgZGF0YWJhc2UuXG4gKiBAcGFyYW0gdmVyc2lvbiBTY2hlbWEgdmVyc2lvbi5cbiAqIEBwYXJhbSBjYWxsYmFja3MgQWRkaXRpb25hbCBjYWxsYmFja3MuXG4gKi9cbmZ1bmN0aW9uIG9wZW5EQihuYW1lLCB2ZXJzaW9uLCB7IGJsb2NrZWQsIHVwZ3JhZGUsIGJsb2NraW5nLCB0ZXJtaW5hdGVkIH0gPSB7fSkge1xuICAgIGNvbnN0IHJlcXVlc3QgPSBpbmRleGVkREIub3BlbihuYW1lLCB2ZXJzaW9uKTtcbiAgICBjb25zdCBvcGVuUHJvbWlzZSA9IHdyYXAocmVxdWVzdCk7XG4gICAgaWYgKHVwZ3JhZGUpIHtcbiAgICAgICAgcmVxdWVzdC5hZGRFdmVudExpc3RlbmVyKCd1cGdyYWRlbmVlZGVkJywgKGV2ZW50KSA9PiB7XG4gICAgICAgICAgICB1cGdyYWRlKHdyYXAocmVxdWVzdC5yZXN1bHQpLCBldmVudC5vbGRWZXJzaW9uLCBldmVudC5uZXdWZXJzaW9uLCB3cmFwKHJlcXVlc3QudHJhbnNhY3Rpb24pLCBldmVudCk7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBpZiAoYmxvY2tlZCkge1xuICAgICAgICByZXF1ZXN0LmFkZEV2ZW50TGlzdGVuZXIoJ2Jsb2NrZWQnLCAoZXZlbnQpID0+IGJsb2NrZWQoXG4gICAgICAgIC8vIENhc3RpbmcgZHVlIHRvIGh0dHBzOi8vZ2l0aHViLmNvbS9taWNyb3NvZnQvVHlwZVNjcmlwdC1ET00tbGliLWdlbmVyYXRvci9wdWxsLzE0MDVcbiAgICAgICAgZXZlbnQub2xkVmVyc2lvbiwgZXZlbnQubmV3VmVyc2lvbiwgZXZlbnQpKTtcbiAgICB9XG4gICAgb3BlblByb21pc2VcbiAgICAgICAgLnRoZW4oKGRiKSA9PiB7XG4gICAgICAgIGlmICh0ZXJtaW5hdGVkKVxuICAgICAgICAgICAgZGIuYWRkRXZlbnRMaXN0ZW5lcignY2xvc2UnLCAoKSA9PiB0ZXJtaW5hdGVkKCkpO1xuICAgICAgICBpZiAoYmxvY2tpbmcpIHtcbiAgICAgICAgICAgIGRiLmFkZEV2ZW50TGlzdGVuZXIoJ3ZlcnNpb25jaGFuZ2UnLCAoZXZlbnQpID0+IGJsb2NraW5nKGV2ZW50Lm9sZFZlcnNpb24sIGV2ZW50Lm5ld1ZlcnNpb24sIGV2ZW50KSk7XG4gICAgICAgIH1cbiAgICB9KVxuICAgICAgICAuY2F0Y2goKCkgPT4geyB9KTtcbiAgICByZXR1cm4gb3BlblByb21pc2U7XG59XG4vKipcbiAqIERlbGV0ZSBhIGRhdGFiYXNlLlxuICpcbiAqIEBwYXJhbSBuYW1lIE5hbWUgb2YgdGhlIGRhdGFiYXNlLlxuICovXG5mdW5jdGlvbiBkZWxldGVEQihuYW1lLCB7IGJsb2NrZWQgfSA9IHt9KSB7XG4gICAgY29uc3QgcmVxdWVzdCA9IGluZGV4ZWREQi5kZWxldGVEYXRhYmFzZShuYW1lKTtcbiAgICBpZiAoYmxvY2tlZCkge1xuICAgICAgICByZXF1ZXN0LmFkZEV2ZW50TGlzdGVuZXIoJ2Jsb2NrZWQnLCAoZXZlbnQpID0+IGJsb2NrZWQoXG4gICAgICAgIC8vIENhc3RpbmcgZHVlIHRvIGh0dHBzOi8vZ2l0aHViLmNvbS9taWNyb3NvZnQvVHlwZVNjcmlwdC1ET00tbGliLWdlbmVyYXRvci9wdWxsLzE0MDVcbiAgICAgICAgZXZlbnQub2xkVmVyc2lvbiwgZXZlbnQpKTtcbiAgICB9XG4gICAgcmV0dXJuIHdyYXAocmVxdWVzdCkudGhlbigoKSA9PiB1bmRlZmluZWQpO1xufVxuXG5jb25zdCByZWFkTWV0aG9kcyA9IFsnZ2V0JywgJ2dldEtleScsICdnZXRBbGwnLCAnZ2V0QWxsS2V5cycsICdjb3VudCddO1xuY29uc3Qgd3JpdGVNZXRob2RzID0gWydwdXQnLCAnYWRkJywgJ2RlbGV0ZScsICdjbGVhciddO1xuY29uc3QgY2FjaGVkTWV0aG9kcyA9IG5ldyBNYXAoKTtcbmZ1bmN0aW9uIGdldE1ldGhvZCh0YXJnZXQsIHByb3ApIHtcbiAgICBpZiAoISh0YXJnZXQgaW5zdGFuY2VvZiBJREJEYXRhYmFzZSAmJlxuICAgICAgICAhKHByb3AgaW4gdGFyZ2V0KSAmJlxuICAgICAgICB0eXBlb2YgcHJvcCA9PT0gJ3N0cmluZycpKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKGNhY2hlZE1ldGhvZHMuZ2V0KHByb3ApKVxuICAgICAgICByZXR1cm4gY2FjaGVkTWV0aG9kcy5nZXQocHJvcCk7XG4gICAgY29uc3QgdGFyZ2V0RnVuY05hbWUgPSBwcm9wLnJlcGxhY2UoL0Zyb21JbmRleCQvLCAnJyk7XG4gICAgY29uc3QgdXNlSW5kZXggPSBwcm9wICE9PSB0YXJnZXRGdW5jTmFtZTtcbiAgICBjb25zdCBpc1dyaXRlID0gd3JpdGVNZXRob2RzLmluY2x1ZGVzKHRhcmdldEZ1bmNOYW1lKTtcbiAgICBpZiAoXG4gICAgLy8gQmFpbCBpZiB0aGUgdGFyZ2V0IGRvZXNuJ3QgZXhpc3Qgb24gdGhlIHRhcmdldC4gRWcsIGdldEFsbCBpc24ndCBpbiBFZGdlLlxuICAgICEodGFyZ2V0RnVuY05hbWUgaW4gKHVzZUluZGV4ID8gSURCSW5kZXggOiBJREJPYmplY3RTdG9yZSkucHJvdG90eXBlKSB8fFxuICAgICAgICAhKGlzV3JpdGUgfHwgcmVhZE1ldGhvZHMuaW5jbHVkZXModGFyZ2V0RnVuY05hbWUpKSkge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIGNvbnN0IG1ldGhvZCA9IGFzeW5jIGZ1bmN0aW9uIChzdG9yZU5hbWUsIC4uLmFyZ3MpIHtcbiAgICAgICAgLy8gaXNXcml0ZSA/ICdyZWFkd3JpdGUnIDogdW5kZWZpbmVkIGd6aXBwcyBiZXR0ZXIsIGJ1dCBmYWlscyBpbiBFZGdlIDooXG4gICAgICAgIGNvbnN0IHR4ID0gdGhpcy50cmFuc2FjdGlvbihzdG9yZU5hbWUsIGlzV3JpdGUgPyAncmVhZHdyaXRlJyA6ICdyZWFkb25seScpO1xuICAgICAgICBsZXQgdGFyZ2V0ID0gdHguc3RvcmU7XG4gICAgICAgIGlmICh1c2VJbmRleClcbiAgICAgICAgICAgIHRhcmdldCA9IHRhcmdldC5pbmRleChhcmdzLnNoaWZ0KCkpO1xuICAgICAgICAvLyBNdXN0IHJlamVjdCBpZiBvcCByZWplY3RzLlxuICAgICAgICAvLyBJZiBpdCdzIGEgd3JpdGUgb3BlcmF0aW9uLCBtdXN0IHJlamVjdCBpZiB0eC5kb25lIHJlamVjdHMuXG4gICAgICAgIC8vIE11c3QgcmVqZWN0IHdpdGggb3AgcmVqZWN0aW9uIGZpcnN0LlxuICAgICAgICAvLyBNdXN0IHJlc29sdmUgd2l0aCBvcCB2YWx1ZS5cbiAgICAgICAgLy8gTXVzdCBoYW5kbGUgYm90aCBwcm9taXNlcyAobm8gdW5oYW5kbGVkIHJlamVjdGlvbnMpXG4gICAgICAgIHJldHVybiAoYXdhaXQgUHJvbWlzZS5hbGwoW1xuICAgICAgICAgICAgdGFyZ2V0W3RhcmdldEZ1bmNOYW1lXSguLi5hcmdzKSxcbiAgICAgICAgICAgIGlzV3JpdGUgJiYgdHguZG9uZSxcbiAgICAgICAgXSkpWzBdO1xuICAgIH07XG4gICAgY2FjaGVkTWV0aG9kcy5zZXQocHJvcCwgbWV0aG9kKTtcbiAgICByZXR1cm4gbWV0aG9kO1xufVxucmVwbGFjZVRyYXBzKChvbGRUcmFwcykgPT4gKHtcbiAgICAuLi5vbGRUcmFwcyxcbiAgICBnZXQ6ICh0YXJnZXQsIHByb3AsIHJlY2VpdmVyKSA9PiBnZXRNZXRob2QodGFyZ2V0LCBwcm9wKSB8fCBvbGRUcmFwcy5nZXQodGFyZ2V0LCBwcm9wLCByZWNlaXZlciksXG4gICAgaGFzOiAodGFyZ2V0LCBwcm9wKSA9PiAhIWdldE1ldGhvZCh0YXJnZXQsIHByb3ApIHx8IG9sZFRyYXBzLmhhcyh0YXJnZXQsIHByb3ApLFxufSkpO1xuXG5leHBvcnQgeyBkZWxldGVEQiwgb3BlbkRCIH07XG4iLCJpbXBvcnQgeyBDb21wb25lbnQsIENvbXBvbmVudENvbnRhaW5lciB9IGZyb20gJ0BmaXJlYmFzZS9jb21wb25lbnQnO1xuaW1wb3J0IHsgTG9nZ2VyLCBzZXRVc2VyTG9nSGFuZGxlciwgc2V0TG9nTGV2ZWwgYXMgc2V0TG9nTGV2ZWwkMSB9IGZyb20gJ0BmaXJlYmFzZS9sb2dnZXInO1xuaW1wb3J0IHsgRXJyb3JGYWN0b3J5LCBnZXREZWZhdWx0QXBwQ29uZmlnLCBkZWVwRXF1YWwsIGlzQnJvd3NlciwgaXNXZWJXb3JrZXIsIEZpcmViYXNlRXJyb3IsIGJhc2U2NHVybEVuY29kZVdpdGhvdXRQYWRkaW5nLCBpc0luZGV4ZWREQkF2YWlsYWJsZSwgdmFsaWRhdGVJbmRleGVkREJPcGVuYWJsZSB9IGZyb20gJ0BmaXJlYmFzZS91dGlsJztcbmV4cG9ydCB7IEZpcmViYXNlRXJyb3IgfSBmcm9tICdAZmlyZWJhc2UvdXRpbCc7XG5pbXBvcnQgeyBvcGVuREIgfSBmcm9tICdpZGInO1xuXG4vKipcclxuICogQGxpY2Vuc2VcclxuICogQ29weXJpZ2h0IDIwMTkgR29vZ2xlIExMQ1xyXG4gKlxyXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xyXG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXHJcbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxyXG4gKlxyXG4gKiAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxyXG4gKlxyXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXHJcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcclxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXHJcbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcclxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXHJcbiAqL1xyXG5jbGFzcyBQbGF0Zm9ybUxvZ2dlclNlcnZpY2VJbXBsIHtcclxuICAgIGNvbnN0cnVjdG9yKGNvbnRhaW5lcikge1xyXG4gICAgICAgIHRoaXMuY29udGFpbmVyID0gY29udGFpbmVyO1xyXG4gICAgfVxyXG4gICAgLy8gSW4gaW5pdGlhbCBpbXBsZW1lbnRhdGlvbiwgdGhpcyB3aWxsIGJlIGNhbGxlZCBieSBpbnN0YWxsYXRpb25zIG9uXHJcbiAgICAvLyBhdXRoIHRva2VuIHJlZnJlc2gsIGFuZCBpbnN0YWxsYXRpb25zIHdpbGwgc2VuZCB0aGlzIHN0cmluZy5cclxuICAgIGdldFBsYXRmb3JtSW5mb1N0cmluZygpIHtcclxuICAgICAgICBjb25zdCBwcm92aWRlcnMgPSB0aGlzLmNvbnRhaW5lci5nZXRQcm92aWRlcnMoKTtcclxuICAgICAgICAvLyBMb29wIHRocm91Z2ggcHJvdmlkZXJzIGFuZCBnZXQgbGlicmFyeS92ZXJzaW9uIHBhaXJzIGZyb20gYW55IHRoYXQgYXJlXHJcbiAgICAgICAgLy8gdmVyc2lvbiBjb21wb25lbnRzLlxyXG4gICAgICAgIHJldHVybiBwcm92aWRlcnNcclxuICAgICAgICAgICAgLm1hcChwcm92aWRlciA9PiB7XHJcbiAgICAgICAgICAgIGlmIChpc1ZlcnNpb25TZXJ2aWNlUHJvdmlkZXIocHJvdmlkZXIpKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBzZXJ2aWNlID0gcHJvdmlkZXIuZ2V0SW1tZWRpYXRlKCk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gYCR7c2VydmljZS5saWJyYXJ5fS8ke3NlcnZpY2UudmVyc2lvbn1gO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KVxyXG4gICAgICAgICAgICAuZmlsdGVyKGxvZ1N0cmluZyA9PiBsb2dTdHJpbmcpXHJcbiAgICAgICAgICAgIC5qb2luKCcgJyk7XHJcbiAgICB9XHJcbn1cclxuLyoqXHJcbiAqXHJcbiAqIEBwYXJhbSBwcm92aWRlciBjaGVjayBpZiB0aGlzIHByb3ZpZGVyIHByb3ZpZGVzIGEgVmVyc2lvblNlcnZpY2VcclxuICpcclxuICogTk9URTogVXNpbmcgUHJvdmlkZXI8J2FwcC12ZXJzaW9uJz4gaXMgYSBoYWNrIHRvIGluZGljYXRlIHRoYXQgdGhlIHByb3ZpZGVyXHJcbiAqIHByb3ZpZGVzIFZlcnNpb25TZXJ2aWNlLiBUaGUgcHJvdmlkZXIgaXMgbm90IG5lY2Vzc2FyaWx5IGEgJ2FwcC12ZXJzaW9uJ1xyXG4gKiBwcm92aWRlci5cclxuICovXHJcbmZ1bmN0aW9uIGlzVmVyc2lvblNlcnZpY2VQcm92aWRlcihwcm92aWRlcikge1xyXG4gICAgY29uc3QgY29tcG9uZW50ID0gcHJvdmlkZXIuZ2V0Q29tcG9uZW50KCk7XHJcbiAgICByZXR1cm4gKGNvbXBvbmVudCA9PT0gbnVsbCB8fCBjb21wb25lbnQgPT09IHZvaWQgMCA/IHZvaWQgMCA6IGNvbXBvbmVudC50eXBlKSA9PT0gXCJWRVJTSU9OXCIgLyogQ29tcG9uZW50VHlwZS5WRVJTSU9OICovO1xyXG59XG5cbmNvbnN0IG5hbWUkcCA9IFwiQGZpcmViYXNlL2FwcFwiO1xuY29uc3QgdmVyc2lvbiQxID0gXCIwLjEwLjEwXCI7XG5cbi8qKlxyXG4gKiBAbGljZW5zZVxyXG4gKiBDb3B5cmlnaHQgMjAxOSBHb29nbGUgTExDXHJcbiAqXHJcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XHJcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cclxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XHJcbiAqXHJcbiAqICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXHJcbiAqXHJcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcclxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxyXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cclxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxyXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cclxuICovXHJcbmNvbnN0IGxvZ2dlciA9IG5ldyBMb2dnZXIoJ0BmaXJlYmFzZS9hcHAnKTtcblxuY29uc3QgbmFtZSRvID0gXCJAZmlyZWJhc2UvYXBwLWNvbXBhdFwiO1xuXG5jb25zdCBuYW1lJG4gPSBcIkBmaXJlYmFzZS9hbmFseXRpY3MtY29tcGF0XCI7XG5cbmNvbnN0IG5hbWUkbSA9IFwiQGZpcmViYXNlL2FuYWx5dGljc1wiO1xuXG5jb25zdCBuYW1lJGwgPSBcIkBmaXJlYmFzZS9hcHAtY2hlY2stY29tcGF0XCI7XG5cbmNvbnN0IG5hbWUkayA9IFwiQGZpcmViYXNlL2FwcC1jaGVja1wiO1xuXG5jb25zdCBuYW1lJGogPSBcIkBmaXJlYmFzZS9hdXRoXCI7XG5cbmNvbnN0IG5hbWUkaSA9IFwiQGZpcmViYXNlL2F1dGgtY29tcGF0XCI7XG5cbmNvbnN0IG5hbWUkaCA9IFwiQGZpcmViYXNlL2RhdGFiYXNlXCI7XG5cbmNvbnN0IG5hbWUkZyA9IFwiQGZpcmViYXNlL2RhdGFiYXNlLWNvbXBhdFwiO1xuXG5jb25zdCBuYW1lJGYgPSBcIkBmaXJlYmFzZS9mdW5jdGlvbnNcIjtcblxuY29uc3QgbmFtZSRlID0gXCJAZmlyZWJhc2UvZnVuY3Rpb25zLWNvbXBhdFwiO1xuXG5jb25zdCBuYW1lJGQgPSBcIkBmaXJlYmFzZS9pbnN0YWxsYXRpb25zXCI7XG5cbmNvbnN0IG5hbWUkYyA9IFwiQGZpcmViYXNlL2luc3RhbGxhdGlvbnMtY29tcGF0XCI7XG5cbmNvbnN0IG5hbWUkYiA9IFwiQGZpcmViYXNlL21lc3NhZ2luZ1wiO1xuXG5jb25zdCBuYW1lJGEgPSBcIkBmaXJlYmFzZS9tZXNzYWdpbmctY29tcGF0XCI7XG5cbmNvbnN0IG5hbWUkOSA9IFwiQGZpcmViYXNlL3BlcmZvcm1hbmNlXCI7XG5cbmNvbnN0IG5hbWUkOCA9IFwiQGZpcmViYXNlL3BlcmZvcm1hbmNlLWNvbXBhdFwiO1xuXG5jb25zdCBuYW1lJDcgPSBcIkBmaXJlYmFzZS9yZW1vdGUtY29uZmlnXCI7XG5cbmNvbnN0IG5hbWUkNiA9IFwiQGZpcmViYXNlL3JlbW90ZS1jb25maWctY29tcGF0XCI7XG5cbmNvbnN0IG5hbWUkNSA9IFwiQGZpcmViYXNlL3N0b3JhZ2VcIjtcblxuY29uc3QgbmFtZSQ0ID0gXCJAZmlyZWJhc2Uvc3RvcmFnZS1jb21wYXRcIjtcblxuY29uc3QgbmFtZSQzID0gXCJAZmlyZWJhc2UvZmlyZXN0b3JlXCI7XG5cbmNvbnN0IG5hbWUkMiA9IFwiQGZpcmViYXNlL3ZlcnRleGFpLXByZXZpZXdcIjtcblxuY29uc3QgbmFtZSQxID0gXCJAZmlyZWJhc2UvZmlyZXN0b3JlLWNvbXBhdFwiO1xuXG5jb25zdCBuYW1lID0gXCJmaXJlYmFzZVwiO1xuY29uc3QgdmVyc2lvbiA9IFwiMTAuMTMuMVwiO1xuXG4vKipcclxuICogQGxpY2Vuc2VcclxuICogQ29weXJpZ2h0IDIwMTkgR29vZ2xlIExMQ1xyXG4gKlxyXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xyXG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXHJcbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxyXG4gKlxyXG4gKiAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxyXG4gKlxyXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXHJcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcclxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXHJcbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcclxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXHJcbiAqL1xyXG4vKipcclxuICogVGhlIGRlZmF1bHQgYXBwIG5hbWVcclxuICpcclxuICogQGludGVybmFsXHJcbiAqL1xyXG5jb25zdCBERUZBVUxUX0VOVFJZX05BTUUgPSAnW0RFRkFVTFRdJztcclxuY29uc3QgUExBVEZPUk1fTE9HX1NUUklORyA9IHtcclxuICAgIFtuYW1lJHBdOiAnZmlyZS1jb3JlJyxcclxuICAgIFtuYW1lJG9dOiAnZmlyZS1jb3JlLWNvbXBhdCcsXHJcbiAgICBbbmFtZSRtXTogJ2ZpcmUtYW5hbHl0aWNzJyxcclxuICAgIFtuYW1lJG5dOiAnZmlyZS1hbmFseXRpY3MtY29tcGF0JyxcclxuICAgIFtuYW1lJGtdOiAnZmlyZS1hcHAtY2hlY2snLFxyXG4gICAgW25hbWUkbF06ICdmaXJlLWFwcC1jaGVjay1jb21wYXQnLFxyXG4gICAgW25hbWUkal06ICdmaXJlLWF1dGgnLFxyXG4gICAgW25hbWUkaV06ICdmaXJlLWF1dGgtY29tcGF0JyxcclxuICAgIFtuYW1lJGhdOiAnZmlyZS1ydGRiJyxcclxuICAgIFtuYW1lJGddOiAnZmlyZS1ydGRiLWNvbXBhdCcsXHJcbiAgICBbbmFtZSRmXTogJ2ZpcmUtZm4nLFxyXG4gICAgW25hbWUkZV06ICdmaXJlLWZuLWNvbXBhdCcsXHJcbiAgICBbbmFtZSRkXTogJ2ZpcmUtaWlkJyxcclxuICAgIFtuYW1lJGNdOiAnZmlyZS1paWQtY29tcGF0JyxcclxuICAgIFtuYW1lJGJdOiAnZmlyZS1mY20nLFxyXG4gICAgW25hbWUkYV06ICdmaXJlLWZjbS1jb21wYXQnLFxyXG4gICAgW25hbWUkOV06ICdmaXJlLXBlcmYnLFxyXG4gICAgW25hbWUkOF06ICdmaXJlLXBlcmYtY29tcGF0JyxcclxuICAgIFtuYW1lJDddOiAnZmlyZS1yYycsXHJcbiAgICBbbmFtZSQ2XTogJ2ZpcmUtcmMtY29tcGF0JyxcclxuICAgIFtuYW1lJDVdOiAnZmlyZS1nY3MnLFxyXG4gICAgW25hbWUkNF06ICdmaXJlLWdjcy1jb21wYXQnLFxyXG4gICAgW25hbWUkM106ICdmaXJlLWZzdCcsXHJcbiAgICBbbmFtZSQxXTogJ2ZpcmUtZnN0LWNvbXBhdCcsXHJcbiAgICBbbmFtZSQyXTogJ2ZpcmUtdmVydGV4JyxcclxuICAgICdmaXJlLWpzJzogJ2ZpcmUtanMnLFxyXG4gICAgW25hbWVdOiAnZmlyZS1qcy1hbGwnXHJcbn07XG5cbi8qKlxyXG4gKiBAbGljZW5zZVxyXG4gKiBDb3B5cmlnaHQgMjAxOSBHb29nbGUgTExDXHJcbiAqXHJcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XHJcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cclxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XHJcbiAqXHJcbiAqICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXHJcbiAqXHJcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcclxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxyXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cclxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxyXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cclxuICovXHJcbi8qKlxyXG4gKiBAaW50ZXJuYWxcclxuICovXHJcbmNvbnN0IF9hcHBzID0gbmV3IE1hcCgpO1xyXG4vKipcclxuICogQGludGVybmFsXHJcbiAqL1xyXG5jb25zdCBfc2VydmVyQXBwcyA9IG5ldyBNYXAoKTtcclxuLyoqXHJcbiAqIFJlZ2lzdGVyZWQgY29tcG9uZW50cy5cclxuICpcclxuICogQGludGVybmFsXHJcbiAqL1xyXG4vLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L25vLWV4cGxpY2l0LWFueVxyXG5jb25zdCBfY29tcG9uZW50cyA9IG5ldyBNYXAoKTtcclxuLyoqXHJcbiAqIEBwYXJhbSBjb21wb25lbnQgLSB0aGUgY29tcG9uZW50IGJlaW5nIGFkZGVkIHRvIHRoaXMgYXBwJ3MgY29udGFpbmVyXHJcbiAqXHJcbiAqIEBpbnRlcm5hbFxyXG4gKi9cclxuZnVuY3Rpb24gX2FkZENvbXBvbmVudChhcHAsIGNvbXBvbmVudCkge1xyXG4gICAgdHJ5IHtcclxuICAgICAgICBhcHAuY29udGFpbmVyLmFkZENvbXBvbmVudChjb21wb25lbnQpO1xyXG4gICAgfVxyXG4gICAgY2F0Y2ggKGUpIHtcclxuICAgICAgICBsb2dnZXIuZGVidWcoYENvbXBvbmVudCAke2NvbXBvbmVudC5uYW1lfSBmYWlsZWQgdG8gcmVnaXN0ZXIgd2l0aCBGaXJlYmFzZUFwcCAke2FwcC5uYW1lfWAsIGUpO1xyXG4gICAgfVxyXG59XHJcbi8qKlxyXG4gKlxyXG4gKiBAaW50ZXJuYWxcclxuICovXHJcbmZ1bmN0aW9uIF9hZGRPck92ZXJ3cml0ZUNvbXBvbmVudChhcHAsIGNvbXBvbmVudCkge1xyXG4gICAgYXBwLmNvbnRhaW5lci5hZGRPck92ZXJ3cml0ZUNvbXBvbmVudChjb21wb25lbnQpO1xyXG59XHJcbi8qKlxyXG4gKlxyXG4gKiBAcGFyYW0gY29tcG9uZW50IC0gdGhlIGNvbXBvbmVudCB0byByZWdpc3RlclxyXG4gKiBAcmV0dXJucyB3aGV0aGVyIG9yIG5vdCB0aGUgY29tcG9uZW50IGlzIHJlZ2lzdGVyZWQgc3VjY2Vzc2Z1bGx5XHJcbiAqXHJcbiAqIEBpbnRlcm5hbFxyXG4gKi9cclxuZnVuY3Rpb24gX3JlZ2lzdGVyQ29tcG9uZW50KGNvbXBvbmVudCkge1xyXG4gICAgY29uc3QgY29tcG9uZW50TmFtZSA9IGNvbXBvbmVudC5uYW1lO1xyXG4gICAgaWYgKF9jb21wb25lbnRzLmhhcyhjb21wb25lbnROYW1lKSkge1xyXG4gICAgICAgIGxvZ2dlci5kZWJ1ZyhgVGhlcmUgd2VyZSBtdWx0aXBsZSBhdHRlbXB0cyB0byByZWdpc3RlciBjb21wb25lbnQgJHtjb21wb25lbnROYW1lfS5gKTtcclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcbiAgICBfY29tcG9uZW50cy5zZXQoY29tcG9uZW50TmFtZSwgY29tcG9uZW50KTtcclxuICAgIC8vIGFkZCB0aGUgY29tcG9uZW50IHRvIGV4aXN0aW5nIGFwcCBpbnN0YW5jZXNcclxuICAgIGZvciAoY29uc3QgYXBwIG9mIF9hcHBzLnZhbHVlcygpKSB7XHJcbiAgICAgICAgX2FkZENvbXBvbmVudChhcHAsIGNvbXBvbmVudCk7XHJcbiAgICB9XHJcbiAgICBmb3IgKGNvbnN0IHNlcnZlckFwcCBvZiBfc2VydmVyQXBwcy52YWx1ZXMoKSkge1xyXG4gICAgICAgIF9hZGRDb21wb25lbnQoc2VydmVyQXBwLCBjb21wb25lbnQpO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHRydWU7XHJcbn1cclxuLyoqXHJcbiAqXHJcbiAqIEBwYXJhbSBhcHAgLSBGaXJlYmFzZUFwcCBpbnN0YW5jZVxyXG4gKiBAcGFyYW0gbmFtZSAtIHNlcnZpY2UgbmFtZVxyXG4gKlxyXG4gKiBAcmV0dXJucyB0aGUgcHJvdmlkZXIgZm9yIHRoZSBzZXJ2aWNlIHdpdGggdGhlIG1hdGNoaW5nIG5hbWVcclxuICpcclxuICogQGludGVybmFsXHJcbiAqL1xyXG5mdW5jdGlvbiBfZ2V0UHJvdmlkZXIoYXBwLCBuYW1lKSB7XHJcbiAgICBjb25zdCBoZWFydGJlYXRDb250cm9sbGVyID0gYXBwLmNvbnRhaW5lclxyXG4gICAgICAgIC5nZXRQcm92aWRlcignaGVhcnRiZWF0JylcclxuICAgICAgICAuZ2V0SW1tZWRpYXRlKHsgb3B0aW9uYWw6IHRydWUgfSk7XHJcbiAgICBpZiAoaGVhcnRiZWF0Q29udHJvbGxlcikge1xyXG4gICAgICAgIHZvaWQgaGVhcnRiZWF0Q29udHJvbGxlci50cmlnZ2VySGVhcnRiZWF0KCk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gYXBwLmNvbnRhaW5lci5nZXRQcm92aWRlcihuYW1lKTtcclxufVxyXG4vKipcclxuICpcclxuICogQHBhcmFtIGFwcCAtIEZpcmViYXNlQXBwIGluc3RhbmNlXHJcbiAqIEBwYXJhbSBuYW1lIC0gc2VydmljZSBuYW1lXHJcbiAqIEBwYXJhbSBpbnN0YW5jZUlkZW50aWZpZXIgLSBzZXJ2aWNlIGluc3RhbmNlIGlkZW50aWZpZXIgaW4gY2FzZSB0aGUgc2VydmljZSBzdXBwb3J0cyBtdWx0aXBsZSBpbnN0YW5jZXNcclxuICpcclxuICogQGludGVybmFsXHJcbiAqL1xyXG5mdW5jdGlvbiBfcmVtb3ZlU2VydmljZUluc3RhbmNlKGFwcCwgbmFtZSwgaW5zdGFuY2VJZGVudGlmaWVyID0gREVGQVVMVF9FTlRSWV9OQU1FKSB7XHJcbiAgICBfZ2V0UHJvdmlkZXIoYXBwLCBuYW1lKS5jbGVhckluc3RhbmNlKGluc3RhbmNlSWRlbnRpZmllcik7XHJcbn1cclxuLyoqXHJcbiAqXHJcbiAqIEBwYXJhbSBvYmogLSBhbiBvYmplY3Qgb2YgdHlwZSBGaXJlYmFzZUFwcCBvciBGaXJlYmFzZU9wdGlvbnMuXHJcbiAqXHJcbiAqIEByZXR1cm5zIHRydWUgaWYgdGhlIHByb3ZpZGUgb2JqZWN0IGlzIG9mIHR5cGUgRmlyZWJhc2VBcHAuXHJcbiAqXHJcbiAqIEBpbnRlcm5hbFxyXG4gKi9cclxuZnVuY3Rpb24gX2lzRmlyZWJhc2VBcHAob2JqKSB7XHJcbiAgICByZXR1cm4gb2JqLm9wdGlvbnMgIT09IHVuZGVmaW5lZDtcclxufVxyXG4vKipcclxuICpcclxuICogQHBhcmFtIG9iaiAtIGFuIG9iamVjdCBvZiB0eXBlIEZpcmViYXNlQXBwLlxyXG4gKlxyXG4gKiBAcmV0dXJucyB0cnVlIGlmIHRoZSBwcm92aWRlZCBvYmplY3QgaXMgb2YgdHlwZSBGaXJlYmFzZVNlcnZlckFwcEltcGwuXHJcbiAqXHJcbiAqIEBpbnRlcm5hbFxyXG4gKi9cclxuZnVuY3Rpb24gX2lzRmlyZWJhc2VTZXJ2ZXJBcHAob2JqKSB7XHJcbiAgICByZXR1cm4gb2JqLnNldHRpbmdzICE9PSB1bmRlZmluZWQ7XHJcbn1cclxuLyoqXHJcbiAqIFRlc3Qgb25seVxyXG4gKlxyXG4gKiBAaW50ZXJuYWxcclxuICovXHJcbmZ1bmN0aW9uIF9jbGVhckNvbXBvbmVudHMoKSB7XHJcbiAgICBfY29tcG9uZW50cy5jbGVhcigpO1xyXG59XG5cbi8qKlxyXG4gKiBAbGljZW5zZVxyXG4gKiBDb3B5cmlnaHQgMjAxOSBHb29nbGUgTExDXHJcbiAqXHJcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XHJcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cclxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XHJcbiAqXHJcbiAqICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXHJcbiAqXHJcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcclxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxyXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cclxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxyXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cclxuICovXHJcbmNvbnN0IEVSUk9SUyA9IHtcclxuICAgIFtcIm5vLWFwcFwiIC8qIEFwcEVycm9yLk5PX0FQUCAqL106IFwiTm8gRmlyZWJhc2UgQXBwICd7JGFwcE5hbWV9JyBoYXMgYmVlbiBjcmVhdGVkIC0gXCIgK1xyXG4gICAgICAgICdjYWxsIGluaXRpYWxpemVBcHAoKSBmaXJzdCcsXHJcbiAgICBbXCJiYWQtYXBwLW5hbWVcIiAvKiBBcHBFcnJvci5CQURfQVBQX05BTUUgKi9dOiBcIklsbGVnYWwgQXBwIG5hbWU6ICd7JGFwcE5hbWV9J1wiLFxyXG4gICAgW1wiZHVwbGljYXRlLWFwcFwiIC8qIEFwcEVycm9yLkRVUExJQ0FURV9BUFAgKi9dOiBcIkZpcmViYXNlIEFwcCBuYW1lZCAneyRhcHBOYW1lfScgYWxyZWFkeSBleGlzdHMgd2l0aCBkaWZmZXJlbnQgb3B0aW9ucyBvciBjb25maWdcIixcclxuICAgIFtcImFwcC1kZWxldGVkXCIgLyogQXBwRXJyb3IuQVBQX0RFTEVURUQgKi9dOiBcIkZpcmViYXNlIEFwcCBuYW1lZCAneyRhcHBOYW1lfScgYWxyZWFkeSBkZWxldGVkXCIsXHJcbiAgICBbXCJzZXJ2ZXItYXBwLWRlbGV0ZWRcIiAvKiBBcHBFcnJvci5TRVJWRVJfQVBQX0RFTEVURUQgKi9dOiAnRmlyZWJhc2UgU2VydmVyIEFwcCBoYXMgYmVlbiBkZWxldGVkJyxcclxuICAgIFtcIm5vLW9wdGlvbnNcIiAvKiBBcHBFcnJvci5OT19PUFRJT05TICovXTogJ05lZWQgdG8gcHJvdmlkZSBvcHRpb25zLCB3aGVuIG5vdCBiZWluZyBkZXBsb3llZCB0byBob3N0aW5nIHZpYSBzb3VyY2UuJyxcclxuICAgIFtcImludmFsaWQtYXBwLWFyZ3VtZW50XCIgLyogQXBwRXJyb3IuSU5WQUxJRF9BUFBfQVJHVU1FTlQgKi9dOiAnZmlyZWJhc2UueyRhcHBOYW1lfSgpIHRha2VzIGVpdGhlciBubyBhcmd1bWVudCBvciBhICcgK1xyXG4gICAgICAgICdGaXJlYmFzZSBBcHAgaW5zdGFuY2UuJyxcclxuICAgIFtcImludmFsaWQtbG9nLWFyZ3VtZW50XCIgLyogQXBwRXJyb3IuSU5WQUxJRF9MT0dfQVJHVU1FTlQgKi9dOiAnRmlyc3QgYXJndW1lbnQgdG8gYG9uTG9nYCBtdXN0IGJlIG51bGwgb3IgYSBmdW5jdGlvbi4nLFxyXG4gICAgW1wiaWRiLW9wZW5cIiAvKiBBcHBFcnJvci5JREJfT1BFTiAqL106ICdFcnJvciB0aHJvd24gd2hlbiBvcGVuaW5nIEluZGV4ZWREQi4gT3JpZ2luYWwgZXJyb3I6IHskb3JpZ2luYWxFcnJvck1lc3NhZ2V9LicsXHJcbiAgICBbXCJpZGItZ2V0XCIgLyogQXBwRXJyb3IuSURCX0dFVCAqL106ICdFcnJvciB0aHJvd24gd2hlbiByZWFkaW5nIGZyb20gSW5kZXhlZERCLiBPcmlnaW5hbCBlcnJvcjogeyRvcmlnaW5hbEVycm9yTWVzc2FnZX0uJyxcclxuICAgIFtcImlkYi1zZXRcIiAvKiBBcHBFcnJvci5JREJfV1JJVEUgKi9dOiAnRXJyb3IgdGhyb3duIHdoZW4gd3JpdGluZyB0byBJbmRleGVkREIuIE9yaWdpbmFsIGVycm9yOiB7JG9yaWdpbmFsRXJyb3JNZXNzYWdlfS4nLFxyXG4gICAgW1wiaWRiLWRlbGV0ZVwiIC8qIEFwcEVycm9yLklEQl9ERUxFVEUgKi9dOiAnRXJyb3IgdGhyb3duIHdoZW4gZGVsZXRpbmcgZnJvbSBJbmRleGVkREIuIE9yaWdpbmFsIGVycm9yOiB7JG9yaWdpbmFsRXJyb3JNZXNzYWdlfS4nLFxyXG4gICAgW1wiZmluYWxpemF0aW9uLXJlZ2lzdHJ5LW5vdC1zdXBwb3J0ZWRcIiAvKiBBcHBFcnJvci5GSU5BTElaQVRJT05fUkVHSVNUUllfTk9UX1NVUFBPUlRFRCAqL106ICdGaXJlYmFzZVNlcnZlckFwcCBkZWxldGVPbkRlcmVmIGZpZWxkIGRlZmluZWQgYnV0IHRoZSBKUyBydW50aW1lIGRvZXMgbm90IHN1cHBvcnQgRmluYWxpemF0aW9uUmVnaXN0cnkuJyxcclxuICAgIFtcImludmFsaWQtc2VydmVyLWFwcC1lbnZpcm9ubWVudFwiIC8qIEFwcEVycm9yLklOVkFMSURfU0VSVkVSX0FQUF9FTlZJUk9OTUVOVCAqL106ICdGaXJlYmFzZVNlcnZlckFwcCBpcyBub3QgZm9yIHVzZSBpbiBicm93c2VyIGVudmlyb25tZW50cy4nXHJcbn07XHJcbmNvbnN0IEVSUk9SX0ZBQ1RPUlkgPSBuZXcgRXJyb3JGYWN0b3J5KCdhcHAnLCAnRmlyZWJhc2UnLCBFUlJPUlMpO1xuXG4vKipcclxuICogQGxpY2Vuc2VcclxuICogQ29weXJpZ2h0IDIwMTkgR29vZ2xlIExMQ1xyXG4gKlxyXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xyXG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXHJcbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxyXG4gKlxyXG4gKiAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxyXG4gKlxyXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXHJcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcclxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXHJcbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcclxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXHJcbiAqL1xyXG5jbGFzcyBGaXJlYmFzZUFwcEltcGwge1xyXG4gICAgY29uc3RydWN0b3Iob3B0aW9ucywgY29uZmlnLCBjb250YWluZXIpIHtcclxuICAgICAgICB0aGlzLl9pc0RlbGV0ZWQgPSBmYWxzZTtcclxuICAgICAgICB0aGlzLl9vcHRpb25zID0gT2JqZWN0LmFzc2lnbih7fSwgb3B0aW9ucyk7XHJcbiAgICAgICAgdGhpcy5fY29uZmlnID0gT2JqZWN0LmFzc2lnbih7fSwgY29uZmlnKTtcclxuICAgICAgICB0aGlzLl9uYW1lID0gY29uZmlnLm5hbWU7XHJcbiAgICAgICAgdGhpcy5fYXV0b21hdGljRGF0YUNvbGxlY3Rpb25FbmFibGVkID1cclxuICAgICAgICAgICAgY29uZmlnLmF1dG9tYXRpY0RhdGFDb2xsZWN0aW9uRW5hYmxlZDtcclxuICAgICAgICB0aGlzLl9jb250YWluZXIgPSBjb250YWluZXI7XHJcbiAgICAgICAgdGhpcy5jb250YWluZXIuYWRkQ29tcG9uZW50KG5ldyBDb21wb25lbnQoJ2FwcCcsICgpID0+IHRoaXMsIFwiUFVCTElDXCIgLyogQ29tcG9uZW50VHlwZS5QVUJMSUMgKi8pKTtcclxuICAgIH1cclxuICAgIGdldCBhdXRvbWF0aWNEYXRhQ29sbGVjdGlvbkVuYWJsZWQoKSB7XHJcbiAgICAgICAgdGhpcy5jaGVja0Rlc3Ryb3llZCgpO1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9hdXRvbWF0aWNEYXRhQ29sbGVjdGlvbkVuYWJsZWQ7XHJcbiAgICB9XHJcbiAgICBzZXQgYXV0b21hdGljRGF0YUNvbGxlY3Rpb25FbmFibGVkKHZhbCkge1xyXG4gICAgICAgIHRoaXMuY2hlY2tEZXN0cm95ZWQoKTtcclxuICAgICAgICB0aGlzLl9hdXRvbWF0aWNEYXRhQ29sbGVjdGlvbkVuYWJsZWQgPSB2YWw7XHJcbiAgICB9XHJcbiAgICBnZXQgbmFtZSgpIHtcclxuICAgICAgICB0aGlzLmNoZWNrRGVzdHJveWVkKCk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX25hbWU7XHJcbiAgICB9XHJcbiAgICBnZXQgb3B0aW9ucygpIHtcclxuICAgICAgICB0aGlzLmNoZWNrRGVzdHJveWVkKCk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX29wdGlvbnM7XHJcbiAgICB9XHJcbiAgICBnZXQgY29uZmlnKCkge1xyXG4gICAgICAgIHRoaXMuY2hlY2tEZXN0cm95ZWQoKTtcclxuICAgICAgICByZXR1cm4gdGhpcy5fY29uZmlnO1xyXG4gICAgfVxyXG4gICAgZ2V0IGNvbnRhaW5lcigpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fY29udGFpbmVyO1xyXG4gICAgfVxyXG4gICAgZ2V0IGlzRGVsZXRlZCgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5faXNEZWxldGVkO1xyXG4gICAgfVxyXG4gICAgc2V0IGlzRGVsZXRlZCh2YWwpIHtcclxuICAgICAgICB0aGlzLl9pc0RlbGV0ZWQgPSB2YWw7XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIFRoaXMgZnVuY3Rpb24gd2lsbCB0aHJvdyBhbiBFcnJvciBpZiB0aGUgQXBwIGhhcyBhbHJlYWR5IGJlZW4gZGVsZXRlZCAtXHJcbiAgICAgKiB1c2UgYmVmb3JlIHBlcmZvcm1pbmcgQVBJIGFjdGlvbnMgb24gdGhlIEFwcC5cclxuICAgICAqL1xyXG4gICAgY2hlY2tEZXN0cm95ZWQoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuaXNEZWxldGVkKSB7XHJcbiAgICAgICAgICAgIHRocm93IEVSUk9SX0ZBQ1RPUlkuY3JlYXRlKFwiYXBwLWRlbGV0ZWRcIiAvKiBBcHBFcnJvci5BUFBfREVMRVRFRCAqLywgeyBhcHBOYW1lOiB0aGlzLl9uYW1lIH0pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxuXG4vKipcclxuICogQGxpY2Vuc2VcclxuICogQ29weXJpZ2h0IDIwMjMgR29vZ2xlIExMQ1xyXG4gKlxyXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xyXG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXHJcbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxyXG4gKlxyXG4gKiAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxyXG4gKlxyXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXHJcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcclxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXHJcbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcclxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXHJcbiAqL1xyXG5jbGFzcyBGaXJlYmFzZVNlcnZlckFwcEltcGwgZXh0ZW5kcyBGaXJlYmFzZUFwcEltcGwge1xyXG4gICAgY29uc3RydWN0b3Iob3B0aW9ucywgc2VydmVyQ29uZmlnLCBuYW1lLCBjb250YWluZXIpIHtcclxuICAgICAgICAvLyBCdWlsZCBjb25maWd1cmF0aW9uIHBhcmFtZXRlcnMgZm9yIHRoZSBGaXJlYmFzZUFwcEltcGwgYmFzZSBjbGFzcy5cclxuICAgICAgICBjb25zdCBhdXRvbWF0aWNEYXRhQ29sbGVjdGlvbkVuYWJsZWQgPSBzZXJ2ZXJDb25maWcuYXV0b21hdGljRGF0YUNvbGxlY3Rpb25FbmFibGVkICE9PSB1bmRlZmluZWRcclxuICAgICAgICAgICAgPyBzZXJ2ZXJDb25maWcuYXV0b21hdGljRGF0YUNvbGxlY3Rpb25FbmFibGVkXHJcbiAgICAgICAgICAgIDogZmFsc2U7XHJcbiAgICAgICAgLy8gQ3JlYXRlIHRoZSBGaXJlYmFzZUFwcFNldHRpbmdzIG9iamVjdCBmb3IgdGhlIEZpcmViYXNlQXBwSW1wIGNvbnN0cnVjdG9yLlxyXG4gICAgICAgIGNvbnN0IGNvbmZpZyA9IHtcclxuICAgICAgICAgICAgbmFtZSxcclxuICAgICAgICAgICAgYXV0b21hdGljRGF0YUNvbGxlY3Rpb25FbmFibGVkXHJcbiAgICAgICAgfTtcclxuICAgICAgICBpZiAob3B0aW9ucy5hcGlLZXkgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAvLyBDb25zdHJ1Y3QgdGhlIHBhcmVudCBGaXJlYmFzZUFwcEltcCBvYmplY3QuXHJcbiAgICAgICAgICAgIHN1cGVyKG9wdGlvbnMsIGNvbmZpZywgY29udGFpbmVyKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGFwcEltcGwgPSBvcHRpb25zO1xyXG4gICAgICAgICAgICBzdXBlcihhcHBJbXBsLm9wdGlvbnMsIGNvbmZpZywgY29udGFpbmVyKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gTm93IGNvbnN0cnVjdCB0aGUgZGF0YSBmb3IgdGhlIEZpcmViYXNlU2VydmVyQXBwSW1wbC5cclxuICAgICAgICB0aGlzLl9zZXJ2ZXJDb25maWcgPSBPYmplY3QuYXNzaWduKHsgYXV0b21hdGljRGF0YUNvbGxlY3Rpb25FbmFibGVkIH0sIHNlcnZlckNvbmZpZyk7XHJcbiAgICAgICAgdGhpcy5fZmluYWxpemF0aW9uUmVnaXN0cnkgPSBudWxsO1xyXG4gICAgICAgIGlmICh0eXBlb2YgRmluYWxpemF0aW9uUmVnaXN0cnkgIT09ICd1bmRlZmluZWQnKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2ZpbmFsaXphdGlvblJlZ2lzdHJ5ID0gbmV3IEZpbmFsaXphdGlvblJlZ2lzdHJ5KCgpID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMuYXV0b21hdGljQ2xlYW51cCgpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5fcmVmQ291bnQgPSAwO1xyXG4gICAgICAgIHRoaXMuaW5jUmVmQ291bnQodGhpcy5fc2VydmVyQ29uZmlnLnJlbGVhc2VPbkRlcmVmKTtcclxuICAgICAgICAvLyBEbyBub3QgcmV0YWluIGEgaGFyZCByZWZlcmVuY2UgdG8gdGhlIGRyZWYgb2JqZWN0LCBvdGhlcndpc2UgdGhlIEZpbmFsaXphdGlvblJlZ2lzdHJ5XHJcbiAgICAgICAgLy8gd2lsbCBuZXZlciB0cmlnZ2VyLlxyXG4gICAgICAgIHRoaXMuX3NlcnZlckNvbmZpZy5yZWxlYXNlT25EZXJlZiA9IHVuZGVmaW5lZDtcclxuICAgICAgICBzZXJ2ZXJDb25maWcucmVsZWFzZU9uRGVyZWYgPSB1bmRlZmluZWQ7XHJcbiAgICAgICAgcmVnaXN0ZXJWZXJzaW9uKG5hbWUkcCwgdmVyc2lvbiQxLCAnc2VydmVyYXBwJyk7XHJcbiAgICB9XHJcbiAgICB0b0pTT04oKSB7XHJcbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcclxuICAgIH1cclxuICAgIGdldCByZWZDb3VudCgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fcmVmQ291bnQ7XHJcbiAgICB9XHJcbiAgICAvLyBJbmNyZW1lbnQgdGhlIHJlZmVyZW5jZSBjb3VudCBvZiB0aGlzIHNlcnZlciBhcHAuIElmIGFuIG9iamVjdCBpcyBwcm92aWRlZCwgcmVnaXN0ZXIgaXRcclxuICAgIC8vIHdpdGggdGhlIGZpbmFsaXphdGlvbiByZWdpc3RyeS5cclxuICAgIGluY1JlZkNvdW50KG9iaikge1xyXG4gICAgICAgIGlmICh0aGlzLmlzRGVsZXRlZCkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuX3JlZkNvdW50Kys7XHJcbiAgICAgICAgaWYgKG9iaiAhPT0gdW5kZWZpbmVkICYmIHRoaXMuX2ZpbmFsaXphdGlvblJlZ2lzdHJ5ICE9PSBudWxsKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2ZpbmFsaXphdGlvblJlZ2lzdHJ5LnJlZ2lzdGVyKG9iaiwgdGhpcyk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgLy8gRGVjcmVtZW50IHRoZSByZWZlcmVuY2UgY291bnQuXHJcbiAgICBkZWNSZWZDb3VudCgpIHtcclxuICAgICAgICBpZiAodGhpcy5pc0RlbGV0ZWQpIHtcclxuICAgICAgICAgICAgcmV0dXJuIDA7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiAtLXRoaXMuX3JlZkNvdW50O1xyXG4gICAgfVxyXG4gICAgLy8gSW52b2tlZCBieSB0aGUgRmluYWxpemF0aW9uUmVnaXN0cnkgY2FsbGJhY2sgdG8gbm90ZSB0aGF0IHRoaXMgYXBwIHNob3VsZCBnbyB0aHJvdWdoIGl0c1xyXG4gICAgLy8gcmVmZXJlbmNlIGNvdW50cyBhbmQgZGVsZXRlIGl0c2VsZiBpZiBubyByZWZlcmVuY2UgY291bnQgcmVtYWluLiBUaGUgY29vcmRpbmF0aW5nIGxvZ2ljIHRoYXRcclxuICAgIC8vIGhhbmRsZXMgdGhpcyBpcyBpbiBkZWxldGVBcHAoLi4uKS5cclxuICAgIGF1dG9tYXRpY0NsZWFudXAoKSB7XHJcbiAgICAgICAgdm9pZCBkZWxldGVBcHAodGhpcyk7XHJcbiAgICB9XHJcbiAgICBnZXQgc2V0dGluZ3MoKSB7XHJcbiAgICAgICAgdGhpcy5jaGVja0Rlc3Ryb3llZCgpO1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9zZXJ2ZXJDb25maWc7XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIFRoaXMgZnVuY3Rpb24gd2lsbCB0aHJvdyBhbiBFcnJvciBpZiB0aGUgQXBwIGhhcyBhbHJlYWR5IGJlZW4gZGVsZXRlZCAtXHJcbiAgICAgKiB1c2UgYmVmb3JlIHBlcmZvcm1pbmcgQVBJIGFjdGlvbnMgb24gdGhlIEFwcC5cclxuICAgICAqL1xyXG4gICAgY2hlY2tEZXN0cm95ZWQoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuaXNEZWxldGVkKSB7XHJcbiAgICAgICAgICAgIHRocm93IEVSUk9SX0ZBQ1RPUlkuY3JlYXRlKFwic2VydmVyLWFwcC1kZWxldGVkXCIgLyogQXBwRXJyb3IuU0VSVkVSX0FQUF9ERUxFVEVEICovKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cblxuLyoqXHJcbiAqIEBsaWNlbnNlXHJcbiAqIENvcHlyaWdodCAyMDE5IEdvb2dsZSBMTENcclxuICpcclxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcclxuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxyXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcclxuICpcclxuICogICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcclxuICpcclxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxyXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXHJcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxyXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXHJcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxyXG4gKi9cclxuLyoqXHJcbiAqIFRoZSBjdXJyZW50IFNESyB2ZXJzaW9uLlxyXG4gKlxyXG4gKiBAcHVibGljXHJcbiAqL1xyXG5jb25zdCBTREtfVkVSU0lPTiA9IHZlcnNpb247XHJcbmZ1bmN0aW9uIGluaXRpYWxpemVBcHAoX29wdGlvbnMsIHJhd0NvbmZpZyA9IHt9KSB7XHJcbiAgICBsZXQgb3B0aW9ucyA9IF9vcHRpb25zO1xyXG4gICAgaWYgKHR5cGVvZiByYXdDb25maWcgIT09ICdvYmplY3QnKSB7XHJcbiAgICAgICAgY29uc3QgbmFtZSA9IHJhd0NvbmZpZztcclxuICAgICAgICByYXdDb25maWcgPSB7IG5hbWUgfTtcclxuICAgIH1cclxuICAgIGNvbnN0IGNvbmZpZyA9IE9iamVjdC5hc3NpZ24oeyBuYW1lOiBERUZBVUxUX0VOVFJZX05BTUUsIGF1dG9tYXRpY0RhdGFDb2xsZWN0aW9uRW5hYmxlZDogZmFsc2UgfSwgcmF3Q29uZmlnKTtcclxuICAgIGNvbnN0IG5hbWUgPSBjb25maWcubmFtZTtcclxuICAgIGlmICh0eXBlb2YgbmFtZSAhPT0gJ3N0cmluZycgfHwgIW5hbWUpIHtcclxuICAgICAgICB0aHJvdyBFUlJPUl9GQUNUT1JZLmNyZWF0ZShcImJhZC1hcHAtbmFtZVwiIC8qIEFwcEVycm9yLkJBRF9BUFBfTkFNRSAqLywge1xyXG4gICAgICAgICAgICBhcHBOYW1lOiBTdHJpbmcobmFtZSlcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuICAgIG9wdGlvbnMgfHwgKG9wdGlvbnMgPSBnZXREZWZhdWx0QXBwQ29uZmlnKCkpO1xyXG4gICAgaWYgKCFvcHRpb25zKSB7XHJcbiAgICAgICAgdGhyb3cgRVJST1JfRkFDVE9SWS5jcmVhdGUoXCJuby1vcHRpb25zXCIgLyogQXBwRXJyb3IuTk9fT1BUSU9OUyAqLyk7XHJcbiAgICB9XHJcbiAgICBjb25zdCBleGlzdGluZ0FwcCA9IF9hcHBzLmdldChuYW1lKTtcclxuICAgIGlmIChleGlzdGluZ0FwcCkge1xyXG4gICAgICAgIC8vIHJldHVybiB0aGUgZXhpc3RpbmcgYXBwIGlmIG9wdGlvbnMgYW5kIGNvbmZpZyBkZWVwIGVxdWFsIHRoZSBvbmVzIGluIHRoZSBleGlzdGluZyBhcHAuXHJcbiAgICAgICAgaWYgKGRlZXBFcXVhbChvcHRpb25zLCBleGlzdGluZ0FwcC5vcHRpb25zKSAmJlxyXG4gICAgICAgICAgICBkZWVwRXF1YWwoY29uZmlnLCBleGlzdGluZ0FwcC5jb25maWcpKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBleGlzdGluZ0FwcDtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIHRocm93IEVSUk9SX0ZBQ1RPUlkuY3JlYXRlKFwiZHVwbGljYXRlLWFwcFwiIC8qIEFwcEVycm9yLkRVUExJQ0FURV9BUFAgKi8sIHsgYXBwTmFtZTogbmFtZSB9KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBjb25zdCBjb250YWluZXIgPSBuZXcgQ29tcG9uZW50Q29udGFpbmVyKG5hbWUpO1xyXG4gICAgZm9yIChjb25zdCBjb21wb25lbnQgb2YgX2NvbXBvbmVudHMudmFsdWVzKCkpIHtcclxuICAgICAgICBjb250YWluZXIuYWRkQ29tcG9uZW50KGNvbXBvbmVudCk7XHJcbiAgICB9XHJcbiAgICBjb25zdCBuZXdBcHAgPSBuZXcgRmlyZWJhc2VBcHBJbXBsKG9wdGlvbnMsIGNvbmZpZywgY29udGFpbmVyKTtcclxuICAgIF9hcHBzLnNldChuYW1lLCBuZXdBcHApO1xyXG4gICAgcmV0dXJuIG5ld0FwcDtcclxufVxyXG5mdW5jdGlvbiBpbml0aWFsaXplU2VydmVyQXBwKF9vcHRpb25zLCBfc2VydmVyQXBwQ29uZmlnKSB7XHJcbiAgICBpZiAoaXNCcm93c2VyKCkgJiYgIWlzV2ViV29ya2VyKCkpIHtcclxuICAgICAgICAvLyBGaXJlYmFzZVNlcnZlckFwcCBpc24ndCBkZXNpZ25lZCB0byBiZSBydW4gaW4gYnJvd3NlcnMuXHJcbiAgICAgICAgdGhyb3cgRVJST1JfRkFDVE9SWS5jcmVhdGUoXCJpbnZhbGlkLXNlcnZlci1hcHAtZW52aXJvbm1lbnRcIiAvKiBBcHBFcnJvci5JTlZBTElEX1NFUlZFUl9BUFBfRU5WSVJPTk1FTlQgKi8pO1xyXG4gICAgfVxyXG4gICAgaWYgKF9zZXJ2ZXJBcHBDb25maWcuYXV0b21hdGljRGF0YUNvbGxlY3Rpb25FbmFibGVkID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICBfc2VydmVyQXBwQ29uZmlnLmF1dG9tYXRpY0RhdGFDb2xsZWN0aW9uRW5hYmxlZCA9IGZhbHNlO1xyXG4gICAgfVxyXG4gICAgbGV0IGFwcE9wdGlvbnM7XHJcbiAgICBpZiAoX2lzRmlyZWJhc2VBcHAoX29wdGlvbnMpKSB7XHJcbiAgICAgICAgYXBwT3B0aW9ucyA9IF9vcHRpb25zLm9wdGlvbnM7XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgICBhcHBPcHRpb25zID0gX29wdGlvbnM7XHJcbiAgICB9XHJcbiAgICAvLyBCdWlsZCBhbiBhcHAgbmFtZSBiYXNlZCBvbiBhIGhhc2ggb2YgdGhlIGNvbmZpZ3VyYXRpb24gb3B0aW9ucy5cclxuICAgIGNvbnN0IG5hbWVPYmogPSBPYmplY3QuYXNzaWduKE9iamVjdC5hc3NpZ24oe30sIF9zZXJ2ZXJBcHBDb25maWcpLCBhcHBPcHRpb25zKTtcclxuICAgIC8vIEhvd2V2ZXIsIERvIG5vdCBtYW5nbGUgdGhlIG5hbWUgYmFzZWQgb24gcmVsZWFzZU9uRGVyZWYsIHNpbmNlIGl0IHdpbGwgdmFyeSBiZXR3ZWVuIHRoZVxyXG4gICAgLy8gY29uc3RydWN0aW9uIG9mIEZpcmViYXNlU2VydmVyQXBwIGluc3RhbmNlcy4gRm9yIGV4YW1wbGUsIGlmIHRoZSBvYmplY3QgaXMgdGhlIHJlcXVlc3QgaGVhZGVycy5cclxuICAgIGlmIChuYW1lT2JqLnJlbGVhc2VPbkRlcmVmICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICBkZWxldGUgbmFtZU9iai5yZWxlYXNlT25EZXJlZjtcclxuICAgIH1cclxuICAgIGNvbnN0IGhhc2hDb2RlID0gKHMpID0+IHtcclxuICAgICAgICByZXR1cm4gWy4uLnNdLnJlZHVjZSgoaGFzaCwgYykgPT4gKE1hdGguaW11bCgzMSwgaGFzaCkgKyBjLmNoYXJDb2RlQXQoMCkpIHwgMCwgMCk7XHJcbiAgICB9O1xyXG4gICAgaWYgKF9zZXJ2ZXJBcHBDb25maWcucmVsZWFzZU9uRGVyZWYgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgIGlmICh0eXBlb2YgRmluYWxpemF0aW9uUmVnaXN0cnkgPT09ICd1bmRlZmluZWQnKSB7XHJcbiAgICAgICAgICAgIHRocm93IEVSUk9SX0ZBQ1RPUlkuY3JlYXRlKFwiZmluYWxpemF0aW9uLXJlZ2lzdHJ5LW5vdC1zdXBwb3J0ZWRcIiAvKiBBcHBFcnJvci5GSU5BTElaQVRJT05fUkVHSVNUUllfTk9UX1NVUFBPUlRFRCAqLywge30pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGNvbnN0IG5hbWVTdHJpbmcgPSAnJyArIGhhc2hDb2RlKEpTT04uc3RyaW5naWZ5KG5hbWVPYmopKTtcclxuICAgIGNvbnN0IGV4aXN0aW5nQXBwID0gX3NlcnZlckFwcHMuZ2V0KG5hbWVTdHJpbmcpO1xyXG4gICAgaWYgKGV4aXN0aW5nQXBwKSB7XHJcbiAgICAgICAgZXhpc3RpbmdBcHAuaW5jUmVmQ291bnQoX3NlcnZlckFwcENvbmZpZy5yZWxlYXNlT25EZXJlZik7XHJcbiAgICAgICAgcmV0dXJuIGV4aXN0aW5nQXBwO1xyXG4gICAgfVxyXG4gICAgY29uc3QgY29udGFpbmVyID0gbmV3IENvbXBvbmVudENvbnRhaW5lcihuYW1lU3RyaW5nKTtcclxuICAgIGZvciAoY29uc3QgY29tcG9uZW50IG9mIF9jb21wb25lbnRzLnZhbHVlcygpKSB7XHJcbiAgICAgICAgY29udGFpbmVyLmFkZENvbXBvbmVudChjb21wb25lbnQpO1xyXG4gICAgfVxyXG4gICAgY29uc3QgbmV3QXBwID0gbmV3IEZpcmViYXNlU2VydmVyQXBwSW1wbChhcHBPcHRpb25zLCBfc2VydmVyQXBwQ29uZmlnLCBuYW1lU3RyaW5nLCBjb250YWluZXIpO1xyXG4gICAgX3NlcnZlckFwcHMuc2V0KG5hbWVTdHJpbmcsIG5ld0FwcCk7XHJcbiAgICByZXR1cm4gbmV3QXBwO1xyXG59XHJcbi8qKlxyXG4gKiBSZXRyaWV2ZXMgYSB7QGxpbmsgQGZpcmViYXNlL2FwcCNGaXJlYmFzZUFwcH0gaW5zdGFuY2UuXHJcbiAqXHJcbiAqIFdoZW4gY2FsbGVkIHdpdGggbm8gYXJndW1lbnRzLCB0aGUgZGVmYXVsdCBhcHAgaXMgcmV0dXJuZWQuIFdoZW4gYW4gYXBwIG5hbWVcclxuICogaXMgcHJvdmlkZWQsIHRoZSBhcHAgY29ycmVzcG9uZGluZyB0byB0aGF0IG5hbWUgaXMgcmV0dXJuZWQuXHJcbiAqXHJcbiAqIEFuIGV4Y2VwdGlvbiBpcyB0aHJvd24gaWYgdGhlIGFwcCBiZWluZyByZXRyaWV2ZWQgaGFzIG5vdCB5ZXQgYmVlblxyXG4gKiBpbml0aWFsaXplZC5cclxuICpcclxuICogQGV4YW1wbGVcclxuICogYGBgamF2YXNjcmlwdFxyXG4gKiAvLyBSZXR1cm4gdGhlIGRlZmF1bHQgYXBwXHJcbiAqIGNvbnN0IGFwcCA9IGdldEFwcCgpO1xyXG4gKiBgYGBcclxuICpcclxuICogQGV4YW1wbGVcclxuICogYGBgamF2YXNjcmlwdFxyXG4gKiAvLyBSZXR1cm4gYSBuYW1lZCBhcHBcclxuICogY29uc3Qgb3RoZXJBcHAgPSBnZXRBcHAoXCJvdGhlckFwcFwiKTtcclxuICogYGBgXHJcbiAqXHJcbiAqIEBwYXJhbSBuYW1lIC0gT3B0aW9uYWwgbmFtZSBvZiB0aGUgYXBwIHRvIHJldHVybi4gSWYgbm8gbmFtZSBpc1xyXG4gKiAgIHByb3ZpZGVkLCB0aGUgZGVmYXVsdCBpcyBgXCJbREVGQVVMVF1cImAuXHJcbiAqXHJcbiAqIEByZXR1cm5zIFRoZSBhcHAgY29ycmVzcG9uZGluZyB0byB0aGUgcHJvdmlkZWQgYXBwIG5hbWUuXHJcbiAqICAgSWYgbm8gYXBwIG5hbWUgaXMgcHJvdmlkZWQsIHRoZSBkZWZhdWx0IGFwcCBpcyByZXR1cm5lZC5cclxuICpcclxuICogQHB1YmxpY1xyXG4gKi9cclxuZnVuY3Rpb24gZ2V0QXBwKG5hbWUgPSBERUZBVUxUX0VOVFJZX05BTUUpIHtcclxuICAgIGNvbnN0IGFwcCA9IF9hcHBzLmdldChuYW1lKTtcclxuICAgIGlmICghYXBwICYmIG5hbWUgPT09IERFRkFVTFRfRU5UUllfTkFNRSAmJiBnZXREZWZhdWx0QXBwQ29uZmlnKCkpIHtcclxuICAgICAgICByZXR1cm4gaW5pdGlhbGl6ZUFwcCgpO1xyXG4gICAgfVxyXG4gICAgaWYgKCFhcHApIHtcclxuICAgICAgICB0aHJvdyBFUlJPUl9GQUNUT1JZLmNyZWF0ZShcIm5vLWFwcFwiIC8qIEFwcEVycm9yLk5PX0FQUCAqLywgeyBhcHBOYW1lOiBuYW1lIH0pO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGFwcDtcclxufVxyXG4vKipcclxuICogQSAocmVhZC1vbmx5KSBhcnJheSBvZiBhbGwgaW5pdGlhbGl6ZWQgYXBwcy5cclxuICogQHB1YmxpY1xyXG4gKi9cclxuZnVuY3Rpb24gZ2V0QXBwcygpIHtcclxuICAgIHJldHVybiBBcnJheS5mcm9tKF9hcHBzLnZhbHVlcygpKTtcclxufVxyXG4vKipcclxuICogUmVuZGVycyB0aGlzIGFwcCB1bnVzYWJsZSBhbmQgZnJlZXMgdGhlIHJlc291cmNlcyBvZiBhbGwgYXNzb2NpYXRlZFxyXG4gKiBzZXJ2aWNlcy5cclxuICpcclxuICogQGV4YW1wbGVcclxuICogYGBgamF2YXNjcmlwdFxyXG4gKiBkZWxldGVBcHAoYXBwKVxyXG4gKiAgIC50aGVuKGZ1bmN0aW9uKCkge1xyXG4gKiAgICAgY29uc29sZS5sb2coXCJBcHAgZGVsZXRlZCBzdWNjZXNzZnVsbHlcIik7XHJcbiAqICAgfSlcclxuICogICAuY2F0Y2goZnVuY3Rpb24oZXJyb3IpIHtcclxuICogICAgIGNvbnNvbGUubG9nKFwiRXJyb3IgZGVsZXRpbmcgYXBwOlwiLCBlcnJvcik7XHJcbiAqICAgfSk7XHJcbiAqIGBgYFxyXG4gKlxyXG4gKiBAcHVibGljXHJcbiAqL1xyXG5hc3luYyBmdW5jdGlvbiBkZWxldGVBcHAoYXBwKSB7XHJcbiAgICBsZXQgY2xlYW51cFByb3ZpZGVycyA9IGZhbHNlO1xyXG4gICAgY29uc3QgbmFtZSA9IGFwcC5uYW1lO1xyXG4gICAgaWYgKF9hcHBzLmhhcyhuYW1lKSkge1xyXG4gICAgICAgIGNsZWFudXBQcm92aWRlcnMgPSB0cnVlO1xyXG4gICAgICAgIF9hcHBzLmRlbGV0ZShuYW1lKTtcclxuICAgIH1cclxuICAgIGVsc2UgaWYgKF9zZXJ2ZXJBcHBzLmhhcyhuYW1lKSkge1xyXG4gICAgICAgIGNvbnN0IGZpcmViYXNlU2VydmVyQXBwID0gYXBwO1xyXG4gICAgICAgIGlmIChmaXJlYmFzZVNlcnZlckFwcC5kZWNSZWZDb3VudCgpIDw9IDApIHtcclxuICAgICAgICAgICAgX3NlcnZlckFwcHMuZGVsZXRlKG5hbWUpO1xyXG4gICAgICAgICAgICBjbGVhbnVwUHJvdmlkZXJzID0gdHJ1ZTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBpZiAoY2xlYW51cFByb3ZpZGVycykge1xyXG4gICAgICAgIGF3YWl0IFByb21pc2UuYWxsKGFwcC5jb250YWluZXJcclxuICAgICAgICAgICAgLmdldFByb3ZpZGVycygpXHJcbiAgICAgICAgICAgIC5tYXAocHJvdmlkZXIgPT4gcHJvdmlkZXIuZGVsZXRlKCkpKTtcclxuICAgICAgICBhcHAuaXNEZWxldGVkID0gdHJ1ZTtcclxuICAgIH1cclxufVxyXG4vKipcclxuICogUmVnaXN0ZXJzIGEgbGlicmFyeSdzIG5hbWUgYW5kIHZlcnNpb24gZm9yIHBsYXRmb3JtIGxvZ2dpbmcgcHVycG9zZXMuXHJcbiAqIEBwYXJhbSBsaWJyYXJ5IC0gTmFtZSBvZiAxcCBvciAzcCBsaWJyYXJ5IChlLmcuIGZpcmVzdG9yZSwgYW5ndWxhcmZpcmUpXHJcbiAqIEBwYXJhbSB2ZXJzaW9uIC0gQ3VycmVudCB2ZXJzaW9uIG9mIHRoYXQgbGlicmFyeS5cclxuICogQHBhcmFtIHZhcmlhbnQgLSBCdW5kbGUgdmFyaWFudCwgZS5nLiwgbm9kZSwgcm4sIGV0Yy5cclxuICpcclxuICogQHB1YmxpY1xyXG4gKi9cclxuZnVuY3Rpb24gcmVnaXN0ZXJWZXJzaW9uKGxpYnJhcnlLZXlPck5hbWUsIHZlcnNpb24sIHZhcmlhbnQpIHtcclxuICAgIHZhciBfYTtcclxuICAgIC8vIFRPRE86IFdlIGNhbiB1c2UgdGhpcyBjaGVjayB0byB3aGl0ZWxpc3Qgc3RyaW5ncyB3aGVuL2lmIHdlIHNldCB1cFxyXG4gICAgLy8gYSBnb29kIHdoaXRlbGlzdCBzeXN0ZW0uXHJcbiAgICBsZXQgbGlicmFyeSA9IChfYSA9IFBMQVRGT1JNX0xPR19TVFJJTkdbbGlicmFyeUtleU9yTmFtZV0pICE9PSBudWxsICYmIF9hICE9PSB2b2lkIDAgPyBfYSA6IGxpYnJhcnlLZXlPck5hbWU7XHJcbiAgICBpZiAodmFyaWFudCkge1xyXG4gICAgICAgIGxpYnJhcnkgKz0gYC0ke3ZhcmlhbnR9YDtcclxuICAgIH1cclxuICAgIGNvbnN0IGxpYnJhcnlNaXNtYXRjaCA9IGxpYnJhcnkubWF0Y2goL1xcc3xcXC8vKTtcclxuICAgIGNvbnN0IHZlcnNpb25NaXNtYXRjaCA9IHZlcnNpb24ubWF0Y2goL1xcc3xcXC8vKTtcclxuICAgIGlmIChsaWJyYXJ5TWlzbWF0Y2ggfHwgdmVyc2lvbk1pc21hdGNoKSB7XHJcbiAgICAgICAgY29uc3Qgd2FybmluZyA9IFtcclxuICAgICAgICAgICAgYFVuYWJsZSB0byByZWdpc3RlciBsaWJyYXJ5IFwiJHtsaWJyYXJ5fVwiIHdpdGggdmVyc2lvbiBcIiR7dmVyc2lvbn1cIjpgXHJcbiAgICAgICAgXTtcclxuICAgICAgICBpZiAobGlicmFyeU1pc21hdGNoKSB7XHJcbiAgICAgICAgICAgIHdhcm5pbmcucHVzaChgbGlicmFyeSBuYW1lIFwiJHtsaWJyYXJ5fVwiIGNvbnRhaW5zIGlsbGVnYWwgY2hhcmFjdGVycyAod2hpdGVzcGFjZSBvciBcIi9cIilgKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKGxpYnJhcnlNaXNtYXRjaCAmJiB2ZXJzaW9uTWlzbWF0Y2gpIHtcclxuICAgICAgICAgICAgd2FybmluZy5wdXNoKCdhbmQnKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHZlcnNpb25NaXNtYXRjaCkge1xyXG4gICAgICAgICAgICB3YXJuaW5nLnB1c2goYHZlcnNpb24gbmFtZSBcIiR7dmVyc2lvbn1cIiBjb250YWlucyBpbGxlZ2FsIGNoYXJhY3RlcnMgKHdoaXRlc3BhY2Ugb3IgXCIvXCIpYCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGxvZ2dlci53YXJuKHdhcm5pbmcuam9pbignICcpKTtcclxuICAgICAgICByZXR1cm47XHJcbiAgICB9XHJcbiAgICBfcmVnaXN0ZXJDb21wb25lbnQobmV3IENvbXBvbmVudChgJHtsaWJyYXJ5fS12ZXJzaW9uYCwgKCkgPT4gKHsgbGlicmFyeSwgdmVyc2lvbiB9KSwgXCJWRVJTSU9OXCIgLyogQ29tcG9uZW50VHlwZS5WRVJTSU9OICovKSk7XHJcbn1cclxuLyoqXHJcbiAqIFNldHMgbG9nIGhhbmRsZXIgZm9yIGFsbCBGaXJlYmFzZSBTREtzLlxyXG4gKiBAcGFyYW0gbG9nQ2FsbGJhY2sgLSBBbiBvcHRpb25hbCBjdXN0b20gbG9nIGhhbmRsZXIgdGhhdCBleGVjdXRlcyB1c2VyIGNvZGUgd2hlbmV2ZXJcclxuICogdGhlIEZpcmViYXNlIFNESyBtYWtlcyBhIGxvZ2dpbmcgY2FsbC5cclxuICpcclxuICogQHB1YmxpY1xyXG4gKi9cclxuZnVuY3Rpb24gb25Mb2cobG9nQ2FsbGJhY2ssIG9wdGlvbnMpIHtcclxuICAgIGlmIChsb2dDYWxsYmFjayAhPT0gbnVsbCAmJiB0eXBlb2YgbG9nQ2FsbGJhY2sgIT09ICdmdW5jdGlvbicpIHtcclxuICAgICAgICB0aHJvdyBFUlJPUl9GQUNUT1JZLmNyZWF0ZShcImludmFsaWQtbG9nLWFyZ3VtZW50XCIgLyogQXBwRXJyb3IuSU5WQUxJRF9MT0dfQVJHVU1FTlQgKi8pO1xyXG4gICAgfVxyXG4gICAgc2V0VXNlckxvZ0hhbmRsZXIobG9nQ2FsbGJhY2ssIG9wdGlvbnMpO1xyXG59XHJcbi8qKlxyXG4gKiBTZXRzIGxvZyBsZXZlbCBmb3IgYWxsIEZpcmViYXNlIFNES3MuXHJcbiAqXHJcbiAqIEFsbCBvZiB0aGUgbG9nIHR5cGVzIGFib3ZlIHRoZSBjdXJyZW50IGxvZyBsZXZlbCBhcmUgY2FwdHVyZWQgKGkuZS4gaWZcclxuICogeW91IHNldCB0aGUgbG9nIGxldmVsIHRvIGBpbmZvYCwgZXJyb3JzIGFyZSBsb2dnZWQsIGJ1dCBgZGVidWdgIGFuZFxyXG4gKiBgdmVyYm9zZWAgbG9ncyBhcmUgbm90KS5cclxuICpcclxuICogQHB1YmxpY1xyXG4gKi9cclxuZnVuY3Rpb24gc2V0TG9nTGV2ZWwobG9nTGV2ZWwpIHtcclxuICAgIHNldExvZ0xldmVsJDEobG9nTGV2ZWwpO1xyXG59XG5cbi8qKlxyXG4gKiBAbGljZW5zZVxyXG4gKiBDb3B5cmlnaHQgMjAyMSBHb29nbGUgTExDXHJcbiAqXHJcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XHJcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cclxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XHJcbiAqXHJcbiAqICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXHJcbiAqXHJcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcclxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxyXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cclxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxyXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cclxuICovXHJcbmNvbnN0IERCX05BTUUgPSAnZmlyZWJhc2UtaGVhcnRiZWF0LWRhdGFiYXNlJztcclxuY29uc3QgREJfVkVSU0lPTiA9IDE7XHJcbmNvbnN0IFNUT1JFX05BTUUgPSAnZmlyZWJhc2UtaGVhcnRiZWF0LXN0b3JlJztcclxubGV0IGRiUHJvbWlzZSA9IG51bGw7XHJcbmZ1bmN0aW9uIGdldERiUHJvbWlzZSgpIHtcclxuICAgIGlmICghZGJQcm9taXNlKSB7XHJcbiAgICAgICAgZGJQcm9taXNlID0gb3BlbkRCKERCX05BTUUsIERCX1ZFUlNJT04sIHtcclxuICAgICAgICAgICAgdXBncmFkZTogKGRiLCBvbGRWZXJzaW9uKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAvLyBXZSBkb24ndCB1c2UgJ2JyZWFrJyBpbiB0aGlzIHN3aXRjaCBzdGF0ZW1lbnQsIHRoZSBmYWxsLXRocm91Z2hcclxuICAgICAgICAgICAgICAgIC8vIGJlaGF2aW9yIGlzIHdoYXQgd2Ugd2FudCwgYmVjYXVzZSBpZiB0aGVyZSBhcmUgbXVsdGlwbGUgdmVyc2lvbnMgYmV0d2VlblxyXG4gICAgICAgICAgICAgICAgLy8gdGhlIG9sZCB2ZXJzaW9uIGFuZCB0aGUgY3VycmVudCB2ZXJzaW9uLCB3ZSB3YW50IEFMTCB0aGUgbWlncmF0aW9uc1xyXG4gICAgICAgICAgICAgICAgLy8gdGhhdCBjb3JyZXNwb25kIHRvIHRob3NlIHZlcnNpb25zIHRvIHJ1biwgbm90IG9ubHkgdGhlIGxhc3Qgb25lLlxyXG4gICAgICAgICAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGRlZmF1bHQtY2FzZVxyXG4gICAgICAgICAgICAgICAgc3dpdGNoIChvbGRWZXJzaW9uKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAwOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGIuY3JlYXRlT2JqZWN0U3RvcmUoU1RPUkVfTkFNRSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgY2F0Y2ggKGUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFNhZmFyaS9pT1MgYnJvd3NlcnMgdGhyb3cgb2NjYXNpb25hbCBleGNlcHRpb25zIG9uXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBkYi5jcmVhdGVPYmplY3RTdG9yZSgpIHRoYXQgbWF5IGJlIGEgYnVnLiBBdm9pZCBibG9ja2luZ1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gdGhlIHJlc3Qgb2YgdGhlIGFwcCBmdW5jdGlvbmFsaXR5LlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS53YXJuKGUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KS5jYXRjaChlID0+IHtcclxuICAgICAgICAgICAgdGhyb3cgRVJST1JfRkFDVE9SWS5jcmVhdGUoXCJpZGItb3BlblwiIC8qIEFwcEVycm9yLklEQl9PUEVOICovLCB7XHJcbiAgICAgICAgICAgICAgICBvcmlnaW5hbEVycm9yTWVzc2FnZTogZS5tZXNzYWdlXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGRiUHJvbWlzZTtcclxufVxyXG5hc3luYyBmdW5jdGlvbiByZWFkSGVhcnRiZWF0c0Zyb21JbmRleGVkREIoYXBwKSB7XHJcbiAgICB0cnkge1xyXG4gICAgICAgIGNvbnN0IGRiID0gYXdhaXQgZ2V0RGJQcm9taXNlKCk7XHJcbiAgICAgICAgY29uc3QgdHggPSBkYi50cmFuc2FjdGlvbihTVE9SRV9OQU1FKTtcclxuICAgICAgICBjb25zdCByZXN1bHQgPSBhd2FpdCB0eC5vYmplY3RTdG9yZShTVE9SRV9OQU1FKS5nZXQoY29tcHV0ZUtleShhcHApKTtcclxuICAgICAgICAvLyBXZSBhbHJlYWR5IGhhdmUgdGhlIHZhbHVlIGJ1dCB0eC5kb25lIGNhbiB0aHJvdyxcclxuICAgICAgICAvLyBzbyB3ZSBuZWVkIHRvIGF3YWl0IGl0IGhlcmUgdG8gY2F0Y2ggZXJyb3JzXHJcbiAgICAgICAgYXdhaXQgdHguZG9uZTtcclxuICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgfVxyXG4gICAgY2F0Y2ggKGUpIHtcclxuICAgICAgICBpZiAoZSBpbnN0YW5jZW9mIEZpcmViYXNlRXJyb3IpIHtcclxuICAgICAgICAgICAgbG9nZ2VyLndhcm4oZS5tZXNzYWdlKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGlkYkdldEVycm9yID0gRVJST1JfRkFDVE9SWS5jcmVhdGUoXCJpZGItZ2V0XCIgLyogQXBwRXJyb3IuSURCX0dFVCAqLywge1xyXG4gICAgICAgICAgICAgICAgb3JpZ2luYWxFcnJvck1lc3NhZ2U6IGUgPT09IG51bGwgfHwgZSA9PT0gdm9pZCAwID8gdm9pZCAwIDogZS5tZXNzYWdlXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICBsb2dnZXIud2FybihpZGJHZXRFcnJvci5tZXNzYWdlKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuYXN5bmMgZnVuY3Rpb24gd3JpdGVIZWFydGJlYXRzVG9JbmRleGVkREIoYXBwLCBoZWFydGJlYXRPYmplY3QpIHtcclxuICAgIHRyeSB7XHJcbiAgICAgICAgY29uc3QgZGIgPSBhd2FpdCBnZXREYlByb21pc2UoKTtcclxuICAgICAgICBjb25zdCB0eCA9IGRiLnRyYW5zYWN0aW9uKFNUT1JFX05BTUUsICdyZWFkd3JpdGUnKTtcclxuICAgICAgICBjb25zdCBvYmplY3RTdG9yZSA9IHR4Lm9iamVjdFN0b3JlKFNUT1JFX05BTUUpO1xyXG4gICAgICAgIGF3YWl0IG9iamVjdFN0b3JlLnB1dChoZWFydGJlYXRPYmplY3QsIGNvbXB1dGVLZXkoYXBwKSk7XHJcbiAgICAgICAgYXdhaXQgdHguZG9uZTtcclxuICAgIH1cclxuICAgIGNhdGNoIChlKSB7XHJcbiAgICAgICAgaWYgKGUgaW5zdGFuY2VvZiBGaXJlYmFzZUVycm9yKSB7XHJcbiAgICAgICAgICAgIGxvZ2dlci53YXJuKGUubWVzc2FnZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBjb25zdCBpZGJHZXRFcnJvciA9IEVSUk9SX0ZBQ1RPUlkuY3JlYXRlKFwiaWRiLXNldFwiIC8qIEFwcEVycm9yLklEQl9XUklURSAqLywge1xyXG4gICAgICAgICAgICAgICAgb3JpZ2luYWxFcnJvck1lc3NhZ2U6IGUgPT09IG51bGwgfHwgZSA9PT0gdm9pZCAwID8gdm9pZCAwIDogZS5tZXNzYWdlXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICBsb2dnZXIud2FybihpZGJHZXRFcnJvci5tZXNzYWdlKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuZnVuY3Rpb24gY29tcHV0ZUtleShhcHApIHtcclxuICAgIHJldHVybiBgJHthcHAubmFtZX0hJHthcHAub3B0aW9ucy5hcHBJZH1gO1xyXG59XG5cbi8qKlxyXG4gKiBAbGljZW5zZVxyXG4gKiBDb3B5cmlnaHQgMjAyMSBHb29nbGUgTExDXHJcbiAqXHJcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XHJcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cclxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XHJcbiAqXHJcbiAqICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXHJcbiAqXHJcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcclxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxyXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cclxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxyXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cclxuICovXHJcbmNvbnN0IE1BWF9IRUFERVJfQllURVMgPSAxMDI0O1xyXG4vLyAzMCBkYXlzXHJcbmNvbnN0IFNUT1JFRF9IRUFSVEJFQVRfUkVURU5USU9OX01BWF9NSUxMSVMgPSAzMCAqIDI0ICogNjAgKiA2MCAqIDEwMDA7XHJcbmNsYXNzIEhlYXJ0YmVhdFNlcnZpY2VJbXBsIHtcclxuICAgIGNvbnN0cnVjdG9yKGNvbnRhaW5lcikge1xyXG4gICAgICAgIHRoaXMuY29udGFpbmVyID0gY29udGFpbmVyO1xyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIEluLW1lbW9yeSBjYWNoZSBmb3IgaGVhcnRiZWF0cywgdXNlZCBieSBnZXRIZWFydGJlYXRzSGVhZGVyKCkgdG8gZ2VuZXJhdGVcclxuICAgICAgICAgKiB0aGUgaGVhZGVyIHN0cmluZy5cclxuICAgICAgICAgKiBTdG9yZXMgb25lIHJlY29yZCBwZXIgZGF0ZS4gVGhpcyB3aWxsIGJlIGNvbnNvbGlkYXRlZCBpbnRvIHRoZSBzdGFuZGFyZFxyXG4gICAgICAgICAqIGZvcm1hdCBvZiBvbmUgcmVjb3JkIHBlciB1c2VyIGFnZW50IHN0cmluZyBiZWZvcmUgYmVpbmcgc2VudCBhcyBhIGhlYWRlci5cclxuICAgICAgICAgKiBQb3B1bGF0ZWQgZnJvbSBpbmRleGVkREIgd2hlbiB0aGUgY29udHJvbGxlciBpcyBpbnN0YW50aWF0ZWQgYW5kIHNob3VsZFxyXG4gICAgICAgICAqIGJlIGtlcHQgaW4gc3luYyB3aXRoIGluZGV4ZWREQi5cclxuICAgICAgICAgKiBMZWF2ZSBwdWJsaWMgZm9yIGVhc2llciB0ZXN0aW5nLlxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHRoaXMuX2hlYXJ0YmVhdHNDYWNoZSA9IG51bGw7XHJcbiAgICAgICAgY29uc3QgYXBwID0gdGhpcy5jb250YWluZXIuZ2V0UHJvdmlkZXIoJ2FwcCcpLmdldEltbWVkaWF0ZSgpO1xyXG4gICAgICAgIHRoaXMuX3N0b3JhZ2UgPSBuZXcgSGVhcnRiZWF0U3RvcmFnZUltcGwoYXBwKTtcclxuICAgICAgICB0aGlzLl9oZWFydGJlYXRzQ2FjaGVQcm9taXNlID0gdGhpcy5fc3RvcmFnZS5yZWFkKCkudGhlbihyZXN1bHQgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLl9oZWFydGJlYXRzQ2FjaGUgPSByZXN1bHQ7XHJcbiAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIENhbGxlZCB0byByZXBvcnQgYSBoZWFydGJlYXQuIFRoZSBmdW5jdGlvbiB3aWxsIGdlbmVyYXRlXHJcbiAgICAgKiBhIEhlYXJ0YmVhdHNCeVVzZXJBZ2VudCBvYmplY3QsIHVwZGF0ZSBoZWFydGJlYXRzQ2FjaGUsIGFuZCBwZXJzaXN0IGl0XHJcbiAgICAgKiB0byBJbmRleGVkREIuXHJcbiAgICAgKiBOb3RlIHRoYXQgd2Ugb25seSBzdG9yZSBvbmUgaGVhcnRiZWF0IHBlciBkYXkuIFNvIGlmIGEgaGVhcnRiZWF0IGZvciB0b2RheSBpc1xyXG4gICAgICogYWxyZWFkeSBsb2dnZWQsIHN1YnNlcXVlbnQgY2FsbHMgdG8gdGhpcyBmdW5jdGlvbiBpbiB0aGUgc2FtZSBkYXkgd2lsbCBiZSBpZ25vcmVkLlxyXG4gICAgICovXHJcbiAgICBhc3luYyB0cmlnZ2VySGVhcnRiZWF0KCkge1xyXG4gICAgICAgIHZhciBfYSwgX2I7XHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgY29uc3QgcGxhdGZvcm1Mb2dnZXIgPSB0aGlzLmNvbnRhaW5lclxyXG4gICAgICAgICAgICAgICAgLmdldFByb3ZpZGVyKCdwbGF0Zm9ybS1sb2dnZXInKVxyXG4gICAgICAgICAgICAgICAgLmdldEltbWVkaWF0ZSgpO1xyXG4gICAgICAgICAgICAvLyBUaGlzIGlzIHRoZSBcIkZpcmViYXNlIHVzZXIgYWdlbnRcIiBzdHJpbmcgZnJvbSB0aGUgcGxhdGZvcm0gbG9nZ2VyXHJcbiAgICAgICAgICAgIC8vIHNlcnZpY2UsIG5vdCB0aGUgYnJvd3NlciB1c2VyIGFnZW50LlxyXG4gICAgICAgICAgICBjb25zdCBhZ2VudCA9IHBsYXRmb3JtTG9nZ2VyLmdldFBsYXRmb3JtSW5mb1N0cmluZygpO1xyXG4gICAgICAgICAgICBjb25zdCBkYXRlID0gZ2V0VVRDRGF0ZVN0cmluZygpO1xyXG4gICAgICAgICAgICBpZiAoKChfYSA9IHRoaXMuX2hlYXJ0YmVhdHNDYWNoZSkgPT09IG51bGwgfHwgX2EgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9hLmhlYXJ0YmVhdHMpID09IG51bGwpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2hlYXJ0YmVhdHNDYWNoZSA9IGF3YWl0IHRoaXMuX2hlYXJ0YmVhdHNDYWNoZVByb21pc2U7XHJcbiAgICAgICAgICAgICAgICAvLyBJZiB3ZSBmYWlsZWQgdG8gY29uc3RydWN0IGEgaGVhcnRiZWF0cyBjYWNoZSwgdGhlbiByZXR1cm4gaW1tZWRpYXRlbHkuXHJcbiAgICAgICAgICAgICAgICBpZiAoKChfYiA9IHRoaXMuX2hlYXJ0YmVhdHNDYWNoZSkgPT09IG51bGwgfHwgX2IgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9iLmhlYXJ0YmVhdHMpID09IG51bGwpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgLy8gRG8gbm90IHN0b3JlIGEgaGVhcnRiZWF0IGlmIG9uZSBpcyBhbHJlYWR5IHN0b3JlZCBmb3IgdGhpcyBkYXlcclxuICAgICAgICAgICAgLy8gb3IgaWYgYSBoZWFkZXIgaGFzIGFscmVhZHkgYmVlbiBzZW50IHRvZGF5LlxyXG4gICAgICAgICAgICBpZiAodGhpcy5faGVhcnRiZWF0c0NhY2hlLmxhc3RTZW50SGVhcnRiZWF0RGF0ZSA9PT0gZGF0ZSB8fFxyXG4gICAgICAgICAgICAgICAgdGhpcy5faGVhcnRiZWF0c0NhY2hlLmhlYXJ0YmVhdHMuc29tZShzaW5nbGVEYXRlSGVhcnRiZWF0ID0+IHNpbmdsZURhdGVIZWFydGJlYXQuZGF0ZSA9PT0gZGF0ZSkpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIC8vIFRoZXJlIGlzIG5vIGVudHJ5IGZvciB0aGlzIGRhdGUuIENyZWF0ZSBvbmUuXHJcbiAgICAgICAgICAgICAgICB0aGlzLl9oZWFydGJlYXRzQ2FjaGUuaGVhcnRiZWF0cy5wdXNoKHsgZGF0ZSwgYWdlbnQgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgLy8gUmVtb3ZlIGVudHJpZXMgb2xkZXIgdGhhbiAzMCBkYXlzLlxyXG4gICAgICAgICAgICB0aGlzLl9oZWFydGJlYXRzQ2FjaGUuaGVhcnRiZWF0cyA9XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9oZWFydGJlYXRzQ2FjaGUuaGVhcnRiZWF0cy5maWx0ZXIoc2luZ2xlRGF0ZUhlYXJ0YmVhdCA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgaGJUaW1lc3RhbXAgPSBuZXcgRGF0ZShzaW5nbGVEYXRlSGVhcnRiZWF0LmRhdGUpLnZhbHVlT2YoKTtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBub3cgPSBEYXRlLm5vdygpO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBub3cgLSBoYlRpbWVzdGFtcCA8PSBTVE9SRURfSEVBUlRCRUFUX1JFVEVOVElPTl9NQVhfTUlMTElTO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9zdG9yYWdlLm92ZXJ3cml0ZSh0aGlzLl9oZWFydGJlYXRzQ2FjaGUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjYXRjaCAoZSkge1xyXG4gICAgICAgICAgICBsb2dnZXIud2FybihlKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIFJldHVybnMgYSBiYXNlNjQgZW5jb2RlZCBzdHJpbmcgd2hpY2ggY2FuIGJlIGF0dGFjaGVkIHRvIHRoZSBoZWFydGJlYXQtc3BlY2lmaWMgaGVhZGVyIGRpcmVjdGx5LlxyXG4gICAgICogSXQgYWxzbyBjbGVhcnMgYWxsIGhlYXJ0YmVhdHMgZnJvbSBtZW1vcnkgYXMgd2VsbCBhcyBpbiBJbmRleGVkREIuXHJcbiAgICAgKlxyXG4gICAgICogTk9URTogQ29uc3VtaW5nIHByb2R1Y3QgU0RLcyBzaG91bGQgbm90IHNlbmQgdGhlIGhlYWRlciBpZiB0aGlzIG1ldGhvZFxyXG4gICAgICogcmV0dXJucyBhbiBlbXB0eSBzdHJpbmcuXHJcbiAgICAgKi9cclxuICAgIGFzeW5jIGdldEhlYXJ0YmVhdHNIZWFkZXIoKSB7XHJcbiAgICAgICAgdmFyIF9hO1xyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLl9oZWFydGJlYXRzQ2FjaGUgPT09IG51bGwpIHtcclxuICAgICAgICAgICAgICAgIGF3YWl0IHRoaXMuX2hlYXJ0YmVhdHNDYWNoZVByb21pc2U7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgLy8gSWYgaXQncyBzdGlsbCBudWxsIG9yIHRoZSBhcnJheSBpcyBlbXB0eSwgdGhlcmUgaXMgbm8gZGF0YSB0byBzZW5kLlxyXG4gICAgICAgICAgICBpZiAoKChfYSA9IHRoaXMuX2hlYXJ0YmVhdHNDYWNoZSkgPT09IG51bGwgfHwgX2EgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9hLmhlYXJ0YmVhdHMpID09IG51bGwgfHxcclxuICAgICAgICAgICAgICAgIHRoaXMuX2hlYXJ0YmVhdHNDYWNoZS5oZWFydGJlYXRzLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuICcnO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGNvbnN0IGRhdGUgPSBnZXRVVENEYXRlU3RyaW5nKCk7XHJcbiAgICAgICAgICAgIC8vIEV4dHJhY3QgYXMgbWFueSBoZWFydGJlYXRzIGZyb20gdGhlIGNhY2hlIGFzIHdpbGwgZml0IHVuZGVyIHRoZSBzaXplIGxpbWl0LlxyXG4gICAgICAgICAgICBjb25zdCB7IGhlYXJ0YmVhdHNUb1NlbmQsIHVuc2VudEVudHJpZXMgfSA9IGV4dHJhY3RIZWFydGJlYXRzRm9ySGVhZGVyKHRoaXMuX2hlYXJ0YmVhdHNDYWNoZS5oZWFydGJlYXRzKTtcclxuICAgICAgICAgICAgY29uc3QgaGVhZGVyU3RyaW5nID0gYmFzZTY0dXJsRW5jb2RlV2l0aG91dFBhZGRpbmcoSlNPTi5zdHJpbmdpZnkoeyB2ZXJzaW9uOiAyLCBoZWFydGJlYXRzOiBoZWFydGJlYXRzVG9TZW5kIH0pKTtcclxuICAgICAgICAgICAgLy8gU3RvcmUgbGFzdCBzZW50IGRhdGUgdG8gcHJldmVudCBhbm90aGVyIGJlaW5nIGxvZ2dlZC9zZW50IGZvciB0aGUgc2FtZSBkYXkuXHJcbiAgICAgICAgICAgIHRoaXMuX2hlYXJ0YmVhdHNDYWNoZS5sYXN0U2VudEhlYXJ0YmVhdERhdGUgPSBkYXRlO1xyXG4gICAgICAgICAgICBpZiAodW5zZW50RW50cmllcy5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgICAgICAvLyBTdG9yZSBhbnkgdW5zZW50IGVudHJpZXMgaWYgdGhleSBleGlzdC5cclxuICAgICAgICAgICAgICAgIHRoaXMuX2hlYXJ0YmVhdHNDYWNoZS5oZWFydGJlYXRzID0gdW5zZW50RW50cmllcztcclxuICAgICAgICAgICAgICAgIC8vIFRoaXMgc2VlbXMgbW9yZSBsaWtlbHkgdGhhbiBlbXB0eWluZyB0aGUgYXJyYXkgKGJlbG93KSB0byBsZWFkIHRvIHNvbWUgb2RkIHN0YXRlXHJcbiAgICAgICAgICAgICAgICAvLyBzaW5jZSB0aGUgY2FjaGUgaXNuJ3QgZW1wdHkgYW5kIHRoaXMgd2lsbCBiZSBjYWxsZWQgYWdhaW4gb24gdGhlIG5leHQgcmVxdWVzdCxcclxuICAgICAgICAgICAgICAgIC8vIGFuZCBpcyBwcm9iYWJseSBzYWZlc3QgaWYgd2UgYXdhaXQgaXQuXHJcbiAgICAgICAgICAgICAgICBhd2FpdCB0aGlzLl9zdG9yYWdlLm92ZXJ3cml0ZSh0aGlzLl9oZWFydGJlYXRzQ2FjaGUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5faGVhcnRiZWF0c0NhY2hlLmhlYXJ0YmVhdHMgPSBbXTtcclxuICAgICAgICAgICAgICAgIC8vIERvIG5vdCB3YWl0IGZvciB0aGlzLCB0byByZWR1Y2UgbGF0ZW5jeS5cclxuICAgICAgICAgICAgICAgIHZvaWQgdGhpcy5fc3RvcmFnZS5vdmVyd3JpdGUodGhpcy5faGVhcnRiZWF0c0NhY2hlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gaGVhZGVyU3RyaW5nO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjYXRjaCAoZSkge1xyXG4gICAgICAgICAgICBsb2dnZXIud2FybihlKTtcclxuICAgICAgICAgICAgcmV0dXJuICcnO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5mdW5jdGlvbiBnZXRVVENEYXRlU3RyaW5nKCkge1xyXG4gICAgY29uc3QgdG9kYXkgPSBuZXcgRGF0ZSgpO1xyXG4gICAgLy8gUmV0dXJucyBkYXRlIGZvcm1hdCAnWVlZWS1NTS1ERCdcclxuICAgIHJldHVybiB0b2RheS50b0lTT1N0cmluZygpLnN1YnN0cmluZygwLCAxMCk7XHJcbn1cclxuZnVuY3Rpb24gZXh0cmFjdEhlYXJ0YmVhdHNGb3JIZWFkZXIoaGVhcnRiZWF0c0NhY2hlLCBtYXhTaXplID0gTUFYX0hFQURFUl9CWVRFUykge1xyXG4gICAgLy8gSGVhcnRiZWF0cyBncm91cGVkIGJ5IHVzZXIgYWdlbnQgaW4gdGhlIHN0YW5kYXJkIGZvcm1hdCB0byBiZSBzZW50IGluXHJcbiAgICAvLyB0aGUgaGVhZGVyLlxyXG4gICAgY29uc3QgaGVhcnRiZWF0c1RvU2VuZCA9IFtdO1xyXG4gICAgLy8gU2luZ2xlIGRhdGUgZm9ybWF0IGhlYXJ0YmVhdHMgdGhhdCBhcmUgbm90IHNlbnQuXHJcbiAgICBsZXQgdW5zZW50RW50cmllcyA9IGhlYXJ0YmVhdHNDYWNoZS5zbGljZSgpO1xyXG4gICAgZm9yIChjb25zdCBzaW5nbGVEYXRlSGVhcnRiZWF0IG9mIGhlYXJ0YmVhdHNDYWNoZSkge1xyXG4gICAgICAgIC8vIExvb2sgZm9yIGFuIGV4aXN0aW5nIGVudHJ5IHdpdGggdGhlIHNhbWUgdXNlciBhZ2VudC5cclxuICAgICAgICBjb25zdCBoZWFydGJlYXRFbnRyeSA9IGhlYXJ0YmVhdHNUb1NlbmQuZmluZChoYiA9PiBoYi5hZ2VudCA9PT0gc2luZ2xlRGF0ZUhlYXJ0YmVhdC5hZ2VudCk7XHJcbiAgICAgICAgaWYgKCFoZWFydGJlYXRFbnRyeSkge1xyXG4gICAgICAgICAgICAvLyBJZiBubyBlbnRyeSBmb3IgdGhpcyB1c2VyIGFnZW50IGV4aXN0cywgY3JlYXRlIG9uZS5cclxuICAgICAgICAgICAgaGVhcnRiZWF0c1RvU2VuZC5wdXNoKHtcclxuICAgICAgICAgICAgICAgIGFnZW50OiBzaW5nbGVEYXRlSGVhcnRiZWF0LmFnZW50LFxyXG4gICAgICAgICAgICAgICAgZGF0ZXM6IFtzaW5nbGVEYXRlSGVhcnRiZWF0LmRhdGVdXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICBpZiAoY291bnRCeXRlcyhoZWFydGJlYXRzVG9TZW5kKSA+IG1heFNpemUpIHtcclxuICAgICAgICAgICAgICAgIC8vIElmIHRoZSBoZWFkZXIgd291bGQgZXhjZWVkIG1heCBzaXplLCByZW1vdmUgdGhlIGFkZGVkIGhlYXJ0YmVhdFxyXG4gICAgICAgICAgICAgICAgLy8gZW50cnkgYW5kIHN0b3AgYWRkaW5nIHRvIHRoZSBoZWFkZXIuXHJcbiAgICAgICAgICAgICAgICBoZWFydGJlYXRzVG9TZW5kLnBvcCgpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIGhlYXJ0YmVhdEVudHJ5LmRhdGVzLnB1c2goc2luZ2xlRGF0ZUhlYXJ0YmVhdC5kYXRlKTtcclxuICAgICAgICAgICAgLy8gSWYgdGhlIGhlYWRlciB3b3VsZCBleGNlZWQgbWF4IHNpemUsIHJlbW92ZSB0aGUgYWRkZWQgZGF0ZVxyXG4gICAgICAgICAgICAvLyBhbmQgc3RvcCBhZGRpbmcgdG8gdGhlIGhlYWRlci5cclxuICAgICAgICAgICAgaWYgKGNvdW50Qnl0ZXMoaGVhcnRiZWF0c1RvU2VuZCkgPiBtYXhTaXplKSB7XHJcbiAgICAgICAgICAgICAgICBoZWFydGJlYXRFbnRyeS5kYXRlcy5wb3AoKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIFBvcCB1bnNlbnQgZW50cnkgZnJvbSBxdWV1ZS4gKFNraXBwZWQgaWYgYWRkaW5nIHRoZSBlbnRyeSBleGNlZWRlZFxyXG4gICAgICAgIC8vIHF1b3RhIGFuZCB0aGUgbG9vcCBicmVha3MgZWFybHkuKVxyXG4gICAgICAgIHVuc2VudEVudHJpZXMgPSB1bnNlbnRFbnRyaWVzLnNsaWNlKDEpO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICBoZWFydGJlYXRzVG9TZW5kLFxyXG4gICAgICAgIHVuc2VudEVudHJpZXNcclxuICAgIH07XHJcbn1cclxuY2xhc3MgSGVhcnRiZWF0U3RvcmFnZUltcGwge1xyXG4gICAgY29uc3RydWN0b3IoYXBwKSB7XHJcbiAgICAgICAgdGhpcy5hcHAgPSBhcHA7XHJcbiAgICAgICAgdGhpcy5fY2FuVXNlSW5kZXhlZERCUHJvbWlzZSA9IHRoaXMucnVuSW5kZXhlZERCRW52aXJvbm1lbnRDaGVjaygpO1xyXG4gICAgfVxyXG4gICAgYXN5bmMgcnVuSW5kZXhlZERCRW52aXJvbm1lbnRDaGVjaygpIHtcclxuICAgICAgICBpZiAoIWlzSW5kZXhlZERCQXZhaWxhYmxlKCkpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgcmV0dXJuIHZhbGlkYXRlSW5kZXhlZERCT3BlbmFibGUoKVxyXG4gICAgICAgICAgICAgICAgLnRoZW4oKCkgPT4gdHJ1ZSlcclxuICAgICAgICAgICAgICAgIC5jYXRjaCgoKSA9PiBmYWxzZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiBSZWFkIGFsbCBoZWFydGJlYXRzLlxyXG4gICAgICovXHJcbiAgICBhc3luYyByZWFkKCkge1xyXG4gICAgICAgIGNvbnN0IGNhblVzZUluZGV4ZWREQiA9IGF3YWl0IHRoaXMuX2NhblVzZUluZGV4ZWREQlByb21pc2U7XHJcbiAgICAgICAgaWYgKCFjYW5Vc2VJbmRleGVkREIpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHsgaGVhcnRiZWF0czogW10gfTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGlkYkhlYXJ0YmVhdE9iamVjdCA9IGF3YWl0IHJlYWRIZWFydGJlYXRzRnJvbUluZGV4ZWREQih0aGlzLmFwcCk7XHJcbiAgICAgICAgICAgIGlmIChpZGJIZWFydGJlYXRPYmplY3QgPT09IG51bGwgfHwgaWRiSGVhcnRiZWF0T2JqZWN0ID09PSB2b2lkIDAgPyB2b2lkIDAgOiBpZGJIZWFydGJlYXRPYmplY3QuaGVhcnRiZWF0cykge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGlkYkhlYXJ0YmVhdE9iamVjdDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB7IGhlYXJ0YmVhdHM6IFtdIH07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICAvLyBvdmVyd3JpdGUgdGhlIHN0b3JhZ2Ugd2l0aCB0aGUgcHJvdmlkZWQgaGVhcnRiZWF0c1xyXG4gICAgYXN5bmMgb3ZlcndyaXRlKGhlYXJ0YmVhdHNPYmplY3QpIHtcclxuICAgICAgICB2YXIgX2E7XHJcbiAgICAgICAgY29uc3QgY2FuVXNlSW5kZXhlZERCID0gYXdhaXQgdGhpcy5fY2FuVXNlSW5kZXhlZERCUHJvbWlzZTtcclxuICAgICAgICBpZiAoIWNhblVzZUluZGV4ZWREQikge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBjb25zdCBleGlzdGluZ0hlYXJ0YmVhdHNPYmplY3QgPSBhd2FpdCB0aGlzLnJlYWQoKTtcclxuICAgICAgICAgICAgcmV0dXJuIHdyaXRlSGVhcnRiZWF0c1RvSW5kZXhlZERCKHRoaXMuYXBwLCB7XHJcbiAgICAgICAgICAgICAgICBsYXN0U2VudEhlYXJ0YmVhdERhdGU6IChfYSA9IGhlYXJ0YmVhdHNPYmplY3QubGFzdFNlbnRIZWFydGJlYXREYXRlKSAhPT0gbnVsbCAmJiBfYSAhPT0gdm9pZCAwID8gX2EgOiBleGlzdGluZ0hlYXJ0YmVhdHNPYmplY3QubGFzdFNlbnRIZWFydGJlYXREYXRlLFxyXG4gICAgICAgICAgICAgICAgaGVhcnRiZWF0czogaGVhcnRiZWF0c09iamVjdC5oZWFydGJlYXRzXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIC8vIGFkZCBoZWFydGJlYXRzXHJcbiAgICBhc3luYyBhZGQoaGVhcnRiZWF0c09iamVjdCkge1xyXG4gICAgICAgIHZhciBfYTtcclxuICAgICAgICBjb25zdCBjYW5Vc2VJbmRleGVkREIgPSBhd2FpdCB0aGlzLl9jYW5Vc2VJbmRleGVkREJQcm9taXNlO1xyXG4gICAgICAgIGlmICghY2FuVXNlSW5kZXhlZERCKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGV4aXN0aW5nSGVhcnRiZWF0c09iamVjdCA9IGF3YWl0IHRoaXMucmVhZCgpO1xyXG4gICAgICAgICAgICByZXR1cm4gd3JpdGVIZWFydGJlYXRzVG9JbmRleGVkREIodGhpcy5hcHAsIHtcclxuICAgICAgICAgICAgICAgIGxhc3RTZW50SGVhcnRiZWF0RGF0ZTogKF9hID0gaGVhcnRiZWF0c09iamVjdC5sYXN0U2VudEhlYXJ0YmVhdERhdGUpICE9PSBudWxsICYmIF9hICE9PSB2b2lkIDAgPyBfYSA6IGV4aXN0aW5nSGVhcnRiZWF0c09iamVjdC5sYXN0U2VudEhlYXJ0YmVhdERhdGUsXHJcbiAgICAgICAgICAgICAgICBoZWFydGJlYXRzOiBbXHJcbiAgICAgICAgICAgICAgICAgICAgLi4uZXhpc3RpbmdIZWFydGJlYXRzT2JqZWN0LmhlYXJ0YmVhdHMsXHJcbiAgICAgICAgICAgICAgICAgICAgLi4uaGVhcnRiZWF0c09iamVjdC5oZWFydGJlYXRzXHJcbiAgICAgICAgICAgICAgICBdXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4vKipcclxuICogQ2FsY3VsYXRlIGJ5dGVzIG9mIGEgSGVhcnRiZWF0c0J5VXNlckFnZW50IGFycmF5IGFmdGVyIGJlaW5nIHdyYXBwZWRcclxuICogaW4gYSBwbGF0Zm9ybSBsb2dnaW5nIGhlYWRlciBKU09OIG9iamVjdCwgc3RyaW5naWZpZWQsIGFuZCBjb252ZXJ0ZWRcclxuICogdG8gYmFzZSA2NC5cclxuICovXHJcbmZ1bmN0aW9uIGNvdW50Qnl0ZXMoaGVhcnRiZWF0c0NhY2hlKSB7XHJcbiAgICAvLyBiYXNlNjQgaGFzIGEgcmVzdHJpY3RlZCBzZXQgb2YgY2hhcmFjdGVycywgYWxsIG9mIHdoaWNoIHNob3VsZCBiZSAxIGJ5dGUuXHJcbiAgICByZXR1cm4gYmFzZTY0dXJsRW5jb2RlV2l0aG91dFBhZGRpbmcoXHJcbiAgICAvLyBoZWFydGJlYXRzQ2FjaGUgd3JhcHBlciBwcm9wZXJ0aWVzXHJcbiAgICBKU09OLnN0cmluZ2lmeSh7IHZlcnNpb246IDIsIGhlYXJ0YmVhdHM6IGhlYXJ0YmVhdHNDYWNoZSB9KSkubGVuZ3RoO1xyXG59XG5cbi8qKlxyXG4gKiBAbGljZW5zZVxyXG4gKiBDb3B5cmlnaHQgMjAxOSBHb29nbGUgTExDXHJcbiAqXHJcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XHJcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cclxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XHJcbiAqXHJcbiAqICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXHJcbiAqXHJcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcclxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxyXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cclxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxyXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cclxuICovXHJcbmZ1bmN0aW9uIHJlZ2lzdGVyQ29yZUNvbXBvbmVudHModmFyaWFudCkge1xyXG4gICAgX3JlZ2lzdGVyQ29tcG9uZW50KG5ldyBDb21wb25lbnQoJ3BsYXRmb3JtLWxvZ2dlcicsIGNvbnRhaW5lciA9PiBuZXcgUGxhdGZvcm1Mb2dnZXJTZXJ2aWNlSW1wbChjb250YWluZXIpLCBcIlBSSVZBVEVcIiAvKiBDb21wb25lbnRUeXBlLlBSSVZBVEUgKi8pKTtcclxuICAgIF9yZWdpc3RlckNvbXBvbmVudChuZXcgQ29tcG9uZW50KCdoZWFydGJlYXQnLCBjb250YWluZXIgPT4gbmV3IEhlYXJ0YmVhdFNlcnZpY2VJbXBsKGNvbnRhaW5lciksIFwiUFJJVkFURVwiIC8qIENvbXBvbmVudFR5cGUuUFJJVkFURSAqLykpO1xyXG4gICAgLy8gUmVnaXN0ZXIgYGFwcGAgcGFja2FnZS5cclxuICAgIHJlZ2lzdGVyVmVyc2lvbihuYW1lJHAsIHZlcnNpb24kMSwgdmFyaWFudCk7XHJcbiAgICAvLyBCVUlMRF9UQVJHRVQgd2lsbCBiZSByZXBsYWNlZCBieSB2YWx1ZXMgbGlrZSBlc201LCBlc20yMDE3LCBjanM1LCBldGMgZHVyaW5nIHRoZSBjb21waWxhdGlvblxyXG4gICAgcmVnaXN0ZXJWZXJzaW9uKG5hbWUkcCwgdmVyc2lvbiQxLCAnZXNtMjAxNycpO1xyXG4gICAgLy8gUmVnaXN0ZXIgcGxhdGZvcm0gU0RLIGlkZW50aWZpZXIgKG5vIHZlcnNpb24pLlxyXG4gICAgcmVnaXN0ZXJWZXJzaW9uKCdmaXJlLWpzJywgJycpO1xyXG59XG5cbi8qKlxyXG4gKiBGaXJlYmFzZSBBcHBcclxuICpcclxuICogQHJlbWFya3MgVGhpcyBwYWNrYWdlIGNvb3JkaW5hdGVzIHRoZSBjb21tdW5pY2F0aW9uIGJldHdlZW4gdGhlIGRpZmZlcmVudCBGaXJlYmFzZSBjb21wb25lbnRzXHJcbiAqIEBwYWNrYWdlRG9jdW1lbnRhdGlvblxyXG4gKi9cclxucmVnaXN0ZXJDb3JlQ29tcG9uZW50cygnJyk7XG5cbmV4cG9ydCB7IFNES19WRVJTSU9OLCBERUZBVUxUX0VOVFJZX05BTUUgYXMgX0RFRkFVTFRfRU5UUllfTkFNRSwgX2FkZENvbXBvbmVudCwgX2FkZE9yT3ZlcndyaXRlQ29tcG9uZW50LCBfYXBwcywgX2NsZWFyQ29tcG9uZW50cywgX2NvbXBvbmVudHMsIF9nZXRQcm92aWRlciwgX2lzRmlyZWJhc2VBcHAsIF9pc0ZpcmViYXNlU2VydmVyQXBwLCBfcmVnaXN0ZXJDb21wb25lbnQsIF9yZW1vdmVTZXJ2aWNlSW5zdGFuY2UsIF9zZXJ2ZXJBcHBzLCBkZWxldGVBcHAsIGdldEFwcCwgZ2V0QXBwcywgaW5pdGlhbGl6ZUFwcCwgaW5pdGlhbGl6ZVNlcnZlckFwcCwgb25Mb2csIHJlZ2lzdGVyVmVyc2lvbiwgc2V0TG9nTGV2ZWwgfTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWluZGV4LmVzbTIwMTcuanMubWFwXG4iLCJpbXBvcnQgeyByZWdpc3RlclZlcnNpb24gfSBmcm9tICdAZmlyZWJhc2UvYXBwJztcbmV4cG9ydCAqIGZyb20gJ0BmaXJlYmFzZS9hcHAnO1xuXG52YXIgbmFtZSA9IFwiZmlyZWJhc2VcIjtcbnZhciB2ZXJzaW9uID0gXCIxMC4xMy4xXCI7XG5cbi8qKlxyXG4gKiBAbGljZW5zZVxyXG4gKiBDb3B5cmlnaHQgMjAyMCBHb29nbGUgTExDXHJcbiAqXHJcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XHJcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cclxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XHJcbiAqXHJcbiAqICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXHJcbiAqXHJcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcclxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxyXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cclxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxyXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cclxuICovXHJcbnJlZ2lzdGVyVmVyc2lvbihuYW1lLCB2ZXJzaW9uLCAnYXBwJyk7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1pbmRleC5lc20uanMubWFwXG4iLCIvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG5Db3B5cmlnaHQgKGMpIE1pY3Jvc29mdCBDb3Jwb3JhdGlvbi5cblxuUGVybWlzc2lvbiB0byB1c2UsIGNvcHksIG1vZGlmeSwgYW5kL29yIGRpc3RyaWJ1dGUgdGhpcyBzb2Z0d2FyZSBmb3IgYW55XG5wdXJwb3NlIHdpdGggb3Igd2l0aG91dCBmZWUgaXMgaGVyZWJ5IGdyYW50ZWQuXG5cblRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIgQU5EIFRIRSBBVVRIT1IgRElTQ0xBSU1TIEFMTCBXQVJSQU5USUVTIFdJVEhcblJFR0FSRCBUTyBUSElTIFNPRlRXQVJFIElOQ0xVRElORyBBTEwgSU1QTElFRCBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWVxuQU5EIEZJVE5FU1MuIElOIE5PIEVWRU5UIFNIQUxMIFRIRSBBVVRIT1IgQkUgTElBQkxFIEZPUiBBTlkgU1BFQ0lBTCwgRElSRUNULFxuSU5ESVJFQ1QsIE9SIENPTlNFUVVFTlRJQUwgREFNQUdFUyBPUiBBTlkgREFNQUdFUyBXSEFUU09FVkVSIFJFU1VMVElORyBGUk9NXG5MT1NTIE9GIFVTRSwgREFUQSBPUiBQUk9GSVRTLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgTkVHTElHRU5DRSBPUlxuT1RIRVIgVE9SVElPVVMgQUNUSU9OLCBBUklTSU5HIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFVTRSBPUlxuUEVSRk9STUFOQ0UgT0YgVEhJUyBTT0ZUV0FSRS5cbioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqICovXG4vKiBnbG9iYWwgUmVmbGVjdCwgUHJvbWlzZSwgU3VwcHJlc3NlZEVycm9yLCBTeW1ib2wsIEl0ZXJhdG9yICovXG5cbnZhciBleHRlbmRTdGF0aWNzID0gZnVuY3Rpb24oZCwgYikge1xuICBleHRlbmRTdGF0aWNzID0gT2JqZWN0LnNldFByb3RvdHlwZU9mIHx8XG4gICAgICAoeyBfX3Byb3RvX186IFtdIH0gaW5zdGFuY2VvZiBBcnJheSAmJiBmdW5jdGlvbiAoZCwgYikgeyBkLl9fcHJvdG9fXyA9IGI7IH0pIHx8XG4gICAgICBmdW5jdGlvbiAoZCwgYikgeyBmb3IgKHZhciBwIGluIGIpIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoYiwgcCkpIGRbcF0gPSBiW3BdOyB9O1xuICByZXR1cm4gZXh0ZW5kU3RhdGljcyhkLCBiKTtcbn07XG5cbmV4cG9ydCBmdW5jdGlvbiBfX2V4dGVuZHMoZCwgYikge1xuICBpZiAodHlwZW9mIGIgIT09IFwiZnVuY3Rpb25cIiAmJiBiICE9PSBudWxsKVxuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNsYXNzIGV4dGVuZHMgdmFsdWUgXCIgKyBTdHJpbmcoYikgKyBcIiBpcyBub3QgYSBjb25zdHJ1Y3RvciBvciBudWxsXCIpO1xuICBleHRlbmRTdGF0aWNzKGQsIGIpO1xuICBmdW5jdGlvbiBfXygpIHsgdGhpcy5jb25zdHJ1Y3RvciA9IGQ7IH1cbiAgZC5wcm90b3R5cGUgPSBiID09PSBudWxsID8gT2JqZWN0LmNyZWF0ZShiKSA6IChfXy5wcm90b3R5cGUgPSBiLnByb3RvdHlwZSwgbmV3IF9fKCkpO1xufVxuXG5leHBvcnQgdmFyIF9fYXNzaWduID0gZnVuY3Rpb24oKSB7XG4gIF9fYXNzaWduID0gT2JqZWN0LmFzc2lnbiB8fCBmdW5jdGlvbiBfX2Fzc2lnbih0KSB7XG4gICAgICBmb3IgKHZhciBzLCBpID0gMSwgbiA9IGFyZ3VtZW50cy5sZW5ndGg7IGkgPCBuOyBpKyspIHtcbiAgICAgICAgICBzID0gYXJndW1lbnRzW2ldO1xuICAgICAgICAgIGZvciAodmFyIHAgaW4gcykgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChzLCBwKSkgdFtwXSA9IHNbcF07XG4gICAgICB9XG4gICAgICByZXR1cm4gdDtcbiAgfVxuICByZXR1cm4gX19hc3NpZ24uYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIF9fcmVzdChzLCBlKSB7XG4gIHZhciB0ID0ge307XG4gIGZvciAodmFyIHAgaW4gcykgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChzLCBwKSAmJiBlLmluZGV4T2YocCkgPCAwKVxuICAgICAgdFtwXSA9IHNbcF07XG4gIGlmIChzICE9IG51bGwgJiYgdHlwZW9mIE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHMgPT09IFwiZnVuY3Rpb25cIilcbiAgICAgIGZvciAodmFyIGkgPSAwLCBwID0gT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scyhzKTsgaSA8IHAubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICBpZiAoZS5pbmRleE9mKHBbaV0pIDwgMCAmJiBPYmplY3QucHJvdG90eXBlLnByb3BlcnR5SXNFbnVtZXJhYmxlLmNhbGwocywgcFtpXSkpXG4gICAgICAgICAgICAgIHRbcFtpXV0gPSBzW3BbaV1dO1xuICAgICAgfVxuICByZXR1cm4gdDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIF9fZGVjb3JhdGUoZGVjb3JhdG9ycywgdGFyZ2V0LCBrZXksIGRlc2MpIHtcbiAgdmFyIGMgPSBhcmd1bWVudHMubGVuZ3RoLCByID0gYyA8IDMgPyB0YXJnZXQgOiBkZXNjID09PSBudWxsID8gZGVzYyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IodGFyZ2V0LCBrZXkpIDogZGVzYywgZDtcbiAgaWYgKHR5cGVvZiBSZWZsZWN0ID09PSBcIm9iamVjdFwiICYmIHR5cGVvZiBSZWZsZWN0LmRlY29yYXRlID09PSBcImZ1bmN0aW9uXCIpIHIgPSBSZWZsZWN0LmRlY29yYXRlKGRlY29yYXRvcnMsIHRhcmdldCwga2V5LCBkZXNjKTtcbiAgZWxzZSBmb3IgKHZhciBpID0gZGVjb3JhdG9ycy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkgaWYgKGQgPSBkZWNvcmF0b3JzW2ldKSByID0gKGMgPCAzID8gZChyKSA6IGMgPiAzID8gZCh0YXJnZXQsIGtleSwgcikgOiBkKHRhcmdldCwga2V5KSkgfHwgcjtcbiAgcmV0dXJuIGMgPiAzICYmIHIgJiYgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwga2V5LCByKSwgcjtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIF9fcGFyYW0ocGFyYW1JbmRleCwgZGVjb3JhdG9yKSB7XG4gIHJldHVybiBmdW5jdGlvbiAodGFyZ2V0LCBrZXkpIHsgZGVjb3JhdG9yKHRhcmdldCwga2V5LCBwYXJhbUluZGV4KTsgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gX19lc0RlY29yYXRlKGN0b3IsIGRlc2NyaXB0b3JJbiwgZGVjb3JhdG9ycywgY29udGV4dEluLCBpbml0aWFsaXplcnMsIGV4dHJhSW5pdGlhbGl6ZXJzKSB7XG4gIGZ1bmN0aW9uIGFjY2VwdChmKSB7IGlmIChmICE9PSB2b2lkIDAgJiYgdHlwZW9mIGYgIT09IFwiZnVuY3Rpb25cIikgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkZ1bmN0aW9uIGV4cGVjdGVkXCIpOyByZXR1cm4gZjsgfVxuICB2YXIga2luZCA9IGNvbnRleHRJbi5raW5kLCBrZXkgPSBraW5kID09PSBcImdldHRlclwiID8gXCJnZXRcIiA6IGtpbmQgPT09IFwic2V0dGVyXCIgPyBcInNldFwiIDogXCJ2YWx1ZVwiO1xuICB2YXIgdGFyZ2V0ID0gIWRlc2NyaXB0b3JJbiAmJiBjdG9yID8gY29udGV4dEluW1wic3RhdGljXCJdID8gY3RvciA6IGN0b3IucHJvdG90eXBlIDogbnVsbDtcbiAgdmFyIGRlc2NyaXB0b3IgPSBkZXNjcmlwdG9ySW4gfHwgKHRhcmdldCA/IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IodGFyZ2V0LCBjb250ZXh0SW4ubmFtZSkgOiB7fSk7XG4gIHZhciBfLCBkb25lID0gZmFsc2U7XG4gIGZvciAodmFyIGkgPSBkZWNvcmF0b3JzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgICB2YXIgY29udGV4dCA9IHt9O1xuICAgICAgZm9yICh2YXIgcCBpbiBjb250ZXh0SW4pIGNvbnRleHRbcF0gPSBwID09PSBcImFjY2Vzc1wiID8ge30gOiBjb250ZXh0SW5bcF07XG4gICAgICBmb3IgKHZhciBwIGluIGNvbnRleHRJbi5hY2Nlc3MpIGNvbnRleHQuYWNjZXNzW3BdID0gY29udGV4dEluLmFjY2Vzc1twXTtcbiAgICAgIGNvbnRleHQuYWRkSW5pdGlhbGl6ZXIgPSBmdW5jdGlvbiAoZikgeyBpZiAoZG9uZSkgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNhbm5vdCBhZGQgaW5pdGlhbGl6ZXJzIGFmdGVyIGRlY29yYXRpb24gaGFzIGNvbXBsZXRlZFwiKTsgZXh0cmFJbml0aWFsaXplcnMucHVzaChhY2NlcHQoZiB8fCBudWxsKSk7IH07XG4gICAgICB2YXIgcmVzdWx0ID0gKDAsIGRlY29yYXRvcnNbaV0pKGtpbmQgPT09IFwiYWNjZXNzb3JcIiA/IHsgZ2V0OiBkZXNjcmlwdG9yLmdldCwgc2V0OiBkZXNjcmlwdG9yLnNldCB9IDogZGVzY3JpcHRvcltrZXldLCBjb250ZXh0KTtcbiAgICAgIGlmIChraW5kID09PSBcImFjY2Vzc29yXCIpIHtcbiAgICAgICAgICBpZiAocmVzdWx0ID09PSB2b2lkIDApIGNvbnRpbnVlO1xuICAgICAgICAgIGlmIChyZXN1bHQgPT09IG51bGwgfHwgdHlwZW9mIHJlc3VsdCAhPT0gXCJvYmplY3RcIikgdGhyb3cgbmV3IFR5cGVFcnJvcihcIk9iamVjdCBleHBlY3RlZFwiKTtcbiAgICAgICAgICBpZiAoXyA9IGFjY2VwdChyZXN1bHQuZ2V0KSkgZGVzY3JpcHRvci5nZXQgPSBfO1xuICAgICAgICAgIGlmIChfID0gYWNjZXB0KHJlc3VsdC5zZXQpKSBkZXNjcmlwdG9yLnNldCA9IF87XG4gICAgICAgICAgaWYgKF8gPSBhY2NlcHQocmVzdWx0LmluaXQpKSBpbml0aWFsaXplcnMudW5zaGlmdChfKTtcbiAgICAgIH1cbiAgICAgIGVsc2UgaWYgKF8gPSBhY2NlcHQocmVzdWx0KSkge1xuICAgICAgICAgIGlmIChraW5kID09PSBcImZpZWxkXCIpIGluaXRpYWxpemVycy51bnNoaWZ0KF8pO1xuICAgICAgICAgIGVsc2UgZGVzY3JpcHRvcltrZXldID0gXztcbiAgICAgIH1cbiAgfVxuICBpZiAodGFyZ2V0KSBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBjb250ZXh0SW4ubmFtZSwgZGVzY3JpcHRvcik7XG4gIGRvbmUgPSB0cnVlO1xufTtcblxuZXhwb3J0IGZ1bmN0aW9uIF9fcnVuSW5pdGlhbGl6ZXJzKHRoaXNBcmcsIGluaXRpYWxpemVycywgdmFsdWUpIHtcbiAgdmFyIHVzZVZhbHVlID0gYXJndW1lbnRzLmxlbmd0aCA+IDI7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgaW5pdGlhbGl6ZXJzLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YWx1ZSA9IHVzZVZhbHVlID8gaW5pdGlhbGl6ZXJzW2ldLmNhbGwodGhpc0FyZywgdmFsdWUpIDogaW5pdGlhbGl6ZXJzW2ldLmNhbGwodGhpc0FyZyk7XG4gIH1cbiAgcmV0dXJuIHVzZVZhbHVlID8gdmFsdWUgOiB2b2lkIDA7XG59O1xuXG5leHBvcnQgZnVuY3Rpb24gX19wcm9wS2V5KHgpIHtcbiAgcmV0dXJuIHR5cGVvZiB4ID09PSBcInN5bWJvbFwiID8geCA6IFwiXCIuY29uY2F0KHgpO1xufTtcblxuZXhwb3J0IGZ1bmN0aW9uIF9fc2V0RnVuY3Rpb25OYW1lKGYsIG5hbWUsIHByZWZpeCkge1xuICBpZiAodHlwZW9mIG5hbWUgPT09IFwic3ltYm9sXCIpIG5hbWUgPSBuYW1lLmRlc2NyaXB0aW9uID8gXCJbXCIuY29uY2F0KG5hbWUuZGVzY3JpcHRpb24sIFwiXVwiKSA6IFwiXCI7XG4gIHJldHVybiBPYmplY3QuZGVmaW5lUHJvcGVydHkoZiwgXCJuYW1lXCIsIHsgY29uZmlndXJhYmxlOiB0cnVlLCB2YWx1ZTogcHJlZml4ID8gXCJcIi5jb25jYXQocHJlZml4LCBcIiBcIiwgbmFtZSkgOiBuYW1lIH0pO1xufTtcblxuZXhwb3J0IGZ1bmN0aW9uIF9fbWV0YWRhdGEobWV0YWRhdGFLZXksIG1ldGFkYXRhVmFsdWUpIHtcbiAgaWYgKHR5cGVvZiBSZWZsZWN0ID09PSBcIm9iamVjdFwiICYmIHR5cGVvZiBSZWZsZWN0Lm1ldGFkYXRhID09PSBcImZ1bmN0aW9uXCIpIHJldHVybiBSZWZsZWN0Lm1ldGFkYXRhKG1ldGFkYXRhS2V5LCBtZXRhZGF0YVZhbHVlKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIF9fYXdhaXRlcih0aGlzQXJnLCBfYXJndW1lbnRzLCBQLCBnZW5lcmF0b3IpIHtcbiAgZnVuY3Rpb24gYWRvcHQodmFsdWUpIHsgcmV0dXJuIHZhbHVlIGluc3RhbmNlb2YgUCA/IHZhbHVlIDogbmV3IFAoZnVuY3Rpb24gKHJlc29sdmUpIHsgcmVzb2x2ZSh2YWx1ZSk7IH0pOyB9XG4gIHJldHVybiBuZXcgKFAgfHwgKFAgPSBQcm9taXNlKSkoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgZnVuY3Rpb24gZnVsZmlsbGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yLm5leHQodmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxuICAgICAgZnVuY3Rpb24gcmVqZWN0ZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3JbXCJ0aHJvd1wiXSh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XG4gICAgICBmdW5jdGlvbiBzdGVwKHJlc3VsdCkgeyByZXN1bHQuZG9uZSA/IHJlc29sdmUocmVzdWx0LnZhbHVlKSA6IGFkb3B0KHJlc3VsdC52YWx1ZSkudGhlbihmdWxmaWxsZWQsIHJlamVjdGVkKTsgfVxuICAgICAgc3RlcCgoZ2VuZXJhdG9yID0gZ2VuZXJhdG9yLmFwcGx5KHRoaXNBcmcsIF9hcmd1bWVudHMgfHwgW10pKS5uZXh0KCkpO1xuICB9KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIF9fZ2VuZXJhdG9yKHRoaXNBcmcsIGJvZHkpIHtcbiAgdmFyIF8gPSB7IGxhYmVsOiAwLCBzZW50OiBmdW5jdGlvbigpIHsgaWYgKHRbMF0gJiAxKSB0aHJvdyB0WzFdOyByZXR1cm4gdFsxXTsgfSwgdHJ5czogW10sIG9wczogW10gfSwgZiwgeSwgdCwgZyA9IE9iamVjdC5jcmVhdGUoKHR5cGVvZiBJdGVyYXRvciA9PT0gXCJmdW5jdGlvblwiID8gSXRlcmF0b3IgOiBPYmplY3QpLnByb3RvdHlwZSk7XG4gIHJldHVybiBnLm5leHQgPSB2ZXJiKDApLCBnW1widGhyb3dcIl0gPSB2ZXJiKDEpLCBnW1wicmV0dXJuXCJdID0gdmVyYigyKSwgdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIChnW1N5bWJvbC5pdGVyYXRvcl0gPSBmdW5jdGlvbigpIHsgcmV0dXJuIHRoaXM7IH0pLCBnO1xuICBmdW5jdGlvbiB2ZXJiKG4pIHsgcmV0dXJuIGZ1bmN0aW9uICh2KSB7IHJldHVybiBzdGVwKFtuLCB2XSk7IH07IH1cbiAgZnVuY3Rpb24gc3RlcChvcCkge1xuICAgICAgaWYgKGYpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJHZW5lcmF0b3IgaXMgYWxyZWFkeSBleGVjdXRpbmcuXCIpO1xuICAgICAgd2hpbGUgKGcgJiYgKGcgPSAwLCBvcFswXSAmJiAoXyA9IDApKSwgXykgdHJ5IHtcbiAgICAgICAgICBpZiAoZiA9IDEsIHkgJiYgKHQgPSBvcFswXSAmIDIgPyB5W1wicmV0dXJuXCJdIDogb3BbMF0gPyB5W1widGhyb3dcIl0gfHwgKCh0ID0geVtcInJldHVyblwiXSkgJiYgdC5jYWxsKHkpLCAwKSA6IHkubmV4dCkgJiYgISh0ID0gdC5jYWxsKHksIG9wWzFdKSkuZG9uZSkgcmV0dXJuIHQ7XG4gICAgICAgICAgaWYgKHkgPSAwLCB0KSBvcCA9IFtvcFswXSAmIDIsIHQudmFsdWVdO1xuICAgICAgICAgIHN3aXRjaCAob3BbMF0pIHtcbiAgICAgICAgICAgICAgY2FzZSAwOiBjYXNlIDE6IHQgPSBvcDsgYnJlYWs7XG4gICAgICAgICAgICAgIGNhc2UgNDogXy5sYWJlbCsrOyByZXR1cm4geyB2YWx1ZTogb3BbMV0sIGRvbmU6IGZhbHNlIH07XG4gICAgICAgICAgICAgIGNhc2UgNTogXy5sYWJlbCsrOyB5ID0gb3BbMV07IG9wID0gWzBdOyBjb250aW51ZTtcbiAgICAgICAgICAgICAgY2FzZSA3OiBvcCA9IF8ub3BzLnBvcCgpOyBfLnRyeXMucG9wKCk7IGNvbnRpbnVlO1xuICAgICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgICAgaWYgKCEodCA9IF8udHJ5cywgdCA9IHQubGVuZ3RoID4gMCAmJiB0W3QubGVuZ3RoIC0gMV0pICYmIChvcFswXSA9PT0gNiB8fCBvcFswXSA9PT0gMikpIHsgXyA9IDA7IGNvbnRpbnVlOyB9XG4gICAgICAgICAgICAgICAgICBpZiAob3BbMF0gPT09IDMgJiYgKCF0IHx8IChvcFsxXSA+IHRbMF0gJiYgb3BbMV0gPCB0WzNdKSkpIHsgXy5sYWJlbCA9IG9wWzFdOyBicmVhazsgfVxuICAgICAgICAgICAgICAgICAgaWYgKG9wWzBdID09PSA2ICYmIF8ubGFiZWwgPCB0WzFdKSB7IF8ubGFiZWwgPSB0WzFdOyB0ID0gb3A7IGJyZWFrOyB9XG4gICAgICAgICAgICAgICAgICBpZiAodCAmJiBfLmxhYmVsIDwgdFsyXSkgeyBfLmxhYmVsID0gdFsyXTsgXy5vcHMucHVzaChvcCk7IGJyZWFrOyB9XG4gICAgICAgICAgICAgICAgICBpZiAodFsyXSkgXy5vcHMucG9wKCk7XG4gICAgICAgICAgICAgICAgICBfLnRyeXMucG9wKCk7IGNvbnRpbnVlO1xuICAgICAgICAgIH1cbiAgICAgICAgICBvcCA9IGJvZHkuY2FsbCh0aGlzQXJnLCBfKTtcbiAgICAgIH0gY2F0Y2ggKGUpIHsgb3AgPSBbNiwgZV07IHkgPSAwOyB9IGZpbmFsbHkgeyBmID0gdCA9IDA7IH1cbiAgICAgIGlmIChvcFswXSAmIDUpIHRocm93IG9wWzFdOyByZXR1cm4geyB2YWx1ZTogb3BbMF0gPyBvcFsxXSA6IHZvaWQgMCwgZG9uZTogdHJ1ZSB9O1xuICB9XG59XG5cbmV4cG9ydCB2YXIgX19jcmVhdGVCaW5kaW5nID0gT2JqZWN0LmNyZWF0ZSA/IChmdW5jdGlvbihvLCBtLCBrLCBrMikge1xuICBpZiAoazIgPT09IHVuZGVmaW5lZCkgazIgPSBrO1xuICB2YXIgZGVzYyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IobSwgayk7XG4gIGlmICghZGVzYyB8fCAoXCJnZXRcIiBpbiBkZXNjID8gIW0uX19lc01vZHVsZSA6IGRlc2Mud3JpdGFibGUgfHwgZGVzYy5jb25maWd1cmFibGUpKSB7XG4gICAgICBkZXNjID0geyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGZ1bmN0aW9uKCkgeyByZXR1cm4gbVtrXTsgfSB9O1xuICB9XG4gIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvLCBrMiwgZGVzYyk7XG59KSA6IChmdW5jdGlvbihvLCBtLCBrLCBrMikge1xuICBpZiAoazIgPT09IHVuZGVmaW5lZCkgazIgPSBrO1xuICBvW2syXSA9IG1ba107XG59KTtcblxuZXhwb3J0IGZ1bmN0aW9uIF9fZXhwb3J0U3RhcihtLCBvKSB7XG4gIGZvciAodmFyIHAgaW4gbSkgaWYgKHAgIT09IFwiZGVmYXVsdFwiICYmICFPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwobywgcCkpIF9fY3JlYXRlQmluZGluZyhvLCBtLCBwKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIF9fdmFsdWVzKG8pIHtcbiAgdmFyIHMgPSB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgU3ltYm9sLml0ZXJhdG9yLCBtID0gcyAmJiBvW3NdLCBpID0gMDtcbiAgaWYgKG0pIHJldHVybiBtLmNhbGwobyk7XG4gIGlmIChvICYmIHR5cGVvZiBvLmxlbmd0aCA9PT0gXCJudW1iZXJcIikgcmV0dXJuIHtcbiAgICAgIG5leHQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBpZiAobyAmJiBpID49IG8ubGVuZ3RoKSBvID0gdm9pZCAwO1xuICAgICAgICAgIHJldHVybiB7IHZhbHVlOiBvICYmIG9baSsrXSwgZG9uZTogIW8gfTtcbiAgICAgIH1cbiAgfTtcbiAgdGhyb3cgbmV3IFR5cGVFcnJvcihzID8gXCJPYmplY3QgaXMgbm90IGl0ZXJhYmxlLlwiIDogXCJTeW1ib2wuaXRlcmF0b3IgaXMgbm90IGRlZmluZWQuXCIpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gX19yZWFkKG8sIG4pIHtcbiAgdmFyIG0gPSB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgb1tTeW1ib2wuaXRlcmF0b3JdO1xuICBpZiAoIW0pIHJldHVybiBvO1xuICB2YXIgaSA9IG0uY2FsbChvKSwgciwgYXIgPSBbXSwgZTtcbiAgdHJ5IHtcbiAgICAgIHdoaWxlICgobiA9PT0gdm9pZCAwIHx8IG4tLSA+IDApICYmICEociA9IGkubmV4dCgpKS5kb25lKSBhci5wdXNoKHIudmFsdWUpO1xuICB9XG4gIGNhdGNoIChlcnJvcikgeyBlID0geyBlcnJvcjogZXJyb3IgfTsgfVxuICBmaW5hbGx5IHtcbiAgICAgIHRyeSB7XG4gICAgICAgICAgaWYgKHIgJiYgIXIuZG9uZSAmJiAobSA9IGlbXCJyZXR1cm5cIl0pKSBtLmNhbGwoaSk7XG4gICAgICB9XG4gICAgICBmaW5hbGx5IHsgaWYgKGUpIHRocm93IGUuZXJyb3I7IH1cbiAgfVxuICByZXR1cm4gYXI7XG59XG5cbi8qKiBAZGVwcmVjYXRlZCAqL1xuZXhwb3J0IGZ1bmN0aW9uIF9fc3ByZWFkKCkge1xuICBmb3IgKHZhciBhciA9IFtdLCBpID0gMDsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKylcbiAgICAgIGFyID0gYXIuY29uY2F0KF9fcmVhZChhcmd1bWVudHNbaV0pKTtcbiAgcmV0dXJuIGFyO1xufVxuXG4vKiogQGRlcHJlY2F0ZWQgKi9cbmV4cG9ydCBmdW5jdGlvbiBfX3NwcmVhZEFycmF5cygpIHtcbiAgZm9yICh2YXIgcyA9IDAsIGkgPSAwLCBpbCA9IGFyZ3VtZW50cy5sZW5ndGg7IGkgPCBpbDsgaSsrKSBzICs9IGFyZ3VtZW50c1tpXS5sZW5ndGg7XG4gIGZvciAodmFyIHIgPSBBcnJheShzKSwgayA9IDAsIGkgPSAwOyBpIDwgaWw7IGkrKylcbiAgICAgIGZvciAodmFyIGEgPSBhcmd1bWVudHNbaV0sIGogPSAwLCBqbCA9IGEubGVuZ3RoOyBqIDwgamw7IGorKywgaysrKVxuICAgICAgICAgIHJba10gPSBhW2pdO1xuICByZXR1cm4gcjtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIF9fc3ByZWFkQXJyYXkodG8sIGZyb20sIHBhY2spIHtcbiAgaWYgKHBhY2sgfHwgYXJndW1lbnRzLmxlbmd0aCA9PT0gMikgZm9yICh2YXIgaSA9IDAsIGwgPSBmcm9tLmxlbmd0aCwgYXI7IGkgPCBsOyBpKyspIHtcbiAgICAgIGlmIChhciB8fCAhKGkgaW4gZnJvbSkpIHtcbiAgICAgICAgICBpZiAoIWFyKSBhciA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGZyb20sIDAsIGkpO1xuICAgICAgICAgIGFyW2ldID0gZnJvbVtpXTtcbiAgICAgIH1cbiAgfVxuICByZXR1cm4gdG8uY29uY2F0KGFyIHx8IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGZyb20pKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIF9fYXdhaXQodikge1xuICByZXR1cm4gdGhpcyBpbnN0YW5jZW9mIF9fYXdhaXQgPyAodGhpcy52ID0gdiwgdGhpcykgOiBuZXcgX19hd2FpdCh2KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIF9fYXN5bmNHZW5lcmF0b3IodGhpc0FyZywgX2FyZ3VtZW50cywgZ2VuZXJhdG9yKSB7XG4gIGlmICghU3ltYm9sLmFzeW5jSXRlcmF0b3IpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJTeW1ib2wuYXN5bmNJdGVyYXRvciBpcyBub3QgZGVmaW5lZC5cIik7XG4gIHZhciBnID0gZ2VuZXJhdG9yLmFwcGx5KHRoaXNBcmcsIF9hcmd1bWVudHMgfHwgW10pLCBpLCBxID0gW107XG4gIHJldHVybiBpID0gT2JqZWN0LmNyZWF0ZSgodHlwZW9mIEFzeW5jSXRlcmF0b3IgPT09IFwiZnVuY3Rpb25cIiA/IEFzeW5jSXRlcmF0b3IgOiBPYmplY3QpLnByb3RvdHlwZSksIHZlcmIoXCJuZXh0XCIpLCB2ZXJiKFwidGhyb3dcIiksIHZlcmIoXCJyZXR1cm5cIiwgYXdhaXRSZXR1cm4pLCBpW1N5bWJvbC5hc3luY0l0ZXJhdG9yXSA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHRoaXM7IH0sIGk7XG4gIGZ1bmN0aW9uIGF3YWl0UmV0dXJuKGYpIHsgcmV0dXJuIGZ1bmN0aW9uICh2KSB7IHJldHVybiBQcm9taXNlLnJlc29sdmUodikudGhlbihmLCByZWplY3QpOyB9OyB9XG4gIGZ1bmN0aW9uIHZlcmIobiwgZikgeyBpZiAoZ1tuXSkgeyBpW25dID0gZnVuY3Rpb24gKHYpIHsgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uIChhLCBiKSB7IHEucHVzaChbbiwgdiwgYSwgYl0pID4gMSB8fCByZXN1bWUobiwgdik7IH0pOyB9OyBpZiAoZikgaVtuXSA9IGYoaVtuXSk7IH0gfVxuICBmdW5jdGlvbiByZXN1bWUobiwgdikgeyB0cnkgeyBzdGVwKGdbbl0odikpOyB9IGNhdGNoIChlKSB7IHNldHRsZShxWzBdWzNdLCBlKTsgfSB9XG4gIGZ1bmN0aW9uIHN0ZXAocikgeyByLnZhbHVlIGluc3RhbmNlb2YgX19hd2FpdCA/IFByb21pc2UucmVzb2x2ZShyLnZhbHVlLnYpLnRoZW4oZnVsZmlsbCwgcmVqZWN0KSA6IHNldHRsZShxWzBdWzJdLCByKTsgfVxuICBmdW5jdGlvbiBmdWxmaWxsKHZhbHVlKSB7IHJlc3VtZShcIm5leHRcIiwgdmFsdWUpOyB9XG4gIGZ1bmN0aW9uIHJlamVjdCh2YWx1ZSkgeyByZXN1bWUoXCJ0aHJvd1wiLCB2YWx1ZSk7IH1cbiAgZnVuY3Rpb24gc2V0dGxlKGYsIHYpIHsgaWYgKGYodiksIHEuc2hpZnQoKSwgcS5sZW5ndGgpIHJlc3VtZShxWzBdWzBdLCBxWzBdWzFdKTsgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gX19hc3luY0RlbGVnYXRvcihvKSB7XG4gIHZhciBpLCBwO1xuICByZXR1cm4gaSA9IHt9LCB2ZXJiKFwibmV4dFwiKSwgdmVyYihcInRocm93XCIsIGZ1bmN0aW9uIChlKSB7IHRocm93IGU7IH0pLCB2ZXJiKFwicmV0dXJuXCIpLCBpW1N5bWJvbC5pdGVyYXRvcl0gPSBmdW5jdGlvbiAoKSB7IHJldHVybiB0aGlzOyB9LCBpO1xuICBmdW5jdGlvbiB2ZXJiKG4sIGYpIHsgaVtuXSA9IG9bbl0gPyBmdW5jdGlvbiAodikgeyByZXR1cm4gKHAgPSAhcCkgPyB7IHZhbHVlOiBfX2F3YWl0KG9bbl0odikpLCBkb25lOiBmYWxzZSB9IDogZiA/IGYodikgOiB2OyB9IDogZjsgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gX19hc3luY1ZhbHVlcyhvKSB7XG4gIGlmICghU3ltYm9sLmFzeW5jSXRlcmF0b3IpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJTeW1ib2wuYXN5bmNJdGVyYXRvciBpcyBub3QgZGVmaW5lZC5cIik7XG4gIHZhciBtID0gb1tTeW1ib2wuYXN5bmNJdGVyYXRvcl0sIGk7XG4gIHJldHVybiBtID8gbS5jYWxsKG8pIDogKG8gPSB0eXBlb2YgX192YWx1ZXMgPT09IFwiZnVuY3Rpb25cIiA/IF9fdmFsdWVzKG8pIDogb1tTeW1ib2wuaXRlcmF0b3JdKCksIGkgPSB7fSwgdmVyYihcIm5leHRcIiksIHZlcmIoXCJ0aHJvd1wiKSwgdmVyYihcInJldHVyblwiKSwgaVtTeW1ib2wuYXN5bmNJdGVyYXRvcl0gPSBmdW5jdGlvbiAoKSB7IHJldHVybiB0aGlzOyB9LCBpKTtcbiAgZnVuY3Rpb24gdmVyYihuKSB7IGlbbl0gPSBvW25dICYmIGZ1bmN0aW9uICh2KSB7IHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7IHYgPSBvW25dKHYpLCBzZXR0bGUocmVzb2x2ZSwgcmVqZWN0LCB2LmRvbmUsIHYudmFsdWUpOyB9KTsgfTsgfVxuICBmdW5jdGlvbiBzZXR0bGUocmVzb2x2ZSwgcmVqZWN0LCBkLCB2KSB7IFByb21pc2UucmVzb2x2ZSh2KS50aGVuKGZ1bmN0aW9uKHYpIHsgcmVzb2x2ZSh7IHZhbHVlOiB2LCBkb25lOiBkIH0pOyB9LCByZWplY3QpOyB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBfX21ha2VUZW1wbGF0ZU9iamVjdChjb29rZWQsIHJhdykge1xuICBpZiAoT2JqZWN0LmRlZmluZVByb3BlcnR5KSB7IE9iamVjdC5kZWZpbmVQcm9wZXJ0eShjb29rZWQsIFwicmF3XCIsIHsgdmFsdWU6IHJhdyB9KTsgfSBlbHNlIHsgY29va2VkLnJhdyA9IHJhdzsgfVxuICByZXR1cm4gY29va2VkO1xufTtcblxudmFyIF9fc2V0TW9kdWxlRGVmYXVsdCA9IE9iamVjdC5jcmVhdGUgPyAoZnVuY3Rpb24obywgdikge1xuICBPYmplY3QuZGVmaW5lUHJvcGVydHkobywgXCJkZWZhdWx0XCIsIHsgZW51bWVyYWJsZTogdHJ1ZSwgdmFsdWU6IHYgfSk7XG59KSA6IGZ1bmN0aW9uKG8sIHYpIHtcbiAgb1tcImRlZmF1bHRcIl0gPSB2O1xufTtcblxuZXhwb3J0IGZ1bmN0aW9uIF9faW1wb3J0U3Rhcihtb2QpIHtcbiAgaWYgKG1vZCAmJiBtb2QuX19lc01vZHVsZSkgcmV0dXJuIG1vZDtcbiAgdmFyIHJlc3VsdCA9IHt9O1xuICBpZiAobW9kICE9IG51bGwpIGZvciAodmFyIGsgaW4gbW9kKSBpZiAoayAhPT0gXCJkZWZhdWx0XCIgJiYgT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG1vZCwgaykpIF9fY3JlYXRlQmluZGluZyhyZXN1bHQsIG1vZCwgayk7XG4gIF9fc2V0TW9kdWxlRGVmYXVsdChyZXN1bHQsIG1vZCk7XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBfX2ltcG9ydERlZmF1bHQobW9kKSB7XG4gIHJldHVybiAobW9kICYmIG1vZC5fX2VzTW9kdWxlKSA/IG1vZCA6IHsgZGVmYXVsdDogbW9kIH07XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBfX2NsYXNzUHJpdmF0ZUZpZWxkR2V0KHJlY2VpdmVyLCBzdGF0ZSwga2luZCwgZikge1xuICBpZiAoa2luZCA9PT0gXCJhXCIgJiYgIWYpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJQcml2YXRlIGFjY2Vzc29yIHdhcyBkZWZpbmVkIHdpdGhvdXQgYSBnZXR0ZXJcIik7XG4gIGlmICh0eXBlb2Ygc3RhdGUgPT09IFwiZnVuY3Rpb25cIiA/IHJlY2VpdmVyICE9PSBzdGF0ZSB8fCAhZiA6ICFzdGF0ZS5oYXMocmVjZWl2ZXIpKSB0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2Fubm90IHJlYWQgcHJpdmF0ZSBtZW1iZXIgZnJvbSBhbiBvYmplY3Qgd2hvc2UgY2xhc3MgZGlkIG5vdCBkZWNsYXJlIGl0XCIpO1xuICByZXR1cm4ga2luZCA9PT0gXCJtXCIgPyBmIDoga2luZCA9PT0gXCJhXCIgPyBmLmNhbGwocmVjZWl2ZXIpIDogZiA/IGYudmFsdWUgOiBzdGF0ZS5nZXQocmVjZWl2ZXIpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gX19jbGFzc1ByaXZhdGVGaWVsZFNldChyZWNlaXZlciwgc3RhdGUsIHZhbHVlLCBraW5kLCBmKSB7XG4gIGlmIChraW5kID09PSBcIm1cIikgdGhyb3cgbmV3IFR5cGVFcnJvcihcIlByaXZhdGUgbWV0aG9kIGlzIG5vdCB3cml0YWJsZVwiKTtcbiAgaWYgKGtpbmQgPT09IFwiYVwiICYmICFmKSB0aHJvdyBuZXcgVHlwZUVycm9yKFwiUHJpdmF0ZSBhY2Nlc3NvciB3YXMgZGVmaW5lZCB3aXRob3V0IGEgc2V0dGVyXCIpO1xuICBpZiAodHlwZW9mIHN0YXRlID09PSBcImZ1bmN0aW9uXCIgPyByZWNlaXZlciAhPT0gc3RhdGUgfHwgIWYgOiAhc3RhdGUuaGFzKHJlY2VpdmVyKSkgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNhbm5vdCB3cml0ZSBwcml2YXRlIG1lbWJlciB0byBhbiBvYmplY3Qgd2hvc2UgY2xhc3MgZGlkIG5vdCBkZWNsYXJlIGl0XCIpO1xuICByZXR1cm4gKGtpbmQgPT09IFwiYVwiID8gZi5jYWxsKHJlY2VpdmVyLCB2YWx1ZSkgOiBmID8gZi52YWx1ZSA9IHZhbHVlIDogc3RhdGUuc2V0KHJlY2VpdmVyLCB2YWx1ZSkpLCB2YWx1ZTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIF9fY2xhc3NQcml2YXRlRmllbGRJbihzdGF0ZSwgcmVjZWl2ZXIpIHtcbiAgaWYgKHJlY2VpdmVyID09PSBudWxsIHx8ICh0eXBlb2YgcmVjZWl2ZXIgIT09IFwib2JqZWN0XCIgJiYgdHlwZW9mIHJlY2VpdmVyICE9PSBcImZ1bmN0aW9uXCIpKSB0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2Fubm90IHVzZSAnaW4nIG9wZXJhdG9yIG9uIG5vbi1vYmplY3RcIik7XG4gIHJldHVybiB0eXBlb2Ygc3RhdGUgPT09IFwiZnVuY3Rpb25cIiA/IHJlY2VpdmVyID09PSBzdGF0ZSA6IHN0YXRlLmhhcyhyZWNlaXZlcik7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBfX2FkZERpc3Bvc2FibGVSZXNvdXJjZShlbnYsIHZhbHVlLCBhc3luYykge1xuICBpZiAodmFsdWUgIT09IG51bGwgJiYgdmFsdWUgIT09IHZvaWQgMCkge1xuICAgIGlmICh0eXBlb2YgdmFsdWUgIT09IFwib2JqZWN0XCIgJiYgdHlwZW9mIHZhbHVlICE9PSBcImZ1bmN0aW9uXCIpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJPYmplY3QgZXhwZWN0ZWQuXCIpO1xuICAgIHZhciBkaXNwb3NlLCBpbm5lcjtcbiAgICBpZiAoYXN5bmMpIHtcbiAgICAgIGlmICghU3ltYm9sLmFzeW5jRGlzcG9zZSkgdGhyb3cgbmV3IFR5cGVFcnJvcihcIlN5bWJvbC5hc3luY0Rpc3Bvc2UgaXMgbm90IGRlZmluZWQuXCIpO1xuICAgICAgZGlzcG9zZSA9IHZhbHVlW1N5bWJvbC5hc3luY0Rpc3Bvc2VdO1xuICAgIH1cbiAgICBpZiAoZGlzcG9zZSA9PT0gdm9pZCAwKSB7XG4gICAgICBpZiAoIVN5bWJvbC5kaXNwb3NlKSB0aHJvdyBuZXcgVHlwZUVycm9yKFwiU3ltYm9sLmRpc3Bvc2UgaXMgbm90IGRlZmluZWQuXCIpO1xuICAgICAgZGlzcG9zZSA9IHZhbHVlW1N5bWJvbC5kaXNwb3NlXTtcbiAgICAgIGlmIChhc3luYykgaW5uZXIgPSBkaXNwb3NlO1xuICAgIH1cbiAgICBpZiAodHlwZW9mIGRpc3Bvc2UgIT09IFwiZnVuY3Rpb25cIikgdGhyb3cgbmV3IFR5cGVFcnJvcihcIk9iamVjdCBub3QgZGlzcG9zYWJsZS5cIik7XG4gICAgaWYgKGlubmVyKSBkaXNwb3NlID0gZnVuY3Rpb24oKSB7IHRyeSB7IGlubmVyLmNhbGwodGhpcyk7IH0gY2F0Y2ggKGUpIHsgcmV0dXJuIFByb21pc2UucmVqZWN0KGUpOyB9IH07XG4gICAgZW52LnN0YWNrLnB1c2goeyB2YWx1ZTogdmFsdWUsIGRpc3Bvc2U6IGRpc3Bvc2UsIGFzeW5jOiBhc3luYyB9KTtcbiAgfVxuICBlbHNlIGlmIChhc3luYykge1xuICAgIGVudi5zdGFjay5wdXNoKHsgYXN5bmM6IHRydWUgfSk7XG4gIH1cbiAgcmV0dXJuIHZhbHVlO1xufVxuXG52YXIgX1N1cHByZXNzZWRFcnJvciA9IHR5cGVvZiBTdXBwcmVzc2VkRXJyb3IgPT09IFwiZnVuY3Rpb25cIiA/IFN1cHByZXNzZWRFcnJvciA6IGZ1bmN0aW9uIChlcnJvciwgc3VwcHJlc3NlZCwgbWVzc2FnZSkge1xuICB2YXIgZSA9IG5ldyBFcnJvcihtZXNzYWdlKTtcbiAgcmV0dXJuIGUubmFtZSA9IFwiU3VwcHJlc3NlZEVycm9yXCIsIGUuZXJyb3IgPSBlcnJvciwgZS5zdXBwcmVzc2VkID0gc3VwcHJlc3NlZCwgZTtcbn07XG5cbmV4cG9ydCBmdW5jdGlvbiBfX2Rpc3Bvc2VSZXNvdXJjZXMoZW52KSB7XG4gIGZ1bmN0aW9uIGZhaWwoZSkge1xuICAgIGVudi5lcnJvciA9IGVudi5oYXNFcnJvciA/IG5ldyBfU3VwcHJlc3NlZEVycm9yKGUsIGVudi5lcnJvciwgXCJBbiBlcnJvciB3YXMgc3VwcHJlc3NlZCBkdXJpbmcgZGlzcG9zYWwuXCIpIDogZTtcbiAgICBlbnYuaGFzRXJyb3IgPSB0cnVlO1xuICB9XG4gIHZhciByLCBzID0gMDtcbiAgZnVuY3Rpb24gbmV4dCgpIHtcbiAgICB3aGlsZSAociA9IGVudi5zdGFjay5wb3AoKSkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgaWYgKCFyLmFzeW5jICYmIHMgPT09IDEpIHJldHVybiBzID0gMCwgZW52LnN0YWNrLnB1c2gociksIFByb21pc2UucmVzb2x2ZSgpLnRoZW4obmV4dCk7XG4gICAgICAgIGlmIChyLmRpc3Bvc2UpIHtcbiAgICAgICAgICB2YXIgcmVzdWx0ID0gci5kaXNwb3NlLmNhbGwoci52YWx1ZSk7XG4gICAgICAgICAgaWYgKHIuYXN5bmMpIHJldHVybiBzIHw9IDIsIFByb21pc2UucmVzb2x2ZShyZXN1bHQpLnRoZW4obmV4dCwgZnVuY3Rpb24oZSkgeyBmYWlsKGUpOyByZXR1cm4gbmV4dCgpOyB9KTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHMgfD0gMTtcbiAgICAgIH1cbiAgICAgIGNhdGNoIChlKSB7XG4gICAgICAgIGZhaWwoZSk7XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChzID09PSAxKSByZXR1cm4gZW52Lmhhc0Vycm9yID8gUHJvbWlzZS5yZWplY3QoZW52LmVycm9yKSA6IFByb21pc2UucmVzb2x2ZSgpO1xuICAgIGlmIChlbnYuaGFzRXJyb3IpIHRocm93IGVudi5lcnJvcjtcbiAgfVxuICByZXR1cm4gbmV4dCgpO1xufVxuXG5leHBvcnQgZGVmYXVsdCB7XG4gIF9fZXh0ZW5kcyxcbiAgX19hc3NpZ24sXG4gIF9fcmVzdCxcbiAgX19kZWNvcmF0ZSxcbiAgX19wYXJhbSxcbiAgX19tZXRhZGF0YSxcbiAgX19hd2FpdGVyLFxuICBfX2dlbmVyYXRvcixcbiAgX19jcmVhdGVCaW5kaW5nLFxuICBfX2V4cG9ydFN0YXIsXG4gIF9fdmFsdWVzLFxuICBfX3JlYWQsXG4gIF9fc3ByZWFkLFxuICBfX3NwcmVhZEFycmF5cyxcbiAgX19zcHJlYWRBcnJheSxcbiAgX19hd2FpdCxcbiAgX19hc3luY0dlbmVyYXRvcixcbiAgX19hc3luY0RlbGVnYXRvcixcbiAgX19hc3luY1ZhbHVlcyxcbiAgX19tYWtlVGVtcGxhdGVPYmplY3QsXG4gIF9faW1wb3J0U3RhcixcbiAgX19pbXBvcnREZWZhdWx0LFxuICBfX2NsYXNzUHJpdmF0ZUZpZWxkR2V0LFxuICBfX2NsYXNzUHJpdmF0ZUZpZWxkU2V0LFxuICBfX2NsYXNzUHJpdmF0ZUZpZWxkSW4sXG4gIF9fYWRkRGlzcG9zYWJsZVJlc291cmNlLFxuICBfX2Rpc3Bvc2VSZXNvdXJjZXMsXG59O1xuIiwiaW1wb3J0IHsgX2dldFByb3ZpZGVyLCBnZXRBcHAsIF9yZWdpc3RlckNvbXBvbmVudCwgcmVnaXN0ZXJWZXJzaW9uIH0gZnJvbSAnQGZpcmViYXNlL2FwcCc7XG5pbXBvcnQgeyBDb21wb25lbnQgfSBmcm9tICdAZmlyZWJhc2UvY29tcG9uZW50JztcbmltcG9ydCB7IEZpcmViYXNlRXJyb3IsIGdldE1vZHVsYXJJbnN0YW5jZSB9IGZyb20gJ0BmaXJlYmFzZS91dGlsJztcbmltcG9ydCB7IF9fYXN5bmNHZW5lcmF0b3IsIF9fYXdhaXQgfSBmcm9tICd0c2xpYic7XG5cbnZhciBuYW1lID0gXCJAZmlyZWJhc2UvdmVydGV4YWktcHJldmlld1wiO1xudmFyIHZlcnNpb24gPSBcIjAuMC4zXCI7XG5cbi8qKlxyXG4gKiBAbGljZW5zZVxyXG4gKiBDb3B5cmlnaHQgMjAyNCBHb29nbGUgTExDXHJcbiAqXHJcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XHJcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cclxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XHJcbiAqXHJcbiAqICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXHJcbiAqXHJcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcclxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxyXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cclxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxyXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cclxuICovXHJcbmNvbnN0IFZFUlRFWF9UWVBFID0gJ3ZlcnRleEFJJztcclxuY29uc3QgREVGQVVMVF9MT0NBVElPTiA9ICd1cy1jZW50cmFsMSc7XHJcbmNvbnN0IERFRkFVTFRfQkFTRV9VUkwgPSAnaHR0cHM6Ly9maXJlYmFzZW1sLmdvb2dsZWFwaXMuY29tJztcclxuY29uc3QgREVGQVVMVF9BUElfVkVSU0lPTiA9ICd2MmJldGEnO1xyXG5jb25zdCBQQUNLQUdFX1ZFUlNJT04gPSB2ZXJzaW9uO1xyXG5jb25zdCBMQU5HVUFHRV9UQUcgPSAnZ2wtanMnO1xuXG4vKipcclxuICogQGxpY2Vuc2VcclxuICogQ29weXJpZ2h0IDIwMjQgR29vZ2xlIExMQ1xyXG4gKlxyXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xyXG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXHJcbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxyXG4gKlxyXG4gKiAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxyXG4gKlxyXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXHJcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcclxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXHJcbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcclxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXHJcbiAqL1xyXG5jbGFzcyBWZXJ0ZXhBSVNlcnZpY2Uge1xyXG4gICAgY29uc3RydWN0b3IoYXBwLCBhdXRoUHJvdmlkZXIsIGFwcENoZWNrUHJvdmlkZXIsIG9wdGlvbnMpIHtcclxuICAgICAgICB2YXIgX2E7XHJcbiAgICAgICAgdGhpcy5hcHAgPSBhcHA7XHJcbiAgICAgICAgdGhpcy5vcHRpb25zID0gb3B0aW9ucztcclxuICAgICAgICBjb25zdCBhcHBDaGVjayA9IGFwcENoZWNrUHJvdmlkZXIgPT09IG51bGwgfHwgYXBwQ2hlY2tQcm92aWRlciA9PT0gdm9pZCAwID8gdm9pZCAwIDogYXBwQ2hlY2tQcm92aWRlci5nZXRJbW1lZGlhdGUoeyBvcHRpb25hbDogdHJ1ZSB9KTtcclxuICAgICAgICBjb25zdCBhdXRoID0gYXV0aFByb3ZpZGVyID09PSBudWxsIHx8IGF1dGhQcm92aWRlciA9PT0gdm9pZCAwID8gdm9pZCAwIDogYXV0aFByb3ZpZGVyLmdldEltbWVkaWF0ZSh7IG9wdGlvbmFsOiB0cnVlIH0pO1xyXG4gICAgICAgIHRoaXMuYXV0aCA9IGF1dGggfHwgbnVsbDtcclxuICAgICAgICB0aGlzLmFwcENoZWNrID0gYXBwQ2hlY2sgfHwgbnVsbDtcclxuICAgICAgICB0aGlzLmxvY2F0aW9uID0gKChfYSA9IHRoaXMub3B0aW9ucykgPT09IG51bGwgfHwgX2EgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9hLmxvY2F0aW9uKSB8fCBERUZBVUxUX0xPQ0FUSU9OO1xyXG4gICAgfVxyXG4gICAgX2RlbGV0ZSgpIHtcclxuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCk7XHJcbiAgICB9XHJcbn1cblxuLyoqXHJcbiAqIEBsaWNlbnNlXHJcbiAqIENvcHlyaWdodCAyMDI0IEdvb2dsZSBMTENcclxuICpcclxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcclxuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxyXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcclxuICpcclxuICogICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcclxuICpcclxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxyXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXHJcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxyXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXHJcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxyXG4gKi9cclxuLyoqXHJcbiAqIEVycm9yIGNsYXNzIGZvciB0aGUgVmVydGV4IEFJIGZvciBGaXJlYmFzZSBTREsuXHJcbiAqXHJcbiAqIEBwdWJsaWNcclxuICovXHJcbmNsYXNzIFZlcnRleEFJRXJyb3IgZXh0ZW5kcyBGaXJlYmFzZUVycm9yIHtcclxuICAgIC8qKlxyXG4gICAgICogQ29uc3RydWN0cyBhIG5ldyBpbnN0YW5jZSBvZiB0aGUgYFZlcnRleEFJRXJyb3JgIGNsYXNzLlxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSBjb2RlIC0gVGhlIGVycm9yIGNvZGUgZnJvbSB7QGxpbmsgVmVydGV4QUlFcnJvckNvZGV9LlxyXG4gICAgICogQHBhcmFtIG1lc3NhZ2UgLSBBIGh1bWFuLXJlYWRhYmxlIG1lc3NhZ2UgZGVzY3JpYmluZyB0aGUgZXJyb3IuXHJcbiAgICAgKiBAcGFyYW0gY3VzdG9tRXJyb3JEYXRhIC0gT3B0aW9uYWwgZXJyb3IgZGF0YS5cclxuICAgICAqL1xyXG4gICAgY29uc3RydWN0b3IoY29kZSwgbWVzc2FnZSwgY3VzdG9tRXJyb3JEYXRhKSB7XHJcbiAgICAgICAgLy8gTWF0Y2ggZXJyb3IgZm9ybWF0IHVzZWQgYnkgRmlyZWJhc2VFcnJvciBmcm9tIEVycm9yRmFjdG9yeVxyXG4gICAgICAgIGNvbnN0IHNlcnZpY2UgPSBWRVJURVhfVFlQRTtcclxuICAgICAgICBjb25zdCBzZXJ2aWNlTmFtZSA9ICdWZXJ0ZXhBSSc7XHJcbiAgICAgICAgY29uc3QgZnVsbENvZGUgPSBgJHtzZXJ2aWNlfS8ke2NvZGV9YDtcclxuICAgICAgICBjb25zdCBmdWxsTWVzc2FnZSA9IGAke3NlcnZpY2VOYW1lfTogJHttZXNzYWdlfSAoJHtmdWxsQ29kZX0pLmA7XHJcbiAgICAgICAgc3VwZXIoZnVsbENvZGUsIGZ1bGxNZXNzYWdlKTtcclxuICAgICAgICB0aGlzLmNvZGUgPSBjb2RlO1xyXG4gICAgICAgIHRoaXMubWVzc2FnZSA9IG1lc3NhZ2U7XHJcbiAgICAgICAgdGhpcy5jdXN0b21FcnJvckRhdGEgPSBjdXN0b21FcnJvckRhdGE7XHJcbiAgICAgICAgLy8gRmlyZWJhc2VFcnJvciBpbml0aWFsaXplcyBhIHN0YWNrIHRyYWNlLCBidXQgaXQgYXNzdW1lcyB0aGUgZXJyb3IgaXMgY3JlYXRlZCBmcm9tIHRoZSBlcnJvclxyXG4gICAgICAgIC8vIGZhY3RvcnkuIFNpbmNlIHdlIGJyZWFrIHRoaXMgYXNzdW1wdGlvbiwgd2Ugc2V0IHRoZSBzdGFjayB0cmFjZSB0byBiZSBvcmlnaW5hdGluZyBmcm9tIHRoaXNcclxuICAgICAgICAvLyBjb25zdHJ1Y3Rvci5cclxuICAgICAgICAvLyBUaGlzIGlzIG9ubHkgc3VwcG9ydGVkIGluIFY4LlxyXG4gICAgICAgIGlmIChFcnJvci5jYXB0dXJlU3RhY2tUcmFjZSkge1xyXG4gICAgICAgICAgICAvLyBBbGxvd3MgdXMgdG8gaW5pdGlhbGl6ZSB0aGUgc3RhY2sgdHJhY2Ugd2l0aG91dCBpbmNsdWRpbmcgdGhlIGNvbnN0cnVjdG9yIGl0c2VsZiBhdCB0aGVcclxuICAgICAgICAgICAgLy8gdG9wIGxldmVsIG9mIHRoZSBzdGFjayB0cmFjZS5cclxuICAgICAgICAgICAgRXJyb3IuY2FwdHVyZVN0YWNrVHJhY2UodGhpcywgVmVydGV4QUlFcnJvcik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIEFsbG93cyBpbnN0YW5jZW9mIFZlcnRleEFJRXJyb3IgaW4gRVM1L0VTNlxyXG4gICAgICAgIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9NaWNyb3NvZnQvVHlwZVNjcmlwdC13aWtpL2Jsb2IvbWFzdGVyL0JyZWFraW5nLUNoYW5nZXMubWQjZXh0ZW5kaW5nLWJ1aWx0LWlucy1saWtlLWVycm9yLWFycmF5LWFuZC1tYXAtbWF5LW5vLWxvbmdlci13b3JrXHJcbiAgICAgICAgT2JqZWN0LnNldFByb3RvdHlwZU9mKHRoaXMsIFZlcnRleEFJRXJyb3IucHJvdG90eXBlKTtcclxuICAgICAgICAvLyBTaW5jZSBFcnJvciBpcyBhbiBpbnRlcmZhY2UsIHdlIGRvbid0IGluaGVyaXQgdG9TdHJpbmcgYW5kIHNvIHdlIGRlZmluZSBpdCBvdXJzZWx2ZXMuXHJcbiAgICAgICAgdGhpcy50b1N0cmluZyA9ICgpID0+IGZ1bGxNZXNzYWdlO1xyXG4gICAgfVxyXG59XG5cbi8qKlxyXG4gKiBAbGljZW5zZVxyXG4gKiBDb3B5cmlnaHQgMjAyNCBHb29nbGUgTExDXHJcbiAqXHJcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XHJcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cclxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XHJcbiAqXHJcbiAqICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXHJcbiAqXHJcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcclxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxyXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cclxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxyXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cclxuICovXHJcbnZhciBUYXNrO1xyXG4oZnVuY3Rpb24gKFRhc2spIHtcclxuICAgIFRhc2tbXCJHRU5FUkFURV9DT05URU5UXCJdID0gXCJnZW5lcmF0ZUNvbnRlbnRcIjtcclxuICAgIFRhc2tbXCJTVFJFQU1fR0VORVJBVEVfQ09OVEVOVFwiXSA9IFwic3RyZWFtR2VuZXJhdGVDb250ZW50XCI7XHJcbiAgICBUYXNrW1wiQ09VTlRfVE9LRU5TXCJdID0gXCJjb3VudFRva2Vuc1wiO1xyXG59KShUYXNrIHx8IChUYXNrID0ge30pKTtcclxuY2xhc3MgUmVxdWVzdFVybCB7XHJcbiAgICBjb25zdHJ1Y3Rvcihtb2RlbCwgdGFzaywgYXBpU2V0dGluZ3MsIHN0cmVhbSwgcmVxdWVzdE9wdGlvbnMpIHtcclxuICAgICAgICB0aGlzLm1vZGVsID0gbW9kZWw7XHJcbiAgICAgICAgdGhpcy50YXNrID0gdGFzaztcclxuICAgICAgICB0aGlzLmFwaVNldHRpbmdzID0gYXBpU2V0dGluZ3M7XHJcbiAgICAgICAgdGhpcy5zdHJlYW0gPSBzdHJlYW07XHJcbiAgICAgICAgdGhpcy5yZXF1ZXN0T3B0aW9ucyA9IHJlcXVlc3RPcHRpb25zO1xyXG4gICAgfVxyXG4gICAgdG9TdHJpbmcoKSB7XHJcbiAgICAgICAgdmFyIF9hO1xyXG4gICAgICAgIC8vIFRPRE86IGFsbG93IHVzZXItc2V0IG9wdGlvbiBpZiB0aGF0IGZlYXR1cmUgYmVjb21lcyBhdmFpbGFibGVcclxuICAgICAgICBjb25zdCBhcGlWZXJzaW9uID0gREVGQVVMVF9BUElfVkVSU0lPTjtcclxuICAgICAgICBjb25zdCBiYXNlVXJsID0gKChfYSA9IHRoaXMucmVxdWVzdE9wdGlvbnMpID09PSBudWxsIHx8IF9hID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYS5iYXNlVXJsKSB8fCBERUZBVUxUX0JBU0VfVVJMO1xyXG4gICAgICAgIGxldCB1cmwgPSBgJHtiYXNlVXJsfS8ke2FwaVZlcnNpb259YDtcclxuICAgICAgICB1cmwgKz0gYC9wcm9qZWN0cy8ke3RoaXMuYXBpU2V0dGluZ3MucHJvamVjdH1gO1xyXG4gICAgICAgIHVybCArPSBgL2xvY2F0aW9ucy8ke3RoaXMuYXBpU2V0dGluZ3MubG9jYXRpb259YDtcclxuICAgICAgICB1cmwgKz0gYC8ke3RoaXMubW9kZWx9YDtcclxuICAgICAgICB1cmwgKz0gYDoke3RoaXMudGFza31gO1xyXG4gICAgICAgIGlmICh0aGlzLnN0cmVhbSkge1xyXG4gICAgICAgICAgICB1cmwgKz0gJz9hbHQ9c3NlJztcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHVybDtcclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICogSWYgdGhlIG1vZGVsIG5lZWRzIHRvIGJlIHBhc3NlZCB0byB0aGUgYmFja2VuZCwgaXQgbmVlZHMgdG9cclxuICAgICAqIGluY2x1ZGUgcHJvamVjdCBhbmQgbG9jYXRpb24gcGF0aC5cclxuICAgICAqL1xyXG4gICAgZ2V0IGZ1bGxNb2RlbFN0cmluZygpIHtcclxuICAgICAgICBsZXQgbW9kZWxTdHJpbmcgPSBgcHJvamVjdHMvJHt0aGlzLmFwaVNldHRpbmdzLnByb2plY3R9YDtcclxuICAgICAgICBtb2RlbFN0cmluZyArPSBgL2xvY2F0aW9ucy8ke3RoaXMuYXBpU2V0dGluZ3MubG9jYXRpb259YDtcclxuICAgICAgICBtb2RlbFN0cmluZyArPSBgLyR7dGhpcy5tb2RlbH1gO1xyXG4gICAgICAgIHJldHVybiBtb2RlbFN0cmluZztcclxuICAgIH1cclxufVxyXG4vKipcclxuICogTG9nIGxhbmd1YWdlIGFuZCBcImZpcmUvdmVyc2lvblwiIHRvIHgtZ29vZy1hcGktY2xpZW50XHJcbiAqL1xyXG5mdW5jdGlvbiBnZXRDbGllbnRIZWFkZXJzKCkge1xyXG4gICAgY29uc3QgbG9nZ2luZ1RhZ3MgPSBbXTtcclxuICAgIGxvZ2dpbmdUYWdzLnB1c2goYCR7TEFOR1VBR0VfVEFHfS8ke1BBQ0tBR0VfVkVSU0lPTn1gKTtcclxuICAgIGxvZ2dpbmdUYWdzLnB1c2goYGZpcmUvJHtQQUNLQUdFX1ZFUlNJT059YCk7XHJcbiAgICByZXR1cm4gbG9nZ2luZ1RhZ3Muam9pbignICcpO1xyXG59XHJcbmFzeW5jIGZ1bmN0aW9uIGdldEhlYWRlcnModXJsKSB7XHJcbiAgICBjb25zdCBoZWFkZXJzID0gbmV3IEhlYWRlcnMoKTtcclxuICAgIGhlYWRlcnMuYXBwZW5kKCdDb250ZW50LVR5cGUnLCAnYXBwbGljYXRpb24vanNvbicpO1xyXG4gICAgaGVhZGVycy5hcHBlbmQoJ3gtZ29vZy1hcGktY2xpZW50JywgZ2V0Q2xpZW50SGVhZGVycygpKTtcclxuICAgIGhlYWRlcnMuYXBwZW5kKCd4LWdvb2ctYXBpLWtleScsIHVybC5hcGlTZXR0aW5ncy5hcGlLZXkpO1xyXG4gICAgaWYgKHVybC5hcGlTZXR0aW5ncy5nZXRBcHBDaGVja1Rva2VuKSB7XHJcbiAgICAgICAgY29uc3QgYXBwQ2hlY2tUb2tlbiA9IGF3YWl0IHVybC5hcGlTZXR0aW5ncy5nZXRBcHBDaGVja1Rva2VuKCk7XHJcbiAgICAgICAgaWYgKGFwcENoZWNrVG9rZW4gJiYgIWFwcENoZWNrVG9rZW4uZXJyb3IpIHtcclxuICAgICAgICAgICAgaGVhZGVycy5hcHBlbmQoJ1gtRmlyZWJhc2UtQXBwQ2hlY2snLCBhcHBDaGVja1Rva2VuLnRva2VuKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBpZiAodXJsLmFwaVNldHRpbmdzLmdldEF1dGhUb2tlbikge1xyXG4gICAgICAgIGNvbnN0IGF1dGhUb2tlbiA9IGF3YWl0IHVybC5hcGlTZXR0aW5ncy5nZXRBdXRoVG9rZW4oKTtcclxuICAgICAgICBpZiAoYXV0aFRva2VuKSB7XHJcbiAgICAgICAgICAgIGhlYWRlcnMuYXBwZW5kKCdBdXRob3JpemF0aW9uJywgYEZpcmViYXNlICR7YXV0aFRva2VuLmFjY2Vzc1Rva2VufWApO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiBoZWFkZXJzO1xyXG59XHJcbmFzeW5jIGZ1bmN0aW9uIGNvbnN0cnVjdFJlcXVlc3QobW9kZWwsIHRhc2ssIGFwaVNldHRpbmdzLCBzdHJlYW0sIGJvZHksIHJlcXVlc3RPcHRpb25zKSB7XHJcbiAgICBjb25zdCB1cmwgPSBuZXcgUmVxdWVzdFVybChtb2RlbCwgdGFzaywgYXBpU2V0dGluZ3MsIHN0cmVhbSwgcmVxdWVzdE9wdGlvbnMpO1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICB1cmw6IHVybC50b1N0cmluZygpLFxyXG4gICAgICAgIGZldGNoT3B0aW9uczogT2JqZWN0LmFzc2lnbihPYmplY3QuYXNzaWduKHt9LCBidWlsZEZldGNoT3B0aW9ucyhyZXF1ZXN0T3B0aW9ucykpLCB7IG1ldGhvZDogJ1BPU1QnLCBoZWFkZXJzOiBhd2FpdCBnZXRIZWFkZXJzKHVybCksIGJvZHkgfSlcclxuICAgIH07XHJcbn1cclxuYXN5bmMgZnVuY3Rpb24gbWFrZVJlcXVlc3QobW9kZWwsIHRhc2ssIGFwaVNldHRpbmdzLCBzdHJlYW0sIGJvZHksIHJlcXVlc3RPcHRpb25zKSB7XHJcbiAgICBjb25zdCB1cmwgPSBuZXcgUmVxdWVzdFVybChtb2RlbCwgdGFzaywgYXBpU2V0dGluZ3MsIHN0cmVhbSwgcmVxdWVzdE9wdGlvbnMpO1xyXG4gICAgbGV0IHJlc3BvbnNlO1xyXG4gICAgdHJ5IHtcclxuICAgICAgICBjb25zdCByZXF1ZXN0ID0gYXdhaXQgY29uc3RydWN0UmVxdWVzdChtb2RlbCwgdGFzaywgYXBpU2V0dGluZ3MsIHN0cmVhbSwgYm9keSwgcmVxdWVzdE9wdGlvbnMpO1xyXG4gICAgICAgIHJlc3BvbnNlID0gYXdhaXQgZmV0Y2gocmVxdWVzdC51cmwsIHJlcXVlc3QuZmV0Y2hPcHRpb25zKTtcclxuICAgICAgICBpZiAoIXJlc3BvbnNlLm9rKSB7XHJcbiAgICAgICAgICAgIGxldCBtZXNzYWdlID0gJyc7XHJcbiAgICAgICAgICAgIGxldCBlcnJvckRldGFpbHM7XHJcbiAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBqc29uID0gYXdhaXQgcmVzcG9uc2UuanNvbigpO1xyXG4gICAgICAgICAgICAgICAgbWVzc2FnZSA9IGpzb24uZXJyb3IubWVzc2FnZTtcclxuICAgICAgICAgICAgICAgIGlmIChqc29uLmVycm9yLmRldGFpbHMpIHtcclxuICAgICAgICAgICAgICAgICAgICBtZXNzYWdlICs9IGAgJHtKU09OLnN0cmluZ2lmeShqc29uLmVycm9yLmRldGFpbHMpfWA7XHJcbiAgICAgICAgICAgICAgICAgICAgZXJyb3JEZXRhaWxzID0ganNvbi5lcnJvci5kZXRhaWxzO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGNhdGNoIChlKSB7XHJcbiAgICAgICAgICAgICAgICAvLyBpZ25vcmVkXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhyb3cgbmV3IFZlcnRleEFJRXJyb3IoXCJmZXRjaC1lcnJvclwiIC8qIFZlcnRleEFJRXJyb3JDb2RlLkZFVENIX0VSUk9SICovLCBgRXJyb3IgZmV0Y2hpbmcgZnJvbSAke3VybH06IFske3Jlc3BvbnNlLnN0YXR1c30gJHtyZXNwb25zZS5zdGF0dXNUZXh0fV0gJHttZXNzYWdlfWAsIHtcclxuICAgICAgICAgICAgICAgIHN0YXR1czogcmVzcG9uc2Uuc3RhdHVzLFxyXG4gICAgICAgICAgICAgICAgc3RhdHVzVGV4dDogcmVzcG9uc2Uuc3RhdHVzVGV4dCxcclxuICAgICAgICAgICAgICAgIGVycm9yRGV0YWlsc1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBjYXRjaCAoZSkge1xyXG4gICAgICAgIGxldCBlcnIgPSBlO1xyXG4gICAgICAgIGlmIChlLmNvZGUgIT09IFwiZmV0Y2gtZXJyb3JcIiAvKiBWZXJ0ZXhBSUVycm9yQ29kZS5GRVRDSF9FUlJPUiAqLyAmJlxyXG4gICAgICAgICAgICBlIGluc3RhbmNlb2YgRXJyb3IpIHtcclxuICAgICAgICAgICAgZXJyID0gbmV3IFZlcnRleEFJRXJyb3IoXCJlcnJvclwiIC8qIFZlcnRleEFJRXJyb3JDb2RlLkVSUk9SICovLCBgRXJyb3IgZmV0Y2hpbmcgZnJvbSAke3VybC50b1N0cmluZygpfTogJHtlLm1lc3NhZ2V9YCk7XHJcbiAgICAgICAgICAgIGVyci5zdGFjayA9IGUuc3RhY2s7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRocm93IGVycjtcclxuICAgIH1cclxuICAgIHJldHVybiByZXNwb25zZTtcclxufVxyXG4vKipcclxuICogR2VuZXJhdGVzIHRoZSByZXF1ZXN0IG9wdGlvbnMgdG8gYmUgcGFzc2VkIHRvIHRoZSBmZXRjaCBBUEkuXHJcbiAqIEBwYXJhbSByZXF1ZXN0T3B0aW9ucyAtIFRoZSB1c2VyLWRlZmluZWQgcmVxdWVzdCBvcHRpb25zLlxyXG4gKiBAcmV0dXJucyBUaGUgZ2VuZXJhdGVkIHJlcXVlc3Qgb3B0aW9ucy5cclxuICovXHJcbmZ1bmN0aW9uIGJ1aWxkRmV0Y2hPcHRpb25zKHJlcXVlc3RPcHRpb25zKSB7XHJcbiAgICBjb25zdCBmZXRjaE9wdGlvbnMgPSB7fTtcclxuICAgIGlmICgocmVxdWVzdE9wdGlvbnMgPT09IG51bGwgfHwgcmVxdWVzdE9wdGlvbnMgPT09IHZvaWQgMCA/IHZvaWQgMCA6IHJlcXVlc3RPcHRpb25zLnRpbWVvdXQpICYmIChyZXF1ZXN0T3B0aW9ucyA9PT0gbnVsbCB8fCByZXF1ZXN0T3B0aW9ucyA9PT0gdm9pZCAwID8gdm9pZCAwIDogcmVxdWVzdE9wdGlvbnMudGltZW91dCkgPj0gMCkge1xyXG4gICAgICAgIGNvbnN0IGFib3J0Q29udHJvbGxlciA9IG5ldyBBYm9ydENvbnRyb2xsZXIoKTtcclxuICAgICAgICBjb25zdCBzaWduYWwgPSBhYm9ydENvbnRyb2xsZXIuc2lnbmFsO1xyXG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4gYWJvcnRDb250cm9sbGVyLmFib3J0KCksIHJlcXVlc3RPcHRpb25zLnRpbWVvdXQpO1xyXG4gICAgICAgIGZldGNoT3B0aW9ucy5zaWduYWwgPSBzaWduYWw7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gZmV0Y2hPcHRpb25zO1xyXG59XG5cbi8qKlxyXG4gKiBAbGljZW5zZVxyXG4gKiBDb3B5cmlnaHQgMjAyNCBHb29nbGUgTExDXHJcbiAqXHJcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XHJcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cclxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XHJcbiAqXHJcbiAqICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXHJcbiAqXHJcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcclxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxyXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cclxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxyXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cclxuICovXHJcbi8qKlxyXG4gKiBQb3NzaWJsZSByb2xlcy5cclxuICogQHB1YmxpY1xyXG4gKi9cclxuY29uc3QgUE9TU0lCTEVfUk9MRVMgPSBbJ3VzZXInLCAnbW9kZWwnLCAnZnVuY3Rpb24nLCAnc3lzdGVtJ107XHJcbi8qKlxyXG4gKiBIYXJtIGNhdGVnb3JpZXMgdGhhdCB3b3VsZCBjYXVzZSBwcm9tcHRzIG9yIGNhbmRpZGF0ZXMgdG8gYmUgYmxvY2tlZC5cclxuICogQHB1YmxpY1xyXG4gKi9cclxudmFyIEhhcm1DYXRlZ29yeTtcclxuKGZ1bmN0aW9uIChIYXJtQ2F0ZWdvcnkpIHtcclxuICAgIEhhcm1DYXRlZ29yeVtcIkhBUk1fQ0FURUdPUllfVU5TUEVDSUZJRURcIl0gPSBcIkhBUk1fQ0FURUdPUllfVU5TUEVDSUZJRURcIjtcclxuICAgIEhhcm1DYXRlZ29yeVtcIkhBUk1fQ0FURUdPUllfSEFURV9TUEVFQ0hcIl0gPSBcIkhBUk1fQ0FURUdPUllfSEFURV9TUEVFQ0hcIjtcclxuICAgIEhhcm1DYXRlZ29yeVtcIkhBUk1fQ0FURUdPUllfU0VYVUFMTFlfRVhQTElDSVRcIl0gPSBcIkhBUk1fQ0FURUdPUllfU0VYVUFMTFlfRVhQTElDSVRcIjtcclxuICAgIEhhcm1DYXRlZ29yeVtcIkhBUk1fQ0FURUdPUllfSEFSQVNTTUVOVFwiXSA9IFwiSEFSTV9DQVRFR09SWV9IQVJBU1NNRU5UXCI7XHJcbiAgICBIYXJtQ2F0ZWdvcnlbXCJIQVJNX0NBVEVHT1JZX0RBTkdFUk9VU19DT05URU5UXCJdID0gXCJIQVJNX0NBVEVHT1JZX0RBTkdFUk9VU19DT05URU5UXCI7XHJcbn0pKEhhcm1DYXRlZ29yeSB8fCAoSGFybUNhdGVnb3J5ID0ge30pKTtcclxuLyoqXHJcbiAqIFRocmVzaG9sZCBhYm92ZSB3aGljaCBhIHByb21wdCBvciBjYW5kaWRhdGUgd2lsbCBiZSBibG9ja2VkLlxyXG4gKiBAcHVibGljXHJcbiAqL1xyXG52YXIgSGFybUJsb2NrVGhyZXNob2xkO1xyXG4oZnVuY3Rpb24gKEhhcm1CbG9ja1RocmVzaG9sZCkge1xyXG4gICAgLy8gVGhyZXNob2xkIGlzIHVuc3BlY2lmaWVkLlxyXG4gICAgSGFybUJsb2NrVGhyZXNob2xkW1wiSEFSTV9CTE9DS19USFJFU0hPTERfVU5TUEVDSUZJRURcIl0gPSBcIkhBUk1fQkxPQ0tfVEhSRVNIT0xEX1VOU1BFQ0lGSUVEXCI7XHJcbiAgICAvLyBDb250ZW50IHdpdGggTkVHTElHSUJMRSB3aWxsIGJlIGFsbG93ZWQuXHJcbiAgICBIYXJtQmxvY2tUaHJlc2hvbGRbXCJCTE9DS19MT1dfQU5EX0FCT1ZFXCJdID0gXCJCTE9DS19MT1dfQU5EX0FCT1ZFXCI7XHJcbiAgICAvLyBDb250ZW50IHdpdGggTkVHTElHSUJMRSBhbmQgTE9XIHdpbGwgYmUgYWxsb3dlZC5cclxuICAgIEhhcm1CbG9ja1RocmVzaG9sZFtcIkJMT0NLX01FRElVTV9BTkRfQUJPVkVcIl0gPSBcIkJMT0NLX01FRElVTV9BTkRfQUJPVkVcIjtcclxuICAgIC8vIENvbnRlbnQgd2l0aCBORUdMSUdJQkxFLCBMT1csIGFuZCBNRURJVU0gd2lsbCBiZSBhbGxvd2VkLlxyXG4gICAgSGFybUJsb2NrVGhyZXNob2xkW1wiQkxPQ0tfT05MWV9ISUdIXCJdID0gXCJCTE9DS19PTkxZX0hJR0hcIjtcclxuICAgIC8vIEFsbCBjb250ZW50IHdpbGwgYmUgYWxsb3dlZC5cclxuICAgIEhhcm1CbG9ja1RocmVzaG9sZFtcIkJMT0NLX05PTkVcIl0gPSBcIkJMT0NLX05PTkVcIjtcclxufSkoSGFybUJsb2NrVGhyZXNob2xkIHx8IChIYXJtQmxvY2tUaHJlc2hvbGQgPSB7fSkpO1xyXG4vKipcclxuICogQHB1YmxpY1xyXG4gKi9cclxudmFyIEhhcm1CbG9ja01ldGhvZDtcclxuKGZ1bmN0aW9uIChIYXJtQmxvY2tNZXRob2QpIHtcclxuICAgIC8vIFRoZSBoYXJtIGJsb2NrIG1ldGhvZCBpcyB1bnNwZWNpZmllZC5cclxuICAgIEhhcm1CbG9ja01ldGhvZFtcIkhBUk1fQkxPQ0tfTUVUSE9EX1VOU1BFQ0lGSUVEXCJdID0gXCJIQVJNX0JMT0NLX01FVEhPRF9VTlNQRUNJRklFRFwiO1xyXG4gICAgLy8gVGhlIGhhcm0gYmxvY2sgbWV0aG9kIHVzZXMgYm90aCBwcm9iYWJpbGl0eSBhbmQgc2V2ZXJpdHkgc2NvcmVzLlxyXG4gICAgSGFybUJsb2NrTWV0aG9kW1wiU0VWRVJJVFlcIl0gPSBcIlNFVkVSSVRZXCI7XHJcbiAgICAvLyBUaGUgaGFybSBibG9jayBtZXRob2QgdXNlcyB0aGUgcHJvYmFiaWxpdHkgc2NvcmUuXHJcbiAgICBIYXJtQmxvY2tNZXRob2RbXCJQUk9CQUJJTElUWVwiXSA9IFwiUFJPQkFCSUxJVFlcIjtcclxufSkoSGFybUJsb2NrTWV0aG9kIHx8IChIYXJtQmxvY2tNZXRob2QgPSB7fSkpO1xyXG4vKipcclxuICogUHJvYmFiaWxpdHkgdGhhdCBhIHByb21wdCBvciBjYW5kaWRhdGUgbWF0Y2hlcyBhIGhhcm0gY2F0ZWdvcnkuXHJcbiAqIEBwdWJsaWNcclxuICovXHJcbnZhciBIYXJtUHJvYmFiaWxpdHk7XHJcbihmdW5jdGlvbiAoSGFybVByb2JhYmlsaXR5KSB7XHJcbiAgICAvLyBQcm9iYWJpbGl0eSBpcyB1bnNwZWNpZmllZC5cclxuICAgIEhhcm1Qcm9iYWJpbGl0eVtcIkhBUk1fUFJPQkFCSUxJVFlfVU5TUEVDSUZJRURcIl0gPSBcIkhBUk1fUFJPQkFCSUxJVFlfVU5TUEVDSUZJRURcIjtcclxuICAgIC8vIENvbnRlbnQgaGFzIGEgbmVnbGlnaWJsZSBjaGFuY2Ugb2YgYmVpbmcgdW5zYWZlLlxyXG4gICAgSGFybVByb2JhYmlsaXR5W1wiTkVHTElHSUJMRVwiXSA9IFwiTkVHTElHSUJMRVwiO1xyXG4gICAgLy8gQ29udGVudCBoYXMgYSBsb3cgY2hhbmNlIG9mIGJlaW5nIHVuc2FmZS5cclxuICAgIEhhcm1Qcm9iYWJpbGl0eVtcIkxPV1wiXSA9IFwiTE9XXCI7XHJcbiAgICAvLyBDb250ZW50IGhhcyBhIG1lZGl1bSBjaGFuY2Ugb2YgYmVpbmcgdW5zYWZlLlxyXG4gICAgSGFybVByb2JhYmlsaXR5W1wiTUVESVVNXCJdID0gXCJNRURJVU1cIjtcclxuICAgIC8vIENvbnRlbnQgaGFzIGEgaGlnaCBjaGFuY2Ugb2YgYmVpbmcgdW5zYWZlLlxyXG4gICAgSGFybVByb2JhYmlsaXR5W1wiSElHSFwiXSA9IFwiSElHSFwiO1xyXG59KShIYXJtUHJvYmFiaWxpdHkgfHwgKEhhcm1Qcm9iYWJpbGl0eSA9IHt9KSk7XHJcbi8qKlxyXG4gKiBIYXJtIHNldmVyaXR5IGxldmVscy5cclxuICogQHB1YmxpY1xyXG4gKi9cclxudmFyIEhhcm1TZXZlcml0eTtcclxuKGZ1bmN0aW9uIChIYXJtU2V2ZXJpdHkpIHtcclxuICAgIC8vIEhhcm0gc2V2ZXJpdHkgdW5zcGVjaWZpZWQuXHJcbiAgICBIYXJtU2V2ZXJpdHlbXCJIQVJNX1NFVkVSSVRZX1VOU1BFQ0lGSUVEXCJdID0gXCJIQVJNX1NFVkVSSVRZX1VOU1BFQ0lGSUVEXCI7XHJcbiAgICAvLyBOZWdsaWdpYmxlIGxldmVsIG9mIGhhcm0gc2V2ZXJpdHkuXHJcbiAgICBIYXJtU2V2ZXJpdHlbXCJIQVJNX1NFVkVSSVRZX05FR0xJR0lCTEVcIl0gPSBcIkhBUk1fU0VWRVJJVFlfTkVHTElHSUJMRVwiO1xyXG4gICAgLy8gTG93IGxldmVsIG9mIGhhcm0gc2V2ZXJpdHkuXHJcbiAgICBIYXJtU2V2ZXJpdHlbXCJIQVJNX1NFVkVSSVRZX0xPV1wiXSA9IFwiSEFSTV9TRVZFUklUWV9MT1dcIjtcclxuICAgIC8vIE1lZGl1bSBsZXZlbCBvZiBoYXJtIHNldmVyaXR5LlxyXG4gICAgSGFybVNldmVyaXR5W1wiSEFSTV9TRVZFUklUWV9NRURJVU1cIl0gPSBcIkhBUk1fU0VWRVJJVFlfTUVESVVNXCI7XHJcbiAgICAvLyBIaWdoIGxldmVsIG9mIGhhcm0gc2V2ZXJpdHkuXHJcbiAgICBIYXJtU2V2ZXJpdHlbXCJIQVJNX1NFVkVSSVRZX0hJR0hcIl0gPSBcIkhBUk1fU0VWRVJJVFlfSElHSFwiO1xyXG59KShIYXJtU2V2ZXJpdHkgfHwgKEhhcm1TZXZlcml0eSA9IHt9KSk7XHJcbi8qKlxyXG4gKiBSZWFzb24gdGhhdCBhIHByb21wdCB3YXMgYmxvY2tlZC5cclxuICogQHB1YmxpY1xyXG4gKi9cclxudmFyIEJsb2NrUmVhc29uO1xyXG4oZnVuY3Rpb24gKEJsb2NrUmVhc29uKSB7XHJcbiAgICAvLyBBIGJsb2NrZWQgcmVhc29uIHdhcyBub3Qgc3BlY2lmaWVkLlxyXG4gICAgQmxvY2tSZWFzb25bXCJCTE9DS0VEX1JFQVNPTl9VTlNQRUNJRklFRFwiXSA9IFwiQkxPQ0tFRF9SRUFTT05fVU5TUEVDSUZJRURcIjtcclxuICAgIC8vIENvbnRlbnQgd2FzIGJsb2NrZWQgYnkgc2FmZXR5IHNldHRpbmdzLlxyXG4gICAgQmxvY2tSZWFzb25bXCJTQUZFVFlcIl0gPSBcIlNBRkVUWVwiO1xyXG4gICAgLy8gQ29udGVudCB3YXMgYmxvY2tlZCwgYnV0IHRoZSByZWFzb24gaXMgdW5jYXRlZ29yaXplZC5cclxuICAgIEJsb2NrUmVhc29uW1wiT1RIRVJcIl0gPSBcIk9USEVSXCI7XHJcbn0pKEJsb2NrUmVhc29uIHx8IChCbG9ja1JlYXNvbiA9IHt9KSk7XHJcbi8qKlxyXG4gKiBSZWFzb24gdGhhdCBhIGNhbmRpZGF0ZSBmaW5pc2hlZC5cclxuICogQHB1YmxpY1xyXG4gKi9cclxudmFyIEZpbmlzaFJlYXNvbjtcclxuKGZ1bmN0aW9uIChGaW5pc2hSZWFzb24pIHtcclxuICAgIC8vIERlZmF1bHQgdmFsdWUuIFRoaXMgdmFsdWUgaXMgdW51c2VkLlxyXG4gICAgRmluaXNoUmVhc29uW1wiRklOSVNIX1JFQVNPTl9VTlNQRUNJRklFRFwiXSA9IFwiRklOSVNIX1JFQVNPTl9VTlNQRUNJRklFRFwiO1xyXG4gICAgLy8gTmF0dXJhbCBzdG9wIHBvaW50IG9mIHRoZSBtb2RlbCBvciBwcm92aWRlZCBzdG9wIHNlcXVlbmNlLlxyXG4gICAgRmluaXNoUmVhc29uW1wiU1RPUFwiXSA9IFwiU1RPUFwiO1xyXG4gICAgLy8gVGhlIG1heGltdW0gbnVtYmVyIG9mIHRva2VucyBhcyBzcGVjaWZpZWQgaW4gdGhlIHJlcXVlc3Qgd2FzIHJlYWNoZWQuXHJcbiAgICBGaW5pc2hSZWFzb25bXCJNQVhfVE9LRU5TXCJdID0gXCJNQVhfVE9LRU5TXCI7XHJcbiAgICAvLyBUaGUgY2FuZGlkYXRlIGNvbnRlbnQgd2FzIGZsYWdnZWQgZm9yIHNhZmV0eSByZWFzb25zLlxyXG4gICAgRmluaXNoUmVhc29uW1wiU0FGRVRZXCJdID0gXCJTQUZFVFlcIjtcclxuICAgIC8vIFRoZSBjYW5kaWRhdGUgY29udGVudCB3YXMgZmxhZ2dlZCBmb3IgcmVjaXRhdGlvbiByZWFzb25zLlxyXG4gICAgRmluaXNoUmVhc29uW1wiUkVDSVRBVElPTlwiXSA9IFwiUkVDSVRBVElPTlwiO1xyXG4gICAgLy8gVW5rbm93biByZWFzb24uXHJcbiAgICBGaW5pc2hSZWFzb25bXCJPVEhFUlwiXSA9IFwiT1RIRVJcIjtcclxufSkoRmluaXNoUmVhc29uIHx8IChGaW5pc2hSZWFzb24gPSB7fSkpO1xyXG4vKipcclxuICogQHB1YmxpY1xyXG4gKi9cclxudmFyIEZ1bmN0aW9uQ2FsbGluZ01vZGU7XHJcbihmdW5jdGlvbiAoRnVuY3Rpb25DYWxsaW5nTW9kZSkge1xyXG4gICAgLy8gVW5zcGVjaWZpZWQgZnVuY3Rpb24gY2FsbGluZyBtb2RlLiBUaGlzIHZhbHVlIHNob3VsZCBub3QgYmUgdXNlZC5cclxuICAgIEZ1bmN0aW9uQ2FsbGluZ01vZGVbXCJNT0RFX1VOU1BFQ0lGSUVEXCJdID0gXCJNT0RFX1VOU1BFQ0lGSUVEXCI7XHJcbiAgICAvLyBEZWZhdWx0IG1vZGVsIGJlaGF2aW9yLCBtb2RlbCBkZWNpZGVzIHRvIHByZWRpY3QgZWl0aGVyIGEgZnVuY3Rpb24gY2FsbFxyXG4gICAgLy8gb3IgYSBuYXR1cmFsIGxhbmd1YWdlIHJlcHNwb3NlLlxyXG4gICAgRnVuY3Rpb25DYWxsaW5nTW9kZVtcIkFVVE9cIl0gPSBcIkFVVE9cIjtcclxuICAgIC8vIE1vZGVsIGlzIGNvbnN0cmFpbmVkIHRvIGFsd2F5cyBwcmVkaWN0aW5nIGEgZnVuY3Rpb24gY2FsbCBvbmx5LlxyXG4gICAgLy8gSWYgXCJhbGxvd2VkX2Z1bmN0aW9uX25hbWVzXCIgaXMgc2V0LCB0aGUgcHJlZGljdGVkIGZ1bmN0aW9uIGNhbGwgd2lsbCBiZVxyXG4gICAgLy8gbGltaXRlZCB0byBhbnkgb25lIG9mIFwiYWxsb3dlZF9mdW5jdGlvbl9uYW1lc1wiLCBlbHNlIHRoZSBwcmVkaWN0ZWRcclxuICAgIC8vIGZ1bmN0aW9uIGNhbGwgd2lsbCBiZSBhbnkgb25lIG9mIHRoZSBwcm92aWRlZCBcImZ1bmN0aW9uX2RlY2xhcmF0aW9uc1wiLlxyXG4gICAgRnVuY3Rpb25DYWxsaW5nTW9kZVtcIkFOWVwiXSA9IFwiQU5ZXCI7XHJcbiAgICAvLyBNb2RlbCB3aWxsIG5vdCBwcmVkaWN0IGFueSBmdW5jdGlvbiBjYWxsLiBNb2RlbCBiZWhhdmlvciBpcyBzYW1lIGFzIHdoZW5cclxuICAgIC8vIG5vdCBwYXNzaW5nIGFueSBmdW5jdGlvbiBkZWNsYXJhdGlvbnMuXHJcbiAgICBGdW5jdGlvbkNhbGxpbmdNb2RlW1wiTk9ORVwiXSA9IFwiTk9ORVwiO1xyXG59KShGdW5jdGlvbkNhbGxpbmdNb2RlIHx8IChGdW5jdGlvbkNhbGxpbmdNb2RlID0ge30pKTtcblxuLyoqXHJcbiAqIEBsaWNlbnNlXHJcbiAqIENvcHlyaWdodCAyMDI0IEdvb2dsZSBMTENcclxuICpcclxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcclxuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxyXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcclxuICpcclxuICogICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcclxuICpcclxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxyXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXHJcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxyXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXHJcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxyXG4gKi9cclxuLyoqXHJcbiAqIENvbnRhaW5zIHRoZSBsaXN0IG9mIE9wZW5BUEkgZGF0YSB0eXBlc1xyXG4gKiBhcyBkZWZpbmVkIGJ5IGh0dHBzOi8vc3dhZ2dlci5pby9kb2NzL3NwZWNpZmljYXRpb24vZGF0YS1tb2RlbHMvZGF0YS10eXBlcy9cclxuICogQHB1YmxpY1xyXG4gKi9cclxudmFyIEZ1bmN0aW9uRGVjbGFyYXRpb25TY2hlbWFUeXBlO1xyXG4oZnVuY3Rpb24gKEZ1bmN0aW9uRGVjbGFyYXRpb25TY2hlbWFUeXBlKSB7XHJcbiAgICAvKiogU3RyaW5nIHR5cGUuICovXHJcbiAgICBGdW5jdGlvbkRlY2xhcmF0aW9uU2NoZW1hVHlwZVtcIlNUUklOR1wiXSA9IFwiU1RSSU5HXCI7XHJcbiAgICAvKiogTnVtYmVyIHR5cGUuICovXHJcbiAgICBGdW5jdGlvbkRlY2xhcmF0aW9uU2NoZW1hVHlwZVtcIk5VTUJFUlwiXSA9IFwiTlVNQkVSXCI7XHJcbiAgICAvKiogSW50ZWdlciB0eXBlLiAqL1xyXG4gICAgRnVuY3Rpb25EZWNsYXJhdGlvblNjaGVtYVR5cGVbXCJJTlRFR0VSXCJdID0gXCJJTlRFR0VSXCI7XHJcbiAgICAvKiogQm9vbGVhbiB0eXBlLiAqL1xyXG4gICAgRnVuY3Rpb25EZWNsYXJhdGlvblNjaGVtYVR5cGVbXCJCT09MRUFOXCJdID0gXCJCT09MRUFOXCI7XHJcbiAgICAvKiogQXJyYXkgdHlwZS4gKi9cclxuICAgIEZ1bmN0aW9uRGVjbGFyYXRpb25TY2hlbWFUeXBlW1wiQVJSQVlcIl0gPSBcIkFSUkFZXCI7XHJcbiAgICAvKiogT2JqZWN0IHR5cGUuICovXHJcbiAgICBGdW5jdGlvbkRlY2xhcmF0aW9uU2NoZW1hVHlwZVtcIk9CSkVDVFwiXSA9IFwiT0JKRUNUXCI7XHJcbn0pKEZ1bmN0aW9uRGVjbGFyYXRpb25TY2hlbWFUeXBlIHx8IChGdW5jdGlvbkRlY2xhcmF0aW9uU2NoZW1hVHlwZSA9IHt9KSk7XG5cbi8qKlxyXG4gKiBAbGljZW5zZVxyXG4gKiBDb3B5cmlnaHQgMjAyNCBHb29nbGUgTExDXHJcbiAqXHJcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XHJcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cclxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XHJcbiAqXHJcbiAqICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXHJcbiAqXHJcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcclxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxyXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cclxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxyXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cclxuICovXHJcbi8qKlxyXG4gKiBBZGRzIGNvbnZlbmllbmNlIGhlbHBlciBtZXRob2RzIHRvIGEgcmVzcG9uc2Ugb2JqZWN0LCBpbmNsdWRpbmcgc3RyZWFtXHJcbiAqIGNodW5rcyAoYXMgbG9uZyBhcyBlYWNoIGNodW5rIGlzIGEgY29tcGxldGUgR2VuZXJhdGVDb250ZW50UmVzcG9uc2UgSlNPTikuXHJcbiAqL1xyXG5mdW5jdGlvbiBhZGRIZWxwZXJzKHJlc3BvbnNlKSB7XHJcbiAgICByZXNwb25zZS50ZXh0ID0gKCkgPT4ge1xyXG4gICAgICAgIGlmIChyZXNwb25zZS5jYW5kaWRhdGVzICYmIHJlc3BvbnNlLmNhbmRpZGF0ZXMubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICBpZiAocmVzcG9uc2UuY2FuZGlkYXRlcy5sZW5ndGggPiAxKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oYFRoaXMgcmVzcG9uc2UgaGFkICR7cmVzcG9uc2UuY2FuZGlkYXRlcy5sZW5ndGh9IGAgK1xyXG4gICAgICAgICAgICAgICAgICAgIGBjYW5kaWRhdGVzLiBSZXR1cm5pbmcgdGV4dCBmcm9tIHRoZSBmaXJzdCBjYW5kaWRhdGUgb25seS4gYCArXHJcbiAgICAgICAgICAgICAgICAgICAgYEFjY2VzcyByZXNwb25zZS5jYW5kaWRhdGVzIGRpcmVjdGx5IHRvIHVzZSB0aGUgb3RoZXIgY2FuZGlkYXRlcy5gKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoaGFkQmFkRmluaXNoUmVhc29uKHJlc3BvbnNlLmNhbmRpZGF0ZXNbMF0pKSB7XHJcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgVmVydGV4QUlFcnJvcihcInJlc3BvbnNlLWVycm9yXCIgLyogVmVydGV4QUlFcnJvckNvZGUuUkVTUE9OU0VfRVJST1IgKi8sIGBSZXNwb25zZSBlcnJvcjogJHtmb3JtYXRCbG9ja0Vycm9yTWVzc2FnZShyZXNwb25zZSl9LiBSZXNwb25zZSBib2R5IHN0b3JlZCBpbiBlcnJvci5yZXNwb25zZWAsIHtcclxuICAgICAgICAgICAgICAgICAgICByZXNwb25zZVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIGdldFRleHQocmVzcG9uc2UpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmIChyZXNwb25zZS5wcm9tcHRGZWVkYmFjaykge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgVmVydGV4QUlFcnJvcihcInJlc3BvbnNlLWVycm9yXCIgLyogVmVydGV4QUlFcnJvckNvZGUuUkVTUE9OU0VfRVJST1IgKi8sIGBUZXh0IG5vdCBhdmFpbGFibGUuICR7Zm9ybWF0QmxvY2tFcnJvck1lc3NhZ2UocmVzcG9uc2UpfWAsIHtcclxuICAgICAgICAgICAgICAgIHJlc3BvbnNlXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gJyc7XHJcbiAgICB9O1xyXG4gICAgcmVzcG9uc2UuZnVuY3Rpb25DYWxscyA9ICgpID0+IHtcclxuICAgICAgICBpZiAocmVzcG9uc2UuY2FuZGlkYXRlcyAmJiByZXNwb25zZS5jYW5kaWRhdGVzLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgaWYgKHJlc3BvbnNlLmNhbmRpZGF0ZXMubGVuZ3RoID4gMSkge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS53YXJuKGBUaGlzIHJlc3BvbnNlIGhhZCAke3Jlc3BvbnNlLmNhbmRpZGF0ZXMubGVuZ3RofSBgICtcclxuICAgICAgICAgICAgICAgICAgICBgY2FuZGlkYXRlcy4gUmV0dXJuaW5nIGZ1bmN0aW9uIGNhbGxzIGZyb20gdGhlIGZpcnN0IGNhbmRpZGF0ZSBvbmx5LiBgICtcclxuICAgICAgICAgICAgICAgICAgICBgQWNjZXNzIHJlc3BvbnNlLmNhbmRpZGF0ZXMgZGlyZWN0bHkgdG8gdXNlIHRoZSBvdGhlciBjYW5kaWRhdGVzLmApO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChoYWRCYWRGaW5pc2hSZWFzb24ocmVzcG9uc2UuY2FuZGlkYXRlc1swXSkpIHtcclxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBWZXJ0ZXhBSUVycm9yKFwicmVzcG9uc2UtZXJyb3JcIiAvKiBWZXJ0ZXhBSUVycm9yQ29kZS5SRVNQT05TRV9FUlJPUiAqLywgYFJlc3BvbnNlIGVycm9yOiAke2Zvcm1hdEJsb2NrRXJyb3JNZXNzYWdlKHJlc3BvbnNlKX0uIFJlc3BvbnNlIGJvZHkgc3RvcmVkIGluIGVycm9yLnJlc3BvbnNlYCwge1xyXG4gICAgICAgICAgICAgICAgICAgIHJlc3BvbnNlXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gZ2V0RnVuY3Rpb25DYWxscyhyZXNwb25zZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKHJlc3BvbnNlLnByb21wdEZlZWRiYWNrKSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBWZXJ0ZXhBSUVycm9yKFwicmVzcG9uc2UtZXJyb3JcIiAvKiBWZXJ0ZXhBSUVycm9yQ29kZS5SRVNQT05TRV9FUlJPUiAqLywgYEZ1bmN0aW9uIGNhbGwgbm90IGF2YWlsYWJsZS4gJHtmb3JtYXRCbG9ja0Vycm9yTWVzc2FnZShyZXNwb25zZSl9YCwge1xyXG4gICAgICAgICAgICAgICAgcmVzcG9uc2VcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB1bmRlZmluZWQ7XHJcbiAgICB9O1xyXG4gICAgcmV0dXJuIHJlc3BvbnNlO1xyXG59XHJcbi8qKlxyXG4gKiBSZXR1cm5zIGFsbCB0ZXh0IGZvdW5kIGluIGFsbCBwYXJ0cyBvZiBmaXJzdCBjYW5kaWRhdGUuXHJcbiAqL1xyXG5mdW5jdGlvbiBnZXRUZXh0KHJlc3BvbnNlKSB7XHJcbiAgICB2YXIgX2EsIF9iLCBfYywgX2Q7XHJcbiAgICBjb25zdCB0ZXh0U3RyaW5ncyA9IFtdO1xyXG4gICAgaWYgKChfYiA9IChfYSA9IHJlc3BvbnNlLmNhbmRpZGF0ZXMpID09PSBudWxsIHx8IF9hID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYVswXS5jb250ZW50KSA9PT0gbnVsbCB8fCBfYiA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2IucGFydHMpIHtcclxuICAgICAgICBmb3IgKGNvbnN0IHBhcnQgb2YgKF9kID0gKF9jID0gcmVzcG9uc2UuY2FuZGlkYXRlcykgPT09IG51bGwgfHwgX2MgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9jWzBdLmNvbnRlbnQpID09PSBudWxsIHx8IF9kID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfZC5wYXJ0cykge1xyXG4gICAgICAgICAgICBpZiAocGFydC50ZXh0KSB7XHJcbiAgICAgICAgICAgICAgICB0ZXh0U3RyaW5ncy5wdXNoKHBhcnQudGV4dCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBpZiAodGV4dFN0cmluZ3MubGVuZ3RoID4gMCkge1xyXG4gICAgICAgIHJldHVybiB0ZXh0U3RyaW5ncy5qb2luKCcnKTtcclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICAgIHJldHVybiAnJztcclxuICAgIH1cclxufVxyXG4vKipcclxuICogUmV0dXJucyB7QGxpbmsgRnVuY3Rpb25DYWxsfXMgYXNzb2NpYXRlZCB3aXRoIGZpcnN0IGNhbmRpZGF0ZS5cclxuICovXHJcbmZ1bmN0aW9uIGdldEZ1bmN0aW9uQ2FsbHMocmVzcG9uc2UpIHtcclxuICAgIHZhciBfYSwgX2IsIF9jLCBfZDtcclxuICAgIGNvbnN0IGZ1bmN0aW9uQ2FsbHMgPSBbXTtcclxuICAgIGlmICgoX2IgPSAoX2EgPSByZXNwb25zZS5jYW5kaWRhdGVzKSA9PT0gbnVsbCB8fCBfYSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2FbMF0uY29udGVudCkgPT09IG51bGwgfHwgX2IgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9iLnBhcnRzKSB7XHJcbiAgICAgICAgZm9yIChjb25zdCBwYXJ0IG9mIChfZCA9IChfYyA9IHJlc3BvbnNlLmNhbmRpZGF0ZXMpID09PSBudWxsIHx8IF9jID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfY1swXS5jb250ZW50KSA9PT0gbnVsbCB8fCBfZCA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2QucGFydHMpIHtcclxuICAgICAgICAgICAgaWYgKHBhcnQuZnVuY3Rpb25DYWxsKSB7XHJcbiAgICAgICAgICAgICAgICBmdW5jdGlvbkNhbGxzLnB1c2gocGFydC5mdW5jdGlvbkNhbGwpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgaWYgKGZ1bmN0aW9uQ2FsbHMubGVuZ3RoID4gMCkge1xyXG4gICAgICAgIHJldHVybiBmdW5jdGlvbkNhbGxzO1xyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcclxuICAgIH1cclxufVxyXG5jb25zdCBiYWRGaW5pc2hSZWFzb25zID0gW0ZpbmlzaFJlYXNvbi5SRUNJVEFUSU9OLCBGaW5pc2hSZWFzb24uU0FGRVRZXTtcclxuZnVuY3Rpb24gaGFkQmFkRmluaXNoUmVhc29uKGNhbmRpZGF0ZSkge1xyXG4gICAgcmV0dXJuICghIWNhbmRpZGF0ZS5maW5pc2hSZWFzb24gJiZcclxuICAgICAgICBiYWRGaW5pc2hSZWFzb25zLmluY2x1ZGVzKGNhbmRpZGF0ZS5maW5pc2hSZWFzb24pKTtcclxufVxyXG5mdW5jdGlvbiBmb3JtYXRCbG9ja0Vycm9yTWVzc2FnZShyZXNwb25zZSkge1xyXG4gICAgdmFyIF9hLCBfYiwgX2M7XHJcbiAgICBsZXQgbWVzc2FnZSA9ICcnO1xyXG4gICAgaWYgKCghcmVzcG9uc2UuY2FuZGlkYXRlcyB8fCByZXNwb25zZS5jYW5kaWRhdGVzLmxlbmd0aCA9PT0gMCkgJiZcclxuICAgICAgICByZXNwb25zZS5wcm9tcHRGZWVkYmFjaykge1xyXG4gICAgICAgIG1lc3NhZ2UgKz0gJ1Jlc3BvbnNlIHdhcyBibG9ja2VkJztcclxuICAgICAgICBpZiAoKF9hID0gcmVzcG9uc2UucHJvbXB0RmVlZGJhY2spID09PSBudWxsIHx8IF9hID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYS5ibG9ja1JlYXNvbikge1xyXG4gICAgICAgICAgICBtZXNzYWdlICs9IGAgZHVlIHRvICR7cmVzcG9uc2UucHJvbXB0RmVlZGJhY2suYmxvY2tSZWFzb259YDtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKChfYiA9IHJlc3BvbnNlLnByb21wdEZlZWRiYWNrKSA9PT0gbnVsbCB8fCBfYiA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2IuYmxvY2tSZWFzb25NZXNzYWdlKSB7XHJcbiAgICAgICAgICAgIG1lc3NhZ2UgKz0gYDogJHtyZXNwb25zZS5wcm9tcHRGZWVkYmFjay5ibG9ja1JlYXNvbk1lc3NhZ2V9YDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBlbHNlIGlmICgoX2MgPSByZXNwb25zZS5jYW5kaWRhdGVzKSA9PT0gbnVsbCB8fCBfYyA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2NbMF0pIHtcclxuICAgICAgICBjb25zdCBmaXJzdENhbmRpZGF0ZSA9IHJlc3BvbnNlLmNhbmRpZGF0ZXNbMF07XHJcbiAgICAgICAgaWYgKGhhZEJhZEZpbmlzaFJlYXNvbihmaXJzdENhbmRpZGF0ZSkpIHtcclxuICAgICAgICAgICAgbWVzc2FnZSArPSBgQ2FuZGlkYXRlIHdhcyBibG9ja2VkIGR1ZSB0byAke2ZpcnN0Q2FuZGlkYXRlLmZpbmlzaFJlYXNvbn1gO1xyXG4gICAgICAgICAgICBpZiAoZmlyc3RDYW5kaWRhdGUuZmluaXNoTWVzc2FnZSkge1xyXG4gICAgICAgICAgICAgICAgbWVzc2FnZSArPSBgOiAke2ZpcnN0Q2FuZGlkYXRlLmZpbmlzaE1lc3NhZ2V9YDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiBtZXNzYWdlO1xyXG59XG5cbi8qKlxyXG4gKiBAbGljZW5zZVxyXG4gKiBDb3B5cmlnaHQgMjAyNCBHb29nbGUgTExDXHJcbiAqXHJcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XHJcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cclxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XHJcbiAqXHJcbiAqICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXHJcbiAqXHJcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcclxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxyXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cclxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxyXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cclxuICovXHJcbmNvbnN0IHJlc3BvbnNlTGluZVJFID0gL15kYXRhXFw6ICguKikoPzpcXG5cXG58XFxyXFxyfFxcclxcblxcclxcbikvO1xyXG4vKipcclxuICogUHJvY2VzcyBhIHJlc3BvbnNlLmJvZHkgc3RyZWFtIGZyb20gdGhlIGJhY2tlbmQgYW5kIHJldHVybiBhblxyXG4gKiBpdGVyYXRvciB0aGF0IHByb3ZpZGVzIG9uZSBjb21wbGV0ZSBHZW5lcmF0ZUNvbnRlbnRSZXNwb25zZSBhdCBhIHRpbWVcclxuICogYW5kIGEgcHJvbWlzZSB0aGF0IHJlc29sdmVzIHdpdGggYSBzaW5nbGUgYWdncmVnYXRlZFxyXG4gKiBHZW5lcmF0ZUNvbnRlbnRSZXNwb25zZS5cclxuICpcclxuICogQHBhcmFtIHJlc3BvbnNlIC0gUmVzcG9uc2UgZnJvbSBhIGZldGNoIGNhbGxcclxuICovXHJcbmZ1bmN0aW9uIHByb2Nlc3NTdHJlYW0ocmVzcG9uc2UpIHtcclxuICAgIGNvbnN0IGlucHV0U3RyZWFtID0gcmVzcG9uc2UuYm9keS5waXBlVGhyb3VnaChuZXcgVGV4dERlY29kZXJTdHJlYW0oJ3V0ZjgnLCB7IGZhdGFsOiB0cnVlIH0pKTtcclxuICAgIGNvbnN0IHJlc3BvbnNlU3RyZWFtID0gZ2V0UmVzcG9uc2VTdHJlYW0oaW5wdXRTdHJlYW0pO1xyXG4gICAgY29uc3QgW3N0cmVhbTEsIHN0cmVhbTJdID0gcmVzcG9uc2VTdHJlYW0udGVlKCk7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIHN0cmVhbTogZ2VuZXJhdGVSZXNwb25zZVNlcXVlbmNlKHN0cmVhbTEpLFxyXG4gICAgICAgIHJlc3BvbnNlOiBnZXRSZXNwb25zZVByb21pc2Uoc3RyZWFtMilcclxuICAgIH07XHJcbn1cclxuYXN5bmMgZnVuY3Rpb24gZ2V0UmVzcG9uc2VQcm9taXNlKHN0cmVhbSkge1xyXG4gICAgY29uc3QgYWxsUmVzcG9uc2VzID0gW107XHJcbiAgICBjb25zdCByZWFkZXIgPSBzdHJlYW0uZ2V0UmVhZGVyKCk7XHJcbiAgICB3aGlsZSAodHJ1ZSkge1xyXG4gICAgICAgIGNvbnN0IHsgZG9uZSwgdmFsdWUgfSA9IGF3YWl0IHJlYWRlci5yZWFkKCk7XHJcbiAgICAgICAgaWYgKGRvbmUpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGFkZEhlbHBlcnMoYWdncmVnYXRlUmVzcG9uc2VzKGFsbFJlc3BvbnNlcykpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBhbGxSZXNwb25zZXMucHVzaCh2YWx1ZSk7XHJcbiAgICB9XHJcbn1cclxuZnVuY3Rpb24gZ2VuZXJhdGVSZXNwb25zZVNlcXVlbmNlKHN0cmVhbSkge1xyXG4gICAgcmV0dXJuIF9fYXN5bmNHZW5lcmF0b3IodGhpcywgYXJndW1lbnRzLCBmdW5jdGlvbiogZ2VuZXJhdGVSZXNwb25zZVNlcXVlbmNlXzEoKSB7XHJcbiAgICAgICAgY29uc3QgcmVhZGVyID0gc3RyZWFtLmdldFJlYWRlcigpO1xyXG4gICAgICAgIHdoaWxlICh0cnVlKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHsgdmFsdWUsIGRvbmUgfSA9IHlpZWxkIF9fYXdhaXQocmVhZGVyLnJlYWQoKSk7XHJcbiAgICAgICAgICAgIGlmIChkb25lKSB7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB5aWVsZCB5aWVsZCBfX2F3YWl0KGFkZEhlbHBlcnModmFsdWUpKTtcclxuICAgICAgICB9XHJcbiAgICB9KTtcclxufVxyXG4vKipcclxuICogUmVhZHMgYSByYXcgc3RyZWFtIGZyb20gdGhlIGZldGNoIHJlc3BvbnNlIGFuZCBqb2luIGluY29tcGxldGVcclxuICogY2h1bmtzLCByZXR1cm5pbmcgYSBuZXcgc3RyZWFtIHRoYXQgcHJvdmlkZXMgYSBzaW5nbGUgY29tcGxldGVcclxuICogR2VuZXJhdGVDb250ZW50UmVzcG9uc2UgaW4gZWFjaCBpdGVyYXRpb24uXHJcbiAqL1xyXG5mdW5jdGlvbiBnZXRSZXNwb25zZVN0cmVhbShpbnB1dFN0cmVhbSkge1xyXG4gICAgY29uc3QgcmVhZGVyID0gaW5wdXRTdHJlYW0uZ2V0UmVhZGVyKCk7XHJcbiAgICBjb25zdCBzdHJlYW0gPSBuZXcgUmVhZGFibGVTdHJlYW0oe1xyXG4gICAgICAgIHN0YXJ0KGNvbnRyb2xsZXIpIHtcclxuICAgICAgICAgICAgbGV0IGN1cnJlbnRUZXh0ID0gJyc7XHJcbiAgICAgICAgICAgIHJldHVybiBwdW1wKCk7XHJcbiAgICAgICAgICAgIGZ1bmN0aW9uIHB1bXAoKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVhZGVyLnJlYWQoKS50aGVuKCh7IHZhbHVlLCBkb25lIH0pID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoZG9uZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoY3VycmVudFRleHQudHJpbSgpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyLmVycm9yKG5ldyBWZXJ0ZXhBSUVycm9yKFwicGFyc2UtZmFpbGVkXCIgLyogVmVydGV4QUlFcnJvckNvZGUuUEFSU0VfRkFJTEVEICovLCAnRmFpbGVkIHRvIHBhcnNlIHN0cmVhbScpKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyLmNsb3NlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgY3VycmVudFRleHQgKz0gdmFsdWU7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IG1hdGNoID0gY3VycmVudFRleHQubWF0Y2gocmVzcG9uc2VMaW5lUkUpO1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBwYXJzZWRSZXNwb25zZTtcclxuICAgICAgICAgICAgICAgICAgICB3aGlsZSAobWF0Y2gpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhcnNlZFJlc3BvbnNlID0gSlNPTi5wYXJzZShtYXRjaFsxXSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgY2F0Y2ggKGUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXIuZXJyb3IobmV3IFZlcnRleEFJRXJyb3IoXCJwYXJzZS1mYWlsZWRcIiAvKiBWZXJ0ZXhBSUVycm9yQ29kZS5QQVJTRV9GQUlMRUQgKi8sIGBFcnJvciBwYXJzaW5nIEpTT04gcmVzcG9uc2U6IFwiJHttYXRjaFsxXX1gKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlci5lbnF1ZXVlKHBhcnNlZFJlc3BvbnNlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY3VycmVudFRleHQgPSBjdXJyZW50VGV4dC5zdWJzdHJpbmcobWF0Y2hbMF0ubGVuZ3RoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbWF0Y2ggPSBjdXJyZW50VGV4dC5tYXRjaChyZXNwb25zZUxpbmVSRSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBwdW1wKCk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH0pO1xyXG4gICAgcmV0dXJuIHN0cmVhbTtcclxufVxyXG4vKipcclxuICogQWdncmVnYXRlcyBhbiBhcnJheSBvZiBgR2VuZXJhdGVDb250ZW50UmVzcG9uc2VgcyBpbnRvIGEgc2luZ2xlXHJcbiAqIEdlbmVyYXRlQ29udGVudFJlc3BvbnNlLlxyXG4gKi9cclxuZnVuY3Rpb24gYWdncmVnYXRlUmVzcG9uc2VzKHJlc3BvbnNlcykge1xyXG4gICAgY29uc3QgbGFzdFJlc3BvbnNlID0gcmVzcG9uc2VzW3Jlc3BvbnNlcy5sZW5ndGggLSAxXTtcclxuICAgIGNvbnN0IGFnZ3JlZ2F0ZWRSZXNwb25zZSA9IHtcclxuICAgICAgICBwcm9tcHRGZWVkYmFjazogbGFzdFJlc3BvbnNlID09PSBudWxsIHx8IGxhc3RSZXNwb25zZSA9PT0gdm9pZCAwID8gdm9pZCAwIDogbGFzdFJlc3BvbnNlLnByb21wdEZlZWRiYWNrXHJcbiAgICB9O1xyXG4gICAgZm9yIChjb25zdCByZXNwb25zZSBvZiByZXNwb25zZXMpIHtcclxuICAgICAgICBpZiAocmVzcG9uc2UuY2FuZGlkYXRlcykge1xyXG4gICAgICAgICAgICBmb3IgKGNvbnN0IGNhbmRpZGF0ZSBvZiByZXNwb25zZS5jYW5kaWRhdGVzKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBpID0gY2FuZGlkYXRlLmluZGV4O1xyXG4gICAgICAgICAgICAgICAgaWYgKCFhZ2dyZWdhdGVkUmVzcG9uc2UuY2FuZGlkYXRlcykge1xyXG4gICAgICAgICAgICAgICAgICAgIGFnZ3JlZ2F0ZWRSZXNwb25zZS5jYW5kaWRhdGVzID0gW107XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpZiAoIWFnZ3JlZ2F0ZWRSZXNwb25zZS5jYW5kaWRhdGVzW2ldKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgYWdncmVnYXRlZFJlc3BvbnNlLmNhbmRpZGF0ZXNbaV0gPSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGluZGV4OiBjYW5kaWRhdGUuaW5kZXhcclxuICAgICAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgLy8gS2VlcCBvdmVyd3JpdGluZywgdGhlIGxhc3Qgb25lIHdpbGwgYmUgZmluYWxcclxuICAgICAgICAgICAgICAgIGFnZ3JlZ2F0ZWRSZXNwb25zZS5jYW5kaWRhdGVzW2ldLmNpdGF0aW9uTWV0YWRhdGEgPVxyXG4gICAgICAgICAgICAgICAgICAgIGNhbmRpZGF0ZS5jaXRhdGlvbk1ldGFkYXRhO1xyXG4gICAgICAgICAgICAgICAgYWdncmVnYXRlZFJlc3BvbnNlLmNhbmRpZGF0ZXNbaV0uZmluaXNoUmVhc29uID0gY2FuZGlkYXRlLmZpbmlzaFJlYXNvbjtcclxuICAgICAgICAgICAgICAgIGFnZ3JlZ2F0ZWRSZXNwb25zZS5jYW5kaWRhdGVzW2ldLmZpbmlzaE1lc3NhZ2UgPVxyXG4gICAgICAgICAgICAgICAgICAgIGNhbmRpZGF0ZS5maW5pc2hNZXNzYWdlO1xyXG4gICAgICAgICAgICAgICAgYWdncmVnYXRlZFJlc3BvbnNlLmNhbmRpZGF0ZXNbaV0uc2FmZXR5UmF0aW5ncyA9XHJcbiAgICAgICAgICAgICAgICAgICAgY2FuZGlkYXRlLnNhZmV0eVJhdGluZ3M7XHJcbiAgICAgICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgICAgICAqIENhbmRpZGF0ZXMgc2hvdWxkIGFsd2F5cyBoYXZlIGNvbnRlbnQgYW5kIHBhcnRzLCBidXQgdGhpcyBoYW5kbGVzXHJcbiAgICAgICAgICAgICAgICAgKiBwb3NzaWJsZSBtYWxmb3JtZWQgcmVzcG9uc2VzLlxyXG4gICAgICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgICAgICBpZiAoY2FuZGlkYXRlLmNvbnRlbnQgJiYgY2FuZGlkYXRlLmNvbnRlbnQucGFydHMpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoIWFnZ3JlZ2F0ZWRSZXNwb25zZS5jYW5kaWRhdGVzW2ldLmNvbnRlbnQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYWdncmVnYXRlZFJlc3BvbnNlLmNhbmRpZGF0ZXNbaV0uY29udGVudCA9IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJvbGU6IGNhbmRpZGF0ZS5jb250ZW50LnJvbGUgfHwgJ3VzZXInLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFydHM6IFtdXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IG5ld1BhcnQgPSB7fTtcclxuICAgICAgICAgICAgICAgICAgICBmb3IgKGNvbnN0IHBhcnQgb2YgY2FuZGlkYXRlLmNvbnRlbnQucGFydHMpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHBhcnQudGV4dCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3UGFydC50ZXh0ID0gcGFydC50ZXh0O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChwYXJ0LmZ1bmN0aW9uQ2FsbCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3UGFydC5mdW5jdGlvbkNhbGwgPSBwYXJ0LmZ1bmN0aW9uQ2FsbDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoT2JqZWN0LmtleXMobmV3UGFydCkubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXdQYXJ0LnRleHQgPSAnJztcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBhZ2dyZWdhdGVkUmVzcG9uc2UuY2FuZGlkYXRlc1tpXS5jb250ZW50LnBhcnRzLnB1c2gobmV3UGFydCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIGFnZ3JlZ2F0ZWRSZXNwb25zZTtcclxufVxuXG4vKipcclxuICogQGxpY2Vuc2VcclxuICogQ29weXJpZ2h0IDIwMjQgR29vZ2xlIExMQ1xyXG4gKlxyXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xyXG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXHJcbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxyXG4gKlxyXG4gKiAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxyXG4gKlxyXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXHJcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcclxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXHJcbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcclxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXHJcbiAqL1xyXG5hc3luYyBmdW5jdGlvbiBnZW5lcmF0ZUNvbnRlbnRTdHJlYW0oYXBpU2V0dGluZ3MsIG1vZGVsLCBwYXJhbXMsIHJlcXVlc3RPcHRpb25zKSB7XHJcbiAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IG1ha2VSZXF1ZXN0KG1vZGVsLCBUYXNrLlNUUkVBTV9HRU5FUkFURV9DT05URU5ULCBhcGlTZXR0aW5ncywgXHJcbiAgICAvKiBzdHJlYW0gKi8gdHJ1ZSwgSlNPTi5zdHJpbmdpZnkocGFyYW1zKSwgcmVxdWVzdE9wdGlvbnMpO1xyXG4gICAgcmV0dXJuIHByb2Nlc3NTdHJlYW0ocmVzcG9uc2UpO1xyXG59XHJcbmFzeW5jIGZ1bmN0aW9uIGdlbmVyYXRlQ29udGVudChhcGlTZXR0aW5ncywgbW9kZWwsIHBhcmFtcywgcmVxdWVzdE9wdGlvbnMpIHtcclxuICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgbWFrZVJlcXVlc3QobW9kZWwsIFRhc2suR0VORVJBVEVfQ09OVEVOVCwgYXBpU2V0dGluZ3MsIFxyXG4gICAgLyogc3RyZWFtICovIGZhbHNlLCBKU09OLnN0cmluZ2lmeShwYXJhbXMpLCByZXF1ZXN0T3B0aW9ucyk7XHJcbiAgICBjb25zdCByZXNwb25zZUpzb24gPSBhd2FpdCByZXNwb25zZS5qc29uKCk7XHJcbiAgICBjb25zdCBlbmhhbmNlZFJlc3BvbnNlID0gYWRkSGVscGVycyhyZXNwb25zZUpzb24pO1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICByZXNwb25zZTogZW5oYW5jZWRSZXNwb25zZVxyXG4gICAgfTtcclxufVxuXG4vKipcclxuICogQGxpY2Vuc2VcclxuICogQ29weXJpZ2h0IDIwMjQgR29vZ2xlIExMQ1xyXG4gKlxyXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xyXG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXHJcbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxyXG4gKlxyXG4gKiAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxyXG4gKlxyXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXHJcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcclxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXHJcbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcclxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXHJcbiAqL1xyXG5mdW5jdGlvbiBmb3JtYXRTeXN0ZW1JbnN0cnVjdGlvbihpbnB1dCkge1xyXG4gICAgLy8gbnVsbCBvciB1bmRlZmluZWRcclxuICAgIGlmIChpbnB1dCA9PSBudWxsKSB7XHJcbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcclxuICAgIH1cclxuICAgIGVsc2UgaWYgKHR5cGVvZiBpbnB1dCA9PT0gJ3N0cmluZycpIHtcclxuICAgICAgICByZXR1cm4geyByb2xlOiAnc3lzdGVtJywgcGFydHM6IFt7IHRleHQ6IGlucHV0IH1dIH07XHJcbiAgICB9XHJcbiAgICBlbHNlIGlmIChpbnB1dC50ZXh0KSB7XHJcbiAgICAgICAgcmV0dXJuIHsgcm9sZTogJ3N5c3RlbScsIHBhcnRzOiBbaW5wdXRdIH07XHJcbiAgICB9XHJcbiAgICBlbHNlIGlmIChpbnB1dC5wYXJ0cykge1xyXG4gICAgICAgIGlmICghaW5wdXQucm9sZSkge1xyXG4gICAgICAgICAgICByZXR1cm4geyByb2xlOiAnc3lzdGVtJywgcGFydHM6IGlucHV0LnBhcnRzIH07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICByZXR1cm4gaW5wdXQ7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbmZ1bmN0aW9uIGZvcm1hdE5ld0NvbnRlbnQocmVxdWVzdCkge1xyXG4gICAgbGV0IG5ld1BhcnRzID0gW107XHJcbiAgICBpZiAodHlwZW9mIHJlcXVlc3QgPT09ICdzdHJpbmcnKSB7XHJcbiAgICAgICAgbmV3UGFydHMgPSBbeyB0ZXh0OiByZXF1ZXN0IH1dO1xyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgICAgZm9yIChjb25zdCBwYXJ0T3JTdHJpbmcgb2YgcmVxdWVzdCkge1xyXG4gICAgICAgICAgICBpZiAodHlwZW9mIHBhcnRPclN0cmluZyA9PT0gJ3N0cmluZycpIHtcclxuICAgICAgICAgICAgICAgIG5ld1BhcnRzLnB1c2goeyB0ZXh0OiBwYXJ0T3JTdHJpbmcgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBuZXdQYXJ0cy5wdXNoKHBhcnRPclN0cmluZyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gYXNzaWduUm9sZVRvUGFydHNBbmRWYWxpZGF0ZVNlbmRNZXNzYWdlUmVxdWVzdChuZXdQYXJ0cyk7XHJcbn1cclxuLyoqXHJcbiAqIFdoZW4gbXVsdGlwbGUgUGFydCB0eXBlcyAoaS5lLiBGdW5jdGlvblJlc3BvbnNlUGFydCBhbmQgVGV4dFBhcnQpIGFyZVxyXG4gKiBwYXNzZWQgaW4gYSBzaW5nbGUgUGFydCBhcnJheSwgd2UgbWF5IG5lZWQgdG8gYXNzaWduIGRpZmZlcmVudCByb2xlcyB0byBlYWNoXHJcbiAqIHBhcnQuIEN1cnJlbnRseSBvbmx5IEZ1bmN0aW9uUmVzcG9uc2VQYXJ0IHJlcXVpcmVzIGEgcm9sZSBvdGhlciB0aGFuICd1c2VyJy5cclxuICogQHByaXZhdGVcclxuICogQHBhcmFtIHBhcnRzIEFycmF5IG9mIHBhcnRzIHRvIHBhc3MgdG8gdGhlIG1vZGVsXHJcbiAqIEByZXR1cm5zIEFycmF5IG9mIGNvbnRlbnQgaXRlbXNcclxuICovXHJcbmZ1bmN0aW9uIGFzc2lnblJvbGVUb1BhcnRzQW5kVmFsaWRhdGVTZW5kTWVzc2FnZVJlcXVlc3QocGFydHMpIHtcclxuICAgIGNvbnN0IHVzZXJDb250ZW50ID0geyByb2xlOiAndXNlcicsIHBhcnRzOiBbXSB9O1xyXG4gICAgY29uc3QgZnVuY3Rpb25Db250ZW50ID0geyByb2xlOiAnZnVuY3Rpb24nLCBwYXJ0czogW10gfTtcclxuICAgIGxldCBoYXNVc2VyQ29udGVudCA9IGZhbHNlO1xyXG4gICAgbGV0IGhhc0Z1bmN0aW9uQ29udGVudCA9IGZhbHNlO1xyXG4gICAgZm9yIChjb25zdCBwYXJ0IG9mIHBhcnRzKSB7XHJcbiAgICAgICAgaWYgKCdmdW5jdGlvblJlc3BvbnNlJyBpbiBwYXJ0KSB7XHJcbiAgICAgICAgICAgIGZ1bmN0aW9uQ29udGVudC5wYXJ0cy5wdXNoKHBhcnQpO1xyXG4gICAgICAgICAgICBoYXNGdW5jdGlvbkNvbnRlbnQgPSB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgdXNlckNvbnRlbnQucGFydHMucHVzaChwYXJ0KTtcclxuICAgICAgICAgICAgaGFzVXNlckNvbnRlbnQgPSB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGlmIChoYXNVc2VyQ29udGVudCAmJiBoYXNGdW5jdGlvbkNvbnRlbnQpIHtcclxuICAgICAgICB0aHJvdyBuZXcgVmVydGV4QUlFcnJvcihcImludmFsaWQtY29udGVudFwiIC8qIFZlcnRleEFJRXJyb3JDb2RlLklOVkFMSURfQ09OVEVOVCAqLywgJ1dpdGhpbiBhIHNpbmdsZSBtZXNzYWdlLCBGdW5jdGlvblJlc3BvbnNlIGNhbm5vdCBiZSBtaXhlZCB3aXRoIG90aGVyIHR5cGUgb2YgUGFydCBpbiB0aGUgcmVxdWVzdCBmb3Igc2VuZGluZyBjaGF0IG1lc3NhZ2UuJyk7XHJcbiAgICB9XHJcbiAgICBpZiAoIWhhc1VzZXJDb250ZW50ICYmICFoYXNGdW5jdGlvbkNvbnRlbnQpIHtcclxuICAgICAgICB0aHJvdyBuZXcgVmVydGV4QUlFcnJvcihcImludmFsaWQtY29udGVudFwiIC8qIFZlcnRleEFJRXJyb3JDb2RlLklOVkFMSURfQ09OVEVOVCAqLywgJ05vIENvbnRlbnQgaXMgcHJvdmlkZWQgZm9yIHNlbmRpbmcgY2hhdCBtZXNzYWdlLicpO1xyXG4gICAgfVxyXG4gICAgaWYgKGhhc1VzZXJDb250ZW50KSB7XHJcbiAgICAgICAgcmV0dXJuIHVzZXJDb250ZW50O1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGZ1bmN0aW9uQ29udGVudDtcclxufVxyXG5mdW5jdGlvbiBmb3JtYXRHZW5lcmF0ZUNvbnRlbnRJbnB1dChwYXJhbXMpIHtcclxuICAgIGxldCBmb3JtYXR0ZWRSZXF1ZXN0O1xyXG4gICAgaWYgKHBhcmFtcy5jb250ZW50cykge1xyXG4gICAgICAgIGZvcm1hdHRlZFJlcXVlc3QgPSBwYXJhbXM7XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgICAvLyBBcnJheSBvciBzdHJpbmdcclxuICAgICAgICBjb25zdCBjb250ZW50ID0gZm9ybWF0TmV3Q29udGVudChwYXJhbXMpO1xyXG4gICAgICAgIGZvcm1hdHRlZFJlcXVlc3QgPSB7IGNvbnRlbnRzOiBbY29udGVudF0gfTtcclxuICAgIH1cclxuICAgIGlmIChwYXJhbXMuc3lzdGVtSW5zdHJ1Y3Rpb24pIHtcclxuICAgICAgICBmb3JtYXR0ZWRSZXF1ZXN0LnN5c3RlbUluc3RydWN0aW9uID0gZm9ybWF0U3lzdGVtSW5zdHJ1Y3Rpb24ocGFyYW1zLnN5c3RlbUluc3RydWN0aW9uKTtcclxuICAgIH1cclxuICAgIHJldHVybiBmb3JtYXR0ZWRSZXF1ZXN0O1xyXG59XG5cbi8qKlxyXG4gKiBAbGljZW5zZVxyXG4gKiBDb3B5cmlnaHQgMjAyNCBHb29nbGUgTExDXHJcbiAqXHJcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XHJcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cclxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XHJcbiAqXHJcbiAqICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXHJcbiAqXHJcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcclxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxyXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cclxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxyXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cclxuICovXHJcbi8vIGh0dHBzOi8vYWkuZ29vZ2xlLmRldi9hcGkvcmVzdC92MWJldGEvQ29udGVudCNwYXJ0XHJcbmNvbnN0IFZBTElEX1BBUlRfRklFTERTID0gW1xyXG4gICAgJ3RleHQnLFxyXG4gICAgJ2lubGluZURhdGEnLFxyXG4gICAgJ2Z1bmN0aW9uQ2FsbCcsXHJcbiAgICAnZnVuY3Rpb25SZXNwb25zZSdcclxuXTtcclxuY29uc3QgVkFMSURfUEFSVFNfUEVSX1JPTEUgPSB7XHJcbiAgICB1c2VyOiBbJ3RleHQnLCAnaW5saW5lRGF0YSddLFxyXG4gICAgZnVuY3Rpb246IFsnZnVuY3Rpb25SZXNwb25zZSddLFxyXG4gICAgbW9kZWw6IFsndGV4dCcsICdmdW5jdGlvbkNhbGwnXSxcclxuICAgIC8vIFN5c3RlbSBpbnN0cnVjdGlvbnMgc2hvdWxkbid0IGJlIGluIGhpc3RvcnkgYW55d2F5LlxyXG4gICAgc3lzdGVtOiBbJ3RleHQnXVxyXG59O1xyXG5jb25zdCBWQUxJRF9QUkVWSU9VU19DT05URU5UX1JPTEVTID0ge1xyXG4gICAgdXNlcjogWydtb2RlbCddLFxyXG4gICAgZnVuY3Rpb246IFsnbW9kZWwnXSxcclxuICAgIG1vZGVsOiBbJ3VzZXInLCAnZnVuY3Rpb24nXSxcclxuICAgIC8vIFN5c3RlbSBpbnN0cnVjdGlvbnMgc2hvdWxkbid0IGJlIGluIGhpc3RvcnkuXHJcbiAgICBzeXN0ZW06IFtdXHJcbn07XHJcbmZ1bmN0aW9uIHZhbGlkYXRlQ2hhdEhpc3RvcnkoaGlzdG9yeSkge1xyXG4gICAgbGV0IHByZXZDb250ZW50ID0gbnVsbDtcclxuICAgIGZvciAoY29uc3QgY3VyckNvbnRlbnQgb2YgaGlzdG9yeSkge1xyXG4gICAgICAgIGNvbnN0IHsgcm9sZSwgcGFydHMgfSA9IGN1cnJDb250ZW50O1xyXG4gICAgICAgIGlmICghcHJldkNvbnRlbnQgJiYgcm9sZSAhPT0gJ3VzZXInKSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBWZXJ0ZXhBSUVycm9yKFwiaW52YWxpZC1jb250ZW50XCIgLyogVmVydGV4QUlFcnJvckNvZGUuSU5WQUxJRF9DT05URU5UICovLCBgRmlyc3QgQ29udGVudCBzaG91bGQgYmUgd2l0aCByb2xlICd1c2VyJywgZ290ICR7cm9sZX1gKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKCFQT1NTSUJMRV9ST0xFUy5pbmNsdWRlcyhyb2xlKSkge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgVmVydGV4QUlFcnJvcihcImludmFsaWQtY29udGVudFwiIC8qIFZlcnRleEFJRXJyb3JDb2RlLklOVkFMSURfQ09OVEVOVCAqLywgYEVhY2ggaXRlbSBzaG91bGQgaW5jbHVkZSByb2xlIGZpZWxkLiBHb3QgJHtyb2xlfSBidXQgdmFsaWQgcm9sZXMgYXJlOiAke0pTT04uc3RyaW5naWZ5KFBPU1NJQkxFX1JPTEVTKX1gKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKCFBcnJheS5pc0FycmF5KHBhcnRzKSkge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgVmVydGV4QUlFcnJvcihcImludmFsaWQtY29udGVudFwiIC8qIFZlcnRleEFJRXJyb3JDb2RlLklOVkFMSURfQ09OVEVOVCAqLywgYENvbnRlbnQgc2hvdWxkIGhhdmUgJ3BhcnRzJyBidXQgcHJvcGVydHkgd2l0aCBhbiBhcnJheSBvZiBQYXJ0c2ApO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAocGFydHMubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBWZXJ0ZXhBSUVycm9yKFwiaW52YWxpZC1jb250ZW50XCIgLyogVmVydGV4QUlFcnJvckNvZGUuSU5WQUxJRF9DT05URU5UICovLCBgRWFjaCBDb250ZW50IHNob3VsZCBoYXZlIGF0IGxlYXN0IG9uZSBwYXJ0YCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNvbnN0IGNvdW50RmllbGRzID0ge1xyXG4gICAgICAgICAgICB0ZXh0OiAwLFxyXG4gICAgICAgICAgICBpbmxpbmVEYXRhOiAwLFxyXG4gICAgICAgICAgICBmdW5jdGlvbkNhbGw6IDAsXHJcbiAgICAgICAgICAgIGZ1bmN0aW9uUmVzcG9uc2U6IDBcclxuICAgICAgICB9O1xyXG4gICAgICAgIGZvciAoY29uc3QgcGFydCBvZiBwYXJ0cykge1xyXG4gICAgICAgICAgICBmb3IgKGNvbnN0IGtleSBvZiBWQUxJRF9QQVJUX0ZJRUxEUykge1xyXG4gICAgICAgICAgICAgICAgaWYgKGtleSBpbiBwYXJ0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY291bnRGaWVsZHNba2V5XSArPSAxO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNvbnN0IHZhbGlkUGFydHMgPSBWQUxJRF9QQVJUU19QRVJfUk9MRVtyb2xlXTtcclxuICAgICAgICBmb3IgKGNvbnN0IGtleSBvZiBWQUxJRF9QQVJUX0ZJRUxEUykge1xyXG4gICAgICAgICAgICBpZiAoIXZhbGlkUGFydHMuaW5jbHVkZXMoa2V5KSAmJiBjb3VudEZpZWxkc1trZXldID4gMCkge1xyXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IFZlcnRleEFJRXJyb3IoXCJpbnZhbGlkLWNvbnRlbnRcIiAvKiBWZXJ0ZXhBSUVycm9yQ29kZS5JTlZBTElEX0NPTlRFTlQgKi8sIGBDb250ZW50IHdpdGggcm9sZSAnJHtyb2xlfScgY2FuJ3QgY29udGFpbiAnJHtrZXl9JyBwYXJ0YCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHByZXZDb250ZW50KSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHZhbGlkUHJldmlvdXNDb250ZW50Um9sZXMgPSBWQUxJRF9QUkVWSU9VU19DT05URU5UX1JPTEVTW3JvbGVdO1xyXG4gICAgICAgICAgICBpZiAoIXZhbGlkUHJldmlvdXNDb250ZW50Um9sZXMuaW5jbHVkZXMocHJldkNvbnRlbnQucm9sZSkpIHtcclxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBWZXJ0ZXhBSUVycm9yKFwiaW52YWxpZC1jb250ZW50XCIgLyogVmVydGV4QUlFcnJvckNvZGUuSU5WQUxJRF9DT05URU5UICovLCBgQ29udGVudCB3aXRoIHJvbGUgJyR7cm9sZX0gY2FuJ3QgZm9sbG93ICcke3ByZXZDb250ZW50LnJvbGV9Jy4gVmFsaWQgcHJldmlvdXMgcm9sZXM6ICR7SlNPTi5zdHJpbmdpZnkoVkFMSURfUFJFVklPVVNfQ09OVEVOVF9ST0xFUyl9YCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcHJldkNvbnRlbnQgPSBjdXJyQ29udGVudDtcclxuICAgIH1cclxufVxuXG4vKipcclxuICogQGxpY2Vuc2VcclxuICogQ29weXJpZ2h0IDIwMjQgR29vZ2xlIExMQ1xyXG4gKlxyXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xyXG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXHJcbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxyXG4gKlxyXG4gKiAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxyXG4gKlxyXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXHJcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcclxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXHJcbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcclxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXHJcbiAqL1xyXG4vKipcclxuICogRG8gbm90IGxvZyBhIG1lc3NhZ2UgZm9yIHRoaXMgZXJyb3IuXHJcbiAqL1xyXG5jb25zdCBTSUxFTlRfRVJST1IgPSAnU0lMRU5UX0VSUk9SJztcclxuLyoqXHJcbiAqIENoYXRTZXNzaW9uIGNsYXNzIHRoYXQgZW5hYmxlcyBzZW5kaW5nIGNoYXQgbWVzc2FnZXMgYW5kIHN0b3Jlc1xyXG4gKiBoaXN0b3J5IG9mIHNlbnQgYW5kIHJlY2VpdmVkIG1lc3NhZ2VzIHNvIGZhci5cclxuICpcclxuICogQHB1YmxpY1xyXG4gKi9cclxuY2xhc3MgQ2hhdFNlc3Npb24ge1xyXG4gICAgY29uc3RydWN0b3IoYXBpU2V0dGluZ3MsIG1vZGVsLCBwYXJhbXMsIHJlcXVlc3RPcHRpb25zKSB7XHJcbiAgICAgICAgdGhpcy5tb2RlbCA9IG1vZGVsO1xyXG4gICAgICAgIHRoaXMucGFyYW1zID0gcGFyYW1zO1xyXG4gICAgICAgIHRoaXMucmVxdWVzdE9wdGlvbnMgPSByZXF1ZXN0T3B0aW9ucztcclxuICAgICAgICB0aGlzLl9oaXN0b3J5ID0gW107XHJcbiAgICAgICAgdGhpcy5fc2VuZFByb21pc2UgPSBQcm9taXNlLnJlc29sdmUoKTtcclxuICAgICAgICB0aGlzLl9hcGlTZXR0aW5ncyA9IGFwaVNldHRpbmdzO1xyXG4gICAgICAgIGlmIChwYXJhbXMgPT09IG51bGwgfHwgcGFyYW1zID09PSB2b2lkIDAgPyB2b2lkIDAgOiBwYXJhbXMuaGlzdG9yeSkge1xyXG4gICAgICAgICAgICB2YWxpZGF0ZUNoYXRIaXN0b3J5KHBhcmFtcy5oaXN0b3J5KTtcclxuICAgICAgICAgICAgdGhpcy5faGlzdG9yeSA9IHBhcmFtcy5oaXN0b3J5O1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICogR2V0cyB0aGUgY2hhdCBoaXN0b3J5IHNvIGZhci4gQmxvY2tlZCBwcm9tcHRzIGFyZSBub3QgYWRkZWQgdG8gaGlzdG9yeS5cclxuICAgICAqIEJsb2NrZWQgY2FuZGlkYXRlcyBhcmUgbm90IGFkZGVkIHRvIGhpc3RvcnksIG5vciBhcmUgdGhlIHByb21wdHMgdGhhdFxyXG4gICAgICogZ2VuZXJhdGVkIHRoZW0uXHJcbiAgICAgKi9cclxuICAgIGFzeW5jIGdldEhpc3RvcnkoKSB7XHJcbiAgICAgICAgYXdhaXQgdGhpcy5fc2VuZFByb21pc2U7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2hpc3Rvcnk7XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIFNlbmRzIGEgY2hhdCBtZXNzYWdlIGFuZCByZWNlaXZlcyBhIG5vbi1zdHJlYW1pbmdcclxuICAgICAqIHtAbGluayBHZW5lcmF0ZUNvbnRlbnRSZXN1bHR9XHJcbiAgICAgKi9cclxuICAgIGFzeW5jIHNlbmRNZXNzYWdlKHJlcXVlc3QpIHtcclxuICAgICAgICB2YXIgX2EsIF9iLCBfYywgX2QsIF9lO1xyXG4gICAgICAgIGF3YWl0IHRoaXMuX3NlbmRQcm9taXNlO1xyXG4gICAgICAgIGNvbnN0IG5ld0NvbnRlbnQgPSBmb3JtYXROZXdDb250ZW50KHJlcXVlc3QpO1xyXG4gICAgICAgIGNvbnN0IGdlbmVyYXRlQ29udGVudFJlcXVlc3QgPSB7XHJcbiAgICAgICAgICAgIHNhZmV0eVNldHRpbmdzOiAoX2EgPSB0aGlzLnBhcmFtcykgPT09IG51bGwgfHwgX2EgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9hLnNhZmV0eVNldHRpbmdzLFxyXG4gICAgICAgICAgICBnZW5lcmF0aW9uQ29uZmlnOiAoX2IgPSB0aGlzLnBhcmFtcykgPT09IG51bGwgfHwgX2IgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9iLmdlbmVyYXRpb25Db25maWcsXHJcbiAgICAgICAgICAgIHRvb2xzOiAoX2MgPSB0aGlzLnBhcmFtcykgPT09IG51bGwgfHwgX2MgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9jLnRvb2xzLFxyXG4gICAgICAgICAgICB0b29sQ29uZmlnOiAoX2QgPSB0aGlzLnBhcmFtcykgPT09IG51bGwgfHwgX2QgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9kLnRvb2xDb25maWcsXHJcbiAgICAgICAgICAgIHN5c3RlbUluc3RydWN0aW9uOiAoX2UgPSB0aGlzLnBhcmFtcykgPT09IG51bGwgfHwgX2UgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9lLnN5c3RlbUluc3RydWN0aW9uLFxyXG4gICAgICAgICAgICBjb250ZW50czogWy4uLnRoaXMuX2hpc3RvcnksIG5ld0NvbnRlbnRdXHJcbiAgICAgICAgfTtcclxuICAgICAgICBsZXQgZmluYWxSZXN1bHQgPSB7fTtcclxuICAgICAgICAvLyBBZGQgb250byB0aGUgY2hhaW4uXHJcbiAgICAgICAgdGhpcy5fc2VuZFByb21pc2UgPSB0aGlzLl9zZW5kUHJvbWlzZVxyXG4gICAgICAgICAgICAudGhlbigoKSA9PiBnZW5lcmF0ZUNvbnRlbnQodGhpcy5fYXBpU2V0dGluZ3MsIHRoaXMubW9kZWwsIGdlbmVyYXRlQ29udGVudFJlcXVlc3QsIHRoaXMucmVxdWVzdE9wdGlvbnMpKVxyXG4gICAgICAgICAgICAudGhlbihyZXN1bHQgPT4ge1xyXG4gICAgICAgICAgICB2YXIgX2EsIF9iO1xyXG4gICAgICAgICAgICBpZiAocmVzdWx0LnJlc3BvbnNlLmNhbmRpZGF0ZXMgJiZcclxuICAgICAgICAgICAgICAgIHJlc3VsdC5yZXNwb25zZS5jYW5kaWRhdGVzLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2hpc3RvcnkucHVzaChuZXdDb250ZW50KTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHJlc3BvbnNlQ29udGVudCA9IHtcclxuICAgICAgICAgICAgICAgICAgICBwYXJ0czogKChfYSA9IHJlc3VsdC5yZXNwb25zZS5jYW5kaWRhdGVzKSA9PT0gbnVsbCB8fCBfYSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2FbMF0uY29udGVudC5wYXJ0cykgfHwgW10sXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gUmVzcG9uc2Ugc2VlbXMgdG8gY29tZSBiYWNrIHdpdGhvdXQgYSByb2xlIHNldC5cclxuICAgICAgICAgICAgICAgICAgICByb2xlOiAoKF9iID0gcmVzdWx0LnJlc3BvbnNlLmNhbmRpZGF0ZXMpID09PSBudWxsIHx8IF9iID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYlswXS5jb250ZW50LnJvbGUpIHx8ICdtb2RlbCdcclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9oaXN0b3J5LnB1c2gocmVzcG9uc2VDb250ZW50KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGJsb2NrRXJyb3JNZXNzYWdlID0gZm9ybWF0QmxvY2tFcnJvck1lc3NhZ2UocmVzdWx0LnJlc3BvbnNlKTtcclxuICAgICAgICAgICAgICAgIGlmIChibG9ja0Vycm9yTWVzc2FnZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUud2Fybihgc2VuZE1lc3NhZ2UoKSB3YXMgdW5zdWNjZXNzZnVsLiAke2Jsb2NrRXJyb3JNZXNzYWdlfS4gSW5zcGVjdCByZXNwb25zZSBvYmplY3QgZm9yIGRldGFpbHMuYCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZmluYWxSZXN1bHQgPSByZXN1bHQ7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgYXdhaXQgdGhpcy5fc2VuZFByb21pc2U7XHJcbiAgICAgICAgcmV0dXJuIGZpbmFsUmVzdWx0O1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiBTZW5kcyBhIGNoYXQgbWVzc2FnZSBhbmQgcmVjZWl2ZXMgdGhlIHJlc3BvbnNlIGFzIGFcclxuICAgICAqIHtAbGluayBHZW5lcmF0ZUNvbnRlbnRTdHJlYW1SZXN1bHR9IGNvbnRhaW5pbmcgYW4gaXRlcmFibGUgc3RyZWFtXHJcbiAgICAgKiBhbmQgYSByZXNwb25zZSBwcm9taXNlLlxyXG4gICAgICovXHJcbiAgICBhc3luYyBzZW5kTWVzc2FnZVN0cmVhbShyZXF1ZXN0KSB7XHJcbiAgICAgICAgdmFyIF9hLCBfYiwgX2MsIF9kLCBfZTtcclxuICAgICAgICBhd2FpdCB0aGlzLl9zZW5kUHJvbWlzZTtcclxuICAgICAgICBjb25zdCBuZXdDb250ZW50ID0gZm9ybWF0TmV3Q29udGVudChyZXF1ZXN0KTtcclxuICAgICAgICBjb25zdCBnZW5lcmF0ZUNvbnRlbnRSZXF1ZXN0ID0ge1xyXG4gICAgICAgICAgICBzYWZldHlTZXR0aW5nczogKF9hID0gdGhpcy5wYXJhbXMpID09PSBudWxsIHx8IF9hID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYS5zYWZldHlTZXR0aW5ncyxcclxuICAgICAgICAgICAgZ2VuZXJhdGlvbkNvbmZpZzogKF9iID0gdGhpcy5wYXJhbXMpID09PSBudWxsIHx8IF9iID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYi5nZW5lcmF0aW9uQ29uZmlnLFxyXG4gICAgICAgICAgICB0b29sczogKF9jID0gdGhpcy5wYXJhbXMpID09PSBudWxsIHx8IF9jID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYy50b29scyxcclxuICAgICAgICAgICAgdG9vbENvbmZpZzogKF9kID0gdGhpcy5wYXJhbXMpID09PSBudWxsIHx8IF9kID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfZC50b29sQ29uZmlnLFxyXG4gICAgICAgICAgICBzeXN0ZW1JbnN0cnVjdGlvbjogKF9lID0gdGhpcy5wYXJhbXMpID09PSBudWxsIHx8IF9lID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfZS5zeXN0ZW1JbnN0cnVjdGlvbixcclxuICAgICAgICAgICAgY29udGVudHM6IFsuLi50aGlzLl9oaXN0b3J5LCBuZXdDb250ZW50XVxyXG4gICAgICAgIH07XHJcbiAgICAgICAgY29uc3Qgc3RyZWFtUHJvbWlzZSA9IGdlbmVyYXRlQ29udGVudFN0cmVhbSh0aGlzLl9hcGlTZXR0aW5ncywgdGhpcy5tb2RlbCwgZ2VuZXJhdGVDb250ZW50UmVxdWVzdCwgdGhpcy5yZXF1ZXN0T3B0aW9ucyk7XHJcbiAgICAgICAgLy8gQWRkIG9udG8gdGhlIGNoYWluLlxyXG4gICAgICAgIHRoaXMuX3NlbmRQcm9taXNlID0gdGhpcy5fc2VuZFByb21pc2VcclxuICAgICAgICAgICAgLnRoZW4oKCkgPT4gc3RyZWFtUHJvbWlzZSlcclxuICAgICAgICAgICAgLy8gVGhpcyBtdXN0IGJlIGhhbmRsZWQgdG8gYXZvaWQgdW5oYW5kbGVkIHJlamVjdGlvbiwgYnV0IGp1bXBcclxuICAgICAgICAgICAgLy8gdG8gdGhlIGZpbmFsIGNhdGNoIGJsb2NrIHdpdGggYSBsYWJlbCB0byBub3QgbG9nIHRoaXMgZXJyb3IuXHJcbiAgICAgICAgICAgIC5jYXRjaChfaWdub3JlZCA9PiB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihTSUxFTlRfRVJST1IpO1xyXG4gICAgICAgIH0pXHJcbiAgICAgICAgICAgIC50aGVuKHN0cmVhbVJlc3VsdCA9PiBzdHJlYW1SZXN1bHQucmVzcG9uc2UpXHJcbiAgICAgICAgICAgIC50aGVuKHJlc3BvbnNlID0+IHtcclxuICAgICAgICAgICAgaWYgKHJlc3BvbnNlLmNhbmRpZGF0ZXMgJiYgcmVzcG9uc2UuY2FuZGlkYXRlcy5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9oaXN0b3J5LnB1c2gobmV3Q29udGVudCk7XHJcbiAgICAgICAgICAgICAgICBjb25zdCByZXNwb25zZUNvbnRlbnQgPSBPYmplY3QuYXNzaWduKHt9LCByZXNwb25zZS5jYW5kaWRhdGVzWzBdLmNvbnRlbnQpO1xyXG4gICAgICAgICAgICAgICAgLy8gUmVzcG9uc2Ugc2VlbXMgdG8gY29tZSBiYWNrIHdpdGhvdXQgYSByb2xlIHNldC5cclxuICAgICAgICAgICAgICAgIGlmICghcmVzcG9uc2VDb250ZW50LnJvbGUpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXNwb25zZUNvbnRlbnQucm9sZSA9ICdtb2RlbCc7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9oaXN0b3J5LnB1c2gocmVzcG9uc2VDb250ZW50KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGJsb2NrRXJyb3JNZXNzYWdlID0gZm9ybWF0QmxvY2tFcnJvck1lc3NhZ2UocmVzcG9uc2UpO1xyXG4gICAgICAgICAgICAgICAgaWYgKGJsb2NrRXJyb3JNZXNzYWdlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS53YXJuKGBzZW5kTWVzc2FnZVN0cmVhbSgpIHdhcyB1bnN1Y2Nlc3NmdWwuICR7YmxvY2tFcnJvck1lc3NhZ2V9LiBJbnNwZWN0IHJlc3BvbnNlIG9iamVjdCBmb3IgZGV0YWlscy5gKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pXHJcbiAgICAgICAgICAgIC5jYXRjaChlID0+IHtcclxuICAgICAgICAgICAgLy8gRXJyb3JzIGluIHN0cmVhbVByb21pc2UgYXJlIGFscmVhZHkgY2F0Y2hhYmxlIGJ5IHRoZSB1c2VyIGFzXHJcbiAgICAgICAgICAgIC8vIHN0cmVhbVByb21pc2UgaXMgcmV0dXJuZWQuXHJcbiAgICAgICAgICAgIC8vIEF2b2lkIGR1cGxpY2F0aW5nIHRoZSBlcnJvciBtZXNzYWdlIGluIGxvZ3MuXHJcbiAgICAgICAgICAgIGlmIChlLm1lc3NhZ2UgIT09IFNJTEVOVF9FUlJPUikge1xyXG4gICAgICAgICAgICAgICAgLy8gVXNlcnMgZG8gbm90IGhhdmUgYWNjZXNzIHRvIF9zZW5kUHJvbWlzZSB0byBjYXRjaCBlcnJvcnNcclxuICAgICAgICAgICAgICAgIC8vIGRvd25zdHJlYW0gZnJvbSBzdHJlYW1Qcm9taXNlLCBzbyB0aGV5IHNob3VsZCBub3QgdGhyb3cuXHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKGUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgcmV0dXJuIHN0cmVhbVByb21pc2U7XHJcbiAgICB9XHJcbn1cblxuLyoqXHJcbiAqIEBsaWNlbnNlXHJcbiAqIENvcHlyaWdodCAyMDI0IEdvb2dsZSBMTENcclxuICpcclxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcclxuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxyXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcclxuICpcclxuICogICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcclxuICpcclxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxyXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXHJcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxyXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXHJcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxyXG4gKi9cclxuYXN5bmMgZnVuY3Rpb24gY291bnRUb2tlbnMoYXBpU2V0dGluZ3MsIG1vZGVsLCBwYXJhbXMsIHJlcXVlc3RPcHRpb25zKSB7XHJcbiAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IG1ha2VSZXF1ZXN0KG1vZGVsLCBUYXNrLkNPVU5UX1RPS0VOUywgYXBpU2V0dGluZ3MsIGZhbHNlLCBKU09OLnN0cmluZ2lmeShwYXJhbXMpLCByZXF1ZXN0T3B0aW9ucyk7XHJcbiAgICByZXR1cm4gcmVzcG9uc2UuanNvbigpO1xyXG59XG5cbi8qKlxyXG4gKiBAbGljZW5zZVxyXG4gKiBDb3B5cmlnaHQgMjAyNCBHb29nbGUgTExDXHJcbiAqXHJcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XHJcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cclxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XHJcbiAqXHJcbiAqICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXHJcbiAqXHJcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcclxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxyXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cclxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxyXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cclxuICovXHJcbi8qKlxyXG4gKiBDbGFzcyBmb3IgZ2VuZXJhdGl2ZSBtb2RlbCBBUElzLlxyXG4gKiBAcHVibGljXHJcbiAqL1xyXG5jbGFzcyBHZW5lcmF0aXZlTW9kZWwge1xyXG4gICAgY29uc3RydWN0b3IodmVydGV4QUksIG1vZGVsUGFyYW1zLCByZXF1ZXN0T3B0aW9ucykge1xyXG4gICAgICAgIHZhciBfYSwgX2IsIF9jLCBfZDtcclxuICAgICAgICBpZiAoISgoX2IgPSAoX2EgPSB2ZXJ0ZXhBSS5hcHApID09PSBudWxsIHx8IF9hID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYS5vcHRpb25zKSA9PT0gbnVsbCB8fCBfYiA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2IuYXBpS2V5KSkge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgVmVydGV4QUlFcnJvcihcIm5vLWFwaS1rZXlcIiAvKiBWZXJ0ZXhBSUVycm9yQ29kZS5OT19BUElfS0VZICovLCBgVGhlIFwiYXBpS2V5XCIgZmllbGQgaXMgZW1wdHkgaW4gdGhlIGxvY2FsIEZpcmViYXNlIGNvbmZpZy4gRmlyZWJhc2UgVmVydGV4QUkgcmVxdWlyZXMgdGhpcyBmaWVsZCB0byBjb250YWluIGEgdmFsaWQgQVBJIGtleS5gKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAoISgoX2QgPSAoX2MgPSB2ZXJ0ZXhBSS5hcHApID09PSBudWxsIHx8IF9jID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYy5vcHRpb25zKSA9PT0gbnVsbCB8fCBfZCA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2QucHJvamVjdElkKSkge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgVmVydGV4QUlFcnJvcihcIm5vLXByb2plY3QtaWRcIiAvKiBWZXJ0ZXhBSUVycm9yQ29kZS5OT19QUk9KRUNUX0lEICovLCBgVGhlIFwicHJvamVjdElkXCIgZmllbGQgaXMgZW1wdHkgaW4gdGhlIGxvY2FsIEZpcmViYXNlIGNvbmZpZy4gRmlyZWJhc2UgVmVydGV4QUkgcmVxdWlyZXMgdGhpcyBmaWVsZCB0byBjb250YWluIGEgdmFsaWQgcHJvamVjdCBJRC5gKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2FwaVNldHRpbmdzID0ge1xyXG4gICAgICAgICAgICAgICAgYXBpS2V5OiB2ZXJ0ZXhBSS5hcHAub3B0aW9ucy5hcGlLZXksXHJcbiAgICAgICAgICAgICAgICBwcm9qZWN0OiB2ZXJ0ZXhBSS5hcHAub3B0aW9ucy5wcm9qZWN0SWQsXHJcbiAgICAgICAgICAgICAgICBsb2NhdGlvbjogdmVydGV4QUkubG9jYXRpb25cclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgaWYgKHZlcnRleEFJLmFwcENoZWNrKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9hcGlTZXR0aW5ncy5nZXRBcHBDaGVja1Rva2VuID0gKCkgPT4gdmVydGV4QUkuYXBwQ2hlY2suZ2V0VG9rZW4oKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAodmVydGV4QUkuYXV0aCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fYXBpU2V0dGluZ3MuZ2V0QXV0aFRva2VuID0gKCkgPT4gdmVydGV4QUkuYXV0aC5nZXRUb2tlbigpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChtb2RlbFBhcmFtcy5tb2RlbC5pbmNsdWRlcygnLycpKSB7XHJcbiAgICAgICAgICAgIGlmIChtb2RlbFBhcmFtcy5tb2RlbC5zdGFydHNXaXRoKCdtb2RlbHMvJykpIHtcclxuICAgICAgICAgICAgICAgIC8vIEFkZCBcInB1Ymxpc2hlcnMvZ29vZ2xlXCIgaWYgdGhlIHVzZXIgaXMgb25seSBwYXNzaW5nIGluICdtb2RlbHMvbW9kZWwtbmFtZScuXHJcbiAgICAgICAgICAgICAgICB0aGlzLm1vZGVsID0gYHB1Ymxpc2hlcnMvZ29vZ2xlLyR7bW9kZWxQYXJhbXMubW9kZWx9YDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIC8vIEFueSBvdGhlciBjdXN0b20gZm9ybWF0IChlLmcuIHR1bmVkIG1vZGVscykgbXVzdCBiZSBwYXNzZWQgaW4gY29ycmVjdGx5LlxyXG4gICAgICAgICAgICAgICAgdGhpcy5tb2RlbCA9IG1vZGVsUGFyYW1zLm1vZGVsO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAvLyBJZiBwYXRoIGlzIG5vdCBpbmNsdWRlZCwgYXNzdW1lIGl0J3MgYSBub24tdHVuZWQgbW9kZWwuXHJcbiAgICAgICAgICAgIHRoaXMubW9kZWwgPSBgcHVibGlzaGVycy9nb29nbGUvbW9kZWxzLyR7bW9kZWxQYXJhbXMubW9kZWx9YDtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5nZW5lcmF0aW9uQ29uZmlnID0gbW9kZWxQYXJhbXMuZ2VuZXJhdGlvbkNvbmZpZyB8fCB7fTtcclxuICAgICAgICB0aGlzLnNhZmV0eVNldHRpbmdzID0gbW9kZWxQYXJhbXMuc2FmZXR5U2V0dGluZ3MgfHwgW107XHJcbiAgICAgICAgdGhpcy50b29scyA9IG1vZGVsUGFyYW1zLnRvb2xzO1xyXG4gICAgICAgIHRoaXMudG9vbENvbmZpZyA9IG1vZGVsUGFyYW1zLnRvb2xDb25maWc7XHJcbiAgICAgICAgdGhpcy5zeXN0ZW1JbnN0cnVjdGlvbiA9IGZvcm1hdFN5c3RlbUluc3RydWN0aW9uKG1vZGVsUGFyYW1zLnN5c3RlbUluc3RydWN0aW9uKTtcclxuICAgICAgICB0aGlzLnJlcXVlc3RPcHRpb25zID0gcmVxdWVzdE9wdGlvbnMgfHwge307XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIE1ha2VzIGEgc2luZ2xlIG5vbi1zdHJlYW1pbmcgY2FsbCB0byB0aGUgbW9kZWxcclxuICAgICAqIGFuZCByZXR1cm5zIGFuIG9iamVjdCBjb250YWluaW5nIGEgc2luZ2xlIHtAbGluayBHZW5lcmF0ZUNvbnRlbnRSZXNwb25zZX0uXHJcbiAgICAgKi9cclxuICAgIGFzeW5jIGdlbmVyYXRlQ29udGVudChyZXF1ZXN0KSB7XHJcbiAgICAgICAgY29uc3QgZm9ybWF0dGVkUGFyYW1zID0gZm9ybWF0R2VuZXJhdGVDb250ZW50SW5wdXQocmVxdWVzdCk7XHJcbiAgICAgICAgcmV0dXJuIGdlbmVyYXRlQ29udGVudCh0aGlzLl9hcGlTZXR0aW5ncywgdGhpcy5tb2RlbCwgT2JqZWN0LmFzc2lnbih7IGdlbmVyYXRpb25Db25maWc6IHRoaXMuZ2VuZXJhdGlvbkNvbmZpZywgc2FmZXR5U2V0dGluZ3M6IHRoaXMuc2FmZXR5U2V0dGluZ3MsIHRvb2xzOiB0aGlzLnRvb2xzLCB0b29sQ29uZmlnOiB0aGlzLnRvb2xDb25maWcsIHN5c3RlbUluc3RydWN0aW9uOiB0aGlzLnN5c3RlbUluc3RydWN0aW9uIH0sIGZvcm1hdHRlZFBhcmFtcyksIHRoaXMucmVxdWVzdE9wdGlvbnMpO1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiBNYWtlcyBhIHNpbmdsZSBzdHJlYW1pbmcgY2FsbCB0byB0aGUgbW9kZWxcclxuICAgICAqIGFuZCByZXR1cm5zIGFuIG9iamVjdCBjb250YWluaW5nIGFuIGl0ZXJhYmxlIHN0cmVhbSB0aGF0IGl0ZXJhdGVzXHJcbiAgICAgKiBvdmVyIGFsbCBjaHVua3MgaW4gdGhlIHN0cmVhbWluZyByZXNwb25zZSBhcyB3ZWxsIGFzXHJcbiAgICAgKiBhIHByb21pc2UgdGhhdCByZXR1cm5zIHRoZSBmaW5hbCBhZ2dyZWdhdGVkIHJlc3BvbnNlLlxyXG4gICAgICovXHJcbiAgICBhc3luYyBnZW5lcmF0ZUNvbnRlbnRTdHJlYW0ocmVxdWVzdCkge1xyXG4gICAgICAgIGNvbnN0IGZvcm1hdHRlZFBhcmFtcyA9IGZvcm1hdEdlbmVyYXRlQ29udGVudElucHV0KHJlcXVlc3QpO1xyXG4gICAgICAgIHJldHVybiBnZW5lcmF0ZUNvbnRlbnRTdHJlYW0odGhpcy5fYXBpU2V0dGluZ3MsIHRoaXMubW9kZWwsIE9iamVjdC5hc3NpZ24oeyBnZW5lcmF0aW9uQ29uZmlnOiB0aGlzLmdlbmVyYXRpb25Db25maWcsIHNhZmV0eVNldHRpbmdzOiB0aGlzLnNhZmV0eVNldHRpbmdzLCB0b29sczogdGhpcy50b29scywgdG9vbENvbmZpZzogdGhpcy50b29sQ29uZmlnLCBzeXN0ZW1JbnN0cnVjdGlvbjogdGhpcy5zeXN0ZW1JbnN0cnVjdGlvbiB9LCBmb3JtYXR0ZWRQYXJhbXMpLCB0aGlzLnJlcXVlc3RPcHRpb25zKTtcclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICogR2V0cyBhIG5ldyB7QGxpbmsgQ2hhdFNlc3Npb259IGluc3RhbmNlIHdoaWNoIGNhbiBiZSB1c2VkIGZvclxyXG4gICAgICogbXVsdGktdHVybiBjaGF0cy5cclxuICAgICAqL1xyXG4gICAgc3RhcnRDaGF0KHN0YXJ0Q2hhdFBhcmFtcykge1xyXG4gICAgICAgIHJldHVybiBuZXcgQ2hhdFNlc3Npb24odGhpcy5fYXBpU2V0dGluZ3MsIHRoaXMubW9kZWwsIE9iamVjdC5hc3NpZ24oeyB0b29sczogdGhpcy50b29scywgdG9vbENvbmZpZzogdGhpcy50b29sQ29uZmlnLCBzeXN0ZW1JbnN0cnVjdGlvbjogdGhpcy5zeXN0ZW1JbnN0cnVjdGlvbiB9LCBzdGFydENoYXRQYXJhbXMpLCB0aGlzLnJlcXVlc3RPcHRpb25zKTtcclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICogQ291bnRzIHRoZSB0b2tlbnMgaW4gdGhlIHByb3ZpZGVkIHJlcXVlc3QuXHJcbiAgICAgKi9cclxuICAgIGFzeW5jIGNvdW50VG9rZW5zKHJlcXVlc3QpIHtcclxuICAgICAgICBjb25zdCBmb3JtYXR0ZWRQYXJhbXMgPSBmb3JtYXRHZW5lcmF0ZUNvbnRlbnRJbnB1dChyZXF1ZXN0KTtcclxuICAgICAgICByZXR1cm4gY291bnRUb2tlbnModGhpcy5fYXBpU2V0dGluZ3MsIHRoaXMubW9kZWwsIGZvcm1hdHRlZFBhcmFtcyk7XHJcbiAgICB9XHJcbn1cblxuLyoqXHJcbiAqIEBsaWNlbnNlXHJcbiAqIENvcHlyaWdodCAyMDI0IEdvb2dsZSBMTENcclxuICpcclxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcclxuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxyXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcclxuICpcclxuICogICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcclxuICpcclxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxyXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXHJcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxyXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXHJcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxyXG4gKi9cclxuLyoqXHJcbiAqIFJldHVybnMgYSB7QGxpbmsgVmVydGV4QUl9IGluc3RhbmNlIGZvciB0aGUgZ2l2ZW4gYXBwLlxyXG4gKlxyXG4gKiBAcHVibGljXHJcbiAqXHJcbiAqIEBwYXJhbSBhcHAgLSBUaGUge0BsaW5rIEBmaXJlYmFzZS9hcHAjRmlyZWJhc2VBcHB9IHRvIHVzZS5cclxuICovXHJcbmZ1bmN0aW9uIGdldFZlcnRleEFJKGFwcCA9IGdldEFwcCgpLCBvcHRpb25zKSB7XHJcbiAgICBhcHAgPSBnZXRNb2R1bGFySW5zdGFuY2UoYXBwKTtcclxuICAgIC8vIERlcGVuZGVuY2llc1xyXG4gICAgY29uc3QgdmVydGV4UHJvdmlkZXIgPSBfZ2V0UHJvdmlkZXIoYXBwLCBWRVJURVhfVFlQRSk7XHJcbiAgICByZXR1cm4gdmVydGV4UHJvdmlkZXIuZ2V0SW1tZWRpYXRlKHtcclxuICAgICAgICBpZGVudGlmaWVyOiAob3B0aW9ucyA9PT0gbnVsbCB8fCBvcHRpb25zID09PSB2b2lkIDAgPyB2b2lkIDAgOiBvcHRpb25zLmxvY2F0aW9uKSB8fCBERUZBVUxUX0xPQ0FUSU9OXHJcbiAgICB9KTtcclxufVxyXG4vKipcclxuICogUmV0dXJucyBhIHtAbGluayBHZW5lcmF0aXZlTW9kZWx9IGNsYXNzIHdpdGggbWV0aG9kcyBmb3IgaW5mZXJlbmNlXHJcbiAqIGFuZCBvdGhlciBmdW5jdGlvbmFsaXR5LlxyXG4gKlxyXG4gKiBAcHVibGljXHJcbiAqL1xyXG5mdW5jdGlvbiBnZXRHZW5lcmF0aXZlTW9kZWwodmVydGV4QUksIG1vZGVsUGFyYW1zLCByZXF1ZXN0T3B0aW9ucykge1xyXG4gICAgaWYgKCFtb2RlbFBhcmFtcy5tb2RlbCkge1xyXG4gICAgICAgIHRocm93IG5ldyBWZXJ0ZXhBSUVycm9yKFwibm8tbW9kZWxcIiAvKiBWZXJ0ZXhBSUVycm9yQ29kZS5OT19NT0RFTCAqLywgYE11c3QgcHJvdmlkZSBhIG1vZGVsIG5hbWUuIEV4YW1wbGU6IGdldEdlbmVyYXRpdmVNb2RlbCh7IG1vZGVsOiAnbXktbW9kZWwtbmFtZScgfSlgKTtcclxuICAgIH1cclxuICAgIHJldHVybiBuZXcgR2VuZXJhdGl2ZU1vZGVsKHZlcnRleEFJLCBtb2RlbFBhcmFtcywgcmVxdWVzdE9wdGlvbnMpO1xyXG59XG5cbi8qKlxyXG4gKiBUaGUgVmVydGV4IEFJIEZvciBGaXJlYmFzZSBXZWIgU0RLLlxyXG4gKlxyXG4gKiBAcGFja2FnZURvY3VtZW50YXRpb25cclxuICovXHJcbmZ1bmN0aW9uIHJlZ2lzdGVyVmVydGV4KCkge1xyXG4gICAgX3JlZ2lzdGVyQ29tcG9uZW50KG5ldyBDb21wb25lbnQoVkVSVEVYX1RZUEUsIChjb250YWluZXIsIHsgaW5zdGFuY2VJZGVudGlmaWVyOiBsb2NhdGlvbiB9KSA9PiB7XHJcbiAgICAgICAgLy8gZ2V0SW1tZWRpYXRlIGZvciBGaXJlYmFzZUFwcCB3aWxsIGFsd2F5cyBzdWNjZWVkXHJcbiAgICAgICAgY29uc3QgYXBwID0gY29udGFpbmVyLmdldFByb3ZpZGVyKCdhcHAnKS5nZXRJbW1lZGlhdGUoKTtcclxuICAgICAgICBjb25zdCBhdXRoID0gY29udGFpbmVyLmdldFByb3ZpZGVyKCdhdXRoLWludGVybmFsJyk7XHJcbiAgICAgICAgY29uc3QgYXBwQ2hlY2tQcm92aWRlciA9IGNvbnRhaW5lci5nZXRQcm92aWRlcignYXBwLWNoZWNrLWludGVybmFsJyk7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBWZXJ0ZXhBSVNlcnZpY2UoYXBwLCBhdXRoLCBhcHBDaGVja1Byb3ZpZGVyLCB7IGxvY2F0aW9uIH0pO1xyXG4gICAgfSwgXCJQVUJMSUNcIiAvKiBDb21wb25lbnRUeXBlLlBVQkxJQyAqLykuc2V0TXVsdGlwbGVJbnN0YW5jZXModHJ1ZSkpO1xyXG4gICAgcmVnaXN0ZXJWZXJzaW9uKG5hbWUsIHZlcnNpb24pO1xyXG4gICAgLy8gQlVJTERfVEFSR0VUIHdpbGwgYmUgcmVwbGFjZWQgYnkgdmFsdWVzIGxpa2UgZXNtNSwgZXNtMjAxNywgY2pzNSwgZXRjIGR1cmluZyB0aGUgY29tcGlsYXRpb25cclxuICAgIHJlZ2lzdGVyVmVyc2lvbihuYW1lLCB2ZXJzaW9uLCAnZXNtMjAxNycpO1xyXG59XHJcbnJlZ2lzdGVyVmVydGV4KCk7XG5cbmV4cG9ydCB7IEJsb2NrUmVhc29uLCBDaGF0U2Vzc2lvbiwgRmluaXNoUmVhc29uLCBGdW5jdGlvbkNhbGxpbmdNb2RlLCBGdW5jdGlvbkRlY2xhcmF0aW9uU2NoZW1hVHlwZSwgR2VuZXJhdGl2ZU1vZGVsLCBIYXJtQmxvY2tNZXRob2QsIEhhcm1CbG9ja1RocmVzaG9sZCwgSGFybUNhdGVnb3J5LCBIYXJtUHJvYmFiaWxpdHksIEhhcm1TZXZlcml0eSwgUE9TU0lCTEVfUk9MRVMsIFZlcnRleEFJRXJyb3IsIGdldEdlbmVyYXRpdmVNb2RlbCwgZ2V0VmVydGV4QUkgfTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWluZGV4LmVzbTIwMTcuanMubWFwXG4iLCJpbXBvcnQgeyBfZ2V0UHJvdmlkZXIsIGdldEFwcCwgX3JlZ2lzdGVyQ29tcG9uZW50LCByZWdpc3RlclZlcnNpb24gfSBmcm9tICdAZmlyZWJhc2UvYXBwJztcbmltcG9ydCB7IENvbXBvbmVudCB9IGZyb20gJ0BmaXJlYmFzZS9jb21wb25lbnQnO1xuaW1wb3J0IHsgRGVmZXJyZWQsIEVycm9yRmFjdG9yeSwgaXNJbmRleGVkREJBdmFpbGFibGUsIHV1aWR2NCwgZ2V0R2xvYmFsLCBiYXNlNjQsIGlzc3VlZEF0VGltZSwgY2FsY3VsYXRlQmFja29mZk1pbGxpcywgZ2V0TW9kdWxhckluc3RhbmNlIH0gZnJvbSAnQGZpcmViYXNlL3V0aWwnO1xuaW1wb3J0IHsgTG9nZ2VyIH0gZnJvbSAnQGZpcmViYXNlL2xvZ2dlcic7XG5cbi8qKlxyXG4gKiBAbGljZW5zZVxyXG4gKiBDb3B5cmlnaHQgMjAyMCBHb29nbGUgTExDXHJcbiAqXHJcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XHJcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cclxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XHJcbiAqXHJcbiAqICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXHJcbiAqXHJcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcclxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxyXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cclxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxyXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cclxuICovXHJcbmNvbnN0IEFQUF9DSEVDS19TVEFURVMgPSBuZXcgTWFwKCk7XHJcbmNvbnN0IERFRkFVTFRfU1RBVEUgPSB7XHJcbiAgICBhY3RpdmF0ZWQ6IGZhbHNlLFxyXG4gICAgdG9rZW5PYnNlcnZlcnM6IFtdXHJcbn07XHJcbmNvbnN0IERFQlVHX1NUQVRFID0ge1xyXG4gICAgaW5pdGlhbGl6ZWQ6IGZhbHNlLFxyXG4gICAgZW5hYmxlZDogZmFsc2VcclxufTtcclxuLyoqXHJcbiAqIEdldHMgYSByZWZlcmVuY2UgdG8gdGhlIHN0YXRlIG9iamVjdC5cclxuICovXHJcbmZ1bmN0aW9uIGdldFN0YXRlUmVmZXJlbmNlKGFwcCkge1xyXG4gICAgcmV0dXJuIEFQUF9DSEVDS19TVEFURVMuZ2V0KGFwcCkgfHwgT2JqZWN0LmFzc2lnbih7fSwgREVGQVVMVF9TVEFURSk7XHJcbn1cclxuLyoqXHJcbiAqIFNldCBvbmNlIG9uIGluaXRpYWxpemF0aW9uLiBUaGUgbWFwIHNob3VsZCBob2xkIHRoZSBzYW1lIHJlZmVyZW5jZSB0byB0aGVcclxuICogc2FtZSBvYmplY3QgdW50aWwgdGhpcyBlbnRyeSBpcyBkZWxldGVkLlxyXG4gKi9cclxuZnVuY3Rpb24gc2V0SW5pdGlhbFN0YXRlKGFwcCwgc3RhdGUpIHtcclxuICAgIEFQUF9DSEVDS19TVEFURVMuc2V0KGFwcCwgc3RhdGUpO1xyXG4gICAgcmV0dXJuIEFQUF9DSEVDS19TVEFURVMuZ2V0KGFwcCk7XHJcbn1cclxuZnVuY3Rpb24gZ2V0RGVidWdTdGF0ZSgpIHtcclxuICAgIHJldHVybiBERUJVR19TVEFURTtcclxufVxuXG4vKipcclxuICogQGxpY2Vuc2VcclxuICogQ29weXJpZ2h0IDIwMjAgR29vZ2xlIExMQ1xyXG4gKlxyXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xyXG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXHJcbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxyXG4gKlxyXG4gKiAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxyXG4gKlxyXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXHJcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcclxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXHJcbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcclxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXHJcbiAqL1xyXG5jb25zdCBCQVNFX0VORFBPSU5UID0gJ2h0dHBzOi8vY29udGVudC1maXJlYmFzZWFwcGNoZWNrLmdvb2dsZWFwaXMuY29tL3YxJztcclxuY29uc3QgRVhDSEFOR0VfUkVDQVBUQ0hBX1RPS0VOX01FVEhPRCA9ICdleGNoYW5nZVJlY2FwdGNoYVYzVG9rZW4nO1xyXG5jb25zdCBFWENIQU5HRV9SRUNBUFRDSEFfRU5URVJQUklTRV9UT0tFTl9NRVRIT0QgPSAnZXhjaGFuZ2VSZWNhcHRjaGFFbnRlcnByaXNlVG9rZW4nO1xyXG5jb25zdCBFWENIQU5HRV9ERUJVR19UT0tFTl9NRVRIT0QgPSAnZXhjaGFuZ2VEZWJ1Z1Rva2VuJztcclxuY29uc3QgVE9LRU5fUkVGUkVTSF9USU1FID0ge1xyXG4gICAgLyoqXHJcbiAgICAgKiBUaGUgb2Zmc2V0IHRpbWUgYmVmb3JlIHRva2VuIG5hdHVyYWwgZXhwaXJhdGlvbiB0byBydW4gdGhlIHJlZnJlc2guXHJcbiAgICAgKiBUaGlzIGlzIGN1cnJlbnRseSA1IG1pbnV0ZXMuXHJcbiAgICAgKi9cclxuICAgIE9GRlNFVF9EVVJBVElPTjogNSAqIDYwICogMTAwMCxcclxuICAgIC8qKlxyXG4gICAgICogVGhpcyBpcyB0aGUgZmlyc3QgcmV0cmlhbCB3YWl0IGFmdGVyIGFuIGVycm9yLiBUaGlzIGlzIGN1cnJlbnRseVxyXG4gICAgICogMzAgc2Vjb25kcy5cclxuICAgICAqL1xyXG4gICAgUkVUUklBTF9NSU5fV0FJVDogMzAgKiAxMDAwLFxyXG4gICAgLyoqXHJcbiAgICAgKiBUaGlzIGlzIHRoZSBtYXhpbXVtIHJldHJpYWwgd2FpdCwgY3VycmVudGx5IDE2IG1pbnV0ZXMuXHJcbiAgICAgKi9cclxuICAgIFJFVFJJQUxfTUFYX1dBSVQ6IDE2ICogNjAgKiAxMDAwXHJcbn07XHJcbi8qKlxyXG4gKiBPbmUgZGF5IGluIG1pbGxpcywgZm9yIGNlcnRhaW4gZXJyb3IgY29kZSBiYWNrb2Zmcy5cclxuICovXHJcbmNvbnN0IE9ORV9EQVkgPSAyNCAqIDYwICogNjAgKiAxMDAwO1xuXG4vKipcclxuICogQGxpY2Vuc2VcclxuICogQ29weXJpZ2h0IDIwMjAgR29vZ2xlIExMQ1xyXG4gKlxyXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xyXG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXHJcbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxyXG4gKlxyXG4gKiAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxyXG4gKlxyXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXHJcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcclxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXHJcbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcclxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXHJcbiAqL1xyXG4vKipcclxuICogUG9ydCBmcm9tIGF1dGggcHJvYWN0aXZlcmVmcmVzaC5qc1xyXG4gKlxyXG4gKi9cclxuLy8gVE9ETzogbW92ZSBpdCB0byBAZmlyZWJhc2UvdXRpbD9cclxuLy8gVE9ETzogYWxsb3cgdG8gY29uZmlnIHdoZXRoZXIgcmVmcmVzaCBzaG91bGQgaGFwcGVuIGluIHRoZSBiYWNrZ3JvdW5kXHJcbmNsYXNzIFJlZnJlc2hlciB7XHJcbiAgICBjb25zdHJ1Y3RvcihvcGVyYXRpb24sIHJldHJ5UG9saWN5LCBnZXRXYWl0RHVyYXRpb24sIGxvd2VyQm91bmQsIHVwcGVyQm91bmQpIHtcclxuICAgICAgICB0aGlzLm9wZXJhdGlvbiA9IG9wZXJhdGlvbjtcclxuICAgICAgICB0aGlzLnJldHJ5UG9saWN5ID0gcmV0cnlQb2xpY3k7XHJcbiAgICAgICAgdGhpcy5nZXRXYWl0RHVyYXRpb24gPSBnZXRXYWl0RHVyYXRpb247XHJcbiAgICAgICAgdGhpcy5sb3dlckJvdW5kID0gbG93ZXJCb3VuZDtcclxuICAgICAgICB0aGlzLnVwcGVyQm91bmQgPSB1cHBlckJvdW5kO1xyXG4gICAgICAgIHRoaXMucGVuZGluZyA9IG51bGw7XHJcbiAgICAgICAgdGhpcy5uZXh0RXJyb3JXYWl0SW50ZXJ2YWwgPSBsb3dlckJvdW5kO1xyXG4gICAgICAgIGlmIChsb3dlckJvdW5kID4gdXBwZXJCb3VuZCkge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1Byb2FjdGl2ZSByZWZyZXNoIGxvd2VyIGJvdW5kIGdyZWF0ZXIgdGhhbiB1cHBlciBib3VuZCEnKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBzdGFydCgpIHtcclxuICAgICAgICB0aGlzLm5leHRFcnJvcldhaXRJbnRlcnZhbCA9IHRoaXMubG93ZXJCb3VuZDtcclxuICAgICAgICB0aGlzLnByb2Nlc3ModHJ1ZSkuY2F0Y2goKCkgPT4ge1xyXG4gICAgICAgICAgICAvKiB3ZSBkb24ndCBjYXJlIGFib3V0IHRoZSByZXN1bHQgKi9cclxuICAgICAgICB9KTtcclxuICAgIH1cclxuICAgIHN0b3AoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMucGVuZGluZykge1xyXG4gICAgICAgICAgICB0aGlzLnBlbmRpbmcucmVqZWN0KCdjYW5jZWxsZWQnKTtcclxuICAgICAgICAgICAgdGhpcy5wZW5kaW5nID0gbnVsbDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBpc1J1bm5pbmcoKSB7XHJcbiAgICAgICAgcmV0dXJuICEhdGhpcy5wZW5kaW5nO1xyXG4gICAgfVxyXG4gICAgYXN5bmMgcHJvY2VzcyhoYXNTdWNjZWVkZWQpIHtcclxuICAgICAgICB0aGlzLnN0b3AoKTtcclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICB0aGlzLnBlbmRpbmcgPSBuZXcgRGVmZXJyZWQoKTtcclxuICAgICAgICAgICAgdGhpcy5wZW5kaW5nLnByb21pc2UuY2F0Y2goX2UgPT4ge1xyXG4gICAgICAgICAgICAgICAgLyogaWdub3JlICovXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICBhd2FpdCBzbGVlcCh0aGlzLmdldE5leHRSdW4oaGFzU3VjY2VlZGVkKSk7XHJcbiAgICAgICAgICAgIC8vIFdoeSBkbyB3ZSByZXNvbHZlIGEgcHJvbWlzZSwgdGhlbiBpbW1lZGlhdGUgd2FpdCBmb3IgaXQ/XHJcbiAgICAgICAgICAgIC8vIFdlIGRvIGl0IHRvIG1ha2UgdGhlIHByb21pc2UgY2hhaW4gY2FuY2VsbGFibGUuXHJcbiAgICAgICAgICAgIC8vIFdlIGNhbiBjYWxsIHN0b3AoKSB3aGljaCByZWplY3RzIHRoZSBwcm9taXNlIGJlZm9yZSB0aGUgZm9sbG93aW5nIGxpbmUgZXhlY3V0ZSwgd2hpY2ggbWFrZXNcclxuICAgICAgICAgICAgLy8gdGhlIGNvZGUganVtcCB0byB0aGUgY2F0Y2ggYmxvY2suXHJcbiAgICAgICAgICAgIC8vIFRPRE86IHVuaXQgdGVzdCB0aGlzXHJcbiAgICAgICAgICAgIHRoaXMucGVuZGluZy5yZXNvbHZlKCk7XHJcbiAgICAgICAgICAgIGF3YWl0IHRoaXMucGVuZGluZy5wcm9taXNlO1xyXG4gICAgICAgICAgICB0aGlzLnBlbmRpbmcgPSBuZXcgRGVmZXJyZWQoKTtcclxuICAgICAgICAgICAgdGhpcy5wZW5kaW5nLnByb21pc2UuY2F0Y2goX2UgPT4ge1xyXG4gICAgICAgICAgICAgICAgLyogaWdub3JlICovXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICBhd2FpdCB0aGlzLm9wZXJhdGlvbigpO1xyXG4gICAgICAgICAgICB0aGlzLnBlbmRpbmcucmVzb2x2ZSgpO1xyXG4gICAgICAgICAgICBhd2FpdCB0aGlzLnBlbmRpbmcucHJvbWlzZTtcclxuICAgICAgICAgICAgdGhpcy5wcm9jZXNzKHRydWUpLmNhdGNoKCgpID0+IHtcclxuICAgICAgICAgICAgICAgIC8qIHdlIGRvbid0IGNhcmUgYWJvdXQgdGhlIHJlc3VsdCAqL1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLnJldHJ5UG9saWN5KGVycm9yKSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5wcm9jZXNzKGZhbHNlKS5jYXRjaCgoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgLyogd2UgZG9uJ3QgY2FyZSBhYm91dCB0aGUgcmVzdWx0ICovXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuc3RvcCgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgZ2V0TmV4dFJ1bihoYXNTdWNjZWVkZWQpIHtcclxuICAgICAgICBpZiAoaGFzU3VjY2VlZGVkKSB7XHJcbiAgICAgICAgICAgIC8vIElmIGxhc3Qgb3BlcmF0aW9uIHN1Y2NlZWRlZCwgcmVzZXQgbmV4dCBlcnJvciB3YWl0IGludGVydmFsIGFuZCByZXR1cm5cclxuICAgICAgICAgICAgLy8gdGhlIGRlZmF1bHQgd2FpdCBkdXJhdGlvbi5cclxuICAgICAgICAgICAgdGhpcy5uZXh0RXJyb3JXYWl0SW50ZXJ2YWwgPSB0aGlzLmxvd2VyQm91bmQ7XHJcbiAgICAgICAgICAgIC8vIFJldHVybiB0eXBpY2FsIHdhaXQgZHVyYXRpb24gaW50ZXJ2YWwgYWZ0ZXIgYSBzdWNjZXNzZnVsIG9wZXJhdGlvbi5cclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZ2V0V2FpdER1cmF0aW9uKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAvLyBHZXQgbmV4dCBlcnJvciB3YWl0IGludGVydmFsLlxyXG4gICAgICAgICAgICBjb25zdCBjdXJyZW50RXJyb3JXYWl0SW50ZXJ2YWwgPSB0aGlzLm5leHRFcnJvcldhaXRJbnRlcnZhbDtcclxuICAgICAgICAgICAgLy8gRG91YmxlIGludGVydmFsIGZvciBuZXh0IGNvbnNlY3V0aXZlIGVycm9yLlxyXG4gICAgICAgICAgICB0aGlzLm5leHRFcnJvcldhaXRJbnRlcnZhbCAqPSAyO1xyXG4gICAgICAgICAgICAvLyBNYWtlIHN1cmUgbmV4dCB3YWl0IGludGVydmFsIGRvZXMgbm90IGV4Y2VlZCB0aGUgbWF4aW11bSB1cHBlciBib3VuZC5cclxuICAgICAgICAgICAgaWYgKHRoaXMubmV4dEVycm9yV2FpdEludGVydmFsID4gdGhpcy51cHBlckJvdW5kKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLm5leHRFcnJvcldhaXRJbnRlcnZhbCA9IHRoaXMudXBwZXJCb3VuZDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gY3VycmVudEVycm9yV2FpdEludGVydmFsO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5mdW5jdGlvbiBzbGVlcChtcykge1xyXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKHJlc29sdmUgPT4ge1xyXG4gICAgICAgIHNldFRpbWVvdXQocmVzb2x2ZSwgbXMpO1xyXG4gICAgfSk7XHJcbn1cblxuLyoqXHJcbiAqIEBsaWNlbnNlXHJcbiAqIENvcHlyaWdodCAyMDIwIEdvb2dsZSBMTENcclxuICpcclxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcclxuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxyXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcclxuICpcclxuICogICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcclxuICpcclxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxyXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXHJcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxyXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXHJcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxyXG4gKi9cclxuY29uc3QgRVJST1JTID0ge1xyXG4gICAgW1wiYWxyZWFkeS1pbml0aWFsaXplZFwiIC8qIEFwcENoZWNrRXJyb3IuQUxSRUFEWV9JTklUSUFMSVpFRCAqL106ICdZb3UgaGF2ZSBhbHJlYWR5IGNhbGxlZCBpbml0aWFsaXplQXBwQ2hlY2soKSBmb3IgRmlyZWJhc2VBcHAgeyRhcHBOYW1lfSB3aXRoICcgK1xyXG4gICAgICAgICdkaWZmZXJlbnQgb3B0aW9ucy4gVG8gYXZvaWQgdGhpcyBlcnJvciwgY2FsbCBpbml0aWFsaXplQXBwQ2hlY2soKSB3aXRoIHRoZSAnICtcclxuICAgICAgICAnc2FtZSBvcHRpb25zIGFzIHdoZW4gaXQgd2FzIG9yaWdpbmFsbHkgY2FsbGVkLiBUaGlzIHdpbGwgcmV0dXJuIHRoZSAnICtcclxuICAgICAgICAnYWxyZWFkeSBpbml0aWFsaXplZCBpbnN0YW5jZS4nLFxyXG4gICAgW1widXNlLWJlZm9yZS1hY3RpdmF0aW9uXCIgLyogQXBwQ2hlY2tFcnJvci5VU0VfQkVGT1JFX0FDVElWQVRJT04gKi9dOiAnQXBwIENoZWNrIGlzIGJlaW5nIHVzZWQgYmVmb3JlIGluaXRpYWxpemVBcHBDaGVjaygpIGlzIGNhbGxlZCBmb3IgRmlyZWJhc2VBcHAgeyRhcHBOYW1lfS4gJyArXHJcbiAgICAgICAgJ0NhbGwgaW5pdGlhbGl6ZUFwcENoZWNrKCkgYmVmb3JlIGluc3RhbnRpYXRpbmcgb3RoZXIgRmlyZWJhc2Ugc2VydmljZXMuJyxcclxuICAgIFtcImZldGNoLW5ldHdvcmstZXJyb3JcIiAvKiBBcHBDaGVja0Vycm9yLkZFVENIX05FVFdPUktfRVJST1IgKi9dOiAnRmV0Y2ggZmFpbGVkIHRvIGNvbm5lY3QgdG8gYSBuZXR3b3JrLiBDaGVjayBJbnRlcm5ldCBjb25uZWN0aW9uLiAnICtcclxuICAgICAgICAnT3JpZ2luYWwgZXJyb3I6IHskb3JpZ2luYWxFcnJvck1lc3NhZ2V9LicsXHJcbiAgICBbXCJmZXRjaC1wYXJzZS1lcnJvclwiIC8qIEFwcENoZWNrRXJyb3IuRkVUQ0hfUEFSU0VfRVJST1IgKi9dOiAnRmV0Y2ggY2xpZW50IGNvdWxkIG5vdCBwYXJzZSByZXNwb25zZS4nICtcclxuICAgICAgICAnIE9yaWdpbmFsIGVycm9yOiB7JG9yaWdpbmFsRXJyb3JNZXNzYWdlfS4nLFxyXG4gICAgW1wiZmV0Y2gtc3RhdHVzLWVycm9yXCIgLyogQXBwQ2hlY2tFcnJvci5GRVRDSF9TVEFUVVNfRVJST1IgKi9dOiAnRmV0Y2ggc2VydmVyIHJldHVybmVkIGFuIEhUVFAgZXJyb3Igc3RhdHVzLiBIVFRQIHN0YXR1czogeyRodHRwU3RhdHVzfS4nLFxyXG4gICAgW1wic3RvcmFnZS1vcGVuXCIgLyogQXBwQ2hlY2tFcnJvci5TVE9SQUdFX09QRU4gKi9dOiAnRXJyb3IgdGhyb3duIHdoZW4gb3BlbmluZyBzdG9yYWdlLiBPcmlnaW5hbCBlcnJvcjogeyRvcmlnaW5hbEVycm9yTWVzc2FnZX0uJyxcclxuICAgIFtcInN0b3JhZ2UtZ2V0XCIgLyogQXBwQ2hlY2tFcnJvci5TVE9SQUdFX0dFVCAqL106ICdFcnJvciB0aHJvd24gd2hlbiByZWFkaW5nIGZyb20gc3RvcmFnZS4gT3JpZ2luYWwgZXJyb3I6IHskb3JpZ2luYWxFcnJvck1lc3NhZ2V9LicsXHJcbiAgICBbXCJzdG9yYWdlLXNldFwiIC8qIEFwcENoZWNrRXJyb3IuU1RPUkFHRV9XUklURSAqL106ICdFcnJvciB0aHJvd24gd2hlbiB3cml0aW5nIHRvIHN0b3JhZ2UuIE9yaWdpbmFsIGVycm9yOiB7JG9yaWdpbmFsRXJyb3JNZXNzYWdlfS4nLFxyXG4gICAgW1wicmVjYXB0Y2hhLWVycm9yXCIgLyogQXBwQ2hlY2tFcnJvci5SRUNBUFRDSEFfRVJST1IgKi9dOiAnUmVDQVBUQ0hBIGVycm9yLicsXHJcbiAgICBbXCJ0aHJvdHRsZWRcIiAvKiBBcHBDaGVja0Vycm9yLlRIUk9UVExFRCAqL106IGBSZXF1ZXN0cyB0aHJvdHRsZWQgZHVlIHRvIHskaHR0cFN0YXR1c30gZXJyb3IuIEF0dGVtcHRzIGFsbG93ZWQgYWdhaW4gYWZ0ZXIgeyR0aW1lfWBcclxufTtcclxuY29uc3QgRVJST1JfRkFDVE9SWSA9IG5ldyBFcnJvckZhY3RvcnkoJ2FwcENoZWNrJywgJ0FwcENoZWNrJywgRVJST1JTKTtcblxuLyoqXHJcbiAqIEBsaWNlbnNlXHJcbiAqIENvcHlyaWdodCAyMDIwIEdvb2dsZSBMTENcclxuICpcclxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcclxuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxyXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcclxuICpcclxuICogICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcclxuICpcclxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxyXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXHJcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxyXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXHJcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxyXG4gKi9cclxuZnVuY3Rpb24gZ2V0UmVjYXB0Y2hhKGlzRW50ZXJwcmlzZSA9IGZhbHNlKSB7XHJcbiAgICB2YXIgX2E7XHJcbiAgICBpZiAoaXNFbnRlcnByaXNlKSB7XHJcbiAgICAgICAgcmV0dXJuIChfYSA9IHNlbGYuZ3JlY2FwdGNoYSkgPT09IG51bGwgfHwgX2EgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9hLmVudGVycHJpc2U7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gc2VsZi5ncmVjYXB0Y2hhO1xyXG59XHJcbmZ1bmN0aW9uIGVuc3VyZUFjdGl2YXRlZChhcHApIHtcclxuICAgIGlmICghZ2V0U3RhdGVSZWZlcmVuY2UoYXBwKS5hY3RpdmF0ZWQpIHtcclxuICAgICAgICB0aHJvdyBFUlJPUl9GQUNUT1JZLmNyZWF0ZShcInVzZS1iZWZvcmUtYWN0aXZhdGlvblwiIC8qIEFwcENoZWNrRXJyb3IuVVNFX0JFRk9SRV9BQ1RJVkFUSU9OICovLCB7XHJcbiAgICAgICAgICAgIGFwcE5hbWU6IGFwcC5uYW1lXHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbn1cclxuZnVuY3Rpb24gZ2V0RHVyYXRpb25TdHJpbmcoZHVyYXRpb25Jbk1pbGxpcykge1xyXG4gICAgY29uc3QgdG90YWxTZWNvbmRzID0gTWF0aC5yb3VuZChkdXJhdGlvbkluTWlsbGlzIC8gMTAwMCk7XHJcbiAgICBjb25zdCBkYXlzID0gTWF0aC5mbG9vcih0b3RhbFNlY29uZHMgLyAoMzYwMCAqIDI0KSk7XHJcbiAgICBjb25zdCBob3VycyA9IE1hdGguZmxvb3IoKHRvdGFsU2Vjb25kcyAtIGRheXMgKiAzNjAwICogMjQpIC8gMzYwMCk7XHJcbiAgICBjb25zdCBtaW51dGVzID0gTWF0aC5mbG9vcigodG90YWxTZWNvbmRzIC0gZGF5cyAqIDM2MDAgKiAyNCAtIGhvdXJzICogMzYwMCkgLyA2MCk7XHJcbiAgICBjb25zdCBzZWNvbmRzID0gdG90YWxTZWNvbmRzIC0gZGF5cyAqIDM2MDAgKiAyNCAtIGhvdXJzICogMzYwMCAtIG1pbnV0ZXMgKiA2MDtcclxuICAgIGxldCByZXN1bHQgPSAnJztcclxuICAgIGlmIChkYXlzKSB7XHJcbiAgICAgICAgcmVzdWx0ICs9IHBhZChkYXlzKSArICdkOic7XHJcbiAgICB9XHJcbiAgICBpZiAoaG91cnMpIHtcclxuICAgICAgICByZXN1bHQgKz0gcGFkKGhvdXJzKSArICdoOic7XHJcbiAgICB9XHJcbiAgICByZXN1bHQgKz0gcGFkKG1pbnV0ZXMpICsgJ206JyArIHBhZChzZWNvbmRzKSArICdzJztcclxuICAgIHJldHVybiByZXN1bHQ7XHJcbn1cclxuZnVuY3Rpb24gcGFkKHZhbHVlKSB7XHJcbiAgICBpZiAodmFsdWUgPT09IDApIHtcclxuICAgICAgICByZXR1cm4gJzAwJztcclxuICAgIH1cclxuICAgIHJldHVybiB2YWx1ZSA+PSAxMCA/IHZhbHVlLnRvU3RyaW5nKCkgOiAnMCcgKyB2YWx1ZTtcclxufVxuXG4vKipcclxuICogQGxpY2Vuc2VcclxuICogQ29weXJpZ2h0IDIwMjAgR29vZ2xlIExMQ1xyXG4gKlxyXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xyXG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXHJcbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxyXG4gKlxyXG4gKiAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxyXG4gKlxyXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXHJcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcclxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXHJcbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcclxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXHJcbiAqL1xyXG5hc3luYyBmdW5jdGlvbiBleGNoYW5nZVRva2VuKHsgdXJsLCBib2R5IH0sIGhlYXJ0YmVhdFNlcnZpY2VQcm92aWRlcikge1xyXG4gICAgY29uc3QgaGVhZGVycyA9IHtcclxuICAgICAgICAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nXHJcbiAgICB9O1xyXG4gICAgLy8gSWYgaGVhcnRiZWF0IHNlcnZpY2UgZXhpc3RzLCBhZGQgaGVhcnRiZWF0IGhlYWRlciBzdHJpbmcgdG8gdGhlIGhlYWRlci5cclxuICAgIGNvbnN0IGhlYXJ0YmVhdFNlcnZpY2UgPSBoZWFydGJlYXRTZXJ2aWNlUHJvdmlkZXIuZ2V0SW1tZWRpYXRlKHtcclxuICAgICAgICBvcHRpb25hbDogdHJ1ZVxyXG4gICAgfSk7XHJcbiAgICBpZiAoaGVhcnRiZWF0U2VydmljZSkge1xyXG4gICAgICAgIGNvbnN0IGhlYXJ0YmVhdHNIZWFkZXIgPSBhd2FpdCBoZWFydGJlYXRTZXJ2aWNlLmdldEhlYXJ0YmVhdHNIZWFkZXIoKTtcclxuICAgICAgICBpZiAoaGVhcnRiZWF0c0hlYWRlcikge1xyXG4gICAgICAgICAgICBoZWFkZXJzWydYLUZpcmViYXNlLUNsaWVudCddID0gaGVhcnRiZWF0c0hlYWRlcjtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBjb25zdCBvcHRpb25zID0ge1xyXG4gICAgICAgIG1ldGhvZDogJ1BPU1QnLFxyXG4gICAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KGJvZHkpLFxyXG4gICAgICAgIGhlYWRlcnNcclxuICAgIH07XHJcbiAgICBsZXQgcmVzcG9uc2U7XHJcbiAgICB0cnkge1xyXG4gICAgICAgIHJlc3BvbnNlID0gYXdhaXQgZmV0Y2godXJsLCBvcHRpb25zKTtcclxuICAgIH1cclxuICAgIGNhdGNoIChvcmlnaW5hbEVycm9yKSB7XHJcbiAgICAgICAgdGhyb3cgRVJST1JfRkFDVE9SWS5jcmVhdGUoXCJmZXRjaC1uZXR3b3JrLWVycm9yXCIgLyogQXBwQ2hlY2tFcnJvci5GRVRDSF9ORVRXT1JLX0VSUk9SICovLCB7XHJcbiAgICAgICAgICAgIG9yaWdpbmFsRXJyb3JNZXNzYWdlOiBvcmlnaW5hbEVycm9yID09PSBudWxsIHx8IG9yaWdpbmFsRXJyb3IgPT09IHZvaWQgMCA/IHZvaWQgMCA6IG9yaWdpbmFsRXJyb3IubWVzc2FnZVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgaWYgKHJlc3BvbnNlLnN0YXR1cyAhPT0gMjAwKSB7XHJcbiAgICAgICAgdGhyb3cgRVJST1JfRkFDVE9SWS5jcmVhdGUoXCJmZXRjaC1zdGF0dXMtZXJyb3JcIiAvKiBBcHBDaGVja0Vycm9yLkZFVENIX1NUQVRVU19FUlJPUiAqLywge1xyXG4gICAgICAgICAgICBodHRwU3RhdHVzOiByZXNwb25zZS5zdGF0dXNcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuICAgIGxldCByZXNwb25zZUJvZHk7XHJcbiAgICB0cnkge1xyXG4gICAgICAgIC8vIEpTT04gcGFyc2luZyB0aHJvd3MgU3ludGF4RXJyb3IgaWYgdGhlIHJlc3BvbnNlIGJvZHkgaXNuJ3QgYSBKU09OIHN0cmluZy5cclxuICAgICAgICByZXNwb25zZUJvZHkgPSBhd2FpdCByZXNwb25zZS5qc29uKCk7XHJcbiAgICB9XHJcbiAgICBjYXRjaCAob3JpZ2luYWxFcnJvcikge1xyXG4gICAgICAgIHRocm93IEVSUk9SX0ZBQ1RPUlkuY3JlYXRlKFwiZmV0Y2gtcGFyc2UtZXJyb3JcIiAvKiBBcHBDaGVja0Vycm9yLkZFVENIX1BBUlNFX0VSUk9SICovLCB7XHJcbiAgICAgICAgICAgIG9yaWdpbmFsRXJyb3JNZXNzYWdlOiBvcmlnaW5hbEVycm9yID09PSBudWxsIHx8IG9yaWdpbmFsRXJyb3IgPT09IHZvaWQgMCA/IHZvaWQgMCA6IG9yaWdpbmFsRXJyb3IubWVzc2FnZVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgLy8gUHJvdG9idWYgZHVyYXRpb24gZm9ybWF0LlxyXG4gICAgLy8gaHR0cHM6Ly9kZXZlbG9wZXJzLmdvb2dsZS5jb20vcHJvdG9jb2wtYnVmZmVycy9kb2NzL3JlZmVyZW5jZS9qYXZhL2NvbS9nb29nbGUvcHJvdG9idWYvRHVyYXRpb25cclxuICAgIGNvbnN0IG1hdGNoID0gcmVzcG9uc2VCb2R5LnR0bC5tYXRjaCgvXihbXFxkLl0rKShzKSQvKTtcclxuICAgIGlmICghbWF0Y2ggfHwgIW1hdGNoWzJdIHx8IGlzTmFOKE51bWJlcihtYXRjaFsxXSkpKSB7XHJcbiAgICAgICAgdGhyb3cgRVJST1JfRkFDVE9SWS5jcmVhdGUoXCJmZXRjaC1wYXJzZS1lcnJvclwiIC8qIEFwcENoZWNrRXJyb3IuRkVUQ0hfUEFSU0VfRVJST1IgKi8sIHtcclxuICAgICAgICAgICAgb3JpZ2luYWxFcnJvck1lc3NhZ2U6IGB0dGwgZmllbGQgKHRpbWVUb0xpdmUpIGlzIG5vdCBpbiBzdGFuZGFyZCBQcm90b2J1ZiBEdXJhdGlvbiBgICtcclxuICAgICAgICAgICAgICAgIGBmb3JtYXQ6ICR7cmVzcG9uc2VCb2R5LnR0bH1gXHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICBjb25zdCB0aW1lVG9MaXZlQXNOdW1iZXIgPSBOdW1iZXIobWF0Y2hbMV0pICogMTAwMDtcclxuICAgIGNvbnN0IG5vdyA9IERhdGUubm93KCk7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIHRva2VuOiByZXNwb25zZUJvZHkudG9rZW4sXHJcbiAgICAgICAgZXhwaXJlVGltZU1pbGxpczogbm93ICsgdGltZVRvTGl2ZUFzTnVtYmVyLFxyXG4gICAgICAgIGlzc3VlZEF0VGltZU1pbGxpczogbm93XHJcbiAgICB9O1xyXG59XHJcbmZ1bmN0aW9uIGdldEV4Y2hhbmdlUmVjYXB0Y2hhVjNUb2tlblJlcXVlc3QoYXBwLCByZUNBUFRDSEFUb2tlbikge1xyXG4gICAgY29uc3QgeyBwcm9qZWN0SWQsIGFwcElkLCBhcGlLZXkgfSA9IGFwcC5vcHRpb25zO1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICB1cmw6IGAke0JBU0VfRU5EUE9JTlR9L3Byb2plY3RzLyR7cHJvamVjdElkfS9hcHBzLyR7YXBwSWR9OiR7RVhDSEFOR0VfUkVDQVBUQ0hBX1RPS0VOX01FVEhPRH0/a2V5PSR7YXBpS2V5fWAsXHJcbiAgICAgICAgYm9keToge1xyXG4gICAgICAgICAgICAncmVjYXB0Y2hhX3YzX3Rva2VuJzogcmVDQVBUQ0hBVG9rZW5cclxuICAgICAgICB9XHJcbiAgICB9O1xyXG59XHJcbmZ1bmN0aW9uIGdldEV4Y2hhbmdlUmVjYXB0Y2hhRW50ZXJwcmlzZVRva2VuUmVxdWVzdChhcHAsIHJlQ0FQVENIQVRva2VuKSB7XHJcbiAgICBjb25zdCB7IHByb2plY3RJZCwgYXBwSWQsIGFwaUtleSB9ID0gYXBwLm9wdGlvbnM7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIHVybDogYCR7QkFTRV9FTkRQT0lOVH0vcHJvamVjdHMvJHtwcm9qZWN0SWR9L2FwcHMvJHthcHBJZH06JHtFWENIQU5HRV9SRUNBUFRDSEFfRU5URVJQUklTRV9UT0tFTl9NRVRIT0R9P2tleT0ke2FwaUtleX1gLFxyXG4gICAgICAgIGJvZHk6IHtcclxuICAgICAgICAgICAgJ3JlY2FwdGNoYV9lbnRlcnByaXNlX3Rva2VuJzogcmVDQVBUQ0hBVG9rZW5cclxuICAgICAgICB9XHJcbiAgICB9O1xyXG59XHJcbmZ1bmN0aW9uIGdldEV4Y2hhbmdlRGVidWdUb2tlblJlcXVlc3QoYXBwLCBkZWJ1Z1Rva2VuKSB7XHJcbiAgICBjb25zdCB7IHByb2plY3RJZCwgYXBwSWQsIGFwaUtleSB9ID0gYXBwLm9wdGlvbnM7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIHVybDogYCR7QkFTRV9FTkRQT0lOVH0vcHJvamVjdHMvJHtwcm9qZWN0SWR9L2FwcHMvJHthcHBJZH06JHtFWENIQU5HRV9ERUJVR19UT0tFTl9NRVRIT0R9P2tleT0ke2FwaUtleX1gLFxyXG4gICAgICAgIGJvZHk6IHtcclxuICAgICAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lXHJcbiAgICAgICAgICAgIGRlYnVnX3Rva2VuOiBkZWJ1Z1Rva2VuXHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxufVxuXG4vKipcclxuICogQGxpY2Vuc2VcclxuICogQ29weXJpZ2h0IDIwMjAgR29vZ2xlIExMQ1xyXG4gKlxyXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xyXG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXHJcbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxyXG4gKlxyXG4gKiAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxyXG4gKlxyXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXHJcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcclxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXHJcbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcclxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXHJcbiAqL1xyXG5jb25zdCBEQl9OQU1FID0gJ2ZpcmViYXNlLWFwcC1jaGVjay1kYXRhYmFzZSc7XHJcbmNvbnN0IERCX1ZFUlNJT04gPSAxO1xyXG5jb25zdCBTVE9SRV9OQU1FID0gJ2ZpcmViYXNlLWFwcC1jaGVjay1zdG9yZSc7XHJcbmNvbnN0IERFQlVHX1RPS0VOX0tFWSA9ICdkZWJ1Zy10b2tlbic7XHJcbmxldCBkYlByb21pc2UgPSBudWxsO1xyXG5mdW5jdGlvbiBnZXREQlByb21pc2UoKSB7XHJcbiAgICBpZiAoZGJQcm9taXNlKSB7XHJcbiAgICAgICAgcmV0dXJuIGRiUHJvbWlzZTtcclxuICAgIH1cclxuICAgIGRiUHJvbWlzZSA9IG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICBjb25zdCByZXF1ZXN0ID0gaW5kZXhlZERCLm9wZW4oREJfTkFNRSwgREJfVkVSU0lPTik7XHJcbiAgICAgICAgICAgIHJlcXVlc3Qub25zdWNjZXNzID0gZXZlbnQgPT4ge1xyXG4gICAgICAgICAgICAgICAgcmVzb2x2ZShldmVudC50YXJnZXQucmVzdWx0KTtcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgcmVxdWVzdC5vbmVycm9yID0gZXZlbnQgPT4ge1xyXG4gICAgICAgICAgICAgICAgdmFyIF9hO1xyXG4gICAgICAgICAgICAgICAgcmVqZWN0KEVSUk9SX0ZBQ1RPUlkuY3JlYXRlKFwic3RvcmFnZS1vcGVuXCIgLyogQXBwQ2hlY2tFcnJvci5TVE9SQUdFX09QRU4gKi8sIHtcclxuICAgICAgICAgICAgICAgICAgICBvcmlnaW5hbEVycm9yTWVzc2FnZTogKF9hID0gZXZlbnQudGFyZ2V0LmVycm9yKSA9PT0gbnVsbCB8fCBfYSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2EubWVzc2FnZVxyXG4gICAgICAgICAgICAgICAgfSkpO1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICByZXF1ZXN0Lm9udXBncmFkZW5lZWRlZCA9IGV2ZW50ID0+IHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGRiID0gZXZlbnQudGFyZ2V0LnJlc3VsdDtcclxuICAgICAgICAgICAgICAgIC8vIFdlIGRvbid0IHVzZSAnYnJlYWsnIGluIHRoaXMgc3dpdGNoIHN0YXRlbWVudCwgdGhlIGZhbGwtdGhyb3VnaFxyXG4gICAgICAgICAgICAgICAgLy8gYmVoYXZpb3IgaXMgd2hhdCB3ZSB3YW50LCBiZWNhdXNlIGlmIHRoZXJlIGFyZSBtdWx0aXBsZSB2ZXJzaW9ucyBiZXR3ZWVuXHJcbiAgICAgICAgICAgICAgICAvLyB0aGUgb2xkIHZlcnNpb24gYW5kIHRoZSBjdXJyZW50IHZlcnNpb24sIHdlIHdhbnQgQUxMIHRoZSBtaWdyYXRpb25zXHJcbiAgICAgICAgICAgICAgICAvLyB0aGF0IGNvcnJlc3BvbmQgdG8gdGhvc2UgdmVyc2lvbnMgdG8gcnVuLCBub3Qgb25seSB0aGUgbGFzdCBvbmUuXHJcbiAgICAgICAgICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgZGVmYXVsdC1jYXNlXHJcbiAgICAgICAgICAgICAgICBzd2l0Y2ggKGV2ZW50Lm9sZFZlcnNpb24pIHtcclxuICAgICAgICAgICAgICAgICAgICBjYXNlIDA6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRiLmNyZWF0ZU9iamVjdFN0b3JlKFNUT1JFX05BTUUsIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGtleVBhdGg6ICdjb21wb3NpdGVLZXknXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgIH1cclxuICAgICAgICBjYXRjaCAoZSkge1xyXG4gICAgICAgICAgICByZWplY3QoRVJST1JfRkFDVE9SWS5jcmVhdGUoXCJzdG9yYWdlLW9wZW5cIiAvKiBBcHBDaGVja0Vycm9yLlNUT1JBR0VfT1BFTiAqLywge1xyXG4gICAgICAgICAgICAgICAgb3JpZ2luYWxFcnJvck1lc3NhZ2U6IGUgPT09IG51bGwgfHwgZSA9PT0gdm9pZCAwID8gdm9pZCAwIDogZS5tZXNzYWdlXHJcbiAgICAgICAgICAgIH0pKTtcclxuICAgICAgICB9XHJcbiAgICB9KTtcclxuICAgIHJldHVybiBkYlByb21pc2U7XHJcbn1cclxuZnVuY3Rpb24gcmVhZFRva2VuRnJvbUluZGV4ZWREQihhcHApIHtcclxuICAgIHJldHVybiByZWFkKGNvbXB1dGVLZXkoYXBwKSk7XHJcbn1cclxuZnVuY3Rpb24gd3JpdGVUb2tlblRvSW5kZXhlZERCKGFwcCwgdG9rZW4pIHtcclxuICAgIHJldHVybiB3cml0ZShjb21wdXRlS2V5KGFwcCksIHRva2VuKTtcclxufVxyXG5mdW5jdGlvbiB3cml0ZURlYnVnVG9rZW5Ub0luZGV4ZWREQih0b2tlbikge1xyXG4gICAgcmV0dXJuIHdyaXRlKERFQlVHX1RPS0VOX0tFWSwgdG9rZW4pO1xyXG59XHJcbmZ1bmN0aW9uIHJlYWREZWJ1Z1Rva2VuRnJvbUluZGV4ZWREQigpIHtcclxuICAgIHJldHVybiByZWFkKERFQlVHX1RPS0VOX0tFWSk7XHJcbn1cclxuYXN5bmMgZnVuY3Rpb24gd3JpdGUoa2V5LCB2YWx1ZSkge1xyXG4gICAgY29uc3QgZGIgPSBhd2FpdCBnZXREQlByb21pc2UoKTtcclxuICAgIGNvbnN0IHRyYW5zYWN0aW9uID0gZGIudHJhbnNhY3Rpb24oU1RPUkVfTkFNRSwgJ3JlYWR3cml0ZScpO1xyXG4gICAgY29uc3Qgc3RvcmUgPSB0cmFuc2FjdGlvbi5vYmplY3RTdG9yZShTVE9SRV9OQU1FKTtcclxuICAgIGNvbnN0IHJlcXVlc3QgPSBzdG9yZS5wdXQoe1xyXG4gICAgICAgIGNvbXBvc2l0ZUtleToga2V5LFxyXG4gICAgICAgIHZhbHVlXHJcbiAgICB9KTtcclxuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgICAgcmVxdWVzdC5vbnN1Y2Nlc3MgPSBfZXZlbnQgPT4ge1xyXG4gICAgICAgICAgICByZXNvbHZlKCk7XHJcbiAgICAgICAgfTtcclxuICAgICAgICB0cmFuc2FjdGlvbi5vbmVycm9yID0gZXZlbnQgPT4ge1xyXG4gICAgICAgICAgICB2YXIgX2E7XHJcbiAgICAgICAgICAgIHJlamVjdChFUlJPUl9GQUNUT1JZLmNyZWF0ZShcInN0b3JhZ2Utc2V0XCIgLyogQXBwQ2hlY2tFcnJvci5TVE9SQUdFX1dSSVRFICovLCB7XHJcbiAgICAgICAgICAgICAgICBvcmlnaW5hbEVycm9yTWVzc2FnZTogKF9hID0gZXZlbnQudGFyZ2V0LmVycm9yKSA9PT0gbnVsbCB8fCBfYSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2EubWVzc2FnZVxyXG4gICAgICAgICAgICB9KSk7XHJcbiAgICAgICAgfTtcclxuICAgIH0pO1xyXG59XHJcbmFzeW5jIGZ1bmN0aW9uIHJlYWQoa2V5KSB7XHJcbiAgICBjb25zdCBkYiA9IGF3YWl0IGdldERCUHJvbWlzZSgpO1xyXG4gICAgY29uc3QgdHJhbnNhY3Rpb24gPSBkYi50cmFuc2FjdGlvbihTVE9SRV9OQU1FLCAncmVhZG9ubHknKTtcclxuICAgIGNvbnN0IHN0b3JlID0gdHJhbnNhY3Rpb24ub2JqZWN0U3RvcmUoU1RPUkVfTkFNRSk7XHJcbiAgICBjb25zdCByZXF1ZXN0ID0gc3RvcmUuZ2V0KGtleSk7XHJcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICAgIHJlcXVlc3Qub25zdWNjZXNzID0gZXZlbnQgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCByZXN1bHQgPSBldmVudC50YXJnZXQucmVzdWx0O1xyXG4gICAgICAgICAgICBpZiAocmVzdWx0KSB7XHJcbiAgICAgICAgICAgICAgICByZXNvbHZlKHJlc3VsdC52YWx1ZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICByZXNvbHZlKHVuZGVmaW5lZCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG4gICAgICAgIHRyYW5zYWN0aW9uLm9uZXJyb3IgPSBldmVudCA9PiB7XHJcbiAgICAgICAgICAgIHZhciBfYTtcclxuICAgICAgICAgICAgcmVqZWN0KEVSUk9SX0ZBQ1RPUlkuY3JlYXRlKFwic3RvcmFnZS1nZXRcIiAvKiBBcHBDaGVja0Vycm9yLlNUT1JBR0VfR0VUICovLCB7XHJcbiAgICAgICAgICAgICAgICBvcmlnaW5hbEVycm9yTWVzc2FnZTogKF9hID0gZXZlbnQudGFyZ2V0LmVycm9yKSA9PT0gbnVsbCB8fCBfYSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2EubWVzc2FnZVxyXG4gICAgICAgICAgICB9KSk7XHJcbiAgICAgICAgfTtcclxuICAgIH0pO1xyXG59XHJcbmZ1bmN0aW9uIGNvbXB1dGVLZXkoYXBwKSB7XHJcbiAgICByZXR1cm4gYCR7YXBwLm9wdGlvbnMuYXBwSWR9LSR7YXBwLm5hbWV9YDtcclxufVxuXG4vKipcclxuICogQGxpY2Vuc2VcclxuICogQ29weXJpZ2h0IDIwMjAgR29vZ2xlIExMQ1xyXG4gKlxyXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xyXG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXHJcbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxyXG4gKlxyXG4gKiAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxyXG4gKlxyXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXHJcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcclxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXHJcbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcclxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXHJcbiAqL1xyXG5jb25zdCBsb2dnZXIgPSBuZXcgTG9nZ2VyKCdAZmlyZWJhc2UvYXBwLWNoZWNrJyk7XG5cbi8qKlxyXG4gKiBAbGljZW5zZVxyXG4gKiBDb3B5cmlnaHQgMjAyMCBHb29nbGUgTExDXHJcbiAqXHJcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XHJcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cclxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XHJcbiAqXHJcbiAqICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXHJcbiAqXHJcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcclxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxyXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cclxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxyXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cclxuICovXHJcbi8qKlxyXG4gKiBBbHdheXMgcmVzb2x2ZXMuIEluIGNhc2Ugb2YgYW4gZXJyb3IgcmVhZGluZyBmcm9tIGluZGV4ZWRkYiwgcmVzb2x2ZSB3aXRoIHVuZGVmaW5lZFxyXG4gKi9cclxuYXN5bmMgZnVuY3Rpb24gcmVhZFRva2VuRnJvbVN0b3JhZ2UoYXBwKSB7XHJcbiAgICBpZiAoaXNJbmRleGVkREJBdmFpbGFibGUoKSkge1xyXG4gICAgICAgIGxldCB0b2tlbiA9IHVuZGVmaW5lZDtcclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICB0b2tlbiA9IGF3YWl0IHJlYWRUb2tlbkZyb21JbmRleGVkREIoYXBwKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgY2F0Y2ggKGUpIHtcclxuICAgICAgICAgICAgLy8gc3dhbGxvdyB0aGUgZXJyb3IgYW5kIHJldHVybiB1bmRlZmluZWRcclxuICAgICAgICAgICAgbG9nZ2VyLndhcm4oYEZhaWxlZCB0byByZWFkIHRva2VuIGZyb20gSW5kZXhlZERCLiBFcnJvcjogJHtlfWApO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdG9rZW47XHJcbiAgICB9XHJcbiAgICByZXR1cm4gdW5kZWZpbmVkO1xyXG59XHJcbi8qKlxyXG4gKiBBbHdheXMgcmVzb2x2ZXMuIEluIGNhc2Ugb2YgYW4gZXJyb3Igd3JpdGluZyB0byBpbmRleGVkZGIsIHByaW50IGEgd2FybmluZyBhbmQgcmVzb2x2ZSB0aGUgcHJvbWlzZVxyXG4gKi9cclxuZnVuY3Rpb24gd3JpdGVUb2tlblRvU3RvcmFnZShhcHAsIHRva2VuKSB7XHJcbiAgICBpZiAoaXNJbmRleGVkREJBdmFpbGFibGUoKSkge1xyXG4gICAgICAgIHJldHVybiB3cml0ZVRva2VuVG9JbmRleGVkREIoYXBwLCB0b2tlbikuY2F0Y2goZSA9PiB7XHJcbiAgICAgICAgICAgIC8vIHN3YWxsb3cgdGhlIGVycm9yIGFuZCByZXNvbHZlIHRoZSBwcm9taXNlXHJcbiAgICAgICAgICAgIGxvZ2dlci53YXJuKGBGYWlsZWQgdG8gd3JpdGUgdG9rZW4gdG8gSW5kZXhlZERCLiBFcnJvcjogJHtlfWApO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpO1xyXG59XHJcbmFzeW5jIGZ1bmN0aW9uIHJlYWRPckNyZWF0ZURlYnVnVG9rZW5Gcm9tU3RvcmFnZSgpIHtcclxuICAgIC8qKlxyXG4gICAgICogVGhlb3JldGljYWxseSByYWNlIGNvbmRpdGlvbiBjYW4gaGFwcGVuIGlmIHdlIHJlYWQsIHRoZW4gd3JpdGUgaW4gMiBzZXBhcmF0ZSB0cmFuc2FjdGlvbnMuXHJcbiAgICAgKiBCdXQgaXQgd29uJ3QgaGFwcGVuIGhlcmUsIGJlY2F1c2UgdGhpcyBmdW5jdGlvbiB3aWxsIGJlIGNhbGxlZCBleGFjdGx5IG9uY2UuXHJcbiAgICAgKi9cclxuICAgIGxldCBleGlzdGluZ0RlYnVnVG9rZW4gPSB1bmRlZmluZWQ7XHJcbiAgICB0cnkge1xyXG4gICAgICAgIGV4aXN0aW5nRGVidWdUb2tlbiA9IGF3YWl0IHJlYWREZWJ1Z1Rva2VuRnJvbUluZGV4ZWREQigpO1xyXG4gICAgfVxyXG4gICAgY2F0Y2ggKF9lKSB7XHJcbiAgICAgICAgLy8gZmFpbGVkIHRvIHJlYWQgZnJvbSBpbmRleGVkZGIuIFdlIGFzc3VtZSB0aGVyZSBpcyBubyBleGlzdGluZyBkZWJ1ZyB0b2tlbiwgYW5kIGdlbmVyYXRlIGEgbmV3IG9uZS5cclxuICAgIH1cclxuICAgIGlmICghZXhpc3RpbmdEZWJ1Z1Rva2VuKSB7XHJcbiAgICAgICAgLy8gY3JlYXRlIGEgbmV3IGRlYnVnIHRva2VuXHJcbiAgICAgICAgY29uc3QgbmV3VG9rZW4gPSB1dWlkdjQoKTtcclxuICAgICAgICAvLyBXZSBkb24ndCBuZWVkIHRvIGJsb2NrIG9uIHdyaXRpbmcgdG8gaW5kZXhlZGRiXHJcbiAgICAgICAgLy8gSW4gY2FzZSBwZXJzaXN0ZW5jZSBmYWlsZWQsIGEgbmV3IGRlYnVnIHRva2VuIHdpbGwgYmUgZ2VuZXJhdGVkIGV2ZXJ5IHRpbWUgdGhlIHBhZ2UgaXMgcmVmcmVzaGVkLlxyXG4gICAgICAgIC8vIEl0IHJlbmRlcnMgdGhlIGRlYnVnIHRva2VuIHVzZWxlc3MgYmVjYXVzZSB5b3UgaGF2ZSB0byBtYW51YWxseSByZWdpc3Rlcih3aGl0ZWxpc3QpIHRoZSBuZXcgdG9rZW4gaW4gdGhlIGZpcmViYXNlIGNvbnNvbGUgYWdhaW4gYW5kIGFnYWluLlxyXG4gICAgICAgIC8vIElmIHlvdSBzZWUgdGhpcyBlcnJvciB0cnlpbmcgdG8gdXNlIGRlYnVnIHRva2VuLCBpdCBwcm9iYWJseSBtZWFucyB5b3UgYXJlIHVzaW5nIGEgYnJvd3NlciB0aGF0IGRvZXNuJ3Qgc3VwcG9ydCBpbmRleGVkZGIuXHJcbiAgICAgICAgLy8gWW91IHNob3VsZCBzd2l0Y2ggdG8gYSBkaWZmZXJlbnQgYnJvd3NlciB0aGF0IHN1cHBvcnRzIGluZGV4ZWRkYlxyXG4gICAgICAgIHdyaXRlRGVidWdUb2tlblRvSW5kZXhlZERCKG5ld1Rva2VuKS5jYXRjaChlID0+IGxvZ2dlci53YXJuKGBGYWlsZWQgdG8gcGVyc2lzdCBkZWJ1ZyB0b2tlbiB0byBJbmRleGVkREIuIEVycm9yOiAke2V9YCkpO1xyXG4gICAgICAgIHJldHVybiBuZXdUb2tlbjtcclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICAgIHJldHVybiBleGlzdGluZ0RlYnVnVG9rZW47XHJcbiAgICB9XHJcbn1cblxuLyoqXHJcbiAqIEBsaWNlbnNlXHJcbiAqIENvcHlyaWdodCAyMDIwIEdvb2dsZSBMTENcclxuICpcclxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcclxuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxyXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcclxuICpcclxuICogICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcclxuICpcclxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxyXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXHJcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxyXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXHJcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxyXG4gKi9cclxuZnVuY3Rpb24gaXNEZWJ1Z01vZGUoKSB7XHJcbiAgICBjb25zdCBkZWJ1Z1N0YXRlID0gZ2V0RGVidWdTdGF0ZSgpO1xyXG4gICAgcmV0dXJuIGRlYnVnU3RhdGUuZW5hYmxlZDtcclxufVxyXG5hc3luYyBmdW5jdGlvbiBnZXREZWJ1Z1Rva2VuKCkge1xyXG4gICAgY29uc3Qgc3RhdGUgPSBnZXREZWJ1Z1N0YXRlKCk7XHJcbiAgICBpZiAoc3RhdGUuZW5hYmxlZCAmJiBzdGF0ZS50b2tlbikge1xyXG4gICAgICAgIHJldHVybiBzdGF0ZS50b2tlbi5wcm9taXNlO1xyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgICAgLy8gc2hvdWxkIG5vdCBoYXBwZW4hXHJcbiAgICAgICAgdGhyb3cgRXJyb3IoYFxuICAgICAgICAgICAgQ2FuJ3QgZ2V0IGRlYnVnIHRva2VuIGluIHByb2R1Y3Rpb24gbW9kZS5cbiAgICAgICAgYCk7XHJcbiAgICB9XHJcbn1cclxuZnVuY3Rpb24gaW5pdGlhbGl6ZURlYnVnTW9kZSgpIHtcclxuICAgIGNvbnN0IGdsb2JhbHMgPSBnZXRHbG9iYWwoKTtcclxuICAgIGNvbnN0IGRlYnVnU3RhdGUgPSBnZXREZWJ1Z1N0YXRlKCk7XHJcbiAgICAvLyBTZXQgdG8gdHJ1ZSBpZiB0aGlzIGZ1bmN0aW9uIGhhcyBiZWVuIGNhbGxlZCwgd2hldGhlciBvciBub3RcclxuICAgIC8vIGl0IGVuYWJsZWQgZGVidWcgbW9kZS5cclxuICAgIGRlYnVnU3RhdGUuaW5pdGlhbGl6ZWQgPSB0cnVlO1xyXG4gICAgaWYgKHR5cGVvZiBnbG9iYWxzLkZJUkVCQVNFX0FQUENIRUNLX0RFQlVHX1RPS0VOICE9PSAnc3RyaW5nJyAmJlxyXG4gICAgICAgIGdsb2JhbHMuRklSRUJBU0VfQVBQQ0hFQ0tfREVCVUdfVE9LRU4gIT09IHRydWUpIHtcclxuICAgICAgICByZXR1cm47XHJcbiAgICB9XHJcbiAgICBkZWJ1Z1N0YXRlLmVuYWJsZWQgPSB0cnVlO1xyXG4gICAgY29uc3QgZGVmZXJyZWRUb2tlbiA9IG5ldyBEZWZlcnJlZCgpO1xyXG4gICAgZGVidWdTdGF0ZS50b2tlbiA9IGRlZmVycmVkVG9rZW47XHJcbiAgICBpZiAodHlwZW9mIGdsb2JhbHMuRklSRUJBU0VfQVBQQ0hFQ0tfREVCVUdfVE9LRU4gPT09ICdzdHJpbmcnKSB7XHJcbiAgICAgICAgZGVmZXJyZWRUb2tlbi5yZXNvbHZlKGdsb2JhbHMuRklSRUJBU0VfQVBQQ0hFQ0tfREVCVUdfVE9LRU4pO1xyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgICAgZGVmZXJyZWRUb2tlbi5yZXNvbHZlKHJlYWRPckNyZWF0ZURlYnVnVG9rZW5Gcm9tU3RvcmFnZSgpKTtcclxuICAgIH1cclxufVxuXG4vKipcclxuICogQGxpY2Vuc2VcclxuICogQ29weXJpZ2h0IDIwMjAgR29vZ2xlIExMQ1xyXG4gKlxyXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xyXG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXHJcbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxyXG4gKlxyXG4gKiAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxyXG4gKlxyXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXHJcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcclxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXHJcbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcclxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXHJcbiAqL1xyXG4vLyBJbml0aWFsIGhhcmRjb2RlZCB2YWx1ZSBhZ3JlZWQgdXBvbiBhY3Jvc3MgcGxhdGZvcm1zIGZvciBpbml0aWFsIGxhdW5jaC5cclxuLy8gRm9ybWF0IGxlZnQgb3BlbiBmb3IgcG9zc2libGUgZHluYW1pYyBlcnJvciB2YWx1ZXMgYW5kIG90aGVyIGZpZWxkcyBpbiB0aGUgZnV0dXJlLlxyXG5jb25zdCBkZWZhdWx0VG9rZW5FcnJvckRhdGEgPSB7IGVycm9yOiAnVU5LTk9XTl9FUlJPUicgfTtcclxuLyoqXHJcbiAqIFN0cmluZ2lmeSBhbmQgYmFzZTY0IGVuY29kZSB0b2tlbiBlcnJvciBkYXRhLlxyXG4gKlxyXG4gKiBAcGFyYW0gdG9rZW5FcnJvciBFcnJvciBkYXRhLCBjdXJyZW50bHkgaGFyZGNvZGVkLlxyXG4gKi9cclxuZnVuY3Rpb24gZm9ybWF0RHVtbXlUb2tlbih0b2tlbkVycm9yRGF0YSkge1xyXG4gICAgcmV0dXJuIGJhc2U2NC5lbmNvZGVTdHJpbmcoSlNPTi5zdHJpbmdpZnkodG9rZW5FcnJvckRhdGEpLCBcclxuICAgIC8qIHdlYlNhZmU9ICovIGZhbHNlKTtcclxufVxyXG4vKipcclxuICogVGhpcyBmdW5jdGlvbiBhbHdheXMgcmVzb2x2ZXMuXHJcbiAqIFRoZSByZXN1bHQgd2lsbCBjb250YWluIGFuIGVycm9yIGZpZWxkIGlmIHRoZXJlIGlzIGFueSBlcnJvci5cclxuICogSW4gY2FzZSB0aGVyZSBpcyBhbiBlcnJvciwgdGhlIHRva2VuIGZpZWxkIGluIHRoZSByZXN1bHQgd2lsbCBiZSBwb3B1bGF0ZWQgd2l0aCBhIGR1bW15IHZhbHVlXHJcbiAqL1xyXG5hc3luYyBmdW5jdGlvbiBnZXRUb2tlbiQyKGFwcENoZWNrLCBmb3JjZVJlZnJlc2ggPSBmYWxzZSkge1xyXG4gICAgY29uc3QgYXBwID0gYXBwQ2hlY2suYXBwO1xyXG4gICAgZW5zdXJlQWN0aXZhdGVkKGFwcCk7XHJcbiAgICBjb25zdCBzdGF0ZSA9IGdldFN0YXRlUmVmZXJlbmNlKGFwcCk7XHJcbiAgICAvKipcclxuICAgICAqIEZpcnN0IGNoZWNrIGlmIHRoZXJlIGlzIGEgdG9rZW4gaW4gbWVtb3J5IGZyb20gYSBwcmV2aW91cyBgZ2V0VG9rZW4oKWAgY2FsbC5cclxuICAgICAqL1xyXG4gICAgbGV0IHRva2VuID0gc3RhdGUudG9rZW47XHJcbiAgICBsZXQgZXJyb3IgPSB1bmRlZmluZWQ7XHJcbiAgICAvKipcclxuICAgICAqIElmIGFuIGludmFsaWQgdG9rZW4gd2FzIGZvdW5kIGluIG1lbW9yeSwgY2xlYXIgdG9rZW4gZnJvbVxyXG4gICAgICogbWVtb3J5IGFuZCB1bnNldCB0aGUgbG9jYWwgdmFyaWFibGUgYHRva2VuYC5cclxuICAgICAqL1xyXG4gICAgaWYgKHRva2VuICYmICFpc1ZhbGlkKHRva2VuKSkge1xyXG4gICAgICAgIHN0YXRlLnRva2VuID0gdW5kZWZpbmVkO1xyXG4gICAgICAgIHRva2VuID0gdW5kZWZpbmVkO1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiBJZiB0aGVyZSBpcyBubyB2YWxpZCB0b2tlbiBpbiBtZW1vcnksIHRyeSB0byBsb2FkIHRva2VuIGZyb20gaW5kZXhlZERCLlxyXG4gICAgICovXHJcbiAgICBpZiAoIXRva2VuKSB7XHJcbiAgICAgICAgLy8gY2FjaGVkVG9rZW5Qcm9taXNlIGNvbnRhaW5zIHRoZSB0b2tlbiBmb3VuZCBpbiBJbmRleGVkREIgb3IgdW5kZWZpbmVkIGlmIG5vdCBmb3VuZC5cclxuICAgICAgICBjb25zdCBjYWNoZWRUb2tlbiA9IGF3YWl0IHN0YXRlLmNhY2hlZFRva2VuUHJvbWlzZTtcclxuICAgICAgICBpZiAoY2FjaGVkVG9rZW4pIHtcclxuICAgICAgICAgICAgaWYgKGlzVmFsaWQoY2FjaGVkVG9rZW4pKSB7XHJcbiAgICAgICAgICAgICAgICB0b2tlbiA9IGNhY2hlZFRva2VuO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgLy8gSWYgdGhlcmUgd2FzIGFuIGludmFsaWQgdG9rZW4gaW4gdGhlIGluZGV4ZWREQiBjYWNoZSwgY2xlYXIgaXQuXHJcbiAgICAgICAgICAgICAgICBhd2FpdCB3cml0ZVRva2VuVG9TdG9yYWdlKGFwcCwgdW5kZWZpbmVkKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIC8vIFJldHVybiB0aGUgY2FjaGVkIHRva2VuIChmcm9tIGVpdGhlciBtZW1vcnkgb3IgaW5kZXhlZERCKSBpZiBpdCdzIHZhbGlkXHJcbiAgICBpZiAoIWZvcmNlUmVmcmVzaCAmJiB0b2tlbiAmJiBpc1ZhbGlkKHRva2VuKSkge1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIHRva2VuOiB0b2tlbi50b2tlblxyXG4gICAgICAgIH07XHJcbiAgICB9XHJcbiAgICAvLyBPbmx5IHNldCB0byB0cnVlIGlmIHRoaXMgYGdldFRva2VuKClgIGNhbGwgaXMgbWFraW5nIHRoZSBhY3R1YWxcclxuICAgIC8vIFJFU1QgY2FsbCB0byB0aGUgZXhjaGFuZ2UgZW5kcG9pbnQsIHZlcnN1cyB3YWl0aW5nIGZvciBhbiBhbHJlYWR5XHJcbiAgICAvLyBpbi1mbGlnaHQgY2FsbCAoc2VlIGRlYnVnIGFuZCByZWd1bGFyIGV4Y2hhbmdlIGVuZHBvaW50IHBhdGhzIGJlbG93KVxyXG4gICAgbGV0IHNob3VsZENhbGxMaXN0ZW5lcnMgPSBmYWxzZTtcclxuICAgIC8qKlxyXG4gICAgICogREVCVUcgTU9ERVxyXG4gICAgICogSWYgZGVidWcgbW9kZSBpcyBzZXQsIGFuZCB0aGVyZSBpcyBubyBjYWNoZWQgdG9rZW4sIGZldGNoIGEgbmV3IEFwcFxyXG4gICAgICogQ2hlY2sgdG9rZW4gdXNpbmcgdGhlIGRlYnVnIHRva2VuLCBhbmQgcmV0dXJuIGl0IGRpcmVjdGx5LlxyXG4gICAgICovXHJcbiAgICBpZiAoaXNEZWJ1Z01vZGUoKSkge1xyXG4gICAgICAgIC8vIEF2b2lkIG1ha2luZyBhbm90aGVyIGNhbGwgdG8gdGhlIGV4Y2hhbmdlIGVuZHBvaW50IGlmIG9uZSBpcyBpbiBmbGlnaHQuXHJcbiAgICAgICAgaWYgKCFzdGF0ZS5leGNoYW5nZVRva2VuUHJvbWlzZSkge1xyXG4gICAgICAgICAgICBzdGF0ZS5leGNoYW5nZVRva2VuUHJvbWlzZSA9IGV4Y2hhbmdlVG9rZW4oZ2V0RXhjaGFuZ2VEZWJ1Z1Rva2VuUmVxdWVzdChhcHAsIGF3YWl0IGdldERlYnVnVG9rZW4oKSksIGFwcENoZWNrLmhlYXJ0YmVhdFNlcnZpY2VQcm92aWRlcikuZmluYWxseSgoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAvLyBDbGVhciBwcm9taXNlIHdoZW4gc2V0dGxlZCAtIGVpdGhlciByZXNvbHZlZCBvciByZWplY3RlZC5cclxuICAgICAgICAgICAgICAgIHN0YXRlLmV4Y2hhbmdlVG9rZW5Qcm9taXNlID0gdW5kZWZpbmVkO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgc2hvdWxkQ2FsbExpc3RlbmVycyA9IHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNvbnN0IHRva2VuRnJvbURlYnVnRXhjaGFuZ2UgPSBhd2FpdCBzdGF0ZS5leGNoYW5nZVRva2VuUHJvbWlzZTtcclxuICAgICAgICAvLyBXcml0ZSBkZWJ1ZyB0b2tlbiB0byBpbmRleGVkREIuXHJcbiAgICAgICAgYXdhaXQgd3JpdGVUb2tlblRvU3RvcmFnZShhcHAsIHRva2VuRnJvbURlYnVnRXhjaGFuZ2UpO1xyXG4gICAgICAgIC8vIFdyaXRlIGRlYnVnIHRva2VuIHRvIHN0YXRlLlxyXG4gICAgICAgIHN0YXRlLnRva2VuID0gdG9rZW5Gcm9tRGVidWdFeGNoYW5nZTtcclxuICAgICAgICByZXR1cm4geyB0b2tlbjogdG9rZW5Gcm9tRGVidWdFeGNoYW5nZS50b2tlbiB9O1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiBUaGVyZSBhcmUgbm8gdmFsaWQgdG9rZW5zIGluIG1lbW9yeSBvciBpbmRleGVkREIgYW5kIHdlIGFyZSBub3QgaW5cclxuICAgICAqIGRlYnVnIG1vZGUuXHJcbiAgICAgKiBSZXF1ZXN0IGEgbmV3IHRva2VuIGZyb20gdGhlIGV4Y2hhbmdlIGVuZHBvaW50LlxyXG4gICAgICovXHJcbiAgICB0cnkge1xyXG4gICAgICAgIC8vIEF2b2lkIG1ha2luZyBhbm90aGVyIGNhbGwgdG8gdGhlIGV4Y2hhbmdlIGVuZHBvaW50IGlmIG9uZSBpcyBpbiBmbGlnaHQuXHJcbiAgICAgICAgaWYgKCFzdGF0ZS5leGNoYW5nZVRva2VuUHJvbWlzZSkge1xyXG4gICAgICAgICAgICAvLyBzdGF0ZS5wcm92aWRlciBpcyBwb3B1bGF0ZWQgaW4gaW5pdGlhbGl6ZUFwcENoZWNrKClcclxuICAgICAgICAgICAgLy8gZW5zdXJlQWN0aXZhdGVkKCkgYXQgdGhlIHRvcCBvZiB0aGlzIGZ1bmN0aW9uIGNoZWNrcyB0aGF0XHJcbiAgICAgICAgICAgIC8vIGluaXRpYWxpemVBcHBDaGVjaygpIGhhcyBiZWVuIGNhbGxlZC5cclxuICAgICAgICAgICAgc3RhdGUuZXhjaGFuZ2VUb2tlblByb21pc2UgPSBzdGF0ZS5wcm92aWRlci5nZXRUb2tlbigpLmZpbmFsbHkoKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgLy8gQ2xlYXIgcHJvbWlzZSB3aGVuIHNldHRsZWQgLSBlaXRoZXIgcmVzb2x2ZWQgb3IgcmVqZWN0ZWQuXHJcbiAgICAgICAgICAgICAgICBzdGF0ZS5leGNoYW5nZVRva2VuUHJvbWlzZSA9IHVuZGVmaW5lZDtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIHNob3VsZENhbGxMaXN0ZW5lcnMgPSB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0b2tlbiA9IGF3YWl0IGdldFN0YXRlUmVmZXJlbmNlKGFwcCkuZXhjaGFuZ2VUb2tlblByb21pc2U7XHJcbiAgICB9XHJcbiAgICBjYXRjaCAoZSkge1xyXG4gICAgICAgIGlmIChlLmNvZGUgPT09IGBhcHBDaGVjay8ke1widGhyb3R0bGVkXCIgLyogQXBwQ2hlY2tFcnJvci5USFJPVFRMRUQgKi99YCkge1xyXG4gICAgICAgICAgICAvLyBXYXJuIGlmIHRocm90dGxlZCwgYnV0IGRvIG5vdCB0cmVhdCBpdCBhcyBhbiBlcnJvci5cclxuICAgICAgICAgICAgbG9nZ2VyLndhcm4oZS5tZXNzYWdlKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIC8vIGBnZXRUb2tlbigpYCBzaG91bGQgbmV2ZXIgdGhyb3csIGJ1dCBsb2dnaW5nIGVycm9yIHRleHQgdG8gY29uc29sZSB3aWxsIGFpZCBkZWJ1Z2dpbmcuXHJcbiAgICAgICAgICAgIGxvZ2dlci5lcnJvcihlKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gQWx3YXlzIHNhdmUgZXJyb3IgdG8gYmUgYWRkZWQgdG8gZHVtbXkgdG9rZW4uXHJcbiAgICAgICAgZXJyb3IgPSBlO1xyXG4gICAgfVxyXG4gICAgbGV0IGludGVyb3BUb2tlblJlc3VsdDtcclxuICAgIGlmICghdG9rZW4pIHtcclxuICAgICAgICAvLyBJZiB0b2tlbiBpcyB1bmRlZmluZWQsIHRoZXJlIG11c3QgYmUgYW4gZXJyb3IuXHJcbiAgICAgICAgLy8gUmV0dXJuIGEgZHVtbXkgdG9rZW4gYWxvbmcgd2l0aCB0aGUgZXJyb3IuXHJcbiAgICAgICAgaW50ZXJvcFRva2VuUmVzdWx0ID0gbWFrZUR1bW15VG9rZW5SZXN1bHQoZXJyb3IpO1xyXG4gICAgfVxyXG4gICAgZWxzZSBpZiAoZXJyb3IpIHtcclxuICAgICAgICBpZiAoaXNWYWxpZCh0b2tlbikpIHtcclxuICAgICAgICAgICAgLy8gSXQncyBhbHNvIHBvc3NpYmxlIGEgdmFsaWQgdG9rZW4gZXhpc3RzLCBidXQgdGhlcmUncyBhbHNvIGFuIGVycm9yLlxyXG4gICAgICAgICAgICAvLyAoU3VjaCBhcyBpZiB0aGUgdG9rZW4gaXMgYWxtb3N0IGV4cGlyZWQsIHRyaWVzIHRvIHJlZnJlc2gsIGFuZFxyXG4gICAgICAgICAgICAvLyB0aGUgZXhjaGFuZ2UgcmVxdWVzdCBmYWlscy4pXHJcbiAgICAgICAgICAgIC8vIFdlIGFkZCBhIHNwZWNpYWwgZXJyb3IgcHJvcGVydHkgaGVyZSBzbyB0aGF0IHRoZSByZWZyZXNoZXIgd2lsbFxyXG4gICAgICAgICAgICAvLyBjb3VudCB0aGlzIGFzIGEgZmFpbGVkIGF0dGVtcHQgYW5kIHVzZSB0aGUgYmFja29mZiBpbnN0ZWFkIG9mXHJcbiAgICAgICAgICAgIC8vIHJldHJ5aW5nIHJlcGVhdGVkbHkgd2l0aCBubyBkZWxheSwgYnV0IGFueSAzUCBsaXN0ZW5lcnMgd2lsbCBub3RcclxuICAgICAgICAgICAgLy8gYmUgaGluZGVyZWQgaW4gZ2V0dGluZyB0aGUgc3RpbGwtdmFsaWQgdG9rZW4uXHJcbiAgICAgICAgICAgIGludGVyb3BUb2tlblJlc3VsdCA9IHtcclxuICAgICAgICAgICAgICAgIHRva2VuOiB0b2tlbi50b2tlbixcclxuICAgICAgICAgICAgICAgIGludGVybmFsRXJyb3I6IGVycm9yXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAvLyBObyBpbnZhbGlkIHRva2VucyBzaG91bGQgbWFrZSBpdCB0byB0aGlzIHN0ZXAuIE1lbW9yeSBhbmQgY2FjaGVkIHRva2Vuc1xyXG4gICAgICAgICAgICAvLyBhcmUgY2hlY2tlZC4gT3RoZXIgdG9rZW5zIGFyZSBmcm9tIGZyZXNoIGV4Y2hhbmdlcy4gQnV0IGp1c3QgaW4gY2FzZS5cclxuICAgICAgICAgICAgaW50ZXJvcFRva2VuUmVzdWx0ID0gbWFrZUR1bW15VG9rZW5SZXN1bHQoZXJyb3IpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICAgIGludGVyb3BUb2tlblJlc3VsdCA9IHtcclxuICAgICAgICAgICAgdG9rZW46IHRva2VuLnRva2VuXHJcbiAgICAgICAgfTtcclxuICAgICAgICAvLyB3cml0ZSB0aGUgbmV3IHRva2VuIHRvIHRoZSBtZW1vcnkgc3RhdGUgYXMgd2VsbCBhcyB0aGUgcGVyc2lzdGVudCBzdG9yYWdlLlxyXG4gICAgICAgIC8vIE9ubHkgZG8gaXQgaWYgd2UgZ290IGEgdmFsaWQgbmV3IHRva2VuXHJcbiAgICAgICAgc3RhdGUudG9rZW4gPSB0b2tlbjtcclxuICAgICAgICBhd2FpdCB3cml0ZVRva2VuVG9TdG9yYWdlKGFwcCwgdG9rZW4pO1xyXG4gICAgfVxyXG4gICAgaWYgKHNob3VsZENhbGxMaXN0ZW5lcnMpIHtcclxuICAgICAgICBub3RpZnlUb2tlbkxpc3RlbmVycyhhcHAsIGludGVyb3BUb2tlblJlc3VsdCk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gaW50ZXJvcFRva2VuUmVzdWx0O1xyXG59XHJcbi8qKlxyXG4gKiBJbnRlcm5hbCBBUEkgZm9yIGxpbWl0ZWQgdXNlIHRva2Vucy4gU2tpcHMgYWxsIEZBQyBzdGF0ZSBhbmQgc2ltcGx5IGNhbGxzXHJcbiAqIHRoZSB1bmRlcmx5aW5nIHByb3ZpZGVyLlxyXG4gKi9cclxuYXN5bmMgZnVuY3Rpb24gZ2V0TGltaXRlZFVzZVRva2VuJDEoYXBwQ2hlY2spIHtcclxuICAgIGNvbnN0IGFwcCA9IGFwcENoZWNrLmFwcDtcclxuICAgIGVuc3VyZUFjdGl2YXRlZChhcHApO1xyXG4gICAgY29uc3QgeyBwcm92aWRlciB9ID0gZ2V0U3RhdGVSZWZlcmVuY2UoYXBwKTtcclxuICAgIGlmIChpc0RlYnVnTW9kZSgpKSB7XHJcbiAgICAgICAgY29uc3QgZGVidWdUb2tlbiA9IGF3YWl0IGdldERlYnVnVG9rZW4oKTtcclxuICAgICAgICBjb25zdCB7IHRva2VuIH0gPSBhd2FpdCBleGNoYW5nZVRva2VuKGdldEV4Y2hhbmdlRGVidWdUb2tlblJlcXVlc3QoYXBwLCBkZWJ1Z1Rva2VuKSwgYXBwQ2hlY2suaGVhcnRiZWF0U2VydmljZVByb3ZpZGVyKTtcclxuICAgICAgICByZXR1cm4geyB0b2tlbiB9O1xyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgICAgLy8gcHJvdmlkZXIgaXMgZGVmaW5pdGVseSB2YWxpZCBzaW5jZSB3ZSBlbnN1cmUgQXBwQ2hlY2sgd2FzIGFjdGl2YXRlZFxyXG4gICAgICAgIGNvbnN0IHsgdG9rZW4gfSA9IGF3YWl0IHByb3ZpZGVyLmdldFRva2VuKCk7XHJcbiAgICAgICAgcmV0dXJuIHsgdG9rZW4gfTtcclxuICAgIH1cclxufVxyXG5mdW5jdGlvbiBhZGRUb2tlbkxpc3RlbmVyKGFwcENoZWNrLCB0eXBlLCBsaXN0ZW5lciwgb25FcnJvcikge1xyXG4gICAgY29uc3QgeyBhcHAgfSA9IGFwcENoZWNrO1xyXG4gICAgY29uc3Qgc3RhdGUgPSBnZXRTdGF0ZVJlZmVyZW5jZShhcHApO1xyXG4gICAgY29uc3QgdG9rZW5PYnNlcnZlciA9IHtcclxuICAgICAgICBuZXh0OiBsaXN0ZW5lcixcclxuICAgICAgICBlcnJvcjogb25FcnJvcixcclxuICAgICAgICB0eXBlXHJcbiAgICB9O1xyXG4gICAgc3RhdGUudG9rZW5PYnNlcnZlcnMgPSBbLi4uc3RhdGUudG9rZW5PYnNlcnZlcnMsIHRva2VuT2JzZXJ2ZXJdO1xyXG4gICAgLy8gSW52b2tlIHRoZSBsaXN0ZW5lciBhc3luYyBpbW1lZGlhdGVseSBpZiB0aGVyZSBpcyBhIHZhbGlkIHRva2VuXHJcbiAgICAvLyBpbiBtZW1vcnkuXHJcbiAgICBpZiAoc3RhdGUudG9rZW4gJiYgaXNWYWxpZChzdGF0ZS50b2tlbikpIHtcclxuICAgICAgICBjb25zdCB2YWxpZFRva2VuID0gc3RhdGUudG9rZW47XHJcbiAgICAgICAgUHJvbWlzZS5yZXNvbHZlKClcclxuICAgICAgICAgICAgLnRoZW4oKCkgPT4ge1xyXG4gICAgICAgICAgICBsaXN0ZW5lcih7IHRva2VuOiB2YWxpZFRva2VuLnRva2VuIH0pO1xyXG4gICAgICAgICAgICBpbml0VG9rZW5SZWZyZXNoZXIoYXBwQ2hlY2spO1xyXG4gICAgICAgIH0pXHJcbiAgICAgICAgICAgIC5jYXRjaCgoKSA9PiB7XHJcbiAgICAgICAgICAgIC8qIHdlIGRvbid0IGNhcmUgYWJvdXQgZXhjZXB0aW9ucyB0aHJvd24gaW4gbGlzdGVuZXJzICovXHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIFdhaXQgZm9yIGFueSBjYWNoZWQgdG9rZW4gcHJvbWlzZSB0byByZXNvbHZlIGJlZm9yZSBzdGFydGluZyB0aGUgdG9rZW5cclxuICAgICAqIHJlZnJlc2hlci4gVGhlIHJlZnJlc2hlciBjaGVja3MgdG8gc2VlIGlmIHRoZXJlIGlzIGFuIGV4aXN0aW5nIHRva2VuXHJcbiAgICAgKiBpbiBzdGF0ZSBhbmQgY2FsbHMgdGhlIGV4Y2hhbmdlIGVuZHBvaW50IGlmIG5vdC4gV2Ugc2hvdWxkIGZpcnN0IGxldCB0aGVcclxuICAgICAqIEluZGV4ZWREQiBjaGVjayBoYXZlIGEgY2hhbmNlIHRvIHBvcHVsYXRlIHN0YXRlIGlmIGl0IGNhbi5cclxuICAgICAqXHJcbiAgICAgKiBMaXN0ZW5lciBjYWxsIGlzbid0IG5lZWRlZCBoZXJlIGJlY2F1c2UgY2FjaGVkVG9rZW5Qcm9taXNlIHdpbGwgY2FsbCBhbnlcclxuICAgICAqIGxpc3RlbmVycyB0aGF0IGV4aXN0IHdoZW4gaXQgcmVzb2x2ZXMuXHJcbiAgICAgKi9cclxuICAgIC8vIHN0YXRlLmNhY2hlZFRva2VuUHJvbWlzZSBpcyBhbHdheXMgcG9wdWxhdGVkIGluIGBhY3RpdmF0ZSgpYC5cclxuICAgIHZvaWQgc3RhdGUuY2FjaGVkVG9rZW5Qcm9taXNlLnRoZW4oKCkgPT4gaW5pdFRva2VuUmVmcmVzaGVyKGFwcENoZWNrKSk7XHJcbn1cclxuZnVuY3Rpb24gcmVtb3ZlVG9rZW5MaXN0ZW5lcihhcHAsIGxpc3RlbmVyKSB7XHJcbiAgICBjb25zdCBzdGF0ZSA9IGdldFN0YXRlUmVmZXJlbmNlKGFwcCk7XHJcbiAgICBjb25zdCBuZXdPYnNlcnZlcnMgPSBzdGF0ZS50b2tlbk9ic2VydmVycy5maWx0ZXIodG9rZW5PYnNlcnZlciA9PiB0b2tlbk9ic2VydmVyLm5leHQgIT09IGxpc3RlbmVyKTtcclxuICAgIGlmIChuZXdPYnNlcnZlcnMubGVuZ3RoID09PSAwICYmXHJcbiAgICAgICAgc3RhdGUudG9rZW5SZWZyZXNoZXIgJiZcclxuICAgICAgICBzdGF0ZS50b2tlblJlZnJlc2hlci5pc1J1bm5pbmcoKSkge1xyXG4gICAgICAgIHN0YXRlLnRva2VuUmVmcmVzaGVyLnN0b3AoKTtcclxuICAgIH1cclxuICAgIHN0YXRlLnRva2VuT2JzZXJ2ZXJzID0gbmV3T2JzZXJ2ZXJzO1xyXG59XHJcbi8qKlxyXG4gKiBMb2dpYyB0byBjcmVhdGUgYW5kIHN0YXJ0IHJlZnJlc2hlciBhcyBuZWVkZWQuXHJcbiAqL1xyXG5mdW5jdGlvbiBpbml0VG9rZW5SZWZyZXNoZXIoYXBwQ2hlY2spIHtcclxuICAgIGNvbnN0IHsgYXBwIH0gPSBhcHBDaGVjaztcclxuICAgIGNvbnN0IHN0YXRlID0gZ2V0U3RhdGVSZWZlcmVuY2UoYXBwKTtcclxuICAgIC8vIENyZWF0ZSB0aGUgcmVmcmVzaGVyIGJ1dCBkb24ndCBzdGFydCBpdCBpZiBgaXNUb2tlbkF1dG9SZWZyZXNoRW5hYmxlZGBcclxuICAgIC8vIGlzIG5vdCB0cnVlLlxyXG4gICAgbGV0IHJlZnJlc2hlciA9IHN0YXRlLnRva2VuUmVmcmVzaGVyO1xyXG4gICAgaWYgKCFyZWZyZXNoZXIpIHtcclxuICAgICAgICByZWZyZXNoZXIgPSBjcmVhdGVUb2tlblJlZnJlc2hlcihhcHBDaGVjayk7XHJcbiAgICAgICAgc3RhdGUudG9rZW5SZWZyZXNoZXIgPSByZWZyZXNoZXI7XHJcbiAgICB9XHJcbiAgICBpZiAoIXJlZnJlc2hlci5pc1J1bm5pbmcoKSAmJiBzdGF0ZS5pc1Rva2VuQXV0b1JlZnJlc2hFbmFibGVkKSB7XHJcbiAgICAgICAgcmVmcmVzaGVyLnN0YXJ0KCk7XHJcbiAgICB9XHJcbn1cclxuZnVuY3Rpb24gY3JlYXRlVG9rZW5SZWZyZXNoZXIoYXBwQ2hlY2spIHtcclxuICAgIGNvbnN0IHsgYXBwIH0gPSBhcHBDaGVjaztcclxuICAgIHJldHVybiBuZXcgUmVmcmVzaGVyKFxyXG4gICAgLy8gS2VlcCBpbiBtaW5kIHdoZW4gdGhpcyBmYWlscyBmb3IgYW55IHJlYXNvbiBvdGhlciB0aGFuIHRoZSBvbmVzXHJcbiAgICAvLyBmb3Igd2hpY2ggd2Ugc2hvdWxkIHJldHJ5LCBpdCB3aWxsIGVmZmVjdGl2ZWx5IHN0b3AgdGhlIHByb2FjdGl2ZSByZWZyZXNoLlxyXG4gICAgYXN5bmMgKCkgPT4ge1xyXG4gICAgICAgIGNvbnN0IHN0YXRlID0gZ2V0U3RhdGVSZWZlcmVuY2UoYXBwKTtcclxuICAgICAgICAvLyBJZiB0aGVyZSBpcyBubyB0b2tlbiwgd2Ugd2lsbCB0cnkgdG8gbG9hZCBpdCBmcm9tIHN0b3JhZ2UgYW5kIHVzZSBpdFxyXG4gICAgICAgIC8vIElmIHRoZXJlIGlzIGEgdG9rZW4sIHdlIGZvcmNlIHJlZnJlc2ggaXQgYmVjYXVzZSB3ZSBrbm93IGl0J3MgZ29pbmcgdG8gZXhwaXJlIHNvb25cclxuICAgICAgICBsZXQgcmVzdWx0O1xyXG4gICAgICAgIGlmICghc3RhdGUudG9rZW4pIHtcclxuICAgICAgICAgICAgcmVzdWx0ID0gYXdhaXQgZ2V0VG9rZW4kMihhcHBDaGVjayk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICByZXN1bHQgPSBhd2FpdCBnZXRUb2tlbiQyKGFwcENoZWNrLCB0cnVlKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogZ2V0VG9rZW4oKSBhbHdheXMgcmVzb2x2ZXMuIEluIGNhc2UgdGhlIHJlc3VsdCBoYXMgYW4gZXJyb3IgZmllbGQgZGVmaW5lZCwgaXQgbWVhbnNcclxuICAgICAgICAgKiB0aGUgb3BlcmF0aW9uIGZhaWxlZCwgYW5kIHdlIHNob3VsZCByZXRyeS5cclxuICAgICAgICAgKi9cclxuICAgICAgICBpZiAocmVzdWx0LmVycm9yKSB7XHJcbiAgICAgICAgICAgIHRocm93IHJlc3VsdC5lcnJvcjtcclxuICAgICAgICB9XHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogQSBzcGVjaWFsIGBpbnRlcm5hbEVycm9yYCBmaWVsZCByZWZsZWN0cyB0aGF0IHRoZXJlIHdhcyBhbiBlcnJvclxyXG4gICAgICAgICAqIGdldHRpbmcgYSBuZXcgdG9rZW4gZnJvbSB0aGUgZXhjaGFuZ2UgZW5kcG9pbnQsIGJ1dCB0aGVyZSdzIHN0aWxsIGFcclxuICAgICAgICAgKiBwcmV2aW91cyB0b2tlbiB0aGF0J3MgdmFsaWQgZm9yIG5vdyBhbmQgdGhpcyBzaG91bGQgYmUgcGFzc2VkIHRvIDJQLzNQXHJcbiAgICAgICAgICogcmVxdWVzdHMgZm9yIGEgdG9rZW4uIEJ1dCB3ZSB3YW50IHRoaXMgY2FsbGJhY2sgKGB0aGlzLm9wZXJhdGlvbmAgaW5cclxuICAgICAgICAgKiBgUmVmcmVzaGVyYCkgdG8gdGhyb3cgaW4gb3JkZXIgdG8ga2ljayBvZmYgdGhlIFJlZnJlc2hlcidzIHJldHJ5XHJcbiAgICAgICAgICogYmFja29mZi4gKFNldHRpbmcgYGhhc1N1Y2NlZWRlZGAgdG8gZmFsc2UuKVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGlmIChyZXN1bHQuaW50ZXJuYWxFcnJvcikge1xyXG4gICAgICAgICAgICB0aHJvdyByZXN1bHQuaW50ZXJuYWxFcnJvcjtcclxuICAgICAgICB9XHJcbiAgICB9LCAoKSA9PiB7XHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9LCAoKSA9PiB7XHJcbiAgICAgICAgY29uc3Qgc3RhdGUgPSBnZXRTdGF0ZVJlZmVyZW5jZShhcHApO1xyXG4gICAgICAgIGlmIChzdGF0ZS50b2tlbikge1xyXG4gICAgICAgICAgICAvLyBpc3N1ZWRBdFRpbWUgKyAoNTAlICogdG90YWwgVFRMKSArIDUgbWludXRlc1xyXG4gICAgICAgICAgICBsZXQgbmV4dFJlZnJlc2hUaW1lTWlsbGlzID0gc3RhdGUudG9rZW4uaXNzdWVkQXRUaW1lTWlsbGlzICtcclxuICAgICAgICAgICAgICAgIChzdGF0ZS50b2tlbi5leHBpcmVUaW1lTWlsbGlzIC0gc3RhdGUudG9rZW4uaXNzdWVkQXRUaW1lTWlsbGlzKSAqXHJcbiAgICAgICAgICAgICAgICAgICAgMC41ICtcclxuICAgICAgICAgICAgICAgIDUgKiA2MCAqIDEwMDA7XHJcbiAgICAgICAgICAgIC8vIERvIG5vdCBhbGxvdyByZWZyZXNoIHRpbWUgdG8gYmUgcGFzdCAoZXhwaXJlVGltZSAtIDUgbWludXRlcylcclxuICAgICAgICAgICAgY29uc3QgbGF0ZXN0QWxsb3dhYmxlUmVmcmVzaCA9IHN0YXRlLnRva2VuLmV4cGlyZVRpbWVNaWxsaXMgLSA1ICogNjAgKiAxMDAwO1xyXG4gICAgICAgICAgICBuZXh0UmVmcmVzaFRpbWVNaWxsaXMgPSBNYXRoLm1pbihuZXh0UmVmcmVzaFRpbWVNaWxsaXMsIGxhdGVzdEFsbG93YWJsZVJlZnJlc2gpO1xyXG4gICAgICAgICAgICByZXR1cm4gTWF0aC5tYXgoMCwgbmV4dFJlZnJlc2hUaW1lTWlsbGlzIC0gRGF0ZS5ub3coKSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICByZXR1cm4gMDtcclxuICAgICAgICB9XHJcbiAgICB9LCBUT0tFTl9SRUZSRVNIX1RJTUUuUkVUUklBTF9NSU5fV0FJVCwgVE9LRU5fUkVGUkVTSF9USU1FLlJFVFJJQUxfTUFYX1dBSVQpO1xyXG59XHJcbmZ1bmN0aW9uIG5vdGlmeVRva2VuTGlzdGVuZXJzKGFwcCwgdG9rZW4pIHtcclxuICAgIGNvbnN0IG9ic2VydmVycyA9IGdldFN0YXRlUmVmZXJlbmNlKGFwcCkudG9rZW5PYnNlcnZlcnM7XHJcbiAgICBmb3IgKGNvbnN0IG9ic2VydmVyIG9mIG9ic2VydmVycykge1xyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIGlmIChvYnNlcnZlci50eXBlID09PSBcIkVYVEVSTkFMXCIgLyogTGlzdGVuZXJUeXBlLkVYVEVSTkFMICovICYmIHRva2VuLmVycm9yICE9IG51bGwpIHtcclxuICAgICAgICAgICAgICAgIC8vIElmIHRoaXMgbGlzdGVuZXIgd2FzIGFkZGVkIGJ5IGEgM1AgY2FsbCwgc2VuZCBhbnkgdG9rZW4gZXJyb3IgdG9cclxuICAgICAgICAgICAgICAgIC8vIHRoZSBzdXBwbGllZCBlcnJvciBoYW5kbGVyLiBBIDNQIG9ic2VydmVyIGFsd2F5cyBoYXMgYW4gZXJyb3JcclxuICAgICAgICAgICAgICAgIC8vIGhhbmRsZXIuXHJcbiAgICAgICAgICAgICAgICBvYnNlcnZlci5lcnJvcih0b2tlbi5lcnJvcik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAvLyBJZiB0aGUgdG9rZW4gaGFzIG5vIGVycm9yIGZpZWxkLCBhbHdheXMgcmV0dXJuIHRoZSB0b2tlbi5cclxuICAgICAgICAgICAgICAgIC8vIElmIHRoaXMgaXMgYSAyUCBsaXN0ZW5lciwgcmV0dXJuIHRoZSB0b2tlbiwgd2hldGhlciBvciBub3QgaXRcclxuICAgICAgICAgICAgICAgIC8vIGhhcyBhbiBlcnJvciBmaWVsZC5cclxuICAgICAgICAgICAgICAgIG9ic2VydmVyLm5leHQodG9rZW4pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNhdGNoIChlKSB7XHJcbiAgICAgICAgICAgIC8vIEVycm9ycyBpbiB0aGUgbGlzdGVuZXIgZnVuY3Rpb24gaXRzZWxmIGFyZSBhbHdheXMgaWdub3JlZC5cclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuZnVuY3Rpb24gaXNWYWxpZCh0b2tlbikge1xyXG4gICAgcmV0dXJuIHRva2VuLmV4cGlyZVRpbWVNaWxsaXMgLSBEYXRlLm5vdygpID4gMDtcclxufVxyXG5mdW5jdGlvbiBtYWtlRHVtbXlUb2tlblJlc3VsdChlcnJvcikge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICB0b2tlbjogZm9ybWF0RHVtbXlUb2tlbihkZWZhdWx0VG9rZW5FcnJvckRhdGEpLFxyXG4gICAgICAgIGVycm9yXHJcbiAgICB9O1xyXG59XG5cbi8qKlxyXG4gKiBAbGljZW5zZVxyXG4gKiBDb3B5cmlnaHQgMjAyMCBHb29nbGUgTExDXHJcbiAqXHJcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XHJcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cclxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XHJcbiAqXHJcbiAqICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXHJcbiAqXHJcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcclxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxyXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cclxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxyXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cclxuICovXHJcbi8qKlxyXG4gKiBBcHBDaGVjayBTZXJ2aWNlIGNsYXNzLlxyXG4gKi9cclxuY2xhc3MgQXBwQ2hlY2tTZXJ2aWNlIHtcclxuICAgIGNvbnN0cnVjdG9yKGFwcCwgaGVhcnRiZWF0U2VydmljZVByb3ZpZGVyKSB7XHJcbiAgICAgICAgdGhpcy5hcHAgPSBhcHA7XHJcbiAgICAgICAgdGhpcy5oZWFydGJlYXRTZXJ2aWNlUHJvdmlkZXIgPSBoZWFydGJlYXRTZXJ2aWNlUHJvdmlkZXI7XHJcbiAgICB9XHJcbiAgICBfZGVsZXRlKCkge1xyXG4gICAgICAgIGNvbnN0IHsgdG9rZW5PYnNlcnZlcnMgfSA9IGdldFN0YXRlUmVmZXJlbmNlKHRoaXMuYXBwKTtcclxuICAgICAgICBmb3IgKGNvbnN0IHRva2VuT2JzZXJ2ZXIgb2YgdG9rZW5PYnNlcnZlcnMpIHtcclxuICAgICAgICAgICAgcmVtb3ZlVG9rZW5MaXN0ZW5lcih0aGlzLmFwcCwgdG9rZW5PYnNlcnZlci5uZXh0KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpO1xyXG4gICAgfVxyXG59XHJcbmZ1bmN0aW9uIGZhY3RvcnkoYXBwLCBoZWFydGJlYXRTZXJ2aWNlUHJvdmlkZXIpIHtcclxuICAgIHJldHVybiBuZXcgQXBwQ2hlY2tTZXJ2aWNlKGFwcCwgaGVhcnRiZWF0U2VydmljZVByb3ZpZGVyKTtcclxufVxyXG5mdW5jdGlvbiBpbnRlcm5hbEZhY3RvcnkoYXBwQ2hlY2spIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgZ2V0VG9rZW46IGZvcmNlUmVmcmVzaCA9PiBnZXRUb2tlbiQyKGFwcENoZWNrLCBmb3JjZVJlZnJlc2gpLFxyXG4gICAgICAgIGdldExpbWl0ZWRVc2VUb2tlbjogKCkgPT4gZ2V0TGltaXRlZFVzZVRva2VuJDEoYXBwQ2hlY2spLFxyXG4gICAgICAgIGFkZFRva2VuTGlzdGVuZXI6IGxpc3RlbmVyID0+IGFkZFRva2VuTGlzdGVuZXIoYXBwQ2hlY2ssIFwiSU5URVJOQUxcIiAvKiBMaXN0ZW5lclR5cGUuSU5URVJOQUwgKi8sIGxpc3RlbmVyKSxcclxuICAgICAgICByZW1vdmVUb2tlbkxpc3RlbmVyOiBsaXN0ZW5lciA9PiByZW1vdmVUb2tlbkxpc3RlbmVyKGFwcENoZWNrLmFwcCwgbGlzdGVuZXIpXHJcbiAgICB9O1xyXG59XG5cbmNvbnN0IG5hbWUgPSBcIkBmaXJlYmFzZS9hcHAtY2hlY2tcIjtcbmNvbnN0IHZlcnNpb24gPSBcIjAuOC43XCI7XG5cbi8qKlxyXG4gKiBAbGljZW5zZVxyXG4gKiBDb3B5cmlnaHQgMjAyMCBHb29nbGUgTExDXHJcbiAqXHJcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XHJcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cclxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XHJcbiAqXHJcbiAqICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXHJcbiAqXHJcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcclxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxyXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cclxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxyXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cclxuICovXHJcbmNvbnN0IFJFQ0FQVENIQV9VUkwgPSAnaHR0cHM6Ly93d3cuZ29vZ2xlLmNvbS9yZWNhcHRjaGEvYXBpLmpzJztcclxuY29uc3QgUkVDQVBUQ0hBX0VOVEVSUFJJU0VfVVJMID0gJ2h0dHBzOi8vd3d3Lmdvb2dsZS5jb20vcmVjYXB0Y2hhL2VudGVycHJpc2UuanMnO1xyXG5mdW5jdGlvbiBpbml0aWFsaXplVjMoYXBwLCBzaXRlS2V5KSB7XHJcbiAgICBjb25zdCBpbml0aWFsaXplZCA9IG5ldyBEZWZlcnJlZCgpO1xyXG4gICAgY29uc3Qgc3RhdGUgPSBnZXRTdGF0ZVJlZmVyZW5jZShhcHApO1xyXG4gICAgc3RhdGUucmVDQVBUQ0hBU3RhdGUgPSB7IGluaXRpYWxpemVkIH07XHJcbiAgICBjb25zdCBkaXZJZCA9IG1ha2VEaXYoYXBwKTtcclxuICAgIGNvbnN0IGdyZWNhcHRjaGEgPSBnZXRSZWNhcHRjaGEoZmFsc2UpO1xyXG4gICAgaWYgKCFncmVjYXB0Y2hhKSB7XHJcbiAgICAgICAgbG9hZFJlQ0FQVENIQVYzU2NyaXB0KCgpID0+IHtcclxuICAgICAgICAgICAgY29uc3QgZ3JlY2FwdGNoYSA9IGdldFJlY2FwdGNoYShmYWxzZSk7XHJcbiAgICAgICAgICAgIGlmICghZ3JlY2FwdGNoYSkge1xyXG4gICAgICAgICAgICAgICAgLy8gaXQgc2hvdWxkbid0IGhhcHBlbi5cclxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignbm8gcmVjYXB0Y2hhJyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcXVldWVXaWRnZXRSZW5kZXIoYXBwLCBzaXRlS2V5LCBncmVjYXB0Y2hhLCBkaXZJZCwgaW5pdGlhbGl6ZWQpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgICAgcXVldWVXaWRnZXRSZW5kZXIoYXBwLCBzaXRlS2V5LCBncmVjYXB0Y2hhLCBkaXZJZCwgaW5pdGlhbGl6ZWQpO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGluaXRpYWxpemVkLnByb21pc2U7XHJcbn1cclxuZnVuY3Rpb24gaW5pdGlhbGl6ZUVudGVycHJpc2UoYXBwLCBzaXRlS2V5KSB7XHJcbiAgICBjb25zdCBpbml0aWFsaXplZCA9IG5ldyBEZWZlcnJlZCgpO1xyXG4gICAgY29uc3Qgc3RhdGUgPSBnZXRTdGF0ZVJlZmVyZW5jZShhcHApO1xyXG4gICAgc3RhdGUucmVDQVBUQ0hBU3RhdGUgPSB7IGluaXRpYWxpemVkIH07XHJcbiAgICBjb25zdCBkaXZJZCA9IG1ha2VEaXYoYXBwKTtcclxuICAgIGNvbnN0IGdyZWNhcHRjaGEgPSBnZXRSZWNhcHRjaGEodHJ1ZSk7XHJcbiAgICBpZiAoIWdyZWNhcHRjaGEpIHtcclxuICAgICAgICBsb2FkUmVDQVBUQ0hBRW50ZXJwcmlzZVNjcmlwdCgoKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IGdyZWNhcHRjaGEgPSBnZXRSZWNhcHRjaGEodHJ1ZSk7XHJcbiAgICAgICAgICAgIGlmICghZ3JlY2FwdGNoYSkge1xyXG4gICAgICAgICAgICAgICAgLy8gaXQgc2hvdWxkbid0IGhhcHBlbi5cclxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignbm8gcmVjYXB0Y2hhJyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcXVldWVXaWRnZXRSZW5kZXIoYXBwLCBzaXRlS2V5LCBncmVjYXB0Y2hhLCBkaXZJZCwgaW5pdGlhbGl6ZWQpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgICAgcXVldWVXaWRnZXRSZW5kZXIoYXBwLCBzaXRlS2V5LCBncmVjYXB0Y2hhLCBkaXZJZCwgaW5pdGlhbGl6ZWQpO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGluaXRpYWxpemVkLnByb21pc2U7XHJcbn1cclxuLyoqXHJcbiAqIEFkZCBsaXN0ZW5lciB0byByZW5kZXIgdGhlIHdpZGdldCBhbmQgcmVzb2x2ZSB0aGUgcHJvbWlzZSB3aGVuXHJcbiAqIHRoZSBncmVjYXB0Y2hhLnJlYWR5KCkgZXZlbnQgZmlyZXMuXHJcbiAqL1xyXG5mdW5jdGlvbiBxdWV1ZVdpZGdldFJlbmRlcihhcHAsIHNpdGVLZXksIGdyZWNhcHRjaGEsIGNvbnRhaW5lciwgaW5pdGlhbGl6ZWQpIHtcclxuICAgIGdyZWNhcHRjaGEucmVhZHkoKCkgPT4ge1xyXG4gICAgICAgIC8vIEludmlzaWJsZSB3aWRnZXRzIGFsbG93IHVzIHRvIHNldCBhIGRpZmZlcmVudCBzaXRlS2V5IGZvciBlYWNoIHdpZGdldCxcclxuICAgICAgICAvLyBzbyB3ZSB1c2UgdGhlbSB0byBzdXBwb3J0IG11bHRpcGxlIGFwcHNcclxuICAgICAgICByZW5kZXJJbnZpc2libGVXaWRnZXQoYXBwLCBzaXRlS2V5LCBncmVjYXB0Y2hhLCBjb250YWluZXIpO1xyXG4gICAgICAgIGluaXRpYWxpemVkLnJlc29sdmUoZ3JlY2FwdGNoYSk7XHJcbiAgICB9KTtcclxufVxyXG4vKipcclxuICogQWRkIGludmlzaWJsZSBkaXYgdG8gcGFnZS5cclxuICovXHJcbmZ1bmN0aW9uIG1ha2VEaXYoYXBwKSB7XHJcbiAgICBjb25zdCBkaXZJZCA9IGBmaXJlX2FwcF9jaGVja18ke2FwcC5uYW1lfWA7XHJcbiAgICBjb25zdCBpbnZpc2libGVEaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgIGludmlzaWJsZURpdi5pZCA9IGRpdklkO1xyXG4gICAgaW52aXNpYmxlRGl2LnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XHJcbiAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGludmlzaWJsZURpdik7XHJcbiAgICByZXR1cm4gZGl2SWQ7XHJcbn1cclxuYXN5bmMgZnVuY3Rpb24gZ2V0VG9rZW4kMShhcHApIHtcclxuICAgIGVuc3VyZUFjdGl2YXRlZChhcHApO1xyXG4gICAgLy8gZW5zdXJlQWN0aXZhdGVkKCkgZ3VhcmFudGVlcyB0aGF0IHJlQ0FQVENIQVN0YXRlIGlzIHNldFxyXG4gICAgY29uc3QgcmVDQVBUQ0hBU3RhdGUgPSBnZXRTdGF0ZVJlZmVyZW5jZShhcHApLnJlQ0FQVENIQVN0YXRlO1xyXG4gICAgY29uc3QgcmVjYXB0Y2hhID0gYXdhaXQgcmVDQVBUQ0hBU3RhdGUuaW5pdGlhbGl6ZWQucHJvbWlzZTtcclxuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgX3JlamVjdCkgPT4ge1xyXG4gICAgICAgIC8vIFVwZGF0ZWQgYWZ0ZXIgaW5pdGlhbGl6YXRpb24gaXMgY29tcGxldGUuXHJcbiAgICAgICAgY29uc3QgcmVDQVBUQ0hBU3RhdGUgPSBnZXRTdGF0ZVJlZmVyZW5jZShhcHApLnJlQ0FQVENIQVN0YXRlO1xyXG4gICAgICAgIHJlY2FwdGNoYS5yZWFkeSgoKSA9PiB7XHJcbiAgICAgICAgICAgIHJlc29sdmUoXHJcbiAgICAgICAgICAgIC8vIHdpZGdldElkIGlzIGd1YXJhbnRlZWQgdG8gYmUgYXZhaWxhYmxlIGlmIHJlQ0FQVENIQVN0YXRlLmluaXRpYWxpemVkLnByb21pc2UgcmVzb2x2ZWQuXHJcbiAgICAgICAgICAgIHJlY2FwdGNoYS5leGVjdXRlKHJlQ0FQVENIQVN0YXRlLndpZGdldElkLCB7XHJcbiAgICAgICAgICAgICAgICBhY3Rpb246ICdmaXJlX2FwcF9jaGVjaydcclxuICAgICAgICAgICAgfSkpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfSk7XHJcbn1cclxuLyoqXHJcbiAqXHJcbiAqIEBwYXJhbSBhcHBcclxuICogQHBhcmFtIGNvbnRhaW5lciAtIElkIG9mIGEgSFRNTCBlbGVtZW50LlxyXG4gKi9cclxuZnVuY3Rpb24gcmVuZGVySW52aXNpYmxlV2lkZ2V0KGFwcCwgc2l0ZUtleSwgZ3JlY2FwdGNoYSwgY29udGFpbmVyKSB7XHJcbiAgICBjb25zdCB3aWRnZXRJZCA9IGdyZWNhcHRjaGEucmVuZGVyKGNvbnRhaW5lciwge1xyXG4gICAgICAgIHNpdGVrZXk6IHNpdGVLZXksXHJcbiAgICAgICAgc2l6ZTogJ2ludmlzaWJsZScsXHJcbiAgICAgICAgLy8gU3VjY2VzcyBjYWxsYmFjayAtIHNldCBzdGF0ZVxyXG4gICAgICAgIGNhbGxiYWNrOiAoKSA9PiB7XHJcbiAgICAgICAgICAgIGdldFN0YXRlUmVmZXJlbmNlKGFwcCkucmVDQVBUQ0hBU3RhdGUuc3VjY2VlZGVkID0gdHJ1ZTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIC8vIEZhaWx1cmUgY2FsbGJhY2sgLSBzZXQgc3RhdGVcclxuICAgICAgICAnZXJyb3ItY2FsbGJhY2snOiAoKSA9PiB7XHJcbiAgICAgICAgICAgIGdldFN0YXRlUmVmZXJlbmNlKGFwcCkucmVDQVBUQ0hBU3RhdGUuc3VjY2VlZGVkID0gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcbiAgICBjb25zdCBzdGF0ZSA9IGdldFN0YXRlUmVmZXJlbmNlKGFwcCk7XHJcbiAgICBzdGF0ZS5yZUNBUFRDSEFTdGF0ZSA9IE9iamVjdC5hc3NpZ24oT2JqZWN0LmFzc2lnbih7fSwgc3RhdGUucmVDQVBUQ0hBU3RhdGUpLCB7IC8vIHN0YXRlLnJlQ0FQVENIQVN0YXRlIGlzIHNldCBpbiB0aGUgaW5pdGlhbGl6ZSgpXHJcbiAgICAgICAgd2lkZ2V0SWQgfSk7XHJcbn1cclxuZnVuY3Rpb24gbG9hZFJlQ0FQVENIQVYzU2NyaXB0KG9ubG9hZCkge1xyXG4gICAgY29uc3Qgc2NyaXB0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc2NyaXB0Jyk7XHJcbiAgICBzY3JpcHQuc3JjID0gUkVDQVBUQ0hBX1VSTDtcclxuICAgIHNjcmlwdC5vbmxvYWQgPSBvbmxvYWQ7XHJcbiAgICBkb2N1bWVudC5oZWFkLmFwcGVuZENoaWxkKHNjcmlwdCk7XHJcbn1cclxuZnVuY3Rpb24gbG9hZFJlQ0FQVENIQUVudGVycHJpc2VTY3JpcHQob25sb2FkKSB7XHJcbiAgICBjb25zdCBzY3JpcHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzY3JpcHQnKTtcclxuICAgIHNjcmlwdC5zcmMgPSBSRUNBUFRDSEFfRU5URVJQUklTRV9VUkw7XHJcbiAgICBzY3JpcHQub25sb2FkID0gb25sb2FkO1xyXG4gICAgZG9jdW1lbnQuaGVhZC5hcHBlbmRDaGlsZChzY3JpcHQpO1xyXG59XG5cbi8qKlxyXG4gKiBAbGljZW5zZVxyXG4gKiBDb3B5cmlnaHQgMjAyMSBHb29nbGUgTExDXHJcbiAqXHJcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XHJcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cclxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XHJcbiAqXHJcbiAqICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXHJcbiAqXHJcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcclxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxyXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cclxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxyXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cclxuICovXHJcbi8qKlxyXG4gKiBBcHAgQ2hlY2sgcHJvdmlkZXIgdGhhdCBjYW4gb2J0YWluIGEgcmVDQVBUQ0hBIFYzIHRva2VuIGFuZCBleGNoYW5nZSBpdFxyXG4gKiBmb3IgYW4gQXBwIENoZWNrIHRva2VuLlxyXG4gKlxyXG4gKiBAcHVibGljXHJcbiAqL1xyXG5jbGFzcyBSZUNhcHRjaGFWM1Byb3ZpZGVyIHtcclxuICAgIC8qKlxyXG4gICAgICogQ3JlYXRlIGEgUmVDYXB0Y2hhVjNQcm92aWRlciBpbnN0YW5jZS5cclxuICAgICAqIEBwYXJhbSBzaXRlS2V5IC0gUmVDQVBUQ0hBIFYzIHNpdGVLZXkuXHJcbiAgICAgKi9cclxuICAgIGNvbnN0cnVjdG9yKF9zaXRlS2V5KSB7XHJcbiAgICAgICAgdGhpcy5fc2l0ZUtleSA9IF9zaXRlS2V5O1xyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIFRocm90dGxlIHJlcXVlc3RzIG9uIGNlcnRhaW4gZXJyb3IgY29kZXMgdG8gcHJldmVudCB0b28gbWFueSByZXRyaWVzXHJcbiAgICAgICAgICogaW4gYSBzaG9ydCB0aW1lLlxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHRoaXMuX3Rocm90dGxlRGF0YSA9IG51bGw7XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIFJldHVybnMgYW4gQXBwIENoZWNrIHRva2VuLlxyXG4gICAgICogQGludGVybmFsXHJcbiAgICAgKi9cclxuICAgIGFzeW5jIGdldFRva2VuKCkge1xyXG4gICAgICAgIHZhciBfYSwgX2IsIF9jO1xyXG4gICAgICAgIHRocm93SWZUaHJvdHRsZWQodGhpcy5fdGhyb3R0bGVEYXRhKTtcclxuICAgICAgICAvLyBUb3AtbGV2ZWwgYGdldFRva2VuKClgIGhhcyBhbHJlYWR5IGNoZWNrZWQgdGhhdCBBcHAgQ2hlY2sgaXMgaW5pdGlhbGl6ZWRcclxuICAgICAgICAvLyBhbmQgdGhlcmVmb3JlIHRoaXMuX2FwcCBhbmQgdGhpcy5faGVhcnRiZWF0U2VydmljZVByb3ZpZGVyIGFyZSBhdmFpbGFibGUuXHJcbiAgICAgICAgY29uc3QgYXR0ZXN0ZWRDbGFpbXNUb2tlbiA9IGF3YWl0IGdldFRva2VuJDEodGhpcy5fYXBwKS5jYXRjaChfZSA9PiB7XHJcbiAgICAgICAgICAgIC8vIHJlQ2FwdGNoYS5leGVjdXRlKCkgdGhyb3dzIG51bGwgd2hpY2ggaXMgbm90IHZlcnkgZGVzY3JpcHRpdmUuXHJcbiAgICAgICAgICAgIHRocm93IEVSUk9SX0ZBQ1RPUlkuY3JlYXRlKFwicmVjYXB0Y2hhLWVycm9yXCIgLyogQXBwQ2hlY2tFcnJvci5SRUNBUFRDSEFfRVJST1IgKi8pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIC8vIENoZWNrIGlmIGEgZmFpbHVyZSBzdGF0ZSB3YXMgc2V0IGJ5IHRoZSByZWNhcHRjaGEgXCJlcnJvci1jYWxsYmFja1wiLlxyXG4gICAgICAgIGlmICghKChfYSA9IGdldFN0YXRlUmVmZXJlbmNlKHRoaXMuX2FwcCkucmVDQVBUQ0hBU3RhdGUpID09PSBudWxsIHx8IF9hID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYS5zdWNjZWVkZWQpKSB7XHJcbiAgICAgICAgICAgIHRocm93IEVSUk9SX0ZBQ1RPUlkuY3JlYXRlKFwicmVjYXB0Y2hhLWVycm9yXCIgLyogQXBwQ2hlY2tFcnJvci5SRUNBUFRDSEFfRVJST1IgKi8pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBsZXQgcmVzdWx0O1xyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIHJlc3VsdCA9IGF3YWl0IGV4Y2hhbmdlVG9rZW4oZ2V0RXhjaGFuZ2VSZWNhcHRjaGFWM1Rva2VuUmVxdWVzdCh0aGlzLl9hcHAsIGF0dGVzdGVkQ2xhaW1zVG9rZW4pLCB0aGlzLl9oZWFydGJlYXRTZXJ2aWNlUHJvdmlkZXIpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjYXRjaCAoZSkge1xyXG4gICAgICAgICAgICBpZiAoKF9iID0gZS5jb2RlKSA9PT0gbnVsbCB8fCBfYiA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2IuaW5jbHVkZXMoXCJmZXRjaC1zdGF0dXMtZXJyb3JcIiAvKiBBcHBDaGVja0Vycm9yLkZFVENIX1NUQVRVU19FUlJPUiAqLykpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX3Rocm90dGxlRGF0YSA9IHNldEJhY2tvZmYoTnVtYmVyKChfYyA9IGUuY3VzdG9tRGF0YSkgPT09IG51bGwgfHwgX2MgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9jLmh0dHBTdGF0dXMpLCB0aGlzLl90aHJvdHRsZURhdGEpO1xyXG4gICAgICAgICAgICAgICAgdGhyb3cgRVJST1JfRkFDVE9SWS5jcmVhdGUoXCJ0aHJvdHRsZWRcIiAvKiBBcHBDaGVja0Vycm9yLlRIUk9UVExFRCAqLywge1xyXG4gICAgICAgICAgICAgICAgICAgIHRpbWU6IGdldER1cmF0aW9uU3RyaW5nKHRoaXMuX3Rocm90dGxlRGF0YS5hbGxvd1JlcXVlc3RzQWZ0ZXIgLSBEYXRlLm5vdygpKSxcclxuICAgICAgICAgICAgICAgICAgICBodHRwU3RhdHVzOiB0aGlzLl90aHJvdHRsZURhdGEuaHR0cFN0YXR1c1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aHJvdyBlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIElmIHN1Y2Nlc3NmdWwsIGNsZWFyIHRocm90dGxlIGRhdGEuXHJcbiAgICAgICAgdGhpcy5fdGhyb3R0bGVEYXRhID0gbnVsbDtcclxuICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiBAaW50ZXJuYWxcclxuICAgICAqL1xyXG4gICAgaW5pdGlhbGl6ZShhcHApIHtcclxuICAgICAgICB0aGlzLl9hcHAgPSBhcHA7XHJcbiAgICAgICAgdGhpcy5faGVhcnRiZWF0U2VydmljZVByb3ZpZGVyID0gX2dldFByb3ZpZGVyKGFwcCwgJ2hlYXJ0YmVhdCcpO1xyXG4gICAgICAgIGluaXRpYWxpemVWMyhhcHAsIHRoaXMuX3NpdGVLZXkpLmNhdGNoKCgpID0+IHtcclxuICAgICAgICAgICAgLyogd2UgZG9uJ3QgY2FyZSBhYm91dCB0aGUgaW5pdGlhbGl6YXRpb24gcmVzdWx0ICovXHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIEBpbnRlcm5hbFxyXG4gICAgICovXHJcbiAgICBpc0VxdWFsKG90aGVyUHJvdmlkZXIpIHtcclxuICAgICAgICBpZiAob3RoZXJQcm92aWRlciBpbnN0YW5jZW9mIFJlQ2FwdGNoYVYzUHJvdmlkZXIpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3NpdGVLZXkgPT09IG90aGVyUHJvdmlkZXIuX3NpdGVLZXk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbi8qKlxyXG4gKiBBcHAgQ2hlY2sgcHJvdmlkZXIgdGhhdCBjYW4gb2J0YWluIGEgcmVDQVBUQ0hBIEVudGVycHJpc2UgdG9rZW4gYW5kIGV4Y2hhbmdlIGl0XHJcbiAqIGZvciBhbiBBcHAgQ2hlY2sgdG9rZW4uXHJcbiAqXHJcbiAqIEBwdWJsaWNcclxuICovXHJcbmNsYXNzIFJlQ2FwdGNoYUVudGVycHJpc2VQcm92aWRlciB7XHJcbiAgICAvKipcclxuICAgICAqIENyZWF0ZSBhIFJlQ2FwdGNoYUVudGVycHJpc2VQcm92aWRlciBpbnN0YW5jZS5cclxuICAgICAqIEBwYXJhbSBzaXRlS2V5IC0gcmVDQVBUQ0hBIEVudGVycHJpc2Ugc2NvcmUtYmFzZWQgc2l0ZSBrZXkuXHJcbiAgICAgKi9cclxuICAgIGNvbnN0cnVjdG9yKF9zaXRlS2V5KSB7XHJcbiAgICAgICAgdGhpcy5fc2l0ZUtleSA9IF9zaXRlS2V5O1xyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIFRocm90dGxlIHJlcXVlc3RzIG9uIGNlcnRhaW4gZXJyb3IgY29kZXMgdG8gcHJldmVudCB0b28gbWFueSByZXRyaWVzXHJcbiAgICAgICAgICogaW4gYSBzaG9ydCB0aW1lLlxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHRoaXMuX3Rocm90dGxlRGF0YSA9IG51bGw7XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIFJldHVybnMgYW4gQXBwIENoZWNrIHRva2VuLlxyXG4gICAgICogQGludGVybmFsXHJcbiAgICAgKi9cclxuICAgIGFzeW5jIGdldFRva2VuKCkge1xyXG4gICAgICAgIHZhciBfYSwgX2IsIF9jO1xyXG4gICAgICAgIHRocm93SWZUaHJvdHRsZWQodGhpcy5fdGhyb3R0bGVEYXRhKTtcclxuICAgICAgICAvLyBUb3AtbGV2ZWwgYGdldFRva2VuKClgIGhhcyBhbHJlYWR5IGNoZWNrZWQgdGhhdCBBcHAgQ2hlY2sgaXMgaW5pdGlhbGl6ZWRcclxuICAgICAgICAvLyBhbmQgdGhlcmVmb3JlIHRoaXMuX2FwcCBhbmQgdGhpcy5faGVhcnRiZWF0U2VydmljZVByb3ZpZGVyIGFyZSBhdmFpbGFibGUuXHJcbiAgICAgICAgY29uc3QgYXR0ZXN0ZWRDbGFpbXNUb2tlbiA9IGF3YWl0IGdldFRva2VuJDEodGhpcy5fYXBwKS5jYXRjaChfZSA9PiB7XHJcbiAgICAgICAgICAgIC8vIHJlQ2FwdGNoYS5leGVjdXRlKCkgdGhyb3dzIG51bGwgd2hpY2ggaXMgbm90IHZlcnkgZGVzY3JpcHRpdmUuXHJcbiAgICAgICAgICAgIHRocm93IEVSUk9SX0ZBQ1RPUlkuY3JlYXRlKFwicmVjYXB0Y2hhLWVycm9yXCIgLyogQXBwQ2hlY2tFcnJvci5SRUNBUFRDSEFfRVJST1IgKi8pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIC8vIENoZWNrIGlmIGEgZmFpbHVyZSBzdGF0ZSB3YXMgc2V0IGJ5IHRoZSByZWNhcHRjaGEgXCJlcnJvci1jYWxsYmFja1wiLlxyXG4gICAgICAgIGlmICghKChfYSA9IGdldFN0YXRlUmVmZXJlbmNlKHRoaXMuX2FwcCkucmVDQVBUQ0hBU3RhdGUpID09PSBudWxsIHx8IF9hID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYS5zdWNjZWVkZWQpKSB7XHJcbiAgICAgICAgICAgIHRocm93IEVSUk9SX0ZBQ1RPUlkuY3JlYXRlKFwicmVjYXB0Y2hhLWVycm9yXCIgLyogQXBwQ2hlY2tFcnJvci5SRUNBUFRDSEFfRVJST1IgKi8pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBsZXQgcmVzdWx0O1xyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIHJlc3VsdCA9IGF3YWl0IGV4Y2hhbmdlVG9rZW4oZ2V0RXhjaGFuZ2VSZWNhcHRjaGFFbnRlcnByaXNlVG9rZW5SZXF1ZXN0KHRoaXMuX2FwcCwgYXR0ZXN0ZWRDbGFpbXNUb2tlbiksIHRoaXMuX2hlYXJ0YmVhdFNlcnZpY2VQcm92aWRlcik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNhdGNoIChlKSB7XHJcbiAgICAgICAgICAgIGlmICgoX2IgPSBlLmNvZGUpID09PSBudWxsIHx8IF9iID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYi5pbmNsdWRlcyhcImZldGNoLXN0YXR1cy1lcnJvclwiIC8qIEFwcENoZWNrRXJyb3IuRkVUQ0hfU1RBVFVTX0VSUk9SICovKSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fdGhyb3R0bGVEYXRhID0gc2V0QmFja29mZihOdW1iZXIoKF9jID0gZS5jdXN0b21EYXRhKSA9PT0gbnVsbCB8fCBfYyA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2MuaHR0cFN0YXR1cyksIHRoaXMuX3Rocm90dGxlRGF0YSk7XHJcbiAgICAgICAgICAgICAgICB0aHJvdyBFUlJPUl9GQUNUT1JZLmNyZWF0ZShcInRocm90dGxlZFwiIC8qIEFwcENoZWNrRXJyb3IuVEhST1RUTEVEICovLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGltZTogZ2V0RHVyYXRpb25TdHJpbmcodGhpcy5fdGhyb3R0bGVEYXRhLmFsbG93UmVxdWVzdHNBZnRlciAtIERhdGUubm93KCkpLFxyXG4gICAgICAgICAgICAgICAgICAgIGh0dHBTdGF0dXM6IHRoaXMuX3Rocm90dGxlRGF0YS5odHRwU3RhdHVzXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRocm93IGU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gSWYgc3VjY2Vzc2Z1bCwgY2xlYXIgdGhyb3R0bGUgZGF0YS5cclxuICAgICAgICB0aGlzLl90aHJvdHRsZURhdGEgPSBudWxsO1xyXG4gICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIEBpbnRlcm5hbFxyXG4gICAgICovXHJcbiAgICBpbml0aWFsaXplKGFwcCkge1xyXG4gICAgICAgIHRoaXMuX2FwcCA9IGFwcDtcclxuICAgICAgICB0aGlzLl9oZWFydGJlYXRTZXJ2aWNlUHJvdmlkZXIgPSBfZ2V0UHJvdmlkZXIoYXBwLCAnaGVhcnRiZWF0Jyk7XHJcbiAgICAgICAgaW5pdGlhbGl6ZUVudGVycHJpc2UoYXBwLCB0aGlzLl9zaXRlS2V5KS5jYXRjaCgoKSA9PiB7XHJcbiAgICAgICAgICAgIC8qIHdlIGRvbid0IGNhcmUgYWJvdXQgdGhlIGluaXRpYWxpemF0aW9uIHJlc3VsdCAqL1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiBAaW50ZXJuYWxcclxuICAgICAqL1xyXG4gICAgaXNFcXVhbChvdGhlclByb3ZpZGVyKSB7XHJcbiAgICAgICAgaWYgKG90aGVyUHJvdmlkZXIgaW5zdGFuY2VvZiBSZUNhcHRjaGFFbnRlcnByaXNlUHJvdmlkZXIpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3NpdGVLZXkgPT09IG90aGVyUHJvdmlkZXIuX3NpdGVLZXk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbi8qKlxyXG4gKiBDdXN0b20gcHJvdmlkZXIgY2xhc3MuXHJcbiAqIEBwdWJsaWNcclxuICovXHJcbmNsYXNzIEN1c3RvbVByb3ZpZGVyIHtcclxuICAgIGNvbnN0cnVjdG9yKF9jdXN0b21Qcm92aWRlck9wdGlvbnMpIHtcclxuICAgICAgICB0aGlzLl9jdXN0b21Qcm92aWRlck9wdGlvbnMgPSBfY3VzdG9tUHJvdmlkZXJPcHRpb25zO1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiBAaW50ZXJuYWxcclxuICAgICAqL1xyXG4gICAgYXN5bmMgZ2V0VG9rZW4oKSB7XHJcbiAgICAgICAgLy8gY3VzdG9tIHByb3ZpZGVyXHJcbiAgICAgICAgY29uc3QgY3VzdG9tVG9rZW4gPSBhd2FpdCB0aGlzLl9jdXN0b21Qcm92aWRlck9wdGlvbnMuZ2V0VG9rZW4oKTtcclxuICAgICAgICAvLyBUcnkgdG8gZXh0cmFjdCBJQVQgZnJvbSBjdXN0b20gdG9rZW4sIGluIGNhc2UgdGhpcyB0b2tlbiBpcyBub3RcclxuICAgICAgICAvLyBiZWluZyBuZXdseSBpc3N1ZWQuIEpXVCB0aW1lc3RhbXBzIGFyZSBpbiBzZWNvbmRzIHNpbmNlIGVwb2NoLlxyXG4gICAgICAgIGNvbnN0IGlzc3VlZEF0VGltZVNlY29uZHMgPSBpc3N1ZWRBdFRpbWUoY3VzdG9tVG9rZW4udG9rZW4pO1xyXG4gICAgICAgIC8vIFZlcnkgYmFzaWMgdmFsaWRhdGlvbiwgdXNlIGN1cnJlbnQgdGltZXN0YW1wIGFzIElBVCBpZiBKV1RcclxuICAgICAgICAvLyBoYXMgbm8gYGlhdGAgZmllbGQgb3IgdmFsdWUgaXMgb3V0IG9mIGJvdW5kcy5cclxuICAgICAgICBjb25zdCBpc3N1ZWRBdFRpbWVNaWxsaXMgPSBpc3N1ZWRBdFRpbWVTZWNvbmRzICE9PSBudWxsICYmXHJcbiAgICAgICAgICAgIGlzc3VlZEF0VGltZVNlY29uZHMgPCBEYXRlLm5vdygpICYmXHJcbiAgICAgICAgICAgIGlzc3VlZEF0VGltZVNlY29uZHMgPiAwXHJcbiAgICAgICAgICAgID8gaXNzdWVkQXRUaW1lU2Vjb25kcyAqIDEwMDBcclxuICAgICAgICAgICAgOiBEYXRlLm5vdygpO1xyXG4gICAgICAgIHJldHVybiBPYmplY3QuYXNzaWduKE9iamVjdC5hc3NpZ24oe30sIGN1c3RvbVRva2VuKSwgeyBpc3N1ZWRBdFRpbWVNaWxsaXMgfSk7XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIEBpbnRlcm5hbFxyXG4gICAgICovXHJcbiAgICBpbml0aWFsaXplKGFwcCkge1xyXG4gICAgICAgIHRoaXMuX2FwcCA9IGFwcDtcclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICogQGludGVybmFsXHJcbiAgICAgKi9cclxuICAgIGlzRXF1YWwob3RoZXJQcm92aWRlcikge1xyXG4gICAgICAgIGlmIChvdGhlclByb3ZpZGVyIGluc3RhbmNlb2YgQ3VzdG9tUHJvdmlkZXIpIHtcclxuICAgICAgICAgICAgcmV0dXJuICh0aGlzLl9jdXN0b21Qcm92aWRlck9wdGlvbnMuZ2V0VG9rZW4udG9TdHJpbmcoKSA9PT1cclxuICAgICAgICAgICAgICAgIG90aGVyUHJvdmlkZXIuX2N1c3RvbVByb3ZpZGVyT3B0aW9ucy5nZXRUb2tlbi50b1N0cmluZygpKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuLyoqXHJcbiAqIFNldCB0aHJvdHRsZSBkYXRhIHRvIGJsb2NrIHJlcXVlc3RzIHVudGlsIGFmdGVyIGEgY2VydGFpbiB0aW1lXHJcbiAqIGRlcGVuZGluZyBvbiB0aGUgZmFpbGVkIHJlcXVlc3QncyBzdGF0dXMgY29kZS5cclxuICogQHBhcmFtIGh0dHBTdGF0dXMgLSBTdGF0dXMgY29kZSBvZiBmYWlsZWQgcmVxdWVzdC5cclxuICogQHBhcmFtIHRocm90dGxlRGF0YSAtIGBUaHJvdHRsZURhdGFgIG9iamVjdCBjb250YWluaW5nIHByZXZpb3VzIHRocm90dGxlXHJcbiAqIGRhdGEgc3RhdGUuXHJcbiAqIEByZXR1cm5zIERhdGEgYWJvdXQgY3VycmVudCB0aHJvdHRsZSBzdGF0ZSBhbmQgZXhwaXJhdGlvbiB0aW1lLlxyXG4gKi9cclxuZnVuY3Rpb24gc2V0QmFja29mZihodHRwU3RhdHVzLCB0aHJvdHRsZURhdGEpIHtcclxuICAgIC8qKlxyXG4gICAgICogQmxvY2sgcmV0cmllcyBmb3IgMSBkYXkgZm9yIHRoZSBmb2xsb3dpbmcgZXJyb3IgY29kZXM6XHJcbiAgICAgKlxyXG4gICAgICogNDA0OiBMaWtlbHkgbWFsZm9ybWVkIFVSTC5cclxuICAgICAqXHJcbiAgICAgKiA0MDM6XHJcbiAgICAgKiAtIEF0dGVzdGF0aW9uIGZhaWxlZFxyXG4gICAgICogLSBXcm9uZyBBUEkga2V5XHJcbiAgICAgKiAtIFByb2plY3QgZGVsZXRlZFxyXG4gICAgICovXHJcbiAgICBpZiAoaHR0cFN0YXR1cyA9PT0gNDA0IHx8IGh0dHBTdGF0dXMgPT09IDQwMykge1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIGJhY2tvZmZDb3VudDogMSxcclxuICAgICAgICAgICAgYWxsb3dSZXF1ZXN0c0FmdGVyOiBEYXRlLm5vdygpICsgT05FX0RBWSxcclxuICAgICAgICAgICAgaHR0cFN0YXR1c1xyXG4gICAgICAgIH07XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBGb3IgYWxsIG90aGVyIGVycm9yIGNvZGVzLCB0aGUgdGltZSB3aGVuIGl0IGlzIG9rIHRvIHJldHJ5IGFnYWluXHJcbiAgICAgICAgICogaXMgYmFzZWQgb24gZXhwb25lbnRpYWwgYmFja29mZi5cclxuICAgICAgICAgKi9cclxuICAgICAgICBjb25zdCBiYWNrb2ZmQ291bnQgPSB0aHJvdHRsZURhdGEgPyB0aHJvdHRsZURhdGEuYmFja29mZkNvdW50IDogMDtcclxuICAgICAgICBjb25zdCBiYWNrb2ZmTWlsbGlzID0gY2FsY3VsYXRlQmFja29mZk1pbGxpcyhiYWNrb2ZmQ291bnQsIDEwMDAsIDIpO1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIGJhY2tvZmZDb3VudDogYmFja29mZkNvdW50ICsgMSxcclxuICAgICAgICAgICAgYWxsb3dSZXF1ZXN0c0FmdGVyOiBEYXRlLm5vdygpICsgYmFja29mZk1pbGxpcyxcclxuICAgICAgICAgICAgaHR0cFN0YXR1c1xyXG4gICAgICAgIH07XHJcbiAgICB9XHJcbn1cclxuZnVuY3Rpb24gdGhyb3dJZlRocm90dGxlZCh0aHJvdHRsZURhdGEpIHtcclxuICAgIGlmICh0aHJvdHRsZURhdGEpIHtcclxuICAgICAgICBpZiAoRGF0ZS5ub3coKSAtIHRocm90dGxlRGF0YS5hbGxvd1JlcXVlc3RzQWZ0ZXIgPD0gMCkge1xyXG4gICAgICAgICAgICAvLyBJZiBiZWZvcmUsIHRocm93LlxyXG4gICAgICAgICAgICB0aHJvdyBFUlJPUl9GQUNUT1JZLmNyZWF0ZShcInRocm90dGxlZFwiIC8qIEFwcENoZWNrRXJyb3IuVEhST1RUTEVEICovLCB7XHJcbiAgICAgICAgICAgICAgICB0aW1lOiBnZXREdXJhdGlvblN0cmluZyh0aHJvdHRsZURhdGEuYWxsb3dSZXF1ZXN0c0FmdGVyIC0gRGF0ZS5ub3coKSksXHJcbiAgICAgICAgICAgICAgICBodHRwU3RhdHVzOiB0aHJvdHRsZURhdGEuaHR0cFN0YXR1c1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cblxuLyoqXHJcbiAqIEBsaWNlbnNlXHJcbiAqIENvcHlyaWdodCAyMDIwIEdvb2dsZSBMTENcclxuICpcclxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcclxuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxyXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcclxuICpcclxuICogICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcclxuICpcclxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxyXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXHJcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxyXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXHJcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxyXG4gKi9cclxuLyoqXHJcbiAqIEFjdGl2YXRlIEFwcCBDaGVjayBmb3IgdGhlIGdpdmVuIGFwcC4gQ2FuIGJlIGNhbGxlZCBvbmx5IG9uY2UgcGVyIGFwcC5cclxuICogQHBhcmFtIGFwcCAtIHRoZSB7QGxpbmsgQGZpcmViYXNlL2FwcCNGaXJlYmFzZUFwcH0gdG8gYWN0aXZhdGUgQXBwIENoZWNrIGZvclxyXG4gKiBAcGFyYW0gb3B0aW9ucyAtIEFwcCBDaGVjayBpbml0aWFsaXphdGlvbiBvcHRpb25zXHJcbiAqIEBwdWJsaWNcclxuICovXHJcbmZ1bmN0aW9uIGluaXRpYWxpemVBcHBDaGVjayhhcHAgPSBnZXRBcHAoKSwgb3B0aW9ucykge1xyXG4gICAgYXBwID0gZ2V0TW9kdWxhckluc3RhbmNlKGFwcCk7XHJcbiAgICBjb25zdCBwcm92aWRlciA9IF9nZXRQcm92aWRlcihhcHAsICdhcHAtY2hlY2snKTtcclxuICAgIC8vIEVuc3VyZSBpbml0aWFsaXplRGVidWdNb2RlKCkgaXMgb25seSBjYWxsZWQgb25jZS5cclxuICAgIGlmICghZ2V0RGVidWdTdGF0ZSgpLmluaXRpYWxpemVkKSB7XHJcbiAgICAgICAgaW5pdGlhbGl6ZURlYnVnTW9kZSgpO1xyXG4gICAgfVxyXG4gICAgLy8gTG9nIGEgbWVzc2FnZSBjb250YWluaW5nIHRoZSBkZWJ1ZyB0b2tlbiB3aGVuIGBpbml0aWFsaXplQXBwQ2hlY2soKWBcclxuICAgIC8vIGlzIGNhbGxlZCBpbiBkZWJ1ZyBtb2RlLlxyXG4gICAgaWYgKGlzRGVidWdNb2RlKCkpIHtcclxuICAgICAgICAvLyBEbyBub3QgYmxvY2sgaW5pdGlhbGl6YXRpb24gdG8gZ2V0IHRoZSB0b2tlbiBmb3IgdGhlIG1lc3NhZ2UuXHJcbiAgICAgICAgdm9pZCBnZXREZWJ1Z1Rva2VuKCkudGhlbih0b2tlbiA9PiBcclxuICAgICAgICAvLyBOb3QgdXNpbmcgbG9nZ2VyIGJlY2F1c2UgSSBkb24ndCB0aGluayB3ZSBldmVyIHdhbnQgdGhpcyBhY2NpZGVudGFsbHkgaGlkZGVuLlxyXG4gICAgICAgIGNvbnNvbGUubG9nKGBBcHAgQ2hlY2sgZGVidWcgdG9rZW46ICR7dG9rZW59LiBZb3Ugd2lsbCBuZWVkIHRvIGFkZCBpdCB0byB5b3VyIGFwcCdzIEFwcCBDaGVjayBzZXR0aW5ncyBpbiB0aGUgRmlyZWJhc2UgY29uc29sZSBmb3IgaXQgdG8gd29yay5gKSk7XHJcbiAgICB9XHJcbiAgICBpZiAocHJvdmlkZXIuaXNJbml0aWFsaXplZCgpKSB7XHJcbiAgICAgICAgY29uc3QgZXhpc3RpbmdJbnN0YW5jZSA9IHByb3ZpZGVyLmdldEltbWVkaWF0ZSgpO1xyXG4gICAgICAgIGNvbnN0IGluaXRpYWxPcHRpb25zID0gcHJvdmlkZXIuZ2V0T3B0aW9ucygpO1xyXG4gICAgICAgIGlmIChpbml0aWFsT3B0aW9ucy5pc1Rva2VuQXV0b1JlZnJlc2hFbmFibGVkID09PVxyXG4gICAgICAgICAgICBvcHRpb25zLmlzVG9rZW5BdXRvUmVmcmVzaEVuYWJsZWQgJiZcclxuICAgICAgICAgICAgaW5pdGlhbE9wdGlvbnMucHJvdmlkZXIuaXNFcXVhbChvcHRpb25zLnByb3ZpZGVyKSkge1xyXG4gICAgICAgICAgICByZXR1cm4gZXhpc3RpbmdJbnN0YW5jZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIHRocm93IEVSUk9SX0ZBQ1RPUlkuY3JlYXRlKFwiYWxyZWFkeS1pbml0aWFsaXplZFwiIC8qIEFwcENoZWNrRXJyb3IuQUxSRUFEWV9JTklUSUFMSVpFRCAqLywge1xyXG4gICAgICAgICAgICAgICAgYXBwTmFtZTogYXBwLm5hbWVcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgY29uc3QgYXBwQ2hlY2sgPSBwcm92aWRlci5pbml0aWFsaXplKHsgb3B0aW9ucyB9KTtcclxuICAgIF9hY3RpdmF0ZShhcHAsIG9wdGlvbnMucHJvdmlkZXIsIG9wdGlvbnMuaXNUb2tlbkF1dG9SZWZyZXNoRW5hYmxlZCk7XHJcbiAgICAvLyBJZiBpc1Rva2VuQXV0b1JlZnJlc2hFbmFibGVkIGlzIGZhbHNlLCBkbyBub3Qgc2VuZCBhbnkgcmVxdWVzdHMgdG8gdGhlXHJcbiAgICAvLyBleGNoYW5nZSBlbmRwb2ludCB3aXRob3V0IGFuIGV4cGxpY2l0IGNhbGwgZnJvbSB0aGUgdXNlciBlaXRoZXIgZGlyZWN0bHlcclxuICAgIC8vIG9yIHRocm91Z2ggYW5vdGhlciBGaXJlYmFzZSBsaWJyYXJ5IChzdG9yYWdlLCBmdW5jdGlvbnMsIGV0Yy4pXHJcbiAgICBpZiAoZ2V0U3RhdGVSZWZlcmVuY2UoYXBwKS5pc1Rva2VuQXV0b1JlZnJlc2hFbmFibGVkKSB7XHJcbiAgICAgICAgLy8gQWRkaW5nIGEgbGlzdGVuZXIgd2lsbCBzdGFydCB0aGUgcmVmcmVzaGVyIGFuZCBmZXRjaCBhIHRva2VuIGlmIG5lZWRlZC5cclxuICAgICAgICAvLyBUaGlzIGdldHMgYSB0b2tlbiByZWFkeSBhbmQgcHJldmVudHMgYSBkZWxheSB3aGVuIGFuIGludGVybmFsIGxpYnJhcnlcclxuICAgICAgICAvLyByZXF1ZXN0cyB0aGUgdG9rZW4uXHJcbiAgICAgICAgLy8gTGlzdGVuZXIgZnVuY3Rpb24gZG9lcyBub3QgbmVlZCB0byBkbyBhbnl0aGluZywgaXRzIGJhc2UgZnVuY3Rpb25hbGl0eVxyXG4gICAgICAgIC8vIG9mIGNhbGxpbmcgZ2V0VG9rZW4oKSBhbHJlYWR5IGZldGNoZXMgdG9rZW4gYW5kIHdyaXRlcyBpdCB0byBtZW1vcnkvc3RvcmFnZS5cclxuICAgICAgICBhZGRUb2tlbkxpc3RlbmVyKGFwcENoZWNrLCBcIklOVEVSTkFMXCIgLyogTGlzdGVuZXJUeXBlLklOVEVSTkFMICovLCAoKSA9PiB7IH0pO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGFwcENoZWNrO1xyXG59XHJcbi8qKlxyXG4gKiBBY3RpdmF0ZSBBcHAgQ2hlY2tcclxuICogQHBhcmFtIGFwcCAtIEZpcmViYXNlIGFwcCB0byBhY3RpdmF0ZSBBcHAgQ2hlY2sgZm9yLlxyXG4gKiBAcGFyYW0gcHJvdmlkZXIgLSByZUNBUFRDSEEgdjMgcHJvdmlkZXIgb3JcclxuICogY3VzdG9tIHRva2VuIHByb3ZpZGVyLlxyXG4gKiBAcGFyYW0gaXNUb2tlbkF1dG9SZWZyZXNoRW5hYmxlZCAtIElmIHRydWUsIHRoZSBTREsgYXV0b21hdGljYWxseVxyXG4gKiByZWZyZXNoZXMgQXBwIENoZWNrIHRva2VucyBhcyBuZWVkZWQuIElmIHVuZGVmaW5lZCwgZGVmYXVsdHMgdG8gdGhlXHJcbiAqIHZhbHVlIG9mIGBhcHAuYXV0b21hdGljRGF0YUNvbGxlY3Rpb25FbmFibGVkYCwgd2hpY2ggZGVmYXVsdHMgdG9cclxuICogZmFsc2UgYW5kIGNhbiBiZSBzZXQgaW4gdGhlIGFwcCBjb25maWcuXHJcbiAqL1xyXG5mdW5jdGlvbiBfYWN0aXZhdGUoYXBwLCBwcm92aWRlciwgaXNUb2tlbkF1dG9SZWZyZXNoRW5hYmxlZCkge1xyXG4gICAgLy8gQ3JlYXRlIGFuIGVudHJ5IGluIHRoZSBBUFBfQ0hFQ0tfU1RBVEVTIG1hcC4gRnVydGhlciBjaGFuZ2VzIHNob3VsZFxyXG4gICAgLy8gZGlyZWN0bHkgbXV0YXRlIHRoaXMgb2JqZWN0LlxyXG4gICAgY29uc3Qgc3RhdGUgPSBzZXRJbml0aWFsU3RhdGUoYXBwLCBPYmplY3QuYXNzaWduKHt9LCBERUZBVUxUX1NUQVRFKSk7XHJcbiAgICBzdGF0ZS5hY3RpdmF0ZWQgPSB0cnVlO1xyXG4gICAgc3RhdGUucHJvdmlkZXIgPSBwcm92aWRlcjsgLy8gUmVhZCBjYWNoZWQgdG9rZW4gZnJvbSBzdG9yYWdlIGlmIGl0IGV4aXN0cyBhbmQgc3RvcmUgaXQgaW4gbWVtb3J5LlxyXG4gICAgc3RhdGUuY2FjaGVkVG9rZW5Qcm9taXNlID0gcmVhZFRva2VuRnJvbVN0b3JhZ2UoYXBwKS50aGVuKGNhY2hlZFRva2VuID0+IHtcclxuICAgICAgICBpZiAoY2FjaGVkVG9rZW4gJiYgaXNWYWxpZChjYWNoZWRUb2tlbikpIHtcclxuICAgICAgICAgICAgc3RhdGUudG9rZW4gPSBjYWNoZWRUb2tlbjtcclxuICAgICAgICAgICAgLy8gbm90aWZ5IGFsbCBsaXN0ZW5lcnMgd2l0aCB0aGUgY2FjaGVkIHRva2VuXHJcbiAgICAgICAgICAgIG5vdGlmeVRva2VuTGlzdGVuZXJzKGFwcCwgeyB0b2tlbjogY2FjaGVkVG9rZW4udG9rZW4gfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBjYWNoZWRUb2tlbjtcclxuICAgIH0pO1xyXG4gICAgLy8gVXNlIHZhbHVlIG9mIGdsb2JhbCBgYXV0b21hdGljRGF0YUNvbGxlY3Rpb25FbmFibGVkYCAod2hpY2hcclxuICAgIC8vIGl0c2VsZiBkZWZhdWx0cyB0byBmYWxzZSBpZiBub3Qgc3BlY2lmaWVkIGluIGNvbmZpZykgaWZcclxuICAgIC8vIGBpc1Rva2VuQXV0b1JlZnJlc2hFbmFibGVkYCBwYXJhbSB3YXMgbm90IHByb3ZpZGVkIGJ5IHVzZXIuXHJcbiAgICBzdGF0ZS5pc1Rva2VuQXV0b1JlZnJlc2hFbmFibGVkID1cclxuICAgICAgICBpc1Rva2VuQXV0b1JlZnJlc2hFbmFibGVkID09PSB1bmRlZmluZWRcclxuICAgICAgICAgICAgPyBhcHAuYXV0b21hdGljRGF0YUNvbGxlY3Rpb25FbmFibGVkXHJcbiAgICAgICAgICAgIDogaXNUb2tlbkF1dG9SZWZyZXNoRW5hYmxlZDtcclxuICAgIHN0YXRlLnByb3ZpZGVyLmluaXRpYWxpemUoYXBwKTtcclxufVxyXG4vKipcclxuICogU2V0IHdoZXRoZXIgQXBwIENoZWNrIHdpbGwgYXV0b21hdGljYWxseSByZWZyZXNoIHRva2VucyBhcyBuZWVkZWQuXHJcbiAqXHJcbiAqIEBwYXJhbSBhcHBDaGVja0luc3RhbmNlIC0gVGhlIEFwcCBDaGVjayBzZXJ2aWNlIGluc3RhbmNlLlxyXG4gKiBAcGFyYW0gaXNUb2tlbkF1dG9SZWZyZXNoRW5hYmxlZCAtIElmIHRydWUsIHRoZSBTREsgYXV0b21hdGljYWxseVxyXG4gKiByZWZyZXNoZXMgQXBwIENoZWNrIHRva2VucyBhcyBuZWVkZWQuIFRoaXMgb3ZlcnJpZGVzIGFueSB2YWx1ZSBzZXRcclxuICogZHVyaW5nIGBpbml0aWFsaXplQXBwQ2hlY2soKWAuXHJcbiAqIEBwdWJsaWNcclxuICovXHJcbmZ1bmN0aW9uIHNldFRva2VuQXV0b1JlZnJlc2hFbmFibGVkKGFwcENoZWNrSW5zdGFuY2UsIGlzVG9rZW5BdXRvUmVmcmVzaEVuYWJsZWQpIHtcclxuICAgIGNvbnN0IGFwcCA9IGFwcENoZWNrSW5zdGFuY2UuYXBwO1xyXG4gICAgY29uc3Qgc3RhdGUgPSBnZXRTdGF0ZVJlZmVyZW5jZShhcHApO1xyXG4gICAgLy8gVGhpcyB3aWxsIGV4aXN0IGlmIGFueSBwcm9kdWN0IGxpYnJhcmllcyBoYXZlIGNhbGxlZFxyXG4gICAgLy8gYGFkZFRva2VuTGlzdGVuZXIoKWBcclxuICAgIGlmIChzdGF0ZS50b2tlblJlZnJlc2hlcikge1xyXG4gICAgICAgIGlmIChpc1Rva2VuQXV0b1JlZnJlc2hFbmFibGVkID09PSB0cnVlKSB7XHJcbiAgICAgICAgICAgIHN0YXRlLnRva2VuUmVmcmVzaGVyLnN0YXJ0KCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBzdGF0ZS50b2tlblJlZnJlc2hlci5zdG9wKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgc3RhdGUuaXNUb2tlbkF1dG9SZWZyZXNoRW5hYmxlZCA9IGlzVG9rZW5BdXRvUmVmcmVzaEVuYWJsZWQ7XHJcbn1cclxuLyoqXHJcbiAqIEdldCB0aGUgY3VycmVudCBBcHAgQ2hlY2sgdG9rZW4uIEF0dGFjaGVzIHRvIHRoZSBtb3N0IHJlY2VudFxyXG4gKiBpbi1mbGlnaHQgcmVxdWVzdCBpZiBvbmUgaXMgcHJlc2VudC4gUmV0dXJucyBudWxsIGlmIG5vIHRva2VuXHJcbiAqIGlzIHByZXNlbnQgYW5kIG5vIHRva2VuIHJlcXVlc3RzIGFyZSBpbi1mbGlnaHQuXHJcbiAqXHJcbiAqIEBwYXJhbSBhcHBDaGVja0luc3RhbmNlIC0gVGhlIEFwcCBDaGVjayBzZXJ2aWNlIGluc3RhbmNlLlxyXG4gKiBAcGFyYW0gZm9yY2VSZWZyZXNoIC0gSWYgdHJ1ZSwgd2lsbCBhbHdheXMgdHJ5IHRvIGZldGNoIGEgZnJlc2ggdG9rZW4uXHJcbiAqIElmIGZhbHNlLCB3aWxsIHVzZSBhIGNhY2hlZCB0b2tlbiBpZiBmb3VuZCBpbiBzdG9yYWdlLlxyXG4gKiBAcHVibGljXHJcbiAqL1xyXG5hc3luYyBmdW5jdGlvbiBnZXRUb2tlbihhcHBDaGVja0luc3RhbmNlLCBmb3JjZVJlZnJlc2gpIHtcclxuICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IGdldFRva2VuJDIoYXBwQ2hlY2tJbnN0YW5jZSwgZm9yY2VSZWZyZXNoKTtcclxuICAgIGlmIChyZXN1bHQuZXJyb3IpIHtcclxuICAgICAgICB0aHJvdyByZXN1bHQuZXJyb3I7XHJcbiAgICB9XHJcbiAgICByZXR1cm4geyB0b2tlbjogcmVzdWx0LnRva2VuIH07XHJcbn1cclxuLyoqXHJcbiAqIFJlcXVlc3RzIGEgRmlyZWJhc2UgQXBwIENoZWNrIHRva2VuLiBUaGlzIG1ldGhvZCBzaG91bGQgYmUgdXNlZFxyXG4gKiBvbmx5IGlmIHlvdSBuZWVkIHRvIGF1dGhvcml6ZSByZXF1ZXN0cyB0byBhIG5vbi1GaXJlYmFzZSBiYWNrZW5kLlxyXG4gKlxyXG4gKiBSZXR1cm5zIGxpbWl0ZWQtdXNlIHRva2VucyB0aGF0IGFyZSBpbnRlbmRlZCBmb3IgdXNlIHdpdGggeW91clxyXG4gKiBub24tRmlyZWJhc2UgYmFja2VuZCBlbmRwb2ludHMgdGhhdCBhcmUgcHJvdGVjdGVkIHdpdGhcclxuICogPGEgaHJlZj1cImh0dHBzOi8vZmlyZWJhc2UuZ29vZ2xlLmNvbS9kb2NzL2FwcC1jaGVjay9jdXN0b20tcmVzb3VyY2UtYmFja2VuZCNyZXBsYXktcHJvdGVjdGlvblwiPlxyXG4gKiBSZXBsYXkgUHJvdGVjdGlvbjwvYT4uIFRoaXMgbWV0aG9kXHJcbiAqIGRvZXMgbm90IGFmZmVjdCB0aGUgdG9rZW4gZ2VuZXJhdGlvbiBiZWhhdmlvciBvZiB0aGVcclxuICogI2dldEFwcENoZWNrVG9rZW4oKSBtZXRob2QuXHJcbiAqXHJcbiAqIEBwYXJhbSBhcHBDaGVja0luc3RhbmNlIC0gVGhlIEFwcCBDaGVjayBzZXJ2aWNlIGluc3RhbmNlLlxyXG4gKiBAcmV0dXJucyBUaGUgbGltaXRlZCB1c2UgdG9rZW4uXHJcbiAqIEBwdWJsaWNcclxuICovXHJcbmZ1bmN0aW9uIGdldExpbWl0ZWRVc2VUb2tlbihhcHBDaGVja0luc3RhbmNlKSB7XHJcbiAgICByZXR1cm4gZ2V0TGltaXRlZFVzZVRva2VuJDEoYXBwQ2hlY2tJbnN0YW5jZSk7XHJcbn1cclxuLyoqXHJcbiAqIFdyYXBzIGBhZGRUb2tlbkxpc3RlbmVyYC9gcmVtb3ZlVG9rZW5MaXN0ZW5lcmAgbWV0aG9kcyBpbiBhbiBgT2JzZXJ2ZXJgXHJcbiAqIHBhdHRlcm4gZm9yIHB1YmxpYyB1c2UuXHJcbiAqL1xyXG5mdW5jdGlvbiBvblRva2VuQ2hhbmdlZChhcHBDaGVja0luc3RhbmNlLCBvbk5leHRPck9ic2VydmVyLCBvbkVycm9yLCBcclxuLyoqXHJcbiAqIE5PVEU6IEFsdGhvdWdoIGFuIGBvbkNvbXBsZXRpb25gIGNhbGxiYWNrIGNhbiBiZSBwcm92aWRlZCwgaXQgd2lsbFxyXG4gKiBuZXZlciBiZSBjYWxsZWQgYmVjYXVzZSB0aGUgdG9rZW4gc3RyZWFtIGlzIG5ldmVyLWVuZGluZy5cclxuICogSXQgaXMgYWRkZWQgb25seSBmb3IgQVBJIGNvbnNpc3RlbmN5IHdpdGggdGhlIG9ic2VydmVyIHBhdHRlcm4sIHdoaWNoXHJcbiAqIHdlIGZvbGxvdyBpbiBKUyBBUElzLlxyXG4gKi9cclxuLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9uby11bnVzZWQtdmFyc1xyXG5vbkNvbXBsZXRpb24pIHtcclxuICAgIGxldCBuZXh0Rm4gPSAoKSA9PiB7IH07XHJcbiAgICBsZXQgZXJyb3JGbiA9ICgpID0+IHsgfTtcclxuICAgIGlmIChvbk5leHRPck9ic2VydmVyLm5leHQgIT0gbnVsbCkge1xyXG4gICAgICAgIG5leHRGbiA9IG9uTmV4dE9yT2JzZXJ2ZXIubmV4dC5iaW5kKG9uTmV4dE9yT2JzZXJ2ZXIpO1xyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgICAgbmV4dEZuID0gb25OZXh0T3JPYnNlcnZlcjtcclxuICAgIH1cclxuICAgIGlmIChvbk5leHRPck9ic2VydmVyLmVycm9yICE9IG51bGwpIHtcclxuICAgICAgICBlcnJvckZuID0gb25OZXh0T3JPYnNlcnZlci5lcnJvci5iaW5kKG9uTmV4dE9yT2JzZXJ2ZXIpO1xyXG4gICAgfVxyXG4gICAgZWxzZSBpZiAob25FcnJvcikge1xyXG4gICAgICAgIGVycm9yRm4gPSBvbkVycm9yO1xyXG4gICAgfVxyXG4gICAgYWRkVG9rZW5MaXN0ZW5lcihhcHBDaGVja0luc3RhbmNlLCBcIkVYVEVSTkFMXCIgLyogTGlzdGVuZXJUeXBlLkVYVEVSTkFMICovLCBuZXh0Rm4sIGVycm9yRm4pO1xyXG4gICAgcmV0dXJuICgpID0+IHJlbW92ZVRva2VuTGlzdGVuZXIoYXBwQ2hlY2tJbnN0YW5jZS5hcHAsIG5leHRGbik7XHJcbn1cblxuLyoqXHJcbiAqIFRoZSBGaXJlYmFzZSBBcHAgQ2hlY2sgV2ViIFNESy5cclxuICpcclxuICogQHJlbWFya3NcclxuICogRmlyZWJhc2UgQXBwIENoZWNrIGRvZXMgbm90IHdvcmsgaW4gYSBOb2RlLmpzIGVudmlyb25tZW50IHVzaW5nIGBSZUNhcHRjaGFWM1Byb3ZpZGVyYCBvclxyXG4gKiBgUmVDYXB0Y2hhRW50ZXJwcmlzZVByb3ZpZGVyYCwgYnV0IGNhbiBiZSB1c2VkIGluIE5vZGUuanMgaWYgeW91IHVzZVxyXG4gKiBgQ3VzdG9tUHJvdmlkZXJgIGFuZCB3cml0ZSB5b3VyIG93biBhdHRlc3RhdGlvbiBtZXRob2QuXHJcbiAqXHJcbiAqIEBwYWNrYWdlRG9jdW1lbnRhdGlvblxyXG4gKi9cclxuY29uc3QgQVBQX0NIRUNLX05BTUUgPSAnYXBwLWNoZWNrJztcclxuY29uc3QgQVBQX0NIRUNLX05BTUVfSU5URVJOQUwgPSAnYXBwLWNoZWNrLWludGVybmFsJztcclxuZnVuY3Rpb24gcmVnaXN0ZXJBcHBDaGVjaygpIHtcclxuICAgIC8vIFRoZSBwdWJsaWMgaW50ZXJmYWNlXHJcbiAgICBfcmVnaXN0ZXJDb21wb25lbnQobmV3IENvbXBvbmVudChBUFBfQ0hFQ0tfTkFNRSwgY29udGFpbmVyID0+IHtcclxuICAgICAgICAvLyBnZXRJbW1lZGlhdGUgZm9yIEZpcmViYXNlQXBwIHdpbGwgYWx3YXlzIHN1Y2NlZWRcclxuICAgICAgICBjb25zdCBhcHAgPSBjb250YWluZXIuZ2V0UHJvdmlkZXIoJ2FwcCcpLmdldEltbWVkaWF0ZSgpO1xyXG4gICAgICAgIGNvbnN0IGhlYXJ0YmVhdFNlcnZpY2VQcm92aWRlciA9IGNvbnRhaW5lci5nZXRQcm92aWRlcignaGVhcnRiZWF0Jyk7XHJcbiAgICAgICAgcmV0dXJuIGZhY3RvcnkoYXBwLCBoZWFydGJlYXRTZXJ2aWNlUHJvdmlkZXIpO1xyXG4gICAgfSwgXCJQVUJMSUNcIiAvKiBDb21wb25lbnRUeXBlLlBVQkxJQyAqLylcclxuICAgICAgICAuc2V0SW5zdGFudGlhdGlvbk1vZGUoXCJFWFBMSUNJVFwiIC8qIEluc3RhbnRpYXRpb25Nb2RlLkVYUExJQ0lUICovKVxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIEluaXRpYWxpemUgYXBwLWNoZWNrLWludGVybmFsIGFmdGVyIGFwcC1jaGVjayBpcyBpbml0aWFsaXplZCB0byBtYWtlIEFwcENoZWNrIGF2YWlsYWJsZSB0b1xyXG4gICAgICAgICAqIG90aGVyIEZpcmViYXNlIFNES3NcclxuICAgICAgICAgKi9cclxuICAgICAgICAuc2V0SW5zdGFuY2VDcmVhdGVkQ2FsbGJhY2soKGNvbnRhaW5lciwgX2lkZW50aWZpZXIsIF9hcHBjaGVja1NlcnZpY2UpID0+IHtcclxuICAgICAgICBjb250YWluZXIuZ2V0UHJvdmlkZXIoQVBQX0NIRUNLX05BTUVfSU5URVJOQUwpLmluaXRpYWxpemUoKTtcclxuICAgIH0pKTtcclxuICAgIC8vIFRoZSBpbnRlcm5hbCBpbnRlcmZhY2UgdXNlZCBieSBvdGhlciBGaXJlYmFzZSBwcm9kdWN0c1xyXG4gICAgX3JlZ2lzdGVyQ29tcG9uZW50KG5ldyBDb21wb25lbnQoQVBQX0NIRUNLX05BTUVfSU5URVJOQUwsIGNvbnRhaW5lciA9PiB7XHJcbiAgICAgICAgY29uc3QgYXBwQ2hlY2sgPSBjb250YWluZXIuZ2V0UHJvdmlkZXIoJ2FwcC1jaGVjaycpLmdldEltbWVkaWF0ZSgpO1xyXG4gICAgICAgIHJldHVybiBpbnRlcm5hbEZhY3RvcnkoYXBwQ2hlY2spO1xyXG4gICAgfSwgXCJQVUJMSUNcIiAvKiBDb21wb25lbnRUeXBlLlBVQkxJQyAqLykuc2V0SW5zdGFudGlhdGlvbk1vZGUoXCJFWFBMSUNJVFwiIC8qIEluc3RhbnRpYXRpb25Nb2RlLkVYUExJQ0lUICovKSk7XHJcbiAgICByZWdpc3RlclZlcnNpb24obmFtZSwgdmVyc2lvbik7XHJcbn1cclxucmVnaXN0ZXJBcHBDaGVjaygpO1xuXG5leHBvcnQgeyBDdXN0b21Qcm92aWRlciwgUmVDYXB0Y2hhRW50ZXJwcmlzZVByb3ZpZGVyLCBSZUNhcHRjaGFWM1Byb3ZpZGVyLCBnZXRMaW1pdGVkVXNlVG9rZW4sIGdldFRva2VuLCBpbml0aWFsaXplQXBwQ2hlY2ssIG9uVG9rZW5DaGFuZ2VkLCBzZXRUb2tlbkF1dG9SZWZyZXNoRW5hYmxlZCB9O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9aW5kZXguZXNtMjAxNy5qcy5tYXBcbiIsImltcG9ydCB7IHNldFVzZXJMb2dIYW5kbGVyIH0gZnJvbSBcIkBmaXJlYmFzZS9sb2dnZXJcIjtcbmltcG9ydCB7IGluaXRpYWxpemVBcHAgfSBmcm9tIFwiZmlyZWJhc2UvYXBwXCI7XG5pbXBvcnQgeyBnZXRWZXJ0ZXhBSSwgZ2V0R2VuZXJhdGl2ZU1vZGVsIH0gZnJvbSBcImZpcmViYXNlL3ZlcnRleGFpLXByZXZpZXdcIjtcbmltcG9ydCB7IGluaXRpYWxpemVBcHBDaGVjaywgUmVDYXB0Y2hhVjNQcm92aWRlciB9IGZyb20gXCJmaXJlYmFzZS9hcHAtY2hlY2tcIjtcbmltcG9ydCB7IHNlbmQgfSBmcm9tIFwicHJvY2Vzc1wiO1xuXG4vLyBZb3VyIHdlYiBhcHAncyBGaXJlYmFzZSBjb25maWd1cmF0aW9uXG5jb25zdCBmaXJlYmFzZUNvbmZpZyA9IHtcbiAgYXBpS2V5OiBcIkFJemFTeUEyRV9VNU4wOXpDVkhkSWVjYUZ1SWVEUnVVV05YOHhOZ1wiLFxuICBhdXRoRG9tYWluOiBcIm15c3lsbGFidXNib3QuZmlyZWJhc2VhcHAuY29tXCIsXG4gIHByb2plY3RJZDogXCJteXN5bGxhYnVzYm90XCIsXG4gIHN0b3JhZ2VCdWNrZXQ6IFwibXlzeWxsYWJ1c2JvdC5hcHBzcG90LmNvbVwiLFxuICBtZXNzYWdpbmdTZW5kZXJJZDogXCIzMjY0OTc4MzE2MzdcIixcbiAgYXBwSWQ6IFwiMTozMjY0OTc4MzE2Mzc6d2ViOjM0ZDZjZGM2ODdhM2I2YTI4MWYwNWNcIlxufTtcblxuLy8gSW5pdGlhbGl6ZSBGaXJlYmFzZVxuY29uc3QgZmlyZWJhc2VBcHAgPSBpbml0aWFsaXplQXBwKGZpcmViYXNlQ29uZmlnKTtcblxuLy8gQ29uZmlndXJlIGFwcCBhdHRlc3RhdGlvbiB2aWEgcmVDQVBUQ0hBIHYzXG5jb25zdCBhcHBDaGVjayA9IGluaXRpYWxpemVBcHBDaGVjayhmaXJlYmFzZUFwcCwge1xuICAgIHByb3ZpZGVyOiBuZXcgUmVDYXB0Y2hhVjNQcm92aWRlcihcIjZMZE1EemtxQUFBQUFOemV2MU1hSHpONE1hRWNmbHB1elhnS3FRel9cIiksXG4gIFxuICAgIC8vIE9wdGlvbmFsIGFyZ3VtZW50LiBJZiB0cnVlLCB0aGUgU0RLIGF1dG9tYXRpY2FsbHkgcmVmcmVzaGVzIEFwcCBDaGVja1xuICAgIC8vIHRva2VucyBhcyBuZWVkZWQuXG4gICAgaXNUb2tlbkF1dG9SZWZyZXNoRW5hYmxlZDogdHJ1ZVxufSk7XG5cbmNvbnN0IHZlcnRleEFJID0gZ2V0VmVydGV4QUkoZmlyZWJhc2VBcHApO1xuXG5jb25zdCBtb2RlbCA9IGdldEdlbmVyYXRpdmVNb2RlbCh2ZXJ0ZXhBSSwgeyBtb2RlbDogXCJnZW1pbmktMS41LWZsYXNoXCIgfSk7XG5cbmFzeW5jIGZ1bmN0aW9uIHJ1bk1vZGVsKHByb21wdCkge1xuICAgIGNvbnN0IGltYWdlUGFydCA9IHsgZmlsZURhdGE6IHsgbWltZVR5cGU6IFwiYXBwbGljYXRpb24vcGRmXCIsIGZpbGVVcmk6IFwiZ3M6Ly9teXN5bGxhYnVzYm90LmFwcHNwb3QuY29tL01BVEgxMDgxNzAucGRmXCIgfX07XG4gICAgXG4gICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgbW9kZWwuZ2VuZXJhdGVDb250ZW50KFtwcm9tcHRdKTtcblxuICAgIGNvbnN0IHJlc3BvbnNlID0gcmVzdWx0LnJlc3BvbnNlO1xuICAgIGNvbnN0IHRleHQgPSByZXNwb25zZS50ZXh0KCk7XG4gIFxuICAgIHJldHVybiB0ZXh0O1xufVxuXG5mdW5jdGlvbiBjcmVhdGVDaGF0VGV4dCh0ZXh0LCBkaXJlY3Rpb24pIHtcbiAgICBjb25zdCBjaGF0RGl2ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjaGF0RGl2XCIpO1xuICAgIGNvbnN0IGNoYXRUZXh0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInBcIik7XG4gICAgXG4gICAgY2hhdFRleHQuaW5uZXJUZXh0ID0gdGV4dDtcbiAgICBjaGF0VGV4dC5zdHlsZS50ZXh0QWxpZ24gPSBkaXJlY3Rpb247XG5cbiAgICBjaGF0RGl2LmFwcGVuZENoaWxkKGNoYXRUZXh0KTtcbn1cblxuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcIkRPTUNvbnRlbnRMb2FkZWRcIiwgKCkgPT4ge1xuICAgIGNvbnN0IG1lc3NhZ2VCb3ggPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm1lc3NhZ2VJbnB1dFwiKTtcbiAgICBtZXNzYWdlQm94LmZvY3VzKCk7XG5cbiAgICBmdW5jdGlvbiBzZW5kVXNlclByb21wdCgpIHtcbiAgICAgICAgY29uc3QgbWVzc2FnZVRleHQgPSBtZXNzYWdlQm94LnZhbHVlO1xuICAgICAgICBtZXNzYWdlQm94LnZhbHVlID0gXCJcIjtcbiAgICBcbiAgICAgICAgY3JlYXRlQ2hhdFRleHQobWVzc2FnZVRleHQsIFwibGVmdFwiKTtcbiAgICBcbiAgICAgICAgcnVuTW9kZWwobWVzc2FnZVRleHQpLnRoZW4oKHJlc3BvbnNlKSA9PiB7XG4gICAgICAgICAgICBjcmVhdGVDaGF0VGV4dChyZXNwb25zZSwgXCJyaWdodFwiKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgLy8gVHJpZ2dlciBvbiB1c2VyIHByZXNzaW5nIGVudGVyXG4gICAgbWVzc2FnZUJveC5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgICAgaWYgKGV2ZW50LmtleSA9PT0gJ0VudGVyJykge1xuICAgICAgICAgICAgc2VuZFVzZXJQcm9tcHQoKTtcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgLy8gQWRkIHRoZSBmdW5jdGlvbiB0byB0aGUgZ2xvYmFsIHNjb3BlIHNvIGl0IGNhbiBiZSBjYWxsZWQgdmlhIEhUTUxcbiAgICB3aW5kb3cuc2VuZFVzZXJQcm9tcHQgPSBzZW5kVXNlclByb21wdDtcbn0pOyJdLCJuYW1lcyI6WyJERUZBVUxUX0VOVFJZX05BTUUiLCJ2ZXJzaW9uJDEiLCJsb2dnZXIiLCJuYW1lJDIiLCJuYW1lJDEiLCJuYW1lIiwiRVJST1JTIiwiRVJST1JfRkFDVE9SWSIsIkRCX05BTUUiLCJEQl9WRVJTSU9OIiwiU1RPUkVfTkFNRSIsImRiUHJvbWlzZSIsImNvbXB1dGVLZXkiLCJ2ZXJzaW9uIl0sIm1hcHBpbmdzIjoiOzs7SUFBQTtJQUNBO0lBQ0E7SUFDQTtJQUNBO0lBQ0E7SUFDQTtJQUNBO0lBQ0E7SUFDQTtJQUNBO0lBQ0E7SUFDQTtJQUNBO0lBQ0E7SUFDQTtJQUNBO0lBQ0E7SUFDQTtJQUVBO0lBQ0E7SUFDQTtJQUNBO0lBQ0E7SUFDQTtJQUNBO0lBQ0E7SUFDQTtJQUNBO0lBQ0E7SUFDQSxJQUFJLFFBQVEsQ0FBQztJQUNiLENBQUMsVUFBVSxRQUFRLEVBQUU7SUFDckIsSUFBSSxRQUFRLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLE9BQU8sQ0FBQztJQUM5QyxJQUFJLFFBQVEsQ0FBQyxRQUFRLENB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QyxHQUFHLElBQUksRUFBRTtJQUNuQixRQUFRLElBQUksQ0FBQyxlQUFlLElBQUksSUFBSSxDQUFDLGVBQWUsQ0FBQyxJQUFJLEVBQUUsUUFBUSxDQUFDLEtBQUssRUFBRSxHQUFHLElBQUksQ0FBQyxDQUFDO0lBQ3BGLFFBQVEsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLEVBQUUsUUFBUSxDQUFDLEtBQUssRUFBRSxHQUFHLElBQUksQ0FBQyxDQUFDO0lBQ3hELEtBQUs7SUFDTCxJQUFJLEdBQUcsQ0FBQyxHQUFHLElBQUksRUFBRTtJQUNqQixRQUFRLElBQUksQ0FBQyxlQUFlO0lBQzVCLFlBQVksSUFBSSxDQUFDLGVBQWUsQ0FBQyxJQUFJLEVBQUUsUUFBUSxDQUFDLE9BQU8sRUFBRSxHQUFHLElBQUksQ0FBQyxDQUFDO0lBQ2xFLFFBQVEsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLEVBQUUsUUFBUSxDQUFDLE9BQU8sRUFBRSxHQUFHLElBQUksQ0FBQyxDQUFDO0lBQzFELEtBQUs7SUFDTCxJQUFJLElBQUksQ0FBQyxHQUFHLElBQUksRUFBRTtJQUNsQixRQUFRLElBQUksQ0FBQyxlQUFlLElBQUksSUFBSSxDQUFDLGVBQWUsQ0FBQyxJQUFJLEVBQUUsUUFBUSxDQUFDLElBQUksRUFBRSxHQUFHLElBQUksQ0FBQyxDQUFDO0lBQ25GLFFBQVEsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLEVBQUUsUUFBUSxDQUFDLElBQUksRUFBRSxHQUFHLElBQUksQ0FBQyxDQUFDO0lBQ3ZELEtBQUs7SUFDTCxJQUFJLElBQUksQ0FBQyxHQUFHLElBQUksRUFBRTtJQUNsQixRQUFRLElBQUksQ0FBQyxlQUFlLElBQUksSUFBSSxDQUFDLGVBQWUsQ0FBQyxJQUFJLEVBQUUsUUFBUSxDQUFDLElBQUksRUFBRSxHQUFHLElBQUksQ0FBQyxDQUFDO0lBQ25GLFFBQVEsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLEVBQUUsUUFBUSxDQUFDLElBQUksRUFBRSxHQUFHLElBQUksQ0FBQyxDQUFDO0lBQ3ZELEtBQUs7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QUFJLENBQUMsT0FBTyxDQUFDLEVBQUUsSUFBSSxDQUFDLFFBQVEsRUFBRSxXQUFXLENBQUMsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLGFBQWEsQ0FBQyxHQUFHLFlBQVksRUFBRSxPQUFPLElBQUksQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDO0lBQzFOLEVBQUUsU0FBUyxXQUFXLENBQUMsQ0FBQyxFQUFFLEVBQUUsT0FBTyxVQUFVLENBQUMsRUFBRSxFQUFFLE9BQU8sT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFO0lBQ2pHLEVBQUUsU0FBUyxJQUFJLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLFVBQVUsQ0FBQyxFQUFFLEVBQUUsT0FBTyxJQUFJLE9BQU8sQ0FBQyxVQUFVLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRTtJQUMxSyxFQUFFLFNBQVMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUMsRUFBRSxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FB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
