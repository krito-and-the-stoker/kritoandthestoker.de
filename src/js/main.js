import boot from './boot.js'
import heads from './heads.js'

const toArray = nl => Array.prototype.slice.call(nl)

window.onload = async () => {
	await boot()
	await heads()
}