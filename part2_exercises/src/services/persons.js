import axios from 'axios'
const baseUrl = 'http://localhost:3001/persons'

const getAll = () => {
    const request = axios.get(baseUrl)
    return request.then(response => response.data)
}

const create = newObject => {
    const request = axios.post(baseUrl, newObject)
    return request.then(response => response.data)
}

const updateNumber = (selectedObject, newObject) => {
    const request = axios.put(`${baseUrl}/${selectedObject.id}`, newObject)
    return request.then(response => response.data)
}

const deletePerson = selectedObject => {
    const request = axios.delete(`${baseUrl}/${selectedObject.id}`)
    return request.then(response => response.data)
}

export default { getAll, create, updateNumber, deletePerson }