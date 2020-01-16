let restaurants = [
    {
        name: "Luigi's pizza",
        url: "www.pizza.fi",
        id: 1
    },
    {
        name: "Pizzeria Rax",
        url: "www.rax.fi",
        id: 2
    },
    {
        name: "Ravintola Artjärvi",
        url: "www.bestfood.fi",
        id: 3
    }
]

let id = 4

const newId = () => {
    id = id + 1
    return id
}

const getAll = () => {
    return restaurants
}

const add = (props) => {
    const newRestaurant = {
        name: props.name,
        url: props.url,
        id: newId()
    }

    restaurants = restaurants.concat(newRestaurant)
    return restaurants
}

const remove = (id) => {
    restaurants = restaurants.filter(r => r.id !== id)
    return restaurants
}

export default { getAll, add, remove }