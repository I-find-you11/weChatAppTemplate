const https = ''
const images = {
	
} 


Object.keys(images).forEach(key => {
  images[key] = `${https}tms/${images[key]}`
})

export default { ...images }