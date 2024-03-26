const box = document.getElementById("productA")
const originalPrice = 12000
let price = 12000;
document.getElementById("productAprice").innerHTML = "$" + price;


num = box.value 

console.log(parseInt( num))

const increaseQuantity = () => {
    const val = box.value
    price = originalPrice*val
    document.getElementById("productAprice").innerHTML = "$" + price;
    console.log(price)
}

box.addEventListener("change" , () => {
    increaseQuantity()
})

