/**
 * @author: llk
 * @date: 2018/8/24
 * @function: 本地存储
 */

(function(global, factory) {
	global.storage = factory();
})(window, function() {
	let storage = {
		save(key, value) {
			localStorage.setItem(key, JSON.stringify(value));
		},
		get(key) {
			return JSON.parse(localStorage.getItem(key));
		},
		remove(key) {
			localStorage.removeItem(key);
		},
		removeAll() {
			localStorage.clear();
		}
	}
	return storage;
});