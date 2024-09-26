const PersonForm = ({ name, number, changeName, changeNumber, addPerson }) => {
    return (
    <form onSubmit={addPerson}>
        <div>
          name: <input value={name} onChange={changeName} />
        </div>
        <div>
          number: <input value={number} onChange={changeNumber} />
          </div>
        <div>
          <button type="submit">add</button>
        </div>
    </form>
    )
}

export default PersonForm