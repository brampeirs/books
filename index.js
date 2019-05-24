let bookContainer = document.querySelector('.search')
let searchBooks = document.getElementById('search-box')
const getBooks = async book => {
	const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${book}`)
	const data = await response.json()
	return data
}
const drawChartBook = async (subject) => {
	let cbookContainer = document.querySelector(`.${subject}`)
	cbookContainer.innerHTML = `<div class='prompt'><div class="loader"></div><div>Loading...</div></div>`
	const cdata = await getBooks(`subject:${subject}&maxResults=6&orderBy=newest`)
	if (cdata.error) {
		cbookContainer.innerHTML = `<div class='prompt'><div class='prompt'>ツ</div>Limit exceeded! Try after some time</div>`
	} else if (cdata.totalItems == 0) {
		cbookContainer.innerHTML = `<div class='prompt'><div class='prompt'>ツ</div>No results, try a different term!</div>`
	} else if (cdata.totalItems == undefined) {
		cbookContainer.innerHTML = `<div class='prompt'><div class='prompt'>ツ</div>Network problem!</div>`
	} else {
		cbookContainer.innerHTML = cdata.items
			.map(({
				volumeInfo
			}) => `<div class='book' style='background: linear-gradient(` + getRandomColor() + `, rgba(0, 0, 0, 0));'><a class='link' href='${volumeInfo.infoLink}' target='_blank'><img class='thumbnail' src='${volumeInfo.imageLinks.thumbnail.replace('http://', 'https://')}' onerror='this.src="icons/logo.svg";'></a><div class='book-info'><a class='link' href='${volumeInfo.infoLink}' target='_blank'><h3 class='book-title'>${volumeInfo.title}</h3></a><div class='book-authors' onclick='updateFilter(this,"author");'>${volumeInfo.authors}</div><div class='info' onclick='updateFilter(this,"subject");' style='background-color: ` + getRandomColor() + `;'>${volumeInfo.categories}</div></div></div>`)
			.join('')
	}
}
const drawListBook = async () => {
	if (searchBooks.value != '') {
		bookContainer.innerHTML = `<div class='prompt'><div class="loader"></div><div>Searching...</div></div>`
		const data = await getBooks(searchBooks.value)
		if (data.error) {
			bookContainer.innerHTML = `<div class='prompt'><div class='prompt'>ツ</div>Limit exceeded! Try after some time</div>`
		} else if (data.totalItems == 0) {
			bookContainer.innerHTML = `<div class='prompt'><div class='prompt'>ツ</div>No results, try a different term!</div>`
		} else if (data.totalItems == undefined) {
			bookContainer.innerHTML = `<div class='prompt'><div class='prompt'>ツ</div>Network problem!</div>`
		} else {
			bookContainer.innerHTML = data.items
				.map(({
					volumeInfo
				}) => `<div class='book' style='background: linear-gradient(` + getRandomColor() + `, rgba(0, 0, 0, 0));'><a class='link' href='${volumeInfo.infoLink}' target='_blank'><img class='thumbnail' src='${volumeInfo.imageLinks.thumbnail.replace('http://', 'https://')}' onerror='this.src="icons/logo.svg";'></a><div class='book-info'><a class='link' href='${volumeInfo.infoLink}' target='_blank'><h3 class='book-title'>${volumeInfo.title}</h3></a><div class='book-authors' onclick='updateFilter(this,"author");'>${volumeInfo.authors}</div><div class='info' onclick='updateFilter(this,"subject");' style='background-color: ` + getRandomColor() + `;'>${volumeInfo.categories}</div></div></div>`)
				.join('')
		}
	} else {
		bookContainer.innerHTML = `<div class='prompt'>Enter a search term</div>`
	}
}
const updateFilter = ({
	innerHTML
}, f) => {
	document.getElementById('main').scrollIntoView({
		behavior: 'smooth'
	})
	let m
	switch (f) {
		case 'author':
			m = 'inauthor:'
			break
		case 'subject':
			m = 'subject:'
			break
	}
	searchBooks.value = m + innerHTML
	debounce(drawListBook, 1000)
}
const debounce = (fn, time, to = 0) => {
	to ? clearTimeout(to) : (to = setTimeout(drawListBook, time))
}
searchBooks.addEventListener('input', () => {
	debounce(drawListBook, 1000)
})
document.addEventListener('DOMContentLoaded', () => {
	drawChartBook('fiction')
	drawChartBook('poetry')
	drawChartBook('fantasy')
	drawChartBook('romance')
})
let mainNavLinks = document.querySelectorAll('.nav')
window.addEventListener('scroll', event => {
	let fromTop = window.scrollY + 128
	mainNavLinks.forEach(({
		hash,
		classList
	}) => {
		let section = document.querySelector(hash)
		if (section.offsetTop <= fromTop && section.offsetTop + section.offsetHeight > fromTop) {
			classList.add('current')
		} else {
			classList.remove('current')
		}
	})
})
const getRandomColor = () => {
	let letters = '0123456789ABCDEF'
	let color = '#'
	for (let i = 0; i < 6; i++) {
		color += letters[Math.floor(Math.random() * 16)]
	}
	color += '1A'
	return color
}
