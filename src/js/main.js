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
}



initializeNav();