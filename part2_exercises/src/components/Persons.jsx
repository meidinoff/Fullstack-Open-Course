const Persons = ({ persons, filter, deleteFunction }) => {
    
    let regex = new RegExp(String.raw`${filter}`, "gi")
    let filteredList = persons.filter(person => {
        if (filter === '') {
            return true
        } else {
            return person.name.match(regex)
        }
    })
    
    return (
        <div>
            {filteredList.map(person => {
                return (
                        <p key={person.name}>
                            {person.name} {person.number}
                            <button onClick={() => deleteFunction(person)}>delete</button>
                        </p>
                )
            })}
        </div>
    )
}

export default Persons