import '/sass/main.scss';

const slider = document.querySelector('.slider');
const container = slider.querySelector('.slider__container');
const imgElements = container.querySelectorAll('.slider__item');
const btnLeft = slider.querySelector('.slider__button--left');
const btnRight = slider.querySelector('.slider__button--right');

const transitionTime = parseFloat(window.getComputedStyle(imgElements[0]).transitionDuration) * 1000;

const throttleFunction = (func) => {
	let prev = 0;
	return (...args) => {
		let now = new Date().getTime();
		if (now - prev > transitionTime) {
			prev = now;
			return func(...args);
		}
	};
};

const delay = (ms) => new Promise((res) => setTimeout(res, ms));

const hideElement = (imgElement) => {
	imgElement.classList.add('hidden');
};

const showElement = async (imgElement) => {
	console.log('wait');
	console.log(transitionTime);
	await delay(transitionTime);
	console.log('waited');
	imgElement.classList.remove('hidden');
};

const getLastRightElement = (imgArr) => {
	return container.querySelector(`[data-order="${calculateLastIndex(imgArr)}"]`);
};

const getLastLeftElement = (imgArr) => {
	return container.querySelector(`[data-order="${calculateFirstIndex(imgArr)}"]`);
};

const calculateFirstIndex = (imgArr) => {
	const firstIndex = -Math.floor(imgArr.length / 2);
	return firstIndex;
};

const calculateLastIndex = (imgArr) => {
	const lastIndex = calculateFirstIndex(imgArr) + imgArr.length - 1;
	return lastIndex;
};

const setOrderNumbers = (imgArr) => {
	imgArr.forEach((img, index, imgArr) => {
		img.setAttribute('data-order', calculateFirstIndex(imgArr) + index);
	});
};

const initalize = (imgArr) => {
	imgArr.forEach((img) => {
		const imgOrder = img.getAttribute('data-order');
		const imgPos = imgOrder * 105.5;
		img.style.transform = `translateX(${imgPos}%)`;
	});
};

const moveRight = (imgArr) => {
	imgArr.forEach((img) => {
		const currentOrder = Number(img.getAttribute('data-order'));
		const newOrder = currentOrder + 1 > calculateLastIndex(imgArr) ? calculateFirstIndex(imgArr) : currentOrder + 1;
		img.setAttribute('data-order', newOrder);
	});
	hideElement(getLastLeftElement(imgArr));
	initalize(imgArr);
	showElement(getLastLeftElement(imgArr));
};

const throttledMoveRight = throttleFunction(moveRight);

const moveLeft = (imgArr) => {
	imgArr.forEach((img) => {
		const currentOrder = Number(img.getAttribute('data-order'));
		const newOrder = currentOrder - 1 < calculateFirstIndex(imgArr) ? calculateLastIndex(imgArr) : currentOrder - 1;
		img.setAttribute('data-order', newOrder);
	});
	hideElement(getLastRightElement(imgArr));
	initalize(imgArr);
	showElement(getLastRightElement(imgArr));
};

const throttledMoveLeft = throttleFunction(moveLeft);

setOrderNumbers(imgElements);
initalize(imgElements);

btnLeft.addEventListener('click', () => {
	throttledMoveRight(imgElements);
});

btnRight.addEventListener('click', () => {
	throttledMoveLeft(imgElements);
});
