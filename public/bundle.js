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
     * Returns emulator host stored in the __FIREBASE_DEFAULTS__ object
     * for the given product.
     * @returns a URL host formatted like `127.0.0.1:9999` or `[::1]:4000` if available
     * @public
     */
    const getDefaultEmulatorHost = (productName) => { var _a, _b; return (_b = (_a = getDefaults()) === null || _a === void 0 ? void 0 : _a.emulatorHosts) === null || _b === void 0 ? void 0 : _b[productName]; };
    /**
     * Returns emulator hostname and port stored in the __FIREBASE_DEFAULTS__ object
     * for the given product.
     * @returns a pair of hostname and port like `["::1", 4000]` if available
     * @public
     */
    const getDefaultEmulatorHostnameAndPort = (productName) => {
        const host = getDefaultEmulatorHost(productName);
        if (!host) {
            return undefined;
        }
        const separatorIndex = host.lastIndexOf(':'); // Finding the last since IPv6 addr also has colons.
        if (separatorIndex <= 0 || separatorIndex + 1 === host.length) {
            throw new Error(`Invalid host ${host} with no separate hostname and port!`);
        }
        // eslint-disable-next-line no-restricted-globals
        const port = parseInt(host.substring(separatorIndex + 1), 10);
        if (host[0] === '[') {
            // Bracket-quoted `[ipv6addr]:port` => return "ipv6addr" (without brackets).
            return [host.substring(1, separatorIndex - 1), port];
        }
        else {
            return [host.substring(0, separatorIndex), port];
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
    function createMockUserToken(token, projectId) {
        if (token.uid) {
            throw new Error('The "uid" field is no longer supported by mockUserToken. Please use "sub" instead for Firebase Auth User ID.');
        }
        // Unsecured JWTs use "none" as the algorithm.
        const header = {
            alg: 'none',
            type: 'JWT'
        };
        const project = projectId || 'demo-project';
        const iat = token.iat || 0;
        const sub = token.sub || token.user_id;
        if (!sub) {
            throw new Error("mockUserToken must contain 'sub' or 'user_id' field!");
        }
        const payload = Object.assign({ 
            // Set all required fields to decent defaults
            iss: `https://securetoken.google.com/${project}`, aud: project, iat, exp: iat + 3600, auth_time: iat, sub, user_id: sub, firebase: {
                sign_in_provider: 'custom',
                identities: {}
            } }, token);
        // Unsecured JWTs use the empty string as a signature.
        const signature = '';
        return [
            base64urlEncodeWithoutPadding(JSON.stringify(header)),
            base64urlEncodeWithoutPadding(JSON.stringify(payload)),
            signature
        ].join('.');
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

    const name$3$1 = "@firebase/firestore";

    const name$2$1 = "@firebase/vertexai-preview";

    const name$1$1 = "@firebase/firestore-compat";

    const name$q = "firebase";
    const version$4 = "10.13.1";

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
        [name$3$1]: 'fire-fst',
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
     * The current SDK version.
     *
     * @public
     */
    const SDK_VERSION = version$4;
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

    var name$3 = "firebase";
    var version$3 = "10.13.1";

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
    registerVersion(name$3, version$3, 'app');

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

    var name$2 = "@firebase/vertexai-preview";
    var version$2 = "0.0.3";

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
    const PACKAGE_VERSION = version$2;
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
    async function makeRequest$1(model, task, apiSettings, stream, body, requestOptions) {
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
        const response = await makeRequest$1(model, Task.STREAM_GENERATE_CONTENT, apiSettings, 
        /* stream */ true, JSON.stringify(params), requestOptions);
        return processStream(response);
    }
    async function generateContent(apiSettings, model, params, requestOptions) {
        const response = await makeRequest$1(model, Task.GENERATE_CONTENT, apiSettings, 
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
        const response = await makeRequest$1(model, Task.COUNT_TOKENS, apiSettings, false, JSON.stringify(params), requestOptions);
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
        registerVersion(name$2, version$2);
        // BUILD_TARGET will be replaced by values like esm5, esm2017, cjs5, etc during the compilation
        registerVersion(name$2, version$2, 'esm2017');
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
    function factory$1(app, heartbeatServiceProvider) {
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

    const name$1 = "@firebase/app-check";
    const version$1 = "0.8.7";

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
            return factory$1(app, heartbeatServiceProvider);
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
        registerVersion(name$1, version$1);
    }
    registerAppCheck();

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
     * @fileoverview Constants used in the Firebase Storage library.
     */
    /**
     * Domain name for firebase storage.
     */
    const DEFAULT_HOST = 'firebasestorage.googleapis.com';
    /**
     * The key in Firebase config json for the storage bucket.
     */
    const CONFIG_STORAGE_BUCKET_KEY = 'storageBucket';
    /**
     * 2 minutes
     *
     * The timeout for all operations except upload.
     */
    const DEFAULT_MAX_OPERATION_RETRY_TIME = 2 * 60 * 1000;
    /**
     * 10 minutes
     *
     * The timeout for upload.
     */
    const DEFAULT_MAX_UPLOAD_RETRY_TIME = 10 * 60 * 1000;

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
     * An error returned by the Firebase Storage SDK.
     * @public
     */
    class StorageError extends FirebaseError {
        /**
         * @param code - A `StorageErrorCode` string to be prefixed with 'storage/' and
         *  added to the end of the message.
         * @param message  - Error message.
         * @param status_ - Corresponding HTTP Status Code
         */
        constructor(code, message, status_ = 0) {
            super(prependCode(code), `Firebase Storage: ${message} (${prependCode(code)})`);
            this.status_ = status_;
            /**
             * Stores custom error data unique to the `StorageError`.
             */
            this.customData = { serverResponse: null };
            this._baseMessage = this.message;
            // Without this, `instanceof StorageError`, in tests for example,
            // returns false.
            Object.setPrototypeOf(this, StorageError.prototype);
        }
        get status() {
            return this.status_;
        }
        set status(status) {
            this.status_ = status;
        }
        /**
         * Compares a `StorageErrorCode` against this error's code, filtering out the prefix.
         */
        _codeEquals(code) {
            return prependCode(code) === this.code;
        }
        /**
         * Optional response message that was added by the server.
         */
        get serverResponse() {
            return this.customData.serverResponse;
        }
        set serverResponse(serverResponse) {
            this.customData.serverResponse = serverResponse;
            if (this.customData.serverResponse) {
                this.message = `${this._baseMessage}\n${this.customData.serverResponse}`;
            }
            else {
                this.message = this._baseMessage;
            }
        }
    }
    /**
     * @public
     * Error codes that can be attached to `StorageError` objects.
     */
    var StorageErrorCode;
    (function (StorageErrorCode) {
        // Shared between all platforms
        StorageErrorCode["UNKNOWN"] = "unknown";
        StorageErrorCode["OBJECT_NOT_FOUND"] = "object-not-found";
        StorageErrorCode["BUCKET_NOT_FOUND"] = "bucket-not-found";
        StorageErrorCode["PROJECT_NOT_FOUND"] = "project-not-found";
        StorageErrorCode["QUOTA_EXCEEDED"] = "quota-exceeded";
        StorageErrorCode["UNAUTHENTICATED"] = "unauthenticated";
        StorageErrorCode["UNAUTHORIZED"] = "unauthorized";
        StorageErrorCode["UNAUTHORIZED_APP"] = "unauthorized-app";
        StorageErrorCode["RETRY_LIMIT_EXCEEDED"] = "retry-limit-exceeded";
        StorageErrorCode["INVALID_CHECKSUM"] = "invalid-checksum";
        StorageErrorCode["CANCELED"] = "canceled";
        // JS specific
        StorageErrorCode["INVALID_EVENT_NAME"] = "invalid-event-name";
        StorageErrorCode["INVALID_URL"] = "invalid-url";
        StorageErrorCode["INVALID_DEFAULT_BUCKET"] = "invalid-default-bucket";
        StorageErrorCode["NO_DEFAULT_BUCKET"] = "no-default-bucket";
        StorageErrorCode["CANNOT_SLICE_BLOB"] = "cannot-slice-blob";
        StorageErrorCode["SERVER_FILE_WRONG_SIZE"] = "server-file-wrong-size";
        StorageErrorCode["NO_DOWNLOAD_URL"] = "no-download-url";
        StorageErrorCode["INVALID_ARGUMENT"] = "invalid-argument";
        StorageErrorCode["INVALID_ARGUMENT_COUNT"] = "invalid-argument-count";
        StorageErrorCode["APP_DELETED"] = "app-deleted";
        StorageErrorCode["INVALID_ROOT_OPERATION"] = "invalid-root-operation";
        StorageErrorCode["INVALID_FORMAT"] = "invalid-format";
        StorageErrorCode["INTERNAL_ERROR"] = "internal-error";
        StorageErrorCode["UNSUPPORTED_ENVIRONMENT"] = "unsupported-environment";
    })(StorageErrorCode || (StorageErrorCode = {}));
    function prependCode(code) {
        return 'storage/' + code;
    }
    function unknown() {
        const message = 'An unknown error occurred, please check the error payload for ' +
            'server response.';
        return new StorageError(StorageErrorCode.UNKNOWN, message);
    }
    function objectNotFound(path) {
        return new StorageError(StorageErrorCode.OBJECT_NOT_FOUND, "Object '" + path + "' does not exist.");
    }
    function quotaExceeded(bucket) {
        return new StorageError(StorageErrorCode.QUOTA_EXCEEDED, "Quota for bucket '" +
            bucket +
            "' exceeded, please view quota on " +
            'https://firebase.google.com/pricing/.');
    }
    function unauthenticated() {
        const message = 'User is not authenticated, please authenticate using Firebase ' +
            'Authentication and try again.';
        return new StorageError(StorageErrorCode.UNAUTHENTICATED, message);
    }
    function unauthorizedApp() {
        return new StorageError(StorageErrorCode.UNAUTHORIZED_APP, 'This app does not have permission to access Firebase Storage on this project.');
    }
    function unauthorized(path) {
        return new StorageError(StorageErrorCode.UNAUTHORIZED, "User does not have permission to access '" + path + "'.");
    }
    function retryLimitExceeded() {
        return new StorageError(StorageErrorCode.RETRY_LIMIT_EXCEEDED, 'Max retry time for operation exceeded, please try again.');
    }
    function canceled() {
        return new StorageError(StorageErrorCode.CANCELED, 'User canceled the upload/download.');
    }
    function invalidUrl(url) {
        return new StorageError(StorageErrorCode.INVALID_URL, "Invalid URL '" + url + "'.");
    }
    function invalidDefaultBucket(bucket) {
        return new StorageError(StorageErrorCode.INVALID_DEFAULT_BUCKET, "Invalid default bucket '" + bucket + "'.");
    }
    function noDefaultBucket() {
        return new StorageError(StorageErrorCode.NO_DEFAULT_BUCKET, 'No default bucket ' +
            "found. Did you set the '" +
            CONFIG_STORAGE_BUCKET_KEY +
            "' property when initializing the app?");
    }
    function noDownloadURL() {
        return new StorageError(StorageErrorCode.NO_DOWNLOAD_URL, 'The given file does not have any download URLs.');
    }
    /**
     * @internal
     */
    function invalidArgument(message) {
        return new StorageError(StorageErrorCode.INVALID_ARGUMENT, message);
    }
    function appDeleted() {
        return new StorageError(StorageErrorCode.APP_DELETED, 'The Firebase app was deleted.');
    }
    /**
     * @param name - The name of the operation that was invalid.
     *
     * @internal
     */
    function invalidRootOperation(name) {
        return new StorageError(StorageErrorCode.INVALID_ROOT_OPERATION, "The operation '" +
            name +
            "' cannot be performed on a root reference, create a non-root " +
            "reference using child, such as .child('file.png').");
    }
    /**
     * @param message - A message describing the internal error.
     */
    function internalError(message) {
        throw new StorageError(StorageErrorCode.INTERNAL_ERROR, 'Internal error: ' + message);
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
     * Firebase Storage location data.
     *
     * @internal
     */
    class Location {
        constructor(bucket, path) {
            this.bucket = bucket;
            this.path_ = path;
        }
        get path() {
            return this.path_;
        }
        get isRoot() {
            return this.path.length === 0;
        }
        fullServerUrl() {
            const encode = encodeURIComponent;
            return '/b/' + encode(this.bucket) + '/o/' + encode(this.path);
        }
        bucketOnlyServerUrl() {
            const encode = encodeURIComponent;
            return '/b/' + encode(this.bucket) + '/o';
        }
        static makeFromBucketSpec(bucketString, host) {
            let bucketLocation;
            try {
                bucketLocation = Location.makeFromUrl(bucketString, host);
            }
            catch (e) {
                // Not valid URL, use as-is. This lets you put bare bucket names in
                // config.
                return new Location(bucketString, '');
            }
            if (bucketLocation.path === '') {
                return bucketLocation;
            }
            else {
                throw invalidDefaultBucket(bucketString);
            }
        }
        static makeFromUrl(url, host) {
            let location = null;
            const bucketDomain = '([A-Za-z0-9.\\-_]+)';
            function gsModify(loc) {
                if (loc.path.charAt(loc.path.length - 1) === '/') {
                    loc.path_ = loc.path_.slice(0, -1);
                }
            }
            const gsPath = '(/(.*))?$';
            const gsRegex = new RegExp('^gs://' + bucketDomain + gsPath, 'i');
            const gsIndices = { bucket: 1, path: 3 };
            function httpModify(loc) {
                loc.path_ = decodeURIComponent(loc.path);
            }
            const version = 'v[A-Za-z0-9_]+';
            const firebaseStorageHost = host.replace(/[.]/g, '\\.');
            const firebaseStoragePath = '(/([^?#]*).*)?$';
            const firebaseStorageRegExp = new RegExp(`^https?://${firebaseStorageHost}/${version}/b/${bucketDomain}/o${firebaseStoragePath}`, 'i');
            const firebaseStorageIndices = { bucket: 1, path: 3 };
            const cloudStorageHost = host === DEFAULT_HOST
                ? '(?:storage.googleapis.com|storage.cloud.google.com)'
                : host;
            const cloudStoragePath = '([^?#]*)';
            const cloudStorageRegExp = new RegExp(`^https?://${cloudStorageHost}/${bucketDomain}/${cloudStoragePath}`, 'i');
            const cloudStorageIndices = { bucket: 1, path: 2 };
            const groups = [
                { regex: gsRegex, indices: gsIndices, postModify: gsModify },
                {
                    regex: firebaseStorageRegExp,
                    indices: firebaseStorageIndices,
                    postModify: httpModify
                },
                {
                    regex: cloudStorageRegExp,
                    indices: cloudStorageIndices,
                    postModify: httpModify
                }
            ];
            for (let i = 0; i < groups.length; i++) {
                const group = groups[i];
                const captures = group.regex.exec(url);
                if (captures) {
                    const bucketValue = captures[group.indices.bucket];
                    let pathValue = captures[group.indices.path];
                    if (!pathValue) {
                        pathValue = '';
                    }
                    location = new Location(bucketValue, pathValue);
                    group.postModify(location);
                    break;
                }
            }
            if (location == null) {
                throw invalidUrl(url);
            }
            return location;
        }
    }

    /**
     * A request whose promise always fails.
     */
    class FailRequest {
        constructor(error) {
            this.promise_ = Promise.reject(error);
        }
        /** @inheritDoc */
        getPromise() {
            return this.promise_;
        }
        /** @inheritDoc */
        cancel(_appDelete = false) { }
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
     * Accepts a callback for an action to perform (`doRequest`),
     * and then a callback for when the backoff has completed (`backoffCompleteCb`).
     * The callback sent to start requires an argument to call (`onRequestComplete`).
     * When `start` calls `doRequest`, it passes a callback for when the request has
     * completed, `onRequestComplete`. Based on this, the backoff continues, with
     * another call to `doRequest` and the above loop continues until the timeout
     * is hit, or a successful response occurs.
     * @description
     * @param doRequest Callback to perform request
     * @param backoffCompleteCb Callback to call when backoff has been completed
     */
    function start(doRequest, 
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    backoffCompleteCb, timeout) {
        // TODO(andysoto): make this code cleaner (probably refactor into an actual
        // type instead of a bunch of functions with state shared in the closure)
        let waitSeconds = 1;
        // Would type this as "number" but that doesn't work for Node so ¯\_(ツ)_/¯
        // TODO: find a way to exclude Node type definition for storage because storage only works in browser
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let retryTimeoutId = null;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let globalTimeoutId = null;
        let hitTimeout = false;
        let cancelState = 0;
        function canceled() {
            return cancelState === 2;
        }
        let triggeredCallback = false;
        function triggerCallback(...args) {
            if (!triggeredCallback) {
                triggeredCallback = true;
                backoffCompleteCb.apply(null, args);
            }
        }
        function callWithDelay(millis) {
            retryTimeoutId = setTimeout(() => {
                retryTimeoutId = null;
                doRequest(responseHandler, canceled());
            }, millis);
        }
        function clearGlobalTimeout() {
            if (globalTimeoutId) {
                clearTimeout(globalTimeoutId);
            }
        }
        function responseHandler(success, ...args) {
            if (triggeredCallback) {
                clearGlobalTimeout();
                return;
            }
            if (success) {
                clearGlobalTimeout();
                triggerCallback.call(null, success, ...args);
                return;
            }
            const mustStop = canceled() || hitTimeout;
            if (mustStop) {
                clearGlobalTimeout();
                triggerCallback.call(null, success, ...args);
                return;
            }
            if (waitSeconds < 64) {
                /* TODO(andysoto): don't back off so quickly if we know we're offline. */
                waitSeconds *= 2;
            }
            let waitMillis;
            if (cancelState === 1) {
                cancelState = 2;
                waitMillis = 0;
            }
            else {
                waitMillis = (waitSeconds + Math.random()) * 1000;
            }
            callWithDelay(waitMillis);
        }
        let stopped = false;
        function stop(wasTimeout) {
            if (stopped) {
                return;
            }
            stopped = true;
            clearGlobalTimeout();
            if (triggeredCallback) {
                return;
            }
            if (retryTimeoutId !== null) {
                if (!wasTimeout) {
                    cancelState = 2;
                }
                clearTimeout(retryTimeoutId);
                callWithDelay(0);
            }
            else {
                if (!wasTimeout) {
                    cancelState = 1;
                }
            }
        }
        callWithDelay(0);
        globalTimeoutId = setTimeout(() => {
            hitTimeout = true;
            stop(true);
        }, timeout);
        return stop;
    }
    /**
     * Stops the retry loop from repeating.
     * If the function is currently "in between" retries, it is invoked immediately
     * with the second parameter as "true". Otherwise, it will be invoked once more
     * after the current invocation finishes iff the current invocation would have
     * triggered another retry.
     */
    function stop(id) {
        id(false);
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
    function isJustDef(p) {
        return p !== void 0;
    }
    function isNonArrayObject(p) {
        return typeof p === 'object' && !Array.isArray(p);
    }
    function isString(p) {
        return typeof p === 'string' || p instanceof String;
    }
    function validateNumber(argument, minValue, maxValue, value) {
        if (value < minValue) {
            throw invalidArgument(`Invalid value for '${argument}'. Expected ${minValue} or greater.`);
        }
        if (value > maxValue) {
            throw invalidArgument(`Invalid value for '${argument}'. Expected ${maxValue} or less.`);
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
    function makeUrl(urlPart, host, protocol) {
        let origin = host;
        if (protocol == null) {
            origin = `https://${host}`;
        }
        return `${protocol}://${origin}/v0${urlPart}`;
    }
    function makeQueryString(params) {
        const encode = encodeURIComponent;
        let queryPart = '?';
        for (const key in params) {
            if (params.hasOwnProperty(key)) {
                const nextPart = encode(key) + '=' + encode(params[key]);
                queryPart = queryPart + nextPart + '&';
            }
        }
        // Chop off the extra '&' or '?' on the end
        queryPart = queryPart.slice(0, -1);
        return queryPart;
    }

    /**
     * Error codes for requests made by the XhrIo wrapper.
     */
    var ErrorCode;
    (function (ErrorCode) {
        ErrorCode[ErrorCode["NO_ERROR"] = 0] = "NO_ERROR";
        ErrorCode[ErrorCode["NETWORK_ERROR"] = 1] = "NETWORK_ERROR";
        ErrorCode[ErrorCode["ABORT"] = 2] = "ABORT";
    })(ErrorCode || (ErrorCode = {}));

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
     * Checks the status code to see if the action should be retried.
     *
     * @param status Current HTTP status code returned by server.
     * @param additionalRetryCodes additional retry codes to check against
     */
    function isRetryStatusCode(status, additionalRetryCodes) {
        // The codes for which to retry came from this page:
        // https://cloud.google.com/storage/docs/exponential-backoff
        const isFiveHundredCode = status >= 500 && status < 600;
        const extraRetryCodes = [
            // Request Timeout: web server didn't receive full request in time.
            408,
            // Too Many Requests: you're getting rate-limited, basically.
            429
        ];
        const isExtraRetryCode = extraRetryCodes.indexOf(status) !== -1;
        const isAdditionalRetryCode = additionalRetryCodes.indexOf(status) !== -1;
        return isFiveHundredCode || isExtraRetryCode || isAdditionalRetryCode;
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
     * Handles network logic for all Storage Requests, including error reporting and
     * retries with backoff.
     *
     * @param I - the type of the backend's network response.
     * @param - O the output type used by the rest of the SDK. The conversion
     * happens in the specified `callback_`.
     */
    class NetworkRequest {
        constructor(url_, method_, headers_, body_, successCodes_, additionalRetryCodes_, callback_, errorCallback_, timeout_, progressCallback_, connectionFactory_, retry = true) {
            this.url_ = url_;
            this.method_ = method_;
            this.headers_ = headers_;
            this.body_ = body_;
            this.successCodes_ = successCodes_;
            this.additionalRetryCodes_ = additionalRetryCodes_;
            this.callback_ = callback_;
            this.errorCallback_ = errorCallback_;
            this.timeout_ = timeout_;
            this.progressCallback_ = progressCallback_;
            this.connectionFactory_ = connectionFactory_;
            this.retry = retry;
            this.pendingConnection_ = null;
            this.backoffId_ = null;
            this.canceled_ = false;
            this.appDelete_ = false;
            this.promise_ = new Promise((resolve, reject) => {
                this.resolve_ = resolve;
                this.reject_ = reject;
                this.start_();
            });
        }
        /**
         * Actually starts the retry loop.
         */
        start_() {
            const doTheRequest = (backoffCallback, canceled) => {
                if (canceled) {
                    backoffCallback(false, new RequestEndStatus(false, null, true));
                    return;
                }
                const connection = this.connectionFactory_();
                this.pendingConnection_ = connection;
                const progressListener = progressEvent => {
                    const loaded = progressEvent.loaded;
                    const total = progressEvent.lengthComputable ? progressEvent.total : -1;
                    if (this.progressCallback_ !== null) {
                        this.progressCallback_(loaded, total);
                    }
                };
                if (this.progressCallback_ !== null) {
                    connection.addUploadProgressListener(progressListener);
                }
                // connection.send() never rejects, so we don't need to have a error handler or use catch on the returned promise.
                // eslint-disable-next-line @typescript-eslint/no-floating-promises
                connection
                    .send(this.url_, this.method_, this.body_, this.headers_)
                    .then(() => {
                    if (this.progressCallback_ !== null) {
                        connection.removeUploadProgressListener(progressListener);
                    }
                    this.pendingConnection_ = null;
                    const hitServer = connection.getErrorCode() === ErrorCode.NO_ERROR;
                    const status = connection.getStatus();
                    if (!hitServer ||
                        (isRetryStatusCode(status, this.additionalRetryCodes_) &&
                            this.retry)) {
                        const wasCanceled = connection.getErrorCode() === ErrorCode.ABORT;
                        backoffCallback(false, new RequestEndStatus(false, null, wasCanceled));
                        return;
                    }
                    const successCode = this.successCodes_.indexOf(status) !== -1;
                    backoffCallback(true, new RequestEndStatus(successCode, connection));
                });
            };
            /**
             * @param requestWentThrough - True if the request eventually went
             *     through, false if it hit the retry limit or was canceled.
             */
            const backoffDone = (requestWentThrough, status) => {
                const resolve = this.resolve_;
                const reject = this.reject_;
                const connection = status.connection;
                if (status.wasSuccessCode) {
                    try {
                        const result = this.callback_(connection, connection.getResponse());
                        if (isJustDef(result)) {
                            resolve(result);
                        }
                        else {
                            resolve();
                        }
                    }
                    catch (e) {
                        reject(e);
                    }
                }
                else {
                    if (connection !== null) {
                        const err = unknown();
                        err.serverResponse = connection.getErrorText();
                        if (this.errorCallback_) {
                            reject(this.errorCallback_(connection, err));
                        }
                        else {
                            reject(err);
                        }
                    }
                    else {
                        if (status.canceled) {
                            const err = this.appDelete_ ? appDeleted() : canceled();
                            reject(err);
                        }
                        else {
                            const err = retryLimitExceeded();
                            reject(err);
                        }
                    }
                }
            };
            if (this.canceled_) {
                backoffDone(false, new RequestEndStatus(false, null, true));
            }
            else {
                this.backoffId_ = start(doTheRequest, backoffDone, this.timeout_);
            }
        }
        /** @inheritDoc */
        getPromise() {
            return this.promise_;
        }
        /** @inheritDoc */
        cancel(appDelete) {
            this.canceled_ = true;
            this.appDelete_ = appDelete || false;
            if (this.backoffId_ !== null) {
                stop(this.backoffId_);
            }
            if (this.pendingConnection_ !== null) {
                this.pendingConnection_.abort();
            }
        }
    }
    /**
     * A collection of information about the result of a network request.
     * @param opt_canceled - Defaults to false.
     */
    class RequestEndStatus {
        constructor(wasSuccessCode, connection, canceled) {
            this.wasSuccessCode = wasSuccessCode;
            this.connection = connection;
            this.canceled = !!canceled;
        }
    }
    function addAuthHeader_(headers, authToken) {
        if (authToken !== null && authToken.length > 0) {
            headers['Authorization'] = 'Firebase ' + authToken;
        }
    }
    function addVersionHeader_(headers, firebaseVersion) {
        headers['X-Firebase-Storage-Version'] =
            'webjs/' + (firebaseVersion !== null && firebaseVersion !== void 0 ? firebaseVersion : 'AppManager');
    }
    function addGmpidHeader_(headers, appId) {
        if (appId) {
            headers['X-Firebase-GMPID'] = appId;
        }
    }
    function addAppCheckHeader_(headers, appCheckToken) {
        if (appCheckToken !== null) {
            headers['X-Firebase-AppCheck'] = appCheckToken;
        }
    }
    function makeRequest(requestInfo, appId, authToken, appCheckToken, requestFactory, firebaseVersion, retry = true) {
        const queryPart = makeQueryString(requestInfo.urlParams);
        const url = requestInfo.url + queryPart;
        const headers = Object.assign({}, requestInfo.headers);
        addGmpidHeader_(headers, appId);
        addAuthHeader_(headers, authToken);
        addVersionHeader_(headers, firebaseVersion);
        addAppCheckHeader_(headers, appCheckToken);
        return new NetworkRequest(url, requestInfo.method, headers, requestInfo.body, requestInfo.successCodes, requestInfo.additionalRetryCodes, requestInfo.handler, requestInfo.errorHandler, requestInfo.timeout, requestInfo.progressCallback, requestFactory, retry);
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
     * Returns the Object resulting from parsing the given JSON, or null if the
     * given string does not represent a JSON object.
     */
    function jsonObjectOrNull(s) {
        let obj;
        try {
            obj = JSON.parse(s);
        }
        catch (e) {
            return null;
        }
        if (isNonArrayObject(obj)) {
            return obj;
        }
        else {
            return null;
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
     * @fileoverview Contains helper methods for manipulating paths.
     */
    /**
     * @return Null if the path is already at the root.
     */
    function parent(path) {
        if (path.length === 0) {
            return null;
        }
        const index = path.lastIndexOf('/');
        if (index === -1) {
            return '';
        }
        const newPath = path.slice(0, index);
        return newPath;
    }
    function child(path, childPath) {
        const canonicalChildPath = childPath
            .split('/')
            .filter(component => component.length > 0)
            .join('/');
        if (path.length === 0) {
            return canonicalChildPath;
        }
        else {
            return path + '/' + canonicalChildPath;
        }
    }
    /**
     * Returns the last component of a path.
     * '/foo/bar' -> 'bar'
     * '/foo/bar/baz/' -> 'baz/'
     * '/a' -> 'a'
     */
    function lastComponent(path) {
        const index = path.lastIndexOf('/', path.length - 2);
        if (index === -1) {
            return path;
        }
        else {
            return path.slice(index + 1);
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
    function noXform_(metadata, value) {
        return value;
    }
    class Mapping {
        constructor(server, local, writable, xform) {
            this.server = server;
            this.local = local || server;
            this.writable = !!writable;
            this.xform = xform || noXform_;
        }
    }
    let mappings_ = null;
    function xformPath(fullPath) {
        if (!isString(fullPath) || fullPath.length < 2) {
            return fullPath;
        }
        else {
            return lastComponent(fullPath);
        }
    }
    function getMappings() {
        if (mappings_) {
            return mappings_;
        }
        const mappings = [];
        mappings.push(new Mapping('bucket'));
        mappings.push(new Mapping('generation'));
        mappings.push(new Mapping('metageneration'));
        mappings.push(new Mapping('name', 'fullPath', true));
        function mappingsXformPath(_metadata, fullPath) {
            return xformPath(fullPath);
        }
        const nameMapping = new Mapping('name');
        nameMapping.xform = mappingsXformPath;
        mappings.push(nameMapping);
        /**
         * Coerces the second param to a number, if it is defined.
         */
        function xformSize(_metadata, size) {
            if (size !== undefined) {
                return Number(size);
            }
            else {
                return size;
            }
        }
        const sizeMapping = new Mapping('size');
        sizeMapping.xform = xformSize;
        mappings.push(sizeMapping);
        mappings.push(new Mapping('timeCreated'));
        mappings.push(new Mapping('updated'));
        mappings.push(new Mapping('md5Hash', null, true));
        mappings.push(new Mapping('cacheControl', null, true));
        mappings.push(new Mapping('contentDisposition', null, true));
        mappings.push(new Mapping('contentEncoding', null, true));
        mappings.push(new Mapping('contentLanguage', null, true));
        mappings.push(new Mapping('contentType', null, true));
        mappings.push(new Mapping('metadata', 'customMetadata', true));
        mappings_ = mappings;
        return mappings_;
    }
    function addRef(metadata, service) {
        function generateRef() {
            const bucket = metadata['bucket'];
            const path = metadata['fullPath'];
            const loc = new Location(bucket, path);
            return service._makeStorageReference(loc);
        }
        Object.defineProperty(metadata, 'ref', { get: generateRef });
    }
    function fromResource(service, resource, mappings) {
        const metadata = {};
        metadata['type'] = 'file';
        const len = mappings.length;
        for (let i = 0; i < len; i++) {
            const mapping = mappings[i];
            metadata[mapping.local] = mapping.xform(metadata, resource[mapping.server]);
        }
        addRef(metadata, service);
        return metadata;
    }
    function fromResourceString(service, resourceString, mappings) {
        const obj = jsonObjectOrNull(resourceString);
        if (obj === null) {
            return null;
        }
        const resource = obj;
        return fromResource(service, resource, mappings);
    }
    function downloadUrlFromResourceString(metadata, resourceString, host, protocol) {
        const obj = jsonObjectOrNull(resourceString);
        if (obj === null) {
            return null;
        }
        if (!isString(obj['downloadTokens'])) {
            // This can happen if objects are uploaded through GCS and retrieved
            // through list, so we don't want to throw an Error.
            return null;
        }
        const tokens = obj['downloadTokens'];
        if (tokens.length === 0) {
            return null;
        }
        const encode = encodeURIComponent;
        const tokensList = tokens.split(',');
        const urls = tokensList.map((token) => {
            const bucket = metadata['bucket'];
            const path = metadata['fullPath'];
            const urlPart = '/b/' + encode(bucket) + '/o/' + encode(path);
            const base = makeUrl(urlPart, host, protocol);
            const queryString = makeQueryString({
                alt: 'media',
                token
            });
            return base + queryString;
        });
        return urls[0];
    }

    /**
     * Contains a fully specified request.
     *
     * @param I - the type of the backend's network response.
     * @param O - the output response type used by the rest of the SDK.
     */
    class RequestInfo {
        constructor(url, method, 
        /**
         * Returns the value with which to resolve the request's promise. Only called
         * if the request is successful. Throw from this function to reject the
         * returned Request's promise with the thrown error.
         * Note: The XhrIo passed to this function may be reused after this callback
         * returns. Do not keep a reference to it in any way.
         */
        handler, timeout) {
            this.url = url;
            this.method = method;
            this.handler = handler;
            this.timeout = timeout;
            this.urlParams = {};
            this.headers = {};
            this.body = null;
            this.errorHandler = null;
            /**
             * Called with the current number of bytes uploaded and total size (-1 if not
             * computable) of the request body (i.e. used to report upload progress).
             */
            this.progressCallback = null;
            this.successCodes = [200];
            this.additionalRetryCodes = [];
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
     * Throws the UNKNOWN StorageError if cndn is false.
     */
    function handlerCheck(cndn) {
        if (!cndn) {
            throw unknown();
        }
    }
    function downloadUrlHandler(service, mappings) {
        function handler(xhr, text) {
            const metadata = fromResourceString(service, text, mappings);
            handlerCheck(metadata !== null);
            return downloadUrlFromResourceString(metadata, text, service.host, service._protocol);
        }
        return handler;
    }
    function sharedErrorHandler(location) {
        function errorHandler(xhr, err) {
            let newErr;
            if (xhr.getStatus() === 401) {
                if (
                // This exact message string is the only consistent part of the
                // server's error response that identifies it as an App Check error.
                xhr.getErrorText().includes('Firebase App Check token is invalid')) {
                    newErr = unauthorizedApp();
                }
                else {
                    newErr = unauthenticated();
                }
            }
            else {
                if (xhr.getStatus() === 402) {
                    newErr = quotaExceeded(location.bucket);
                }
                else {
                    if (xhr.getStatus() === 403) {
                        newErr = unauthorized(location.path);
                    }
                    else {
                        newErr = err;
                    }
                }
            }
            newErr.status = xhr.getStatus();
            newErr.serverResponse = err.serverResponse;
            return newErr;
        }
        return errorHandler;
    }
    function objectErrorHandler(location) {
        const shared = sharedErrorHandler(location);
        function errorHandler(xhr, err) {
            let newErr = shared(xhr, err);
            if (xhr.getStatus() === 404) {
                newErr = objectNotFound(location.path);
            }
            newErr.serverResponse = err.serverResponse;
            return newErr;
        }
        return errorHandler;
    }
    function getDownloadUrl(service, location, mappings) {
        const urlPart = location.fullServerUrl();
        const url = makeUrl(urlPart, service.host, service._protocol);
        const method = 'GET';
        const timeout = service.maxOperationRetryTime;
        const requestInfo = new RequestInfo(url, method, downloadUrlHandler(service, mappings), timeout);
        requestInfo.errorHandler = objectErrorHandler(location);
        return requestInfo;
    }
    /**
     * Network layer for browsers. We use this instead of goog.net.XhrIo because
     * goog.net.XhrIo is hyuuuuge and doesn't work in React Native on Android.
     */
    class XhrConnection {
        constructor() {
            this.sent_ = false;
            this.xhr_ = new XMLHttpRequest();
            this.initXhr();
            this.errorCode_ = ErrorCode.NO_ERROR;
            this.sendPromise_ = new Promise(resolve => {
                this.xhr_.addEventListener('abort', () => {
                    this.errorCode_ = ErrorCode.ABORT;
                    resolve();
                });
                this.xhr_.addEventListener('error', () => {
                    this.errorCode_ = ErrorCode.NETWORK_ERROR;
                    resolve();
                });
                this.xhr_.addEventListener('load', () => {
                    resolve();
                });
            });
        }
        send(url, method, body, headers) {
            if (this.sent_) {
                throw internalError('cannot .send() more than once');
            }
            this.sent_ = true;
            this.xhr_.open(method, url, true);
            if (headers !== undefined) {
                for (const key in headers) {
                    if (headers.hasOwnProperty(key)) {
                        this.xhr_.setRequestHeader(key, headers[key].toString());
                    }
                }
            }
            if (body !== undefined) {
                this.xhr_.send(body);
            }
            else {
                this.xhr_.send();
            }
            return this.sendPromise_;
        }
        getErrorCode() {
            if (!this.sent_) {
                throw internalError('cannot .getErrorCode() before sending');
            }
            return this.errorCode_;
        }
        getStatus() {
            if (!this.sent_) {
                throw internalError('cannot .getStatus() before sending');
            }
            try {
                return this.xhr_.status;
            }
            catch (e) {
                return -1;
            }
        }
        getResponse() {
            if (!this.sent_) {
                throw internalError('cannot .getResponse() before sending');
            }
            return this.xhr_.response;
        }
        getErrorText() {
            if (!this.sent_) {
                throw internalError('cannot .getErrorText() before sending');
            }
            return this.xhr_.statusText;
        }
        /** Aborts the request. */
        abort() {
            this.xhr_.abort();
        }
        getResponseHeader(header) {
            return this.xhr_.getResponseHeader(header);
        }
        addUploadProgressListener(listener) {
            if (this.xhr_.upload != null) {
                this.xhr_.upload.addEventListener('progress', listener);
            }
        }
        removeUploadProgressListener(listener) {
            if (this.xhr_.upload != null) {
                this.xhr_.upload.removeEventListener('progress', listener);
            }
        }
    }
    class XhrTextConnection extends XhrConnection {
        initXhr() {
            this.xhr_.responseType = 'text';
        }
    }
    function newTextConnection() {
        return new XhrTextConnection();
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
     * Provides methods to interact with a bucket in the Firebase Storage service.
     * @internal
     * @param _location - An fbs.location, or the URL at
     *     which to base this object, in one of the following forms:
     *         gs://<bucket>/<object-path>
     *         http[s]://firebasestorage.googleapis.com/
     *                     <api-version>/b/<bucket>/o/<object-path>
     *     Any query or fragment strings will be ignored in the http[s]
     *     format. If no value is passed, the storage object will use a URL based on
     *     the project ID of the base firebase.App instance.
     */
    class Reference {
        constructor(_service, location) {
            this._service = _service;
            if (location instanceof Location) {
                this._location = location;
            }
            else {
                this._location = Location.makeFromUrl(location, _service.host);
            }
        }
        /**
         * Returns the URL for the bucket and path this object references,
         *     in the form gs://<bucket>/<object-path>
         * @override
         */
        toString() {
            return 'gs://' + this._location.bucket + '/' + this._location.path;
        }
        _newRef(service, location) {
            return new Reference(service, location);
        }
        /**
         * A reference to the root of this object's bucket.
         */
        get root() {
            const location = new Location(this._location.bucket, '');
            return this._newRef(this._service, location);
        }
        /**
         * The name of the bucket containing this reference's object.
         */
        get bucket() {
            return this._location.bucket;
        }
        /**
         * The full path of this object.
         */
        get fullPath() {
            return this._location.path;
        }
        /**
         * The short name of this object, which is the last component of the full path.
         * For example, if fullPath is 'full/path/image.png', name is 'image.png'.
         */
        get name() {
            return lastComponent(this._location.path);
        }
        /**
         * The `StorageService` instance this `StorageReference` is associated with.
         */
        get storage() {
            return this._service;
        }
        /**
         * A `StorageReference` pointing to the parent location of this `StorageReference`, or null if
         * this reference is the root.
         */
        get parent() {
            const newPath = parent(this._location.path);
            if (newPath === null) {
                return null;
            }
            const location = new Location(this._location.bucket, newPath);
            return new Reference(this._service, location);
        }
        /**
         * Utility function to throw an error in methods that do not accept a root reference.
         */
        _throwIfRoot(name) {
            if (this._location.path === '') {
                throw invalidRootOperation(name);
            }
        }
    }
    /**
     * Returns the download URL for the given Reference.
     * @public
     * @returns A `Promise` that resolves with the download
     *     URL for this object.
     */
    function getDownloadURL$1(ref) {
        ref._throwIfRoot('getDownloadURL');
        const requestInfo = getDownloadUrl(ref.storage, ref._location, getMappings());
        return ref.storage
            .makeRequestWithTokens(requestInfo, newTextConnection)
            .then(url => {
            if (url === null) {
                throw noDownloadURL();
            }
            return url;
        });
    }
    /**
     * Returns reference for object obtained by appending `childPath` to `ref`.
     *
     * @param ref - StorageReference to get child of.
     * @param childPath - Child path from provided ref.
     * @returns A reference to the object obtained by
     * appending childPath, removing any duplicate, beginning, or trailing
     * slashes.
     *
     */
    function _getChild$1(ref, childPath) {
        const newPath = child(ref._location.path, childPath);
        const location = new Location(ref._location.bucket, newPath);
        return new Reference(ref.storage, location);
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
    function isUrl(path) {
        return /^[A-Za-z]+:\/\//.test(path);
    }
    /**
     * Returns a firebaseStorage.Reference for the given url.
     */
    function refFromURL(service, url) {
        return new Reference(service, url);
    }
    /**
     * Returns a firebaseStorage.Reference for the given path in the default
     * bucket.
     */
    function refFromPath(ref, path) {
        if (ref instanceof FirebaseStorageImpl) {
            const service = ref;
            if (service._bucket == null) {
                throw noDefaultBucket();
            }
            const reference = new Reference(service, service._bucket);
            {
                return refFromPath(reference, path);
            }
        }
        else {
            // ref is a Reference
            {
                return _getChild$1(ref, path);
            }
        }
    }
    function ref$1(serviceOrRef, pathOrUrl) {
        if (isUrl(pathOrUrl)) {
            if (serviceOrRef instanceof FirebaseStorageImpl) {
                return refFromURL(serviceOrRef, pathOrUrl);
            }
            else {
                throw invalidArgument('To use ref(service, url), the first argument must be a Storage instance.');
            }
        }
        else {
            return refFromPath(serviceOrRef, pathOrUrl);
        }
    }
    function extractBucket(host, config) {
        const bucketString = config === null || config === void 0 ? void 0 : config[CONFIG_STORAGE_BUCKET_KEY];
        if (bucketString == null) {
            return null;
        }
        return Location.makeFromBucketSpec(bucketString, host);
    }
    function connectStorageEmulator$1(storage, host, port, options = {}) {
        storage.host = `${host}:${port}`;
        storage._protocol = 'http';
        const { mockUserToken } = options;
        if (mockUserToken) {
            storage._overrideAuthToken =
                typeof mockUserToken === 'string'
                    ? mockUserToken
                    : createMockUserToken(mockUserToken, storage.app.options.projectId);
        }
    }
    /**
     * A service that provides Firebase Storage Reference instances.
     * @param opt_url - gs:// url to a custom Storage Bucket
     *
     * @internal
     */
    class FirebaseStorageImpl {
        constructor(
        /**
         * FirebaseApp associated with this StorageService instance.
         */
        app, _authProvider, 
        /**
         * @internal
         */
        _appCheckProvider, 
        /**
         * @internal
         */
        _url, _firebaseVersion) {
            this.app = app;
            this._authProvider = _authProvider;
            this._appCheckProvider = _appCheckProvider;
            this._url = _url;
            this._firebaseVersion = _firebaseVersion;
            this._bucket = null;
            /**
             * This string can be in the formats:
             * - host
             * - host:port
             */
            this._host = DEFAULT_HOST;
            this._protocol = 'https';
            this._appId = null;
            this._deleted = false;
            this._maxOperationRetryTime = DEFAULT_MAX_OPERATION_RETRY_TIME;
            this._maxUploadRetryTime = DEFAULT_MAX_UPLOAD_RETRY_TIME;
            this._requests = new Set();
            if (_url != null) {
                this._bucket = Location.makeFromBucketSpec(_url, this._host);
            }
            else {
                this._bucket = extractBucket(this._host, this.app.options);
            }
        }
        /**
         * The host string for this service, in the form of `host` or
         * `host:port`.
         */
        get host() {
            return this._host;
        }
        set host(host) {
            this._host = host;
            if (this._url != null) {
                this._bucket = Location.makeFromBucketSpec(this._url, host);
            }
            else {
                this._bucket = extractBucket(host, this.app.options);
            }
        }
        /**
         * The maximum time to retry uploads in milliseconds.
         */
        get maxUploadRetryTime() {
            return this._maxUploadRetryTime;
        }
        set maxUploadRetryTime(time) {
            validateNumber('time', 
            /* minValue=*/ 0, 
            /* maxValue= */ Number.POSITIVE_INFINITY, time);
            this._maxUploadRetryTime = time;
        }
        /**
         * The maximum time to retry operations other than uploads or downloads in
         * milliseconds.
         */
        get maxOperationRetryTime() {
            return this._maxOperationRetryTime;
        }
        set maxOperationRetryTime(time) {
            validateNumber('time', 
            /* minValue=*/ 0, 
            /* maxValue= */ Number.POSITIVE_INFINITY, time);
            this._maxOperationRetryTime = time;
        }
        async _getAuthToken() {
            if (this._overrideAuthToken) {
                return this._overrideAuthToken;
            }
            const auth = this._authProvider.getImmediate({ optional: true });
            if (auth) {
                const tokenData = await auth.getToken();
                if (tokenData !== null) {
                    return tokenData.accessToken;
                }
            }
            return null;
        }
        async _getAppCheckToken() {
            const appCheck = this._appCheckProvider.getImmediate({ optional: true });
            if (appCheck) {
                const result = await appCheck.getToken();
                // TODO: What do we want to do if there is an error getting the token?
                // Context: appCheck.getToken() will never throw even if an error happened. In the error case, a dummy token will be
                // returned along with an error field describing the error. In general, we shouldn't care about the error condition and just use
                // the token (actual or dummy) to send requests.
                return result.token;
            }
            return null;
        }
        /**
         * Stop running requests and prevent more from being created.
         */
        _delete() {
            if (!this._deleted) {
                this._deleted = true;
                this._requests.forEach(request => request.cancel());
                this._requests.clear();
            }
            return Promise.resolve();
        }
        /**
         * Returns a new firebaseStorage.Reference object referencing this StorageService
         * at the given Location.
         */
        _makeStorageReference(loc) {
            return new Reference(this, loc);
        }
        /**
         * @param requestInfo - HTTP RequestInfo object
         * @param authToken - Firebase auth token
         */
        _makeRequest(requestInfo, requestFactory, authToken, appCheckToken, retry = true) {
            if (!this._deleted) {
                const request = makeRequest(requestInfo, this._appId, authToken, appCheckToken, requestFactory, this._firebaseVersion, retry);
                this._requests.add(request);
                // Request removes itself from set when complete.
                request.getPromise().then(() => this._requests.delete(request), () => this._requests.delete(request));
                return request;
            }
            else {
                return new FailRequest(appDeleted());
            }
        }
        async makeRequestWithTokens(requestInfo, requestFactory) {
            const [authToken, appCheckToken] = await Promise.all([
                this._getAuthToken(),
                this._getAppCheckToken()
            ]);
            return this._makeRequest(requestInfo, requestFactory, authToken, appCheckToken).getPromise();
        }
    }

    const name = "@firebase/storage";
    const version = "0.13.1";

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
     * Type constant for Firebase Storage.
     */
    const STORAGE_TYPE = 'storage';
    /**
     * Returns the download URL for the given {@link StorageReference}.
     * @public
     * @param ref - {@link StorageReference} to get the download URL for.
     * @returns A `Promise` that resolves with the download
     *     URL for this object.
     */
    function getDownloadURL(ref) {
        ref = getModularInstance(ref);
        return getDownloadURL$1(ref);
    }
    function ref(serviceOrRef, pathOrUrl) {
        serviceOrRef = getModularInstance(serviceOrRef);
        return ref$1(serviceOrRef, pathOrUrl);
    }
    /**
     * Gets a {@link FirebaseStorage} instance for the given Firebase app.
     * @public
     * @param app - Firebase app to get {@link FirebaseStorage} instance for.
     * @param bucketUrl - The gs:// url to your Firebase Storage Bucket.
     * If not passed, uses the app's default Storage Bucket.
     * @returns A {@link FirebaseStorage} instance.
     */
    function getStorage(app = getApp(), bucketUrl) {
        app = getModularInstance(app);
        const storageProvider = _getProvider(app, STORAGE_TYPE);
        const storageInstance = storageProvider.getImmediate({
            identifier: bucketUrl
        });
        const emulator = getDefaultEmulatorHostnameAndPort('storage');
        if (emulator) {
            connectStorageEmulator(storageInstance, ...emulator);
        }
        return storageInstance;
    }
    /**
     * Modify this {@link FirebaseStorage} instance to communicate with the Cloud Storage emulator.
     *
     * @param storage - The {@link FirebaseStorage} instance
     * @param host - The emulator host (ex: localhost)
     * @param port - The emulator port (ex: 5001)
     * @param options - Emulator options. `options.mockUserToken` is the mock auth
     * token to use for unit testing Security Rules.
     * @public
     */
    function connectStorageEmulator(storage, host, port, options = {}) {
        connectStorageEmulator$1(storage, host, port, options);
    }

    /**
     * Cloud Storage for Firebase
     *
     * @packageDocumentation
     */
    function factory(container, { instanceIdentifier: url }) {
        const app = container.getProvider('app').getImmediate();
        const authProvider = container.getProvider('auth-internal');
        const appCheckProvider = container.getProvider('app-check-internal');
        return new FirebaseStorageImpl(app, authProvider, appCheckProvider, url, SDK_VERSION);
    }
    function registerStorage() {
        _registerComponent(new Component(STORAGE_TYPE, factory, "PUBLIC" /* ComponentType.PUBLIC */).setMultipleInstances(true));
        //RUNTIME_ENV will be replaced during the compilation to "node" for nodejs and an empty string for browser
        registerVersion(name, version, '');
        // BUILD_TARGET will be replaced by values like esm5, esm2017, cjs5, etc during the compilation
        registerVersion(name, version, 'esm2017');
    }
    registerStorage();

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

    let syllabusCache = null;

    async function fetchSyllabus(fileName) { 
        let base64Data = null;

        const storage = getStorage(firebaseApp);
        const fileRef = ref(storage, "MATH108170.pdf");
        const downloadURL = await getDownloadURL(fileRef);
        const response = await fetch(downloadURL);
        const fileBlob = await response.blob();
        
        if (syllabusCache === null) {
            base64Data = await new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    const base64String = reader.result.split(",")[1];
                    syllabusCache = base64String;
                    resolve(base64String);
                };
                reader.onerror = reject;
                reader.readAsDataURL(fileBlob);
            });
        } else {
            base64Data = syllabusCache;
        }

        return base64Data;
    }

    window.fetchSyllabus = fetchSyllabus;

    // Parse markdown-style text formatting into HTML
    function parseTextStyle(text) {
        const boldRegex = /\*\*(.*?)\*\*/g;
        const italicRegex = /\*(.*?)\*/g;
        const underlineRegex = /__(.*?)__/g;
        const strikethroughRegex = /~~(.*?)~~/g;

        text = text.replace(boldRegex, "<b>$1</b>");
        text = text.replace(italicRegex, "<i>$1</i>");
        text = text.replace(underlineRegex, "<u>$1</u>");
        text = text.replace(strikethroughRegex, "<s>$1</s>");

        return text;
    }
        

    async function runModel(prompt) {
        const result = await model.generateContent([{ inlineData: { data: await fetchSyllabus(), mimeType: "application/pdf" }}, prompt]);

        const response = result.response;
        const text = response.text();
      
        return text;
    }

    function createChatText(text, direction) {
        const chatDiv = document.getElementById("chatDiv");
        const chatText = document.createElement("p");
        
        chatText.innerHTML = parseTextStyle(text);
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