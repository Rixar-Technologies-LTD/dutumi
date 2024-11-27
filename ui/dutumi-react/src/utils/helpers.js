



export function isDevEnvironment(){
    return (!process.env.NODE_ENV
        || process.env.NODE_ENV === 'development'
        || process.env.NODE_ENV === 'dev'
        || process.env.NODE_ENV === 'local');
}

export function isEmpty(value){

    if(value===null){
        return true;
    }

    if(value===undefined){
        return true;
    }

    if(value==='undefined'){
        return true;
    }

    if(value==='null'){
        return true;
    }

    return value === '';

}

export function isNotEmpty(value){
    return !isEmpty(value);
}

export function areEmpty(value1,value2){
    return isEmpty(value1) && isEmpty(value2);
}

export function limitText(value,charCount){
    if(isEmpty(value)){
        return value;
    }
    if(value.length<=charCount){
        return value;
    }
    return value.substring(0,charCount-1)+"...";
}

/**
 * Checks if superSetList contains any strings from subList.
 *
 * @param {string[]} superSetList - The array of strings to check against.
 * @param {string[]} subList - The array of strings to look for.
 * @returns {boolean} - Returns true if any string in subList is found in superSetList.
 */
export function containsAny(superSetList ,subList){
    return subList.some(item => superSetList.includes(item));
}
/**
 * Checks if superSetList does not contain any strings from subList.
 *
 * @param {string[]} superSetList - The array of strings to check against.
 * @param {string[]} subList - The array of strings to look for.
 * @returns {boolean} - Returns true if none of the strings in subList are found in superSetList.
 */
export function doesNotContainAnyString(superSetList ,subList){
    return containsAny(superSetList,subList);
}


export function codeStartsWith(respCode,charToCompare){
    if(isEmpty(respCode)){
        return false
    }

    return `${respCode}`.startsWith(`${charToCompare}`);
}
