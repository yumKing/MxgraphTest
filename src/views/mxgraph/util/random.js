//生成从minNum到maxNum的随机数
export function randomNum(minNum, maxNum) {
    switch (arguments.length) {
        case 1:
            return parseInt((Math.random() * minNum + 1).toFixed(), 10);
        case 2:
            return parseInt((Math.random() * (maxNum - minNum + 1) + minNum).toFixed(), 10);
        default:
            return 0;
    }
}
//# sourceMappingURL=random.js.map