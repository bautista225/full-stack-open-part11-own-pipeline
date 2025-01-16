const Filter = ({ newSearch, handleSearchChange }) => {

    return (
        <div>
            filter shown with <input value={newSearch} onChange={handleSearchChange} />
        </div>
    )
}

export default Filter