import boot from './boot.js'

const toArray = nl => Array.prototype.slice.call(nl)

const initializeNav = () => {
	toArray(document.querySelectorAll('nav a')).forEach((a) => {
		a.addEventListener('click', (e) => {
			e.preventDefault()
			document.querySelector(a.getAttribute('href')).scrollIntoView({ 
			  behavior: 'smooth' 
			});
		})
	})

	const brand = document.querySelector('.brand')
	const nav = document.querySelector('nav')
	const boot = document.querySelector('#boot')
	window.addEventListener('scroll', () => {
		if (window.scrollY - 50 >= boot.getBoundingClientRect().bottom) {
			brand.classList.add('invisible')
			nav.classList.add('background')
		} else {
			brand.classList.remove('invisible')
			nav.classList.remove('background')
		}
	})
}

initializeNav();
boot();