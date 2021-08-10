
function getStorage() {
    var obj = {};

    if (storage === undefined) {
        return;
    }

    var specialKeys = [
        'length', 'key', 'getItem'
    ];

    for (var i in storage) {
        if (storage.hasOwnProperty(i)) {
			if (i == "drm_keys"){
				var x = storage.getItem(i);
				x = JSON.parse(x);
				//obj[0] = x;
				for (var y in x) {
					var kid = [y];
					var key = x[y];
					obj[kid] = key;
				}
			}
        }
    }

    return obj;
}

var storage = msg.type === 'L' ? localStorage : sessionStorage;
var result;

switch (msg.what) {

    case 'get':
        result = getStorage();
        console.table(result);
        break;


    case 'export':
        result = JSON.stringify(getStorage(), null, 4);
        break;

}

result;
