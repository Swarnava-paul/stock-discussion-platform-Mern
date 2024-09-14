
const sortFunction = (sortBy) => {

    let dynamicSortingKey = {}
    const sortType = sortBy.split("=")[0];
    const sortOrder = sortBy.split("=")[1];

    if(sortType == 'date' && sortOrder == 'asc') {
        dynamicSortingKey.postDate = 1;
    }else if(sortType == 'date' && sortOrder == 'desc'){
        dynamicSortingKey.postDate = -1;
    }else if(sortType == 'likes' && sortOrder == 'asc'){
        dynamicSortingKey.likesCount = 1;
    }else if (sortType == 'likes' && sortOrder == 'desc') {
        dynamicSortingKey.likesCount = -1;
    }

    return dynamicSortingKey;
}

/**
 this function takes sortBy as a parameter and 
 split that and check the value of sortType and sortOrder based on calculation it will return
 a object with key associated match with database key and for asc it 
 */

module.exports = sortFunction;
