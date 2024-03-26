const box = document.getElementById("productA")

const originalPrice = 12000
let price = 12000;

box.value = price
document.getElementById("productAprice").innerHTML = "$" + price;




const changeQuantity = () => {
    const val = box.value
    price = val
    document.getElementById("productAprice").innerHTML = "$" + price;
    console.log(price)
}

box.addEventListener("change" , () => {
    changeQuantity()
})

const buy = document.getElementsByClassName('buy')
console.log(buy)

for (let i = 0; i < buy.length; i++) {
    buy[i].addEventListener("click" , (event) => {
        event. target.parentElement.parentElement.parentElement.remove()
        console.log("hii")
    })
}