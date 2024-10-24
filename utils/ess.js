function randomIndex(length) {
    min = 0;
    max = Math.floor(length)-1;
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
function randInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
module.exports.randomIndex = randomIndex;
module.exports.randInt = randInt;