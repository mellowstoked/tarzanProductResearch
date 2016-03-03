function Product(attributes) {
	if(!(this instanceof Product)) return new Product(attributes)
	attributes = attributes || {}
	this.title = attributes.type || "No Title"
	this.price = attributes.price || "No Price"
	
	// console.log(attributes)
}
module.exports = Product