import charMapJson from './charMap.json' assert { type: 'json' };
import blacklistJson from './blacklist.json' assert { type: 'json' };
import whitelistJson from './whitelist.json' assert { type: 'json' };

function escapeRegex(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function createWhitelistRegex(whitelistArray) {
    let regexString = '\\b(';
    let i = 0;

    while (i < whitelistArray.length - 1) {
        regexString = `${regexString}${escapeRegex(whitelistArray[i])}|`;
        i++;
    }

    if (whitelistArray.length !== 0) {
        regexString = `${regexString}${escapeRegex(whitelistArray[i])})\\b`;
    }

    return new RegExp(regexString, 'gi');
}

function createEntriesForAllMappings(hashMap) {
    const setMap = new Map();

    // convert to sets
    for (const [key, values] of hashMap) {
        const set = new Set(values);
        set.add(key); // ensure all mappings contain itself
        setMap.set(key, set);
    }

    // create keys for all values and connect the keys
    /*
    existing keys during iteration may not have enough mappings to determine that they are mapped together. thus elements in the set are checked to see if mappings for it exists and are then added to the current mapping.
    this iterates through the mapping set and combines the mapping sets of the elements with the current mapping set.
    */
    for (const [key, values] of setMap) {
        let setEntries = [...values];
        let n = setEntries.length;

        for (let i = 0; i < n; i++) {
            const entry = setEntries[i];

            if (setMap.has(entry)) { // connect mappings
                const set = setMap.get(entry);
                const newSet = new Set([...setEntries, ...set]);
                setMap.set(key, newSet);
                setMap.set(entry, newSet);

                // update loop vars
                setEntries = [...newSet];
                n = setEntries.length;
            }
            else { // create mapping
                setMap.set(entry, values);
            }
        }
    }

    // convert to arrays
    for (const [key, values] of setMap) {
        setMap.set(key, [...values]);
    }

    return setMap;
}

function createBlacklistRegex(blacklistArray, charMap) {
    let regex = '';
    let i = 0;

    while (i < blacklistArray.length - 1) {
        const blacklistedString = blacklistArray[i];
        let regexString = '';
        let j = 0;

        while (j < blacklistedString.length - 1) {
            const character = blacklistedString[j];
            let variantsArray = [];

            if (charMap.has(character)) {
                variantsArray = charMap.get(blacklistedString[j]);
            }

            let variantsString = '';
            let k = 0;

            while (k < variantsArray.length - 1) {
                variantsString = `${variantsString}${escapeRegex(variantsArray[k])}|`;
                k++;
            }

            if (variantsArray.length !== 0) {
                variantsString = `${variantsString}${escapeRegex(variantsArray[k])}`;
            }
            else {
                variantsString = '[^a-z0-9]';
            }

            regexString = `${regexString}(${variantsString})+[^a-z0-9]*`;
            j++;
        }

        if (blacklistedString.length !== 0) {
            const character = blacklistedString[j];
            let variantsArray = [];

            if (charMap.has(character)) {
                variantsArray = charMap.get(blacklistedString[j]);
            }

            let variantsString = '';
            let k = 0;

            while (k < variantsArray.length - 1) {
                variantsString = `${variantsString}${escapeRegex(variantsArray[k])}|`;
                k++;
            }

            if (variantsArray.length !== 0) {
                variantsString = `${variantsString}${escapeRegex(variantsArray[k])}`;
            }
            else {
                variantsString = '[^a-z0-9]';
            }

            regexString = `${regexString}(${variantsString})+`;
        }

        regex = `${regex}(${regexString})|`;
        i++;
    }

    if (blacklistArray.length !== 0) {
        const blacklistedString = blacklistArray[i];
        let regexString = '';
        let j = 0;

        while (j < blacklistedString.length - 1) {
            const character = blacklistedString[j];
            let variantsArray = [];

            if (charMap.has(character)) {
                variantsArray = charMap.get(blacklistedString[j]);
            }

            let variantsString = '';
            let k = 0;

            while (k < variantsArray.length - 1) {
                variantsString = `${variantsString}${escapeRegex(variantsArray[k])}|`;
                k++;
            }

            if (variantsArray.length !== 0) {
                variantsString = `${variantsString}${escapeRegex(variantsArray[k])}`;
            }
            else {
                variantsString = '[^a-z0-9]';
            }

            regexString = `${regexString}(${variantsString})+[^a-z]*`;
            j++;
        }

        if (blacklistedString.length !== 0) {
            const character = blacklistedString[j];
            let variantsArray = [];

            if (charMap.has(character)) {
                variantsArray = charMap.get(blacklistedString[j]);
            }

            let variantsString = '';
            let k = 0;

            while (k < variantsArray.length - 1) {
                variantsString = `${variantsString}${escapeRegex(variantsArray[k])}|`;
                k++;
            }

            if (variantsArray.length !== 0) {
                variantsString = `${variantsString}${escapeRegex(variantsArray[k])}`;
            }
            else {
                variantsString = '[^a-z0-9]';
            }

            regexString = `${regexString}(${variantsString})+`;
        }

        regex = `${regex}(${regexString})`;
    }

    return new RegExp(regex, 'gi');
}

function filter(string, blacklistRegex, whitelistRegex) {
    const whitelistMatches = [...string.matchAll(whitelistRegex)];

    for (let i = 0; i < whitelistMatches.length; i++) {
        const capturedString = whitelistMatches[i][0];
        string = string.replace(capturedString, '*'.repeat(capturedString.length));
    }

    //-------------------------------------------------------

    const blacklistMatches = [...string.matchAll(blacklistRegex)];

    for (let i = 0; i < blacklistMatches.length; i++) {
        const capturedString = blacklistMatches[i][0];
        string = string.replace(capturedString, '*'.repeat(capturedString.length));
    }

    //-------------------------------------------------------

    for (let i = 0; i < whitelistMatches.length; i++) {
        const match = whitelistMatches[i];
        const index = match['index'];
        string = `${string.substring(0, index)}${match[0]}${string.substring(index + match[0].length)}`;
    }

    return {
        constainsBlacklisted: blacklistMatches.length !== 0,
        censoredString: string,
        extractedStrings: blacklistMatches
    };
}

function main() {
    const tests = new Map();
    tests.set("@ss", true);
    tests.set("$h1+", true);
    tests.set("fuck", true);
    tests.set("ffuucckk", true);
    tests.set("a s s", true);
    tests.set("a z z", true);
    tests.set("@ s s", true);
    tests.set("* s s", true);
    tests.set("* z z", true);
    tests.set("as s", true);
    tests.set("az s", true);
    tests.set("a ss", true);
    tests.set("a-ss", true);
    tests.set("a-s-s", true);
    tests.set("a ss word", true);
    tests.set("as s word", true);
    tests.set("as $ word", true);
    tests.set("assass", true);
    tests.set("assassass", true);
    tests.set("assasass", true);
    tests.set("assasassas", true);
    tests.set("assa$assas", true);
    tests.set("assa$zassas", true);
    tests.set("assa$as", true);
    tests.set("assa$zas", true);
    tests.set("assasswww", true);
    tests.set("f-word", true);
    tests.set("f word", true);
    tests.set("bitch", true);
    tests.set("bitkh", true);
    tests.set("b1tch", true);
    tests.set("batch", false);
    tests.set("b*tch", true);
    tests.set("b*tkh", true);
    tests.set("batch b*tch", true);
    tests.set("stop being ab itch", true); // stop being a bitch
    tests.set("stopbeingabitch", true); // stop being a bitch
    tests.set("stopbeingab itch", true); // stop being a bitch
    tests.set("your assis trash", true);

    // false positives
    tests.set("as suspected", false);
    tests.set("polish it", false);
    tests.set("sh ithead", true); // shit head
    tests.set("slab itch", false);
    tests.set("stab itch", false);
    tests.set("dab itch", false);
    tests.set("pleb itch", false);
    tests.set("fib itch", false);
    tests.set("slob itch", false);
    tests.set("dub itch", false);
    tests.set("ab itch", true); // "a bitch" or "ab itch"
    tests.set("compass", false);
    tests.set("bass", false);
    tests.set("assassinate", false);
    tests.set("assassin", false);
    tests.set("assessment", false);
    tests.set("assemble", false);
    tests.set("assume", false);
    tests.set("a$$emble", true);
    tests.set("comp@ss", true);
    tests.set("dam n", true);
    tests.set("dam nobody", false);
    tests.set("adam nice", false);
    tests.set("pen is", true); // "pen is" or "penis"
    tests.set("the pen is red", false);
    tests.set("pen island", false);
    tests.set("open island", false);
    tests.set("dampen island", false);
    tests.set("happen island", false);
    tests.set("happen issue", false);
    tests.set("happen isolate", false);
    tests.set("happen isotope", false);

    // whitelist test
    tests.set("scunthorpe", false);
    tests.set("nigeria", false);
    tests.set("penistone", false);
    tests.set("fuck penistone fuck", true);
    tests.set("fuck penistone fuck penistone nigeria scunthorpe", true);

    //-------------------------------------------------------------
    // mappings and regex

    const mappings = Object.entries(charMapJson);
    const charMap = createEntriesForAllMappings(mappings);

    // add support for star censored vowels
    const vowels = [
        'a',
        'e',
        'i',
        'o',
        'u'
    ];
    const star = '*';
    const starCharMap = charMap;

    for (let i = 0, n = vowels.length; i < n; i++) {
        starCharMap.get(vowels[i]).push(star);
    }

    const blacklistRegex = createBlacklistRegex(Object.values(blacklistJson), starCharMap);
    const whitelistRegex = createWhitelistRegex(Object.values(whitelistJson));

    //-------------------------------------------------------------
    // testing

    for (const [test, outcome] of tests) {
        const {
            constainsBlacklisted,
            censoredString,
            extractedStrings
        } = filter(test, blacklistRegex, whitelistRegex);

        if (outcome !== constainsBlacklisted) {
            console.log("test:", test, "\ttrue outcome:", outcome, "\ttested outcome:", constainsBlacklisted, "\tcensored string:", censoredString);
        }
        else {
            console.log("test:", test, "\tcensored string:", censoredString);
        }
    }
}

main();
