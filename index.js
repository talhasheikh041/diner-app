import { menuArray } from "/data.js"
const orderItemsArr = []
const orderSection = document.getElementById("order-section")
const modal = document.getElementById("modal")


document.addEventListener("click", (e) => {
    if (e.target.dataset.add) {
        orderSection.style.display = "flex"
        addOrderItem(e.target.dataset.add)
    }
    else if (e.target.dataset.remove) {
        removeOrderItem(e.target.dataset.remove)
    }
    else if (e.target.dataset.decrement) {
        decrementQuantity(e.target.dataset.decrement)
    }
    else if (e.target.id === "complete-order-btn") {
        generateModal()
        modal.style.display = "flex"
        body.style.overflow = "hidden"
    }
    else if (e.target.id === "pay-btn") {
        orderComplete()
    }
})

function resetOrder() {
    setTimeout(() => {
        generateModal()
        modal.style.display = "none"
        body.style.overflow = "auto"
        orderSection.style.display = "none"
        orderItemsArr.splice(0, orderItemsArr.length)
        generateOrderItems(orderItemsArr)

        menuArray.forEach(item => {
            item.quantity = 1
            item.quantityPrice = item.price
        })
        generatemenuItems()
    }, 2000)

}

function orderComplete() {
    modal.innerHTML = `
        <h1>Order Complete! Thankyou</h1>
    `
    modal.style.height = "150px"
    modal.style.backgroundColor = "#16DB99"
    modal.style.color = "white"

    resetOrder()
}

function calculateTotalPrice(itemsArr) {
    const totalPrice = itemsArr.reduce((price, item) => {
        if (item.quantity >= 1) {
            item.quantityPrice = item.price * item.quantity
            price += item.quantityPrice
        } else {
            price += item.price
        }
        return price
    }, 0)

    return totalPrice
}

function addOrderItem(itemId) {
    itemId = Number(itemId)
    const orderItem = menuArray.filter(item => {
        return item.id === itemId
    })[0]
    if (orderItemsArr.includes(orderItem)) {
        orderItem.quantity++
    } else {
        orderItemsArr.push(orderItem)
    }
    const totalPrice = calculateTotalPrice(orderItemsArr)
    generatemenuItems()
    generateOrderItems(orderItemsArr, totalPrice)
}

function removeOrderItem(itemId) {
    itemId = Number(itemId)
    let removedItemIndex = 0
    const removedItem = orderItemsArr.forEach((item, index) => {
        if (item.id === itemId) {
            item.quantity = 1
            item.quantityPrice = null
            removedItemIndex = index
        }
    })
    orderItemsArr.splice(removedItemIndex, 1)
    const totalPrice = calculateTotalPrice(orderItemsArr)
    generatemenuItems()
    generateOrderItems(orderItemsArr, totalPrice)
    if (orderItemsArr.length === 0) {
        orderSection.style.display = "none"
    }
}

function decrementQuantity(itemId) {
    itemId = Number(itemId)
    const orderItem = menuArray.filter(item => {
        return item.id === itemId
    })[0]
    orderItem.quantity--
    const totalPrice = calculateTotalPrice(orderItemsArr)
    generateOrderItems(orderItemsArr, totalPrice)
    generatemenuItems()
}

function generateModal() {
    modal.innerHTML = `
        <h2>Enter card details</h2>
		<input type="text" name="full-name" class="name-input" id="name-input" placeholder="Enter your name" required />
		<input type="tel" inputmode="numeric" pattern="[0-9\s]{13,19}" maxlength="19" name="card-number" class="card-input" id="card-input"
		 placeholder="xxxx xxxx xxxx xxxx" required />
		<input inputmode="numeric" maxlength="3" name="cvv" class="cvv-input" id="cvv-input" placeholder="Enter CVV" required />
		<button id="pay-btn" class="pay-btn">Pay</button>
    `
    modal.style.height = "90vh"
    modal.style.backgroundColor = "white"
    modal.style.color = "black"
}

function generateOrderItems(itemsArr, totalPrice) {
    let orderItemsHtml = ''
    itemsArr.forEach(item => {
        orderItemsHtml += `
        <div class="order-item">
			<h2 class="item-name">${item.name}</h2>
            <h4>${item.quantity > 1 ? "x" + item.quantity : ""}</h4>
            <button class="item-remove-btn" data-remove=${item.id}>remove</button>
			<h3 class="item-price">${item.quantityPrice ? item.quantityPrice : item.price} $</h3>
		</div>
    `
    })
    renderOrderItems(orderItemsHtml, totalPrice)
}

function generatemenuItems() {
    let menuItemsHtml = ''
    menuArray.forEach(item => {
        menuItemsHtml += `
            <div class="menu-item">
					<div class="menu-item-img">
						<img src=${item.image} />
					</div>
					<div class="menu-item-content">
						<h2>${item.name}</h2>
						<p>${item.ingredients.join(", ")}</p>
						<h3>${item.price} $</h3>
					</div>
					<div class="menu-item-btn">
						<button data-add=${item.id}>+</button>
                        <button class=${item.quantity === 1 ? "disabled" : ""} id="decrement-btn" data-decrement=${item.id}>-</button>
					</div>
			</div>
        `
    })
    renderMenuItems(menuItemsHtml)
}

function renderMenuItems(menuItems) {
    document.getElementById("menu-items-container").innerHTML = menuItems
}
function renderOrderItems(orderItems, totalPrice) {
    document.getElementById("order-items-container").innerHTML = orderItems
    document.getElementById("total-price").textContent = `${totalPrice} $`
}
generatemenuItems()