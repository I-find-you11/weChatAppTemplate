const { envVersion } = wx.getAccountInfoSync().miniProgram
export let v = envVersion != 'develop' ? envVersion : 'dev1'
const apiBash = {
	release: {
		https: true,
		url: ''
	},
  	dev1: {
		https: false,
		url: ''
	},
	trial: {
		https: false,
		url: ''
	}
}[v]

const { https, url } = apiBash
apiBash.bashUrl = `http${https ? 's' : ''}://${url}`
apiBash.ws = `ws${https ? 's' : ''}://${url}`

export default apiBash
