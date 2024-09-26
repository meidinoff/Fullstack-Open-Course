const Filter = ({ filter, changeFilter }) => {
    

    return (
        <div>
            filter shown with <input value={filter} onChange={changeFilter} />
        </div>
    )
}

export default Filter