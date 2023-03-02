const fs = require("fs");
const wallet = [];
let profit = 0;

const Initial = (filename) => {
	try {
		const contents = fs.readFileSync(filename, "utf-8");
		const arr = contents.split(/\r?\n/);
		const data = [];

		for (let index = 0; index < arr.length; index++) {
			data.push(arr[index].split(/\s+/));
		}

		return data;
	} catch (err) {
		console.log(err);
	}
};

const SearchWallet = (searchName, searchAmount) => {
	for (let index = 0; index < wallet.length; index++) {
		const element = wallet[index];
		const name = element[0];
		const price = element[1];
		const amount = element[2];

		if (name === searchName) {
			return {
				indexWallet: index,
				nameWallet: name,
				priceWallet: price,
				amountWallet: amount,
			};
		}
	}

	return { indexWallet: -1 };
};

const AddWallet = (name, price, amount) => {
	wallet.push([name, price, amount]);
};

const SellWallet = (name, price, amount) => {
	const { indexWallet, priceWallet, amountWallet } = SearchWallet(name, amount);

	if (indexWallet == -1) return;

	const summaryAmount = amountWallet - amount;

	if (priceWallet <= price) {
		//กำไร
		profit +=
			(price - priceWallet) * (summaryAmount <= 0 ? amountWallet : amount);
	} else {
		//ขาดทุน
		profit -=
			(priceWallet - price) * (summaryAmount <= 0 ? amountWallet : amount);
	}

	// console.log(profit, name, amount);

	if (summaryAmount <= 0) wallet.splice(indexWallet, 1);
	else wallet[indexWallet][3] = summaryAmount;

	if (amount > amountWallet) SellWallet(name, price, amount - amountWallet);
};

const FirstInFirstOut = (data) => {
	if (!data && !Array.isArray(data)) return;

	for (let index = 0; index < data.length; index++) {
		const element = data[index];
		const type = element[0];
		const name = element[1];
		const price = parseFloat(element[2]);
		const amount = parseFloat(element[3]);

		if (type.toLowerCase() === "b") {
			AddWallet(name, price, amount);
		} else if (type.toLowerCase() === "s") {
			SellWallet(name, price, amount);
		}
	}
};

setTimeout(() => {
	const data = Initial("./crypto_tax.txt");
	FirstInFirstOut(data);

	console.log(profit);
}, 500);
