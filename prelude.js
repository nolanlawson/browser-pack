
// modules are defined as an array
// [ module function, map of requireuires ]
//
// map of requireuires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the requireuire for previous bundles

(function outer (modules, cache, entry) {
    // Save the require from previous bundle to this closure if any
    var previousRequire = typeof require == "function" && require;

    function newRequire(name, jumped){
        var cachedModule = cache[name];
        var theModule;
        var currentRequire;
        var err;
        var theExports;

        if(!cachedModule) {
            theModule = modules[name]
            if(!theModule) {
                // if we cannot find the module within our internal map or
                // cache jump to the current global require ie. the last bundle
                // that was added to the page.
                currentRequire = typeof require == "function" && require;
                if (!jumped && currentRequire) return currentRequire(name, true);

                // If there are other bundles on this page the require from the
                // previous one is saved to 'previousRequire'. Repeat this as
                // many times as there are bundles until the module is found or
                // we exhaust the require chain.
                if (previousRequire) return previousRequire(name, true);
                err = new Error('Cannot find module \'' + name + '\'');
                err.code = 'MODULE_NOT_FOUND';
                throw err;
            }
            theExports = {};
            cachedModule = cache[name] = {exports: theExports};
            theModule[0].call(theExports, function(x){
                return newRequire(theModule[1][x] || x);
            },cachedModule,theExports,outer,modules,cache,entry);
        }
        return cachedModule.exports;
    }
    var i = -1;
    while (++i < entry.length) {
        newRequire(entry[i]);
    }

    // Override the current require with this new one
    return newRequire;
})
