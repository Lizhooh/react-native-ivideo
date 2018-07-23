// 全局变量
const store = {};

export default {
    get(key) {
        return store[key];
    },
    set(key, value) {
        store[key] = value;
        return this;
    }
}